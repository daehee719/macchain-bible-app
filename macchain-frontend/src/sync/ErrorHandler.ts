/**
 * 중앙화된 오류 처리 시스템
 * 모든 동기화 관련 오류를 통합 관리
 */

import { logger, LogLevel } from './Logger'
import { toast } from 'sonner'

export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  SERVER = 'server',
  CLIENT = 'client',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown',
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface ErrorContext {
  operation: string
  payload?: any
  retryCount?: number
  timestamp?: number
  userId?: string
  [key: string]: any
}

export interface ProcessedError {
  type: ErrorType
  severity: ErrorSeverity
  message: string
  userMessage: string
  retryable: boolean
  originalError: Error
  context: ErrorContext
}

export interface RetryStrategy {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  exponentialBackoff: boolean
  circuitBreaker?: {
    failureThreshold: number
    resetTimeout: number
  }
}

export class ErrorHandler {
  private retryStrategies: Map<ErrorType, RetryStrategy> = new Map()
  private circuitBreakers: Map<string, { failures: number; lastFailure: number }> = new Map()
  private errorCounts: Map<ErrorType, number> = new Map()

  constructor() {
    this.initializeRetryStrategies()
  }

  /**
   * 재시도 전략 초기화
   */
  private initializeRetryStrategies(): void {
    // 네트워크 오류: 지수 백오프
    this.retryStrategies.set(ErrorType.NETWORK, {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      exponentialBackoff: true,
      circuitBreaker: {
        failureThreshold: 5,
        resetTimeout: 30000,
      },
    })

    // 인증 오류: 즉시 재시도 불가
    this.retryStrategies.set(ErrorType.AUTHENTICATION, {
      maxRetries: 0,
      baseDelay: 0,
      maxDelay: 0,
      exponentialBackoff: false,
    })

    // 권한 오류: 재시도 불가
    this.retryStrategies.set(ErrorType.AUTHORIZATION, {
      maxRetries: 0,
      baseDelay: 0,
      maxDelay: 0,
      exponentialBackoff: false,
    })

    // 서버 오류: 지수 백오프
    this.retryStrategies.set(ErrorType.SERVER, {
      maxRetries: 3,
      baseDelay: 2000,
      maxDelay: 20000,
      exponentialBackoff: true,
    })

    // 타임아웃: 빠른 재시도
    this.retryStrategies.set(ErrorType.TIMEOUT, {
      maxRetries: 2,
      baseDelay: 500,
      maxDelay: 5000,
      exponentialBackoff: true,
    })

    // 검증 오류: 재시도 불가
    this.retryStrategies.set(ErrorType.VALIDATION, {
      maxRetries: 0,
      baseDelay: 0,
      maxDelay: 0,
      exponentialBackoff: false,
    })

    // 클라이언트 오류: 재시도 불가
    this.retryStrategies.set(ErrorType.CLIENT, {
      maxRetries: 0,
      baseDelay: 0,
      maxDelay: 0,
      exponentialBackoff: false,
    })

    // 알 수 없는 오류: 기본 재시도
    this.retryStrategies.set(ErrorType.UNKNOWN, {
      maxRetries: 2,
      baseDelay: 1000,
      maxDelay: 5000,
      exponentialBackoff: true,
    })
  }

  /**
   * 에러 처리 및 분류
   */
  processError(error: Error | unknown, context: ErrorContext): ProcessedError {
    const originalError = error instanceof Error ? error : new Error(String(error))
    const errorType = this.classifyError(originalError)
    const severity = this.determineSeverity(errorType, context)
    const retryStrategy = this.retryStrategies.get(errorType) || this.retryStrategies.get(ErrorType.UNKNOWN)!

    const processedError: ProcessedError = {
      type: errorType,
      severity,
      message: originalError.message || '알 수 없는 오류가 발생했습니다.',
      userMessage: this.getUserMessage(errorType, originalError),
      retryable: retryStrategy.maxRetries > 0 && this.isRetryable(errorType, context),
      originalError,
      context: {
        ...context,
        timestamp: Date.now(),
      },
    }

    // 에러 로깅
    this.logError(processedError)

    // 에러 카운트 업데이트
    this.updateErrorCount(errorType)

    return processedError
  }

