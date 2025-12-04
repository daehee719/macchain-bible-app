# Supabase MCP 서버 설정 가이드

## 개요

Supabase MCP 서버를 통해 Cursor에서 Supabase 데이터베이스를 직접 조작할 수 있습니다. 이를 통해 자연어로 데이터베이스 작업을 수행할 수 있습니다.

## 사전 준비

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 로그인
2. 새 프로젝트 생성
3. 프로젝트 대시보드에서 **Project Settings** → **General**에서 **Reference ID** 확인

### 2. Personal Access Token 생성
1. Supabase 대시보드 우측 상단 사용자 아이콘 클릭
2. **Account Preferences** → **Access Tokens** 이동
3. **Generate new token** 클릭하여 새 토큰 생성
4. 토큰을 안전하게 저장 (한 번만 표시됨)

## MCP 서버 설정

### `.cursor/mcp.json` 파일 업데이트

```json
{
  "mcpServers": {
    "taskmaster-ai": {
      "command": "npx",
      "args": [
        "-y",
        "--package=task-master-ai",
        "task-master-ai"
      ],
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE",
        "PERPLEXITY_API_KEY": "YOUR_PERPLEXITY_API_KEY_HERE"
      }
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref",
        "YOUR_SUPABASE_PROJECT_REF_HERE"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_SUPABASE_ACCESS_TOKEN_HERE"
      }
    }
  }
}
```

### 설정 값 입력

1. **YOUR_SUPABASE_PROJECT_REF_HERE**: Supabase 프로젝트의 Reference ID
   - 프로젝트 대시보드 → Settings → General → Reference ID

2. **YOUR_SUPABASE_ACCESS_TOKEN_HERE**: 생성한 Personal Access Token

## 사용 가능한 기능

Supabase MCP 서버를 통해 다음 작업을 수행할 수 있습니다:

### 데이터베이스 작업
- 테이블 생성/수정/삭제
- 데이터 조회/삽입/수정/삭제
- 쿼리 실행
- 스키마 관리

### 인증 작업
- 사용자 관리
- 인증 설정

### 스토리지 작업
- 파일 업로드/다운로드
- 버킷 관리

## 보안 주의사항

1. **Access Token 보안**
   - Personal Access Token은 절대 공개 저장소에 커밋하지 마세요
   - `.gitignore`에 `.cursor/mcp.json` 추가 고려
   - 또는 환경 변수 사용

2. **권한 관리**
   - 프로덕션 데이터베이스에 연결 시 주의
   - 읽기 전용 모드 사용 고려 (`--read-only` 플래그)

3. **프로젝트 분리**
   - 개발/프로덕션 환경별로 다른 프로젝트 사용 권장

## 읽기 전용 모드

프로덕션 환경에서는 읽기 전용 모드를 사용하는 것을 권장합니다:

```json
{
  "supabase": {
    "command": "npx",
    "args": [
      "-y",
      "@supabase/mcp-server-supabase@latest",
      "--read-only",
      "--project-ref",
      "YOUR_SUPABASE_PROJECT_REF_HERE"
    ],
    "env": {
      "SUPABASE_ACCESS_TOKEN": "YOUR_SUPABASE_ACCESS_TOKEN_HERE"
    }
  }
}
```

## 테스트

설정 완료 후 Cursor를 재시작하고, AI에게 다음과 같이 요청하여 테스트할 수 있습니다:

- "Supabase 데이터베이스 테이블 목록을 보여줘"
- "users 테이블의 스키마를 확인해줘"
- "새로운 테이블을 생성해줘"

## 문제 해결

### MCP 서버가 연결되지 않는 경우
1. Cursor 재시작
2. `npx @supabase/mcp-server-supabase@latest --help` 실행하여 패키지 확인
3. Project Ref와 Access Token이 올바른지 확인

### 권한 오류가 발생하는 경우
1. Access Token이 유효한지 확인
2. 프로젝트 Reference ID가 올바른지 확인
3. Supabase 대시보드에서 토큰 권한 확인

## 참고 자료

- [Supabase MCP 공식 문서](https://supabase.com/mcp)
- [Supabase MCP GitHub](https://github.com/supabase/mcp-server-supabase)


