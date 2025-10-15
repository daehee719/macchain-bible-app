#!/bin/bash
# 테스트 환경 실행 스크립트

echo "🧪 MacChain Backend - 테스트 환경 시작"
echo "===================================="

# Java 17 설정
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home

# 테스트 프로파일로 실행
./gradlew bootRun --args='--spring.profiles.active=test'

echo "✅ 테스트 환경 종료"
