# 배포 체크리스트

## ✅ 완료된 작업

### 백엔드 (Cloudflare Workers)
- [x] Worktop 기반 API 라우터로 변경
- [x] 토론 기능 API 구현
- [x] 토론 스키마 D1 데이터베이스에 적용
- [x] Workers 배포 완료
- [x] 배포 버전 ID: `ff49ee14-bfa6-41dc-940b-88d72d7cdb93`

### 프론트엔드
- [x] 토론 페이지 구현
- [x] 토론 카드 컴포넌트 구현
- [x] 댓글 컴포넌트 구현 (대댓글 지원)
- [x] API 서비스 확장
- [x] Tailwind CSS 기반 UI
- [x] 빌드 완료 (`frontend/dist/`)
- [x] GitHub에 푸시 완료

## 🔄 진행 중

### 프론트엔드 배포
- [ ] GitHub Actions 워크플로우 실행 확인
- [ ] Cloudflare Pages 배포 완료 확인
- [ ] 배포된 프론트엔드 URL 확인

## 📋 배포 후 확인 사항

### 1. API 연결 확인
- [ ] 프론트엔드에서 백엔드 API 호출 테스트
- [ ] CORS 설정 확인
- [ ] 인증 토큰 전달 확인

### 2. 토론 기능 테스트
- [ ] 토론 목록 조회
- [ ] 토론 작성
- [ ] 토론 상세 보기
- [ ] 댓글 작성
- [ ] 대댓글 작성
- [ ] 좋아요 토글
- [ ] 북마크 토글
- [ ] 카테고리 필터
- [ ] 정렬 기능

### 3. UI/UX 확인
- [ ] 반응형 디자인 (모바일/데스크톱)
- [ ] 다크모드 동작
- [ ] 로딩 상태 표시
- [ ] 에러 처리

### 4. 성능 확인
- [ ] 페이지 로딩 속도
- [ ] API 응답 시간
- [ ] 이미지 최적화

## 🔗 배포 URL

### 백엔드
- **Workers URL**: `https://macchain-api.daeheuigang.workers.dev`
- **API Base URL**: `https://macchain-api-public.daeheuigang.workers.dev` (프론트엔드에서 사용 중)

### 프론트엔드
- **Pages URL**: 배포 완료 후 확인 필요
- **GitHub Actions**: https://github.com/daehee719/macchain-bible-app/actions

## 🚨 문제 해결

### GitHub Actions 실패 시
1. Actions 탭에서 실패한 워크플로우 확인
2. 로그에서 에러 메시지 확인
3. 필요한 경우 Secrets 확인 (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`)

### API 연결 실패 시
1. 프론트엔드의 `API_BASE_URL` 확인
2. 백엔드 CORS 설정 확인
3. 브라우저 콘솔에서 네트워크 에러 확인

### 토론 기능 오류 시
1. D1 데이터베이스에 토론 스키마가 적용되었는지 확인
2. 백엔드 로그 확인
3. API 응답 형식 확인

## 📝 다음 작업

1. **프론트엔드 배포 확인**
   - GitHub Actions 완료 대기
   - Cloudflare Dashboard에서 배포 상태 확인

2. **통합 테스트**
   - 전체 플로우 테스트
   - 사용자 시나리오 테스트

3. **성능 최적화**
   - 필요시 이미지 최적화
   - 코드 스플리팅
   - 캐싱 전략

4. **문서화**
   - API 문서 업데이트
   - 사용자 가이드 작성

