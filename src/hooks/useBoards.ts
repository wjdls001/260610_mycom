import { useEffect, useState } from 'react'
import { getBoards } from '../lib/boards'
import type { Board } from '../types'

export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    setLoading(true)
    getBoards().then(({ data, error: fetchError }) => {
      if (!active) return
      if (fetchError) {
        setError(fetchError.message)
      } else {
        setBoards(data ?? [])
      }
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  return { boards, loading, error }
}
