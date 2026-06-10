# 프로젝트 개요

회원가입 및 게시판 기능을 갖춘 웹 애플리케이션.
**스택**: React, Tailwind CSS, Supabase

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트엔드 | React 18, React Router v6 |
| 스타일 | Tailwind CSS v3 |
| 백엔드/DB | Supabase (Auth, PostgreSQL, Storage) |
| 빌드 도구 | Vite |
| 상태 관리 | React Context API (또는 Zustand) |

---

## 디렉토리 구조

```
src/
├── components/        # 공통 컴포넌트
│   ├── ui/            # 버튼, 인풋, 모달 등 원자 컴포넌트
│   └── layout/        # Header, Footer, Layout
├── pages/             # 라우트별 페이지
│   ├── auth/          # 로그인, 회원가입
│   └── board/         # 게시판 목록, 상세, 작성
├── hooks/             # 커스텀 훅
├── lib/               # supabase 클라이언트, 유틸
├── contexts/          # AuthContext 등
└── types/             # TypeScript 타입 정의
```

---

## Supabase 설정

### 환경 변수 (`.env.local`)
```
VITE_SUPABASE_URL=<your-project-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### Supabase 클라이언트 (`src/lib/supabase.ts`)
```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

## 데이터베이스 스키마

### `public.users` 테이블 (사용자 정보)
```sql
create table public.users (
    id uuid primary key references auth.users(id) on delete cascade,

    email text unique not null,
    nickname varchar(30) not null,

    profile_image text,
    introduction text,

    sido varchar(50),
    sigungu varchar(50),
    dong varchar(50),

    latitude numeric(10,7),
    longitude numeric(10,7),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
```

### `public.boards` 테이블 (게시판)
```sql
create table public.boards (
    id bigint generated always as identity primary key,

    name varchar(50) not null,
    description text,

    is_active boolean not null default true,

    created_at timestamptz not null default now()
);
```

### `public.posts` 테이블 (게시글)
```sql
create table public.posts (
    id bigint generated always as identity primary key,

    user_id uuid not null references public.users(id) on delete cascade,
    board_id bigint not null references public.boards(id),

    title varchar(200) not null,
    content text not null,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
```

### 인덱스
```sql
create index idx_posts_user_id    on public.posts(user_id);
create index idx_posts_board_id   on public.posts(board_id);
create index idx_posts_created_at on public.posts(created_at desc);
```

### Boards 시드 데이터
```sql
insert into public.boards (name, description)
values
  ('자유게시판', '자유롭게 소통하는 게시판'),
  ('운동인증',   '운동 기록을 공유하는 게시판'),
  ('질문게시판', '운동 관련 질문 게시판'),
  ('번개후기',   '번개모임 후기 게시판'),
  ('정보공유',   '운동 정보 공유 게시판');
```

### RLS (Row Level Security) 정책
```sql
-- users: 본인만 수정 가능, 읽기는 공개
alter table public.users enable row level security;
create policy "users_select" on public.users for select using (true);
create policy "users_insert" on public.users for insert with check (auth.uid() = id);
create policy "users_update" on public.users for update using (auth.uid() = id);

-- boards: 누구나 읽기, 관리자만 쓰기 (is_active 필터)
alter table public.boards enable row level security;
create policy "boards_select" on public.boards for select using (is_active = true);

-- posts: 누구나 읽기, 로그인 사용자만 쓰기
alter table public.posts enable row level security;
create policy "posts_select" on public.posts for select using (true);
create policy "posts_insert" on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_update" on public.posts for update using (auth.uid() = user_id);
create policy "posts_delete" on public.posts for delete using (auth.uid() = user_id);
```

---

## 주요 기능

### 인증 (Auth)
- 이메일/패스워드 회원가입 (`supabase.auth.signUp`)
- 로그인 / 로그아웃 (`supabase.auth.signInWithPassword`)
- 세션 자동 복원 (`onAuthStateChange`)
- 보호된 라우트: 비로그인 시 `/login` 리다이렉트

### 게시판
- 게시판 목록: `boards` 테이블에서 `is_active = true` 항목만 조회
- 게시글 목록 조회: 페이지네이션 (`.range(from, to)`), `board_id` 필터
- 게시글 작성/수정/삭제 (로그인 필요, `user_id` 기준 RLS 적용)
- 상세 조회: `posts` + `users` join으로 작성자 닉네임/프로필 표시

---

## IA (정보 구조) / 메뉴 구조

### 1단계 메뉴

| # | 메뉴명 | 경로 | 설명 |
|---|--------|------|------|
| 1 | 홈 | `/` | 메인 랜딩 페이지 |
| 2 | 회사소개 | `/about` | 회사 정보 |
| 3 | 제품소개 | `/products` | 제품/서비스 목록 |
| 4 | 게시판 | `/board` | 커뮤니티 게시판 |
| 5 | 온라인 문의 | `/contact` | 문의 폼 |

### 2단계 메뉴 (서브페이지)

