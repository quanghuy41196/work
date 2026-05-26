import { getLocale } from '@/server/actions/locale';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    let locale = await getLocale()
    locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;
    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,

        getMessageFallback({ key }) {
            return key
        },
        onError(error) {
            if (error.code === 'MISSING_MESSAGE') {
                // Tắt log lỗi cho key bị thiếu để không làm phiền console
                // console.error(error); // Bật nếu muốn debug
            } else {
                console.error(error);
            }
        },

        onMissingKey(key: string) {
            return key;
        },

    }
})
