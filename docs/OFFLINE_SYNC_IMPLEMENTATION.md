# 오프라인 지원 구현 계획

## 개요

서버 동기화 시스템에 오프라인 지원을 추가하여 네트워크 연결이 없는 상태에서도 작업을 수행하고, 재연결 시 자동으로 동기화하는 기능을 구현합니다.

## 구현 계획

### 1. 로컬 큐 저장 (Local Queue Storage)

#### Frontend (localStorage)
- `localStorage` 또는 `IndexedDB` 사용
- 대용량 데이터를 위해 `IndexedDB` 권장
- 작업 큐를 로컬에 저장

#### Mobile (expo-secure-store + AsyncStorage)
- `@react-native-async-storage/async-storage` 사용
- 작업 큐를 JSON으로 직렬화하여 저장
- 보안이 필요한 데이터는 `expo-secure-store` 사용

### 2. 재연결 감지

#### 네트워크 상태 모니터링
- `navigator.onLine` (Web)
- `@react-native-community/netinfo` (Mobile)
- Supabase 연결 상태 확인

### 3. 자동 동기화

#### 재연결 시 처리
1. 로컬 큐에서 대기 중인 작업 확인
2. 우선순위에 따라 순차 실행
3. 실패한 작업은 재시도
4. 완료된 작업은 로컬 큐에서 제거

## 파일 구조

```
src/sync/
├── OfflineQueue.ts        # 로컬 큐 저장 관리
├── NetworkMonitor.ts      # 네트워크 상태 모니터링
└── AutoSync.ts            # 자동 동기화 로직
```

## 다음 단계

1. `OfflineQueue` 클래스 구현
2. `NetworkMonitor` 클래스 구현
3. `SyncManager`에 오프라인 지원 통합
4. Frontend 및 Mobile 프로젝트에 적용

