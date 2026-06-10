# Design System Reference

book.visang.com에서 추출한 디자인 토큰 및 컴포넌트 스펙 레퍼런스입니다. `tailwind.config.js` 설정과 공통 컴포넌트(`src/components/ui`) 구현 시 참고용으로 사용합니다.

## 컬러

### Primary / Secondary
| 토큰 | HEX | 용도 |
|---|---|---|
| `visang-blue` | `#0064FF` | Primary, CTA 버튼, 활성 상태, 링크 |
| `visang-blue-dark` | `#0050CC` | Primary 호버 |
| `visang-blue-light` | `#E6F0FF` | 틴트 배경, 선택 상태 |
| `visang-orange` | `#FF6B00` | 강조, 배지, 이벤트 라벨 |
| `visang-orange-light` | `#FFF0E6` | 오렌지 틴트 배경 |
| `visang-green` | `#00B050` | 성공 상태, NEW 배지 |

### Neutral (Gray Scale)
| 토큰 | HEX | 용도 |
|---|---|---|
| `gray-900` | `#1A1A1A` | 본문 제목, 헤딩 |
| `gray-800` | `#333333` | 본문, 내비게이션 |
| `gray-700` | `#555555` | 보조 텍스트 |
| `gray-500` | `#888888` | placeholder, 비활성 라벨 |
| `gray-400` | `#AAAAAA` | 구분선, 비활성 요소 |
| `gray-200` | `#DDDDDD` | 보더, 인풋 외곽선 |
| `gray-100` | `#F5F5F5` | 페이지/카드 배경 |
| `white` | `#FFFFFF` | 컴포넌트 배경, 헤더 |

### 시맨틱 컬러
| 토큰 | 값 |
|---|---|
| `color-text-primary` / `secondary` / `disabled` / `inverse` | `#1A1A1A` / `#555555` / `#AAAAAA` / `#FFFFFF` |
| `color-text-link` | `#0064FF` |
| `color-bg-page` / `surface` / `overlay` | `#F5F5F5` / `#FFFFFF` / `rgba(0,0,0,0.5)` |
| `color-border-default` / `focus` | `#DDDDDD` / `#0064FF` |
| `color-status-success` / `warning` / `error` / `info` | `#00B050` / `#FF6B00` / `#E02020` / `#0064FF` |

## 타이포그래피

**폰트**: 한글 `'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif` / 영문·숫자 `'Roboto', 'Helvetica Neue', Arial, sans-serif` / 코드 `'Courier New', Courier, monospace`

### 크기 스케일
| 토큰 | 크기 | 줄간격 | 용도 |
|---|---|---|---|
| `text-xs` | 12px | 18px | 캡션, 배지, 메타 정보 |
| `text-sm` | 13px | 20px | 서브 라벨, 풋노트 |
| `text-base` | 14px | 22px | 본문, 내비게이션 링크 |
| `text-md` | 15px | 24px | 약간 큰 본문 |
| `text-lg` | 16px | 26px | 기본, 섹션 라벨 |
| `text-xl` | 18px | 28px | 카드 제목, 서브헤딩 |
| `text-2xl` | 20px | 30px | 섹션 헤딩 |
| `text-3xl` | 24px | 34px | 페이지 서브헤딩 |
| `text-4xl` | 28px | 40px | 주요 헤딩 |
| `text-5xl` | 32px | 46px | Hero / H1 헤딩 |

**굵기**: regular(400) · medium(500) · semibold(600) · bold(700) · extrabold(800)
**행간**: tight(1.3) · snug(1.4) · normal(1.5) · relaxed(1.6) · loose(1.8)
**자간**: tight(-0.02em) · normal(0em) · wide(0.04em)

### 텍스트 스타일 프리셋
| 스타일 | 크기 / 굵기 | 색상 |
|---|---|---|
| `heading-h1` | 32px / 700 | `#1A1A1A` (자간 -0.02em) |
| `heading-h2` | 24px / 700 | `#1A1A1A` (자간 -0.01em) |
| `heading-h3` | 20px / 600 | `#1A1A1A` |
| `heading-h4` | 18px / 600 | `#333333` |
| `body-large` / `body-base` / `body-small` | 16·14·13px / 400 | `#333333` / `#333333` / `#555555` |
| `caption` | 12px / 400 | `#888888` |
| `label` | 13px / 500 | `#1A1A1A` |
| `nav-item` | 14px / 500 | `#333333` |
| `button-text` | 14px / 600 | `#FFFFFF` |

