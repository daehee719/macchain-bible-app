# Supabase 스키마 적용 가이드

## 프로젝트 정보
- **Project Ref**: `dazushjgczteromlitve`
- **Project URL**: `https://dazushjgczteromlitve.supabase.co`

## 스키마 적용 방법

### 방법 1: 자동 복사 스크립트 사용 (가장 빠름) ⚡

```bash
# 스키마 SQL을 클립보드에 자동 복사
./scripts/copy-schema.sh
```

그 다음:
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 `dazushjgczteromlitve` 선택
3. 좌측 메뉴에서 **SQL Editor** 클릭
4. **New query** 클릭
5. **Cmd+V** (macOS) 또는 **Ctrl+V** (Windows/Linux)로 붙여넣기
6. **Run** 버튼 클릭하여 실행

### 방법 2: Supabase Dashboard 사용 (수동)

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로젝트 `dazushjgczteromlitve` 선택
3. 좌측 메뉴에서 **SQL Editor** 클릭
4. **New query** 클릭
5. `backend/supabase/database/schema.sql` 파일의 전체 내용을 복사하여 붙여넣기
6. **Run** 버튼 클릭하여 실행

### 방법 2: Supabase CLI 사용

```bash
# Supabase CLI 설치 (아직 설치하지 않은 경우)
npm install -g supabase

# Supabase 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref dazushjgczteromlitve

# 마이그레이션 적용
supabase db push
```

## 스키마 적용 후 확인

스키마가 정상적으로 적용되었는지 확인:

1. Supabase Dashboard → **Table Editor**로 이동
2. 다음 테이블들이 생성되었는지 확인:
   - `users`
   - `user_progress`
   - `macchain_plan`
   - `reading_progress`
   - `user_settings`
   - `ai_analysis`
   - `monthly_bible_data`
   - `user_consents`

## MCP를 통한 확인

Cursor를 재시작한 후 다음 명령으로 확인:

```bash
# 테이블 목록 확인
# MCP 도구: list_tables

# 마이그레이션 목록 확인
# MCP 도구: list_migrations
```

## 주의사항

1. **Access Token 확인**: Supabase MCP를 사용하려면 올바른 Access Token이 필요합니다.
   - Supabase Dashboard → Settings → Access Tokens
   - Personal Access Token 생성
   - `.cursor/mcp.json`의 `SUPABASE_ACCESS_TOKEN`에 설정

2. **RLS 정책**: 스키마에 Row Level Security (RLS) 정책이 포함되어 있습니다.
   - 사용자는 자신의 데이터만 조회/수정 가능
   - 읽기 계획과 성경 데이터는 모든 인증된 사용자가 읽을 수 있음

3. **외래 키 제약**: `users` 테이블은 `auth.users`를 참조합니다.
   - Supabase Auth를 통해 사용자가 생성되어야 함

## 다음 단계

스키마 적용 후:
1. 프론트엔드에 Supabase 클라이언트 설정
2. 환경 변수 설정
3. API 서비스 마이그레이션


