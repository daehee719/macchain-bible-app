/**
 * 서버 동기화 중앙 관리자
 * 모든 동기화 작업을 통합 관리
 */

import { QueryClient } from '@tanstack/react-query'
import { TaskQueue } from './TaskQueue'
import { RealtimeSubscriber } from './RealtimeSubscriber'
import { MutationSyncManager } from './MutationSyncManager'
import { OfflineQueue } from './OfflineQueue'
import { NetworkMonitor } from './NetworkMonitor'
import { SyncTask, SyncState, SyncOperation, TaskPriority, RealtimeSubscription, NetworkStatus } from './types'
import { supabase } from '../lib/supabase'

export class SyncManager {
  private taskQueue: TaskQueue
  private realtimeSubscriber: RealtimeSubscriber
  private mutationSyncManager: MutationSyncManager
  private networkMonitor: NetworkMonitor
  private queryClient: QueryClient
  private isRunning = false
  private processingInterval?: NodeJS.Timeout
  private networkUnsubscribe?: () => void

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient
    this.taskQueue = new TaskQueue()
    this.realtimeSubscriber = new RealtimeSubscriber(queryClient)
    this.mutationSyncManager = new MutationSyncManager(queryClient)
    this.networkMonitor = new NetworkMonitor()
    
    this.initializeOfflineSupport()
    this.start()
  }

  /**
   * 오프라인 지원 초기화
   */
  private async initializeOfflineSupport(): Promise<void> {
    // 저장된 큐 복원
    const savedTasks = await OfflineQueue.load()
    savedTasks.forEach(task => {
      if (task.status === 'pending') {
        this.taskQueue.enqueue(task)
      }
    })

    // 네트워크 상태 모니터링
    this.networkUnsubscribe = this.networkMonitor.subscribe((status) => {
      if (status === 'online') {
        // 온라인 상태로 전환 시 대기 중인 작업 처리
        this.processOfflineQueue()
      }
    })
  }

  /**
   * 오프라인 큐 처리
   */
  private async processOfflineQueue(): Promise<void> {
    const pendingTasks = this.taskQueue.getPendingTasks()
    if (pendingTasks.length === 0) return

    console.log(`🔄 온라인 상태로 전환: ${pendingTasks.length}개의 대기 중인 작업 처리 시작`)
  }

  /**
   * 동기화 프로세스 시작
   */
  private start(): void {
    if (this.isRunning) return
    
    this.isRunning = true
    
    // 작업 큐 처리 (100ms마다 확인)
    this.processingInterval = setInterval(() => {
      this.processQueue()
    }, 100)
  }

  /**
   * 작업 큐 처리
   */
  private async processQueue(): Promise<void> {
    // 오프라인 상태면 처리하지 않음
    if (this.networkMonitor.isOffline()) {
      return
    }

    const task = this.taskQueue.dequeue()
    if (!task) return

    try {
      await this.executeTask(task)
      this.taskQueue.complete(task.id)
      task.status = 'completed'
      task.completedAt = Date.now()
      
      // 오프라인 큐에서 제거
      await OfflineQueue.removeTask(task.id)
      
      task.resolve?.(task)
    } catch (error) {
      task.retryCount++
      
      if (task.retryCount < task.maxRetries) {
        // 재시도 가능하면 큐에 다시 추가
        task.status = 'pending'
        this.taskQueue.enqueue(task)
        
        // 오프라인 큐에도 저장
        const allTasks = this.taskQueue.getPendingTasks()
        await OfflineQueue.save(allTasks)
      } else {
        // 최대 재시도 횟수 초과
        this.taskQueue.fail(task.id)
        task.status = 'failed'
        task.error = error as Error
        
        // 오프라인 큐에서 제거
        await OfflineQueue.removeTask(task.id)
        
        task.reject?.(error as Error)
      }
    }
  }

  /**
   * 작업 실행
   */
  private async executeTask(task: SyncTask): Promise<void> {
    switch (task.operation) {
      case 'like':
        // 좋아요 토글 작업은 API 서비스를 통해 처리
        // 실제 구현은 외부에서 주입받는 방식으로 변경 가능
        break
      case 'comment':
        // 댓글 작업
        break
      case 'post':
        // 포스트 작업
        break
      case 'refresh':
        // 데이터 새로고침
        if (task.payload.queryKeys && Array.isArray(task.payload.queryKeys)) {
          // 여러 쿼리 키를 한 번에 무효화
          await Promise.all(
            task.payload.queryKeys.map((queryKey: string[]) =>
              this.queryClient.invalidateQueries({ queryKey })
            )
          )
        } else if (task.payload.queryKey) {
          // 단일 쿼리 키 무효화
          await this.queryClient.invalidateQueries({ queryKey: task.payload.queryKey })
        }
        break
      default:
        throw new Error(`Unknown operation: ${task.operation}`)
    }
  }

  /**
   * 작업 생성 및 큐에 추가
   */
  createTask(
    operation: SyncOperation,
    payload: any,
    priority: TaskPriority = 'normal',
    maxRetries: number = 3
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const task: SyncTask = {
        id: `${operation}-${Date.now()}-${Math.random()}`,
        operation,
        priority,
        status: 'pending',
        payload,
        retryCount: 0,
        maxRetries,
        createdAt: Date.now(),
        resolve,
        reject,
      }

      this.taskQueue.enqueue(task)
      
      // 오프라인 상태면 로컬에 저장
      if (this.networkMonitor.isOffline()) {
        const allTasks = this.taskQueue.getPendingTasks()
        await OfflineQueue.save(allTasks)
      }
    })
  }

  /**
   * Mutation 실행 (낙관적 업데이트 포함)
   */
  async executeMutation<T>(
    queryKey: string[],
    mutationFn: () => Promise<T>,
    config?: any
  ): Promise<T> {
    return this.mutationSyncManager.executeMutation(queryKey, mutationFn, config)
  }

  /**
   * 실시간 구독 추가
   */
  subscribe(subscription: RealtimeSubscription): () => void {
    return this.realtimeSubscriber.subscribe(subscription)
  }

  /**
   * 현재 사용자 ID 설정
   */
  setCurrentUserId(userId: string | undefined): void {
    this.realtimeSubscriber.setCurrentUserId(userId)
  }

  /**
   * 동기화 상태 조회
   */
  async getState(): Promise<SyncState> {
    const status = this.taskQueue.getStatus()
    const offlineQueueSize = await OfflineQueue.size()
    return {
      isConnected: true, // Supabase 연결 상태는 별도로 관리
      pendingTasks: status.pending,
      processingTasks: status.processing,
      failedTasks: 0, // 실패한 작업은 큐에서 제거되므로 별도 추적 필요
      lastSyncTime: Date.now(),
      isOnline: this.networkMonitor.isOnline(),
      offlineQueueSize,
    }
  }

  /**
   * 모든 구독 취소
   */
  unsubscribeAll(): void {
    this.realtimeSubscriber.unsubscribeAll()
  }

  /**
   * 정리 작업
   */
  destroy(): void {
    this.isRunning = false
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
    }
    if (this.networkUnsubscribe) {
      this.networkUnsubscribe()
    }
    this.networkMonitor.destroy()
    this.taskQueue.clear()
    this.unsubscribeAll()
  }
}

