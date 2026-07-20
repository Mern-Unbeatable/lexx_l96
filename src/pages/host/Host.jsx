import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Swal from 'sweetalert2'
import { Calendar, Clock, ChevronDown, CircleAlert } from 'lucide-react'
import FormField from '../../components/form/FormField'
import CourseLocationField from '../../components/form/CourseLocationField'
import CourseSelect from '../../components/form/CourseSelect'
import { inputClass, inputErrorClass } from '../../components/form/formStyles'
import { hostSchema } from '../../schemas/formSchemas'
import { useAuth } from '../../context/AuthContext'
import { useCourseLocations } from '../../hooks/useCourseLocations'
import { useCreateGameMutation } from '../../hooks/useCreateGameMutation'
import { buildCreateGamePayload } from './utils/buildCreateGamePayload'
import { showErrorAlert } from '../../utils/toast'

const HostSignInRequired = () => (
  <div className="mx-auto flex min-h-[50vh] max-w-4xl flex-col items-center justify-center gap-4 px-4 text-center">
    <p className="text-muted">Sign in to host a game.</p>
    <Link
      to="/login"
      className="rounded-lg bg-forest px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#244a37]"
    >
      Sign In
    </Link>
  </div>
)

const Host = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const createGameMutation = useCreateGameMutation()

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(hostSchema),
    defaultValues: {
      course: '',
      location: '',
      date: '',
      time: '',
      spots: '',
      ageMin: '',
      ageMax: '',
      handicapMin: '',
      handicapMax: '',
      cost: '',
      notes: '',
    },
  })

  const selectedLocationName = watch('location')
  const locationsQuery = useCourseLocations(selectedCourseId)
  const courseLocations = locationsQuery.data ?? []
  const selectedLocation = useMemo(
    () =>
      courseLocations.find(
        (location) => location.displayName === selectedLocationName,
      ) ?? null,
    [courseLocations, selectedLocationName],
  )

  useEffect(() => {
    if (!selectedCourseId) return

    if (locationsQuery.isSuccess && courseLocations.length > 0) {
      setValue('location', courseLocations[0].displayName, {
        shouldValidate: true,
        shouldDirty: true,
      })
      return
    }

    if (locationsQuery.isSuccess && courseLocations.length === 0) {
      setValue('location', '', { shouldValidate: true })
    }
  }, [
    courseLocations,
    locationsQuery.isSuccess,
    selectedCourseId,
    setValue,
  ])

  const onSubmit = async (data) => {
    try {
      const payload = buildCreateGamePayload(data, selectedLocation)
      await createGameMutation.mutateAsync(payload)
      await Swal.fire({
        icon: 'success',
        title: 'Game posted!',
        text: 'Your game is now available for others to join.',
        confirmButtonText: 'View My Games',
        confirmButtonColor: '#2D6A4F',
      })
      navigate('/my-games')
    } catch (error) {
      await showErrorAlert(error?.message || 'Unable to post game')
    }
  }

  const handleCourseSelect = (course) => {
    setSelectedCourseId(course.id)
    setValue('location', '', { shouldValidate: false })
  }

  if (!isAuthenticated) return <HostSignInRequired />

  return (
    <div className="mx-auto w-full max-w-4xl overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">
          Host a Game
        </h1>
        <p className="mt-2 text-base text-muted sm:text-[15px]">
          Set up a round and find the right partners to join you on the links.
        </p>
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 border-l-4 border-amber-500 bg-amber-50 px-4 py-4 text-base leading-relaxed text-amber-700"
        >
          <CircleAlert
            size={16}
            strokeWidth={2}
            className="mt-0.5 shrink-0 text-amber-500"
            aria-hidden="true"
          />
          <p>
            <strong className="font-semibold">Important:</strong> Please ensure
            you have booked your appropriate tee times directly with your
            selected club. Hosting a game here does not reserve a tee time.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full min-w-0 space-y-5"
        noValidate
      >
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <FormField
            label="Course Name"
            htmlFor="course"
            error={errors.course?.message}
          >
            <Controller
              name="course"
              control={control}
              render={({ field }) => (
                <CourseSelect
                  id="course"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onSelectCourse={handleCourseSelect}
                  onBlur={field.onBlur}
                  error={errors.course?.message}
                />
              )}
            />
          </FormField>

          <FormField
            label="Location"
            htmlFor="location"
            error={errors.location?.message}
          >
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <CourseLocationField
                  id="location"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.location?.message}
                  locations={courseLocations}
                  loading={locationsQuery.isFetching}
                  placeholder={
                    selectedCourseId
                      ? 'Location will appear after course selection'
                      : 'Select a course first'
                  }
                />
              )}
            />
          </FormField>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Date" htmlFor="date" error={errors.date?.message}>
            <div className="relative w-full min-w-0">
              <input
                id="date"
                type="date"
                className={`${inputClass} relative pr-10 ${errors.date ? inputErrorClass : ''}`}
                {...register('date')}
              />
              <Calendar
                size={18}
                strokeWidth={1.75}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </FormField>
          <FormField label="Time" htmlFor="time" error={errors.time?.message}>
            <div className="relative w-full min-w-0">
              <input
                id="time"
                type="time"
                className={`${inputClass} relative pr-10 ${errors.time ? inputErrorClass : ''}`}
                {...register('time')}
              />
              <Clock
                size={18}
                strokeWidth={1.75}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </FormField>
        </div>

        <FormField label="Spots Available" htmlFor="spots" error={errors.spots?.message}>
          <div className="relative">
            <select
              id="spots"
              className={`${inputClass} appearance-none pr-10 ${errors.spots ? inputErrorClass : ''}`}
              {...register('spots')}
            >
              <option value="" disabled>
                Select spots
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            <ChevronDown
              size={18}
              strokeWidth={1.75}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
          </div>
          <p className="mt-1.5 text-xs text-muted">(excluding yourself)</p>
        </FormField>

        <div>
          <p className="mb-1.5 text-sm font-medium text-ink">Age Range</p>
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4">
            <FormField htmlFor="ageMin" error={errors.ageMin?.message}>
              <input
                id="ageMin"
                type="number"
                placeholder="Minimum age"
                className={`${inputClass} ${errors.ageMin ? inputErrorClass : ''}`}
                {...register('ageMin')}
              />
            </FormField>
            <FormField htmlFor="ageMax" error={errors.ageMax?.message}>
              <input
                id="ageMax"
                type="number"
                placeholder="Maximum age"
                className={`${inputClass} ${errors.ageMax ? inputErrorClass : ''}`}
                {...register('ageMax')}
              />
            </FormField>
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium text-ink">Handicap Range</p>
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4">
            <FormField htmlFor="handicapMin" error={errors.handicapMin?.message}>
              <input
                id="handicapMin"
                type="number"
                placeholder="Minimum handicap"
                className={`${inputClass} ${errors.handicapMin ? inputErrorClass : ''}`}
                {...register('handicapMin')}
              />
            </FormField>
            <FormField htmlFor="handicapMax" error={errors.handicapMax?.message}>
              <input
                id="handicapMax"
                type="number"
                placeholder="Maximum handicap"
                className={`${inputClass} ${errors.handicapMax ? inputErrorClass : ''}`}
                {...register('handicapMax')}
              />
            </FormField>
          </div>
        </div>

        <FormField label="Cost per Round" htmlFor="cost" error={errors.cost?.message}>
          <input
            id="cost"
            type="text"
            placeholder="e.g. £25 per person"
            className={`${inputClass} ${errors.cost ? inputErrorClass : ''}`}
            {...register('cost')}
          />
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Golfers arrange their own payments for green fees and extras. Golf
            Linking does not process or take responsibility for any transactions.
          </p>
        </FormField>

        <FormField label="Notes" htmlFor="notes" error={errors.notes?.message}>
          <textarea
            id="notes"
            rows={4}
            placeholder="e.g. Happy to share a buggy, prefer to walk, meeting at the pro shop 15 mins before..."
            className={`${inputClass} resize-y ${errors.notes ? inputErrorClass : ''}`}
            {...register('notes')}
          />
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting || createGameMutation.isPending}
          className="w-full rounded-lg bg-forest px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#244a37] active:scale-[0.99] disabled:opacity-60"
        >
          {isSubmitting || createGameMutation.isPending
            ? 'Posting…'
            : 'Post Game'}
        </button>
      </form>
    </div>
  )
}

export default Host
