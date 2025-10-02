#!/bin/bash
set -e

echo "🚀 MacChain Bible App 배포 시작"

# 기존 애플리케이션 정리
sudo pkill -f "java.*macchain" || true
sudo pkill -f "node.*macchain" || true

# 애플리케이션 디렉토리로 이동
cd /opt/macchain

# Git 저장소 클론 또는 업데이트
if [ -d ".git" ]; then
    echo "📥 기존 저장소 업데이트 중..."
    git pull origin main
else
    echo "📥 저장소 클론 중..."
    git clone https://github.com/daehee719/macchain-bible-app.git .
fi

# 백엔드 빌드 및 실행
echo "🔧 백엔드 빌드 중..."
cd macchain-backend
chmod +x gradlew
./gradlew build -x test

echo "🚀 백엔드 시작 중..."
nohup ./gradlew bootRun --args='--spring.profiles.active=prod' > ../backend.log 2>&1 &

# 프론트엔드 빌드 및 실행
echo "🔧 프론트엔드 빌드 중..."
cd ../macchain-frontend
npm install
npm run build

echo "🚀 프론트엔드 시작 중..."
nohup npm run preview -- --host 0.0.0.0 --port 80 > ../frontend.log 2>&1 &

echo "✅ 배포 완료!"
echo "🌐 애플리케이션 URL: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
