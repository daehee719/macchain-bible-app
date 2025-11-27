# 배포 상태

## ✅ 백엔드 배포 완료

**배포 시간**: 2025-11-27  
**Workers 이름**: `macchain-api`  
**메인 파일**: `api/index-worktop.js`  
**버전 ID**: `ff49ee14-bfa6-41dc-940b-88d72d7cdb93`

### 배포된 기능
- ✅ 인증/인가 (JWT)
- ✅ 사용자 관리
- ✅ 읽기 계획 (McCheyne)
- ✅ 통계
- ✅ AI 분석
- ✅ 동의 관리
- ✅ **토론 기능** (새로 추가)
  - 토론 CRUD
  - 댓글 CRUD (대댓글 지원)
  - 좋아요/북마크
  - 카테고리 관리

### API 엔드포인트
- Health: `/api/health`
- Auth: `/api/auth/login`, `/api/auth/register`, `/api/auth/verify`
- Users: `/api/users/profile`, `/api/users/progress`
- Reading Plan: `/api/mccheyne/today`, `/api/mccheyne/:date/progress`
- Statistics: `/api/statistics/user`
- AI Analysis: `/api/ai/analyze`
- Consent: `/api/consent`
- **Discussions**: `/api/discussions` (새로 추가)
- **Comments**: `/api/discussions/:id/comments` (새로 추가)
- **Likes/Bookmarks**: `/api/discussions/:id/like`, `/api/discussions/:id/bookmark` (새로 추가)

## 🚧 프론트엔드 배포

**상태**: 빌드 완료, 배포 대기  
**빌드 시간**: 2025-11-27  
**빌드 출력**: `frontend/dist/`

### 빌드된 기능
- ✅ 대시보드
- ✅ 로그인/회원가입
- ✅ 읽기 계획
- ✅ AI 분석
- ✅ 커뮤니티
- ✅ 통계
- ✅ 설정
- ✅ **토론 페이지** (새로 추가)
  - 토론 목록/상세
  - 토론 작성/수정/삭제
  - 댓글 작성/수정/삭제
  - 좋아요/북마크

### 배포 방법

#### 옵션 1: GitHub Actions (권장)
1. GitHub에 푸시
2. `.github/workflows/cloudflare-deploy.yml` 워크플로우가 자동 실행
3. Cloudflare Pages에 자동 배포

#### 옵션 2: Cloudflare Dashboard
1. Cloudflare Dashboard → Pages → `macchain-frontend` 프로젝트
2. "Upload assets" 클릭
3. `frontend/dist/` 폴더 업로드

#### 옵션 3: Wrangler CLI (권한 필요)
```bash
cd frontend
npx wrangler pages deploy dist --project-name=macchain-frontend
```

**참고**: 현재 API 토큰에 Pages 배포 권한이 없어 CLI 배포가 실패했습니다. GitHub Actions 또는 Dashboard를 사용하세요.

## 📝 다음 단계

1. **프론트엔드 배포**
   - GitHub에 푸시하여 자동 배포
   - 또는 Cloudflare Dashboard에서 수동 배포

2. **API URL 확인**
   - 프론트엔드의 `API_BASE_URL`이 올바른지 확인
   - 현재: `https://macchain-api-public.daeheuigang.workers.dev`
   - 실제 배포된 URL과 일치하는지 확인 필요

3. **토론 스키마 적용**
   - D1 데이터베이스에 토론 스키마가 적용되었는지 확인
   ```bash
   cd backend/cloudflare-workers
   wrangler d1 execute macchain-db --file=database/discussion-schema.sql --remote
   ```

4. **테스트**
   - 토론 목록 조회
   - 토론 작성
   - 댓글 작성
   - 좋아요/북마크

## 🔗 배포 URL

- **백엔드 API**: `https://macchain-api.daeheuigang.workers.dev` (또는 커스텀 도메인)
- **프론트엔드**: 배포 후 확인 필요

