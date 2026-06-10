import { supabase } from './supabase'
import type { Board } from '../types'

export const getBoards = async () => {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: true })

  return { data: data as Board[] | null, error }
}

export const getBoard = async (boardId: number) => {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('id', boardId)
    .maybeSingle()

  return { data: data as Board | null, error }
}
