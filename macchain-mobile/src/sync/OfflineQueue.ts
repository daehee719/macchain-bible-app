/**
 * 오프라인 큐 저장 관리 (Mobile)
 * AsyncStorage에 작업 큐를 저장하고 복원
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import { SyncTask } from './types'

const STORAGE_KEY = 'sync-offline-queue'
const MAX_QUEUE_SIZE = 100 // 최대 큐 크기 제한

export class OfflineQueue {
  /**
   * 큐를 AsyncStorage에 저장
   */
  static async save(tasks: SyncTask[]): Promise<void> {
    try {
      // 최대 크기 제한
      const tasksToSave = tasks.slice(0, MAX_QUEUE_SIZE)
      const serialized = JSON.stringify(tasksToSave)
      await AsyncStorage.setItem(STORAGE_KEY, serialized)
    } catch (error) {
      console.error('Failed to save offline queue:', error)
    }
  }

  /**
   * AsyncStorage에서 큐 복원
   */
  static async load(): Promise<SyncTask[]> {
    try {
      const serialized = await AsyncStorage.getItem(STORAGE_KEY)
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
        await this.save(validTasks)
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
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear offline queue:', error)
    }
  }

  /**
   * 특정 작업 제거
   */
  static async removeTask(taskId: string): Promise<void> {
    const tasks = await this.load()
    const filtered = tasks.filter(task => task.id !== taskId)
    await this.save(filtered)
  }

  /**
   * 큐 크기 조회
   */
  static async size(): Promise<number> {
    const tasks = await this.load()
    return tasks.length
  }
}

