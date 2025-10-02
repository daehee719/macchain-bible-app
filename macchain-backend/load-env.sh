#!/bin/bash

# MacChain Backend 환경 변수 로드 스크립트

# 환경 변수 파일 로드
if [ -f "environment.properties" ]; then
    echo "🔍 환경 변수 파일 로드 중..."
    export $(cat environment.properties | grep -v '^#' | xargs)
    echo "✅ 환경 변수 로드 완료"
else
    echo "⚠️ environment.properties 파일을 찾을 수 없습니다."
fi

# 환경 변수 확인
echo "🔍 환경 변수 확인:"
echo "  OPENAI_API_KEY: ${OPENAI_API_KEY:0:20}..."
echo "  POSTGRES_HOST: $POSTGRES_HOST"
echo "  POSTGRES_PORT: $POSTGRES_PORT"
echo "  POSTGRES_DB: $POSTGRES_DB"
echo "  MONGODB_HOST: $MONGODB_HOST"
echo "  MONGODB_PORT: $MONGODB_PORT"
echo "  MONGODB_DB: $MONGODB_DB"
echo "  REDIS_HOST: $REDIS_HOST"
echo "  REDIS_PORT: $REDIS_PORT"

