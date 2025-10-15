# Cloudflare CI/CD 설정 가이드

## 🔑 필요한 GitHub Secrets

Cloudflare CI/CD를 위해 다음 Secrets를 GitHub Repository Settings에 추가해야 합니다:

### 1. Cloudflare API Token
- **Name**: `CLOUDFLARE_API_TOKEN`
- **Value**: Cloudflare Dashboard > My Profile > API Tokens > Create Token
- **Permissions**: 
  - `Account:Cloudflare Workers:Edit`
  - `Zone:Zone:Read`
  - `Account:Cloudflare Pages:Edit`

### 2. Cloudflare Account ID
- **Name**: `CLOUDFLARE_ACCOUNT_ID`
- **Value**: Cloudflare Dashboard > Right sidebar > Account ID

## 🚀 CI/CD 워크플로우

### 1. Workers 자동 배포
- **트리거**: `cloudflare-workers/` 디렉토리 변경 시
- **동작**: 
  - 의존성 설치
  - 코드 린팅
  - 테스트 실행
  - Workers 배포
  - D1 데이터베이스 마이그레이션

### 2. Pages 자동 배포
- **트리거**: `macchain-frontend/` 디렉토리 변경 시
- **동작**:
  - 의존성 설치
  - 코드 린팅
  - 테스트 실행
  - 빌드
  - Pages 배포

### 3. 통합 배포
- **트리거**: Workers 또는 Frontend 변경 시
- **동작**: 변경된 부분만 선택적 배포

## 📊 배포 상태 확인

### GitHub Actions
- Repository > Actions 탭에서 배포 상태 확인
- 각 워크플로우의 상세 로그 확인 가능

### Cloudflare Dashboard
- **Workers**: Workers & Pages > Workers 탭
- **Pages**: Workers & Pages > Pages 탭
- **D1**: Workers & Pages > D1 SQL Database 탭

## 🔧 로컬 테스트

```bash
# Workers 테스트
cd cloudflare-workers
wrangler dev

# Pages 테스트
cd macchain-frontend
npm run dev
```

## 🎯 배포 URL

- **Workers API**: `https://macchain-api.daeheuigang.workers.dev`
- **Pages Frontend**: `https://0cc983c4.macchain-frontend.pages.dev`

## 🚨 문제 해결

### 1. API Token 권한 오류
- Cloudflare Dashboard에서 API Token 권한 확인
- Account ID가 올바른지 확인

### 2. 배포 실패
- GitHub Actions 로그 확인
- Cloudflare Dashboard에서 에러 메시지 확인

### 3. CORS 오류
- Workers에서 CORS 헤더 설정 확인
- Pages와 Workers 도메인 확인
