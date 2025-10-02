# 🚀 Redis 캐시 가이드

## 📊 Redis 캐시 시스템 개요

MacChain 서비스에 Redis를 활용한 분산 캐시 시스템을 도입했습니다.

### 🏗️ 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Redis Cache   │
│   (React)       │◄──►│   (Spring Boot) │◄──►│   (Port 6380)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   (Port 5434)   │
                       └─────────────────┘
```

## 🔧 설정 정보

### Redis 서버 설정
- **호스트**: localhost
- **포트**: 6380 (외부), 6379 (컨테이너 내부)
- **데이터베이스**: 0
- **비밀번호**: 없음
- **영속성**: AOF (Append Only File) 활성화

### 캐시 설정
- **캐시 타입**: Redis
- **직렬화**: JSON (Jackson2JsonRedisSerializer)
- **키 직렬화**: StringRedisSerializer

## 📋 캐시 전략

### 1. 맥체인 플랜 캐시 (`mccheyne-plans`)
- **TTL**: 24시간
- **용도**: 읽기 플랜 데이터 (변경 빈도 낮음)
- **키 형식**: `getTodayPlan_2025-09-30`

### 2. 사용자 진행률 캐시 (`user-progress`)
- **TTL**: 30분
- **용도**: 사용자별 읽기 진행률 (변경 빈도 중간)
- **키 형식**: `1_2025-09-30` (userId_date)

### 3. 사용자 통계 캐시 (`user-statistics`)
- **TTL**: 2시간
- **용도**: 사용자 통계 데이터 (계산 비용 높음)
- **키 형식**: `statistics_1` (userId)

## 🚀 사용법

### 1. 캐시 자동 적용
```java
@Cacheable(value = "user-progress", key = "#userId + '_' + T(java.time.LocalDate).now().toString()")
public ResponseEntity<UserProgressResponse> getUserProgress(@PathVariable Long userId) {
    // 자동으로 캐시에서 조회, 없으면 DB에서 조회 후 캐시에 저장
}
```

### 2. 캐시 무효화
```java
@CacheEvict(value = "user-progress", key = "#userId + '_' + T(java.time.LocalDate).now().toString()")
public ResponseEntity<UserProgressResponse> updateUserProgress(...) {
    // 업데이트 후 해당 캐시 키 무효화
}
```

### 3. 수동 캐시 관리
```java
@Autowired
private RedisCacheService redisCacheService;

// 캐시 조회
UserProgress progress = redisCacheService.get("user-progress", "1_2025-09-30", UserProgress.class);

// 캐시 저장
redisCacheService.put("user-progress", "1_2025-09-30", progress);

// 캐시 제거
redisCacheService.evict("user-progress", "1_2025-09-30");
```

## 📊 모니터링

### 1. 캐시 통계 조회
```bash
curl http://localhost:8081/api/cache/stats
```

### 2. Redis CLI 명령어
```bash
# Redis 연결
redis-cli -p 6380

# 모든 키 조회
KEYS *

# 특정 패턴 키 조회
KEYS user-progress:*

# 키 TTL 확인
TTL user-progress:1_2025-09-30

# 키 값 조회
GET user-progress:1_2025-09-30

# 키 제거
DEL user-progress:1_2025-09-30
```

### 3. 캐시 관리 API
```bash
# 캐시 통계
GET /api/cache/stats

# 특정 캐시 제거
DELETE /api/cache/{cacheName}/{key}

# 캐시 전체 제거
DELETE /api/cache/{cacheName}

# 캐시 키 존재 여부 확인
GET /api/cache/{cacheName}/{key}/exists
```

## 🔧 성능 최적화

### 1. 커넥션 풀 설정
```yaml
spring:
  data:
    redis:
      lettuce:
        pool:
          max-active: 8    # 최대 활성 연결
          max-idle: 8      # 최대 유휴 연결
          min-idle: 0      # 최소 유휴 연결
          max-wait: -1ms   # 최대 대기 시간
```

### 2. 직렬화 최적화
- **키**: StringRedisSerializer (가벼움)
- **값**: GenericJackson2JsonRedisSerializer (유연성)

### 3. TTL 전략
- **자주 변경**: 30분 (user-progress)
- **가끔 변경**: 2시간 (user-statistics)
- **거의 변경 안됨**: 24시간 (mccheyne-plans)

## 🚨 문제 해결

### 1. Redis 연결 실패
```bash
# Redis 상태 확인
docker ps | grep redis

# Redis 로그 확인
docker logs macchain-redis

# Redis 재시작
docker-compose restart redis
```

### 2. 캐시 미스율 높음
- TTL 설정 검토
- 캐시 키 패턴 확인
- 메모리 사용량 모니터링

### 3. 메모리 부족
```bash
# Redis 메모리 사용량 확인
redis-cli -p 6380 INFO memory

# 메모리 정책 확인
redis-cli -p 6380 CONFIG GET maxmemory-policy
```

## 📈 성능 지표

### 예상 성능 향상
- **API 응답 시간**: 50-80% 감소
- **데이터베이스 부하**: 60-90% 감소
- **동시 사용자 처리**: 3-5배 증가

### 모니터링 지표
- **캐시 히트율**: > 80%
- **평균 응답 시간**: < 100ms
- **메모리 사용률**: < 70%

## 🔄 캐시 무효화 전략

### 1. TTL 기반
- 자동 만료로 데이터 일관성 보장
- 메모리 사용량 제어

### 2. 이벤트 기반
- 데이터 변경 시 즉시 무효화
- 실시간 일관성 보장

### 3. 수동 관리
- 관리자 도구를 통한 선택적 무효화
- 문제 상황 대응

## 🚀 확장 계획

### 1. Redis 클러스터
- 고가용성 확보
- 수평 확장 지원

### 2. 캐시 계층화
- L1: 로컬 캐시 (Caffeine)
- L2: Redis 캐시
- L3: 데이터베이스

### 3. 모니터링 강화
- Prometheus + Grafana
- 실시간 알림 시스템

---

**참고**: Redis 캐시는 성능 향상의 핵심 요소입니다. 정기적인 모니터링과 튜닝이 필요합니다.

