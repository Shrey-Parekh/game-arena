import { supabase } from '../config/supabase.js'

export async function getRandomStatement(category = null, excludeIds = []) {
  try {
    let query = supabase.from('never_have_i_ever_statements').select('*')
    
    if (category) query = query.eq('category', category)
    if (excludeIds.length > 0) query = query.not('id', 'in', `(${excludeIds.join(',')})`)
    
    const { data, error } = await query.limit(20)
    if (error) throw error
    if (!data || data.length === 0) throw new Error('No statements available')
    
    const randomIndex = Math.floor(Math.random() * data.length)
    return { data: data[randomIndex], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}
