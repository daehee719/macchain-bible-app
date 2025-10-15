# Cloudflare Workers + Pages 배포 가이드

## 🚀 개요

MacChain 프로젝트를 Cloudflare Workers (백엔드) + Cloudflare Pages (프론트엔드)로 마이그레이션하는 가이드입니다.

## 📋 사전 준비

### 1. Cloudflare 계정 생성
- [Cloudflare](https://cloudflare.com)에서 계정 생성
- 무료 플랜으로 시작 가능

### 2. Wrangler CLI 설치
```bash
npm install -g wrangler
wrangler login
```

## 🗄️ D1 데이터베이스 설정

### 1. 데이터베이스 생성
```bash
# 프로덕션 데이터베이스
wrangler d1 create macchain-db

# 개발 데이터베이스
wrangler d1 create macchain-db-dev
```

### 2. 스키마 적용
```bash
# 프로덕션
wrangler d1 execute macchain-db --file=cloudflare-workers/database/schema.sql

# 개발
wrangler d1 execute macchain-db-dev --file=cloudflare-workers/database/schema.sql
```

### 3. wrangler.toml 업데이트
```toml
[[d1_databases]]
binding = "DB"
database_name = "macchain-db"
database_id = "실제-데이터베이스-ID"
```

## 🔧 Workers 배포 (백엔드)

### 1. 프로젝트 디렉토리로 이동
```bash
cd cloudflare-workers
```

### 2. 시크릿 설정
```bash
# JWT 시크릿
wrangler secret put JWT_SECRET

# OpenAI API 키
wrangler secret put OPENAI_API_KEY
```

### 3. Workers 배포
```bash
# 프로덕션 배포
wrangler deploy

# 개발 환경 배포
wrangler deploy --env development
```

### 4. 커스텀 도메인 설정 (선택사항)
```bash
# 도메인 추가
wrangler route add "api.your-domain.com/*" macchain-api
```

## 🎨 Pages 배포 (프론트엔드)

### 1. Cloudflare Dashboard에서 Pages 프로젝트 생성
1. Cloudflare Dashboard → Pages → Create a project
2. Connect to Git → GitHub 선택
3. Repository: `your-username/macchain-bible-app`
4. Framework preset: `React`
5. Build command: `cd macchain-frontend && npm run build`
6. Build output directory: `macchain-frontend/dist`

### 2. 환경 변수 설정
Pages 프로젝트 설정에서 다음 환경 변수 추가:
```
REACT_APP_API_URL=https://macchain-api.your-domain.workers.dev
REACT_APP_FRONTEND_URL=https://macchain.your-domain.pages.dev
```

### 3. 자동 배포 설정
- `main` 브랜치에 푸시 시 자동 배포
- `develop` 브랜치에 푸시 시 프리뷰 배포

## 🔄 CI/CD 설정

### 1. GitHub Actions 워크플로우 생성
```yaml
# .github/workflows/cloudflare-deploy.yml
name: Cloudflare Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  deploy-workers:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy Workers
        run: |
          cd cloudflare-workers
          wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

  deploy-pages:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy Pages
        run: |
          cd macchain-frontend
          wrangler pages deploy dist
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### 2. GitHub Secrets 설정
```
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
```

## 📊 모니터링 설정

### 1. Analytics 활성화
- Workers Dashboard → Analytics
- Pages Dashboard → Analytics

### 2. 알림 설정
- Workers → Settings → Alerts
- Pages → Settings → Notifications

## 🔒 보안 설정

### 1. CORS 설정
```javascript
// cloudflare-workers/api/index.js
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://macchain.your-domain.pages.dev',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

### 2. Rate Limiting
```javascript
// Workers에서 Rate Limiting 구현
const rateLimit = new Map();
const RATE_LIMIT = 100; // 요청/분
```

## 💰 비용 분석

### Cloudflare Free Tier
- **Workers**: 100,000 요청/일
- **Pages**: 무제한 빌드
- **D1**: 5GB 저장공간
- **KV**: 100,000 읽기/일

### 예상 월 비용
- **Free Tier 사용**: $0
- **Pro Plan**: $5/월 (Workers) + $0 (Pages)
- **총 비용**: $0-5/월

## 🚀 배포 확인

### 1. API 테스트
```bash
# 헬스 체크
curl https://macchain-api.your-domain.workers.dev/api/health

# 사용자 등록
curl -X POST https://macchain-api.your-domain.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password","name":"Test","nickname":"test"}'
```

### 2. 프론트엔드 확인
- https://macchain.your-domain.pages.dev 접속
- 로그인/회원가입 테스트
- 읽기 계획 확인

## 🔧 문제 해결

### 1. Workers 배포 실패
```bash
# 로그 확인
wrangler tail

# 로컬 테스트
wrangler dev
```

### 2. Pages 빌드 실패
- Pages Dashboard → Functions → Logs 확인
- 환경 변수 설정 확인
- 빌드 명령어 확인

### 3. 데이터베이스 연결 오류
```bash
# D1 데이터베이스 상태 확인
wrangler d1 list

# 쿼리 테스트
wrangler d1 execute macchain-db --command="SELECT * FROM users LIMIT 5"
```

## 📈 성능 최적화

### 1. 캐싱 전략
- 정적 데이터: D1 + KV 캐싱
- API 응답: Workers 캐싱
- 프론트엔드: Pages CDN

### 2. 이미지 최적화
- Cloudflare Images 사용
- 자동 WebP 변환
- 지연 로딩

이제 MacChain이 Cloudflare의 글로벌 네트워크에서 실행됩니다! 🌍
