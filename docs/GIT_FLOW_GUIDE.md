# 🌿 Git Flow 브랜치 전략 가이드

MacChain Bible App 프로젝트의 Git Flow 워크플로우 가이드입니다.

## 📋 브랜치 구조

### 🌳 메인 브랜치

#### `main` (Production)
- **목적**: 운영 환경 배포용 브랜치
- **특징**: 항상 배포 가능한 안정적인 상태 유지
- **배포**: 자동 배포 (Production)
- **보호**: 직접 푸시 금지, PR을 통해서만 병합

#### `develop` (Development)
- **목적**: 개발 통합 브랜치
- **특징**: 다음 릴리스를 위한 기능들이 통합되는 브랜치
- **배포**: 자동 배포 (Staging)
- **보호**: 직접 푸시 금지, PR을 통해서만 병합

### 🔀 보조 브랜치

#### `feature/*` (Feature Branches)
- **목적**: 새로운 기능 개발
- **생성**: `develop`에서 분기
- **병합**: `develop`으로 병합
- **네이밍**: `feature/기능명` (예: `feature/ai-analysis`, `feature/user-auth`)
- **수명**: 기능 완성 후 삭제

#### `release/*` (Release Branches)
- **목적**: 릴리스 준비 (버그 수정, 메타데이터 업데이트)
- **생성**: `develop`에서 분기
- **병합**: `main`과 `develop` 양쪽에 병합
- **네이밍**: `release/v1.0.0`
- **수명**: 릴리스 완료 후 삭제

#### `hotfix/*` (Hotfix Branches)
- **목적**: 운영 환경 긴급 수정
- **생성**: `main`에서 분기
- **병합**: `main`과 `develop` 양쪽에 병합
- **네이밍**: `hotfix/v1.0.1`
- **수명**: 핫픽스 완료 후 삭제

## 🔄 워크플로우

### 1️⃣ 새로운 기능 개발

```bash
# 1. develop 브랜치로 이동 및 최신화
git checkout develop
git pull origin develop

# 2. feature 브랜치 생성
git checkout -b feature/새로운기능명

# 3. 개발 작업 수행
# ... 코딩 ...

# 4. 커밋 및 푸시
git add .
git commit -m "✨ Add 새로운 기능"
git push -u origin feature/새로운기능명

# 5. GitHub에서 develop으로 PR 생성
# 6. 코드 리뷰 및 CI/CD 통과 후 병합
# 7. 로컬에서 브랜치 정리
git checkout develop
git pull origin develop
git branch -d feature/새로운기능명
```

### 2️⃣ 릴리스 준비

```bash
# 1. develop에서 release 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# 2. 버전 정보 업데이트
# - package.json 버전 업데이트
# - CHANGELOG.md 업데이트
# - 문서 업데이트

# 3. 릴리스 테스트 및 버그 수정
git add .
git commit -m "🔖 Prepare release v1.1.0"
git push -u origin release/v1.1.0

# 4. main으로 PR 생성 및 병합
# 5. develop으로도 병합 (변경사항 동기화)
# 6. 태그 생성
git checkout main
git pull origin main
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0

# 7. 브랜치 정리
git branch -d release/v1.1.0
git push origin --delete release/v1.1.0
```

### 3️⃣ 긴급 수정 (Hotfix)

```bash
# 1. main에서 hotfix 브랜치 생성
git checkout main
git pull origin main
git checkout -b hotfix/v1.0.1

# 2. 긴급 수정 작업
# ... 버그 수정 ...

# 3. 커밋 및 푸시
git add .
git commit -m "🚑 Fix critical bug in authentication"
git push -u origin hotfix/v1.0.1

# 4. main으로 PR 생성 및 병합
# 5. develop으로도 병합
# 6. 태그 생성
git checkout main
git pull origin main
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git push origin v1.0.1

# 7. 브랜치 정리
git branch -d hotfix/v1.0.1
git push origin --delete hotfix/v1.0.1
```

## 🤖 CI/CD 연동

### 자동 배포 트리거

#### `main` 브랜치
- **환경**: Production
- **트리거**: Push to main
- **파이프라인**: 
  - 전체 테스트 스위트 실행
  - Docker 이미지 빌드 및 푸시
  - 운영 환경 배포
  - 헬스체크 및 검증

#### `develop` 브랜치
- **환경**: Staging
- **트리거**: Push to develop
- **파이프라인**:
  - 통합 테스트 실행
  - 스테이징 환경 배포
  - E2E 테스트 실행

