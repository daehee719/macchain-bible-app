# AWS EC2 배포 설정 가이드

## 🚀 빠른 시작

### 1. AWS EC2 인스턴스 생성

#### EC2 인스턴스 설정
```bash
# 인스턴스 타입: t2.micro (Free Tier)
# AMI: Ubuntu Server 22.04 LTS
# 스토리지: 8GB gp3
# 보안 그룹: 
#   - SSH (22) - 내 IP
#   - HTTP (80) - 0.0.0.0/0
#   - HTTPS (443) - 0.0.0.0/0
#   - Custom (3000) - 0.0.0.0/0 (Frontend)
#   - Custom (8080) - 0.0.0.0/0 (Backend)
#   - Custom (9090) - 0.0.0.0/0 (Prometheus)
#   - Custom (3001) - 0.0.0.0/0 (Grafana)
```

### 2. EC2 서버 초기 설정

```bash
# 서버 접속
ssh -i your-key.pem ubuntu@your-ec2-ip

# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Docker 설치
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Docker Compose 설치
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Git 설치
sudo apt install git -y

# 로그아웃 후 재로그인 (Docker 그룹 권한 적용)
exit
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 3. SSH 키 설정

```bash
# GitHub Actions에서 사용할 SSH 키 생성
ssh-keygen -t rsa -b 4096 -C "github-actions@macchain" -f ~/.ssh/github_actions

# 공개키를 authorized_keys에 추가
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# 개인키 내용 복사 (GitHub Secrets에 추가할 용도)
cat ~/.ssh/github_actions
```

## 🔐 GitHub Secrets 설정

Repository Settings → Secrets and variables → Actions에서 다음 시크릿들을 추가:

### 필수 시크릿
```bash
# Docker Hub
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password

# SSH 배포
DEPLOY_HOST=your-ec2-public-ip
DEPLOY_USER=ubuntu
DEPLOY_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
your-private-key-content
-----END OPENSSH PRIVATE KEY-----

# 배포 URL (EC2 퍼블릭 IP 사용)
BACKEND_URL=http://your-ec2-public-ip:8080
FRONTEND_URL=http://your-ec2-public-ip:3000

# 애플리케이션 설정
OPENAI_API_KEY=your-openai-api-key
JWT_SECRET=your-super-secret-jwt-key-for-production
```

## 🐳 Docker Hub 설정

### 1. Docker Hub 계정 생성
- [Docker Hub](https://hub.docker.com)에서 계정 생성
- 리포지토리 생성:
  - `your-username/macchain-backend`
  - `your-username/macchain-frontend`

### 2. 로컬에서 이미지 빌드 테스트
```bash
# 백엔드 이미지 빌드
cd macchain-backend
docker build -t your-username/macchain-backend:latest .

# 프론트엔드 이미지 빌드
cd ../macchain-frontend
docker build -t your-username/macchain-frontend:latest .

# 이미지 푸시
docker login
docker push your-username/macchain-backend:latest
docker push your-username/macchain-frontend:latest
```

## 🚀 배포 테스트

### 1. 수동 배포 테스트
```bash
# EC2 서버에서
cd /opt/macchain
git clone https://github.com/your-username/macchain-bible-app.git .
cp docker-compose.prod.yml .
cp scripts/deploy.sh .
chmod +x deploy.sh

# 환경 변수 설정
export BACKEND_IMAGE=your-username/macchain-backend:latest
export FRONTEND_IMAGE=your-username/macchain-frontend:latest
export FRONTEND_URL=http://your-ec2-ip:3000
export OPENAI_API_KEY=your-openai-key
export JWT_SECRET=your-jwt-secret

# 배포 실행
./deploy.sh
```

### 2. GitHub Actions 배포
- `develop` 또는 `main` 브랜치에 푸시
- GitHub Actions에서 자동 배포 확인
- 배포 완료 후 URL 접속 테스트

## 🔍 배포 확인

### 접속 URL
- **Frontend**: `http://your-ec2-ip:3000`
- **Backend API**: `http://your-ec2-ip:8080`
- **API Health**: `http://your-ec2-ip:8080/actuator/health`
- **Prometheus**: `http://your-ec2-ip:9090`
- **Grafana**: `http://your-ec2-ip:3001` (admin/admin)

### 로그 확인
```bash
# 전체 로그
docker-compose -f docker-compose.prod.yml logs

# 특정 서비스 로그
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend

# 실시간 로그
docker-compose -f docker-compose.prod.yml logs -f
```

## 🛠️ 문제 해결

### 1. 포트 충돌
```bash
# 사용 중인 포트 확인
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8080

# 프로세스 종료
sudo kill -9 PID
```

### 2. Docker 권한 문제
```bash
# Docker 그룹에 사용자 추가
sudo usermod -aG docker $USER
newgrp docker
```

### 3. 디스크 공간 부족
```bash
# 불필요한 Docker 리소스 정리
docker system prune -a
docker volume prune
```

### 4. 메모리 부족 (t2.micro)
```bash
# 스왑 파일 생성
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 영구적으로 스왑 활성화
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 💰 비용 최적화

### AWS Free Tier 활용
- **EC2**: t2.micro (750시간/월 무료)
- **EBS**: 30GB gp2 (무료)
- **데이터 전송**: 1GB/월 무료

### 예상 월 비용
- **Free Tier 사용**: $0
- **Free Tier 초과 시**: ~$8-15/월

## 🔒 보안 설정

### 1. 방화벽 설정
```bash
# UFW 방화벽 설정
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 8080
```

### 2. SSL 인증서 (선택사항)
```bash
# Let's Encrypt 인증서 설치
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com
```

## 📊 모니터링

### 1. Prometheus 메트릭
- CPU, 메모리, 디스크 사용량
- 애플리케이션 메트릭
- 데이터베이스 연결 상태

### 2. Grafana 대시보드
- 시스템 리소스 모니터링
- 애플리케이션 성능 지표
- 알림 설정

이제 실제 AWS EC2에서 MacChain 애플리케이션을 배포할 수 있습니다! 🎉
