import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분 (기본값)
      gcTime: 10 * 60 * 1000, // 10분 (v5에서 cacheTime → gcTime으로 변경)
      refetchOnWindowFocus: false, // 창 포커스 시 자동 리프레시 비활성화
      retry: 1, // 실패 시 1번만 재시도
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)