#!/bin/bash
# 개발 환경 실행 스크립트

echo "🚀 MacChain Backend - 개발 환경 시작"
echo "=================================="

# Java 17 설정
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home

# 개발 프로파일로 실행
./gradlew bootRun --args='--spring.profiles.active=dev'

echo "✅ 개발 환경 종료"
