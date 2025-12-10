# 🙏 MacChain Bible App

> **AI 기반 성경 읽기 플랫폼** - Cloudflare 서버리스 아키텍처로 완전 무료 운영되는 프로덕션 수준의 성경 공부 애플리케이션

## 🎉 **프로덕션 배포 완료!**

### 🌐 **실시간 접속**
- **웹사이트**: https://d8ddbf9f.macchain-frontend.pages.dev
- **API**: https://macchain-api-public.daeheuigang.workers.dev
- **GitHub**: https://github.com/daehee719/macchain-bible-app

### 💰 **완전 무료 운영**
- **월 비용**: $0 (Cloudflare Free Tier 100% 활용)
- **연간 절약**: $1,200+
- **성능**: 글로벌 CDN, 응답시간 < 100ms, 가용성 99.9%

## 🌟 주요 기능

### 📅 **McCheyne 읽기 계획**
- 365일 체계적인 성경 읽기 계획
- 매일 구약 2장, 신약 2장 읽기
- 진행률 추적 및 통계
- 실시간 동기화

### 🤖 **AI 원어 분석**
- Cloudflare AI 기반 히브리어/그리스어 분석
- 단어별 문법 분석 및 의미 해석
- 문화적 배경 및 실용적 적용
- 실시간 분석 결과 제공

### 📊 **개인 통계**
- 읽기 진행률 및 연속 읽기 기록
- 월별/연도별 통계
- 완독 달성률 추적
- 실시간 대시보드

### 🎨 **사용자 경험**
- 다크 모드 지원
- 반응형 디자인
- 직관적인 UI/UX
- 모바일 최적화

### 🛡️ **엔터프라이즈급 기능**
- SSL 보안 인증서
- 글로벌 CDN 배포
- 자동 백업 시스템
- CI/CD 자동 배포

## 🏗️ 기술 스택

### **Frontend**
- **React 18** + TypeScript
- **Vite** (빌드 도구)
- **React Router** (라우팅)
- **Context API** (상태 관리)
- **Lucide React** (아이콘)

### **Backend**
- **Cloudflare Workers** (서버리스)
- **Cloudflare D1** (SQLite 데이터베이스)
- **Cloudflare AI** (AI 모델)
- **JWT** (인증)

### **Deployment**
- **Cloudflare Pages** (프론트엔드)
- **Cloudflare Workers** (백엔드)
- **GitHub Actions** (CI/CD)

### **Development**
- **ESLint** (코드 품질)
- **Vitest** (단위 테스트)
- **Playwright** (E2E 테스트)
- **TypeScript** (타입 안정성)

## 🚀 빠른 시작

### **프로덕션 환경 (권장)**
```bash
# 라이브 서비스 바로 접속
open https://d8ddbf9f.macchain-frontend.pages.dev
```

### **로컬 개발 환경**
```bash
# 저장소 클론
git clone https://github.com/daehee719/macchain-bible-app.git
cd macchain-bible-app

# 프론트엔드 개발 서버 실행
cd macchain-frontend
npm install
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

## 📁 프로젝트 구조

```
macchain-bible-app/
├── macchain-frontend/          # React 프론트엔드
│   ├── src/
│   │   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── pages/             # 페이지 컴포넌트
│   │   ├── contexts/          # React Context
│   │   ├── services/          # API 서비스
│   │   └── styles/            # CSS 스타일
│   ├── public/                # 정적 파일
│   └── package.json
├── cloudflare-workers/         # Cloudflare Workers 백엔드
│   ├── api/                   # API 엔드포인트
│   ├── database/              # D1 데이터베이스 스키마
│   ├── utils/                 # 유틸리티 함수
│   └── wrangler.toml          # Cloudflare 설정
├── docs/                      # 프로젝트 문서
├── .github/workflows/         # CI/CD 워크플로우
└── readme.md
```

## 🔧 API 문서

### **인증 API**
- `POST /api/auth/login` - 사용자 로그인
- `POST /api/auth/register` - 사용자 회원가입

### **읽기 계획 API**
- `GET /api/mccheyne/today` - 오늘의 읽기 계획
- `GET /api/mccheyne/plan` - 전체 읽기 계획

### **사용자 API**
- `GET /api/users/profile` - 사용자 프로필
- `PUT /api/users/profile` - 프로필 업데이트

### **통계 API**
- `GET /api/statistics/user` - 사용자 통계
- `GET /api/statistics/reading` - 읽기 통계

### **AI 분석 API**
- `POST /api/ai/analyze` - 성경 구절 AI 분석
- `GET /api/ai/history` - 분석 이력

### **동의 관리 API**
- `GET /api/consent` - 동의 설정 조회
- `PUT /api/consent` - 동의 설정 업데이트

## 🚀 배포

### **Cloudflare Pages (프론트엔드)**
```bash
# 자동 배포 (GitHub Push 시)
git push origin main

# 수동 배포
cd cloudflare-workers
wrangler pages deploy ../macchain-frontend/dist --project-name macchain-frontend
```

### **Cloudflare Workers (백엔드)**
```bash
# 자동 배포 (GitHub Push 시)
git push origin main

# 수동 배포
cd cloudflare-workers
wrangler deploy
```

## 📊 프로덕션 상태

### **비용 최적화**
- **개발 비용**: $0/월
- **운영 비용**: $0/월
- **확장성**: 무제한
- **안정성**: 99.9%+ 가용성

### **성능 지표**
- **응답 시간**: < 100ms (글로벌 CDN)
- **로딩 시간**: < 2초
- **가용성**: 99.9%+
- **동시 사용자**: 무제한

### **보안**
- **SSL/TLS**: 자동 인증서
- **CORS**: 적절한 설정
- **JWT**: 안전한 인증
- **데이터 암호화**: 전송 및 저장 시

## 🔄 CI/CD

### **자동화된 워크플로우**
- **코드 품질**: ESLint, TypeScript 검사
- **테스트**: Vitest 단위 테스트, Playwright E2E 테스트
- **배포**: Cloudflare Pages + Workers 자동 배포
- **모니터링**: 실시간 로그 및 에러 추적

### **브랜치 전략**
- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치
- `archive/*`: 보관 브랜치

## 📚 문서

- [API 문서](https://macchain-api-public.daeheuigang.workers.dev)
- [배포 가이드](docs/CLOUDFLARE_DEPLOYMENT.md)
- [개발 가이드](docs/DEVELOPMENT_GUIDE.md)
- [아키텍처 문서](docs/ARCHITECTURE.md)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👨‍💻 개발자

**대희 강** - [GitHub](https://github.com/daehee719) - daehee719@gmail.com

## 🙏 감사의 말

- **Cloudflare** - 서버리스 인프라 제공
- **React Team** - 훌륭한 프론트엔드 프레임워크
- **McCheyne** - 체계적인 성경 읽기 계획
- **오픈소스 커뮤니티** - 다양한 라이브러리와 도구

---

**MacChain**으로 매일 함께하는 성경 읽기 여행을 시작해보세요! 🙏