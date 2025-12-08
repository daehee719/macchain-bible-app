/**
 * className 유틸리티 함수
 * 여러 클래스를 조건부로 결합하고 중복을 제거
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

