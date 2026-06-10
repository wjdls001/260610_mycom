import { Link } from 'react-router-dom'

export const NotFound = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
    <p className="text-sm font-semibold text-primary">404</p>
    <h1 className="text-2xl font-bold text-gray-800">페이지를 찾을 수 없습니다</h1>
    <p className="text-gray-500">요청하신 주소가 변경되었거나 존재하지 않는 페이지입니다.</p>
    <Link
      to="/"
      className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
    >
      홈으로 돌아가기
    </Link>
  </div>
)
