# 프론트엔드 Supabase 마이그레이션 가이드

## 현재 상황

### 현재 구조 (Cloudflare Workers)
```typescript
// src/services/api.ts
const API_BASE_URL = 'https://macchain-api-public.daeheuigang.workers.dev';

// 직접 fetch로 API 호출
fetch(`${API_BASE_URL}/api/auth/login`, {
  method: 'POST',
  body: JSON.stringify({ email, password })
})
```

### 변경 후 구조 (Supabase)
```typescript
// src/lib/supabase.ts
import { supabase } from './lib/supabase'

// Supabase 클라이언트 사용
await supabase.auth.signInWithPassword({ email, password })
```

## 프론트엔드에서 변경해야 할 작업

### 1. 인증 시스템 변경 (가장 중요)

#### 현재: `src/contexts/AuthContext.tsx`
```typescript
// ❌ 현재: Cloudflare Workers API 호출
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
})
```

#### 변경 후: Supabase Auth 사용
```typescript
// ✅ 변경 후: Supabase Auth
import { supabase } from '../lib/supabase'

const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})
```

**변경 사항:**
- `fetch('/api/auth/login')` → `supabase.auth.signInWithPassword()`
- `fetch('/api/auth/register')` → `supabase.auth.signUp()`
- JWT 토큰 수동 관리 → Supabase가 자동 관리
- `localStorage`에 토큰 저장 → Supabase가 자동 저장

### 2. API 서비스 변경

#### 현재: `src/services/api.ts`
```typescript
// ❌ 현재: Cloudflare Workers API
async getTodayPlan() {
  return this.request('/api/mccheyne/today')
}
```

#### 변경 후: Supabase 클라이언트
```typescript
// ✅ 변경 후: Supabase 직접 쿼리
import { supabase } from '../lib/supabase'

async getTodayPlan() {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('macchain_plan')
    .select('*')
    .eq('date', today)
    .single()
  return data
}
```

**변경 사항:**
- `fetch('/api/macchain/today')` → `supabase.from('macchain_plan').select()`
- `fetch('/api/users/profile')` → `supabase.from('users').select()`
- `fetch('/api/statistics/user')` → `supabase.from('user_progress').select()`

### 3. 데이터 조회 패턴 변경

#### 예시 1: 읽기 계획 조회
```typescript
// ❌ 현재
const response = await fetch(`${API_BASE_URL}/api/mccheyne/today`)
const data = await response.json()

// ✅ 변경 후
const { data, error } = await supabase
  .from('macchain_plan')
  .select('*')
  .eq('date', today)
  .single()
```

#### 예시 2: 사용자 진행률 조회
```typescript
// ❌ 현재
const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
  headers: { 'Authorization': `Bearer ${token}` }
})

// ✅ 변경 후
const { data, error } = await supabase
  .from('user_progress')
  .select('*')
  .eq('user_id', userId)
  .single()
```

#### 예시 3: 진행률 업데이트
```typescript
// ❌ 현재
await fetch(`${API_BASE_URL}/api/mccheyne/${date}/progress`, {
  method: 'POST',
  body: JSON.stringify({ reading_id: 1, is_completed: true })
})

// ✅ 변경 후
await supabase
  .from('reading_progress')
  .upsert({
    user_id: userId,
    plan_date: date,
    reading_id: 1,
    is_completed: true
  })
```

## 구체적인 변경 작업 목록

### 작업 1: AuthContext 마이그레이션
**파일**: `src/contexts/AuthContext.tsx`

**변경 내용:**
1. `supabase` import 추가
2. `login()` 함수를 `supabase.auth.signInWithPassword()`로 변경
3. `register()` 함수를 `supabase.auth.signUp()`로 변경
4. `logout()` 함수를 `supabase.auth.signOut()`로 변경
5. 세션 관리를 Supabase Auth에 위임
6. `useEffect`에서 `supabase.auth.getSession()`으로 세션 확인

### 작업 2: API 서비스 마이그레이션
**파일**: `src/services/api.ts`

**변경 내용:**
1. `API_BASE_URL` 제거
2. `supabase` import 추가
3. 모든 메서드를 Supabase 쿼리로 변경:
   - `getTodayPlan()` → `supabase.from('macchain_plan')`
   - `getUserProfile()` → `supabase.from('users')`
   - `getUserStatistics()` → `supabase.from('user_progress')`

### 작업 3: 페이지 컴포넌트 업데이트
**파일들:**
- `src/pages/ReadingPlan.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/Statistics.tsx`
- `src/pages/AIAnalysis.tsx`

**변경 내용:**
- `apiService` 호출을 `supabase` 직접 호출로 변경
- 에러 처리 방식 변경 (Supabase 에러 형식)

## 장점

### 1. 코드 간소화
- REST API 엔드포인트 작성 불필요
- 직접 데이터베이스 쿼리 가능
- 타입 안정성 향상

### 2. 인증 자동화
- JWT 토큰 자동 관리
- 세션 자동 갱신
- 보안 정책 자동 적용 (RLS)

### 3. 실시간 기능
- Supabase Realtime으로 실시간 업데이트 가능
- WebSocket 기반 실시간 동기화

## 주의사항

1. **RLS 정책**: Supabase의 Row Level Security가 자동으로 적용됩니다.
   - 사용자는 자신의 데이터만 조회/수정 가능
   - 인증된 사용자만 공개 데이터 조회 가능

2. **에러 처리**: Supabase는 `{ data, error }` 형식으로 반환합니다.
   ```typescript
   const { data, error } = await supabase.from('users').select()
   if (error) {
     console.error('Error:', error)
     return
   }
   // data 사용
   ```

3. **타입 안정성**: Supabase TypeScript 타입을 생성하여 사용 가능합니다.
   ```bash
   npx supabase gen types typescript --project-id dazushjgczteromlitve > src/types/supabase.ts
   ```

## 마이그레이션 순서

1. ✅ Supabase 클라이언트 설정 (완료)
2. ⏳ AuthContext 마이그레이션
3. ⏳ API 서비스 마이그레이션
4. ⏳ 페이지 컴포넌트 업데이트
5. ⏳ 테스트 및 검증


