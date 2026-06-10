# 작업 이력 (명령 프롬프트 기록)

## 2026-06-08 세션

1. **명령**: "supabase 연결하고 테이블 리스트"
   - 처리: Supabase 프로젝트(`tkoadrrwgdpygfqjbdrh`, ap-northeast-2)에 연결 확인 후 `public` 스키마 테이블 목록 조회 — 당시 테이블 없음(빈 상태)

2. **명령**: "test 테이블 생성해줘"
   - 처리: `public.test` 테이블 생성 (`id` bigint PK identity, `name` text, `created_at` timestamptz default now())

3. **명령**: "데이터 20개만 넣어줘"
   - 처리: `public.test`에 샘플 데이터 20건(`test 1` ~ `test 20`) insert

4. **명령**: "spec폴더의 spec-original.md를 확인하고 요구사항에 대하여 설계해줘, 에지케이스도 설계해줘 / 20개의 요구사항을 도출해줘"
   - 처리: `docs/spec/spec-original.md` 검토 후 인증/회원관리, 홈/회사소개, 제품소개, 게시판, 문의하기, 공통/관리자 등 6개 도메인으로 20개 상세 요구사항과 엣지케이스를 설계하여 같은 파일에 "상세 요구사항 (도출됨)" 섹션 및 "스키마 변경 필요 사항"(`role` 컬럼 추가) 섹션 추가

5. **명령**: "spec-fixed.md 에 저장해줘"
   - 처리: 도출된 전체 내용(원본 요구사항 + 20개 상세 요구사항/엣지케이스 + 스키마 변경 참고)을 `docs/spec/spec-fixed.md`로 확정본 저장

6. **명령**: "명령 프롬프트 docs 폴더내에 history.md 파일로 저장해줘"
   - 처리: 위 1~6번 명령 이력을 `docs/history.md`로 정리하여 저장

7. **명령**: (book.visang.com 디자인 토큰/컴포넌트 JSON 붙여넣기 후) "docs/design/design-system.md 생성"
   - 처리: 컬러/타이포그래피/스페이싱/컴포넌트(버튼·카드·인풋·배지·탭·배너·모달·토스트·푸터 등)/레이아웃 토큰 JSON을 `docs/design/design-system.md`로 저장 (`docs/design/` 디렉터리 신규 생성)

8. **명령**: "claude.md 파일을 150줄로 변경하여 정리, docs 폴더의 spec,design 을 import / design-system.md 도 정리해줘"
   - 처리: `CLAUDE.md`를 344줄 → 116줄로 압축(DB 스키마 SQL을 `docs/spec/db-schema.md`로 분리, IA/라우트 표 병합, MCP 가이드 축약)하고 `@docs/spec/spec-fixed.md`, `@docs/spec/db-schema.md`, `@docs/design/design-system.md` import 추가; `design-system.md`는 raw JSON 블록을 컬러/타이포그래피/컴포넌트별 마크다운 표로 재구성(1004줄 → 161줄)

9. **명령**: "데이터베이스 스키마도 docs/database에 md파일 생성하여 정리"
   - 처리: ERD·테이블별 컬럼 설명·DDL·RLS·인덱스·시드를 정리한 `docs/database/schema.md` 신규 생성, 중복되는 `docs/spec/db-schema.md`는 제거하고 `CLAUDE.md`의 import 참조를 `@docs/database/schema.md`로 갱신

10. **명령**: "명령 프롬프트 docs 폴더내에 history.md 파일로 저장해줘"
    - 처리: 위 7~10번 명령 이력을 `docs/history.md`에 추가 기록 (현재 작업)
