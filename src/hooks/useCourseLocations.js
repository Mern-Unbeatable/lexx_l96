import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { getCourseLocations } from '../services/coursesApi'

export const useCourseLocations = (courseId) =>
  useQuery({
    queryKey: queryKeys.courses.locations(courseId),
    queryFn: () => getCourseLocations(courseId),
    enabled: Boolean(courseId),
  })
