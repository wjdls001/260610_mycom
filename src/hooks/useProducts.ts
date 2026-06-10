import { useEffect, useState } from 'react'
import { getProducts } from '../lib/products'
import type { Product } from '../types'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    getProducts().then(({ data, error: fetchError }) => {
      if (!active) return
      if (fetchError) setError(fetchError.message)
      else setProducts(data ?? [])
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return { products, loading, error }
}
