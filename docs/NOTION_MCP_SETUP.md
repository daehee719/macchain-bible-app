# Notion MCP 연결 가이드

## 개요
Notion MCP(Model Context Protocol) 서버를 통해 AI가 Notion 작업공간과 실시간으로 상호작용할 수 있습니다. 이를 통해 AI가 Notion 페이지를 생성하거나, 기존 페이지를 읽고 정보를 추출하는 등의 작업이 가능합니다.

## 설정 단계

### 1. Notion 통합 생성
1. [Notion 통합 페이지](https://www.notion.so/profile/integrations)에 접속
2. "새 통합" 클릭
3. 통합 이름을 지정하고 연결할 작업공간 선택
4. 필요한 권한 설정:
   - "Read content" - 페이지 읽기
   - "Update content" - 페이지 업데이트
   - "Insert content" - 새 콘텐츠 삽입
5. "제출" 클릭하여 통합 생성

### 2. 내부 통합 토큰 복사
1. 생성된 통합의 "내부 통합 토큰" 복사
2. 이 토큰을 안전한 곳에 보관 (나중에 환경 변수로 사용)

### 3. 작업공간에 통합 추가
1. 접근하려는 Notion 페이지나 데이터베이스 열기
2. 우상단의 "···" 버튼 클릭
3. "Connections" 버튼 클릭
4. 위에서 생성한 통합 선택

### 4. MCP 서버 설정
프로젝트에 이미 `mcp-notion-server`가 설치되어 있습니다.

#### 환경 변수 설정
```bash
export NOTION_API_TOKEN="your-integration-token-here"
```

#### 설정 파일 업데이트
`notion-mcp-config.json` 파일에서 토큰을 업데이트:
```json
{
  "mcpServers": {
    "notion": {
      "command": "node",
      "args": ["./mcp-notion-server/build/index.js"],
      "env": {
        "NOTION_API_TOKEN": "your-actual-integration-token"
      }
    }
  }
}
```

### 5. MCP 서버 실행 테스트
```bash
cd mcp-notion-server
node build/index.js
```

## 사용 가능한 기능

### 페이지 관련
- **페이지 읽기**: Notion 페이지의 내용을 읽어옵니다
- **페이지 생성**: 새로운 Notion 페이지를 생성합니다
- **페이지 업데이트**: 기존 페이지의 내용을 수정합니다
- **페이지 검색**: 특정 키워드로 페이지를 검색합니다

### 데이터베이스 관련
- **데이터베이스 읽기**: 데이터베이스의 구조와 항목들을 읽어옵니다
- **데이터베이스 쿼리**: 특정 조건으로 데이터베이스를 쿼리합니다
- **데이터베이스 항목 생성**: 새로운 데이터베이스 항목을 생성합니다

### 블록 관련
- **블록 읽기**: 페이지의 특정 블록을 읽어옵니다
- **블록 생성**: 새로운 블록을 추가합니다
- **블록 업데이트**: 기존 블록을 수정합니다
- **블록 삭제**: 블록을 삭제합니다

## MacChain 프로젝트와의 통합

### 성경 읽기 기록 관리
- 일일 성경 읽기 기록을 Notion 데이터베이스에 저장
- 읽기 진행률과 통계를 Notion 페이지로 관리
- AI 분석 결과를 Notion에 자동 저장

### 커뮤니티 기능
- 성경 읽기 경험과 인사이트를 Notion 페이지로 공유
- 질문과 답변을 Notion 데이터베이스로 관리
- 그룹별 성경 읽기 계획을 Notion으로 조직화

### 프로젝트 관리
- 개발 작업과 이슈를 Notion으로 추적
- 문서화와 위키를 Notion으로 관리
- 팀 협업과 회의록을 Notion으로 정리

## 보안 고려사항

1. **토큰 보안**: Notion API 토큰을 안전하게 보관
2. **권한 제한**: 필요한 최소 권한만 부여
3. **접근 제어**: 민감한 정보가 포함된 페이지는 별도 관리
4. **백업**: 중요한 데이터는 정기적으로 백업

## 문제 해결

### 일반적인 오류
1. **인증 오류**: 토큰이 올바른지 확인
2. **권한 오류**: 통합이 페이지에 연결되었는지 확인
3. **네트워크 오류**: 인터넷 연결 상태 확인

### 로그 확인
```bash
# MCP 서버 로그 확인
tail -f mcp-notion-server/logs/mcp-server.log
```

## 추가 리소스
- [Notion API 공식 문서](https://developers.notion.com/)
- [MCP 공식 문서](https://modelcontextprotocol.io/)
- [Notion MCP 서버 GitHub](https://github.com/suekou/mcp-notion-server)

## 지원
문제가 발생하면 프로젝트 이슈 트래커에 문의하거나 개발팀에 연락하세요.
