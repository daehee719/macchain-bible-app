# 🛡️ GitHub 브랜치 보호 규칙 설정 가이드

Git Flow 전략에 맞는 GitHub 브랜치 보호 규칙 설정 방법입니다.

## 🎯 설정 방법

1. GitHub 레포지토리 → **Settings** → **Branches**
2. **Add rule** 클릭하여 각 브랜치별 규칙 설정

## 🌳 브랜치별 보호 규칙

### 🔴 `main` 브랜치 (Production)

#### Branch name pattern: `main`

#### 필수 설정 ✅
- **Restrict pushes that create files larger than 100MB**
- **Require a pull request before merging**
  - **Require approvals**: 최소 1명
  - **Dismiss stale PR approvals when new commits are pushed**
  - **Require review from code owners**
- **Require status checks to pass before merging**
  - **Require branches to be up to date before merging**
  - **Status checks that are required**:
    - `🏗️ Backend CI/CD Pipeline / build-and-test`
    - `⚛️ Frontend CI/CD Pipeline / build-and-test`
    - `🏗️ Backend CI/CD Pipeline / security-scan`
    - `⚛️ Frontend CI/CD Pipeline / security-scan`
- **Require conversation resolution before merging**
- **Require signed commits**
- **Require linear history**
- **Include administrators** (관리자도 규칙 적용)

#### 선택적 설정 🔧
- **Restrict pushes that create files larger than**: 50MB
- **Lock branch** (긴급상황 시에만 해제)

### 🟡 `develop` 브랜치 (Development)

#### Branch name pattern: `develop`

#### 필수 설정 ✅
- **Require a pull request before merging**
  - **Require approvals**: 최소 1명
  - **Dismiss stale PR approvals when new commits are pushed**
- **Require status checks to pass before merging**
  - **Require branches to be up to date before merging**
  - **Status checks that are required**:
    - `🔀 Feature Branch CI / validation-summary`
    - `🏗️ Backend CI/CD Pipeline / build-and-test` (해당 변경사항 있을 시)
    - `⚛️ Frontend CI/CD Pipeline / build-and-test` (해당 변경사항 있을 시)
- **Require conversation resolution before merging**
- **Include administrators**

#### 선택적 설정 🔧
- **Require linear history** (선택사항)
- **Require signed commits** (권장)

### 🟢 `feature/*` 브랜치 (Feature Development)

#### Branch name pattern: `feature/*`

#### 권장 설정 💡
- **Require status checks to pass before merging**
  - **Status checks that are required**:
    - `🔀 Feature Branch CI / validation-summary`
- **Delete head branches automatically** (PR 병합 후 자동 삭제)

### 🔵 `release/*` 브랜치 (Release Preparation)

#### Branch name pattern: `release/*`

#### 필수 설정 ✅
- **Require a pull request before merging**
  - **Require approvals**: 최소 2명 (릴리스 매니저 + 개발자)
- **Require status checks to pass before merging**
  - **Require branches to be up to date before merging**
  - **Status checks that are required**:
    - `🏗️ Backend CI/CD Pipeline / build-and-test`
    - `⚛️ Frontend CI/CD Pipeline / build-and-test`
    - `🏗️ Backend CI/CD Pipeline / security-scan`
    - `⚛️ Frontend CI/CD Pipeline / security-scan`
- **Require conversation resolution before merging**
- **Include administrators**

### 🟠 `hotfix/*` 브랜치 (Emergency Fixes)

#### Branch name pattern: `hotfix/*`

#### 필수 설정 ✅
- **Require a pull request before merging**
  - **Require approvals**: 최소 1명 (긴급상황 고려)
- **Require status checks to pass before merging**
  - **Status checks that are required**:
    - `🏗️ Backend CI/CD Pipeline / build-and-test`
    - `⚛️ Frontend CI/CD Pipeline / build-and-test`
- **Require conversation resolution before merging**

## 🔐 추가 보안 설정

### Repository Settings

#### General → Pull Requests
- ✅ **Allow merge commits**
- ✅ **Allow squash merging**
- ❌ **Allow rebase merging** (선택사항)
- ✅ **Always suggest updating pull request branches**
- ✅ **Allow auto-merge**
- ✅ **Automatically delete head branches**

#### General → Pushes
- ✅ **Limit pushes that create files larger than 100MB**

### Code Security and Analysis

