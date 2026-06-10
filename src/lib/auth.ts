import { supabase } from './supabase'

export const sendEmailOtp = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({ email })
  return { error }
}

export const verifyEmailOtp = async (email: string, token: string) => {
  const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
  return { error }
}

export const completeOtpSignUp = async (nickname: string, password: string) => {
  const { error: pwError } = await supabase.auth.updateUser({ password })
  if (pwError) return { error: pwError }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { error: new Error('사용자 정보를 찾을 수 없습니다.') }

  const { error: profileError } = await supabase.from('users').upsert({
    id: user.id,
    email: user.email,
    nickname,
  })
  return { error: profileError }
}

interface SignUpParams {
  email: string
  password: string
  nickname: string
}

export const signUp = async ({ email, password, nickname }: SignUpParams) => {
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error }
  }

  const userId = data.user?.id

  if (!userId) {
    return { error: null }
  }

  const { error: profileError } = await supabase.from('users').insert({
    id: userId,
    email,
    nickname,
  })

  if (profileError) {
    return { error: profileError }
  }

  return { error: null }
}

const REMEMBER_KEY = 'auth_remember_me'

export const signIn = async (email: string, password: string, rememberMe = true) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (!error) {
    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, '1')
    } else {
      localStorage.removeItem(REMEMBER_KEY)
      sessionStorage.setItem(REMEMBER_KEY, '0')
    }
  }
  return { error }
}

export const clearRememberMe = () => {
  localStorage.removeItem(REMEMBER_KEY)
  sessionStorage.removeItem(REMEMBER_KEY)
}

export const shouldAutoSignOut = () => {
  const inLocalStorage = localStorage.getItem(REMEMBER_KEY)
  const inSessionStorage = sessionStorage.getItem(REMEMBER_KEY)
  // 세션은 있으나, remember=1도 아니고 현 브라우저 세션에서 로그인한 기록도 없으면 → 자동 로그아웃
  return inLocalStorage !== '1' && inSessionStorage === null
}
