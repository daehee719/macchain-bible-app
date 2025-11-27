# 프론트엔드 구조 분석

## 📁 디렉토리 구조

```
frontend/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── ui/             # UI 컴포넌트 (Tailwind 사용)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Chart.tsx
│   │   │   └── ...
│   │   ├── Layout/         # 레이아웃 컴포넌트
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── Header.tsx
│   │   ├── Card.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── Dashboard.tsx
│   │   ├── Login_v2.tsx     # Tailwind 사용 버전
│   │   ├── ReadingPlan_v2.tsx
│   │   ├── AIAnalysis_v2.tsx
│   │   ├── Community_v2.tsx
│   │   ├── Statistics_v2.tsx
│   │   ├── Settings_v2.tsx
│   │   └── [구버전 파일들]  # CSS 기반
│   │
│   ├── contexts/           # React Context
│   │   └── AuthContext.tsx
│   │
│   ├── services/           # API 서비스
│   │   └── api.ts
│   │
│   ├── styles/            # 스타일 파일
│   │   ├── tailwind.css   # Tailwind 입력 파일
│   │   ├── tailwind-output.css  # 빌드된 Tailwind CSS
│   │   ├── design-tokens.css
│   │   └── prototype.css
│   │
│   ├── App.tsx            # 메인 앱 컴포넌트
│   ├── main.tsx           # 진입점
│   └── index.css          # 글로벌 CSS
│
├── tailwind.config.cjs    # Tailwind 설정
├── postcss.config.cjs     # PostCSS 설정
└── vite.config.ts         # Vite 설정
```

## 🎨 스타일링 현황

### Tailwind CSS 사용 현황

**✅ Tailwind 설치 및 설정 완료**
- `tailwindcss@3.4.7` 설치됨
- `tailwind.config.cjs` 설정 파일 존재
- `postcss.config.cjs` 설정 완료
- `src/styles/tailwind.css` 입력 파일 존재

**✅ Tailwind 사용 중인 컴포넌트:**
1. **UI 컴포넌트** (`components/ui/`)
   - `Button.tsx` - Tailwind 클래스 사용
   - `Card.tsx` - Tailwind 클래스 사용
   - `Modal.tsx` - Tailwind 클래스 사용
   - `Table.tsx` - Tailwind 클래스 사용
   - `Input.tsx`, `TextArea.tsx` 등

2. **레이아웃 컴포넌트** (`components/Layout/`)
   - `Layout.tsx` - Tailwind 클래스 사용
   - `Sidebar.tsx` - Tailwind 클래스 사용
   - `Topbar.tsx` - Tailwind 클래스 사용

3. **페이지 컴포넌트** (`_v2.tsx` 파일들)
   - `Login_v2.tsx` - Tailwind 사용
   - `ReadingPlan_v2.tsx` - Tailwind 사용
   - `AIAnalysis_v2.tsx` - Tailwind 사용
   - `Community_v2.tsx` - Tailwind 사용
   - `Statistics_v2.tsx` - Tailwind 사용
   - `Settings_v2.tsx` - Tailwind 사용

**⚠️ CSS 기반 컴포넌트 (구버전):**
- `Login.tsx` - CSS 파일 사용 (`Login.css`)
- `Dashboard.tsx` - CSS 파일 사용 (`Dashboard.css`)
- `ReadingPlan.tsx` - CSS 파일 사용
- `Community.tsx` - CSS 파일 사용
- `Statistics.tsx` - CSS 파일 사용
- `Settings.tsx` - CSS 파일 사용

### 현재 상태

**하이브리드 구조:**
- ✅ 새로운 컴포넌트는 Tailwind 사용 (`_v2.tsx`)
- ⚠️ 기존 컴포넌트는 CSS 파일 사용
- ✅ `App.tsx`에서 `_v2` 버전 사용 중

## 🏗️ 컴포넌트 구조

### 1. UI 컴포넌트 (`components/ui/`)

**Tailwind 기반 재사용 컴포넌트:**
- `Button` - variant (primary/secondary/ghost), size 지원
- `Input` - 폼 입력 필드
- `Card` - 카드 컨테이너
- `Modal` - 모달 다이얼로그
- `Table` - 테이블 컴포넌트
- `Chart` - Chart.js 래퍼
- `Alert` - 알림 메시지
- `Badge` - 배지 컴포넌트
- `Progress` - 진행률 표시
- `Tabs` - 탭 컴포넌트

### 2. 레이아웃 컴포넌트 (`components/Layout/`)

