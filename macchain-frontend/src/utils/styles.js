/**
 * 공통 스타일 상수
 * 자주 사용되는 className 패턴을 상수로 정의
 */
// 레이아웃
export const layout = {
    pageContainer: 'min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    containerMd: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
    header: 'text-center mb-12',
    title: 'text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4',
    subtitle: 'text-xl text-gray-600 dark:text-gray-300',
};
// 버튼 스타일
export const button = {
    primary: 'px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
    secondary: 'px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all',
    icon: 'flex items-center gap-2',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
};
// 입력 필드
export const input = {
    base: 'w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all',
    textarea: 'w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all resize-none',
};
// 카드/컨테이너
export const card = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    grid2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    grid3: 'grid grid-cols-3 gap-6',
};
// 텍스트
export const text = {
    center: 'text-center',
    primary: 'text-primary-600 dark:text-primary-400',
    secondary: 'text-gray-600 dark:text-gray-400',
    muted: 'text-gray-500 dark:text-gray-400',
    bold: 'font-bold text-gray-900 dark:text-white',
    large: 'text-2xl font-bold text-gray-900 dark:text-white',
    small: 'text-sm text-gray-600 dark:text-gray-400',
};
// 상태
export const state = {
    loading: 'flex items-center justify-center h-64',
    empty: 'text-center py-12 text-gray-500 dark:text-gray-400',
    error: 'p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300',
};
// 로딩 애니메이션
export const loading = {
    spinner: 'animate-spin rounded-full border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    skeleton: 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
};
// 링크
export const link = {
    primary: 'inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium group',
    icon: 'ml-2 group-hover:translate-x-1 transition-transform',
};
