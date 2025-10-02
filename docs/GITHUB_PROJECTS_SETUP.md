# 📋 GitHub Projects 설정 가이드

MacChain Bible App 프로젝트의 GitHub Projects를 이용한 애자일 프로젝트 관리 설정 가이드입니다.

## 🎯 설정 개요

GitHub Projects를 사용하여 스크럼 기반의 애자일 개발 프로세스를 구현합니다.

### 주요 기능
- 📋 **칸반 보드**: 작업 흐름 시각화
- 🏃‍♂️ **스프린트 관리**: 마일스톤 기반 스프린트 추적
- 📊 **번다운 차트**: 진행 상황 모니터링
- 🔄 **자동화**: 워크플로우 자동화

## 🚀 초기 설정

### 1단계: 새 프로젝트 생성

1. GitHub 레포지토리 → **Projects** 탭
2. **New project** 클릭
3. **Team planning** 템플릿 선택
4. 프로젝트 이름: **MacChain Agile Board**
5. **Create project** 클릭

### 2단계: 보드 뷰 설정

#### 기본 칸반 보드 구성

```
📋 Backlog → 🎯 Ready → 🔄 In Progress → 👀 Review → ✅ Done
```

#### 컬럼 설정

1. **📋 Backlog**
   - **목적**: 우선순위가 정해지지 않은 모든 이슈
   - **조건**: Status = "Backlog"
   - **자동화**: 새 이슈 생성 시 자동 추가

2. **🎯 Ready**
   - **목적**: 스프린트에 포함될 준비가 된 이슈
   - **조건**: Status = "Ready" AND Priority != null
   - **자동화**: 우선순위 라벨 추가 시 이동

3. **🔄 In Progress**
   - **목적**: 현재 작업 중인 이슈
   - **조건**: Status = "In Progress"
   - **자동화**: 이슈 할당 시 이동

4. **👀 Review**
   - **목적**: 코드 리뷰 중인 이슈
   - **조건**: Status = "Review"
   - **자동화**: PR 생성 시 이동

5. **✅ Done**
   - **목적**: 완료된 이슈
   - **조건**: Status = "Done"
   - **자동화**: PR 병합 시 이동

### 3단계: 필드 설정

#### 기본 필드

1. **Status** (Single select)
   ```
   - 📋 Backlog
   - 🎯 Ready
   - 🔄 In Progress
   - 👀 Review
   - ✅ Done
   ```

2. **Priority** (Single select)
   ```
   - 🔴 Critical
   - 🟠 High
   - 🟡 Medium
   - 🟢 Low
   ```

3. **Story Points** (Number)
   ```
   - 범위: 1, 2, 3, 5, 8, 13, 21
   - 기본값: null
   ```

4. **Sprint** (Single select)
   ```
   - Sprint 1
   - Sprint 2
   - Sprint 3
   - ...
   ```

5. **Type** (Single select)
   ```
   - 📖 User Story
   - 🐛 Bug
   - ⚙️ Task
   - 🎯 Epic
   ```

#### 고급 필드

6. **Assignee** (People)
   - 담당자 지정

7. **Estimate** (Number)
   - 예상 소요 시간 (시간 단위)

8. **Actual** (Number)
   - 실제 소요 시간 (시간 단위)

9. **Epic** (Single select)
   - 연관된 Epic 지정

10. **Component** (Multi select)
    ```
    - Frontend
    - Backend
    - Database
    - API
    - UI/UX
    - DevOps
    ```

## 📊 뷰 설정

### 1. 칸반 보드 뷰 (기본)

**이름**: Main Board
**레이아웃**: Board
**그룹화**: Status
**정렬**: Priority (높은 순)

### 2. 스프린트 뷰

**이름**: Current Sprint
**레이아웃**: Board
**필터**: Sprint = "현재 스프린트"
**그룹화**: Status
**정렬**: Priority

### 3. 백로그 뷰

