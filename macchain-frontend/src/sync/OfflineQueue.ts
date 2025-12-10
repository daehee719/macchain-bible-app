/**
 * 오프라인 큐 저장 관리
 * 로컬 스토리지에 작업 큐를 저장하고 복원
 */

import { SyncTask } from './types'

const STORAGE_KEY = 'sync-offline-queue'
const MAX_QUEUE_SIZE = 100 // 최대 큐 크기 제한

export class OfflineQueue {
  /**
   * 큐를 로컬 스토리지에 저장
   */
  static save(tasks: SyncTask[]): void {
    try {
      // 최대 크기 제한
      const tasksToSave = tasks.slice(0, MAX_QUEUE_SIZE)
      const serialized = JSON.stringify(tasksToSave)
      localStorage.setItem(STORAGE_KEY, serialized)
    } catch (error) {
      console.error('Failed to save offline queue:', error)
    }
  }

  /**
   * 로컬 스토리지에서 큐 복원
   */
  static load(): SyncTask[] {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY)
      if (!serialized) return []

      const tasks = JSON.parse(serialized) as SyncTask[]
      
      // 오래된 작업 필터링 (24시간 이상 지난 작업 제거)
      const now = Date.now()
      const oneDay = 24 * 60 * 60 * 1000
      const validTasks = tasks.filter(
        task => (now - task.createdAt) < oneDay
      )

      // 필터링된 결과 저장
      if (validTasks.length !== tasks.length) {
        this.save(validTasks)
      }

      return validTasks
    } catch (error) {
      console.error('Failed to load offline queue:', error)
      return []
    }
  }

  /**
   * 큐 초기화
   */
  static clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear offline queue:', error)
    }
  }

  /**
   * 특정 작업 제거
   */
  static removeTask(taskId: string): void {
    const tasks = this.load()
    const filtered = tasks.filter(task => task.id !== taskId)
    this.save(filtered)
  }

  /**
   * 큐 크기 조회
   */
  static size(): number {
    return this.load().length
  }
}

