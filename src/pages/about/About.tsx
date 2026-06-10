import { AboutTabs } from '../../components/layout/AboutTabs'

export const About = () => (
  <div className="flex flex-col gap-6">
    <header>
      <h1 className="text-2xl font-bold text-gray-800">회사소개</h1>
      <p className="mt-2 text-gray-500">mycompany를 소개합니다.</p>
    </header>

    <AboutTabs />

    <section className="flex flex-col gap-4 text-sm leading-relaxed text-gray-700">
      <p>
        mycompany는 누구나 쉽고 즐겁게 운동을 시작하고 꾸준히 이어갈 수 있도록 돕는 운동 커뮤니티
        플랫폼입니다. 운동 인증, 정보 공유, 번개 모임 등 다양한 활동을 통해 함께 성장하는 문화를
        만들어 갑니다.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-card">
          <h2 className="font-semibold text-gray-800">미션</h2>
          <p className="mt-2 text-gray-500">건강한 습관을 만드는 가장 쉬운 방법을 제공합니다.</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-card">
          <h2 className="font-semibold text-gray-800">비전</h2>
          <p className="mt-2 text-gray-500">운동으로 연결된 가장 신뢰받는 커뮤니티가 됩니다.</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-card">
          <h2 className="font-semibold text-gray-800">핵심 가치</h2>
          <p className="mt-2 text-gray-500">꾸준함, 공유, 그리고 함께하는 즐거움.</p>
        </div>
      </div>
    </section>
  </div>
)
