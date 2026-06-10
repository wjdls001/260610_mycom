import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { usePosts } from '../../hooks/usePosts'
import { getBoard } from '../../lib/boards'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '../../components/ui/Spinner'
import { Button } from '../../components/ui/Button'
import type { Board } from '../../types'

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })

export const PostList = () => {
  const { boardId } = useParams<{ boardId: string }>()
  const boardIdNum = Number(boardId)
  const { user } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(0, Number(searchParams.get('page') ?? '0'))

  const [board, setBoard] = useState<Board | null>(null)
  const { posts, count, pageSize, loading, error } = usePosts(boardIdNum, page)

  useEffect(() => {
    let active = true
    if (!Number.isFinite(boardIdNum)) return

    getBoard(boardIdNum).then(({ data }) => {
      if (active) setBoard(data)
    })

    return () => {
      active = false
    }
  }, [boardIdNum])

  const totalPages = Math.max(1, Math.ceil(count / pageSize))

  const goToPage = (next: number) => {
    setSearchParams(next === 0 ? {} : { page: String(next) })
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/board" className="text-sm text-gray-500 hover:text-primary">
            ← 게시판 목록
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-800">{board?.name ?? '게시글 목록'}</h1>
          {board?.description && <p className="mt-1 text-sm text-gray-500">{board.description}</p>}
        </div>

        {user && (
          <Link to={`/board/${boardId}/write`}>
            <Button>글쓰기</Button>
          </Link>
        )}
      </header>

      {loading && <Spinner />}

      {error && <p className="py-12 text-center text-sm text-danger">게시글을 불러오지 못했습니다: {error}</p>}

      {!loading && !error && (
        <>
          <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-card">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  to={`/board/${boardId}/${post.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-800">{post.title}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {post.users?.nickname ?? '알 수 없음'} · {formatDate(post.created_at)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}

            {posts.length === 0 && (
              <li className="px-5 py-12 text-center text-sm text-gray-500">등록된 게시글이 없습니다.</li>
            )}
          </ul>

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => goToPage(p)}
                  className={
                    p === page
                      ? 'rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white'
                      : 'rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100'
                  }
                >
                  {p + 1}
                </button>
              ))}
            </nav>
          )}
        </>
      )}
    </div>
  )
}
