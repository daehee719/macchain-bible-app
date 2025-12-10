/**
 * 동기화 로깅 시스템
 * 상세한 동기화 로그를 기록하고 관리
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  id: string
  timestamp: number
  level: LogLevel
  operation: string
  message: string
  data?: any
  error?: Error
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000 // 최대 로그 수
  private listeners: ((entry: LogEntry) => void)[] = []

  /**
   * 로그 기록
   */
  log(level: LogLevel, operation: string, message: string, data?: any, error?: Error): void {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      level,
      operation,
      message,
      data,
      error,
    }

    // 로그 배열에 추가
    this.logs.push(entry)

    // 최대 로그 수 초과 시 오래된 로그 제거
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // 콘솔에 출력 (개발 환경)
    if (import.meta.env.DEV) {
      const logMethod = level === LogLevel.ERROR ? 'error' : level === LogLevel.WARN ? 'warn' : 'log'
      console[logMethod](`[${level.toUpperCase()}] [${operation}] ${message}`, data || error || '')
    }

    // 리스너에게 알림
    this.listeners.forEach(listener => listener(entry))
  }

  /**
   * DEBUG 레벨 로그
   */
  debug(operation: string, message: string, data?: any): void {
    this.log(LogLevel.DEBUG, operation, message, data)
  }

  /**
   * INFO 레벨 로그
   */
  info(operation: string, message: string, data?: any): void {
    this.log(LogLevel.INFO, operation, message, data)
  }

  /**
   * WARN 레벨 로그
   */
  warn(operation: string, message: string, data?: any): void {
    this.log(LogLevel.WARN, operation, message, data)
  }

  /**
   * ERROR 레벨 로그
   */
  error(operation: string, message: string, error?: Error, data?: any): void {
    this.log(LogLevel.ERROR, operation, message, data, error)
  }

  /**
   * 로그 조회
   */
  getLogs(level?: LogLevel, operation?: string, limit?: number): LogEntry[] {
    let filtered = this.logs

    if (level) {
      filtered = filtered.filter(log => log.level === level)
    }

    if (operation) {
      filtered = filtered.filter(log => log.operation === operation)
    }

    if (limit) {
      filtered = filtered.slice(-limit)
    }

    return filtered
  }

  /**
   * 최근 로그 조회
   */
  getRecentLogs(limit: number = 50): LogEntry[] {
    return this.logs.slice(-limit)
  }

  /**
   * 에러 로그만 조회
   */
  getErrors(limit?: number): LogEntry[] {
    return this.getLogs(LogLevel.ERROR, undefined, limit)
  }

  /**
   * 로그 리스너 추가
   */
  onLog(listener: (entry: LogEntry) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  /**
   * 로그 초기화
   */
  clear(): void {
    this.logs = []
  }

  /**
   * 통계 조회
   */
  getStats(): {
    total: number
    byLevel: Record<LogLevel, number>
    byOperation: Record<string, number>
  } {
    const stats = {
      total: this.logs.length,
      byLevel: {
        [LogLevel.DEBUG]: 0,
        [LogLevel.INFO]: 0,
        [LogLevel.WARN]: 0,
        [LogLevel.ERROR]: 0,
      },
      byOperation: {} as Record<string, number>,
    }

    this.logs.forEach(log => {
      stats.byLevel[log.level]++
      stats.byOperation[log.operation] = (stats.byOperation[log.operation] || 0) + 1
    })

    return stats
  }
}

export const logger = new Logger()

