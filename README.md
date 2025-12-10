# 🙏 MacChain - 성경 읽기 플랫폼

> **AI 기반 성경 읽기 플랫폼** - Supabase, React, React Native로 구축된 웹 및 모바일 애플리케이션

## 📋 프로젝트 개요

MacChain은 성경을 체계적으로 읽고 공부할 수 있도록 도와주는 플랫폼입니다. McCheyne 읽기 계획을 기반으로 매일 성경을 읽고, AI 분석, 커뮤니티 기능, 통계 추적 등을 제공합니다.

### 주요 특징
- 📅 **McCheyne 읽기 계획**: 1년에 성경을 두 번 읽는 체계적인 계획
- 🤖 **AI 성경 분석**: 성경 구절에 대한 깊이 있는 분석
- 👥 **커뮤니티**: 다른 성도들과 나눔과 교제
- 📊 **통계 추적**: 읽기 진행률, 연속 읽기 기록 등
- 🔄 **실시간 동기화**: 서버와 실시간으로 데이터 동기화
- 📱 **크로스 플랫폼**: 웹(React) 및 모바일(React Native/Expo) 지원
- 🔌 **오프라인 지원**: 네트워크가 없어도 작업 가능
- 🛡️ **중앙화된 오류 처리**: 지능적인 재시도 및 에러 관리

## 🏗️ 프로젝트 구조

```
MacChain/
├── macchain-frontend/          # React 웹 애플리케이션
│   ├── src/
│   │   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── pages/              # 페이지 컴포넌트
│   │   ├── contexts/           # React Context
│   │   ├── hooks/              # Custom Hooks
│   │   ├── services/           # API 서비스
│   │   ├── sync/               # 동기화 시스템 (핵심)
│   │   ├── lib/                # 라이브러리 설정
│   │   └── utils/              # 유틸리티
│   └── package.json
│
├── macchain-mobile/            # React Native 모바일 애플리케이션
│   ├── src/
│   │   ├── screens/            # 화면 컴포넌트
│   │   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── contexts/           # React Context
│   │   ├── hooks/              # Custom Hooks
│   │   ├── services/           # API 서비스
│   │   ├── sync/               # 동기화 시스템 (웹과 동일)
│   │   └── lib/                # 라이브러리 설정
│   └── package.json
│
├── backend/                    # 백엔드 설정
│   └── supabase/
│       └── database/
│           └── schema.sql     # 데이터베이스 스키마
│
└── docs/                       # 프로젝트 문서
```

## 🛠️ 기술 스택

### Frontend (Web)
- **React 18** + **TypeScript**
- **Vite** - 빌드 도구
- **React Router** - 라우팅
- **TanStack Query (React Query)** - 서버 상태 관리 및 캐싱
- **Supabase JS** - 백엔드 서비스
- **Tailwind CSS** - 스타일링
- **Lucide React** - 아이콘
- **Sonner** - Toast 알림

### Mobile
- **React Native** + **TypeScript**
- **Expo** - 개발 플랫폼
- **React Navigation** - 네비게이션
- **TanStack Query** - 서버 상태 관리
- **NativeWind** - Tailwind CSS for React Native
- **Expo Secure Store** - 보안 저장소
- **React Native Toast Message** - 알림

### Backend
- **Supabase** - BaaS (Backend as a Service)
  - PostgreSQL 데이터베이스
  - 인증 시스템
  - 실시간 구독 (Realtime)
  - Storage (파일 저장)
  - Edge Functions

### 동기화 시스템 (핵심 기능)
- **SyncManager**: 중앙화된 동기화 관리
- **TaskQueue**: 우선순위 기반 작업 큐
- **RealtimeSubscriber**: 실시간 구독 관리
- **MutationSyncManager**: 낙관적 업데이트 및 롤백
- **BatchProcessor**: 배치 처리로 성능 최적화
- **ErrorHandler**: 중앙화된 오류 처리 및 재시도 전략
- **Logger**: 상세한 로깅 시스템
- **OfflineQueue**: 오프라인 작업 큐
- **NetworkMonitor**: 네트워크 상태 모니터링

## 🚀 빠른 시작

### 사전 요구사항
- Node.js 18+ 
- npm 또는 yarn
- Supabase 계정 및 프로젝트

### 웹 애플리케이션 실행

