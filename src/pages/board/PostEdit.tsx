import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PostForm } from '../../components/board/PostForm'
import { getPost, updatePost } from '../../lib/posts'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '../../components/ui/Spinner'
import type { PostWithAuthor } from '../../types'

export const PostEdit = () => {
  const { boardId, id } = useParams<{ boardId: string; id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost] = useState<PostWithAuthor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const postId = Number(id)
    if (!Number.isFinite(postId)) return

    setLoading(true)
    getPost(postId).then(({ data, error: fetchError }) => {
      if (!active) return
      if (fetchError) {
        setError(fetchError.message)
      } else {
        setPost(data)
      }
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [id])

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

  if (user?.id !== post.user_id) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-gray-500">본인이 작성한 게시글만 수정할 수 있습니다.</p>
        <Link to={`/board/${boardId}/${post.id}`} className="text-sm font-medium text-primary hover:underline">
          게시글로 돌아가기
        </Link>
      </div>
    )
  }

  const handleSubmit = async (title: string, content: string) => {
    const { error: updateError } = await updatePost(post.id, title, content)

    if (updateError) {
      return updateError.message
    }

    navigate(`/board/${boardId}/${post.id}`, { replace: true })
    return null
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">게시글 수정</h1>
      </header>

      <PostForm
        initialTitle={post.title}
        initialContent={post.content}
        submitLabel="수정"
        submittingLabel="수정 중..."
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/board/${boardId}/${post.id}`)}
      />
    </div>
  )
}
