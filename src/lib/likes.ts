import { supabase } from './supabase'

export const getLikeStatus = async (postId: number, userId?: string) => {
  const { count, error: countError } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)

  if (countError) return { count: 0, liked: false, error: countError }

  let liked = false
  if (userId) {
    const { data } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle()
    liked = !!data
  }

  return { count: count ?? 0, liked, error: null }
}

export const toggleLike = async (postId: number, userId: string, liked: boolean) => {
  if (liked) {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
    return { error }
  }

  const { error } = await supabase
    .from('post_likes')
    .insert({ post_id: postId, user_id: userId })
  return { error }
}