#### `feature/*` 브랜치
- **환경**: Review App (선택적)
- **트리거**: Pull Request
- **파이프라인**:
  - 코드 품질 검사
  - 단위 테스트 실행
  - 보안 스캔

## 📝 커밋 메시지 컨벤션

### 타입 (Type)

- `✨ feat`: 새로운 기능 추가
- `🐛 fix`: 버그 수정
- `📚 docs`: 문서 수정
- `💎 style`: 코드 포맷팅, 세미콜론 누락 등
- `♻️ refactor`: 코드 리팩토링
- `🧪 test`: 테스트 코드 추가/수정
- `🔧 chore`: 빌드 프로세스, 도구 설정 변경
- `🚀 deploy`: 배포 관련
- `🔖 release`: 릴리스 관련
- `🚑 hotfix`: 긴급 수정

### 예시

```bash
git commit -m "✨ feat: Add AI-powered Hebrew analysis feature

- Implement OpenAI integration for verse analysis
- Add word-by-word Hebrew text parsing
- Create analysis result caching system
- Update UI to display analysis results

Closes #123"
```

## 🛡️ 브랜치 보호 규칙

### `main` 브랜치
- ❌ 직접 푸시 금지
- ✅ Pull Request 필수
- ✅ 최소 1명의 리뷰어 승인 필요
- ✅ CI/CD 체크 통과 필수
- ✅ 최신 상태 유지 필수

### `develop` 브랜치
- ❌ 직접 푸시 금지
- ✅ Pull Request 필수
- ✅ CI/CD 체크 통과 필수
- ✅ 최신 상태 유지 필수

## 🔧 로컬 설정

### Git 설정

```bash
# 기본 브랜치 설정
git config --global init.defaultBranch main

# 자동 푸시 설정
git config --global push.default current

# 브랜치 자동 설정
git config --global branch.autosetupmerge always
git config --global branch.autosetuprebase always
```

### 유용한 Git Alias

```bash
# ~/.gitconfig에 추가
[alias]
    # Git Flow 단축 명령어
    new-feature = "!f() { git checkout develop && git pull origin develop && git checkout -b feature/$1; }; f"
    finish-feature = "!f() { git checkout develop && git pull origin develop && git branch -d feature/$1; }; f"
    
    # 로그 및 상태
    lg = log --oneline --graph --decorate --all
    st = status -s
    
    # 브랜치 관리
    br = branch -v
    co = checkout
    
    # 동기화
    sync = "!f() { git fetch origin && git rebase origin/$(git branch --show-current); }; f"
```

## 📊 릴리스 관리

### 버전 넘버링 (Semantic Versioning)

- **MAJOR.MINOR.PATCH** (예: 1.2.3)
- **MAJOR**: 호환되지 않는 API 변경
- **MINOR**: 하위 호환되는 새로운 기능
- **PATCH**: 하위 호환되는 버그 수정

### 릴리스 노트

각 릴리스마다 `CHANGELOG.md` 업데이트:

```markdown
## [1.1.0] - 2024-10-02

### ✨ Added
- AI-powered Hebrew text analysis
- User authentication system
- Reading progress tracking

### 🐛 Fixed
- Bible text loading performance issue
- Dark mode toggle bug

### ♻️ Changed
- Improved UI responsiveness
- Updated API endpoints

### 🗑️ Removed
- Deprecated legacy authentication
```

## 🚨 주의사항

### ❌ 하지 말아야 할 것
- `main`이나 `develop`에 직접 푸시
- 완료되지 않은 기능을 `develop`에 병합
- 릴리스 브랜치에서 새로운 기능 개발
- 커밋 메시지 없이 병합

### ✅ 해야 할 것
- 기능 완성 후 즉시 PR 생성
- 코드 리뷰 적극 참여
- CI/CD 실패 시 즉시 수정
- 정기적인 브랜치 정리

## 🆘 문제 해결

### 브랜치 충돌 해결
```bash
# 1. 최신 develop 가져오기
git checkout develop
git pull origin develop

# 2. feature 브랜치에서 rebase
git checkout feature/your-feature
git rebase develop

# 3. 충돌 해결 후 계속
git add .
git rebase --continue

# 4. 강제 푸시 (주의!)
git push --force-with-lease origin feature/your-feature
```

### 잘못된 브랜치에서 작업한 경우
```bash
# 1. 변경사항 스태시
git stash

# 2. 올바른 브랜치로 이동
git checkout correct-branch

# 3. 스태시 적용
git stash pop
```

이 가이드를 따라 체계적이고 안전한 개발 워크플로우를 유지하세요! 🚀
