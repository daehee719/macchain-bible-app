/**
 * 구조화된 로깅 시스템
 * 로그 레벨별 로깅 및 구조화된 로그 포맷
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const LOG_LEVEL_NAMES = ['DEBUG', 'INFO', 'WARN', 'ERROR'];

/**
 * 로거 클래스
 */
class Logger {
  constructor(context = 'API') {
    this.context = context;
    this.minLevel = LOG_LEVELS.INFO; // 프로덕션에서는 INFO 이상만
  }

  /**
   * 로그 포맷팅
   */
  format(level, message, data = {}) {
    return {
      level: LOG_LEVEL_NAMES[level],
      context: this.context,
      message,
      timestamp: new Date().toISOString(),
      ...data,
    };
  }

  /**
   * 로그 출력
   */
  log(level, message, data = {}) {
    if (level < this.minLevel) return;

    const logEntry = this.format(level, message, data);
    
    switch (level) {
      case LOG_LEVELS.DEBUG:
        console.log(JSON.stringify(logEntry));
        break;
      case LOG_LEVELS.INFO:
        console.log(JSON.stringify(logEntry));
        break;
      case LOG_LEVELS.WARN:
        console.warn(JSON.stringify(logEntry));
        break;
      case LOG_LEVELS.ERROR:
        console.error(JSON.stringify(logEntry));
        break;
    }
  }

  debug(message, data = {}) {
    this.log(LOG_LEVELS.DEBUG, message, data);
  }

  info(message, data = {}) {
    this.log(LOG_LEVELS.INFO, message, data);
  }

  warn(message, data = {}) {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  error(message, data = {}) {
    this.log(LOG_LEVELS.ERROR, message, data);
  }

  /**
   * 요청 로깅
   */
  request(request, data = {}) {
    this.info('Request received', {
      method: request.method,
      path: request.url.pathname,
      ...data,
    });
  }

  /**
   * 응답 로깅
   */
  response(statusCode, data = {}) {
    this.info('Response sent', {
      statusCode,
      ...data,
    });
  }

  /**
   * 에러 로깅
   */
  errorWithContext(message, error, context = {}) {
    this.error(message, {
      error: error.message,
      stack: error.stack,
      ...context,
    });
  }
}

/**
 * 컨텍스트별 로거 생성
 */
export function createLogger(context) {
  return new Logger(context);
}

/**
 * 기본 로거
 */
export const logger = createLogger('API');

