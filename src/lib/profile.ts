import { supabase } from './supabase'

export interface UpdateProfileParams {
  phone?: string | null
  zipcode?: string | null
  address1?: string | null
  address2?: string | null
  nickname?: string
  introduction?: string | null
}

export const updateProfile = async (userId: string, params: UpdateProfileParams) => {
  const { error } = await supabase
    .from('users')
    .update({ ...params, updated_at: new Date().toISOString() })
    .eq('id', userId)

  return { error }
}

export const uploadAvatar = async (userId: string, file: File) => {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) return { url: null, error: uploadError }

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)

  const { error: updateError } = await supabase
    .from('users')
    .update({ profile_image: data.publicUrl, updated_at: new Date().toISOString() })
    .eq('id', userId)

  return { url: data.publicUrl, error: updateError }
}

export const deleteAvatar = async (userId: string, imageUrl: string) => {
  const match = imageUrl.match(/avatars\/(.+?)(\?|$)/)
  const path = match ? match[1] : `${userId}/avatar`

  const { error: storageError } = await supabase.storage.from('avatars').remove([path])
  if (storageError) return { error: storageError }

  const { error: updateError } = await supabase
    .from('users')
    .update({ profile_image: null, updated_at: new Date().toISOString() })
    .eq('id', userId)

  return { error: updateError }
}
