# 지금 배포하기

## 현재 상태

- ✅ **백엔드**: Cloudflare Workers에 이미 배포 완료
- 🔄 **프론트엔드**: 빌드 완료, 배포 대기 중

## 배포 방법

### 방법 1: main 브랜치에 머지 (권장)

```bash
# main 브랜치로 전환
git checkout main

# 최신 코드 가져오기
git pull origin main

# feature 브랜치 머지
git merge feat/tailwind-codemod-buttons

# 푸시 (자동으로 GitHub Actions 실행)
git push origin main
```

### 방법 2: GitHub Actions 수동 트리거

1. GitHub 저장소로 이동: https://github.com/daehee719/macchain-bible-app
2. Actions 탭 클릭
3. "☁️ Cloudflare Full-Stack Deploy" 워크플로우 선택
4. "Run workflow" 버튼 클릭
5. 브랜치 선택 (feat/tailwind-codemod-buttons 또는 main)
6. "Run workflow" 클릭

### 방법 3: develop 브랜치에 머지

```bash
# develop 브랜치로 전환
git checkout develop

# 최신 코드 가져오기
git pull origin develop

# feature 브랜치 머지
git merge feat/tailwind-codemod-buttons

# 푸시
git push origin develop
```

## 배포 후 확인

1. **GitHub Actions 확인**
   - https://github.com/daehee719/macchain-bible-app/actions
   - 워크플로우 실행 상태 확인

2. **Cloudflare Dashboard 확인**
   - https://dash.cloudflare.com
   - Workers & Pages → Pages → `macchain-frontend`
   - 배포 완료 및 URL 확인

3. **프론트엔드 테스트**
   - 배포된 URL에서 토론 기능 테스트
   - API 연결 확인

## 참고사항

- 현재 브랜치(`feat/tailwind-codemod-buttons`)에 푸시해도 워크플로우가 자동 실행되지 않습니다
- 워크플로우는 `main` 또는 `develop` 브랜치에만 자동 실행됩니다
- `workflow_dispatch`를 통해 수동으로 트리거할 수 있습니다

