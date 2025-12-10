/**
 * 배치 처리 시스템
 * 여러 작업을 한 번에 처리하여 성능 최적화
 */

import { SyncTask, TaskPriority } from './types'
import { logger, LogLevel } from './Logger'

export interface BatchConfig {
  maxBatchSize: number
  maxWaitTime: number // ms
  priority: TaskPriority
}

export class BatchProcessor {
  private batches: Map<TaskPriority, SyncTask[]> = new Map()
  private timers: Map<TaskPriority, NodeJS.Timeout> = new Map()
  private config: BatchConfig

  constructor(config: Partial<BatchConfig> = {}) {
    this.config = {
      maxBatchSize: config.maxBatchSize || 10,
      maxWaitTime: config.maxWaitTime || 1000,
      priority: config.priority || 'normal',
    }

    // 각 우선순위별 배치 초기화
    this.batches.set('high', [])
    this.batches.set('normal', [])
    this.batches.set('low', [])
  }

  /**
   * 작업을 배치에 추가
   */
  addTask(task: SyncTask, processor: (tasks: SyncTask[]) => Promise<void>): void {
    const batch = this.batches.get(task.priority) || []
    batch.push(task)

    logger.debug('BatchProcessor', `Task added to batch: ${task.id}`, { priority: task.priority, batchSize: batch.length })

    // 배치 크기가 최대치에 도달하면 즉시 처리
    if (batch.length >= this.config.maxBatchSize) {
      this.processBatch(task.priority, processor)
      return
    }

    // 타이머가 없으면 새로 설정
    if (!this.timers.has(task.priority)) {
      const timer = setTimeout(() => {
        this.processBatch(task.priority, processor)
      }, this.config.maxWaitTime)

      this.timers.set(task.priority, timer)
    }
  }

  /**
   * 배치 처리
   */
  private async processBatch(priority: TaskPriority, processor: (tasks: SyncTask[]) => Promise<void>): Promise<void> {
    const batch = this.batches.get(priority) || []
    
    if (batch.length === 0) {
      return
    }

    // 타이머 제거
    const timer = this.timers.get(priority)
    if (timer) {
      clearTimeout(timer)
      this.timers.delete(priority)
    }

    // 배치 복사 및 초기화
    const tasksToProcess = [...batch]
    this.batches.set(priority, [])

    logger.info('BatchProcessor', `Processing batch: ${tasksToProcess.length} tasks`, { priority })

    try {
      await processor(tasksToProcess)
      logger.info('BatchProcessor', `Batch processed successfully`, { priority, count: tasksToProcess.length })
    } catch (error) {
      logger.error('BatchProcessor', `Batch processing failed`, error as Error, { priority, count: tasksToProcess.length })
      throw error
    }
  }

  /**
   * 모든 배치 즉시 처리
   */
  async flushAll(processor: (tasks: SyncTask[]) => Promise<void>): Promise<void> {
    const priorities: TaskPriority[] = ['high', 'normal', 'low']
    
    await Promise.all(
      priorities.map(priority => this.processBatch(priority, processor))
    )
  }

  /**
   * 배치 상태 조회
   */
  getBatchStatus(): Record<TaskPriority, number> {
    return {
      high: this.batches.get('high')?.length || 0,
      normal: this.batches.get('normal')?.length || 0,
      low: this.batches.get('low')?.length || 0,
    }
  }

  /**
   * 정리
   */
  destroy(): void {
    // 모든 타이머 제거
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
    this.batches.clear()
  }
}

