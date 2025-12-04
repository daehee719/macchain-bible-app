# 로그인 프로필 로딩 문제 디버깅 가이드

## 현재 문제
"User signed in, loading profile..." 로그 이후에 멈춰있음

## 디버깅 단계

### 1. 브라우저 콘솔 확인
다음 로그들이 순서대로 나타나는지 확인:

```
✅ User signed in, loading profile...
✅ Loading user profile for: [user-id] [email]
✅ Executing profile query...
```

**여기서 멈춘다면:**
- 네트워크 문제일 수 있음
- Supabase RLS 정책 문제일 수 있음
- Supabase 서버 응답 지연

### 2. Supabase RLS 정책 확인

Supabase Dashboard → SQL Editor에서 실행:

```sql
-- users 테이블의 RLS 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
```

**필요한 정책:**
- `Users can view own profile` (SELECT) - `auth.uid() = id`
- `Users can insert profile` (INSERT) - `auth.uid() = id` 또는 `true`

### 3. 현재 사용자 확인

```sql
-- 현재 인증된 사용자 ID 확인 (Supabase Dashboard에서 실행 불가, API로만 가능)
-- 대신 users 테이블에 데이터가 있는지 확인
SELECT id, email, name, created_at 
FROM public.users 
ORDER BY created_at DESC 
LIMIT 5;
```

### 4. 네트워크 탭 확인

브라우저 개발자 도구 → Network 탭:
1. 로그인 후 `/rest/v1/users?select=*&id=eq.[user-id]` 요청 확인
2. 요청 상태:
   - **Pending**: 네트워크 문제 또는 서버 응답 없음
   - **401 Unauthorized**: RLS 정책 문제
   - **406 Not Acceptable**: `.single()` 사용 시 데이터 없음 (정상, 프로필 생성 시도)
   - **200 OK**: 정상

### 5. Supabase 클라이언트 초기화 확인

브라우저 콘솔에서:
```javascript
// Supabase 클라이언트가 제대로 초기화되었는지 확인
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
```

### 6. 수동 프로필 생성 테스트

Supabase Dashboard → SQL Editor:

```sql
-- 특정 사용자 ID로 프로필 수동 생성 (테스트용)
-- 실제 사용자 ID로 교체 필요
INSERT INTO public.users (id, email, name, nickname, is_active)
VALUES (
  '실제-auth-users-id',
  'test@example.com',
  'Test User',
  'Test',
  true
)
ON CONFLICT (id) DO NOTHING;
```

### 7. RLS 정책 재생성

만약 정책이 없거나 잘못되었다면:

```sql
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert profile" ON public.users;

-- SELECT 정책 재생성
CREATE POLICY "Users can view own profile" 
ON public.users
FOR SELECT 
USING (auth.uid() = id);

-- INSERT 정책 재생성
CREATE POLICY "Users can insert profile" 
ON public.users
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);
```

### 8. Supabase 로그 확인

Supabase Dashboard → Logs → API Logs:
- 최근 요청 확인
- 에러 메시지 확인
- 응답 시간 확인

## 일반적인 해결 방법

### 방법 1: RLS 정책 확인 및 수정
위의 7번 단계 실행

### 방법 2: 브라우저 캐시 및 세션 정리
1. 브라우저 개발자 도구 → Application → Local Storage
2. `sb-[project-ref]-auth-token` 삭제
3. 페이지 새로고침
4. 다시 로그인

### 방법 3: Supabase 프로젝트 재연결
`.env` 파일 확인:
```
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
```

## 예상 원인별 해결책

### 원인 1: RLS 정책 없음
→ 위의 7번 단계 실행

### 원인 2: 네트워크 문제
→ Supabase Dashboard에서 프로젝트 상태 확인
→ 인터넷 연결 확인

### 원인 3: Supabase 서버 지연
→ 잠시 후 재시도
→ Supabase Status 페이지 확인

### 원인 4: 잘못된 사용자 ID
→ 로그인 후 `supabase.auth.getUser()`로 실제 사용자 ID 확인
→ `public.users` 테이블의 `id`와 일치하는지 확인

