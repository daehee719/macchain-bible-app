/**
 * 네트워크 상태 모니터링
 * 브라우저의 네트워크 상태를 감지하고 변경 사항을 알림
 */

export type NetworkStatus = 'online' | 'offline' | 'unknown'

export type NetworkStatusCallback = (status: NetworkStatus) => void

export class NetworkMonitor {
  private listeners: Set<NetworkStatusCallback> = new Set()
  private currentStatus: NetworkStatus = 'unknown'

  constructor() {
    this.initialize()
  }

  /**
   * 네트워크 모니터링 초기화
   */
  private initialize(): void {
    if (typeof window === 'undefined') return

    // 초기 상태 설정
    this.currentStatus = navigator.onLine ? 'online' : 'offline'

    // 이벤트 리스너 등록
    window.addEventListener('online', () => {
      this.updateStatus('online')
    })

    window.addEventListener('offline', () => {
      this.updateStatus('offline')
    })
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
    if (typeof window === 'undefined') return 'unknown'
    return navigator.onLine ? 'online' : 'offline'
  }

  /**
   * 온라인 상태 확인
   */
  isOnline(): boolean {
    return this.getStatus() === 'online'
  }

  /**
   * 오프라인 상태 확인
   */
  isOffline(): boolean {
    return this.getStatus() === 'offline'
  }
}