**이름**: Product Backlog
**레이아웃**: Table
**필터**: Status = "Backlog" OR Status = "Ready"
**정렬**: Priority, Story Points
**표시 필드**: Title, Type, Priority, Story Points, Assignee

### 4. 스프린트 계획 뷰

**이름**: Sprint Planning
**레이아웃**: Table
**필터**: Status = "Ready"
**그룹화**: Epic
**정렬**: Priority
**표시 필드**: Title, Story Points, Estimate, Component

### 5. 번다운 차트 뷰

**이름**: Burndown
**레이아웃**: Chart
**X축**: Date
**Y축**: Story Points (남은 포인트)
**필터**: Sprint = "현재 스프린트"

## 🔄 자동화 설정

### 1. 이슈 생성 시 자동화

```yaml
name: Add new issues to Backlog
on:
  issues:
    types: [opened]
jobs:
  add-to-project:
    runs-on: ubuntu-latest
    steps:
      - name: Add to project
        uses: actions/add-to-project@v0.4.0
        with:
          project-url: https://github.com/users/daehee719/projects/1
          github-token: ${{ secrets.GITHUB_TOKEN }}
          labeled: needs-triage
          label-operator: OR
```

### 2. PR 생성 시 자동화

```yaml
name: Move to Review on PR
on:
  pull_request:
    types: [opened]
jobs:
  move-to-review:
    runs-on: ubuntu-latest
    steps:
      - name: Move to Review
        uses: actions/add-to-project@v0.4.0
        with:
          project-url: https://github.com/users/daehee719/projects/1
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### 3. PR 병합 시 자동화

```yaml
name: Move to Done on merge
on:
  pull_request:
    types: [closed]
jobs:
  move-to-done:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - name: Move to Done
        uses: actions/add-to-project@v0.4.0
        with:
          project-url: https://github.com/users/daehee719/projects/1
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## 🏷️ 라벨 시스템

### 우선순위 라벨
```
priority:critical - 🔴 Critical
priority:high     - 🟠 High  
priority:medium   - 🟡 Medium
priority:low      - 🟢 Low
```

### 스토리 포인트 라벨
```
story-points:1  - 1 point
story-points:2  - 2 points
story-points:3  - 3 points
story-points:5  - 5 points
story-points:8  - 8 points
story-points:13 - 13 points
story-points:21 - 21 points
```

### 상태 라벨
```
status:blocked        - ⛔ Blocked
status:in-progress    - 🔄 In Progress
status:ready-for-review - 👀 Ready for Review
status:needs-info     - ❓ Needs Info
```

### 유형 라벨
```
type:user-story - 📖 User Story
type:bug        - 🐛 Bug
type:task       - ⚙️ Task
type:epic       - 🎯 Epic
type:spike      - 🔍 Spike
```

### 컴포넌트 라벨
```
component:frontend  - ⚛️ Frontend
component:backend   - 🏗️ Backend
component:database  - 🗄️ Database
component:api       - 🔌 API
component:ui-ux     - 🎨 UI/UX
component:devops    - 🚀 DevOps
```

## 📈 메트릭스 및 리포팅

### 1. 스프린트 번다운 차트

GitHub Projects의 차트 기능을 사용하여 번다운 차트 생성:

1. **Insights** 탭 클릭
2. **New chart** 선택
3. **Chart type**: Line chart
4. **X-axis**: Date
5. **Y-axis**: Story Points (Sum)
6. **Filter**: Current Sprint

### 2. 벨로시티 추적

스프린트별 완료된 스토리 포인트를 추적:

```bash
# 벨로시티 계산 스크립트 실행
./scripts/agile-helper.sh velocity
```

### 3. 사이클 타임 분석

이슈가 각 상태에 머무는 시간 분석:

1. **Insights** → **New chart**
2. **Chart type**: Histogram
3. **X-axis**: Cycle time (days)
4. **Group by**: Type

## 🔧 워크플로우 최적화

### 스프린트 시작 프로세스

1. **스프린트 계획 미팅**
   - Product Backlog에서 Ready 상태 이슈 검토
   - 팀 역량 고려하여 스프린트 백로그 선정
   - 스토리 포인트 재검토

