import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deletePost, getPost } from '../../lib/posts'
import { getLikeStatus, toggleLike } from '../../lib/likes'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '../../components/ui/Spinner'
import { Button } from '../../components/ui/Button'
import type { PostWithAuthor } from '../../types'

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

export const PostDetail = () => {
  const { boardId, id } = useParams<{ boardId: string; id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost] = useState<PostWithAuthor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [likeCount, setLikeCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)

  useEffect(() => {
    let active = true
    const postId = Number(id)
    if (!Number.isFinite(postId)) return

    setLoading(true)
    Promise.all([
      getPost(postId),
      getLikeStatus(postId, user?.id),
    ]).then(([{ data, error: fetchError }, likeStatus]) => {
      if (!active) return
      if (fetchError) {
        setError(fetchError.message)
      } else {
        setPost(data)
      }
      setLikeCount(likeStatus.count)
      setLiked(likeStatus.liked)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [id])

  const handleDelete = async () => {
    if (!post) return
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return

    setDeleting(true)
    const { error: deleteError } = await deletePost(post.id)
    setDeleting(false)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    navigate(`/board/${boardId}`, { replace: true })
  }

  if (loading) return <Spinner />

  if (error) {
    return <p className="py-12 text-center text-sm text-danger">게시글을 불러오지 못했습니다: {error}</p>
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-gray-500">존재하지 않는 게시글입니다.</p>
        <Link to={`/board/${boardId}`} className="text-sm font-medium text-primary hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    )
  }

  const isAuthor = user?.id === post.user_id

  const handleLike = async () => {
    if (!user) return
    setLikeLoading(true)
    const { error: likeError } = await toggleLike(post.id, user.id, liked)
    setLikeLoading(false)
    if (!likeError) {
      setLiked(!liked)
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link to={`/board/${boardId}`} className="text-sm text-gray-500 hover:text-primary">
        ← 목록으로
      </Link>

      <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-card">
        <header className="border-b border-gray-100 pb-4">
          <h1 className="text-xl font-bold text-gray-800">{post.title}</h1>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>{post.users?.nickname ?? '알 수 없음'}</span>
            <span>{formatDateTime(post.created_at)}</span>
          </div>
        </header>

        <div className="whitespace-pre-wrap pt-4 text-sm leading-relaxed text-gray-700">
          {post.content}
        </div>

        <div className="mt-4 flex items-center border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={handleLike}
            disabled={!user || likeLoading}
            title={user ? (liked ? '좋아요 취소' : '좋아요') : '로그인 후 좋아요를 누를 수 있습니다'}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`h-5 w-5 transition-colors ${liked ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-gray-400'}`}
              strokeWidth={1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span className={liked ? 'font-medium text-red-500' : 'text-gray-500'}>
              {likeCount}
            </span>
          </button>
        </div>
      </article>

      {isAuthor && (
        <div className="flex justify-end gap-2">
          <Link to={`/board/${boardId}/${post.id}/edit`}>
            <Button variant="secondary">수정</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? '삭제 중...' : '삭제'}
          </Button>
        </div>
      )}
    </div>
  )
}
