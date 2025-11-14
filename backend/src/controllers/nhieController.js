import { supabase } from '../config/supabase.js'

/**
 * Get a random statement with retry logic
 * @param {Array<string>} categories - Active category filters
 * @param {Array<string>} excludeIds - Already used statement IDs
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
async function getStatementWithRetry(categories = [], excludeIds = [], retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await getRandomStatement(categories, excludeIds)
      if (result.data) return result
    } catch (error) {
      console.error(`❌ Attempt ${i + 1}/${retries} failed:`, error.message)
      if (i === retries - 1) {
        return { data: null, error: error.message }
      }
      // Wait before retrying (1s, 2s, 3s)
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  return { data: null, error: 'Max retries exceeded' }
}

/**
 * Get random statement filtered by categories
 * @param {Array<string>} categories - Active category filters (e.g., ['pg', 'funny'])
 * @param {Array<string>} excludeIds - Already used statement IDs
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
export async function getRandomStatement(categories = [], excludeIds = []) {
  try {
    console.log('🔍 Fetching random NHIE statement')
    console.log('   Categories:', categories.length > 0 ? categories.join(', ') : 'all')
    console.log('   Excluding:', excludeIds.length, 'statements')
    
    let query = supabase
      .from('never_have_i_ever_statements')
      .select('*')

    // Filter by categories if provided
    if (categories.length > 0) {
      query = query.in('category', categories)
    }

    // Exclude already used statements
    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`)
    }

    const { data, error } = await query.limit(20)

    if (error) throw error
    
    // If no statements available (all used), reset pool and try again
    if (!data || data.length === 0) {
      console.log('⚠️ No unused statements, resetting pool')
      
      let resetQuery = supabase
        .from('never_have_i_ever_statements')
        .select('*')
      
      if (categories.length > 0) {
        resetQuery = resetQuery.in('category', categories)
      }
      
      const { data: allData, error: allError } = await resetQuery.limit(20)
      
      if (allError) throw allError
      if (!allData || allData.length === 0) {
        throw new Error('No statements available in database')
      }
      
      const randomIndex = Math.floor(Math.random() * allData.length)
      console.log('✅ Returning statement (reset pool):', allData[randomIndex].id)
      return { data: allData[randomIndex], error: null }
    }

    // Return random statement from available statements
    const randomIndex = Math.floor(Math.random() * data.length)
    console.log('✅ Returning statement:', data[randomIndex].id, '- Category:', data[randomIndex].category)
    return { data: data[randomIndex], error: null }
    
  } catch (error) {
    console.error('❌ Error fetching NHIE statement:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Get statement by specific category
 * @param {string} category - Category to filter ('pg', 'adult', 'funny', 'deep')
 * @param {Array<string>} excludeIds - Already used statement IDs
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
export async function getStatementByCategory(category, excludeIds = []) {
  try {
    console.log('🔍 Fetching NHIE statement for category:', category)
    
    let query = supabase
      .from('never_have_i_ever_statements')
      .select('*')
      .eq('category', category)

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`)
    }

    const { data, error } = await query.limit(10)

    if (error) throw error
    
    if (!data || data.length === 0) {
      console.log('⚠️ No statements in category, falling back to random')
      return getRandomStatement([category], excludeIds)
    }

    const randomIndex = Math.floor(Math.random() * data.length)
    console.log('✅ Returning category statement:', data[randomIndex].id)
    return { data: data[randomIndex], error: null }
    
  } catch (error) {
    console.error('❌ Error fetching category statement:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Get all available statements (for admin/testing purposes)
 * @returns {Promise<{data: Array|null, error: string|null}>}
 */
export async function getAllStatements() {
  try {
    const { data, error } = await supabase
      .from('never_have_i_ever_statements')
      .select('*')
      .order('category', { ascending: true })

    if (error) throw error
    
    console.log('✅ Retrieved all NHIE statements:', data?.length || 0)
    return { data, error: null }
    
  } catch (error) {
    console.error('❌ Error fetching all statements:', error)
    return { data: null, error: error.message }
  }
}

// Export the retry wrapper as the main function
export { getStatementWithRetry }
