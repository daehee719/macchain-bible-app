# 서버 동기화 관리 시스템 (SyncManager) 가이드

## 개요

서버와의 동기화 작업을 중앙에서 관리하는 시스템입니다. Task Queue, 실시간 구독, Mutation 동기화를 통합 관리하여 코드의 유지보수성과 최적화를 향상시킵니다.

## 아키텍처

```
SyncManager (중앙 관리자)
├── TaskQueue (작업 큐)
│   ├── 우선순위 기반 정렬
│   ├── 동시 실행 제어 (maxConcurrent: 3)
│   └── 재시도 로직
├── RealtimeSubscriber (실시간 구독 관리)
│   ├── 자신의 요청 필터링
│   ├── 구독 중앙 관리
│   └── 자동 정리
└── MutationSyncManager (Mutation 동기화)
    ├── 낙관적 업데이트
    ├── 충돌 해결
    └── 재시도 로직
```

## 주요 기능

### 1. Task Queue 시스템

작업을 우선순위에 따라 관리하고, 동시 실행을 제어합니다.

```typescript
// 작업 생성
syncManager.createTask('like', { postId: '123' }, 'high', 3)
  .then(result => {
    console.log('작업 완료:', result)
  })
  .catch(error => {
    console.error('작업 실패:', error)
  })
```

### 2. 실시간 구독 관리

Supabase Realtime 구독을 중앙에서 관리하며, 자신의 요청은 자동으로 필터링합니다.

```typescript
// 구독 추가
syncManager.subscribe({
  channel: 'community-posts',
  table: 'community_posts',
  event: '*',
  handler: (payload) => {
    // 다른 사용자의 변경만 처리 (자신의 요청은 자동 필터링)
    console.log('변경 감지:', payload)
  }
})
```

### 3. Mutation 동기화

낙관적 업데이트와 충돌 해결을 자동으로 처리합니다.

```typescript
// Mutation 실행
await syncManager.executeMutation(
  ['community-posts'],
  async () => {
    return await apiService.toggleCommunityLike(postId)
  },
  {
    optimisticUpdate: (oldData) => {
      // 낙관적 업데이트 로직
      return updatedData
    },
    onSuccess: (result) => {
      // 성공 시 처리
    },
    onError: (error) => {
      // 에러 처리 (자동 롤백)
    },
    retryConfig: {
      maxRetries: 3,
      retryDelay: 1000
    }
  }
)
```

## 사용 방법

### React Hook 사용

```typescript
import { useSyncManager } from '../hooks/useSyncManager'

function MyComponent() {
  const syncManager = useSyncManager()

  useEffect(() => {
    // 구독 설정
    const unsubscribe = syncManager.subscribe({
      channel: 'my-channel',
      table: 'my_table',
      event: '*',
      handler: (payload) => {
        // 처리 로직
      }
    })

    return () => {
      unsubscribe()
    }
  }, [syncManager])
}
```

### Community 페이지 전용 훅

```typescript
import { useCommunitySync } from '../hooks/useCommunitySync'

function Community() {
  const { data: posts } = useQuery(...)
  
  // 실시간 동기화 자동 설정
  useCommunitySync(posts)
  
  // 나머지 컴포넌트 로직...
}
```

## 장점

1. **중앙 관리**: 모든 동기화 로직이 한 곳에서 관리됨
2. **자동 필터링**: 자신의 요청은 자동으로 필터링되어 중복 업데이트 방지
3. **낙관적 업데이트**: 즉시 UI 반영 후 서버 응답으로 동기화
4. **재시도 로직**: 네트워크 오류 시 자동 재시도
5. **우선순위 관리**: 중요한 작업을 먼저 처리
6. **타입 안정성**: TypeScript로 타입 안정성 보장

## 다음 단계

1. **Community 컴포넌트 리팩토링**: 기존 코드를 SyncManager 기반으로 변경
2. **다른 페이지 적용**: ReadingPlan, Statistics 등에도 적용
3. **오프라인 지원**: 로컬 큐에 작업 저장 후 재연결 시 자동 동기화
4. **성능 모니터링**: 동기화 작업의 성능 지표 수집

