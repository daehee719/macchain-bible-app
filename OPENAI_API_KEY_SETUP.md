# OpenAI API 키 설정 가이드

## 🔑 API 키 설정 방법

### 1. OpenAI API 키 발급
1. [OpenAI Platform](https://platform.openai.com/)에 로그인
2. API Keys 섹션으로 이동
3. "Create new secret key" 클릭
4. API 키 복사 (sk-로 시작하는 키)

### 2. 환경변수 설정

#### macOS/Linux:
```bash
export OPENAI_API_KEY="sk-your-api-key-here"
```

#### Windows:
```cmd
set OPENAI_API_KEY=sk-your-api-key-here
```

### 3. .env 파일 생성 (권장)
프로젝트 루트에 `.env` 파일 생성:
```
OPENAI_API_KEY=sk-your-api-key-here
```

### 4. Spring Boot에서 환경변수 사용
`application.yml`에서 환경변수 참조:
```yaml
openai:
  api-key: ${OPENAI_API_KEY:}
```

## ⚠️ 주의사항
- API 키는 절대 코드에 하드코딩하지 마세요
- .env 파일은 .gitignore에 추가하세요
- API 키가 유출되면 즉시 재발급하세요

## 💰 비용 관리
- OpenAI API는 사용량에 따라 과금됩니다
- 테스트 시에는 제한된 사용량으로 시작하세요
- 비용 모니터링을 위해 사용량을 확인하세요