  /**
   * 에러 분류
   */
  private classifyError(error: Error): ErrorType {
    const message = error.message.toLowerCase()
    const name = error.name.toLowerCase()

    // 네트워크 오류
    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('connection') ||
      message.includes('offline') ||
      name === 'networkerror' ||
      name === 'typeerror'
    ) {
      return ErrorType.NETWORK
    }

    // 인증 오류
    if (
      message.includes('auth') ||
      message.includes('unauthorized') ||
      message.includes('401') ||
      message.includes('token') ||
      message.includes('login')
    ) {
      return ErrorType.AUTHENTICATION
    }

    // 권한 오류
    if (
      message.includes('forbidden') ||
      message.includes('403') ||
      message.includes('permission') ||
      message.includes('access denied')
    ) {
      return ErrorType.AUTHORIZATION
    }

    // 서버 오류
    if (
      message.includes('500') ||
      message.includes('server error') ||
      message.includes('internal error') ||
      message.includes('database')
    ) {
      return ErrorType.SERVER
    }

    // 타임아웃
    if (message.includes('timeout') || message.includes('timed out')) {
      return ErrorType.TIMEOUT
    }

    // 검증 오류
    if (
      message.includes('validation') ||
      message.includes('invalid') ||
      message.includes('400') ||
      message.includes('bad request')
    ) {
      return ErrorType.VALIDATION
    }

    // 클라이언트 오류
    if (message.includes('client error') || message.includes('4xx')) {
      return ErrorType.CLIENT
    }