## 스페이싱

4px 기준 스케일: `space-0`(0) → `1`(4px) → `2`(8px) → `3`(12px) → `4`(16px) → `5`(20px) → `6`(24px) → `7`(28px) → `8`(32px) → `10`(40px) → `12`(48px) → `16`(64px) → `20`(80px) → `24`(96px)

| 시맨틱 토큰 | 값 |
|---|---|
| `spacing-component-xs/sm/md/lg` | 4px / 8px / 16px / 24px |
| `spacing-section-sm/md/lg` | 40px / 64px / 80px |
| `spacing-page-horizontal` (모바일/데스크탑) | 20px / 40px |

## 보더 / 섀도 / z-index / 모션

**Border radius**: none(0) · sm(4px) · md(8px) · lg(12px) · xl(16px) · 2xl(20px) · full(9999px)
**Border width**: thin(1px) · medium(2px) · thick(3px)
**프리셋**: 기본 `1px solid #DDDDDD` · 포커스 `2px solid #0064FF` · 활성 `1px solid #0064FF` · 에러 `1px solid #E02020` · 카드 `1px solid #EEEEEE`

| 그림자 토큰 | 값 |
|---|---|
| `shadow-xs` / `sm` / `md` / `lg` / `xl` | `0 1px 2px`〜`0 16px 40px rgba(0,0,0,0.06~0.15)` |
| `shadow-card` | `0 2px 8px rgba(0,0,0,0.08)` |
| `shadow-modal` | `0 8px 32px rgba(0,0,0,0.18)` |
| `shadow-nav` | `0 2px 4px rgba(0,0,0,0.06)` |

**z-index**: base(0) → raised(10) → dropdown(100) → sticky(200) → overlay(300) → modal(400) → toast(500) → tooltip(600)
**모션**: 지속시간 fast(150ms) · normal(250ms) · slow(400ms) / 기본 이징 `cubic-bezier(0.4, 0, 0.2, 1)`, 스프링 `cubic-bezier(0.34, 1.56, 0.64, 1)`

## 컴포넌트 스펙

### 내비게이션 (GNB)
- 높이 60px(모바일) / 72px(데스크탑), 흰 배경 + `shadow-nav`, sticky top, z-index 200
- 1단계 메뉴: 비상교재 · 학원선생님 · 비상서점 · 비상교과서 · 비상교육
- 2단계 메뉴: 초등 · 중학 · 고등 · 자료실 · 리뷰 · 이벤트(드롭다운)
- 유틸리티 메뉴: 로그인 · 회원가입 · 고객센터 · 장바구니 · 마이페이지
- nav-item: 14px/500, 기본 `#333333` → hover/active `#0064FF`, 활성 시 하단 보더 2px

### 버튼
| variant | 배경 / 텍스트 | 용도 |
|---|---|---|
| `primary` | `#0064FF`(hover `#0050CC`) / 흰색 | 기본 액션 (예: 로그인) |
| `secondary` | 흰색, 보더 `#0064FF` / `#0064FF` | 보조 액션 (예: 회원가입) |
| `ghost` | transparent, 보더 `#DDDDDD` / `#555555` | 약한 강조 (예: 브랜드 스토리) |
| `text` | transparent / `#0064FF` | 텍스트 링크형, 호버 시 밑줄 |
| `cta` | `#FF6B00`(hover `#E55F00`) / 흰색 | Hero CTA, "바로가기" 등 강조 액션 |

사이즈: sm(12px, 6·12px, radius 6px) · md(14px, 10·20px, radius 8px) · lg(15px, 14·28px) · xl(16px, 16·32px, radius 10px)
상태: disabled(opacity 0.4, cursor not-allowed) · loading(opacity 0.7, cursor wait)

