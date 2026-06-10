import { useEffect, useState } from 'react'
import { getPosts, PAGE_SIZE } from '../lib/posts'
import type { PostWithAuthor } from '../types'

export const usePosts = (boardId: number, page: number) => {
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    setLoading(true)
    getPosts(boardId, page).then(({ data, error: fetchError, count: total }) => {
      if (!active) return
      if (fetchError) {
        setError(fetchError.message)
      } else {
        setPosts(data ?? [])
        setCount(total)
      }
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [boardId, page])

  return { posts, count, pageSize: PAGE_SIZE, loading, error }
}
