# MacChain Mobile (Expo + React Native)

MacChain 웹 앱을 네이티브 모바일 앱으로 전환한 프로젝트입니다.

## 현재 상태

### ✅ 완료된 작업
- Expo 프로젝트 생성
- 기본 패키지 설치 (Supabase, React Query, React Navigation, NativeWind 등)
- 기본 네비게이션 구조 설정
- Supabase 클라이언트 설정 (SecureStore 사용)
- 기본 화면 구조 생성

### 🔄 진행 중
- 페이지 컴포넌트 마이그레이션
- 스타일링 시스템 통합

### 📋 남은 작업
1. **AuthContext 마이그레이션**
   - React Native용 SecureStore 통합
   - 세션 관리 로직 조정

2. **페이지 컴포넌트 마이그레이션**
   - Login → LoginScreen
   - Dashboard → DashboardScreen
   - ReadingPlan → ReadingPlanScreen
   - AIAnalysis → AIAnalysisScreen
   - Community → CommunityScreen
   - Statistics → StatisticsScreen
   - Settings → SettingsScreen

3. **공통 컴포넌트 마이그레이션**
   - Card → React Native View/Styled Component
   - Header → React Native Header
   - Loading → React Native ActivityIndicator 또는 커스텀 애니메이션

4. **스타일링**
   - Tailwind CSS → NativeWind
   - 다크모드 지원
   - 반응형 디자인

5. **API 서비스**
   - 웹 버전과 동일한 로직 재사용
   - React Native 환경에 맞게 조정

## 환경 변수 설정

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

또는 `app.json`의 `extra` 필드에 추가:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "your_supabase_url",
      "supabaseAnonKey": "your_supabase_anon_key"
    }
  }
}
```

## 실행 방법

```bash
# 개발 서버 시작
npm start

# iOS 시뮬레이터에서 실행
npm run ios

# Android 에뮬레이터에서 실행
npm run android

# 웹 브라우저에서 실행 (테스트용)
npm run web
```

## 프로젝트 구조

```
macchain-mobile/
├── src/
│   ├── lib/
│   │   └── supabase.ts          # Supabase 클라이언트
│   ├── screens/                 # 화면 컴포넌트
│   │   ├── LoginScreen.tsx
│   │   └── DashboardScreen.tsx
│   ├── components/              # 공통 컴포넌트 (예정)
│   ├── contexts/               # Context API (예정)
│   ├── services/               # API 서비스 (예정)
│   └── utils/                  # 유틸리티 함수 (예정)
├── App.tsx                     # 메인 앱 컴포넌트
├── app.json                    # Expo 설정
├── tailwind.config.js          # Tailwind CSS 설정
└── babel.config.js             # Babel 설정
```

## 주요 변경 사항 (웹 → 모바일)

1. **라우팅**: `react-router-dom` → `@react-navigation/native`
2. **스타일링**: Tailwind CSS → NativeWind (Tailwind for React Native)
3. **스토리지**: `localStorage` → `expo-secure-store`
4. **아이콘**: `lucide-react` → `@expo/vector-icons`
5. **토스트**: `sonner` → `react-native-toast-message`

## 다음 단계

1. AuthContext 마이그레이션 완료
2. LoginScreen 구현
3. DashboardScreen 구현
4. 나머지 화면들 순차적으로 마이그레이션

