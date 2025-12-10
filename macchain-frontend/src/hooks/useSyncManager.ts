/**
 * SyncManager를 React Hook으로 사용하기 위한 커스텀 훅
 */

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { SyncManager } from '../sync'
import { LogLevel } from '../sync/Logger'

let globalSyncManager: SyncManager | null = null

export function useSyncManager(): SyncManager {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const managerRef = useRef<SyncManager | null>(null)

  // 싱글톤 패턴으로 SyncManager 인스턴스 유지
  useEffect(() => {
    if (!globalSyncManager) {
      globalSyncManager = new SyncManager(queryClient)
    }
    managerRef.current = globalSyncManager

    // 사용자 ID 설정
    if (user?.id) {
      globalSyncManager.setCurrentUserId(user.id)
    }

    return () => {
      // 컴포넌트 언마운트 시 정리 (실제로는 앱 종료 시에만)
      // globalSyncManager = null
    }
  }, [queryClient, user?.id])

  return managerRef.current || (globalSyncManager as SyncManager)
}

// 타입 확장을 위한 헬퍼 함수들
export function useSyncManagerWithLogs() {
  const syncManager = useSyncManager()
  return {
    ...syncManager,
    getState: () => {
      return syncManager.getState()
    },
    getLogs: (level?: LogLevel, operation?: string, limit?: number) => {
      return syncManager.getLogs(level, operation, limit)
    },
    getLogStats: () => {
      return syncManager.getLogStats()
    },
    flushBatches: () => {
      return syncManager.flushBatches()
    },
  }
}

