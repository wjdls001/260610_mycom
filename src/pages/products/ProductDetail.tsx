import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct } from '../../lib/products'
import { Spinner } from '../../components/ui/Spinner'
import type { Product } from '../../types'

const formatPrice = (price: number) => `${price.toLocaleString('ko-KR')}원`

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const numId = Number(id)
    if (!id || isNaN(numId)) {
      setNotFound(true)
      setLoading(false)
      return
    }
    let active = true
    getProduct(numId).then(({ data, error }) => {
      if (!active) return
      if (error || !data) setNotFound(true)
      else setProduct(data)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-gray-500">존재하지 않는 제품입니다.</p>
        <Link to="/products" className="text-sm font-medium text-primary hover:underline">
          제품 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link to="/products" className="text-sm text-gray-500 hover:text-primary">
        ← 제품 목록
      </Link>

      <div>
        <span className="w-fit rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
          {product.category}
        </span>
        <h1 className="mt-3 text-2xl font-bold text-gray-800">{product.name}</h1>
        <p className="mt-2 text-lg font-semibold text-primary">{formatPrice(product.price)}</p>
      </div>

      <p className="leading-relaxed text-gray-700">{product.description}</p>

      <Link
        to="/contact"
        className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
      >
        제품 문의하기
      </Link>
    </div>
  )
}
