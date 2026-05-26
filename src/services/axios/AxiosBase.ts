import appConfig from '@/configs/app.config'
import type { AxiosError } from 'axios'
import axios from 'axios'
import AxiosRequestIntrceptorConfigCallback from './AxiosRequestIntrceptorConfigCallback'
import AxiosResponseIntrceptorErrorCallback from './AxiosResponseIntrceptorErrorCallback'

const AxiosBase = axios.create({
    timeout: 60000,
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL + appConfig.apiPrefix,
    withCredentials: true,
})

AxiosBase.interceptors.request.use(
    AxiosRequestIntrceptorConfigCallback,
    (error) => Promise.reject(error),
)

AxiosBase.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        AxiosResponseIntrceptorErrorCallback(error)
        return Promise.reject(error)
    },
)

export default AxiosBase
