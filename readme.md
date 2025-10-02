# MacChain - 맥체인 성경통독 & AI 원어 분석 서비스

## 📖 프로젝트 개요

MacChain은 맥체인 플랜 기반의 1년 성경통독 서비스와 AI 히브리어/헬라어 원어 분석, 그리고 사용자 토론 커뮤니티를 제공하는 종합 성경 공부 플랫폼입니다.

## 🏗️ 아키텍처

### 헥사고날 아키텍처 (Hexagonal Architecture)
- **도메인 레이어**: 비즈니스 로직과 규칙
- **애플리케이션 레이어**: 유스케이스와 포트
- **인프라스트럭처 레이어**: 외부 시스템 연동
- **프레젠테이션 레이어**: REST API와 DTO

### 기술 스택
- **백엔드**: Spring Boot 3.2, Java 17, Gradle
- **프론트엔드**: React 18, TypeScript, Vite
- **데이터베이스**: PostgreSQL 15
- **컨테이너**: Docker, Docker Compose
- **외부 API**: Bible API (https://github.com/wldeh/bible-api)

## 🚀 빠른 시작

### 1. 전체 서비스 실행 (Docker Compose)
```bash
./scripts/start.sh
```

### 2. 개발 환경 실행 (데이터베이스만 Docker, 앱은 로컬)
```bash
./scripts/dev.sh
```

### 3. 서비스 중지
```bash
./scripts/stop.sh
```

## 📁 프로젝트 구조

```
macchain/
├── macchain-backend/          # Spring Boot 백엔드
│   ├── src/main/java/com/macchain/
│   │   ├── domain/            # 도메인 레이어
│   │   ├── application/       # 애플리케이션 레이어
│   │   ├── infrastructure/    # 인프라스트럭처 레이어
│   │   └── presentation/      # 프레젠테이션 레이어
│   ├── build.gradle
│   └── Dockerfile
├── macchain-frontend/         # React 프론트엔드
│   ├── src/
│   │   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── pages/            # 페이지 컴포넌트
│   │   ├── services/         # API 서비스
│   │   └── styles/           # 스타일시트
│   ├── package.json
│   └── Dockerfile
├── scripts/                   # 자동화 스크립트
│   ├── start.sh              # 전체 서비스 시작
│   ├── dev.sh                # 개발 환경 시작
│   └── stop.sh               # 서비스 중지
├── docs/                     # 문서
│   └── design-mockups/       # 디자인 목업
├── docker-compose.yml        # Docker Compose 설정
└── README.md
```

## 🔌 API 엔드포인트

### 맥체인 플랜
- `GET /api/mccheyne/today` - 오늘의 읽기 계획
- `GET /api/mccheyne/day/{dayNumber}` - 특정 일자 계획

### 헬스 체크
- `GET /api/health` - 서비스 상태 확인

## 🎯 주요 기능

### 1. 맥체인 통독 시스템
- 365일 일별 플랜 제공 (하루 4챕터)
- 진도 추적 및 완료 체크
- 연속 읽기 기록 (Streak)
- 통계 및 진행률 시각화

### 2. AI 원어 분석 시스템
- 히브리어/헬라어 원문 제공
- Strong's Concordance 기반 단어 분석
- AI 기반 원어 해설 및 문맥 분석
- 다양한 번역본 비교

### 3. 토론 커뮤니티
- 챕터별/구절별 토론방
- 질문 & 답변, 묵상 나눔
- 좋아요/댓글/북마크 기능

## 🛠️ 개발 환경 설정

### 필수 요구사항
- Docker & Docker Compose
- Java 17+
- Node.js 18+
- Gradle 8.5+

### 로컬 개발 실행
```bash
# 1. 데이터베이스만 Docker로 실행
docker-compose up -d postgres

# 2. 백엔드 실행
cd macchain-backend
./gradlew bootRun

# 3. 프론트엔드 실행
cd macchain-frontend
npm install
npm run dev
```

## 📊 서비스 정보

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080/api
- **데이터베이스**: localhost:5432

## 🔧 유용한 명령어

```bash
# 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f postgres

# 서비스 재시작
docker-compose restart
```

## 📝 라이선스

MIT License