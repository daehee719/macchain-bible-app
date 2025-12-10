/**
 * 동기화 상태 모니터링 대시보드 컴포넌트
 */

import React, { useState, useEffect } from 'react'
import { useSyncManagerWithLogs } from '../hooks/useSyncManager'
import { LogLevel } from '../sync/Logger'
import { SyncState } from '../sync/types'
import Card from './Card'
import { Activity, Wifi, WifiOff, AlertCircle, CheckCircle, Clock, Database, RefreshCw } from 'lucide-react'
import { cn } from '../utils/cn'
import { card, text, button } from '../utils/styles'

export const SyncMonitor: React.FC = () => {
  const syncManager = useSyncManagerWithLogs()
  const [state, setState] = useState<SyncState | null>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    const updateState = () => {
      setState(syncManager.getState())
      setLogs(syncManager.getLogs(undefined, undefined, 20))
      setStats(syncManager.getLogStats())
    }

    updateState()

    if (autoRefresh) {
      const interval = setInterval(updateState, 2000) // 2초마다 업데이트
      return () => clearInterval(interval)
    }
  }, [syncManager, autoRefresh])

  if (!state) {
    return null
  }

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleTimeString('ko-KR')
  }

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="space-y-4">
      <Card title="동기화 상태 모니터" icon={<Activity size={20} />}>
        <div className="space-y-4">
          {/* 네트워크 상태 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              {state.isOnline ? (
                <Wifi size={24} className="text-green-600 dark:text-green-400" />
              ) : (
                <WifiOff size={24} className="text-red-600 dark:text-red-400" />
              )}
              <div>
                <div className={cn('font-semibold', text.bold)}>
                  네트워크 상태
                </div>
                <div className={cn('text-sm', text.muted)}>
                  {state.isOnline ? '온라인' : '오프라인'}
                </div>
              </div>
            </div>
            <div className={cn('text-lg font-bold', getStatusColor(state.isOnline))}>
              {state.isOnline ? '연결됨' : '연결 안 됨'}
            </div>
          </div>

          {/* 작업 상태 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={18} className="text-blue-600 dark:text-blue-400" />
                <span className={cn('text-sm font-medium', text.muted)}>대기 중</span>
              </div>
              <div className={cn('text-2xl font-bold', text.bold)}>
                {state.pendingTasks}
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={18} className="text-yellow-600 dark:text-yellow-400" />
                <span className={cn('text-sm font-medium', text.muted)}>처리 중</span>
              </div>
              <div className={cn('text-2xl font-bold', text.bold)}>
                {state.processingTasks}
              </div>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
                <span className={cn('text-sm font-medium', text.muted)}>실패</span>
              </div>
              <div className={cn('text-2xl font-bold', text.bold)}>
                {state.failedTasks}
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database size={18} className="text-purple-600 dark:text-purple-400" />
                <span className={cn('text-sm font-medium', text.muted)}>오프라인 큐</span>
              </div>
              <div className={cn('text-2xl font-bold', text.bold)}>
                {state.offlineQueueSize}
              </div>
            </div>
          </div>

          {/* 로그 통계 */}
          {stats && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className={cn('font-semibold mb-3', text.bold)}>로그 통계</div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className={cn('text-sm', text.muted)}>전체</div>
                  <div className={cn('text-lg font-bold', text.bold)}>{stats.total}</div>
                </div>
                <div>
                  <div className={cn('text-sm', text.muted)}>INFO</div>
                  <div className={cn('text-lg font-bold text-blue-600', text.bold)}>{stats.byLevel[LogLevel.INFO]}</div>
                </div>
                <div>
                  <div className={cn('text-sm', text.muted)}>WARN</div>
                  <div className={cn('text-lg font-bold text-yellow-600', text.bold)}>{stats.byLevel[LogLevel.WARN]}</div>
                </div>
                <div>
                  <div className={cn('text-sm', text.muted)}>ERROR</div>
                  <div className={cn('text-lg font-bold text-red-600', text.bold)}>{stats.byLevel[LogLevel.ERROR]}</div>
                </div>
              </div>
            </div>
          )}

          {/* 최근 로그 */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className={cn('font-semibold', text.bold)}>최근 로그</div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={cn(
                  'px-3 py-1 text-sm rounded-lg',
                  autoRefresh
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}
              >
                {autoRefresh ? '자동 새로고침 ON' : '자동 새로고침 OFF'}
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <div className={cn('text-center py-4', text.muted)}>로그가 없습니다</div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={cn(
                      'p-2 rounded text-sm',
                      log.level === LogLevel.ERROR && 'bg-red-50 dark:bg-red-900/20',
                      log.level === LogLevel.WARN && 'bg-yellow-50 dark:bg-yellow-900/20',
                      log.level === LogLevel.INFO && 'bg-blue-50 dark:bg-blue-900/20',
                      log.level === LogLevel.DEBUG && 'bg-gray-50 dark:bg-gray-700'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn('font-medium', text.bold)}>
                        [{log.operation}] {log.message}
                      </span>
                      <span className={cn('text-xs', text.muted)}>
                        {formatTime(log.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                syncManager.flushBatches()
                setState(syncManager.getState())
              }}
              className={cn(button.secondary, 'flex-1')}
            >
              <RefreshCw size={16} />
              배치 즉시 처리
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

