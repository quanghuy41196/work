import type { Route } from '@/@types/routes'
import appConfig from '@/configs/app.config'
import { protectedRoutes, publicRoutes } from '@/configs/routes.config'

const routes = { ...publicRoutes, ...protectedRoutes }
export function normalizeLocalePath(path: string, defaultLocale = appConfig.locale): string {
    const supportedLocales = appConfig.languageList.map(lang => lang.value)
    const maybeLocale = path.split('/')[1]

    const normalized = supportedLocales.includes(maybeLocale)
        ? path.replace(`/${maybeLocale}`, '')
        : path.replace(`/${defaultLocale}`, '')

    return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized
}
export const matchRoute = (path: string): Route | null => {
    const normalizedInputPath = normalizeLocalePath(path)
    const normalizedPath = normalizedInputPath.endsWith('/') ? normalizedInputPath.slice(0, -1) : normalizedInputPath

    if (routes[normalizedPath]) {
        return routes[normalizedPath]
    }

    const inputSegments = normalizedPath.split('/').filter(Boolean)

    let bestMatch: Route | null = null
    let highestMatchScore = -1

    for (const [routePath, route] of Object.entries(routes)) {
        if (!route.dynamicRoute) continue
        const routeSegments = routePath.split('/').filter(Boolean)

        if (routeSegments.length !== inputSegments.length) {
            continue
        }

        let matchScore = 0
        let isMatch = true

        for (let i = 0; i < routeSegments.length; i++) {
            const routeSegment = routeSegments[i]
            const inputSegment = inputSegments[i]

            if (routeSegment.startsWith('[') && routeSegment.endsWith(']')) {
                continue
            }

            if (routeSegment === inputSegment) {
                matchScore++
            } else {
                isMatch = false
                break
            }
        }

        if (isMatch && matchScore > highestMatchScore) {
            highestMatchScore = matchScore
            bestMatch = route
        }
    }

    return bestMatch
}

export default matchRoute
