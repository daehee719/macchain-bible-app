# 📖 MacChain Bible Reading App

> **AI 기반 성경 읽기 플랫폼** - McCheyne 읽기 계획과 원어 분석을 통한 깊이 있는 성경 공부

## 🌟 주요 기능

### 📅 **McCheyne 읽기 계획**
- 365일 체계적인 성경 읽기 계획
- 매일 구약 2장, 신약 2장 읽기
- 진행률 추적 및 통계

### 🤖 **AI 원어 분석**
- OpenAI GPT-4 기반 히브리어/그리스어 분석
- 단어별 문법 분석 및 의미 해석
- 문화적 배경 및 실용적 적용

### 📊 **개인 통계**
- 읽기 진행률 및 연속 읽기 기록
- 월별/연도별 통계
- 완독 달성률 추적

### 🎨 **사용자 경험**
- 다크 모드 지원
- 반응형 디자인
- 직관적인 UI/UX

## 🏗️ 기술 스택

### **Backend**
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Architecture**: Hexagonal Architecture
- **Database**: 
  - PostgreSQL (운영)
  - H2 (개발/테스트)
  - MongoDB (AI 분석 데이터)
- **Cache**: Redis
- **Build Tool**: Gradle

### **Frontend**
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 + CSS Grid
- **State Management**: React Context API

### **External APIs**
- **Bible API**: wldeh/bible-api (KJV, Hebrew WLC, Greek SRGNT)
- **AI Service**: OpenAI GPT-4

## 🚀 빠른 시작

### **환경별 실행**

#### 개발 환경 (간단하고 빠름)
```bash
# 백엔드 (H2 + 간단한 캐시)
cd macchain-backend
./run-dev.sh

# 프론트엔드
cd macchain-frontend
npm install
npm run dev
```

#### 테스트 환경 (중간 기능)
```bash
# MongoDB, Redis 실행 필요
brew services start mongodb-community
brew services start redis

# 백엔드 (H2 파일 + MongoDB + Redis)
cd macchain-backend
./run-test.sh
```

#### 운영 환경 (전체 기능)
```bash
# 모든 서비스 실행
docker-compose up -d

# 백엔드 (PostgreSQL + MongoDB + Redis)
cd macchain-backend
./run-prod.sh
```

### **접속 정보**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081
- **H2 Console**: http://localhost:8081/h2-console (개발 환경)

## 🌿 개발 워크플로우 (Git Flow)

이 프로젝트는 체계적인 개발을 위해 Git Flow 브랜치 전략을 사용합니다.

### Git Flow 빠른 시작

```bash
# 헬퍼 스크립트 실행 권한 부여
chmod +x scripts/git-flow-helper.sh

# 새로운 기능 개발 시작
./scripts/git-flow-helper.sh feature start user-authentication

# 기능 개발 완료 (PR 생성)
./scripts/git-flow-helper.sh feature finish user-authentication

# 현재 상태 확인
./scripts/git-flow-helper.sh status

# 현재 브랜치 동기화
./scripts/git-flow-helper.sh sync
```

### 브랜치 구조

- **`main`** - 운영 환경 배포용 (Production)
- **`develop`** - 개발 통합 브랜치 (Staging)
- **`feature/*`** - 새로운 기능 개발 (`develop`에서 분기)
- **`bugfix/*`** - 버그 수정 (`develop`에서 분기)
- **`release/*`** - 릴리스 준비 (`develop`에서 분기)
- **`hotfix/*`** - 긴급 수정 (`main`에서 분기)

### 상세 워크플로우 가이드

자세한 Git Flow 사용법은 [Git Flow 가이드](docs/GIT_FLOW_GUIDE.md)를 참조하세요.

## 📁 프로젝트 구조

```
macchain-bible-app/
├── macchain-backend/          # Spring Boot 백엔드
│   ├── src/main/java/
│   │   └── com/macchain/
│   │       ├── application/   # 비즈니스 로직
│   │       ├── domain/        # 도메인 엔티티
│   │       ├── infrastructure/ # 외부 연동
│   │       └── presentation/  # REST API
│   ├── src/main/resources/
│   │   ├── application.yml    # 공통 설정
│   │   ├── application-dev.yml # 개발 환경
│   │   ├── application-test.yml # 테스트 환경
│   │   └── application-prod.yml # 운영 환경
│   └── build.gradle
├── macchain-frontend/         # React 프론트엔드
│   ├── src/
│   │   ├── components/        # 재사용 컴포넌트
│   │   ├── pages/            # 페이지 컴포넌트
│   │   ├── services/         # API 서비스
│   │   └── styles/           # CSS 스타일
│   └── package.json
├── docker-compose.yml         # 서비스 구성
└── README.md
```

## 🔧 개발 환경 설정

### **필수 요구사항**
- Java 17+
- Node.js 18+
- Docker & Docker Compose

### **선택적 요구사항**
- MongoDB (테스트/운영 환경)
- Redis (테스트/운영 환경)
- PostgreSQL (운영 환경)

### **환경 변수**
```bash
# OpenAI API Key (AI 분석 기능용)
OPENAI_API_KEY=your-openai-api-key

# Database (운영 환경)
POSTGRES_URL=jdbc:postgresql://localhost:5434/macchain_db
POSTGRES_USERNAME=macchain
POSTGRES_PASSWORD=macchain

# MongoDB (테스트/운영 환경)
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DB=macchain_analysis

# Redis (테스트/운영 환경)
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 📚 API 문서

### **주요 엔드포인트**

#### McCheyne 읽기 계획
- `GET /api/mccheyne/today` - 오늘의 읽기 계획
- `GET /api/mccheyne/day/{dayNumber}` - 특정 일자 읽기 계획

#### AI 원어 분석 (운영 환경만)
- `POST /api/analysis/verse/{book}/{chapter}/{verse}` - 구절 분석

#### 사용자 관리
- `POST /api/users/register` - 회원가입
- `POST /api/users/login` - 로그인
- `GET /api/users/profile` - 프로필 조회

#### 진행률 관리
- `GET /api/progress/user/{userId}` - 사용자 진행률
- `POST /api/progress/update` - 진행률 업데이트

## 🧪 테스트

```bash
# 백엔드 테스트
cd macchain-backend
./gradlew test

# 프론트엔드 테스트
cd macchain-frontend
npm test
```

## 📦 배포

### **Docker를 이용한 배포**
```bash
# 전체 서비스 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

### **수동 배포**
```bash
# 백엔드 빌드
cd macchain-backend
./gradlew build

# 프론트엔드 빌드
cd macchain-frontend
npm run build
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**Made with ❤️ for Bible Study**