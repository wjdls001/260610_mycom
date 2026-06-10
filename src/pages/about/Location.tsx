import { AboutTabs } from '../../components/layout/AboutTabs'

export const Location = () => (
  <div className="flex flex-col gap-6">
    <header>
      <h1 className="text-2xl font-bold text-gray-800">회사소개</h1>
      <p className="mt-2 text-gray-500">mycompany를 찾아오시는 길을 안내합니다.</p>
    </header>

    <AboutTabs />

    <div className="flex flex-col gap-4">
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-sm text-gray-400">
        지도 영역 (지도 API 연동 예정)
      </div>

      <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-gray-800">주소</dt>
          <dd className="mt-1 text-gray-500">서울특별시 강남구 테헤란로 123, 4층</dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-800">대중교통</dt>
          <dd className="mt-1 text-gray-500">2호선 강남역 3번 출구 도보 5분</dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-800">전화</dt>
          <dd className="mt-1 text-gray-500">02-1234-5678</dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-800">이메일</dt>
          <dd className="mt-1 text-gray-500">contact@mycompany.example</dd>
        </div>
      </dl>
    </div>
  </div>
)
