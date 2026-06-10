import { supabase } from './supabase'
import type { Product } from '../types'

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  return { data: data as Product[] | null, error }
}

export const getProduct = async (id: number) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  return { data: data as Product | null, error }
}

export interface CreateProductParams {
  name: string
  category: string
  summary: string
  description: string
  price: number
  image_url?: string | null
}

export const createProduct = async (params: CreateProductParams) => {
  const { data, error } = await supabase
    .from('products')
    .insert(params)
    .select()
    .single()
  return { data: data as Product | null, error }
}
