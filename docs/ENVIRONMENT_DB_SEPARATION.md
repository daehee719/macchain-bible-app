# 환경별 데이터베이스 분리 가이드

## 📋 개요

프로덕션과 개발 환경에서 데이터베이스를 분리하여:
- 프로덕션 데이터 보호
- 개발/테스트 시 프로덕션 데이터 오염 방지
- 안전한 개발 환경 제공

## 🎯 권장 방법: 별도의 Supabase 프로젝트 사용

### 옵션 1: 프로덕션 + 개발 프로젝트 분리 (권장) ⭐

**구조:**
- **Production**: `dazushjgczteromlitve` (현재 프로젝트)
- **Development/Staging**: 새 프로젝트 생성

**장점:**
- 완전한 데이터 분리
- 독립적인 스키마 관리
- 프로덕션 데이터 보호

### 옵션 2: 같은 프로젝트, 다른 스키마 사용

**구조:**
- 같은 Supabase 프로젝트 내에서
- `public` (프로덕션), `staging`, `development` 스키마로 구분

**장점:**
- 비용 절감 (프로젝트 1개)
- 관리 용이

**단점:**
- 실수로 프로덕션 데이터 접근 가능성
- 완전한 분리 불가

## 🚀 구현 방법 (옵션 1: 권장)

### 1단계: 개발용 Supabase 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. **New Project** 클릭
3. 프로젝트 정보 입력:
   - **Name**: `macchain-dev` (또는 원하는 이름)
   - **Database Password**: 안전한 비밀번호 설정
   - **Region**: 개발 환경에 가까운 지역 선택
4. 프로젝트 생성 완료 대기 (약 2분)

### 2단계: 개발 프로젝트 스키마 적용

1. 새 프로젝트의 **SQL Editor**로 이동
2. `backend/supabase/database/schema.sql` 파일 내용 실행
3. 스키마가 정상적으로 생성되었는지 확인

### 3단계: 프로젝트 정보 확인

개발 프로젝트에서 다음 정보 확인:
- **Project URL**: `https://[project-ref].supabase.co`
- **Anon Key**: Settings → API → Project API keys → `anon` `public`

### 4단계: Vercel 환경 변수 설정

Vercel 대시보드에서 환경별로 다른 Supabase 프로젝트 설정:

#### Production 환경
1. Vercel 프로젝트 → **Settings** → **Environment Variables**
2. `VITE_SUPABASE_URL` (Production)
   - Value: `https://dazushjgczteromlitve.supabase.co`
3. `VITE_SUPABASE_ANON_KEY` (Production)
   - Value: 프로덕션 Anon Key

#### Preview 환경 (develop 브랜치, PR)
1. `VITE_SUPABASE_URL` (Preview)
   - Value: 개발 프로젝트 URL
2. `VITE_SUPABASE_ANON_KEY` (Preview)
   - Value: 개발 프로젝트 Anon Key

#### Development 환경 (로컬 개발)
1. `VITE_SUPABASE_URL` (Development)
   - Value: 개발 프로젝트 URL
2. `VITE_SUPABASE_ANON_KEY` (Development)
   - Value: 개발 프로젝트 Anon Key

### 5단계: 로컬 개발 환경 설정

로컬 개발 시 `.env.local` 파일 생성:

```bash
cd macchain-frontend
```

`.env.local` 파일 생성:
```env
# 개발용 Supabase 프로젝트 (macchain-dev)
VITE_SUPABASE_URL=https://lhtufwymxsidfdolqmus.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodHVmd3lteHNpZGZkb2xxbXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzk5NDcsImV4cCI6MjA4MDcxNTk0N30.noeXx9XZxxKu6I82Rg2Y06_c7TZGedaLpDKuL0t3hvs
```

⚠️ **주의**: `.env.local`은 `.gitignore`에 포함되어 있어야 합니다. (이미 포함되어 있음)

**로컬 개발 서버 실행:**
```bash
npm run dev
```

