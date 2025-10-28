# MacChain 프로젝트 운영 규칙 (Project Rules)

본 문서는 팀의 일관성과 생산성을 높이기 위한 운영 원칙을 정의합니다. 원칙은 실용성과 지속가능성에 초점을 맞추며, 기존 Git Flow 전략과 Cloudflare 서버리스 아키텍처, MCP 통합 환경을 전제로 합니다. 본 규칙 수립에는 다음 영상의 일반 원칙(작게 나누기, 빠른 피드백, 자동화 우선 등)을 참고했습니다: [영상 링크](https://www.youtube.com/watch?v=5rCk0tjkvNM).

## 1) 핵심 원칙 (Guiding Principles)
- 사용자 가치 우선: 기능은 사용자 문제/지표로 정당화한다 (가설 → 실험 → 학습).
- 작게, 자주 배포: 작은 PR(±300 라인) 단위로 빠른 사이클을 유지한다.
- 자동화 우선: 테스트/빌드/배포/검증을 CI로 자동화한다.
- 보안이 기본값: 시크릿, 권한, 데이터 보호를 규칙으로 강제한다.
- 가시성: 변경사항은 이슈/PR/CHANGELOG로 추적 가능해야 한다.

## 2) 브랜치 전략 (Git Flow 요약)
- 기본: `main`(운영), `develop`(개발 통합)
- 보조: `feature/*`, `release/*`, `hotfix/*` (세부는 `docs/GIT_FLOW_GUIDE.md` 준수)
- 네이밍: `feature/ai-analysis`, `release/v1.2.0`, `hotfix/v1.2.1`
- 병합: `main`, `develop` 직접 푸시 금지. 반드시 PR로 병합.

## 3) 커밋/PR 규칙
- Conventional Commits + 이모지 권장 (가이드 준수)
  - 예: `✨ feat: Add AI analysis endpoint`
- PR 크기: ±300 라인 권장(테스트 제외). 500 라인 초과 시 분할 또는 세부 리뷰 계획 명시.
- 리뷰 SLA: 영업일 기준 24시간 내 1차 피드백. 승인 최소 1인(`develop`), 1~2인(`main`/`release`).
- PR 설명: 문제/해결/검증/리스크/롤백을 템플릿 형식으로 기재.

## 4) 코드 기준 (Code Standards)
- 언어/런타임: 프론트엔드 TypeScript 우선, 백엔드 Workers는 ESM(JS/TS) 허용.
- 타입: `any` 지양, 명시적 공개 API 타입 선언. 불필요한 `try/catch` 금지.
- 네이밍: 의미 중심(축약 지양), 가드 클로저/조기 반환 선호.
- 주석: 필수 맥락/의도/제약만. 자명한 주석 금지.
- 포맷/린트: 프로젝트 설정(ESLint, Prettier) 준수. 린트 에러 0.

## 5) 테스트/품질 바(bar)
- 단위 테스트: Vitest. 핵심 로직 라인 커버리지 70% 이상(증분 목표).
- E2E: Playwright. 주요 유저 플로우 최소 1건 유지.
- PR 필수 체크: 린트, 유닛, 빌드 통과. 실패 시 병합 금지.

## 6) 보안/시크릿/권한
- 시크릿 저장: GitHub Secrets, Cloudflare Secrets만 사용. 코드/예시/샘플에 토큰 금지.
- 환경 분리: `dev/staging/prod` 변수 분리, 최소 권한 원칙.
- 의존성: Dependabot/보안 스캔 경고는 7일 내 처리.

## 7) 인프라/배포 (Cloudflare 기준)
- Workers/Pages/D1 변경은 문서와 함께: 마이그레이션/바인딩/KV/Durable Objects 명시.
- 배포: GitHub Actions로 자동화. `develop`→Staging, `main`→Production.
- D1: 스키마 변경은 버저닝된 SQL과 검증 절차 포함.
- KV/Secrets: 바인딩 명칭 규칙 `UPPER_SNAKE_CASE` 일관성 유지.

## 8) MCP/통합 도구 운영
- 설정 파일: `.cursor/mcp.json`에서 서버 목록/URL만 관리. 토큰/민감정보 저장 금지.
- 원격 MCP(Cloudflare/GitHub): SSE URL 형식 문서화 및 가용성 확인 후 사용.
- 도구 추가/변경 시 `docs/MCP_SETUP.md` 갱신 필수.

## 9) API/프론트엔드 규약
- API: `/api/...` 경로, CORS 헤더 일관, 오류 응답 표준화 `{error, message}`.
- 버전: 호환성 이슈 발생 시 `/api/v{n}` 고려.
- 프론트: 라우팅 가드(보호 라우트), 접근성(a11y) 점검, 성능 예산(LCP < 2.5s) 준수.

## 10) 문서/변경관리
- 문서: 사용자향 `readme.md`, 개발/운영향 `docs/*` 동시 갱신.
- 변경 로그: `CHANGELOG.md` 유지(릴리스/핫픽스).
- 의사결정: 중요한 아키텍처 변경은 `docs/adr/ADR-YYYYMMDD-*.md`에 기록.

## 11) 관측/운영(Ops)
- 로깅/모니터링: 배포 후 헬스체크/에러로그 확인. 회귀 시 즉시 롤백 기준 수립.
- 장애 대응: 핫픽스 브랜치 절차 준수, 사후 회고(Postmortem) 문서화.

## 12) 승인/예외 처리
- 예외(규칙 우회)가 필요한 경우:
  - 사유를 이슈/PR에 기록 → 2인 승인 → 최소 시간 적용 → 복구 및 사후 검토.

---

참고: Git Flow/브랜치 보호/CI 규칙은 아래 문서를 우선 참조하세요.
- `docs/GIT_FLOW_GUIDE.md`
- `docs/GITHUB_BRANCH_PROTECTION.md`
- `docs/CLOUDFLARE_CI_CD_SETUP.md`
- `docs/MCP_SETUP.md`

영감/원칙 참고: [YouTube 영상](https://www.youtube.com/watch?v=5rCk0tjkvNM)




