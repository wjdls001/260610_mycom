import { AboutTabs } from '../../components/layout/AboutTabs'

const DEPARTMENTS = [
  { name: '대표이사', desc: '전사 전략 및 경영 총괄' },
  { name: '서비스기획팀', desc: '제품 기획 및 사용자 경험 설계' },
  { name: '개발팀', desc: '플랫폼 개발 및 인프라 운영' },
  { name: '운영팀', desc: '커뮤니티 운영 및 고객 지원' },
  { name: '마케팅팀', desc: '브랜드 및 성장 마케팅' },
]

export const Organization = () => (
  <div className="flex flex-col gap-6">
    <header>
      <h1 className="text-2xl font-bold text-gray-800">회사소개</h1>
      <p className="mt-2 text-gray-500">mycompany의 조직 구성을 소개합니다.</p>
    </header>

    <AboutTabs />

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {DEPARTMENTS.map((dept) => (
        <div key={dept.name} className="rounded-lg border border-gray-200 bg-white p-5 shadow-card">
          <h2 className="font-semibold text-gray-800">{dept.name}</h2>
          <p className="mt-2 text-sm text-gray-500">{dept.desc}</p>
        </div>
      ))}
    </div>
  </div>
)