    return ErrorType.UNKNOWN
  }

  /**
   * 심각도 결정
   */
  private determineSeverity(type: ErrorType, context: ErrorContext): ErrorSeverity {
    // 인증/권한 오류는 높은 심각도
    if (type === ErrorType.AUTHENTICATION || type === ErrorType.AUTHORIZATION) {
      return ErrorSeverity.HIGH
    }

    // 서버 오류는 높은 심각도
    if (type === ErrorType.SERVER) {
      return ErrorSeverity.HIGH
    }

    // 네트워크 오류는 중간 심각도
    if (type === ErrorType.NETWORK) {
      return ErrorSeverity.MEDIUM
    }

    // 검증 오류는 낮은 심각도
    if (type === ErrorType.VALIDATION) {
      return ErrorSeverity.LOW
    }

    // 타임아웃은 중간 심각도
    if (type === ErrorType.TIMEOUT) {
      return ErrorSeverity.MEDIUM
    }

    return ErrorSeverity.MEDIUM
  }

  /**
   * 사용자 친화적 메시지 생성
   */
  private getUserMessage(type: ErrorType, error: Error): string {
    const messages: Record<ErrorType, string> = {
      [ErrorType.NETWORK]: '네트워크 연결을 확인해주세요.',
      [ErrorType.AUTHENTICATION]: '로그인이 필요합니다. 다시 로그인해주세요.',
      [ErrorType.AUTHORIZATION]: '이 작업을 수행할 권한이 없습니다.',
      [ErrorType.VALIDATION]: '입력한 정보를 확인해주세요.',
      [ErrorType.SERVER]: '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      [ErrorType.CLIENT]: '요청을 처리할 수 없습니다.',
      [ErrorType.TIMEOUT]: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
      [ErrorType.UNKNOWN]: '알 수 없는 오류가 발생했습니다.',
    }

    return messages[type] || messages[ErrorType.UNKNOWN]
  }

  /**
   * 재시도 가능 여부 확인
   */
  isRetryable(type: ErrorType, context: ErrorContext): boolean {
    const strategy = this.retryStrategies.get(type)
    if (!strategy || strategy.maxRetries === 0) {
      return false
    }

    // 회로 차단기 확인
    if (strategy.circuitBreaker) {
      const circuitKey = `${type}-${context.operation}`
      const circuit = this.circuitBreakers.get(circuitKey)
      
      if (circuit) {
        const timeSinceLastFailure = Date.now() - circuit.lastFailure
        if (circuit.failures >= strategy.circuitBreaker.failureThreshold) {
          if (timeSinceLastFailure < strategy.circuitBreaker.resetTimeout) {
            logger.warn('ErrorHandler', `Circuit breaker open for ${circuitKey}`)
            return false
          } else {
            // 리셋 타임아웃 경과, 회로 차단기 리셋
            this.circuitBreakers.delete(circuitKey)
          }
        }
      }
    }

    // 재시도 횟수 확인
    if (context.retryCount !== undefined && strategy.maxRetries > 0) {
      return context.retryCount < strategy.maxRetries
    }

    return true
  }

  /**
   * 재시도 지연 시간 계산 (지수 백오프)
   */
  calculateRetryDelay(type: ErrorType, retryCount: number): number {
    const strategy = this.retryStrategies.get(type) || this.retryStrategies.get(ErrorType.UNKNOWN)!

    if (!strategy.exponentialBackoff) {
      return strategy.baseDelay
    }

    const delay = Math.min(
      strategy.baseDelay * Math.pow(2, retryCount),
      strategy.maxDelay
    )

    // 지터 추가 (동시 재시도 방지)
    const jitter = Math.random() * 0.3 * delay
    return Math.floor(delay + jitter)
  }

  /**
   * 회로 차단기 실패 기록
   */
  recordFailure(type: ErrorType, context: ErrorContext): void {
    const strategy = this.retryStrategies.get(type)
    if (!strategy?.circuitBreaker) {
      return
    }

    const circuitKey = `${type}-${context.operation}`
    const circuit = this.circuitBreakers.get(circuitKey) || { failures: 0, lastFailure: 0 }
    
    circuit.failures++
    circuit.lastFailure = Date.now()
    
    this.circuitBreakers.set(circuitKey, circuit)

    logger.warn('ErrorHandler', `Circuit breaker failure recorded`, {
      circuitKey,
      failures: circuit.failures,
      threshold: strategy.circuitBreaker.failureThreshold,
    })
  }

  /**
   * 회로 차단기 성공 기록
   */
  recordSuccess(type: ErrorType, context: ErrorContext): void {
    const strategy = this.retryStrategies.get(type)
    if (!strategy?.circuitBreaker) {
      return
    }

    const circuitKey = `${type}-${context.operation}`
    this.circuitBreakers.delete(circuitKey)

    logger.info('ErrorHandler', `Circuit breaker reset for ${circuitKey}`)
  }

  /**
   * 에러 로깅
   */
  private logError(processedError: ProcessedError): void {
    const logLevel =
      processedError.severity === ErrorSeverity.CRITICAL || processedError.severity === ErrorSeverity.HIGH
        ? LogLevel.ERROR
        : processedError.severity === ErrorSeverity.MEDIUM
        ? LogLevel.WARN
        : LogLevel.INFO

    logger.log(
      logLevel,
      processedError.context.operation,
      processedError.message,
      {
        type: processedError.type,
        severity: processedError.severity,
        retryable: processedError.retryable,
        context: processedError.context,
      },
      processedError.originalError
    )
  }

  /**
   * 에러 카운트 업데이트
   */
  private updateErrorCount(type: ErrorType): void {
    const count = this.errorCounts.get(type) || 0
    this.errorCounts.set(type, count + 1)
  }

  /**
   * 에러 통계 조회
   */
  getErrorStats(): Record<ErrorType, number> {
    const stats: Record<ErrorType, number> = {} as Record<ErrorType, number>
    Object.values(ErrorType).forEach(type => {
      stats[type] = this.errorCounts.get(type) || 0
    })
    return stats
  }

  /**
   * 에러 알림 표시
   */
  showNotification(processedError: ProcessedError, showToast: boolean = true): void {
    if (!showToast) {
      return
    }

    // 심각도에 따른 알림 표시
    switch (processedError.severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        toast.error(processedError.userMessage, {
          duration: 5000,
        })
        break
      case ErrorSeverity.MEDIUM:
        toast.warning(processedError.userMessage, {
          duration: 4000,
        })
        break
      case ErrorSeverity.LOW:
        toast.info(processedError.userMessage, {
          duration: 3000,
        })
        break
    }
  }

  /**
   * 정리
   */
  reset(): void {
    this.circuitBreakers.clear()
    this.errorCounts.clear()
  }
}

export const errorHandler = new ErrorHandler()

