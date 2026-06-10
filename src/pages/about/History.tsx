import { AboutTabs } from '../../components/layout/AboutTabs'

const HISTORY = [
  { year: '2026', items: ['커뮤니티 게시판 오픈', '회원 1만 명 달성'] },
  { year: '2025', items: ['mycompany 법인 설립', '베타 서비스 출시'] },
  { year: '2024', items: ['서비스 기획 시작'] },
]

export const History = () => (
  <div className="flex flex-col gap-6">
    <header>
      <h1 className="text-2xl font-bold text-gray-800">회사소개</h1>
      <p className="mt-2 text-gray-500">mycompany의 발자취를 소개합니다.</p>
    </header>

    <AboutTabs />

    <ol className="flex flex-col gap-6">
      {HISTORY.map((entry) => (
        <li key={entry.year} className="flex gap-6">
          <div className="w-16 shrink-0 text-lg font-bold text-primary">{entry.year}</div>
          <ul className="flex flex-col gap-1 border-l border-gray-200 pl-6 text-sm text-gray-700">
            {entry.items.map((item) => (
              <li key={item} className="relative before:absolute before:-left-[26px] before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary">
                {item}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  </div>
)
