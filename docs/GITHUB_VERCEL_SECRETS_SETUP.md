# GitHub Secrets 설정 가이드 (Vercel 배포)

GitHub Actions를 통해 Vercel에 자동 배포하려면 GitHub Secrets를 설정해야 합니다.

## 📋 필요한 Secrets

다음 3개의 Secrets를 GitHub 저장소에 추가해야 합니다:

1. `VERCEL_TOKEN` - Vercel 인증 토큰
2. `VERCEL_ORG_ID` - Vercel 조직 ID
3. `VERCEL_PROJECT_ID` - Vercel 프로젝트 ID

## 🔧 Secrets 값 확인

### 1. VERCEL_TOKEN

이미 `.cursor/mcp.json`에 설정되어 있습니다:
```
s5svm0QGCnHi75fP46JMHy6C
```

또는 Vercel 대시보드에서 새 토큰을 생성할 수 있습니다:
1. [Vercel Dashboard](https://vercel.com/dashboard) → **Settings** → **Tokens**
2. **Create Token** 클릭
3. 토큰 이름 입력 (예: `github-actions`)
4. 토큰 생성 후 복사

### 2. VERCEL_ORG_ID

프로젝트의 `.vercel/project.json` 파일에서 확인:
```json
{
  "orgId": "team_xCcpHuJFh6bNrjcDBVzvyCZy"
}
```

또는 Vercel CLI로 확인:
```bash
cd macchain-frontend
npx vercel project ls
```

### 3. VERCEL_PROJECT_ID

프로젝트의 `.vercel/project.json` 파일에서 확인:
```json
{
  "projectId": "prj_7E3Q0HA7TbqsWuzjAAcCM715s3rl"
}
```

또는 Vercel CLI로 확인:
```bash
cd macchain-frontend
npx vercel project ls
```

## 🚀 GitHub Secrets 설정 방법

### ⚠️ 중요: Repository Secret vs Environment Secret

**Repository Secret을 사용하세요!**

- **Repository Secret**: 저장소의 모든 워크플로우에서 사용 가능 (권장)
- **Environment Secret**: 특정 환경(production, staging 등)에만 적용

현재 설정에서는 **Repository Secret**을 사용합니다. 모든 브랜치(main, develop)와 Pull Request에서 동일한 Vercel 프로젝트를 사용하므로 Repository Secret이 적합합니다.

### 방법 1: GitHub 웹 인터페이스 사용

1. [GitHub 저장소](https://github.com/daehee719/macchain-bible-app) 접속
2. **Settings** 탭 클릭
3. 좌측 메뉴에서 **Secrets and variables** → **Actions** 클릭
4. **Repository secrets** 탭이 선택되어 있는지 확인
5. **New repository secret** 버튼 클릭
5. 각 Secret을 추가:

   **Secret 1: VERCEL_TOKEN**
   - Name: `VERCEL_TOKEN`
   - Secret: `s5svm0QGCnHi75fP46JMHy6C`
   - **Add secret** 클릭

   **Secret 2: VERCEL_ORG_ID**
   - Name: `VERCEL_ORG_ID`
   - Secret: `team_xCcpHuJFh6bNrjcDBVzvyCZy`
   - **Add secret** 클릭

   **Secret 3: VERCEL_PROJECT_ID**
   - Name: `VERCEL_PROJECT_ID`
   - Secret: `prj_7E3Q0HA7TbqsWuzjAAcCM715s3rl`
   - **Add secret** 클릭

### 방법 2: GitHub CLI 사용

```bash
# GitHub CLI 설치 (없는 경우)
brew install gh

# GitHub CLI 로그인
gh auth login

# Secrets 추가
gh secret set VERCEL_TOKEN --body "s5svm0QGCnHi75fP46JMHy6C"
gh secret set VERCEL_ORG_ID --body "team_xCcpHuJFh6bNrjcDBVzvyCZy"
gh secret set VERCEL_PROJECT_ID --body "prj_7E3Q0HA7TbqsWuzjAAcCM715s3rl"
```

## ✅ 설정 확인

Secrets가 제대로 설정되었는지 확인:

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **Repository secrets** 탭에서 다음 3개의 Secrets가 표시되어야 합니다:
   - ✅ `VERCEL_TOKEN` (Repository secret)
   - ✅ `VERCEL_ORG_ID` (Repository secret)
   - ✅ `VERCEL_PROJECT_ID` (Repository secret)

⚠️ **주의**: Environment secrets가 아닌 **Repository secrets**에 설정되어 있어야 합니다!

## 🧪 자동 배포 테스트

Secrets 설정 후 자동 배포를 테스트:

1. `macchain-frontend` 디렉토리에서 작은 변경사항 만들기
2. 변경사항 커밋 및 푸시:
   ```bash
   git add macchain-frontend/
   git commit -m "test: Vercel 자동 배포 테스트"
   git push origin main
   ```
3. GitHub Actions 탭에서 워크플로우 실행 확인:
   - **Actions** 탭 클릭
   - **🚀 Deploy to Vercel** 워크플로우 확인
   - 실행 상태 및 로그 확인

## 📊 배포 동작

### 자동 배포 트리거

- **`main` 브랜치**: 프로덕션 배포 (`--prod`)
- **`develop` 브랜치**: 프리뷰 배포
- **Pull Request**: 프리뷰 배포
- **수동 실행**: `workflow_dispatch`로 수동 실행 가능

### 배포 프로세스

1. ✅ 코드 체크아웃
2. ✅ Node.js 설정 및 의존성 설치
3. ✅ 코드 린트 실행
4. ✅ 테스트 실행
5. ✅ 프로덕션 빌드
6. ✅ Vercel에 배포

## 🔍 문제 해결

### Secrets가 인식되지 않는 경우

1. Secrets 이름이 정확한지 확인 (대소문자 구분)
2. GitHub Actions 탭에서 워크플로우 로그 확인
3. Secrets가 저장소 레벨에서 설정되었는지 확인 (조직 레벨이 아님)

### 배포 실패 시

1. GitHub Actions 로그 확인
2. Vercel 대시보드에서 배포 로그 확인
3. 환경 변수가 Vercel에 설정되어 있는지 확인

## 📚 참고 자료

- [GitHub Secrets 문서](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel GitHub Actions](https://vercel.com/docs/integrations/github)
- [Vercel CLI 문서](https://vercel.com/docs/cli)