2. **스프린트 설정**
   ```bash
   ./scripts/agile-helper.sh sprint start 1
   ```

3. **이슈 할당**
   - 선정된 이슈들에 Sprint 필드 설정
   - 담당자 할당
   - Status를 "Ready"로 변경

### 일일 스탠드업 프로세스

1. **보드 리뷰**
   - In Progress 컬럼 확인
   - Blocked 이슈 식별
   - Review 컬럼 진행 상황 확인

2. **진행 상황 업데이트**
   ```bash
   ./scripts/agile-helper.sh daily
   ```

### 스프린트 종료 프로세스

1. **스프린트 리뷰**
   - Done 컬럼의 완료된 작업 시연
   - 미완료 이슈 다음 스프린트로 이동

2. **스프린트 회고**
   ```bash
   ./scripts/agile-helper.sh retrospective 1
   ```

3. **스프린트 종료**
   ```bash
   ./scripts/agile-helper.sh sprint end 1
   ```

## 🎯 베스트 프랙티스

### 이슈 관리
- ✅ 명확하고 구체적인 제목 작성
- ✅ 적절한 라벨과 필드 설정
- ✅ 인수 조건 명시
- ✅ 정기적인 우선순위 검토

### 보드 관리
- ✅ WIP(Work In Progress) 제한 설정
- ✅ 정기적인 보드 정리
- ✅ 블로커 이슈 즉시 해결
- ✅ 완료 기준(Definition of Done) 준수

### 팀 협업
- ✅ 투명한 진행 상황 공유
- ✅ 적극적인 커뮤니케이션
- ✅ 지속적인 프로세스 개선
- ✅ 데이터 기반 의사결정

## 🚀 고급 기능

### 1. 커스텀 필드 활용

#### 비즈니스 가치 점수
```
필드명: Business Value
타입: Number
범위: 1-10
용도: ROI 계산 및 우선순위 결정
```

#### 위험도 평가
```
필드명: Risk Level
타입: Single select
옵션: Low, Medium, High, Critical
용도: 리스크 관리 및 완화 계획
```

### 2. 고급 자동화

#### 스토리 포인트 기반 자동 할당
```yaml
name: Auto-assign based on story points
on:
  issues:
    types: [labeled]
jobs:
  auto-assign:
    if: contains(github.event.label.name, 'story-points:1')
    runs-on: ubuntu-latest
    steps:
      - name: Assign to junior developer
        # 1포인트 이슈는 주니어 개발자에게 자동 할당
```

#### 블로커 알림
```yaml
name: Notify on blocked issues
on:
  issues:
    types: [labeled]
jobs:
  notify-blocked:
    if: github.event.label.name == 'status:blocked'
    runs-on: ubuntu-latest
    steps:
      - name: Send Slack notification
        # Slack으로 블로커 알림 전송
```

### 3. 통합 도구

#### Slack 통합
- 스프린트 시작/종료 알림
- 일일 스탠드업 리마인더
- 블로커 이슈 즉시 알림

#### 시간 추적 도구
- Toggl 또는 Clockify 연동
- 실제 소요 시간 자동 기록
- 추정 정확도 개선

## 📞 문제 해결

### 자주 발생하는 문제

#### 1. 이슈가 프로젝트에 자동 추가되지 않음
**해결방법:**
- 자동화 워크플로우 확인
- 라벨 조건 검토
- GitHub Actions 로그 확인

#### 2. 번다운 차트가 정확하지 않음
**해결방법:**
- Story Points 필드 값 확인
- 스프린트 필터 설정 검토
- 완료 기준 일관성 확인

#### 3. 보드가 느리게 로드됨
**해결방법:**
- 필터 조건 최적화
- 오래된 이슈 아카이브
- 뷰 설정 간소화

---

**💡 팁**: GitHub Projects는 지속적으로 업데이트되므로, 새로운 기능을 정기적으로 확인하고 팀 프로세스에 맞게 조정하세요!
