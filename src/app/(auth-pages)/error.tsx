'use client'

import { useEffect } from 'react'

export default function AuthError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        if (error.digest) console.error('[AuthError]', error.digest)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
            <h2 className="text-2xl font-semibold">Something went wrong</h2>
            <p className="text-sm text-gray-500">
                An unexpected error occurred. Please try again.
            </p>
            <button
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={reset}
            >
                Try again
            </button>
        </div>
    )
}
