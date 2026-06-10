# 데이터베이스 스키마

mycompany 웹 애플리케이션의 Supabase(PostgreSQL) 데이터베이스 구조 문서입니다. 마이그레이션 작성 및 쿼리 작성 시 이 문서를 기준으로 합니다.

## ERD (테이블 관계)

```
auth.users (Supabase Auth 관리)
     │ 1:1  (id 공유, on delete cascade)
     ▼
public.users ───────────────┐
     │                      │
     │ 1:N (작성자)          │
     ▼                      │
public.posts ◄──────────────┘
     │
     │ N:1 (소속 게시판)
     ▼
public.boards
```

## 테이블 목록

| 테이블 | 설명 | 주요 관계 |
|---|---|---|
| `public.users` | 사용자 프로필 (`auth.users` 확장) | `auth.users.id`와 1:1 |
| `public.boards` | 게시판 카테고리 | `posts.board_id`로 참조됨 (1:N) |
| `public.posts` | 게시글 | `users.id`, `boards.id` 참조 (N:1) |

---

## `public.users` — 사용자 정보

`auth.users`(Supabase Auth)와 1:1로 연결되는 프로필 테이블로, 회원가입 시 함께 생성됩니다.

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | uuid | PK, FK → `auth.users(id)` ON DELETE CASCADE | 인증 사용자와 동일한 ID |
| `email` | text | UNIQUE, NOT NULL | 이메일 (가입 시 동기화) |
| `nickname` | varchar(30) | NOT NULL | 화면에 노출되는 닉네임 |
| `profile_image` | text | nullable | 프로필 이미지 URL (Storage) |
| `introduction` | text | nullable | 자기소개 |
| `sido`, `sigungu`, `dong` | varchar(50) | nullable | 지역 정보 (시/도, 시/군/구, 동) |
| `latitude`, `longitude` | numeric(10,7) | nullable | 위치 좌표 |
| `role` | varchar(20) | NOT NULL, default `'user'` | 권한 구분 (`user` / `admin`) |
| `created_at`, `updated_at` | timestamptz | NOT NULL, default `now()` | 생성/수정 시각 |

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
    role varchar(20) not null default 'user',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
```

**RLS 정책**: 읽기는 전체 공개, 등록·수정은 본인(`auth.uid() = id`)만 가능
```sql
alter table public.users enable row level security;
create policy "users_select" on public.users for select using (true);
create policy "users_insert" on public.users for insert with check (auth.uid() = id);
create policy "users_update" on public.users for update using (auth.uid() = id);
```

---

## `public.boards` — 게시판

게시글을 분류하는 카테고리 테이블. `is_active` 플래그로 노출 여부를 제어합니다.

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | bigint | PK, identity | 게시판 ID (자동 증가) |
| `name` | varchar(50) | NOT NULL | 게시판 이름 |
| `description` | text | nullable | 게시판 설명 |
| `is_active` | boolean | NOT NULL, default `true` | 활성화 여부 — `false`면 목록에서 숨김 |
| `created_at` | timestamptz | NOT NULL, default `now()` | 생성 시각 |

```sql
create table public.boards (
    id bigint generated always as identity primary key,
    name varchar(50) not null,
    description text,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);
```

**RLS 정책**: `is_active = true`인 게시판만 조회 가능 (쓰기 정책은 추후 관리자 기능과 함께 정의 예정)
```sql
alter table public.boards enable row level security;
create policy "boards_select" on public.boards for select using (is_active = true);
```

**시드 데이터** — 초기 게시판 5종
```sql
insert into public.boards (name, description)
values
  ('자유게시판', '자유롭게 소통하는 게시판'),
  ('운동인증',   '운동 기록을 공유하는 게시판'),
  ('질문게시판', '운동 관련 질문 게시판'),
  ('번개후기',   '번개모임 후기 게시판'),
  ('정보공유',   '운동 정보 공유 게시판');
```

---

## `public.posts` — 게시글

작성자(`users`)와 소속 게시판(`boards`)을 참조하는 게시글 테이블.

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | bigint | PK, identity | 게시글 ID (자동 증가) |
| `user_id` | uuid | NOT NULL, FK → `users(id)` ON DELETE CASCADE | 작성자 — 탈퇴 시 게시글도 함께 삭제 |
| `board_id` | bigint | NOT NULL, FK → `boards(id)` | 소속 게시판 |
| `title` | varchar(200) | NOT NULL | 제목 (최대 200자) |
| `content` | text | NOT NULL | 본문 |
| `created_at`, `updated_at` | timestamptz | NOT NULL, default `now()` | 생성/수정 시각 |

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

**인덱스** — 작성자별/게시판별 조회 및 최신순 정렬 성능을 위해 설정
```sql
create index idx_posts_user_id    on public.posts(user_id);
create index idx_posts_board_id   on public.posts(board_id);
create index idx_posts_created_at on public.posts(created_at desc);
```

**RLS 정책**: 읽기는 전체 공개, 작성·수정·삭제는 작성자 본인(`auth.uid() = user_id`)만 가능
```sql
alter table public.posts enable row level security;
create policy "posts_select" on public.posts for select using (true);
create policy "posts_insert" on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_update" on public.posts for update using (auth.uid() = user_id);
create policy "posts_delete" on public.posts for delete using (auth.uid() = user_id);
```

---

## 적용 현황

- ✅ `users` / `boards` / `posts` 테이블, 인덱스, RLS 정책, `boards` 시드 데이터, `users.role` 컬럼까지 마이그레이션 적용 완료 (`apply_migration: create_core_schema`).
- 관리자 전용 기능(예: `boards` 쓰기 정책)은 `role = 'admin'` 조건의 RLS 정책을 추가로 정의할 예정입니다. 배경은 [spec-fixed.md](../spec/spec-fixed.md)의 "스키마 변경 필요 사항" 절 참고.
