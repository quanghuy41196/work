import { useState, useCallback, useEffect } from 'react'
import SecureApiService from '@/services/SecureApiService'
import type { AxiosRequestConfig } from 'axios'

interface UseSecureApiOptions {
    onSuccess?: (data: unknown) => void
    onError?: (error: unknown) => void
    showErrorInConsole?: boolean
}

interface UseSecureApiReturn<T> {
    data: T | null
    loading: boolean
    error: string | null
    execute: (config: AxiosRequestConfig) => Promise<void>
    executeSecure: (config: AxiosRequestConfig) => Promise<void>
    executeInternal: (config: AxiosRequestConfig) => Promise<void>
    reset: () => void
}

/**
 * Hook để gọi API với bảo mật
 */
export function useSecureApi<T = unknown>(
    options: UseSecureApiOptions = {},
): UseSecureApiReturn<T> {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const reset = useCallback(() => {
        setData(null)
        setError(null)
        setLoading(false)
    }, [])

    const handleRequest = useCallback(
        async (requestFn: () => Promise<T>) => {
            try {
                setLoading(true)
                setError(null)

                const result = await requestFn()
                setData(result)

                if (options.onSuccess) {
                    options.onSuccess(result)
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : 'An unknown error occurred'

                setError(errorMessage)

                if (options.showErrorInConsole !== false) {
                    console.error('Secure API Error:', err)
                }

                if (options.onError) {
                    options.onError(err)
                }
            } finally {
                setLoading(false)
            }
        },
        [options],
    )

    // API thông thường với bảo mật cơ bản
    const execute = useCallback(
        (config: AxiosRequestConfig) => {
            return handleRequest(() => SecureApiService.fetchData<T>(config))
        },
        [handleRequest],
    )

    // API với bảo mật cao
    const executeSecure = useCallback(
        (config: AxiosRequestConfig) => {
            return handleRequest(() =>
                SecureApiService.fetchSecureData<T>(config),
            )
        },
        [handleRequest],
    )

    // API internal với bảo mật tối đa
    const executeInternal = useCallback(
        (config: AxiosRequestConfig) => {
            return handleRequest(() =>
                SecureApiService.fetchInternalData<T>(config),
            )
        },
        [handleRequest],
    )

    return {
        data,
        loading,
        error,
        execute,
        executeSecure,
        executeInternal,
        reset,
    }
}

/**
 * Hook đơn giản cho GET requests
 */
export function useSecureGet<T = unknown>(url: string, autoExecute = false) {
    const api = useSecureApi<T>()

    const get = useCallback(() => {
        return api.execute({ method: 'GET', url })
    }, [api, url])

    const getSecure = useCallback(() => {
        return api.executeSecure({ method: 'GET', url })
    }, [api, url])

    // Auto execute nếu được yêu cầu
    useEffect(() => {
        if (autoExecute) {
            get()
        }
    }, [autoExecute, get])

    return {
        ...api,
        get,
        getSecure,
    }
}

/**
 * Hook cho POST requests
 */
export function useSecurePost<T = unknown, D = unknown>() {
    const api = useSecureApi<T>()

    const post = useCallback(
        (url: string, data?: D) => {
            return api.execute({ method: 'POST', url, data })
        },
        [api],
    )

    const postSecure = useCallback(
        (url: string, data?: D) => {
            return api.executeSecure({ method: 'POST', url, data })
        },
        [api],
    )

    return {
        ...api,
        post,
        postSecure,
    }
}
