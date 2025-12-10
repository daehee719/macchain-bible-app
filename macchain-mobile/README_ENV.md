# 환경 변수 설정 가이드

## 📋 환경별 Supabase 설정

이 프로젝트는 개발 환경과 프로덕션 환경에서 다른 Supabase 프로젝트를 사용합니다.

### 개발 환경 (Development)
- **Supabase 프로젝트**: `macchain-dev`
- **URL**: `https://lhtufwymxsidfdolqmus.supabase.co`
- **설정 파일**: `.env.development`

### 프로덕션 환경 (Production)
- **Supabase 프로젝트**: 프로덕션 프로젝트
- **URL**: `https://dazushjgczteromlitve.supabase.co`
- **설정 파일**: `.env.production`

## 🚀 사용 방법

### 로컬 개발
```bash
# 개발 환경으로 실행 (기본값)
NODE_ENV=development npx expo start

# 또는 .env 파일을 직접 사용
cp .env.development .env
npx expo start
```

### 프로덕션 빌드
```bash
# 프로덕션 환경으로 빌드
NODE_ENV=production npx expo build

# 또는 .env 파일 교체
cp .env.production .env
npx expo build
```

### EAS Build (Expo Application Services)
EAS Build를 사용할 경우, EAS 대시보드에서 환경 변수를 설정해야 합니다:

1. [Expo Dashboard](https://expo.dev) 접속
2. 프로젝트 선택 → **Secrets** 탭
3. 다음 환경 변수 추가:
   - **Development**: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - **Production**: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 📁 파일 구조

```
macchain-mobile/
├── .env.development    # 개발 환경 설정 (커밋 가능)
├── .env.production     # 프로덕션 환경 설정 (커밋 불가)
├── .env                # 현재 사용 중인 환경 설정 (자동 생성)
└── app.config.js       # Expo 설정 파일 (환경 변수 로드)
```

## ⚠️ 주의사항

1. **`.env.production` 파일은 절대 커밋하지 마세요**
   - 프로덕션 Anon Key가 포함되어 있습니다
   - `.gitignore`에 포함되어 있습니다

2. **환경 변수 확인**
   - 앱 실행 시 콘솔에 `✅ Supabase 클라이언트 초기화 완료` 메시지가 표시되어야 합니다
   - 오류가 발생하면 환경 변수가 올바르게 로드되었는지 확인하세요

3. **환경별 동작**
   - 개발 환경: 개발 Supabase 프로젝트 (`macchain-dev`) 사용
   - 프로덕션 환경: 프로덕션 Supabase 프로젝트 사용

