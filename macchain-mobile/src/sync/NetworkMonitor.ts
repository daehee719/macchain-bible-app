/**
 * 네트워크 상태 모니터링 (Mobile)
 * React Native의 NetInfo를 사용하여 네트워크 상태 감지
 */

import NetInfo, { NetInfoState } from '@react-native-community/netinfo'
import { NetworkStatus, NetworkStatusCallback } from './types'

export class NetworkMonitor {
  private listeners: Set<NetworkStatusCallback> = new Set()
  private currentStatus: NetworkStatus = 'unknown'
  private unsubscribe?: () => void

  constructor() {
    this.initialize()
  }

  /**
   * 네트워크 모니터링 초기화
   */
  private async initialize(): Promise<void> {
    // 초기 상태 확인
    const state = await NetInfo.fetch()
    this.currentStatus = this.mapNetInfoState(state)

    // 상태 변경 리스너 등록
    this.unsubscribe = NetInfo.addEventListener(state => {
      const status = this.mapNetInfoState(state)
      this.updateStatus(status)
    })
  }

  /**
   * NetInfo 상태를 NetworkStatus로 변환
   */
  private mapNetInfoState(state: NetInfoState): NetworkStatus {
    if (state.isConnected && state.isInternetReachable) {
      return 'online'
    }
    return 'offline'
  }

  /**
   * 상태 업데이트 및 알림
   */
  private updateStatus(status: NetworkStatus): void {
    if (this.currentStatus === status) return

    this.currentStatus = status
    this.notifyListeners(status)
  }

  /**
   * 리스너에게 상태 변경 알림
   */
  private notifyListeners(status: NetworkStatus): void {
    this.listeners.forEach(callback => {
      try {
        callback(status)
      } catch (error) {
        console.error('Error in network status callback:', error)
      }
    })
  }

  /**
   * 네트워크 상태 변경 리스너 추가
   */
  subscribe(callback: NetworkStatusCallback): () => void {
    this.listeners.add(callback)
    
    // 현재 상태 즉시 알림
    callback(this.currentStatus)

    // 구독 취소 함수 반환
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * 현재 네트워크 상태 조회
   */
  getStatus(): NetworkStatus {
    return this.currentStatus
  }

  /**
   * 온라인 상태 확인
   */
  isOnline(): boolean {
    return this.currentStatus === 'online'
  }

  /**
   * 오프라인 상태 확인
   */
  isOffline(): boolean {
    return this.currentStatus === 'offline'
  }

  /**
   * 정리 작업
   */
  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    this.listeners.clear()
  }
}

