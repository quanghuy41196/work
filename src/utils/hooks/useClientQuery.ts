'use client'
import clientApiService from '@/services/ClientApiService'
import {
    useMutation,
    UseMutationOptions,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'

/**
 * Hook cho các query (GET requests)
 */
export function useClientQuery<TData = unknown, TError = AxiosError>(
  queryKey: unknown[],
  endpoint: string,
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'> & {
    fetchOptions?: Parameters<typeof clientApiService.get>[1]
  }
) {
  const { fetchOptions, ...queryOptions } = options || {}

  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      return await clientApiService.get<TData>(endpoint, fetchOptions)
    },
    ...queryOptions,
  })
}

/**
 * Hook cho mutation POST
 */
export function useClientMutationPost<TData = unknown, TVariables = unknown, TError = AxiosError>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> & {
    fetchOptions?: Parameters<typeof clientApiService.post<TData, TVariables>>[2]
  }
) {
  const { fetchOptions, ...mutationOptions } = options || {}

  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      return await clientApiService.post<TData, TVariables>(endpoint, variables, fetchOptions)
    },
    ...mutationOptions,
  })
}

/**
 * Hook cho mutation PUT
 */
export function useClientMutationPut<TData = unknown, TVariables = unknown, TError = AxiosError>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> & {
    fetchOptions?: Parameters<typeof clientApiService.put<TData, TVariables>>[2]
  }
) {
  const { fetchOptions, ...mutationOptions } = options || {}

  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      return await clientApiService.put<TData, TVariables>(endpoint, variables, fetchOptions)
    },
    ...mutationOptions,
  })
}

/**
 * Hook cho mutation DELETE
 */
export function useClientMutationDelete<TData = unknown, TError = AxiosError>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, TError, void>, 'mutationFn'> & {
    fetchOptions?: Parameters<typeof clientApiService.delete>[1]
  }
) {
  const { fetchOptions, ...mutationOptions } = options || {}

  return useMutation<TData, TError, void>({
    mutationFn: async () => {
      return await clientApiService.delete<TData>(endpoint, fetchOptions)
    },
    ...mutationOptions,
  })
}

/**
 * Hook cho mutation UPLOAD (upload file hoặc blob)
 */
export function useClientMutationUpload<TData = unknown, TError = AxiosError>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, TError, { file: File | Blob; fieldName?: string }>, 'mutationFn'> & {
    fetchOptions?: Parameters<typeof clientApiService.upload>[3]
  }
) {
  const { fetchOptions, ...mutationOptions } = options || {}

  return useMutation<TData, TError, { file: File | Blob; fieldName?: string }>({
    mutationFn: async ({ file, fieldName = 'file' }) => {
      return await clientApiService.upload<TData>(endpoint, file, fieldName, fetchOptions)
    },
    ...mutationOptions,
  })
}

/**
 * Hook để vô hiệu hóa các query bằng query key hoặc prefix
 */
export function useInvalidateClientQueries() {
  const queryClient = useQueryClient()

  return {
    invalidateQueries: (queryKey: unknown[]) => {
      return queryClient.invalidateQueries({ queryKey })
    },
    invalidateQueriesWithPrefix: (prefix: unknown[]) => {
      return queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey as unknown[]
          if (queryKey.length < prefix.length) return false

          for (let i = 0; i < prefix.length; i++) {
            if (queryKey[i] !== prefix[i]) return false
          }

          return true
        },
      })
    },
  }
}
