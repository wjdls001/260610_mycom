import { useNavigate, useParams } from 'react-router-dom'
import { PostForm } from '../../components/board/PostForm'
import { createPost } from '../../lib/posts'
import { useAuth } from '../../hooks/useAuth'

export const PostWrite = () => {
  const { boardId } = useParams<{ boardId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSubmit = async (title: string, content: string) => {
    if (!user) return '로그인이 필요합니다.'

    const boardIdNum = Number(boardId)
    const { data, error } = await createPost({ boardId: boardIdNum, userId: user.id, title, content })

    if (error) {
      return error.message
    }

    navigate(`/board/${boardId}/${data?.id}`, { replace: true })
    return null
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">게시글 작성</h1>
      </header>

      <PostForm
        submitLabel="등록"
        submittingLabel="등록 중..."
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/board/${boardId}`)}
      />
    </div>
  )
}
