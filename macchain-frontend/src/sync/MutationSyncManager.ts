/**
 * Mutation 동기화 관리자
 * 낙관적 업데이트, 충돌 해결, 재시도 로직 관리
 */

import { QueryClient } from '@tanstack/react-query'
import { SyncTask, MutationConfig, TaskPriority } from './types'
import { errorHandler, ErrorContext, ErrorType } from './ErrorHandler'
import { logger } from './Logger'

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
        queryKey,
        config.retryConfig?.maxRetries || 0,
        config.retryConfig?.retryDelay || 1000
      )

      // 성공 시 최종 상태 동기화
      if (config.onSuccess) {
        config.onSuccess(result)
      }

      // 회로 차단기 성공 기록
      const errorContext: ErrorContext = {
        operation: `mutation-${queryKey.join('-')}`,
      }
      errorHandler.recordSuccess(ErrorType.UNKNOWN, errorContext)

      this.optimisticStates.delete(taskId)
      return result
    } catch (error) {
      // ErrorHandler를 사용하여 에러 처리
      const errorContext: ErrorContext = {
        operation: `mutation-${queryKey.join('-')}`,
        payload: { queryKey },
      }

      const processedError = errorHandler.processError(error, errorContext)

      // 실패 시 낙관적 업데이트 롤백
      const previousData = this.optimisticStates.get(taskId)
      if (previousData !== undefined) {
        this.queryClient.setQueryData(queryKey, previousData)
        this.optimisticStates.delete(taskId)
      }

      // 사용자 정의 에러 핸들러 호출
      if (config.onError) {
        config.onError(processedError.originalError)
      } else {
        // 기본 알림 표시
        errorHandler.showNotification(processedError, true)
      }

      throw processedError.originalError
    }
  }

  /**
   * 재시도 로직이 포함된 실행 (ErrorHandler 통합)
   */
  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    queryKey: string[],
    maxRetries: number,
    retryDelay: number
  ): Promise<T> {
    let lastError: Error | unknown
    const operation = `mutation-${queryKey.join('-')}`

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fn()
        
        // 성공 시 회로 차단기 리셋
        if (attempt > 0) {
          const errorContext: ErrorContext = { operation }
          errorHandler.recordSuccess(ErrorType.UNKNOWN, errorContext)
        }
        
        return result
      } catch (error) {
        lastError = error

        // ErrorHandler를 사용하여 에러 처리
        const errorContext: ErrorContext = {
          operation,
          retryCount: attempt,
          payload: { queryKey },
        }

        const processedError = errorHandler.processError(error, errorContext)

        // 재시도 가능 여부 확인
        if (attempt < maxRetries && processedError.retryable) {
          const calculatedDelay = errorHandler.calculateRetryDelay(processedError.type, attempt)
          const delay = Math.max(calculatedDelay, retryDelay * (attempt + 1))
          
          logger.warn('MutationSyncManager', `Retrying mutation`, {
            operation,
            attempt: attempt + 1,
            maxRetries,
            delay,
            errorType: processedError.type,
          })

          await this.delay(delay)
        } else {
          // 재시도 불가능
          logger.error('MutationSyncManager', `Mutation failed permanently`, processedError.originalError, {
            operation,
            attempt,
            errorType: processedError.type,
          })
          break
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

