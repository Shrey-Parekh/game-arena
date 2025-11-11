import { supabase } from '../config/supabase.js'

const EXCLUDED_CHARS = ['0', 'O', '1', 'I', 'L']
const VALID_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function generateRoomCode() {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += VALID_CHARS[Math.floor(Math.random() * VALID_CHARS.length)]
  }
  return code
}

export async function createUniqueRoomCode() {
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    const code = generateRoomCode()
    
    // Check if code exists in database
    const { data, error } = await supabase
      .from('rooms')
      .select('room_code')
      .eq('room_code', code)
      .single()
    
    // If no data found, code is unique
    if (!data && error?.code === 'PGRST116') {
      return code
    }
    
    attempts++
  }
  
  throw new Error('Failed to generate unique room code after ' + maxAttempts + ' attempts')
}