### 카드
- **bookCard**: 흰 배경, `radius-lg`(12px), 보더 `#EEEEEE`, 기본 `shadow-sm` → hover 시 `shadow-lg` + `translateY(-2px)`(전환 250ms), 썸네일 비율 3:4, 본문에 배지/제목(14px·600)/서브타이틀/가격(15px·700·`#0064FF`)
- **brandCard**: 중앙 정렬 flex 컬럼, `radius-lg`, 보더 `#EEEEEE`, hover 시 그림자 강화
- **newsCard**: 좌우 패딩 20px, 하단 보더 `#EEEEEE`, 배지 + 제목(14px·600) + 요약(13px·`#555555`) + 날짜(12px·`#AAAAAA`) 구성

### 인풋
| 종류 | 높이 | radius | 보더 |
|---|---|---|---|
| 검색창 | 44px | 22px(pill) | 2px `#DDDDDD` → 포커스 `#0064FF` + glow |
| 텍스트 인풋 | 44px | 8px | 1px `#DDDDDD` → 포커스 `#0064FF` |
| select | 44px | 8px | 1px `#DDDDDD`, chevron 아이콘 |
| checkbox | 18px | 4px | 1.5px `#DDDDDD`, 체크 시 `#0064FF` |
| radio | 18px | 50% | 1.5px `#DDDDDD`, 체크 dot `#0064FF` |

라벨 13px/500 `#333333`, 헬퍼텍스트 12px `#888888`, 에러텍스트 12px `#E02020`

### 배지
- `new`(배경 `#00B050`) · `event`(`#FF6B00`) · `notice`(`#0064FF`, "공지") · `info`(배경 `#E6F0FF`, 텍스트 `#0064FF`, "안내") — 모두 11px, radius 4px
- 학년 배지: 초등(배경 `#FFF0E6`/텍스트 `#FF6B00`) · 중학(배경 `#E6F0FF`/텍스트 `#0064FF`) · 고등(배경 `#F0E6FF`/텍스트 `#7B00FF`)

### 탭 / 배너 / 모달 / 토스트
- **탭**: 하단 보더 `#DDDDDD`, 항목 14px/500 `#888888` → 활성 시 `#0064FF`/700/하단 보더 2px (변형: 전체·초등·중학·고등)
- **배너**: 풀 width, 비율 375:200(모바일)/1440:480(데스크탑), radius 0→12px, dot 인디케이터(활성 `#0064FF`, 비활성 `#DDDDDD`)
- **모달**: 오버레이 `rgba(0,0,0,0.5)` z-index 400, 컨테이너 `radius-xl`(16px) 최대폭 480px 중앙 정렬, `shadow-modal`, 헤더 18px/700
- **토스트**: 화면 하단 중앙 고정, radius 8px, z-index 500, variant별 배경(default `#333333` · success `#00B050` · error `#E02020` · warning `#FF6B00`)

### 푸터 / 퀵메뉴
- **푸터**: 배경 `#F5F5F5`, 상단 보더, 패밀리 사이트 섹션 4개(출판교육 서비스/에듀플랫폼/교육기관/인쇄시설), 회사 정보(상호·대표자·사업자번호·연락처·이메일·주소) 및 SNS 링크 표시, 카피라이트 12px `#AAAAAA`
- **퀵메뉴**: 모바일 화면 하단 고정, 4열 그리드, z-index 200, 항목 11px/500 `#555555` (예: 출석체크 이벤트 · 비상한 Talk! · V포인트 · 새로 나올 책)

## 레이아웃 / 그리드

| 브레이크포인트 | 범위 | 컬럼 | 거터 |
|---|---|---|---|
| mobile | 0–767px | 4 | 16px |
| tablet | 768–1023px | 8 | 20px |
| desktop | 1024–1279px | 12 | 24px |
| wide | 1280px 이상 | 12 | 24px |

- **컨테이너**: 최대폭 1200px, 좌우 패딩 20px(모바일) / 40px(데스크탑), `margin: 0 auto`
- **게시물 그리드(bookList)**: 모바일 2열 → 태블릿 3열 → 데스크탑 4열 (gap 16~24px)
- **브랜드 그리드(brandGrid)**: 모바일 3열(gap 12px) → 데스크탑 6열(gap 16px)
