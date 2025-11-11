import { supabase } from '../config/supabase.js'
import { createUniqueRoomCode } from '../utils/roomCodeGenerator.js'

export async function createRoomInDB(hostId, mode) {
  try {
    const roomCode = await createUniqueRoomCode()
    const maxPlayers = mode === '2-player' ? 2 : 6

    const { data, error } = await supabase
      .from('rooms')
      .insert({
        room_code: roomCode,
        host_id: hostId,
        mode,
        max_players: maxPlayers,
        status: 'waiting'
      })
      .select()
      .single()

    if (error) throw error

    // Add host as first player
    await addPlayerToDB(data.id, hostId, true)

    return { data, error: null }
  } catch (error) {
    console.error('Error creating room:', error)
    return { data: null, error: error.message }
  }
}

export async function getRoomFromDB(roomCode) {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_code', roomCode)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function addPlayerToDB(roomId, userId, isHost = false) {
  try {
    const { data, error } = await supabase
      .from('room_players')
      .insert({
        room_id: roomId,
        user_id: userId,
        is_host: isHost
      })
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export async function removePlayerFromDB(roomId, userId) {
  try {
    const { error } = await supabase
      .from('room_players')
      .delete()
      .eq('room_id', roomId)
      .eq('user_id', userId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

export async function updateRoomStatus(roomId, status) {
  try {
    const { error } = await supabase
      .from('rooms')
      .update({ status })
      .eq('id', roomId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

export async function deleteExpiredRooms() {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('room_code')

    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error deleting expired rooms:', error)
    return { data: [], error: error.message }
  }
}
