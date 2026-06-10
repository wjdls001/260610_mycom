import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { updateProfile, uploadAvatar, deleteAvatar } from '../../lib/profile'
import { useAuth } from '../../hooks/useAuth'

const ACCEPTED = 'image/jpeg,image/png,image/gif,image/webp'
const MAX_BYTES = 5 * 1024 * 1024 // 5MB

export const ProfileEdit = () => {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 아바타
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarDeleting, setAvatarDeleting] = useState(false)

  // 연락처·주소
  const [phone, setPhone] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (profile) {
      setPhone(profile.phone ?? '')
      setZipcode(profile.zipcode ?? '')
      setAddress1(profile.address1 ?? '')
      setAddress2(profile.address2 ?? '')
    }
  }, [profile])

  // ─── 아바타 ───────────────────────────────────────────

  const currentAvatar = previewUrl ?? profile?.profile_image ?? null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    if (file.size > MAX_BYTES) {
      setError('이미지 파일은 5MB 이하여야 합니다.')
      return
    }

    setError(null)
    setAvatarUploading(true)

    // 미리보기
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    const { url, error: uploadError } = await uploadAvatar(profile.id, file)
    setAvatarUploading(false)

    if (uploadError) {
      setError(uploadError.message)
      setPreviewUrl(null)
      URL.revokeObjectURL(objectUrl)
      return
    }

    // 저장된 URL로 교체 (캐시 버스팅)
    URL.revokeObjectURL(objectUrl)
    setPreviewUrl(url ? `${url}?t=${Date.now()}` : null)
    await refreshProfile()
  }

  const handleDeleteAvatar = async () => {
    if (!profile?.profile_image || avatarDeleting) return
    setError(null)
    setAvatarDeleting(true)
    const { error: delError } = await deleteAvatar(profile.id, profile.profile_image)
    setAvatarDeleting(false)
    if (delError) {
      setError(delError.message)
      return
    }
    setPreviewUrl(null)
    await refreshProfile()
  }

  // ─── 프로필 저장 ──────────────────────────────────────

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    if (phone && !/^[0-9\-+\s()]{7,20}$/.test(phone)) {
      setError('올바른 전화번호 형식을 입력해주세요.')
      return
    }

    if (zipcode && !/^\d{5}$/.test(zipcode)) {
      setError('우편번호는 5자리 숫자로 입력해주세요.')
      return
    }

    if (!profile) return

    setSubmitting(true)
    const { error: updateError } = await updateProfile(profile.id, {
      phone: phone.trim() || null,
      zipcode: zipcode.trim() || null,
      address1: address1.trim() || null,
      address2: address2.trim() || null,
    })
    setSubmitting(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    await refreshProfile()
    setSuccess(true)
  }

  // ─── 아바타 표시 헬퍼 ────────────────────────────────

  const initials = profile?.nickname?.slice(0, 2).toUpperCase() ?? '?'

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-gray-800">회원정보 수정</h1>
      <p className="mt-2 text-sm text-gray-500">프로필 사진과 연락처·주소를 수정할 수 있습니다.</p>

      {/* ── 아바타 섹션 ── */}
      <div className="mt-6 flex flex-col items-center gap-3">
        {/* 아바타 원형 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            className="group relative h-24 w-24 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            title="프로필 사진 변경"
          >
            {currentAvatar ? (
              <img
                src={currentAvatar}
                alt="프로필 사진"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-gray-500">
                {initials}
              </span>
            )}
            {/* hover 오버레이 */}
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            {avatarUploading && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50">
                <svg className="h-6 w-6 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </span>
            )}
          </button>

          {/* 삭제 버튼 (아바타 있을 때만) */}
          {(currentAvatar || profile?.profile_image) && !avatarUploading && (
            <button
              type="button"
              onClick={handleDeleteAvatar}
              disabled={avatarDeleting}
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 disabled:opacity-50"
              title="프로필 사진 삭제"
            >
              {avatarDeleting ? (
                <svg className="h-3 w-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400">JPG, PNG, GIF, WEBP · 최대 5MB</p>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* ── 연락처·주소 폼 ── */}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
            전화번호
          </label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="010-0000-0000"
            maxLength={20}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-gray-700">주소</legend>
          <div className="flex flex-col gap-2">
            <div className="w-32">
              <Input
                id="zipcode"
                type="text"
                inputMode="numeric"
                placeholder="우편번호"
                maxLength={5}
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
              />
            </div>
            <Input
              id="address1"
              type="text"
              placeholder="기본주소 (예: 서울특별시 강남구 테헤란로 123)"
              maxLength={200}
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
            <Input
              id="address2"
              type="text"
              placeholder="상세주소 (예: 101동 202호)"
              maxLength={200}
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </div>
        </fieldset>

        {error && <p className="text-sm text-danger">{error}</p>}
        {success && <p className="text-sm text-green-600">저장되었습니다.</p>}

        <div className="flex gap-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? '저장 중...' : '저장'}
          </Button>
        </div>
      </form>
    </div>
  )
}
