# user_settings INSERT 정책 적용 가이드

## 문제 상황
로그인 시 `public.users` 프로필이 자동 생성되지만, 트리거가 `public.user_settings`에 INSERT를 시도할 때 RLS 정책이 없어서 실패합니다.

## 해결 방법

### 1. Supabase Dashboard에서 SQL 실행

**SQL Editor**로 이동하여 아래 SQL을 실행하세요:

```sql
-- user_settings 테이블에 INSERT 정책 추가
CREATE POLICY "Users can insert own settings" 
ON public.user_settings
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

### 2. 정책 확인

정책이 제대로 생성되었는지 확인:

```sql
-- 정책 목록 확인
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
WHERE tablename = 'user_settings'
ORDER BY policyname;
```

예상 결과:
- `Users can view own settings` (SELECT)
- `Users can insert own settings` (INSERT) ← 새로 추가된 정책
- `Users can update own settings` (UPDATE)

### 3. 테스트

1. 브라우저에서 로그아웃 (기존 세션 정리)
2. 새로 회원가입 또는 로그인
3. 브라우저 콘솔 확인:
   - ✅ `Failed to create user profile on demand` 에러가 없어야 함
   - ✅ `Failed to load user profile` 에러가 없어야 함
4. 헤더 확인:
   - ✅ 사용자 이름/이메일이 표시되어야 함
   - ✅ 로그아웃 버튼이 표시되어야 함
   - ✅ "로그인" 버튼이 사라져야 함

### 4. 데이터베이스 확인

```sql
-- users 테이블에 프로필이 생성되었는지 확인
SELECT id, email, name, nickname, is_active, created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 5;

-- user_settings 테이블에 설정이 생성되었는지 확인
SELECT user_id, theme, language, notifications_enabled, created_at
FROM public.user_settings
ORDER BY created_at DESC
LIMIT 5;
```

## 트러블슈팅

### 정책이 이미 존재하는 경우
```sql
-- 기존 정책 삭제 후 재생성
DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;

CREATE POLICY "Users can insert own settings" 
ON public.user_settings
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

### 여전히 에러가 발생하는 경우
1. 브라우저 콘솔의 정확한 에러 메시지 확인
2. Supabase Dashboard의 Logs 섹션에서 API 에러 확인
3. RLS가 활성화되어 있는지 확인:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename = 'user_settings';
   ```
   `rowsecurity`가 `true`여야 합니다.