**Tailwind 기반 레이아웃:**
- `Layout.tsx` - 메인 레이아웃 (Sidebar + Topbar)
- `Sidebar.tsx` - 사이드바 네비게이션
- `Topbar.tsx` - 상단 바
- `ThemeToggle.tsx` - 다크모드 토글

### 3. 페이지 컴포넌트

**현재 사용 중 (`_v2.tsx`):**
- `Dashboard.tsx` - 대시보드 (Tailwind)
- `Login_v2.tsx` - 로그인/회원가입 (Tailwind)
- `ReadingPlan_v2.tsx` - 읽기 계획 (Tailwind)
- `AIAnalysis_v2.tsx` - AI 분석 (Tailwind)
- `Community_v2.tsx` - 커뮤니티 (Tailwind)
- `Statistics_v2.tsx` - 통계 (Tailwind)
- `Settings_v2.tsx` - 설정 (Tailwind)

**구버전 (CSS 기반):**
- `Login.tsx`, `Dashboard.tsx` 등 - 사용 안 함

## 🔧 기술 스택

### 핵심 라이브러리
- **React 18.2.0** - UI 프레임워크
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **React Router 6.8.1** - 라우팅
- **Axios** - HTTP 클라이언트

### 스타일링
- **Tailwind CSS 3.4.7** - 유틸리티 CSS 프레임워크
- **PostCSS** - CSS 처리
- **Autoprefixer** - 브라우저 호환성

### UI 라이브러리
- **lucide-react** - 아이콘
- **Chart.js** - 차트
- **react-chartjs-2** - Chart.js React 래퍼

### 테스팅
- **Vitest** - 단위 테스트
- **Playwright** - E2E 테스트
- **Testing Library** - 컴포넌트 테스트

## 📊 Tailwind 설정

### tailwind.config.cjs

```javascript
{
  darkMode: 'class',  // 클래스 기반 다크모드
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        bg: '#f5f7fb',
        surface: '#ffffff',
        muted: '#6b7280',
        border: '#e6eef8'
      },
      borderRadius: {
        sm: '8px'
      }
    }
  }
}
```

### 빌드 프로세스

```bash
# Tailwind CSS 빌드
npm run css:build
# → tailwindcss -i src/styles/tailwind.css -o src/styles/tailwind-output.css --minify

# 전체 빌드
npm run build
# → npm run css:build && tsc && vite build
```

## 🎯 현재 사용 패턴

### Tailwind 클래스 예시

```tsx
// Layout.tsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  <div className="flex">
    <Sidebar />
    <div className="flex-1">
      <main className="p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  </div>
</div>

// Button.tsx
<button className="bg-indigo-600 text-white hover:bg-indigo-500 
                   px-3 py-2 rounded-md inline-flex items-center gap-2">
  {children}
</button>
```

### 다크모드 지원

- `darkMode: 'class'` 설정
- `dark:` 접두사로 다크모드 스타일 적용
- `ThemeToggle` 컴포넌트로 토글 가능

## 📝 요약

### ✅ 완료된 것
1. Tailwind CSS 설치 및 설정 완료
2. UI 컴포넌트 라이브러리 구축 (Tailwind 기반)
3. 레이아웃 컴포넌트 구축 (Tailwind 기반)
4. 모든 페이지를 `_v2.tsx`로 마이그레이션 (Tailwind 사용)
5. 다크모드 지원

### ⚠️ 개선 가능한 부분
1. **구버전 파일 정리**: CSS 기반 구버전 파일들 제거 고려
2. **일관성**: 모든 컴포넌트가 Tailwind 사용하도록 통일
3. **디자인 시스템**: Tailwind 설정에 더 많은 커스텀 토큰 추가

### 🎨 Tailwind 사용 현황
- ✅ **UI 컴포넌트**: 100% Tailwind 사용
- ✅ **레이아웃**: 100% Tailwind 사용
- ✅ **페이지**: `_v2.tsx` 버전 모두 Tailwind 사용
- ⚠️ **구버전**: CSS 파일 사용 (현재 사용 안 함)

## 🚀 다음 단계 제안

1. **토론 기능 페이지 생성**
   - `pages/Discussion_v2.tsx` - Tailwind로 구현
   - 토론 목록, 상세, 작성 페이지

2. **컴포넌트 추가**
   - `components/ui/DiscussionCard.tsx`
   - `components/ui/CommentList.tsx`
   - `components/ui/LikeButton.tsx`

3. **구버전 파일 정리**
   - 사용하지 않는 CSS 파일 제거
   - 구버전 컴포넌트 파일 정리

