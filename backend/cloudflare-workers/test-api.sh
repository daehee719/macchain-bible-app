#!/bin/bash
# 백엔드 API 테스트 스크립트

API_URL="https://macchain-api-public.daeheuigang.workers.dev"
TIMESTAMP=$(date +%s)
TEST_EMAIL="apitest${TIMESTAMP}@example.com"
TEST_PASSWORD="test1234"
TEST_NAME="API테스트"
TEST_NICKNAME="테스터${TIMESTAMP}"

echo "=== MacChain 백엔드 API 테스트 ==="
echo ""

# 1. 헬스체크
echo "1. 헬스체크 테스트..."
HEALTH_RESPONSE=$(curl -s "${API_URL}/api/health")
echo "응답: $HEALTH_RESPONSE"
echo ""

# 2. 회원가입
echo "2. 회원가입 테스트..."
REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${TEST_EMAIL}\",
    \"password\": \"${TEST_PASSWORD}\",
    \"name\": \"${TEST_NAME}\",
    \"nickname\": \"${TEST_NICKNAME}\"
  }")

echo "응답: $REGISTER_RESPONSE"
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ 회원가입 실패"
  exit 1
fi

echo "✅ 회원가입 성공, 토큰: ${TOKEN:0:50}..."
echo ""

# 3. 로그인
echo "3. 로그인 테스트..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${TEST_EMAIL}\",
    \"password\": \"${TEST_PASSWORD}\"
  }")

echo "응답: $LOGIN_RESPONSE"
LOGIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$LOGIN_TOKEN" ]; then
  echo "❌ 로그인 실패"
  exit 1
fi

echo "✅ 로그인 성공"
echo ""

# 4. 토큰 검증
echo "4. 토큰 검증 테스트..."
VERIFY_RESPONSE=$(curl -s -X POST "${API_URL}/api/auth/verify" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${LOGIN_TOKEN}")

echo "응답: $VERIFY_RESPONSE"
echo ""

# 5. 사용자 프로필 조회
echo "5. 사용자 프로필 조회 테스트..."
PROFILE_RESPONSE=$(curl -s "${API_URL}/api/users/profile" \
  -H "Authorization: Bearer ${LOGIN_TOKEN}")

echo "응답: $PROFILE_RESPONSE"
echo ""

# 6. 오늘의 읽기 계획
echo "6. 오늘의 읽기 계획 테스트..."
PLAN_RESPONSE=$(curl -s "${API_URL}/api/mccheyne/today")

echo "응답: $PLAN_RESPONSE"
echo ""

echo "=== 모든 테스트 완료 ==="

