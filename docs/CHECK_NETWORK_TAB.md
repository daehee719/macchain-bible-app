# 브라우저 Network 탭 확인 가이드

## 단계별 확인 방법

### 1. 개발자 도구 열기

**Chrome/Edge:**
- `F12` 키 누르기
- 또는 `Cmd + Option + I` (Mac) / `Ctrl + Shift + I` (Windows)
- 또는 우클릭 → "검사" 또는 "Inspect"

**Firefox:**
- `F12` 키 누르기
- 또는 `Cmd + Option + I` (Mac) / `Ctrl + Shift + I` (Windows)

**Safari:**
- `Cmd + Option + I`
- (먼저 Safari → 환경설정 → 고급 → "메뉴 막대에서 개발자용 메뉴 보기" 활성화 필요)

### 2. Network 탭 열기

개발자 도구가 열리면 상단에 여러 탭이 있습니다:
- **Elements** (요소)
- **Console** (콘솔)
- **Sources** (소스)
- **Network** (네트워크) ← **이 탭 클릭**

### 3. Network 탭 설정

Network 탭에서:
1. **필터 설정**: 상단 필터에서 "Fetch/XHR" 선택 (또는 "All"로 두기)
2. **Preserve log**: 체크박스 활성화 (페이지 새로고침해도 로그 유지)
3. **Disable cache**: 체크박스 활성화 (캐시 비활성화)

### 4. 페이지 새로고침 및 로그인

1. Network 탭이 열린 상태에서 페이지 새로고침 (`F5` 또는 `Cmd+R`)
2. 로그인 시도
3. Network 탭에 요청들이 나타나는지 확인

### 5. users API 요청 찾기

Network 탭의 요청 목록에서 다음을 찾으세요:

**찾아야 할 요청:**
- URL에 `/rest/v1/users` 포함
- 예: `https://[project-ref].supabase.co/rest/v1/users?select=*&id=eq.[user-id]`

**요청 찾는 방법:**
1. Network 탭 상단의 검색창에 `users` 입력
2. 또는 필터에서 "Fetch/XHR" 선택
3. 요청 목록을 스크롤하며 `/rest/v1/users` 찾기

### 6. 요청 상세 정보 확인

`/rest/v1/users` 요청을 **클릭**하면 오른쪽에 상세 정보가 나타납니다:

#### Headers 탭
- **Request URL**: 전체 URL 확인
- **Request Method**: `GET` 또는 `POST`
- **Status Code**: 
  - `200 OK`: 성공
  - `401 Unauthorized`: 인증 실패 (RLS 정책 문제 가능)
  - `406 Not Acceptable`: 데이터 없음 (정상, 프로필 생성 시도)
  - `Pending`: 응답 대기 중 (문제!)

#### Preview 탭
- 응답 데이터 확인
- 에러 메시지 확인

#### Response 탭
- 원시 응답 데이터 확인

#### Timing 탭
- 요청 시간 분석
- 어디서 지연되는지 확인

## 문제 진단

### 상태가 "Pending"인 경우
- **의미**: 요청이 서버에 도달하지 못하거나 응답을 받지 못함
- **가능한 원인**:
  1. RLS 정책 문제 (가장 가능성 높음)
  2. 네트워크 연결 문제
  3. Supabase 서버 문제

### 상태가 "401 Unauthorized"인 경우
- **의미**: 인증 실패 또는 RLS 정책 위반
- **해결**: RLS 정책 확인 필요

### 상태가 "406 Not Acceptable"인 경우
- **의미**: `.single()` 사용 시 데이터가 없음
- **상태**: 정상 (프로필이 없어서 생성 시도)

### 상태가 "200 OK"인 경우
- **의미**: 성공
- **상태**: 정상

## 스크린샷으로 확인하는 방법

1. Network 탭에서 `/rest/v1/users` 요청 찾기
2. 요청 클릭
3. 오른쪽 패널의 **Headers** 탭 확인
4. **Status Code** 확인
5. **Response** 또는 **Preview** 탭에서 에러 메시지 확인

## 빠른 확인 체크리스트

- [ ] 개발자 도구 열기 (`F12`)
- [ ] Network 탭 클릭
- [ ] "Preserve log" 체크
- [ ] 페이지 새로고침
- [ ] 로그인 시도
- [ ] `/rest/v1/users` 요청 찾기
- [ ] Status Code 확인
- [ ] Response/Preview 탭에서 에러 확인

## 예상되는 시나리오

### 시나리오 1: Pending 상태
```
Request: GET /rest/v1/users?select=*&id=eq.[user-id]
Status: (pending) 또는 (failed)
```
→ RLS 정책 문제 가능성 높음

### 시나리오 2: 401 에러
```
Request: GET /rest/v1/users?select=*&id=eq.[user-id]
Status: 401 Unauthorized
Response: {"message":"new row violates row-level security policy"}
```
→ RLS 정책 문제 확실

### 시나리오 3: 406 에러
```
Request: GET /rest/v1/users?select=*&id=eq.[user-id]
Status: 406 Not Acceptable
Response: {"code":"PGRST116","message":"The result contains 0 rows"}
```
→ 정상 (프로필 없음, 생성 시도)

## 다음 단계

Network 탭에서 확인한 정보를 알려주시면:
- Status Code
- Response 메시지
- Timing 정보

이를 바탕으로 정확한 해결 방법을 제시하겠습니다.

