import { useEffect, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { getCourses } from '../services/coursesApi'

const useDebouncedValue = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])

  return debounced
}

export const useCourses = (search = '', { enabled = true } = {}) => {
  const debouncedSearch = useDebouncedValue(search.trim(), 300)

  return useQuery({
    queryKey: queryKeys.courses.list(debouncedSearch),
    queryFn: () => getCourses(debouncedSearch),
    enabled,
    placeholderData: keepPreviousData,
  })
}
