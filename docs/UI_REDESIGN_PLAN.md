# MacChain UI 리디자인 기획서

## 📋 프로젝트 개요

**목표**: Tailwind CSS를 사용하여 Symposium NextJS 테마를 참고하여 MacChain 성경 읽기 앱의 UI를 현대적이고 세련된 디자인으로 개선

**참고 사이트**: https://themewagon.github.io/symposium-nextjs/

## 🎨 디자인 컨셉

### 참고 사이트의 주요 디자인 요소
1. **Hero Section**: 대형 타이틀, 서브타이틀, CTA 버튼
2. **카드 기반 레이아웃**: 그림자와 호버 효과가 있는 모던한 카드
3. **그라데이션 배경**: 부드러운 그라데이션 색상
4. **타이포그래피**: 명확한 계층 구조
5. **반응형 디자인**: 모바일 최적화
6. **아이콘 활용**: Lucide React 아이콘 (이미 사용 중)

### MacChain에 적용할 디자인 방향
- **색상**: 보라색/파란색 계열 그라데이션 (성경의 신성함 표현)
- **레이아웃**: 카드 기반 그리드 시스템
- **타이포그래피**: 명확한 정보 계층 구조
- **인터랙션**: 부드러운 호버 효과와 트랜지션

## 📝 작업 단계별 세부 계획

### Phase 1: 환경 설정 및 기반 구축
**예상 시간**: 30분

#### Task 1.1: Tailwind CSS 설치 및 설정
- [ ] Tailwind CSS 및 의존성 설치
- [ ] `tailwind.config.js` 생성 및 설정
- [ ] `postcss.config.js` 설정
- [ ] `index.css`에 Tailwind 디렉티브 추가
- [ ] Vite 설정 확인

#### Task 1.2: 기본 스타일 시스템 구축
- [ ] 색상 팔레트 정의 (그라데이션 색상)
- [ ] 타이포그래피 스케일 정의
- [ ] 간격(Spacing) 시스템 정의
- [ ] 공통 컴포넌트 스타일 정의

### Phase 2: 공통 컴포넌트 리디자인
**예상 시간**: 1시간

#### Task 2.1: Header 컴포넌트 리디자인
- [ ] Tailwind로 Header 스타일 전환
- [ ] 로고 및 네비게이션 스타일 개선
- [ ] 반응형 모바일 메뉴 추가
- [ ] 호버 효과 및 트랜지션 추가
- [ ] 기존 Header.css 제거

#### Task 2.2: Card 컴포넌트 리디자인
- [ ] Tailwind로 Card 스타일 전환
- [ ] 그림자 및 호버 효과 추가
- [ ] 그라데이션 배경 옵션 추가
- [ ] 기존 Card.css 제거

#### Task 2.3: Button 컴포넌트 생성 (필요시)
- [ ] 공통 Button 컴포넌트 생성
- [ ] Primary, Secondary, Ghost 스타일
- [ ] 다양한 사이즈 옵션

### Phase 3: 페이지별 리디자인
**예상 시간**: 2-3시간

#### Task 3.1: Dashboard 페이지 리디자인
- [ ] Hero Section 추가 (대형 타이틀, 서브타이틀)
- [ ] 오늘의 읽기 계획 카드 개선
- [ ] 통계 카드 그리드 레이아웃
- [ ] 기능 카드 섹션 개선
- [ ] 그라데이션 배경 적용
- [ ] 기존 Dashboard.css 제거

#### Task 3.2: ReadingPlan 페이지 리디자인
- [ ] 주간 캘린더 뷰 개선
- [ ] 읽기 항목 카드 스타일 개선
- [ ] 진행률 표시 개선
- [ ] 기존 ReadingPlan.css 제거

#### Task 3.3: Statistics 페이지 리디자인
- [ ] 통계 카드 레이아웃 개선
- [ ] 차트 및 그래프 스타일 개선
- [ ] 성취 배지 디자인 개선
- [ ] 기존 Statistics.css 제거

