/**
 * 실시간 구독 관리자
 * Supabase Realtime 구독을 중앙에서 관리
 */

import { supabase } from '../lib/supabase'
import { RealtimeSubscription } from './types'
import { QueryClient } from '@tanstack/react-query'

export class RealtimeSubscriber {
  private subscriptions: Map<string, RealtimeSubscription> = new Map()
  private queryClient: QueryClient
  private currentUserId?: string

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient
  }

  /**
   * 현재 사용자 ID 설정
   */
  setCurrentUserId(userId: string | undefined): void {
    this.currentUserId = userId
  }

  /**
   * 구독 추가
   */
  subscribe(subscription: RealtimeSubscription): () => void {
    const channel = supabase.channel(subscription.channel)

    const handler = (payload: any) => {
      // 자신의 요청인지 확인하는 로직 포함
      const isOwnRequest = this.isOwnRequest(payload)
      if (!isOwnRequest) {
        subscription.handler(payload)
      }
    }

    channel
      .on(
        'postgres_changes' as any,
        {
          event: subscription.event,
          schema: 'public',
          table: subscription.table,
        },
        handler
      )
      .subscribe()

    const unsubscribe = () => {
      channel.unsubscribe()
      this.subscriptions.delete(subscription.channel)
    }

    subscription.unsubscribe = unsubscribe
    this.subscriptions.set(subscription.channel, subscription)

    return unsubscribe
  }

  /**
   * 자신의 요청인지 확인
   */
  private isOwnRequest(payload: any): boolean {
    if (!this.currentUserId) return false
    
    const eventUserId = payload.eventType === 'DELETE'
      ? payload.old?.user_id
      : payload.new?.user_id

    return eventUserId === this.currentUserId
  }

  /**
   * 특정 채널 구독 취소
   */
  unsubscribe(channelName: string): void {
    const subscription = this.subscriptions.get(channelName)
    if (subscription?.unsubscribe) {
      subscription.unsubscribe()
    }
  }

  /**
   * 모든 구독 취소
   */
  unsubscribeAll(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription.unsubscribe) {
        subscription.unsubscribe()
      }
    })
    this.subscriptions.clear()
  }

  /**
   * 구독 상태 조회
   */
  getSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys())
  }
}

