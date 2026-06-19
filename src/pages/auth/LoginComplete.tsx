import { Link } from 'react-router-dom'

export const LoginComplete = () => (
  <div className="flex flex-col items-center gap-4 py-24 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-2xl text-success">
      ✓
    </span>
    <h1 className="text-2xl font-bold text-gray-800">로그인이 완료되었습니다</h1>
    <p className="text-gray-500">환영합니다. 이제 모든 서비스를 이용하실 수 있습니다.</p>
    <Link
      to="/"
      className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
    >
      홈으로 이동
    </Link>
  </div>
)