#### Task 3.4: AIAnalysis 페이지 리디자인
- [ ] 입력 섹션 스타일 개선
- [ ] 분석 결과 카드 디자인
- [ ] 로딩 상태 개선
- [ ] 기존 AIAnalysis.css 제거

#### Task 3.5: Login 페이지 리디자인
- [ ] 로그인 폼 카드 스타일
- [ ] 입력 필드 스타일 개선
- [ ] 버튼 스타일 개선
- [ ] 기존 Login.css 제거

#### Task 3.6: Settings 페이지 리디자인
- [ ] 설정 카드 레이아웃
- [ ] 토글 스위치 스타일
- [ ] 기존 Settings.css 제거

#### Task 3.7: Community 페이지 리디자인
- [ ] 포스트 카드 디자인
- [ ] 댓글 섹션 스타일
- [ ] 기존 Community.css 제거

### Phase 4: 전역 스타일 및 최적화
**예상 시간**: 30분

#### Task 4.1: App.css 정리
- [ ] Tailwind로 전환 가능한 스타일 확인
- [ ] 불필요한 CSS 제거
- [ ] 전역 스타일 최소화

#### Task 4.2: 반응형 디자인 최적화
- [ ] 모바일 뷰 테스트
- [ ] 태블릿 뷰 테스트
- [ ] 데스크톱 뷰 최적화

#### Task 4.3: 다크 모드 지원 (선택사항)
- [ ] Tailwind 다크 모드 설정
- [ ] 다크 모드 색상 정의
- [ ] 토글 기능 추가

### Phase 5: 테스트 및 정리
**예상 시간**: 30분

#### Task 5.1: 기능 테스트
- [ ] 모든 페이지 동작 확인
- [ ] 라우팅 테스트
- [ ] 인증 플로우 테스트

#### Task 5.2: 코드 정리
- [ ] 사용하지 않는 CSS 파일 제거
- [ ] import 정리
- [ ] 주석 추가

## 🎨 디자인 시스템

### 색상 팔레트
```javascript
colors: {
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    500: '#8b5cf6',  // 보라색
    600: '#7c3aed',
    700: '#6d28d9',
  },
  secondary: {
    500: '#3b82f6',  // 파란색
    600: '#2563eb',
  },
  gradient: {
    from: '#8b5cf6',  // 보라색
    to: '#3b82f6',    // 파란색
  }
}
```

### 타이포그래피
- **Hero Title**: text-5xl ~ text-6xl, font-bold
- **Section Title**: text-3xl ~ text-4xl, font-semibold
- **Card Title**: text-xl ~ text-2xl, font-semibold
- **Body**: text-base, font-normal

### 간격 시스템
- Tailwind 기본 간격 사용
- 섹션 간격: py-16 ~ py-24
- 카드 간격: gap-6 ~ gap-8

## 📦 필요한 패키지

```json
{
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

## ✅ 체크리스트

### 설치 및 설정
- [ ] Tailwind CSS 설치
- [ ] 설정 파일 생성
- [ ] 기본 스타일 적용

### 컴포넌트
- [ ] Header 리디자인
- [ ] Card 리디자인
- [ ] Button 컴포넌트 (필요시)

### 페이지
- [ ] Dashboard
- [ ] ReadingPlan
- [ ] Statistics
- [ ] AIAnalysis
- [ ] Login
- [ ] Settings
- [ ] Community

### 최종 확인
- [ ] 모든 페이지 동작 확인
- [ ] 반응형 테스트
- [ ] 불필요한 CSS 파일 제거

## 🚀 시작하기

1. Phase 1부터 순차적으로 진행
2. 각 Phase 완료 후 테스트
3. 문제 발생 시 즉시 수정
4. 최종적으로 모든 CSS 파일을 Tailwind로 전환

---

**예상 총 작업 시간**: 4-5시간
**우선순위**: High
**참고**: Symposium NextJS 테마의 디자인 요소를 성경 앱에 맞게 적절히 변형하여 적용

