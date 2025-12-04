# 프로필 로딩 문제 빠른 해결 가이드

## 현재 상황
- 프로필 데이터는 데이터베이스에 존재함 (ID: `1a8f7b24-29e2-4227-b11f-ded96182e6fb`)
- 하지만 쿼리가 응답을 받지 못함 ("Executing profile query..." 이후 멈춤)

## 가능한 원인

### 1. RLS 정책 문제 (가장 가능성 높음)
RLS 정책 `auth.uid() = id`가 작동하려면:
- 현재 로그인한 사용자의 `auth.uid()`와 프로필의 `id`가 **정확히 일치**해야 함
- 사용자 ID가 다르면 쿼리가 블로킹됨

### 2. 사용자 ID 불일치 확인

브라우저 콘솔에서 다음 로그 확인:
```
Current authenticated user ID: [실제-auth-id]
Profile lookup user ID: [프로필-id]
IDs match: true/false
```

**만약 `IDs match: false`라면:**
- 로그인한 사용자와 프로필 소유자가 다름
- 다른 계정으로 로그인했거나, 프로필이 다른 사용자 것임

## 해결 방법

### 방법 1: RLS 정책 확인 및 수정

Supabase Dashboard → SQL Editor:

```sql
-- 1. 현재 정책 확인
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'users';

-- 2. SELECT 정책이 없다면 생성
CREATE POLICY "Users can view own profile" 
ON public.users
FOR SELECT 
USING (auth.uid() = id);

-- 3. 정책이 너무 엄격하다면 임시로 완화 (테스트용)
-- 주의: 프로덕션에서는 사용하지 마세요!
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" 
ON public.users
FOR SELECT 
TO authenticated
USING (true);  -- 임시로 모든 인증된 사용자가 볼 수 있게
```

### 방법 2: 사용자 ID 확인 및 수정

브라우저 콘솔에서:
```javascript
// 현재 로그인한 사용자 ID 확인
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user ID:', user?.id)

// 프로필 ID와 비교
console.log('Profile ID:', '1a8f7b24-29e2-4227-b11f-ded96182e6fb')
console.log('Match:', user?.id === '1a8f7b24-29e2-4227-b11f-ded96182e6fb')
```

**ID가 다르다면:**
- 올바른 계정으로 로그인했는지 확인
- 또는 프로필을 올바른 사용자 ID로 수정

### 방법 3: 직접 쿼리 테스트

Supabase Dashboard → SQL Editor:

```sql
-- 현재 인증된 사용자로 직접 쿼리 (이건 Dashboard에서 실행 불가)
-- 대신 RLS를 일시적으로 비활성화하여 테스트

-- RLS 일시 비활성화 (테스트용만!)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 쿼리 테스트
SELECT * FROM public.users WHERE id = '1a8f7b24-29e2-4227-b11f-ded96182e6fb';

-- 테스트 후 RLS 다시 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

## 즉시 확인할 사항

1. **브라우저 콘솔 로그 확인:**
   - `Current authenticated user ID`와 `Profile lookup user ID` 비교
   - `IDs match: true/false` 확인

2. **Network 탭 확인:**
   - `/rest/v1/users` 요청의 Status Code
   - Response에 에러 메시지 있는지 확인

3. **Supabase Dashboard 확인:**
   - Authentication → Users에서 현재 로그인한 사용자 ID 확인
   - Table Editor → users에서 프로필 ID 확인
   - 두 ID가 일치하는지 확인

## 예상되는 해결책

가장 가능성 높은 해결책:
1. **RLS SELECT 정책이 없거나 잘못 설정됨** → 정책 생성/수정
2. **사용자 ID 불일치** → 올바른 계정으로 로그인 또는 프로필 수정

## 다음 단계

브라우저 콘솔에서 다음 정보를 확인해주세요:
1. `Current authenticated user ID`
2. `Profile lookup user ID`
3. `IDs match` 결과
4. Network 탭의 Status Code

이 정보를 알려주시면 정확한 해결 방법을 제시하겠습니다.

