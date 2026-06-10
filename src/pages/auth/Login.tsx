import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { signIn } from '../../lib/auth'

export const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: { preventDefault(): void }) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error: signInError } = await signIn(email, password, rememberMe)

    setSubmitting(false)

    if (signInError) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold text-gray-800">로그인</h1>
      <p className="mt-2 text-sm text-gray-500">mycompany 계정으로 로그인하세요.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            이메일
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            비밀번호
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 accent-primary"
          />
          <span className="text-sm text-gray-700">로그인 유지하기</span>
        </label>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        아직 계정이 없으신가요?{' '}
        <Link to="/signup" className="font-medium text-primary hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  )
}
