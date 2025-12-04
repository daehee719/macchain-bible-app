# Supabase 스키마 적용 단계별 가이드

## 🚀 빠른 적용 (3분)

### 1단계: Supabase Dashboard 접속
1. 브라우저에서 [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 로그인 (필요한 경우)
3. 프로젝트 **`dazushjgczteromlitve`** 선택

### 2단계: SQL Editor 열기
1. 좌측 사이드바에서 **SQL Editor** 클릭
2. 상단의 **New query** 버튼 클릭

### 3단계: 스키마 SQL 붙여넣기
1. 아래 스키마 SQL 전체를 복사 (Cmd+A, Cmd+C)
2. SQL Editor에 붙여넣기 (Cmd+V)
3. **Run** 버튼 클릭 (또는 Cmd+Enter)

### 4단계: 결과 확인
- 성공 메시지 확인: "Success. No rows returned"
- 에러가 있으면 에러 메시지 확인

## 📋 스키마 SQL

스키마 파일 위치: `backend/supabase/database/schema.sql`

전체 SQL을 복사하려면:
```bash
cat backend/supabase/database/schema.sql | pbcopy
```

또는 스크립트 사용:
```bash
./scripts/copy-schema.sh
```

## ✅ 적용 확인

### 방법 1: Supabase Dashboard
1. 좌측 사이드바에서 **Table Editor** 클릭
2. 다음 테이블들이 생성되었는지 확인:
   - ✅ `users`
   - ✅ `user_progress`
   - ✅ `macchain_plan`
   - ✅ `reading_progress`
   - ✅ `user_settings`
   - ✅ `ai_analysis`
   - ✅ `monthly_bible_data`
   - ✅ `user_consents`

### 방법 2: SQL 쿼리로 확인
SQL Editor에서 다음 쿼리 실행:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

예상 결과: 8개의 테이블이 나열되어야 합니다.

## ⚠️ 주의사항

1. **기존 데이터**: 스키마에 `CREATE TABLE IF NOT EXISTS`를 사용하므로 기존 테이블이 있어도 안전합니다.
2. **RLS 정책**: Row Level Security가 자동으로 활성화됩니다.
3. **트리거**: 사용자 생성 시 자동으로 `user_settings`가 생성됩니다.

## 🔧 문제 해결

### 에러: "relation already exists"
- 정상입니다. 테이블이 이미 존재한다는 의미입니다.
- 계속 진행해도 됩니다.

### 에러: "permission denied"
- Supabase 프로젝트의 관리자 권한이 필요합니다.
- 올바른 프로젝트에 로그인했는지 확인하세요.

### 에러: "function does not exist"
- PostgreSQL 함수가 이미 존재할 수 있습니다.
- `CREATE OR REPLACE FUNCTION`을 사용하므로 대부분 안전합니다.

## 📝 다음 단계

스키마 적용 완료 후:
1. ✅ 테이블 목록 확인
2. ✅ RLS 정책 확인 (Table Editor → 각 테이블 → Policies)
3. ✅ 프론트엔드 환경 변수 설정
4. ✅ API 서비스 테스트

