import { Link } from 'react-router-dom'
import { useBoards } from '../../hooks/useBoards'
import { Spinner } from '../../components/ui/Spinner'

export const BoardList = () => {
  const { boards, loading, error } = useBoards()

  if (loading) return <Spinner />

  if (error) {
    return <p className="py-12 text-center text-sm text-danger">게시판 목록을 불러오지 못했습니다: {error}</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">게시판</h1>
        <p className="mt-2 text-gray-500">관심 있는 주제의 게시판을 선택해보세요.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {boards.map((board) => (
          <Link
            key={board.id}
            to={`/board/${board.id}`}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-card transition-shadow hover:shadow-modal"
          >
            <h2 className="font-semibold text-gray-800">{board.name}</h2>
            {board.description && <p className="mt-2 text-sm text-gray-500">{board.description}</p>}
          </Link>
        ))}

        {boards.length === 0 && (
          <p className="text-sm text-gray-500">표시할 게시판이 없습니다.</p>
        )}
      </div>
    </div>
  )
}
