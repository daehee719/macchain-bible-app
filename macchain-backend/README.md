# MacChain Backend

맥체인 성경통독 & AI 원어 분석 서비스의 백엔드 API 서버입니다.

## 🏗️ 아키텍처

### Hexagonal Architecture (포트와 어댑터 패턴)

```
src/main/java/com/macchain/
├── domain/                 # 도메인 레이어 (비즈니스 로직)
│   ├── entity/            # 도메인 엔티티
│   ├── valueobject/       # 값 객체
│   └── port/              # 포트 인터페이스
├── application/           # 애플리케이션 레이어 (유스케이스)
│   └── usecase/           # 유스케이스 구현
├── infrastructure/        # 인프라스트럭처 레이어 (외부 연동)
│   ├── entity/            # JPA 엔티티
│   ├── repository/        # JPA 리포지토리
│   ├── converter/         # 데이터 변환기
│   └── mapper/            # 엔티티 매퍼
└── presentation/          # 프레젠테이션 레이어 (API)
    ├── controller/        # REST 컨트롤러
    ├── dto/               # 데이터 전송 객체
    └── mapper/            # DTO 매퍼
```

## 🚀 기술 스택

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **PostgreSQL** (Docker)
- **Gradle**

## 📋 주요 기능

### 1. 맥체인 읽기 플랜
- 365일 맥체인 플랜 데이터 제공
- 날짜별 읽기 계획 조회
- 하루 4챕터 읽기 구조

### 2. 사용자 진행률 관리
- 읽기 완료 상태 추적
- 진행률 계산 및 저장
- 일별/월별/연도별 통계

### 3. 사용자 관리
- 회원가입/로그인
- 사용자 설정 관리
- 프로필 정보 관리

### 4. 통계 기능
- 읽기 진행률 통계
- 연속 읽기 일수 추적
- 월별/연도별 성과 분석

## 🗄️ 데이터베이스 스키마

### 주요 테이블
- `mccheyne_plan`: 맥체인 365일 플랜 데이터
- `users`: 사용자 정보
- `user_progress`: 사용자 읽기 진행률
- `user_settings`: 사용자 설정
- `user_statistics`: 사용자 통계

## 🔧 개발 환경 설정

### 1. 요구사항
- Java 17+
- Docker & Docker Compose
- Gradle 8.5+

### 2. 실행 방법
```bash
# 데이터베이스 시작
docker-compose up -d

# 애플리케이션 실행
./gradlew bootRun
```

### 3. API 문서
- Health Check: `GET /api/health`
- 맥체인 플랜: `GET /api/mccheyne/today`
- 사용자 진행률: `GET /api/users/{userId}/progress`
- 통계: `GET /api/users/{userId}/statistics`

## 📝 주요 API 엔드포인트

### 맥체인 플랜
- `GET /api/mccheyne/today` - 오늘의 읽기 플랜
- `GET /api/mccheyne/{dayNumber}` - 특정 날짜 플랜

### 사용자 진행률
- `GET /api/users/{userId}/progress` - 사용자 진행률 조회
- `POST /api/users/{userId}/progress/update` - 진행률 업데이트

### 통계
- `GET /api/users/{userId}/statistics` - 사용자 통계 조회

## 🔄 데이터 흐름

1. **읽기 플랜 조회**: 프론트엔드 → 백엔드 → 데이터베이스
2. **진행률 업데이트**: 프론트엔드 → 백엔드 → 데이터베이스 → 프론트엔드
3. **통계 계산**: 프론트엔드 → 백엔드 → 데이터베이스 → 계산 → 프론트엔드

## 🐛 알려진 이슈

1. **UserProgress readings 필드**: JSON 변환 과정에서 일부 데이터 손실 가능
2. **통계 계산**: 현재는 단순한 계산 로직, 향후 복잡한 통계 알고리즘 필요
3. **에러 처리**: 일부 API에서 상세한 에러 메시지 부족

## 🚧 TODO

- [ ] 실제 통계 계산 로직 구현
- [ ] 맥체인 플랜 서비스와 UserProgress 연동
- [ ] 에러 처리 개선
- [ ] 로깅 시스템 구축
- [ ] 단위 테스트 추가
- [ ] API 문서 자동화 (Swagger)

## 📞 문의

개발 관련 문의사항이 있으시면 이슈를 등록해주세요.

