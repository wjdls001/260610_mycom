import { Link } from 'react-router-dom'

const QUICK_LINKS = [
  { to: '/about', title: '회사소개', desc: '미션, 연혁, 조직도와 오시는 길을 확인하세요.' },
  { to: '/products', title: '제품소개', desc: '운동/헬스케어 제품과 서비스를 살펴보세요.' },
  { to: '/board', title: '게시판', desc: '운동 인증과 정보를 자유롭게 나눠보세요.' },
  { to: '/contact', title: '온라인 문의', desc: '궁금한 점을 빠르게 문의해보세요.' },
]

export const Home = () => (
  <div className="flex flex-col gap-12">
    <section className="rounded-xl bg-primary px-8 py-16 text-center text-white shadow-card">
      <p className="text-sm font-semibold text-primary-light">mycompany</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">함께 운동하고, 함께 성장하는 커뮤니티</h1>
      <p className="mt-4 text-primary-light">
        운동 기록 공유부터 정보 교류까지, mycompany와 함께 시작해보세요.
      </p>
      <Link
        to="/board"
        className="mt-6 inline-block rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary-light"
      >
        게시판 둘러보기
      </Link>
    </section>

    <section>
      <h2 className="text-xl font-bold text-gray-800">바로가기</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-card transition-shadow hover:shadow-modal"
          >
            <h3 className="font-semibold text-gray-800">{link.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{link.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  </div>
)
