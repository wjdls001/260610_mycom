import { Link } from 'react-router-dom'

export const ContactComplete = () => (
  <div className="flex flex-col items-center gap-4 py-24 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-2xl text-success">
      ✓
    </span>
    <h1 className="text-2xl font-bold text-gray-800">문의가 접수되었습니다</h1>
    <p className="text-gray-500">빠른 시일 내에 담당자가 확인 후 답변드리겠습니다.</p>
    <Link
      to="/"
      className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
    >
      홈으로 돌아가기
    </Link>
  </div>
)
