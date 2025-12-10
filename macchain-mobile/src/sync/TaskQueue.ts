/**
 * 우선순위 기반 작업 큐
 * 서버 동기화 작업을 효율적으로 관리
 */

import { SyncTask, TaskPriority, TaskStatus } from './types'

export class TaskQueue {
  private queue: SyncTask[] = []
  private processing: Set<string> = new Set()
  private maxConcurrent = 3

  /**
   * 작업 추가
   */
  enqueue(task: SyncTask): void {
    this.queue.push(task)
    this.sortQueue()
  }

  /**
   * 우선순위에 따라 큐 정렬
   */
  private sortQueue(): void {
    const priorityOrder: Record<TaskPriority, number> = {
      high: 0,
      normal: 1,
      low: 2,
    }
    
    this.queue.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      return a.createdAt - b.createdAt // 같은 우선순위면 생성 시간순
    })
  }

  /**
   * 다음 작업 가져오기
   */
  dequeue(): SyncTask | null {
    if (this.queue.length === 0) return null
    if (this.processing.size >= this.maxConcurrent) return null

    const task = this.queue.shift()
    if (task) {
      this.processing.add(task.id)
      task.status = 'processing'
      task.startedAt = Date.now()
    }
    return task || null
  }

  /**
   * 작업 완료 처리
   */
  complete(taskId: string): void {
    this.processing.delete(taskId)
  }

  /**
   * 작업 실패 처리
   */
  fail(taskId: string): void {
    this.processing.delete(taskId)
  }

  /**
   * 작업 취소
   */
  cancel(taskId: string): void {
    const index = this.queue.findIndex(t => t.id === taskId)
    if (index !== -1) {
      const task = this.queue[index]
      task.status = 'cancelled'
      this.queue.splice(index, 1)
      task.reject?.(new Error('Task cancelled'))
    }
    this.processing.delete(taskId)
  }

  /**
   * 큐 상태 조회
   */
  getStatus() {
    return {
      pending: this.queue.length,
      processing: this.processing.size,
      total: this.queue.length + this.processing.size,
    }
  }

  /**
   * 모든 대기 중인 작업 반환
   */
  getPendingTasks(): SyncTask[] {
    return this.queue.filter(t => t.status === 'pending')
  }

  /**
   * 큐 초기화
   */
  clear(): void {
    this.queue.forEach(task => {
      task.status = 'cancelled'
      task.reject?.(new Error('Queue cleared'))
    })
    this.queue = []
    this.processing.clear()
  }
}

