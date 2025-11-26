API 스펙 초안 (MVP 핵심 엔드포인트)

인증
- POST /api/auth/register
  - 요청: { email, password, name, nickname }
  - 응답: { success, token, user }

- POST /api/auth/login
  - 요청: { email, password }
  - 응답: { success, token, user }

읽기 계획
- GET /api/mccheyne/today
  - 설명: 오늘의 읽기 계획 반환
  - 응답: { success, date, readings: [{ id, book, chapter, verseStart, verseEnd }] }

- GET /api/mccheyne/:date/progress
  - 설명: 특정 날짜의 읽기 진행(미구현 시 200과 Not Implemented)

AI 분석 (특허 대상 파이프라인)
- POST /api/ai/analyze
  - 요청: { passage: string, analysisType?: 'general'|'theological'|'devotional'|'historical' }
  - 동작: Cloudflare AI(`env.AI`) 호출, 결과 DB 저장(id 생성)
  - 응답: { success, data: { id, passage, analysisType, analysis, timestamp } }

- GET /api/ai/history?id={id}
  - 설명: 최근 분석 목록 또는 특정 분석 결과 반환

사용자/동기화
- GET /api/users/profile
  - 인증: `Authorization: Bearer <token>`
  - 응답: { id, email, name, nickname, isActive }

- POST /api/users/progress
  - 요청: { userId, date, progressItems: [...] }
  - 설명: 사용자의 읽기 진행 저장/동기화

통계
- GET /api/statistics/user
  - 인증 필요
  - 응답: { success, data: { streak, monthlyReadings, completionRate } }

헬스
- GET /api/health
  - 응답: { status: 'OK', timestamp, environment }

보안/데이터 보존
- JWT 사용 (env.JWT_SECRET). 토큰 생성/검증 로직은 `backend/cloudflare-workers/utils/jwt.js` 참조
- AI 분석 원문/응답은 민감 데이터로 분류, 보존 기간과 공개 노출 정책을 `docs/AI_PRIVACY.md`에 별도 명시 권장
