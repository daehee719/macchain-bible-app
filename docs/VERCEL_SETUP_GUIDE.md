# Vercel 배포 설정 가이드

## ✅ 완료된 작업

1. ✅ Vercel MCP server 설정 추가 (`.cursor/mcp.json`)
2. ✅ Vercel 설정 파일 생성 (`vercel.json`)
3. ✅ `.vercelignore` 파일 생성
4. ✅ Vercel 토큰 설정 완료

## 📋 배포 방법

### 방법 1: Vercel CLI 사용 (권장)

#### 1. Vercel CLI 설치 및 로그인

```bash
cd macchain-frontend
npm install -g vercel
vercel login
```

#### 2. 프로젝트 배포

```bash
# 프로젝트 디렉토리에서 실행
vercel

# 프로덕션 배포
vercel --prod
```

첫 배포 시 다음 정보를 입력합니다:
- **Set up and deploy?** → `Y`
- **Which scope?** → 본인 계정 선택
- **Link to existing project?** → `N` (새 프로젝트)
- **What's your project's name?** → `macchain-frontend` (또는 원하는 이름)
- **In which directory is your code located?** → `./` (현재 디렉토리)

#### 3. 환경 변수 설정

배포 후 Vercel 대시보드에서 환경 변수를 설정하거나, CLI로 설정:

```bash
vercel env add VITE_SUPABASE_URL
# 입력: https://dazushjgczteromlitve.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# 입력: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhenVzaGpnY3p0ZXJvbWxpdHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDEyOTIsImV4cCI6MjA4MDMxNzI5Mn0.c4iPQm0HrYtE1N3nW_k0bG1LJJMr4r-7G2pL8_yq93I
```

환경 변수 설정 후 재배포:

```bash
vercel --prod
```

### 방법 2: Vercel 대시보드 사용

#### 1. 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. **Add New** → **Project** 클릭
3. GitHub 저장소 연결 (또는 **Import Git Repository**)
4. 프로젝트 설정:
   - **Framework Preset**: Vite
   - **Root Directory**: `macchain-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 2. 환경 변수 설정

⚠️ **환경별 DB 분리 권장**: 프로덕션과 개발 환경에서 다른 Supabase 프로젝트를 사용하는 것을 권장합니다. 자세한 내용은 `docs/ENVIRONMENT_DB_SEPARATION.md`를 참고하세요.

**프로덕션 환경 변수:**
1. 프로젝트 대시보드 → **Settings** → **Environment Variables**
2. 다음 변수 추가 (Production 환경만 선택):
   - `VITE_SUPABASE_URL`: `https://dazushjgczteromlitve.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhenVzaGpnY3p0ZXJvbWxpdHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDEyOTIsImV4cCI6MjA4MDMxNzI5Mn0.c4iPQm0HrYtE1N3nW_k0bG1LJJMr4r-7G2pL8_yq93I`
   - **Production**만 선택

**개발/프리뷰 환경 변수 (선택사항):**
개발용 Supabase 프로젝트를 생성한 경우:
1. `VITE_SUPABASE_URL` (Preview, Development): 개발 프로젝트 URL
2. `VITE_SUPABASE_ANON_KEY` (Preview, Development): 개발 프로젝트 Anon Key
   - **Preview**, **Development** 선택

#### 3. 배포

환경 변수 설정 후 자동으로 재배포되거나, **Deployments** 탭에서 수동으로 재배포할 수 있습니다.

## 🔧 빌드 설정

현재 빌드 설정:
- **빌드 명령어**: `npm run build`
- **출력 디렉토리**: `dist`
- **프레임워크**: Vite

## 📁 생성된 파일

- `macchain-frontend/vercel.json`: Vercel 배포 설정
- `macchain-frontend/.vercelignore`: 배포 제외 파일 목록

## 🔑 Supabase 정보

- **Project URL**: `https://dazushjgczteromlitve.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhenVzaGpnY3p0ZXJvbWxpdHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDEyOTIsImV4cCI6MjA4MDMxNzI5Mn0.c4iPQm0HrYtE1N3nW_k0bG1LJJMr4r-7G2pL8_yq93I`

## 🚀 배포 후 확인

배포가 완료되면:
1. Vercel에서 제공하는 배포 URL 확인
2. 사이트 접속하여 기능 테스트
3. 브라우저 콘솔에서 Supabase 연결 확인
4. 로그인/회원가입 기능 테스트

## 🔄 자동 배포 설정

Vercel은 GitHub와 연동하여 자동 배포를 지원합니다. 두 가지 방법이 있습니다:

### 방법 1: Vercel 대시보드에서 GitHub 연동 (가장 간단) ⭐

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 `macchain-frontend` 선택
3. **Settings** → **Git** 이동
4. **Connect Git Repository** 클릭
5. GitHub 저장소 `daehee719/macchain-bible-app` 선택
6. **Root Directory**를 `macchain-frontend`로 설정
7. **Deploy** 클릭

이제 `main` 또는 `develop` 브랜치에 푸시하면 자동으로 배포됩니다!

### 방법 2: GitHub Actions 사용 (더 세밀한 제어)

#### 1. GitHub Secrets 설정

GitHub 저장소에서 다음 Secrets를 추가합니다:

1. [GitHub 저장소](https://github.com/daehee719/macchain-bible-app) → **Settings** → **Secrets and variables** → **Actions**
2. 다음 Secrets 추가:
   - `VERCEL_TOKEN`: `s5svm0QGCnHi75fP46JMHy6C`
   - `VERCEL_ORG_ID`: `team_xCcpHuJFh6bNrjcDBVzvyCZy`
   - `VERCEL_PROJECT_ID`: `prj_7E3Q0HA7TbqsWuzjAAcCM715s3rl`

#### 2. 자동 배포 동작

`.github/workflows/vercel-deploy.yml` 워크플로우가 생성되어 있습니다.

**자동 배포 트리거:**
- `main` 또는 `develop` 브랜치에 `macchain-frontend/**` 경로 변경 시
- Pull Request 생성 시 (프리뷰 배포)
- 수동 실행 (`workflow_dispatch`)

**배포 프로세스:**
1. 코드 체크아웃
2. Node.js 설정 및 의존성 설치
3. 코드 린트 및 테스트 실행
4. 프로덕션 빌드
5. Vercel에 배포

#### 3. 배포 확인

배포 후:
- GitHub Actions 탭에서 배포 상태 확인
- Vercel 대시보드에서 배포 로그 확인
- 배포된 URL로 접속하여 확인

### 배포 브랜치 전략

- **`main` 브랜치**: 프로덕션 배포 (자동)
- **`develop` 브랜치**: 스테이징 배포 (자동)
- **기타 브랜치**: Pull Request 시 프리뷰 배포

### 환경 변수 관리

환경 변수는 Vercel 대시보드에서 관리됩니다:
- **Production**: `main` 브랜치 배포 시 사용
- **Preview**: Pull Request 및 기타 브랜치 배포 시 사용
- **Development**: 로컬 개발 시 사용

현재 설정된 환경 변수:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`


