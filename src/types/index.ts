export type UserRole = 'user' | 'admin'

export interface UserProfile {
  id: string
  email: string
  nickname: string
  phone: string | null
  zipcode: string | null
  address1: string | null
  address2: string | null
  profile_image: string | null
  introduction: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  category: string
  summary: string
  description: string
  price: number
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Board {
  id: number
  name: string
  description: string | null
  is_active: boolean
  created_at: string
}

export interface Post {
  id: number
  user_id: string
  board_id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface PostLike {
  post_id: number
  user_id: string
  created_at: string
}

export interface PostWithAuthor extends Post {
  users: Pick<UserProfile, 'id' | 'nickname' | 'profile_image'> | null
}
