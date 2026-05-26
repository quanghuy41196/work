import 'server-only'
import { decryptEndpoint } from '@/utils/apiSecurity'
import { auth } from '@/auth'

export interface FetchOptions extends RequestInit {
    baseUrl?: string
    useAuth?: boolean
    encryptedEndpoint?: boolean
}

export class ServerFetcher {
    private baseUrl: string
    private useAuth: boolean
    private encryptedEndpoint: boolean

    constructor({
        baseUrl = process.env.BACKEND_API_URL!,
        useAuth = true,
        encryptedEndpoint = false,
    }: {
        baseUrl?: string
        useAuth?: boolean
        encryptedEndpoint?: boolean
    } = {}) {
        if (!baseUrl) {
            throw new Error('BACKEND_API_URL is not defined')
        }

        this.baseUrl = baseUrl
        this.useAuth = useAuth
        this.encryptedEndpoint = encryptedEndpoint
    }

    private async buildUrl(endpoint: string): Promise<string> {
        let finalEndpoint: string
        if (this.encryptedEndpoint) {
            const decrypted = decryptEndpoint(endpoint)
            if (!decrypted) {
                throw new Error('Failed to decrypt endpoint — it may be corrupted or encrypted with a different key')
            }
            finalEndpoint = decrypted
        } else {
            finalEndpoint = endpoint
        }

        let url = finalEndpoint
        if (!url.startsWith('http')) {
            if (!url.startsWith('/uploaded-files') && !url.startsWith('/storage')) {
                url = `/api/v1${url}`
            }
            url = `${this.baseUrl}${url}`
        }
        return url
    }

    private async buildHeaders(initHeaders?: HeadersInit): Promise<Headers> {
        const headers = new Headers(initHeaders)
        headers.set('X-Requested-With', 'XMLHttpRequest')
        headers.set('Cache-Control', 'no-cache')

        if (this.useAuth) {
            // NextAuth v5 stores the JWT in next-auth.session-token (or
            // __Secure-next-auth.session-token on HTTPS). Use auth() to get the
            // session properly instead of reading the cookie name directly.
            const session = await auth()
            const accessToken = session?.user?.accessToken
            if (accessToken) {
                headers.set('Authorization', `Bearer ${accessToken}`)
            }
        }

        return headers
    }

    private async request<T = unknown>(
        method: string,
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        const url = await this.buildUrl(endpoint)
        const headers = await this.buildHeaders(options.headers)

        const response = await fetch(url, {
            ...options,
            method,
            headers,
            next: options.next ?? { revalidate: 3600 }, // Mặc định cache 1 giờ
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                message: response.statusText,
            }))
            throw new Error(errorData.message || `Request failed with ${response.status}`)
        }

        return response.json()
    }

    // Public methods
    get<T = unknown>(endpoint: string, options?: FetchOptions) {
        return this.request<T>('GET', endpoint, options)
    }

    post<T = unknown, D = unknown>(endpoint: string, data?: D, options?: FetchOptions) {
        return this.request<T>('POST', endpoint, {
            ...options,
            body: data ? JSON.stringify(data) : undefined,
            headers: {
                ...options?.headers,
                'Content-Type': 'application/json',
            },
        })
    }

    put<T = unknown, D = unknown>(endpoint: string, data?: D, options?: FetchOptions) {
        return this.request<T>('PUT', endpoint, {
            ...options,
            body: data ? JSON.stringify(data) : undefined,
            headers: {
                ...options?.headers,
                'Content-Type': 'application/json',
            },
        })
    }

    delete<T = unknown>(endpoint: string, options?: FetchOptions) {
        return this.request<T>('DELETE', endpoint, options)
    }
}
