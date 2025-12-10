/**
 * Mutation 동기화 관리자
 * 낙관적 업데이트, 충돌 해결, 재시도 로직 관리
 */

import { QueryClient } from '@tanstack/react-query'
import { SyncTask, MutationConfig, TaskPriority } from './types'

export class MutationSyncManager {
  private queryClient: QueryClient
  private optimisticStates: Map<string, any> = new Map()

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient
  }

  /**
   * Mutation 실행 (낙관적 업데이트 포함)
   */
  async executeMutation<T>(
    queryKey: string[],
    mutationFn: () => Promise<T>,
    config: MutationConfig = {}
  ): Promise<T> {
    const taskId = `${queryKey.join('-')}-${Date.now()}`
    
    // 낙관적 업데이트 적용
    if (config.optimisticUpdate) {
      const previousData = this.queryClient.getQueryData(queryKey)
      this.optimisticStates.set(taskId, previousData)
      
      this.queryClient.setQueryData(queryKey, config.optimisticUpdate(previousData))
    }

    try {
      // 서버 요청 실행
      const result = await this.executeWithRetry(
        mutationFn,
        config.retryConfig?.maxRetries || 0,
        config.retryConfig?.retryDelay || 1000
      )

      // 성공 시 최종 상태 동기화
      if (config.onSuccess) {
        config.onSuccess(result)
      }

      this.optimisticStates.delete(taskId)
      return result
    } catch (error) {
      // 실패 시 낙관적 업데이트 롤백
      const previousData = this.optimisticStates.get(taskId)
      if (previousData !== undefined) {
        this.queryClient.setQueryData(queryKey, previousData)
        this.optimisticStates.delete(taskId)
      }

      if (config.onError) {
        config.onError(error as Error)
      }

      throw error
    }
  }

  /**
   * 재시도 로직이 포함된 실행
   */
  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number,
    retryDelay: number
  ): Promise<T> {
    let lastError: Error

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        
        if (attempt < maxRetries) {
          await this.delay(retryDelay * (attempt + 1)) // 지수 백오프
        }
      }
    }

    throw lastError!
  }

  /**
   * 지연 유틸리티
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 충돌 해결 전략
   */
  resolveConflict<T>(
    serverData: T,
    localData: T,
    strategy: 'server-wins' | 'client-wins' | 'merge' = 'server-wins'
  ): T {
    switch (strategy) {
      case 'server-wins':
        return serverData
      case 'client-wins':
        return localData
      case 'merge':
        return { ...localData, ...serverData }
      default:
        return serverData
    }
  }
}

