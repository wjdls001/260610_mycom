import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export const Contact = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (name.trim().length === 0 || email.trim().length === 0 || message.trim().length === 0) {
      setError('모든 항목을 입력해주세요.')
      return
    }

    // 참고: DB 스키마에 문의 테이블이 없어 별도 저장 없이 완료 페이지로 이동합니다.
    // (docs/spec/spec-fixed.md "스키마 변경 필요 사항" 참고)
    navigate('/contact/complete', { replace: true })
  }

  return (
    <div className="mx-auto max-w-lg">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">온라인 문의</h1>
        <p className="mt-2 text-gray-500">궁금한 점을 남겨주시면 빠르게 답변드리겠습니다.</p>
      </header>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            이름
          </label>
          <Input id="name" required value={name} onChange={(event) => setName(event.target.value)} />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            이메일
          </label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">
            문의 내용
          </label>
          <textarea
            id="message"
            rows={6}
            required
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" className="w-full">
          문의 보내기
        </Button>
      </form>
    </div>
  )
}
