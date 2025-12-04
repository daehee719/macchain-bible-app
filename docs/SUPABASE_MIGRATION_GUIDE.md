# Supabase 마이그레이션 가이드

## 개요

이 문서는 MacChain 프로젝트를 Cloudflare Workers + D1에서 Supabase로 마이그레이션하는 과정을 설명합니다.

## 마이그레이션 단계

### 1. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 설정에서 다음 정보 확인:
   - Project URL: `https://your-project.supabase.co`
   - Anon Key: `your-anon-key`
   - Service Role Key: `your-service-role-key` (서버 사이드용)

### 2. 데이터베이스 스키마 적용

1. Supabase Dashboard → SQL Editor로 이동
2. `backend/supabase/database/schema.sql` 파일의 내용을 실행
3. 스키마가 정상적으로 생성되었는지 확인

### 3. 환경 변수 설정

#### 프론트엔드 (`.env` 또는 환경 변수)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### 백엔드 (Supabase Edge Functions 또는 서버)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. 프론트엔드 설정

#### Supabase 클라이언트 설치
```bash
cd macchain-frontend
npm install @supabase/supabase-js
```

#### Supabase 클라이언트 초기화
`src/lib/supabase.ts` 파일 생성:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 5. API 서비스 마이그레이션

기존 Cloudflare Workers API 호출을 Supabase 클라이언트로 변경:

#### 인증
- **이전**: `/api/auth/login`, `/api/auth/register`
- **이후**: `supabase.auth.signInWithPassword()`, `supabase.auth.signUp()`

#### 데이터 조회
- **이전**: `fetch('/api/mccheyne/today')`
- **이후**: `supabase.from('macchain_plan').select('*').eq('date', today)`

### 6. 주요 변경 사항

#### 데이터베이스
- **SQLite (D1)** → **PostgreSQL (Supabase)**
- `INTEGER PRIMARY KEY AUTOINCREMENT` → `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `TEXT` → `TEXT` (동일)
- `BOOLEAN` → `BOOLEAN` (동일)
- `DATETIME` → `TIMESTAMPTZ`

#### 인증
- **이전**: JWT 직접 구현 (Web Crypto API)
- **이후**: Supabase Auth (자동 JWT 관리)

#### API 엔드포인트
- **이전**: Cloudflare Workers REST API
- **이후**: Supabase REST API + Supabase 클라이언트

### 7. Row Level Security (RLS)

Supabase의 RLS 정책이 자동으로 적용됩니다:
- 사용자는 자신의 데이터만 조회/수정 가능
- 읽기 계획과 성경 데이터는 모든 인증된 사용자가 읽을 수 있음

### 8. 테스트

1. Supabase Dashboard에서 테이블 생성 확인
2. 프론트엔드에서 Supabase 클라이언트 연결 확인
3. 인증 기능 테스트 (회원가입, 로그인)
4. 데이터 조회/저장 기능 테스트

## 마이그레이션 체크리스트

- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 스키마 적용
- [ ] 환경 변수 설정
- [ ] Supabase 클라이언트 설치 및 초기화
- [ ] 인증 시스템 마이그레이션
- [ ] API 서비스 마이그레이션
- [ ] 프론트엔드 API 호출 변경
- [ ] RLS 정책 확인
- [ ] 테스트 완료

## 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase JavaScript 클라이언트](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth 가이드](https://supabase.com/docs/guides/auth)


