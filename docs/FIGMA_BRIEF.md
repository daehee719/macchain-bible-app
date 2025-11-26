Figma Brief — MacChain MVP (초안)

목적: 디자이너가 빠르게 시작할 수 있도록 모바일 우선 3개 화면(홈, 분석, 통계)의 프레임과 주요 컴포넌트 목록, 디자인 토큰을 제공합니다.

Frames
- Mobile (375 x 812) — 우선 제작
  1) Home
    - 상단: App title / 메뉴
    - 오늘의 읽기 계획: 카드 목록(책/장/절, '분석' 버튼)
    - 진행 통계: 스파크라인 + 연속 일수
    - 빠른 액션: 동기화, 통계
  2) Analysis
    - 입력 영역: 구절 입력 또는 텍스트 붙여넣기
    - 분석 유형 선택(탭): General / Theological / Devotional / Historical
    - 결과 영역: 분석 텍스트 + 원문(선택)
  3) Statistics
    - 요약 카드: 연속 일수, 완독율
    - 차트: 주/월별 읽기량(라인/바)

Components
- Card (title + body)
- Button (primary/secondary/ghost)
- Modal (centered)
- Input / TextArea
- SmallChart (sparkline)

Design tokens (from `frontend/src/styles/design-tokens.css`)
- Primary: `#2563eb`
- Background: `#f5f7fb` | Surface: `#ffffff`
- Muted: `#6b7280`
- Radius: 8px | Base font: 16px

Notes for designer
- 모바일 퍼스트로 와이어 만들기
- 컴포넌트는 재사용 가능하게 구성(상태: hover, active, disabled)
- AI 분석 결과 뷰는 긴 텍스트를 다루므로 가독성(줄 길이, line-height)을 우선 고려
