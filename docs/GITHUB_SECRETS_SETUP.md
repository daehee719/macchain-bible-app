# 🔐 GitHub Secrets 설정 가이드

GitHub Actions CI/CD 파이프라인을 위한 필수 Secrets 설정 방법입니다.

## 📋 설정 방법

1. GitHub 레포지토리 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. 아래 목록의 각 Secret을 추가

## 🔑 필수 Secrets 목록

### 🐳 Docker Hub 설정
```
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=your-docker-password-or-token
```

### 🗄️ 데이터베이스 설정
```
DB_HOST=your-database-host
DB_NAME=macchain
DB_USERNAME=macchain
DB_PASSWORD=your-secure-database-password

MONGODB_HOST=your-mongodb-host
MONGODB_PORT=27017
MONGODB_DB=macchain_analysis

REDIS_HOST=your-redis-host
REDIS_PORT=6379
```

### 🤖 OpenAI API 설정
```
OPENAI_API_KEY=your-openai-api-key
```

### 🔐 JWT 보안 설정
```
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
```

### 🚀 배포 서버 설정
```
DEPLOY_HOST=your-server-ip-or-domain
DEPLOY_USER=deploy
DEPLOY_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
your-ssh-private-key-content
-----END OPENSSH PRIVATE KEY-----
```

### 🌐 URL 설정
```
FRONTEND_URL=https://macchain.yourdomain.com
BACKEND_URL=https://api.macchain.yourdomain.com
```

### 📢 알림 설정
```
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

### ☁️ 클라우드 서비스 (선택사항)

#### AWS 설정
```
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```

#### Vercel 설정 (프론트엔드 배포)
```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
```

#### 보안 스캔 설정
```
SNYK_TOKEN=your-snyk-token
```

## 🛡️ 보안 모범 사례

### 1. 강력한 비밀번호 사용
- 최소 16자 이상
- 대소문자, 숫자, 특수문자 조합
- 각 서비스마다 다른 비밀번호 사용

### 2. SSH 키 관리
```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "macchain-deploy"

# 공개키를 서버에 추가
ssh-copy-id -i ~/.ssh/macchain-deploy.pub deploy@your-server

# 개인키 내용을 GitHub Secret에 추가
cat ~/.ssh/macchain-deploy
```

### 3. JWT Secret 생성
```bash
# 안전한 JWT Secret 생성
openssl rand -base64 32
```

### 4. 환경별 Secrets 관리
- **Development**: 개발용 값
- **Staging**: 테스트용 값  
- **Production**: 운영용 값

## 🔄 Environment별 설정

GitHub에서 **Settings** → **Environments**에서 환경별 Secrets 설정:

### 🧪 Staging Environment
```
ENVIRONMENT=staging
DB_HOST=staging-db.yourdomain.com
FRONTEND_URL=https://staging.macchain.yourdomain.com
```

### 🚀 Production Environment
```
ENVIRONMENT=production
DB_HOST=prod-db.yourdomain.com
FRONTEND_URL=https://macchain.yourdomain.com
```

## ✅ 설정 확인

1. **GitHub Actions** 탭에서 워크플로우 실행 확인
2. 로그에서 Secret 값이 `***`로 마스킹되는지 확인
3. 배포 후 애플리케이션 정상 동작 확인

## 🚨 주의사항

- ❌ Secret 값을 코드에 하드코딩하지 마세요
- ❌ Secret 값을 로그에 출력하지 마세요
- ❌ Secret 값을 Pull Request에 포함하지 마세요
- ✅ 정기적으로 Secret 값을 교체하세요
- ✅ 필요한 최소한의 권한만 부여하세요

## 📞 문제 해결

### Secret 값이 인식되지 않는 경우
1. Secret 이름의 대소문자 확인
2. 공백이나 특수문자 확인
3. Environment 설정 확인

### SSH 연결 실패
1. SSH 키 형식 확인 (개행 문자 포함)
2. 서버의 공개키 등록 확인
3. 방화벽 설정 확인

### Docker 이미지 푸시 실패
1. Docker Hub 토큰 권한 확인
2. 레포지토리 이름 확인
3. 네트워크 연결 확인