\`\`\`bash
# 저장소 클론
git clone https://github.com/daehee719/macchain-bible-app.git
cd macchain-bible-app

# 프론트엔드 디렉토리로 이동
cd macchain-frontend

# 의존성 설치
npm install

# 환경 변수 설정 (.env 파일 생성)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:5173 접속
\`\`\`

### 모바일 애플리케이션 실행

\`\`\`bash
# 모바일 디렉토리로 이동
cd macchain-mobile

# 의존성 설치
npm install

# 환경 변수 설정 (.env.development 파일 생성)
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Expo 개발 서버 실행
npm start

# Expo Go 앱에서 QR 코드 스캔 또는 시뮬레이터 실행
\`\`\`

## 📚 주요 기능

### 1. McCheyne 읽기 계획
- 매일 구약 2장, 신약 2장 읽기
- 진행률 추적 및 완료 표시
- 주간/월간 통계

### 2. AI 성경 분석
- 성경 구절 입력 및 AI 분석
- 분석 이력 저장 및 조회
- 인사이트 제공

### 3. 커뮤니티
- 나눔 작성 및 공유
- 아멘(좋아요) 및 댓글
- 실시간 업데이트

### 4. 통계
- 총 읽은 날 수
- 연속 읽기 기록
- 완주율 추적
- 월별 진행률

### 5. 동기화 시스템
- **실시간 동기화**: Supabase Realtime을 통한 실시간 업데이트
- **오프라인 지원**: 네트워크 없이도 작업 가능, 재연결 시 자동 동기화
- **배치 처리**: 여러 작업을 한 번에 처리하여 성능 최적화
- **오류 처리**: 지능적인 재시도 전략 및 회로 차단기 패턴
- **로깅**: 상세한 동기화 로그 기록 및 모니터링

### 6. 설정
- 프로필 이미지 업로드
- 비밀번호 변경
- 동의 설정 관리
- 동기화 모니터링 대시보드

## 🔧 개발 가이드

### 환경 변수 설정

#### Frontend (.env)
\`\`\`env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

#### Mobile (.env.development, .env.production)
\`\`\`env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

### 데이터베이스 스키마 적용

\`\`\`bash
# Supabase 대시보드에서 SQL Editor 열기
# backend/supabase/database/schema.sql 파일 내용 실행
\`\`\`

### 빌드 및 배포

#### Frontend
\`\`\`bash
cd macchain-frontend
npm run build
# dist/ 폴더에 빌드 결과물 생성
\`\`\`

#### Mobile
\`\`\`bash
cd macchain-mobile
# Expo 빌드 (EAS Build 사용 권장)
eas build --platform ios
eas build --platform android
\`\`\`

## 📖 문서

### 핵심 문서
- [동기화 시스템 구현 완료](./docs/SYNC_IMPLEMENTATION_COMPLETE.md)
- [동기화 개선 기능 완료](./docs/SYNC_ENHANCEMENTS_COMPLETE.md)
- [오류 처리 중앙화](./docs/ERROR_HANDLING_CENTRALIZATION.md)
- [오프라인 동기화 구현](./docs/OFFLINE_SYNC_IMPLEMENTATION.md)
- [실시간 구독 가이드](./docs/REALTIME_SUBSCRIPTION.md)

### 배포 및 설정
- [Vercel 배포 가이드](./docs/VERCEL_SETUP_GUIDE.md)
- [Supabase 마이그레이션 가이드](./docs/SUPABASE_MIGRATION_GUIDE.md)
- [환경별 DB 분리](./docs/ENVIRONMENT_DB_SEPARATION.md)

### 개발 가이드
- [캐싱 전략](./docs/CACHE_STRATEGY.md)
- [스타일 개선](./docs/STYLE_IMPROVEMENT.md)
- [Git Flow 가이드](./docs/GIT_FLOW_GUIDE.md)

## 🏛️ 아키텍처

### 동기화 시스템 아키텍처

\`\`\`
┌─────────────────────────────────────────────────┐
│              SyncManager (중앙 관리자)          │
├─────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐           │
│  │  TaskQueue   │  │ BatchProcessor│           │
│  │ (작업 큐)     │  │ (배치 처리)   │           │
│  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ RealtimeSub  │  │ MutationSync │           │
│  │ (실시간 구독) │  │ (Mutation)    │           │
│  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ ErrorHandler │  │ Logger       │           │
│  │ (오류 처리)   │  │ (로깅)       │           │
│  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ OfflineQueue │  │ NetworkMonitor│           │
│  │ (오프라인 큐) │  │ (네트워크)    │           │
│  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────┘
\`\`\`

### 데이터 흐름

\`\`\`
사용자 액션
  ↓
React Component
  ↓
SyncManager.executeMutation() 또는 createTask()
  ↓
낙관적 업데이트 (UI 즉시 반영)
  ↓
서버 요청 (Supabase)
  ↓
성공: 최종 상태 동기화
실패: 롤백 + 재시도 (ErrorHandler)
  ↓
실시간 구독 (RealtimeSubscriber)
  ↓
다른 사용자에게 변경사항 전파
\`\`\`

## 🧪 테스트

### Frontend
\`\`\`bash
cd macchain-frontend

# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 타입 체크
npm run type-check

# 린트
npm run lint
\`\`\`

## 📊 성능 최적화

- **React Query 캐싱**: 데이터 자동 캐싱 및 무효화
- **배치 처리**: 여러 작업을 한 번에 처리
- **낙관적 업데이트**: 즉각적인 UI 반응
- **프리페칭**: 다음 페이지 데이터 미리 로드
- **데이터베이스 뷰**: N+1 쿼리 최적화
- **오프라인 지원**: 네트워크 없이도 작업 가능

## 🔒 보안

- **Supabase RLS**: Row Level Security로 데이터 보호
- **JWT 인증**: 안전한 인증 시스템
- **Secure Store**: 모바일에서 안전한 저장소 사용
- **HTTPS**: 모든 통신 암호화

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👨‍💻 개발자

**대희 강** - [GitHub](https://github.com/daehee719) - daehee719@gmail.com

## 🙏 감사의 말

- **Supabase** - 강력한 BaaS 플랫폼 제공
- **React Team** - 훌륭한 프론트엔드 프레임워크
- **Expo Team** - React Native 개발을 쉽게 만들어주는 도구
- **McCheyne** - 체계적인 성경 읽기 계획
- **오픈소스 커뮤니티** - 다양한 라이브러리와 도구

---

**MacChain**으로 매일 함께하는 성경 읽기 여행을 시작해보세요! 🙏
