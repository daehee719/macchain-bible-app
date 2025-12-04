# Supabase 이메일 인증 설정 가이드

## 📧 이메일 템플릿 리다이렉트 URL 설정

### 1. Supabase 대시보드에서 설정

1. **Supabase 대시보드 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 선택: `daehee719's Project` (dazushjgczteromlitve)

2. **Authentication → URL Configuration**
   - 좌측 메뉴에서 **Authentication** 클릭
   - **URL Configuration** 섹션으로 이동

3. **Site URL 설정**
   ```
   개발 환경: http://localhost:3000
   프로덕션: https://your-domain.com
   ```

4. **Redirect URLs 추가**
   다음 URL들을 추가하세요:
   ```
   http://localhost:3000/verify-email
   http://localhost:3000/verify-email/*
   https://your-domain.com/verify-email
   https://your-domain.com/verify-email/*
   ```

### 2. 이메일 템플릿 수정

1. **Authentication → Email Templates**
   - 좌측 메뉴에서 **Authentication** → **Email Templates** 클릭

2. **Confirm signup 템플릿 선택**
   - "Confirm signup" 템플릿을 선택하거나 편집

3. **리다이렉트 URL 수정**
   
   **기본 템플릿:**
   ```
   {{ .ConfirmationURL }}
   ```
   
   **수정된 템플릿:**
   ```
   {{ .SiteURL }}/verify-email#access_token={{ .Token }}&type=signup
   ```
   
   또는 더 간단하게:
   ```
   {{ .SiteURL }}/verify-email
   ```
   
   (Supabase가 자동으로 토큰을 URL 해시에 추가합니다)

4. **템플릿 저장**
   - 변경사항 저장

### 3. 코드에서 리다이렉트 URL 명시

회원가입 시 리다이렉트 URL을 명시적으로 설정할 수 있습니다:

```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/verify-email`,
    data: {
      name,
      nickname: nickname || name
    }
  }
})
```

## ✅ 확인 사항

1. **이메일 인증 링크 클릭 시**
   - `/verify-email` 페이지로 리다이렉트되는지 확인
   - URL에 `#access_token=...&type=signup` 파라미터가 포함되는지 확인

2. **인증 성공 후**
   - 자동으로 대시보드(`/`)로 이동하는지 확인
   - 사용자 세션이 정상적으로 생성되는지 확인

## 🔧 문제 해결

### 인증 링크가 작동하지 않는 경우

1. **Redirect URLs 확인**
   - Supabase 대시보드에서 Redirect URLs에 정확한 URL이 추가되었는지 확인
   - 와일드카드(`*`) 사용 가능

2. **Site URL 확인**
   - Site URL이 정확한지 확인
   - 개발 환경과 프로덕션 환경을 구분하여 설정

3. **이메일 템플릿 확인**
   - 이메일 템플릿의 리다이렉트 URL이 올바른지 확인
   - `{{ .SiteURL }}/verify-email` 형식 사용

4. **브라우저 콘솔 확인**
   - 개발자 도구 콘솔에서 에러 메시지 확인
   - 네트워크 탭에서 요청 상태 확인

## 📝 참고

- Supabase는 기본적으로 `detectSessionInUrl: true` 설정으로 URL 해시에서 토큰을 자동 감지합니다
- 이메일 인증 링크는 24시간 후 만료됩니다
- 만료된 링크는 `/verify-email` 페이지에서 적절한 에러 메시지를 표시합니다

