import type { AxiosError } from 'axios'
import { logger } from '@/utils/logger'

const AxiosResponseIntrceptorErrorCallback = (error: AxiosError) => {
    logger.error('Axios response error', { message: error.message, code: error.code }, 'Axios')
}

export default AxiosResponseIntrceptorErrorCallback
