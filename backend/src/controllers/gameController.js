import { supabase } from '../config/supabase.js'

export async function getRandomQuestion(type, spiceLevel, excludeIds = []) {
  try {
    let query = supabase
      .from('truth_or_dare_questions')
      .select('*')
      .eq('type', type)
      .eq('spice_level', spiceLevel)

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`)
    }

    const { data, error } = await query.limit(10)

    if (error) throw error
    if (!data || data.length === 0) {
      throw new Error('No questions available')
    }

    // Return random question from results
    const randomIndex = Math.floor(Math.random() * data.length)
    return { data: data[randomIndex], error: null }
  } catch (error) {
    console.error('Error fetching question:', error)
    return { data: null, error: error.message }
  }
}

export async function createGameSession(roomId, gameType) {
  try {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        room_id: roomId,
        game_type: gameType,
        game_data: {}
      })
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating game session:', error)
    return { data: null, error: error.message }
  }
}

export async function updateGameSession(sessionId, gameData, winnerId = null) {
  try {
    const updates = {
      game_data: gameData
    }

    if (winnerId) {
      updates.winner_id = winnerId
      updates.ended_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('game_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating game session:', error)
    return { data: null, error: error.message }
  }
}
