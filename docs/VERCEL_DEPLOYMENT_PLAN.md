# Vercel 배포 계획

## 📋 작업 목록

### Phase 1: Vercel MCP Server 설정
1. Vercel MCP server 연결 확인
2. Vercel 계정 인증 토큰 확인
3. MCP 설정 파일 업데이트

### Phase 2: Vercel 프로젝트 설정
1. Vercel 프로젝트 생성 또는 기존 프로젝트 확인
2. Git 저장소 연결 확인
3. 프로젝트 설정 확인

### Phase 3: 배포 설정 파일 생성
1. `vercel.json` 생성 (빌드 설정, 라우팅)
2. `.vercelignore` 생성 (배포 제외 파일)
3. 빌드 스크립트 확인

### Phase 4: 환경 변수 설정
1. Supabase 환경 변수 설정
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Vercel 대시보드에서 환경 변수 추가

### Phase 5: 배포 전 검증
1. 로컬 빌드 테스트
2. 빌드 출력 확인
3. 환경 변수 확인

### Phase 6: 배포 실행
1. Vercel MCP를 통한 배포
2. 배포 상태 확인
3. 배포 URL 확인

### Phase 7: 배포 후 검증
1. 배포된 사이트 접속 확인
2. 기능 테스트
3. 환경 변수 동작 확인

## 🔧 기술 스택
- **프론트엔드**: React 18 + Vite + TypeScript
- **스타일링**: Tailwind CSS
- **백엔드**: Supabase
- **배포 플랫폼**: Vercel

## 📁 프로젝트 구조
```
macchain-frontend/
├── src/              # 소스 코드
├── dist/             # 빌드 출력 (생성됨)
├── vercel.json       # Vercel 설정 (생성 예정)
├── .vercelignore     # 배포 제외 파일 (생성 예정)
└── package.json      # 빌드 스크립트 포함
```

## 🚀 빌드 설정
- **빌드 명령어**: `npm run build`
- **출력 디렉토리**: `dist`
- **Node 버전**: 18.x 이상


