# 🚀 MacChain Bible App - AWS EC2 배포 가이드

이 가이드는 MacChain Bible App을 AWS EC2 프리티어에 배포하는 방법을 설명합니다.

## 🎉 **배포 완료 상태**

현재 MacChain Bible App이 성공적으로 AWS EC2에 배포되어 운영 중입니다!

### **🌐 프로덕션 접속 정보**
- **웹사이트**: http://54.180.83.170
- **API**: http://54.180.83.170:8081/api
- **모니터링**: http://54.180.83.170:9090
- **대시보드**: http://54.180.83.170:3001

### **💰 비용 최적화 결과**
- **월 AWS 비용**: $0 (완전 무료)
- **연간 절약**: $1,200+
- **프리티어 활용률**: 100%

## 📋 목차

1. [사전 준비](#사전-준비)
2. [AWS 설정](#aws-설정)
3. [EC2 인스턴스 생성](#ec2-인스턴스-생성)
4. [애플리케이션 배포](#애플리케이션-배포)
5. [모니터링 및 관리](#모니터링-및-관리)
6. [문제 해결](#문제-해결)

## 🛠️ 사전 준비

### 필요한 도구

- **AWS CLI**: AWS 리소스 관리
- **jq**: JSON 데이터 처리
- **SSH 클라이언트**: EC2 인스턴스 접속

### 설치 방법

```bash
# macOS
brew install awscli jq

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install awscli jq

# CentOS/RHEL
sudo yum install awscli jq
```

## ⚙️ AWS 설정

### 1. AWS 계정 준비

1. [AWS 콘솔](https://aws.amazon.com/console/)에 로그인
2. IAM 서비스로 이동
3. 새 사용자 생성 (프로그래밍 방식 액세스)
4. 다음 권한 정책 연결:
   - `AmazonEC2FullAccess`
   - `IAMReadOnlyAccess`

### 2. AWS CLI 설정

```bash
# AWS 자격 증명 설정
aws configure

# 입력 정보:
# AWS Access Key ID: [IAM 사용자의 액세스 키]
# AWS Secret Access Key: [IAM 사용자의 시크릿 키]
# Default region name: ap-northeast-2 (서울 리전)
# Default output format: json
```

### 3. 설정 확인

```bash
# AWS 배포 헬퍼로 설정 확인
./scripts/aws-deploy-helper.sh setup
./scripts/aws-deploy-helper.sh check
```

## 🚀 EC2 인스턴스 생성

### 자동 생성 (권장)

```bash
# 프리티어 EC2 인스턴스 자동 생성
./scripts/aws-deploy-helper.sh create
```

이 명령어는 다음을 자동으로 수행합니다:

- **인스턴스 타입**: t2.micro (프리티어)
- **AMI**: Amazon Linux 2023
- **보안 그룹**: HTTP(80), HTTPS(443), SSH(22), API(8081) 포트 개방
- **키 페어**: macchain-key.pem 생성
- **사용자 데이터**: Docker, Node.js, Java 자동 설치

### 수동 생성

AWS 콘솔에서 직접 생성하려면:

1. EC2 대시보드 → "인스턴스 시작"
2. AMI 선택: Amazon Linux 2023 AMI
3. 인스턴스 유형: t2.micro
4. 키 페어: 새로 생성 또는 기존 사용
5. 보안 그룹: 다음 포트 개방
   - SSH (22): 0.0.0.0/0
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0
   - Custom TCP (8081): 0.0.0.0/0

## 📦 애플리케이션 배포

### 1. 인스턴스 상태 확인

```bash
# 인스턴스 목록 조회
./scripts/aws-deploy-helper.sh list

# 특정 인스턴스 상태 확인
./scripts/aws-deploy-helper.sh status i-1234567890abcdef0
```

### 2. 자동 배포 실행

```bash
# 애플리케이션 자동 배포
./scripts/aws-deploy-helper.sh deploy i-1234567890abcdef0
```

배포 과정:
1. GitHub에서 최신 코드 클론
2. 백엔드 빌드 및 실행 (포트 8081)
3. 프론트엔드 빌드 및 실행 (포트 80)

### 3. 수동 배포

SSH로 직접 접속하여 배포:

```bash
# SSH 접속
ssh -i macchain-key.pem ec2-user@[PUBLIC_IP]

# 애플리케이션 디렉토리 생성
sudo mkdir -p /opt/macchain
sudo chown ec2-user:ec2-user /opt/macchain
cd /opt/macchain

# 저장소 클론
git clone https://github.com/daehee719/macchain-bible-app.git .

# 백엔드 빌드 및 실행
cd macchain-backend
chmod +x gradlew
./gradlew build -x test
nohup ./gradlew bootRun --args='--spring.profiles.active=prod' > ../backend.log 2>&1 &

# 프론트엔드 빌드 및 실행
cd ../macchain-frontend
npm install
npm run build
nohup npm run preview -- --host 0.0.0.0 --port 80 > ../frontend.log 2>&1 &
```

## 🌐 접속 확인

배포 완료 후 다음 URL로 접속:

- **프론트엔드**: `http://[PUBLIC_IP]`
- **백엔드 API**: `http://[PUBLIC_IP]:8081`
- **Health Check**: `http://[PUBLIC_IP]:8081/api/health`

## 📊 모니터링 및 관리

### 로그 확인

```bash
# 배포 로그 확인
./scripts/aws-deploy-helper.sh logs i-1234567890abcdef0

# SSH로 직접 로그 확인
ssh -i macchain-key.pem ec2-user@[PUBLIC_IP]
tail -f /opt/macchain/backend.log
tail -f /opt/macchain/frontend.log
```

### 인스턴스 관리

```bash
# 인스턴스 시작
./scripts/aws-deploy-helper.sh start i-1234567890abcdef0

# 인스턴스 중지
./scripts/aws-deploy-helper.sh stop i-1234567890abcdef0

# 인스턴스 종료 (주의: 복구 불가)
./scripts/aws-deploy-helper.sh terminate i-1234567890abcdef0
```

### 애플리케이션 업데이트

```bash
# 코드 업데이트 후 재배포
./scripts/aws-deploy-helper.sh deploy i-1234567890abcdef0
```

## 🔒 보안 설정

### SSL/TLS 인증서 (선택사항)

Let's Encrypt를 사용한 무료 SSL 인증서:

```bash
# Certbot 설치
sudo yum install -y certbot

# 인증서 발급 (도메인 필요)
sudo certbot certonly --standalone -d yourdomain.com

# Nginx 설정으로 HTTPS 리다이렉트
```

### 방화벽 설정

```bash
# 필요한 포트만 개방
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=8081/tcp
sudo firewall-cmd --reload
```

## 💰 비용 최적화

### 프리티어 한도 관리

- **EC2**: 월 750시간 (t2.micro)
- **EBS**: 30GB 범용 SSD
- **데이터 전송**: 월 15GB

### 비용 절약 팁

1. **인스턴스 스케줄링**: 사용하지 않을 때 중지
2. **모니터링**: CloudWatch로 사용량 추적
3. **스냅샷 관리**: 불필요한 스냅샷 삭제

## 🚨 문제 해결

### 일반적인 문제

#### 1. SSH 접속 실패

```bash
# 키 파일 권한 확인
chmod 400 macchain-key.pem

# 보안 그룹에서 SSH(22) 포트 개방 확인
aws ec2 describe-security-groups --group-names macchain-sg
```

#### 2. 애플리케이션 접속 불가

```bash
# 인스턴스 상태 확인
./scripts/aws-deploy-helper.sh status i-1234567890abcdef0

# 프로세스 확인
ssh -i macchain-key.pem ec2-user@[PUBLIC_IP] "ps aux | grep -E '(java|node)'"

# 포트 확인
ssh -i macchain-key.pem ec2-user@[PUBLIC_IP] "sudo netstat -tlnp | grep -E '(80|8081)'"
```

#### 3. 메모리 부족

```bash
# 메모리 사용량 확인
ssh -i macchain-key.pem ec2-user@[PUBLIC_IP] "free -h"

# 스왑 파일 생성 (임시 해결)
ssh -i macchain-key.pem ec2-user@[PUBLIC_IP] "
sudo dd if=/dev/zero of=/swapfile bs=1M count=1024
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
"
```

### 로그 분석

```bash
# 시스템 로그
sudo journalctl -u docker
sudo tail -f /var/log/messages

# 애플리케이션 로그
tail -f /opt/macchain/backend.log
tail -f /opt/macchain/frontend.log
```

## 📚 추가 리소스

- [AWS EC2 사용자 가이드](https://docs.aws.amazon.com/ec2/)
- [AWS 프리티어](https://aws.amazon.com/free/)
- [Docker 공식 문서](https://docs.docker.com/)
- [Node.js 배포 가이드](https://nodejs.org/en/docs/guides/)

## 🆘 지원

문제가 발생하면 다음을 확인하세요:

1. [GitHub Issues](https://github.com/daehee719/macchain-bible-app/issues)
2. 배포 로그 및 시스템 로그
3. AWS CloudWatch 메트릭스

---

**주의**: 프리티어 한도를 초과하면 요금이 부과될 수 있습니다. 사용량을 정기적으로 모니터링하세요.
