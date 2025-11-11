import { supabase } from '../config/supabase.js'

/**
 * Get a random prompt pair for the Imposter game
 * @param {Array<string>} excludeIds - Array of prompt IDs to exclude
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
export async function getRandomPromptPair(excludeIds = []) {
  try {
    console.log('🔍 Fetching random prompt pair, excluding:', excludeIds.length, 'prompts')
    
    let query = supabase
      .from('imposter_prompts')
      .select('*')

    // Exclude already used prompts
    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`)
    }

    const { data, error } = await query.limit(20)

    if (error) throw error
    
    if (!data || data.length === 0) {
      // If no prompts available (all used), reset and get any prompt
      console.log('⚠️ No unused prompts, fetching from all prompts')
      const { data: allData, error: allError } = await supabase
        .from('imposter_prompts')
        .select('*')
        .limit(20)
      
      if (allError) throw allError
      if (!allData || allData.length === 0) {
        throw new Error('No prompts available in database')
      }
      
      const randomIndex = Math.floor(Math.random() * allData.length)
      console.log('✅ Returning prompt (reset pool):', allData[randomIndex].id)
      return { data: allData[randomIndex], error: null }
    }

    // Return random prompt from available prompts
    const randomIndex = Math.floor(Math.random() * data.length)
    console.log('✅ Returning prompt:', data[randomIndex].id, '- Category:', data[randomIndex].category)
    return { data: data[randomIndex], error: null }
    
  } catch (error) {
    console.error('❌ Error fetching prompt pair:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Get random prompt pairs filtered by category
 * @param {string} category - Category to filter by
 * @param {Array<string>} excludeIds - Array of prompt IDs to exclude
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
export async function getPromptsByCategory(category, excludeIds = []) {
  try {
    console.log('🔍 Fetching prompt pair for category:', category)
    
    let query = supabase
      .from('imposter_prompts')
      .select('*')
      .eq('category', category)

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`)
    }

    const { data, error } = await query.limit(10)

    if (error) throw error
    
    if (!data || data.length === 0) {
      console.log('⚠️ No prompts in category, falling back to random')
      return getRandomPromptPair(excludeIds)
    }

    const randomIndex = Math.floor(Math.random() * data.length)
    console.log('✅ Returning category prompt:', data[randomIndex].id)
    return { data: data[randomIndex], error: null }
    
  } catch (error) {
    console.error('❌ Error fetching category prompts:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Get all available prompts (for admin/testing purposes)
 * @returns {Promise<{data: Array|null, error: string|null}>}
 */
export async function getAllPrompts() {
  try {
    const { data, error } = await supabase
      .from('imposter_prompts')
      .select('*')
      .order('category', { ascending: true })

    if (error) throw error
    
    console.log('✅ Retrieved all prompts:', data?.length || 0)
    return { data, error: null }
    
  } catch (error) {
    console.error('❌ Error fetching all prompts:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Get prompts by difficulty level
 * @param {string} difficulty - Difficulty level ('easy', 'medium', 'hard')
 * @param {Array<string>} excludeIds - Array of prompt IDs to exclude
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
export async function getPromptsByDifficulty(difficulty, excludeIds = []) {
  try {
    console.log('🔍 Fetching prompt pair for difficulty:', difficulty)
    
    let query = supabase
      .from('imposter_prompts')
      .select('*')
      .eq('difficulty', difficulty)

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`)
    }

    const { data, error } = await query.limit(10)

    if (error) throw error
    
    if (!data || data.length === 0) {
      console.log('⚠️ No prompts for difficulty, falling back to random')
      return getRandomPromptPair(excludeIds)
    }

    const randomIndex = Math.floor(Math.random() * data.length)
    console.log('✅ Returning difficulty prompt:', data[randomIndex].id)
    return { data: data[randomIndex], error: null }
    
  } catch (error) {
    console.error('❌ Error fetching difficulty prompts:', error)
    return { data: null, error: error.message }
  }
}
