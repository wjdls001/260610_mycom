import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'

const NAV_ITEMS = [
  { label: '홈', to: '/' },
  { label: '회사소개', to: '/about' },
  { label: '제품소개', to: '/products' },
  { label: '게시판', to: '/board' },
  { label: '온라인 문의', to: '/contact' },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'text-primary' : 'text-gray-700 hover:text-primary',
  )

export const Header = () => {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const initials = profile?.nickname?.slice(0, 2).toUpperCase() ?? '?'

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-nav">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <NavLink to="/" className="text-lg font-bold text-primary">
          mycompany
        </NavLink>

        <nav className="hidden items-center gap-1 sm:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <NavLink
                to="/profile/edit"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-primary"
              >
                <span className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                  {profile?.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt={profile.nickname}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-500">
                      {initials}
                    </span>
                  )}
                </span>
                <span className="max-w-[80px] truncate">{profile?.nickname ?? user.email}</span>
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary"
              >
                로그아웃
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              로그인
            </NavLink>
          )}
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-gray-100 px-4 py-1 sm:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} className={navLinkClass} end={item.to === '/'}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
