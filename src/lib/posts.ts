import { supabase } from './supabase'
import type { PostWithAuthor } from '../types'

const POST_SELECT = '*, users ( id, nickname, profile_image )'

export const PAGE_SIZE = 10

export const getPosts = async (boardId: number, page: number) => {
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error, count } = await supabase
    .from('posts')
    .select(POST_SELECT, { count: 'exact' })
    .eq('board_id', boardId)
    .order('created_at', { ascending: false })
    .range(from, to)

  return { data: data as PostWithAuthor[] | null, error, count: count ?? 0 }
}

export const getPost = async (postId: number) => {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('id', postId)
    .maybeSingle()

  return { data: data as PostWithAuthor | null, error }
}

interface PostInput {
  boardId: number
  userId: string
  title: string
  content: string
}

export const createPost = async ({ boardId, userId, title, content }: PostInput) => {
  const { data, error } = await supabase
    .from('posts')
    .insert({ board_id: boardId, user_id: userId, title, content })
    .select('id')
    .single()

  return { data, error }
}

export const updatePost = async (postId: number, title: string, content: string) => {
  const { error } = await supabase
    .from('posts')
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq('id', postId)

  return { error }
}

export const deletePost = async (postId: number) => {
  const { error } = await supabase.from('posts').delete().eq('id', postId)
  return { error }
}
