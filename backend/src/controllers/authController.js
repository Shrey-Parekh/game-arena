import { supabase } from '../config/supabase.js'

export async function verifyToken(token) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error) {
      throw new Error('Invalid token')
    }
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return user
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`)
  }
}
