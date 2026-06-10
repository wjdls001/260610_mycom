import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { createProduct } from '../../lib/products'
import { useAuth } from '../../hooks/useAuth'

export const ProductWrite = () => {
  const navigate = useNavigate()
  const { profile } = useAuth()

  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (profile && profile.role !== 'admin') {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-gray-500">접근 권한이 없습니다.</p>
        <Button variant="ghost" onClick={() => navigate('/products')}>
          제품 목록으로
        </Button>
      </div>
    )
  }

  const handleSubmit = async (event: { preventDefault(): void }) => {
    event.preventDefault()
    setError(null)

    const priceNum = Number(price.replace(/[^0-9]/g, ''))
    if (!priceNum || priceNum <= 0) {
      setError('올바른 가격을 입력해주세요.')
      return
    }

    setSubmitting(true)
    const { data, error: createError } = await createProduct({
      name: name.trim(),
      category: category.trim(),
      summary: summary.trim(),
      description: description.trim(),
      price: priceNum,
    })
    setSubmitting(false)

    if (createError) {
      setError(createError.message)
      return
    }

    navigate(`/products/${data?.id}`, { replace: true })
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-gray-800">제품 등록</h1>
      <p className="mt-2 text-sm text-gray-500">관리자 전용 — 새 제품을 등록합니다.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            제품명
          </label>
          <Input
            id="name"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
            카테고리
          </label>
          <Input
            id="category"
            required
            maxLength={50}
            placeholder="예: 웨어러블, 운동기구, 영양, 서비스"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="summary" className="mb-1 block text-sm font-medium text-gray-700">
            요약{' '}
            <span className="font-normal text-gray-400">({summary.length}/200)</span>
          </label>
          <Input
            id="summary"
            required
            maxLength={200}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
            상세 설명
          </label>
          <textarea
            id="description"
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700">
            가격 (원)
          </label>
          <Input
            id="price"
            required
            inputMode="numeric"
            placeholder="89000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={() => navigate('/products')}
          >
            취소
          </Button>
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? '등록 중...' : '등록'}
          </Button>
        </div>
      </form>
    </div>
  )
}
