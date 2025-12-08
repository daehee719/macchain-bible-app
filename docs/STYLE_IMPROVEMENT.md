# className 가독성 개선 가이드

## 📋 개요

긴 Tailwind CSS className을 더 읽기 쉽고 유지보수하기 쉽게 개선했습니다.

## 🛠️ 개선 방법

### 1. 유틸리티 함수 생성

#### `cn()` 함수
여러 클래스를 조건부로 결합하고 중복을 제거합니다.

```typescript
// utils/cn.ts
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
```

**사용 예시:**
```typescript
// 이전
className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"

// 이후
className={cn(
  button.icon,
  'px-4 py-2 rounded-lg font-medium transition-all',
  'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  'hover:bg-gray-100 dark:hover:bg-gray-700'
)}
```

### 2. 공통 스타일 상수 추출

#### `styles.ts` 파일
자주 사용되는 className 패턴을 상수로 정의합니다.

```typescript
// utils/styles.ts
export const layout = {
  pageContainer: 'min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors',
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  containerMd: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
  header: 'text-center mb-12',
  title: 'text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4',
  subtitle: 'text-xl text-gray-600 dark:text-gray-300',
}

export const button = {
  primary: 'px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
  secondary: 'px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all',
  icon: 'flex items-center gap-2',
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
}
```

**사용 예시:**
```typescript
// 이전
<div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors">

// 이후
<div className={layout.pageContainer}>
```

## 📊 개선 효과

### 가독성 향상

**이전:**
```typescript
<button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
```

**이후:**
```typescript
<button className={cn(button.secondary, button.disabled)}>
```

### 유지보수성 향상

- 공통 스타일 변경 시 한 곳만 수정
- 일관된 스타일 적용
- 타입 안정성 향상

### 코드 재사용성

- 같은 스타일 패턴을 여러 곳에서 재사용
- 스타일 일관성 보장
- 개발 속도 향상

## 🎯 적용된 파일

### ✅ 완료
- `Community.tsx` - 커뮤니티 페이지
- `ReadingPlan.tsx` - 읽기 계획 페이지
- `Dashboard.tsx` - 대시보드 페이지
- `Statistics.tsx` - 통계 페이지

### 📝 사용 가능한 스타일 상수

#### 레이아웃
- `layout.pageContainer` - 페이지 컨테이너
- `layout.container` - 최대 너비 컨테이너
- `layout.containerMd` - 중간 너비 컨테이너
- `layout.header` - 헤더 스타일
- `layout.title` - 제목 스타일
- `layout.subtitle` - 부제목 스타일

#### 버튼
- `button.primary` - 주요 버튼
- `button.secondary` - 보조 버튼
- `button.icon` - 아이콘 버튼
- `button.disabled` - 비활성화 스타일

#### 입력 필드
- `input.base` - 기본 입력 필드
- `input.textarea` - 텍스트 영역

#### 카드/그리드
- `card.grid` - 3열 그리드
- `card.grid2` - 2열 그리드
- `card.grid3` - 3열 그리드

#### 텍스트
- `text.center` - 중앙 정렬
- `text.primary` - 주요 텍스트 색상
- `text.secondary` - 보조 텍스트 색상
- `text.muted` - 흐린 텍스트 색상
- `text.bold` - 굵은 텍스트
- `text.large` - 큰 텍스트
- `text.small` - 작은 텍스트

#### 상태
- `state.loading` - 로딩 상태
- `state.empty` - 빈 상태
- `state.error` - 에러 상태

#### 링크
- `link.primary` - 주요 링크
- `link.icon` - 링크 아이콘

## 💡 사용 팁

### 1. 조건부 클래스
```typescript
className={cn(
  'base-class',
  condition && 'conditional-class',
  anotherCondition ? 'class-a' : 'class-b'
)}
```

### 2. 여러 스타일 조합
```typescript
className={cn(
  button.secondary,
  'additional-class',
  button.disabled
)}
```

### 3. 인라인 스타일과 조합
```typescript
className={cn(layout.pageContainer, 'custom-class')}
```

## 🔄 마이그레이션 가이드

### 단계별 마이그레이션

1. **유틸리티 함수 import**
   ```typescript
   import { cn } from '../utils/cn'
   import { layout, button, input } from '../utils/styles'
   ```

2. **긴 className 찾기**
   - 50자 이상인 className 우선
   - 반복되는 패턴 식별

3. **스타일 상수로 교체**
   - 공통 패턴을 `styles.ts`에 추가
   - className을 상수로 교체

4. **조건부 클래스는 `cn()` 사용**
   - template literal 대신 `cn()` 사용

## 📈 향후 개선 사항

1. **더 많은 공통 스타일 추가**
   - 폼 스타일
   - 모달 스타일
   - 알림 스타일

2. **타입 안정성 강화**
   - 스타일 상수에 타입 추가
   - 자동완성 개선

3. **테마별 스타일 분리**
   - 다크 모드 전용 스타일
   - 라이트 모드 전용 스타일

