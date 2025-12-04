# 이메일 인증 플로우 설명

## 📧 회원가입 및 이메일 인증 프로세스

### 1. 회원가입 시 (`supabase.auth.signUp()`)

1. **Supabase Auth 처리**
   - `auth.users` 테이블에 사용자 레코드 생성
   - `email_confirmed_at` 필드는 **NULL**로 시작 (인증 전)
   - `raw_user_meta_data`에 `name`, `nickname` 저장

2. **Database Trigger 자동 실행**
   - `on_auth_user_created` 트리거가 자동 실행
   - `public.users` 테이블에 프로필 자동 생성
   - `user_metadata`에서 `name`, `nickname` 가져오기

3. **이메일 발송**
   - Supabase가 인증 이메일 자동 발송
   - 이메일에는 `/verify-email`로 리다이렉트되는 링크 포함

### 2. 이메일 인증 링크 클릭 시

1. **사용자가 이메일의 "Confirm your mail" 링크 클릭**
   - Supabase 인증 서버로 리다이렉트
   - 토큰 검증 및 인증 처리

2. **인증 완료 후**
   - `auth.users.email_confirmed_at` 필드 업데이트 (NULL → 현재 시간)
   - `on_auth_user_email_confirmed` 트리거 자동 실행
   - `public.users`에 프로필이 없으면 자동 생성

3. **프론트엔드로 리다이렉트**
   - `/verify-email` 페이지로 이동
   - URL 해시에 `access_token` 포함
   - Supabase 클라이언트가 자동으로 세션 생성

4. **인증 완료 화면 표시**
   - 성공 메시지 및 축하 화면
   - 3초 후 자동으로 대시보드(`/`)로 이동

### 3. 데이터베이스 구조

#### `auth.users` (Supabase Auth 관리)
- `id`: UUID (Primary Key)
- `email`: 이메일 주소
- `email_confirmed_at`: 이메일 인증 완료 시간 (NULL = 미인증)
- `raw_user_meta_data`: 회원가입 시 전달한 메타데이터 (`name`, `nickname` 등)

#### `public.users` (애플리케이션 프로필)
- `id`: UUID (Foreign Key → `auth.users.id`)
- `email`: 이메일 주소
- `name`: 사용자 이름
- `nickname`: 닉네임
- `is_active`: 활성 상태

### 4. 자동 동기화 메커니즘

#### Trigger 1: `on_auth_user_created`
- **시점**: `auth.users`에 새 사용자 INSERT 시
- **동작**: `public.users`에 프로필 자동 생성
- **목적**: 회원가입 즉시 프로필 생성

#### Trigger 2: `on_auth_user_email_confirmed`
- **시점**: `auth.users.email_confirmed_at`이 NULL → NOT NULL로 변경 시
- **동작**: `public.users`에 프로필이 없으면 생성
- **목적**: 이메일 인증 완료 시점에 프로필 보장

### 5. 프론트엔드 처리

#### `AuthContext.tsx`의 `loadUserProfile` 함수
- 로그인 시 `public.users`에서 프로필 조회
- 프로필이 없으면 (`PGRST116` 에러) 자동 생성 시도
- 이중 안전장치로 프로필 보장

## ✅ 확인 사항

### Supabase 대시보드에서 확인

1. **Authentication → Users**
   - 회원가입한 사용자 확인
   - `Email Confirmed` 컬럼 확인 (인증 전: 빈 값, 인증 후: 체크 표시)

2. **Table Editor → users**
   - `public.users` 테이블에 프로필이 생성되었는지 확인
   - `id`가 `auth.users`의 `id`와 일치하는지 확인

3. **Database → Functions**
   - `handle_new_user` 함수 확인
   - `handle_email_confirmed` 함수 확인

4. **Database → Triggers**
   - `on_auth_user_created` 트리거 확인
   - `on_auth_user_email_confirmed` 트리거 확인

## 🔍 문제 해결

### 프로필이 생성되지 않는 경우

1. **트리거 확인**
   ```sql
   SELECT * FROM information_schema.triggers 
   WHERE event_object_schema = 'auth' AND event_object_table = 'users';
   ```

2. **함수 확인**
   ```sql
   SELECT routine_name, routine_definition 
   FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_name IN ('handle_new_user', 'handle_email_confirmed');
   ```

3. **수동 프로필 생성**
   ```sql
   INSERT INTO public.users (id, email, name, nickname, is_active)
   SELECT 
     id,
     email,
     COALESCE((raw_user_meta_data->>'name')::text, email),
     COALESCE((raw_user_meta_data->>'nickname')::text, (raw_user_meta_data->>'name')::text, email),
     true
   FROM auth.users
   WHERE id NOT IN (SELECT id FROM public.users);
   ```

## 📝 요약

- ✅ 회원가입 시 `auth.users`에 사용자 생성
- ✅ Database Trigger가 `public.users`에 프로필 자동 생성
- ✅ 이메일 인증 완료 시 `email_confirmed_at` 업데이트
- ✅ 이메일 인증 완료 시점에도 프로필 생성 보장
- ✅ 프론트엔드에서도 프로필 없으면 자동 생성 (이중 안전장치)

