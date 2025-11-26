프로젝트 규칙 및 컨벤션 (초안)

1) 브랜치 및 릴리스
- `main`: 프로덕션 릴리스 전용
- `develop`: 통합 브랜치(다음 릴리스 준비)
- `feature/*`: 기능 개발 (작은 단위, PR당 최대 300 LOC 권장)
- 릴리스 주기: 현재 MVP 목표는 1주, 이후 스프린트 주기는 조정

2) 커밋 및 PR
- 커밋 메시지: `type(scope): summary` (예: `feat(api): add today plan endpoint`)
- PR 템플릿 준수, 변경사항 요약, 마이그레이션/데이터 영향 명시
- 리뷰: 최소 1명 리뷰어 + 자동 CI 통과 필요

3) 코드 스타일
- 프론트엔드: ESLint + Prettier, `npm run lint`, `npm run format` 사용
- 백엔드(Workers): 표준 JS 스타일, 테스트 추가 시 모듈 단위로 작성

4) 시크릿 및 환경 변수
- 절대 저장소에 하드코드 금지
- GitHub Secrets 사용: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `JWT_SECRET`, `OPENAI_API_KEY`, `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `DEPLOY_*` 등
- 로컬 개발: `.env.local` (gitignored) 사용, `docs/ENV_VARS.md`에 필수 변수 명기

5) 테스트 및 CI
- 단위 테스트: Vitest (프론트엔드), Gradle/JUnit(백엔드 레거시)
- E2E: Playwright(핵심 사용자 플로우만 포함)
- CI: lint/type-check → unit tests → build → e2e(선택)

6) 보안·데이터 관리
- 개인 데이터 최소 수집 및 최소 보존 정책 준수
- AI 프롬프트 / 원어 분석 로직은 특허 관련 민감 정보로 내부 문서로 분리

7) 배포 규칙
- Cloudflare Workers: `backend/cloudflare-workers/wrangler.toml` 확인 (D1 바인딩 `DB`)
- Pages 배포는 `frontend/wrangler.toml` 설정 사용

8) 문서화
- `docs/`에 모든 결정 문서(스펙, 데이터베이스 변경, 시크릿 목록)를 보관
