import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'

const TABS = [
  { label: '회사 개요', to: '/about', end: true },
  { label: '연혁', to: '/about/history', end: false },
  { label: '조직도', to: '/about/organization', end: false },
  { label: '오시는 길', to: '/about/location', end: false },
]

export const AboutTabs = () => (
  <nav className="flex gap-2 border-b border-gray-200">
    {TABS.map((tab) => (
      <NavLink
        key={tab.to}
        to={tab.to}
        end={tab.end}
        className={({ isActive }) =>
          cn(
            '-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-800',
          )
        }
      >
        {tab.label}
      </NavLink>
    ))}
  </nav>
)
