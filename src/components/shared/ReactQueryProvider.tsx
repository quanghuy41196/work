'use client'

import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface ReactQueryProviderProps {
    children: ReactNode
}

// Tạo một instance của QueryClient với cấu hình mặc định
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // Không refetch khi focus lại window
            retry: 1, // Thử lại 1 lần nếu query thất bại
            staleTime: 5 * 60 * 1000, // Dữ liệu được coi là cũ sau 5 phút
        },
    },
})

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </QueryClientProvider>
    )
}