# Supabase 백엔드 전환 완료

## ✅ 완료된 작업

### 1. API 서비스 전환
- ✅ `src/services/api.ts` - 모든 API가 Supabase 쿼리로 전환됨
- ✅ 추가된 메서드:
  - `saveAIAnalysis()` - AI 분석 결과 저장
  - `getAIAnalysis()` - AI 분석 이력 조회
  - `getUserSettings()` - 사용자 설정 조회
  - `updateUserSettings()` - 사용자 설정 업데이트
  - `getUserConsents()` - 동의 설정 조회
  - `updateUserConsents()` - 동의 설정 업데이트
  - `getMonthlyStatistics()` - 월별 통계 조회

### 2. 페이지 컴포넌트 전환
- ✅ `AIAnalysis.tsx` - Supabase 연동 완료
- ✅ `Statistics.tsx` - 실제 데이터 조회로 전환
- ✅ `Settings.tsx` - Supabase user_settings, user_consents 테이블 연동

### 3. 인증 시스템
- ✅ `AuthContext.tsx` - 이미 Supabase Auth 사용 중

### 4. 설정 파일 정리
- ✅ `wrangler.toml` - Cloudflare Workers API URL 제거
- ✅ `.env.example` - Supabase 환경 변수만 포함

## 🔧 환경 변수 설정

### 로컬 개발
`.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Cloudflare Pages 배포
Cloudflare Pages 대시보드에서 환경 변수를 설정하세요:
- Settings > Environment Variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📊 데이터베이스 스키마

Supabase에서 다음 테이블들이 필요합니다:
- `users` - 사용자 프로필
- `user_progress` - 사용자 진행률
- `macchain_plan` - 읽기 계획
- `reading_progress` - 읽기 진행률
- `user_settings` - 사용자 설정
- `user_consents` - 동의 설정
- `ai_analysis` - AI 분석 결과

스키마는 `backend/supabase/database/schema.sql`에 정의되어 있습니다.

## 🚀 배포

### Cloudflare Pages
```bash
# 자동 배포 (GitHub Push 시)
git push origin main

# 수동 배포
cd macchain-frontend
npm run build
wrangler pages deploy dist --project-name macchain-frontend
```

## ⚠️ 주의사항

1. **Cloudflare Workers 제거**: 더 이상 Cloudflare Workers API를 사용하지 않습니다.
2. **Supabase RLS**: Row Level Security가 활성화되어 있어 사용자는 자신의 데이터만 접근할 수 있습니다.
3. **AI 분석**: 현재는 Mock 데이터를 저장합니다. 실제 AI 분석은 Supabase Edge Functions로 구현해야 합니다.

## 📝 다음 단계

1. Supabase Edge Functions로 AI 분석 기능 구현
2. Cloudflare Workers 디렉토리 정리 (선택사항)
3. Spring Boot 백엔드 정리 (선택사항)


