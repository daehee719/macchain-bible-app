/**
 * 요청 데이터 검증 유틸리티
 * 간단한 검증 규칙 제공
 */

/**
 * 검증 결과
 */
export class ValidationResult {
  constructor() {
    this.isValid = true;
    this.errors = [];
  }

  addError(field, message) {
    this.isValid = false;
    this.errors.push({ field, message });
  }

  getErrors() {
    return this.errors;
  }

  getFirstError() {
    return this.errors[0] || null;
  }
}

/**
 * 검증 규칙 빌더
 */
export class Validator {
  constructor(data) {
    this.data = data;
    this.result = new ValidationResult();
  }

  /**
   * 필수 필드 검증
   */
  required(field, message = `${field}는 필수입니다.`) {
    if (!this.data[field] || (typeof this.data[field] === 'string' && this.data[field].trim() === '')) {
      this.result.addError(field, message);
    }
    return this;
  }

  /**
   * 이메일 형식 검증
   */
  email(field, message = `${field}는 유효한 이메일 형식이어야 합니다.`) {
    if (this.data[field]) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.data[field])) {
        this.result.addError(field, message);
      }
    }
    return this;
  }

  /**
   * 최소 길이 검증
   */
  minLength(field, min, message = `${field}는 최소 ${min}자 이상이어야 합니다.`) {
    if (this.data[field] && this.data[field].length < min) {
      this.result.addError(field, message);
    }
    return this;
  }

  /**
   * 최대 길이 검증
   */
  maxLength(field, max, message = `${field}는 최대 ${max}자까지 가능합니다.`) {
    if (this.data[field] && this.data[field].length > max) {
      this.result.addError(field, message);
    }
    return this;
  }

  /**
   * 숫자 범위 검증
   */
  range(field, min, max, message = `${field}는 ${min}과 ${max} 사이의 값이어야 합니다.`) {
    const value = Number(this.data[field]);
    if (isNaN(value) || value < min || value > max) {
      this.result.addError(field, message);
    }
    return this;
  }

  /**
   * 정규식 검증
   */
  pattern(field, regex, message = `${field} 형식이 올바르지 않습니다.`) {
    if (this.data[field] && !regex.test(this.data[field])) {
      this.result.addError(field, message);
    }
    return this;
  }

  /**
   * 커스텀 검증
   */
  custom(field, validator, message = `${field} 검증에 실패했습니다.`) {
    if (this.data[field] && !validator(this.data[field])) {
      this.result.addError(field, message);
    }
    return this;
  }

  /**
   * 검증 결과 반환
   */
  validate() {
    return this.result;
  }
}

/**
 * 검증 헬퍼 함수
 */
export function validate(data) {
  return new Validator(data);
}

/**
 * 일반적인 검증 규칙
 */
export const commonRules = {
  email: (field, data) => {
    const validator = new Validator(data);
    return validator.required(field).email(field).validate();
  },

  password: (field, data, minLength = 8) => {
    const validator = new Validator(data);
    return validator
      .required(field, '비밀번호를 입력해주세요.')
      .minLength(field, minLength, `비밀번호는 최소 ${minLength}자 이상이어야 합니다.`)
      .validate();
  },

  nickname: (field, data, minLength = 2, maxLength = 20) => {
    const validator = new Validator(data);
    return validator
      .required(field, '닉네임을 입력해주세요.')
      .minLength(field, minLength, `닉네임은 최소 ${minLength}자 이상이어야 합니다.`)
      .maxLength(field, maxLength, `닉네임은 최대 ${maxLength}자까지 가능합니다.`)
      .validate();
  },
};

