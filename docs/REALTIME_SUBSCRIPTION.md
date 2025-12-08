# Supabase 실시간 구독 가이드

## 📡 개요

Supabase Realtime을 사용하여 커뮤니티 기능에 실시간 업데이트를 구현했습니다. 사용자가 페이지를 새로고침하지 않아도 다른 사용자의 활동을 즉시 확인할 수 있습니다.

## 🎯 구현된 기능

### 1. 나눔 실시간 구독
- **이벤트**: INSERT, UPDATE, DELETE
- **동작**: 
  - 새 나눔이 추가되면 목록에 자동 반영
  - 나눔이 수정되면 자동 업데이트
  - 나눔이 삭제되면 목록에서 자동 제거

### 2. 댓글 실시간 구독
- **이벤트**: INSERT, DELETE
- **동작**:
  - 새 댓글이 추가되면 해당 나눔의 댓글 목록에 자동 추가
  - 댓글이 삭제되면 자동 제거
  - 나눔의 댓글 수 자동 업데이트

### 3. 아멘 실시간 구독
- **이벤트**: INSERT, DELETE
- **동작**:
  - 새 아멘이 추가되면 나눔의 아멘 수 자동 증가
  - 아멘이 제거되면 자동 감소
  - 현재 사용자의 아멘 상태 자동 업데이트

## 🔧 기술 구현

### Supabase Realtime 설정

```typescript
// 실시간 구독 설정
const channel = supabase
  .channel('community-posts')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE 모두 감지
      schema: 'public',
      table: 'community_posts'
    },
    (payload) => {
      // 변경 사항 처리
    }
  )
  .subscribe()
```

### React Query와 통합

실시간 업데이트를 React Query 캐시에 반영하여 일관된 상태 관리:

```typescript
// 나눔 삭제 시 캐시 업데이트
queryClient.setQueryData<Post[]>(['community-posts'], (old = []) =>
  old.filter(post => post.id !== payload.old.id)
)

// 아멘 추가 시 캐시 업데이트
queryClient.setQueryData<Post[]>(['community-posts'], (old = []) =>
  old.map(post =>
    post.id === newLike.post_id
      ? {
          ...post,
          likes: post.likes + 1,
          isLiked: newLike.user_id === user.id ? true : post.isLiked
        }
      : post
  )
)
```

## 📊 성능 최적화

### 1. 중복 방지
- 같은 이벤트가 여러 번 발생해도 중복 처리 방지
- 캐시에 이미 존재하는 데이터는 추가하지 않음

### 2. 선택적 업데이트
- 전체 리프레시 대신 특정 항목만 업데이트
- 네트워크 요청 최소화

### 3. 자동 정리
- 컴포넌트 언마운트 시 구독 자동 해제
- 메모리 누수 방지

## 🚀 사용 방법

### 기본 사용

커뮤니티 페이지에 접속하면 자동으로 실시간 구독이 시작됩니다:

1. **로그인 필요**: 로그인한 사용자만 실시간 구독 가능
2. **자동 시작**: 페이지 로드 시 자동으로 구독 시작
3. **자동 정리**: 페이지를 벗어나면 자동으로 구독 해제

### 구독 채널

현재 3개의 채널이 활성화되어 있습니다:

- `community-posts`: 나눔 변경 감지
- `community-comments`: 댓글 변경 감지
- `community-likes`: 아멘 변경 감지

## ⚙️ Supabase 설정

### Realtime 활성화 ✅

프로덕션 및 개발 프로젝트에 Realtime이 이미 활성화되어 있습니다:

```sql
-- Realtime 활성화 (이미 적용됨)
ALTER PUBLICATION supabase_realtime ADD TABLE community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE community_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE community_likes;
```

**확인 방법:**
1. **Supabase Dashboard** 접속
2. **Database** → **Replication** 메뉴로 이동
3. `supabase_realtime` publication에서 다음 테이블이 활성화되어 있는지 확인:
   - `community_posts` ✅
   - `community_comments` ✅
   - `community_likes` ✅

### RLS 정책 확인

Row Level Security가 활성화되어 있어도 실시간 구독은 작동합니다. 다만 사용자는 자신이 볼 수 있는 데이터의 변경만 감지합니다.

## 🔍 디버깅

### 콘솔 로그

실시간 이벤트는 콘솔에 로그로 출력됩니다:

```
📢 나눔 변경 감지: INSERT { id: '...', content: '...' }
💬 댓글 변경 감지: INSERT { id: '...', post_id: '...' }
❤️ 아멘 변경 감지: INSERT { id: '...', post_id: '...' }
```

### 구독 상태 확인

Supabase Dashboard에서 실시간 연결 상태를 확인할 수 있습니다:

1. **Database** → **Replication** 메뉴
2. 활성화된 테이블 목록 확인
3. 연결된 클라이언트 수 확인

## 📈 성능 영향

### 네트워크 사용량
- WebSocket 연결 1개 유지
- 이벤트 발생 시에만 데이터 전송
- 평균 네트워크 사용량: 매우 낮음

### 서버 부하
- Supabase Realtime은 효율적으로 설계됨
- 많은 동시 사용자도 처리 가능
- 자동 스케일링 지원

## 🎨 사용자 경험

### 즉각적인 피드백
- 다른 사용자의 활동을 즉시 확인
- 페이지 새로고침 불필요
- 자연스러운 실시간 경험

### 오프라인 지원
- 오프라인 상태에서는 실시간 업데이트 중단
- 온라인 복귀 시 자동 재연결
- 캐시된 데이터로 기본 기능 유지

## 🔐 보안 고려사항

### RLS 정책
- 모든 실시간 이벤트는 RLS 정책을 따름
- 사용자는 자신이 볼 수 있는 데이터의 변경만 감지
- 보안 정책 자동 적용

### 인증
- 로그인한 사용자만 실시간 구독 가능
- 인증 토큰이 자동으로 포함됨

## 🚧 향후 개선 사항

1. **읽기 진행률 실시간 구독**
   - 다른 사용자의 진행률 실시간 확인
   - 동기화된 읽기 경험

2. **통계 실시간 업데이트**
   - 커뮤니티 통계 실시간 반영
   - 활발한 활동 시각화

3. **알림 시스템**
   - 내 나눔에 댓글이 달리면 알림
   - 내 나눔에 아멘이 추가되면 알림

