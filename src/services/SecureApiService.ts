import { encryptEndpoint, generateSecureToken } from '@/utils/apiSecurity'
import { logger } from '@/utils/logger'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import AxiosBase from './axios/AxiosBase'

interface SecureApiOptions {
    useSecureToken?: boolean
    encryptEndpoint?: boolean
    hideInLogs?: boolean
}

class SecureApiService {
    private logApiCall(endpoint: string, method: string, hideInLogs = false) {
        if (!hideInLogs) {
            logger.apiCall(method, endpoint)
        }
    }

    private prepareSecureRequest<T = unknown>(
        config: AxiosRequestConfig<T>,
        options: SecureApiOptions = {},
    ): AxiosRequestConfig<T> {
        const secureConfig = { ...config }

        // Thêm secure token nếu cần
        if (options.useSecureToken) {
            const token = generateSecureToken()
            secureConfig.headers = {
                ...secureConfig.headers,
                'x-secure-token': token,
            }
        }

        // Mã hóa endpoint nếu cần
        if (options.encryptEndpoint && secureConfig.url) {
            const encrypted = encryptEndpoint(secureConfig.url)
            if (!encrypted) {
                throw new Error(`Failed to encrypt endpoint: ${secureConfig.url}`)
            }
            secureConfig.url = encrypted
        }

        // Thêm các header bảo mật
        secureConfig.headers = {
            ...secureConfig.headers,
            'X-Requested-With': 'XMLHttpRequest',
            'Cache-Control': 'no-cache',
        }

        return secureConfig
    }

    /**
     * Gọi API với bảo mật cơ bản
     */
    async fetchData<Response = unknown, Request = Record<string, unknown>>(
        config: AxiosRequestConfig<Request>,
        options: SecureApiOptions = {},
    ): Promise<Response> {
        const method = config.method || 'GET'
        const endpoint = config.url || ''

        this.logApiCall(endpoint, method, options.hideInLogs)

        const secureConfig = this.prepareSecureRequest(config, options)

        try {
            const response: AxiosResponse<Response> =
                await AxiosBase(secureConfig)
            return response.data
        } catch (error) {
            // Enhanced error logging with proper categorization
            if (options.hideInLogs) {
                logger.error(
                    'Secure API request failed (details hidden)',
                    { method: config.method?.toUpperCase() },
                    'SecureAPI'
                )
            } else {
                logger.error(
                    'API request failed',
                    {
                        method: config.method?.toUpperCase(),
                        endpoint: config.url,
                        error: error instanceof Error ? error.message : 'Unknown error',
                    },
                    'API'
                )
            }
            throw error
        }
    }

    /**
     * Gọi API với bảo mật cao (có token và mã hóa)
     */
    async fetchSecureData<
        Response = unknown,
        Request = Record<string, unknown>,
    >(config: AxiosRequestConfig<Request>): Promise<Response> {
        return this.fetchData<Response, Request>(config, {
            useSecureToken: true,
            encryptEndpoint: false,
            hideInLogs: true,
        })
    }

    /**
     * Gọi API internal với bảo mật tối đa
     */
    async fetchInternalData<
        Response = unknown,
        Request = Record<string, unknown>,
    >(config: AxiosRequestConfig<Request>): Promise<Response> {
        return this.fetchData<Response, Request>(config, {
            useSecureToken: true,
            encryptEndpoint: true,
            hideInLogs: true,
        })
    }

    // Các method tiện ích
    async get<T = unknown>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        return this.fetchData<T>({ ...config, method: 'GET', url })
    }

    async post<T = unknown, D = unknown>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>,
    ): Promise<T> {
        return this.fetchData<T, D>({ ...config, method: 'POST', url, data })
    }

    async put<T = unknown, D = unknown>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>,
    ): Promise<T> {
        return this.fetchData<T, D>({ ...config, method: 'PUT', url, data })
    }

    async delete<T = unknown>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        return this.fetchData<T>({ ...config, method: 'DELETE', url })
    }

    // Secure versions
    async secureGet<T = unknown>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        return this.fetchSecureData<T>({ ...config, method: 'GET', url })
    }

    async securePost<T = unknown, D = unknown>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>,
    ): Promise<T> {
        return this.fetchSecureData<T, D>({
            ...config,
            method: 'POST',
            url,
            data,
        })
    }
}

const secureApiService = new SecureApiService()
export default secureApiService