로컬 개발 서버는 `.env.local` 파일의 환경 변수를 자동으로 사용합니다.

## 📊 환경별 매핑

| 환경 | 브랜치 | Supabase 프로젝트 | 프로젝트 ID | Vercel 환경 |
|------|--------|------------------|------------|------------|
| Production | `main` | `dazushjgczteromlitve` | `dazushjgczteromlitve` | Production |
| Preview | `develop`, PR | `macchain-dev` | `lhtufwymxsidfdolqmus` | Preview |
| Development | 로컬 | `macchain-dev` | `lhtufwymxsidfdolqmus` | Development |

### 프로젝트 정보

**프로덕션 프로젝트:**
- 이름: `daehee719's Project`
- URL: `https://dazushjgczteromlitve.supabase.co`
- Project ID: `dazushjgczteromlitve`

**개발 프로젝트:**
- 이름: `macchain-dev`
- URL: `https://lhtufwymxsidfdolqmus.supabase.co`
- Project ID: `lhtufwymxsidfdolqmus`

## 🔄 마이그레이션 전략

### 개발 → 프로덕션 데이터 마이그레이션

필요시 개발 환경에서 테스트한 데이터를 프로덕션으로 마이그레이션:

```sql
-- 개발 프로젝트에서 데이터 export
-- 프로덕션 프로젝트로 import
```

또는 Supabase CLI 사용:
```bash
supabase db dump --project-ref [dev-project-ref] > dev-data.sql
supabase db reset --project-ref [prod-project-ref] < dev-data.sql
```

## 🛡️ 보안 고려사항

1. **프로덕션 Anon Key 보호**
   - 절대 개발 환경에서 사용하지 않기
   - Vercel Production 환경에만 설정

2. **RLS (Row Level Security) 정책**
   - 각 환경별로 적절한 RLS 정책 설정
   - 개발 환경은 더 관대한 정책 가능

3. **환경 변수 관리**
   - `.env.local`은 절대 커밋하지 않기
   - Vercel 환경 변수는 적절한 환경에만 설정

## ✅ 완료된 작업

- [x] 개발용 Supabase 프로젝트 생성 (`macchain-dev`, `lhtufwymxsidfdolqmus`)
- [x] 개발 프로젝트에 스키마 적용
- [x] Vercel Production 환경 변수 설정 (프로덕션 DB: `dazushjgczteromlitve`)
- [x] Vercel Preview 환경 변수 설정 (개발 DB: `lhtufwymxsidfdolqmus`)
- [x] Vercel Development 환경 변수 설정 (개발 DB: `lhtufwymxsidfdolqmus`)
- [x] Edge Function 배포 (`check-email`)
  - [x] 프로덕션 프로젝트 (`dazushjgczteromlitve`)
  - [x] 개발 프로젝트 (`lhtufwymxsidfdolqmus`)

## 📝 남은 작업

- [ ] 로컬 `.env.local` 파일 생성
- [ ] 환경별 배포 테스트

## 🔍 환경 확인 방법

### 프로덕션 환경 확인
```javascript
// 브라우저 콘솔에서
console.log(import.meta.env.VITE_SUPABASE_URL)
// 예상: https://dazushjgczteromlitve.supabase.co
```

### 개발 환경 확인
```javascript
// 로컬 개발 서버에서
console.log(import.meta.env.VITE_SUPABASE_URL)
// 예상: https://[dev-project-ref].supabase.co
```

## 💡 추가 팁

### 환경별 기능 플래그
환경 변수를 활용하여 환경별 기능 제어:

```typescript
const isProduction = import.meta.env.VITE_SUPABASE_URL.includes('dazushjgczteromlitve')
const isDevelopment = !isProduction

if (isDevelopment) {
  console.log('🔧 개발 모드')
  // 개발 전용 기능 활성화
}
```

### 데이터 시드
개발 환경에 테스트 데이터 자동 생성:

```typescript
// 개발 환경에서만 실행
if (isDevelopment) {
  await seedTestData()
}
```