```
홈                  /
├── (없음)

회사소개             /about
├── 회사 개요        /about
├── 연혁             /about/history
├── 조직도           /about/organization
└── 오시는 길        /about/location

제품소개             /products
├── 제품 목록        /products
└── 제품 상세        /products/:id

게시판               /board
├── 게시판 선택      /board               ← boards 테이블 기반
├── 게시글 목록      /board/:boardId
├── 게시글 상세      /board/:boardId/:id
├── 게시글 작성      /board/:boardId/write    (로그인 필요)
└── 게시글 수정      /board/:boardId/:id/edit (작성자 본인)

온라인 문의          /contact
├── 문의 폼         /contact
└── 문의 완료       /contact/complete
```

### 공통 영역

| 영역 | 위치 | 포함 항목 |
|------|------|-----------|
| Header | 최상단 고정 | 로고, 1단계 메뉴 전체, 로그인/로그아웃 버튼 |
| Footer | 최하단 | 회사명, 주소, 연락처, 저작권 |
| 404 | 없는 경로 | Not Found 안내 + 홈 버튼 |

---

## 라우트 구조

```
/                           → 홈 (메인 랜딩)

/about                      → 회사소개 (개요)
/about/history              → 연혁
/about/organization         → 조직도
/about/location             → 오시는 길

/products                   → 제품소개 목록
/products/:id               → 제품 상세

/board                      → 게시판 선택 (boards 목록)
/board/:boardId             → 게시글 목록
/board/:boardId/write       → 게시글 작성  [로그인 필요]
/board/:boardId/:id         → 게시글 상세
/board/:boardId/:id/edit    → 게시글 수정  [작성자 본인]

/contact                    → 온라인 문의 폼
/contact/complete           → 문의 완료

/login                      → 로그인
/signup                     → 회원가입
*                           → 404 Not Found
```

---

## 개발 규칙

### 코드 스타일
- TypeScript 사용, `any` 금지
- 컴포넌트는 함수형 + 화살표 함수로 작성
- Tailwind 클래스는 `clsx` 또는 `cn` 유틸로 조합

### Supabase 쿼리
- 모든 Supabase 호출은 `hooks/` 또는 `lib/` 에서 관리
- 페이지 컴포넌트에서 직접 `supabase.*` 호출 금지
- 에러는 항상 처리 (`.error` 체크 필수)

### 인증 상태
- `AuthContext`에서 `user`, `session`, `loading` 제공
- `loading` 중에는 스피너 렌더링, 플리커 방지

### Tailwind 규칙
- 디자인 토큰은 `tailwind.config.js`의 `extend`에 정의
- 반응형 우선: `sm:` → `md:` → `lg:` 순서

---

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build
```

---

## Supabase MCP 연동

Codex에서 Supabase MCP 서버를 통해 DB 스키마 조회, 쿼리 실행, 마이그레이션 적용을 직접 수행할 수 있다.

### 설정 방법

**1. Personal Access Token 발급**
Supabase 대시보드 → Account → Access Tokens → `Generate new token`

**2. MCP 서버 등록** (`.Codex/settings.json` 또는 전역 `~/.Codex/settings.json`)
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "<your-personal-access-token>"
      ]
    }
  }
}
```

> 특정 프로젝트만 허용하려면 `--project-ref <ref>` 옵션을 추가한다.

**3. 연결 확인**
Codex 대화 중 아래처럼 직접 요청 가능:
```
supabase MCP로 public.users 테이블 스키마 확인해줘
supabase MCP로 boards 시드 데이터 insert 실행해줘
supabase MCP로 posts 인덱스 현황 조회해줘
```

### MCP로 할 수 있는 작업

| 작업 | 설명 |
|------|------|
| 스키마 조회 | 테이블, 컬럼, 인덱스, FK 확인 |
| SQL 실행 | SELECT / INSERT / UPDATE / DELETE 직접 실행 |
| 마이그레이션 적용 | DDL 변경사항을 대화 중 즉시 반영 |
| RLS 정책 확인 | 적용된 정책 목록 및 내용 조회 |
| 함수/트리거 관리 | DB 함수 생성·수정·삭제 |
| 로그 조회 | 최근 쿼리 로그 및 에러 확인 |

### 주의사항

- `access-token`은 `.Codex/settings.json`에 직접 커밋하지 않는다 — 환경 변수나 `settings.local.json`에 보관
- MCP를 통한 `DROP`, `TRUNCATE` 등 파괴적 쿼리는 실행 전 반드시 확인
- 프로덕션 프로젝트에는 `--project-ref`로 범위를 제한하는 것을 권장

---

## 구현 시 참고사항

- Supabase Auth의 `confirmEmail` 설정에 따라 회원가입 후 이메일 인증 흐름이 달라짐
- 개발 환경에서는 Supabase 대시보드 → Authentication → Email 에서 "Confirm email" 비활성화 권장
- RLS 정책 누락 시 403 에러 발생 — 새 테이블 추가 시 반드시 RLS 설정
