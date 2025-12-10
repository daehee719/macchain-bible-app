/**
 * 서버 동기화 시스템 타입 정의
 */

export type TaskPriority = 'high' | 'normal' | 'low'

export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

export type SyncOperation = 
  | 'like' 
  | 'comment' 
  | 'post' 
  | 'delete'
  | 'update'
  | 'refresh'

export interface SyncTask {
  id: string
  operation: SyncOperation
  priority: TaskPriority
  status: TaskStatus
  payload: any
  retryCount: number
  maxRetries: number
  createdAt: number
  startedAt?: number
  completedAt?: number
  error?: Error
  resolve?: (value: any) => void
  reject?: (error: Error) => void
}

export interface RealtimeSubscription {
  channel: string
  table: string
  event: '*' | 'INSERT' | 'UPDATE' | 'DELETE'
  handler: (payload: any) => void
  unsubscribe?: () => void
}

export interface MutationConfig {
  optimisticUpdate?: (oldData: any) => any
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  retryConfig?: {
    maxRetries: number
    retryDelay: number
  }
}

export interface SyncState {
  isConnected: boolean
  pendingTasks: number
  processingTasks: number
  failedTasks: number
  lastSyncTime?: number
  isOnline: boolean
  offlineQueueSize: number
}

export type NetworkStatus = 'online' | 'offline' | 'unknown'

export type NetworkStatusCallback = (status: NetworkStatus) => void