#### Security → Code scanning
- ✅ **CodeQL analysis** 활성화
- ✅ **Dependency review** 활성화
- ✅ **Secret scanning** 활성화

#### Security → Dependabot
- ✅ **Dependabot alerts** 활성화
- ✅ **Dependabot security updates** 활성화
- ✅ **Dependabot version updates** 활성화

## 👥 팀 권한 설정

### Teams and Permissions

#### Core Developers Team
- **Permission**: Write
- **Branch restrictions**: 
  - `feature/*` 브랜치 생성/푸시 가능
  - `develop`에 PR 생성 가능

#### Maintainers Team  
- **Permission**: Maintain
- **Branch restrictions**:
  - `release/*`, `hotfix/*` 브랜치 생성 가능
  - `main`, `develop`에 PR 병합 가능

#### Admins Team
- **Permission**: Admin
- **Branch restrictions**: 모든 브랜치 관리 가능

## 🤖 자동화 설정

### GitHub Actions Permissions

#### Settings → Actions → General
- **Actions permissions**: Allow enterprise, and select non-enterprise, actions and reusable workflows
- **Fork pull request workflows**: Require approval for first-time contributors
- **Workflow permissions**: Read and write permissions

### Required Status Checks

각 브랜치별로 다음 상태 체크를 필수로 설정:

#### `main` 브랜치
```
🏗️ Backend CI/CD Pipeline / code-quality
🏗️ Backend CI/CD Pipeline / build-and-test (dev)
🏗️ Backend CI/CD Pipeline / build-and-test (test)
🏗️ Backend CI/CD Pipeline / security-scan
⚛️ Frontend CI/CD Pipeline / code-quality
⚛️ Frontend CI/CD Pipeline / build-and-test (18)
⚛️ Frontend CI/CD Pipeline / build-and-test (20)
⚛️ Frontend CI/CD Pipeline / e2e-test
⚛️ Frontend CI/CD Pipeline / security-scan
```

#### `develop` 브랜치
```
🔀 Feature Branch CI / validation-summary
🏗️ Backend CI/CD Pipeline / build-and-test (dev)
⚛️ Frontend CI/CD Pipeline / build-and-test (18)
```

## 📋 체크리스트

### 초기 설정 체크리스트

- [ ] `main` 브랜치 보호 규칙 설정
- [ ] `develop` 브랜치 보호 규칙 설정
- [ ] `feature/*` 브랜치 패턴 규칙 설정
- [ ] `release/*` 브랜치 패턴 규칙 설정
- [ ] `hotfix/*` 브랜치 패턴 규칙 설정
- [ ] 팀 권한 설정
- [ ] Required status checks 설정
- [ ] 보안 기능 활성화
- [ ] Dependabot 설정

### 정기 점검 체크리스트 (월 1회)

- [ ] 브랜치 보호 규칙 준수 여부 확인
- [ ] 불필요한 브랜치 정리
- [ ] 팀 권한 재검토
- [ ] 보안 알림 확인 및 처리
- [ ] CI/CD 파이프라인 성능 검토

## 🚨 예외 상황 대응

### 긴급 배포가 필요한 경우

1. **Hotfix 브랜치 생성**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-security-fix
   ```

2. **임시 보호 규칙 완화** (관리자만)
   - `main` 브랜치 보호에서 "Include administrators" 임시 해제
   - 수정 후 즉시 재활성화

3. **긴급 배포 후 절차**
   - 변경사항을 `develop`에도 병합
   - 보호 규칙 재활성화
   - 사후 리뷰 진행

### 브랜치 보호 규칙 우회가 필요한 경우

1. **사유 문서화**: GitHub Issue에 우회 사유 기록
2. **승인 절차**: 2명 이상의 관리자 승인
3. **임시 해제**: 최소 시간으로 제한
4. **즉시 복구**: 작업 완료 후 즉시 보호 규칙 재활성화
5. **사후 검토**: 우회 사유 및 과정 검토

## 📞 문의 및 지원

브랜치 보호 규칙 관련 문의사항이 있으면:
1. GitHub Issues에 질문 등록
2. 팀 Slack 채널에서 논의
3. 관리자에게 직접 연락

---

**⚠️ 주의**: 브랜치 보호 규칙은 코드 품질과 안정성을 위한 필수 설정입니다. 임의로 변경하지 마세요.
