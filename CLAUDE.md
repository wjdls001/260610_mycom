# 프로젝트 개요

회원가입 및 게시판 기능을 갖춘 회사 홈페이지.
**스택**: React, Tailwind CSS, Supabase

> 참고 문서: 요구사항/엣지케이스는 @docs/spec/spec-fixed.md, DB 스키마/ERD/DDL은 @docs/database/schema.md, 디자인 토큰/컴포넌트 스펙은 @docs/design/design-system.md 를 함께 확인한다.

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트엔드 | React 18, React Router v6 |
| 스타일 | Tailwind CSS v3 |
| 백엔드/DB | Supabase (Auth, PostgreSQL, Storage) |
| 빌드 도구 | Vite |
| 상태 관리 | React Context API (또는 Zustand) |

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

## Supabase 설정

환경 변수(`.env.local`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

`src/lib/supabase.ts`:
```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

## 데이터베이스 스키마 (요약)

| 테이블 | 주요 컬럼 | RLS 요약 |
|---|---|---|
| `public.users` | id(uuid, FK auth.users), email, nickname, profile_image, introduction, sido/sigungu/dong, latitude/longitude | 읽기 공개, 본인만 등록·수정 |
| `public.boards` | id, name, description, is_active | `is_active = true`만 조회 가능 |
| `public.posts` | id, user_id(FK), board_id(FK), title(≤200자), content | 읽기 공개, 작성자 본인만 수정·삭제 |

ERD, 컬럼별 설명, 전체 DDL·인덱스·시드 데이터·RLS 정책은 @docs/database/schema.md 참고 (`role` 컬럼 추가 등 예정된 변경사항 포함).

## 주요 기능

- **인증**: 이메일/비밀번호 가입(`signUp`), 로그인/로그아웃(`signInWithPassword`), 세션 자동 복원(`onAuthStateChange`), 보호된 라우트(비로그인 시 `/login` 리다이렉트)
- **게시판**: `is_active = true` 게시판만 노출 → `board_id` 필터 + `.range()` 페이지네이션 → 작성/수정/삭제(로그인 + RLS) → 상세는 `posts`+`users` join

요구사항 20개 항목과 엣지케이스 전체 목록은 @docs/spec/spec-fixed.md 참고.

## IA / 라우트 구조

| 메뉴 | 경로 | 서브 라우트 |
|---|---|---|
| 홈 | `/` | - |
| 회사소개 | `/about` | `/about/history`, `/about/organization`, `/about/location` |
| 제품소개 | `/products` | `/products/:id` |
| 게시판 | `/board` | `/board/:boardId`, `/board/:boardId/write`(로그인 필요), `/board/:boardId/:id`, `/board/:boardId/:id/edit`(작성자 본인) |
| 온라인 문의 | `/contact` | `/contact/complete` |
| 인증 | `/login`, `/signup` | - |
| 기타 | `*` | 404 Not Found |

공통 영역: **Header**(로고, 1단계 메뉴 전체, 로그인 상태별 버튼) / **Footer**(회사명·주소·연락처·저작권) / **404**(안내 + 홈 버튼)

## 개발 규칙

### 코드 스타일
- TypeScript 사용, `any` 금지
- 컴포넌트는 함수형 + 화살표 함수로 작성
- Tailwind 클래스는 `clsx`/`cn` 유틸로 조합

### Supabase 쿼리
- 모든 Supabase 호출은 `hooks/` 또는 `lib/`에서 관리, 페이지 컴포넌트에서 직접 호출 금지
- 에러는 항상 처리 (`.error` 체크 필수)

### 인증 상태
- `AuthContext`에서 `user`, `session`, `loading` 제공
- `loading` 중에는 스피너 렌더링, 플리커 방지

### Tailwind / 디자인
- 디자인 토큰은 `tailwind.config.js`의 `extend`에 정의, 반응형은 `sm:` → `md:` → `lg:` 순서로 작성
- 컬러·타이포그래피·스페이싱·컴포넌트 스타일 레퍼런스는 @docs/design/design-system.md 참고

## 실행 방법

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버
npm run build    # 빌드
```

## Supabase MCP 연동

Claude Code에서 Supabase MCP 서버(`@supabase/mcp-server-supabase`)를 통해 스키마 조회·SQL 실행·마이그레이션을 대화 중 직접 수행할 수 있다 (`.claude/settings.json`에 등록, access-token은 커밋하지 말고 `settings.local.json`/환경 변수에 보관).

- `DROP`/`TRUNCATE` 등 파괴적 쿼리는 실행 전 반드시 사용자 확인
- 프로덕션 프로젝트는 `--project-ref <ref>`로 범위를 제한할 것

## 구현 시 참고사항

- Supabase Auth의 `confirmEmail` 설정에 따라 회원가입 후 이메일 인증 흐름이 달라짐 — 개발 환경에서는 대시보드 → Authentication → Email에서 비활성화 권장
- RLS 정책 누락 시 403 에러 발생 — 새 테이블 추가 시 반드시 RLS 설정
