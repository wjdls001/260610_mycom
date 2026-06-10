import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { sendEmailOtp, verifyEmailOtp, completeOtpSignUp } from '../../lib/auth'

const OTP_COOLDOWN = 60

export const Signup = () => {
  const navigate = useNavigate()

  // step 1: email OTP
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // step 2: account details
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current)
    }
  }, [])

  const startCooldown = () => {
    setCooldown(OTP_COOLDOWN)
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSendOtp = async () => {
    if (!email) {
      setError('이메일을 입력해주세요.')
      return
    }
    setError(null)
    setLoading(true)
    const { error: sendError } = await sendEmailOtp(email)
    setLoading(false)
    if (sendError) {
      setError(sendError.message)
      return
    }
    setOtpSent(true)
    setOtp('')
    startCooldown()
  }

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setError('인증번호 6자리를 입력해주세요.')
      return
    }
    setError(null)
    setLoading(true)
    const { error: verifyError } = await verifyEmailOtp(email, otp)
    setLoading(false)
    if (verifyError) {
      setError('인증번호가 올바르지 않습니다.')
      return
    }
    setEmailVerified(true)
  }

  const handleSubmit = async (event: { preventDefault(): void }) => {
    event.preventDefault()
    setError(null)

    if (!emailVerified) {
      setError('이메일 인증을 완료해주세요.')
      return
    }
    if (nickname.trim().length === 0 || nickname.length > 30) {
      setError('닉네임은 1자 이상 30자 이하로 입력해주세요.')
      return
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)
    const { error: signUpError } = await completeOtpSignUp(nickname.trim(), password)
    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold text-gray-800">회원가입</h1>
      <p className="mt-2 text-sm text-gray-500">mycompany 계정을 생성하고 커뮤니티에 참여하세요.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {/* ── Step 1: 이메일 인증 ── */}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            이메일
          </label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              disabled={emailVerified}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setOtpSent(false) }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              disabled={loading || cooldown > 0 || emailVerified}
              onClick={handleSendOtp}
              className="shrink-0 whitespace-nowrap"
            >
              {emailVerified ? '인증 완료' : cooldown > 0 ? `재발송 (${cooldown}s)` : otpSent ? '재발송' : '인증번호 발송'}
            </Button>
          </div>
        </div>

        {otpSent && !emailVerified && (
          <div>
            <label htmlFor="otp" className="mb-1 block text-sm font-medium text-gray-700">
              인증번호
            </label>
            <div className="flex gap-2">
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="6자리 입력"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="flex-1"
              />
              <Button
                type="button"
                disabled={loading || otp.length < 6}
                onClick={handleVerifyOtp}
                className="shrink-0"
              >
                확인
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: 계정 정보 (이메일 인증 후 활성화) ── */}
        <div className={emailVerified ? '' : 'pointer-events-none opacity-40'}>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="nickname" className="mb-1 block text-sm font-medium text-gray-700">
                닉네임
              </label>
              <Input
                id="nickname"
                type="text"
                maxLength={30}
                disabled={!emailVerified}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                disabled={!emailVerified}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="mb-1 block text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <Input
                id="passwordConfirm"
                type="password"
                autoComplete="new-password"
                disabled={!emailVerified}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={loading || !emailVerified} className="w-full">
          {loading ? '처리 중...' : '회원가입 완료'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          로그인
        </Link>
      </p>
    </div>
  )
}
