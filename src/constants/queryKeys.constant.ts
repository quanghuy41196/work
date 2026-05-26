/**
 * Định nghĩa các query keys cho React Query
 * Sử dụng cấu trúc phân cấp để dễ dàng quản lý và vô hiệu hóa query
 */

export const queryKeys = {
    // Auth related queries
    auth: {
        base: ['auth'],
        user: () => [...queryKeys.auth.base, 'user'],
        session: () => [...queryKeys.auth.base, 'session'],
        permissions: () => [...queryKeys.auth.base, 'permissions'],
        login: () => [...queryKeys.auth.base, 'login'],
        register: () => [...queryKeys.auth.base, 'register'],
        logout: () => [...queryKeys.auth.base, 'logout'],
        refreshToken: () => [...queryKeys.auth.base, 'refreshToken'],
    },
    
    // User related queries
    users: {
        base: ['users'],
        list: (params?: Record<string, unknown>) => [
            ...queryKeys.users.base,
            'list',
            params,
        ],
        detail: (id: string | number) => [...queryKeys.users.base, 'detail', id],
        create: () => [...queryKeys.users.base, 'create'],
        update: (id: string | number) => [...queryKeys.users.base, 'update', id],
        delete: (id: string | number) => [...queryKeys.users.base, 'delete', id],
    },
    
    // Dashboard related queries
    dashboard: {
        base: ['dashboard'],
        stats: () => [...queryKeys.dashboard.base, 'stats'],
        charts: (period?: string) => [...queryKeys.dashboard.base, 'charts', period],
        activities: (params?: Record<string, unknown>) => [
            ...queryKeys.dashboard.base,
            'activities',
            params,
        ],
    },
    
    // Settings related queries
    settings: {
        base: ['settings'],
        general: () => [...queryKeys.settings.base, 'general'],
        security: () => [...queryKeys.settings.base, 'security'],
        notifications: () => [...queryKeys.settings.base, 'notifications'],
        appearance: () => [...queryKeys.settings.base, 'appearance'],
    },
    
    // Products related queries
    products: {
        base: ['products'],
        list: (params?: Record<string, unknown>) => [
            ...queryKeys.products.base,
            'list',
            params,
        ],
        detail: (id: string | number) => [...queryKeys.products.base, 'detail', id],
        create: () => [...queryKeys.products.base, 'create'],
        update: (id: string | number) => [...queryKeys.products.base, 'update', id],
        delete: (id: string | number) => [...queryKeys.products.base, 'delete', id],
    },
    
    // Orders related queries
    orders: {
        base: ['orders'],
        list: (params?: Record<string, unknown>) => [
            ...queryKeys.orders.base,
            'list',
            params,
        ],
        detail: (id: string | number) => [...queryKeys.orders.base, 'detail', id],
        create: () => [...queryKeys.orders.base, 'create'],
        update: (id: string | number) => [...queryKeys.orders.base, 'update', id],
        delete: (id: string | number) => [...queryKeys.orders.base, 'delete', id],
    },
    
    // Add more query keys as needed for your application
}