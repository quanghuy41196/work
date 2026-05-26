import appConfig from '@/configs/app.config';
import { defineRouting } from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: appConfig?.languageList?.map(lang=>lang?.value),
 
  // Used when no locale matches
  defaultLocale: appConfig?.locale
});