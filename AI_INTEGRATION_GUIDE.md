# 🤖 AI 원어 분석 연동 가이드

## 📋 개요

MacChain 성경통독 서비스에 OpenAI GPT-4를 활용한 실제 AI 원어 분석 기능을 구현했습니다.

## 🔧 설정 방법

### 1. OpenAI API 키 설정

#### 방법 1: 환경 변수 설정
```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

#### 방법 2: application.yml 수정
```yaml
openai:
  api-key: your-openai-api-key-here
  model: gpt-4
  max-tokens: 2000
  temperature: 0.7
```

### 2. OpenAI API 키 발급

1. [OpenAI 웹사이트](https://platform.openai.com/) 방문
2. 계정 생성 또는 로그인
3. API Keys 섹션에서 새 키 생성
4. 생성된 키를 환경 변수 또는 설정 파일에 추가

## 🚀 기능 설명

### AI 분석 내용

1. **📖 구절 분석**: 성경 구절의 전체적인 의미와 메시지
2. **🔑 핵심 키워드**: 중요한 단어들 추출
3. **📝 문법 분석**: 원어 문법 구조와 특징
4. **🌍 문화적 배경**: 당시 문화적 맥락과 의미
5. **⛪ 신학적 통찰**: 신학적 의미와 해석
6. **💡 실천적 적용**: 현대적 적용 방법

### 사용 방법

1. **Dashboard**에서 읽기 항목의 "🤖 원어 분석" 버튼 클릭
2. **자동 분석**: OpenAI GPT-4가 해당 구절을 분석
3. **상세 정보**: 히브리어/그리스어 원문과 AI 분석 결과 확인

## 🔧 기술 구현

### 백엔드 구성요소

- **OpenAIService**: OpenAI API 호출 서비스
- **AnalyzeOriginalLanguageUseCase**: AI 분석 비즈니스 로직
- **AIAnalysisController**: REST API 엔드포인트
- **AnalysisResult**: 분석 결과 도메인 엔티티

### 프론트엔드 구성요소

- **AIAnalysisService**: 백엔드 API 호출 서비스
- **AIAnalysis.tsx**: 원어 분석 UI 페이지
- **AIAnalysis.css**: 아름다운 디자인 스타일

## 📊 API 엔드포인트

### 구절 분석
```
GET /api/analysis/verse/{book}/{chapter}/{verse}
```

### 장 분석
```
GET /api/analysis/chapter/{book}/{chapter}
```

## 🛠️ 문제 해결

### 1. API 키 오류
```
Error: OpenAI API key not found
```
**해결방법**: 환경 변수 또는 설정 파일에 올바른 API 키 설정

### 2. API 호출 실패
```
Error: OpenAI API call failed
```
**해결방법**: 
- API 키 유효성 확인
- 네트워크 연결 상태 확인
- OpenAI 서비스 상태 확인

### 3. 분석 결과 파싱 오류
```
Error: Failed to parse AI analysis
```
**해결방법**: 
- AI 응답 형식 확인
- 정규식 패턴 검토
- 로그에서 실제 응답 내용 확인

## 💰 비용 관리

### OpenAI API 사용량 모니터링

1. [OpenAI 대시보드](https://platform.openai.com/usage)에서 사용량 확인
2. 월별 사용량 제한 설정
3. 비용 알림 설정

### 최적화 방법

- **캐싱**: 동일한 구절에 대한 중복 분석 방지
- **배치 처리**: 여러 구절을 한 번에 분석
- **모델 선택**: gpt-3.5-turbo 사용으로 비용 절약

## 🔒 보안 고려사항

1. **API 키 보안**: 환경 변수 사용, 코드에 하드코딩 금지
2. **사용량 제한**: API 호출 빈도 제한
3. **에러 처리**: 민감한 정보 노출 방지

## 📈 향후 개선 계획

1. **다양한 AI 모델**: Claude, Gemini 등 다른 AI 모델 지원
2. **사용자 피드백**: 분석 결과에 대한 사용자 평가 시스템
3. **개인화**: 사용자별 맞춤 분석 스타일
4. **오프라인 모드**: 로컬 AI 모델 지원

## 🎯 사용 예시

### 성경 구절 분석 요청
```bash
curl -X GET "http://localhost:8081/api/analysis/verse/genesis/1/1" \
  -H "Content-Type: application/json"
```

### 응답 예시
```json
{
  "success": true,
  "message": "원어 분석이 완료되었습니다.",
  "book": "genesis",
  "chapter": 1,
  "verse": 1,
  "hebrewText": "בְּרֵאשִׁית בָּרָא אֱלֹהִים",
  "greekText": "Ἐν ἀρχῇ ἐποίησεν ὁ θεὸς",
  "analysis": "이 구절은 창조의 시작을 선언하는 중요한 메시지입니다...",
  "keyWords": ["창조", "시작", "하나님", "하늘", "땅"],
  "grammarNotes": "히브리어 'בְּרֵאשִׁית'는 '시작'을 의미하며...",
  "culturalContext": "고대 근동 문화에서 창조는...",
  "theologicalInsights": "이 구절은 하나님의 주권과...",
  "practicalApplication": "우리의 삶에서 하나님을..."
}
```

## 📞 지원

문제가 발생하거나 질문이 있으시면 개발팀에 문의해주세요.

---

**MacChain 성경통독 & AI 원어 분석 서비스**  
*하나님의 말씀을 더 깊이 이해하는 여정을 함께합니다.*

