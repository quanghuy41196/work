import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import AxiosBase from './axios/AxiosBase';

interface ClientApiOptions {
    baseURL?: string
    useAuth?: boolean
    showErrorInConsole?: boolean
}


class ClientApiService {
    fetchData<Response, Request = Record<string, unknown>>(
        config: AxiosRequestConfig<Request>,
        options: ClientApiOptions = {}
    ): Promise<Response> {
        const {
            showErrorInConsole = true
        } = options

        const clientConfig: AxiosRequestConfig = { ...config }


        clientConfig.withCredentials = true
        clientConfig.headers = {
            ...clientConfig.headers,
            'X-Requested-With': 'XMLHttpRequest',
            'Cache-Control': 'no-cache'
        }

        return new Promise<Response>((resolve, reject) => {
            AxiosBase(clientConfig)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response.data)
                })
                .catch((error: AxiosError) => {
                    if (showErrorInConsole) {
                        console.error(`[ClientApiService] Error fetching ${clientConfig.url}:`, error)
                    }
                    reject(error)
                })
        })
    }

    get<T = unknown>(
        url: string,
        config?: AxiosRequestConfig,
        options?: ClientApiOptions & { params?: Record<string, unknown> }
    ): Promise<T> {
        const { params, ...restOptions } = options || {}
        return this.fetchData<T>({ ...config, method: 'GET', url, params }, restOptions)
    }


    post<T = unknown, D = unknown>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>,
        options?: ClientApiOptions
    ): Promise<T> {
        return this.fetchData<T, D>({ ...config, method: 'POST', url, data }, options)
    }

    put<T = unknown, D = unknown>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>,
        options?: ClientApiOptions
    ): Promise<T> {
        return this.fetchData<T, D>({ ...config, method: 'PUT', url, data }, options)
    }

    delete<T = unknown>(
        url: string,
        config?: AxiosRequestConfig,
        options?: ClientApiOptions
    ): Promise<T> {
        return this.fetchData<T>({ ...config, method: 'DELETE', url }, options)
    }

    upload<T = unknown>(
        url: string,
        file: File | Blob,
        fieldName: string = 'file',
        config?: AxiosRequestConfig,
        options?: ClientApiOptions
    ): Promise<T> {
        const formData = new FormData()
        formData.append(fieldName, file)

        return this.post<T, FormData>(
            url,
            formData,
            {
                ...config,
                headers: {
                    ...config?.headers,
                    'Content-Type': 'multipart/form-data'
                }
            },
            options
        )
    }
}
const clientApiService = new ClientApiService()
export default clientApiService


