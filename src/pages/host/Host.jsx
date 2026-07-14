import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, Calendar, Clock, ChevronDown } from 'lucide-react'
import FormField from '../../components/form/FormField'
import { inputClass, inputErrorClass } from '../../components/form/formStyles'
import { hostSchema } from '../../schemas/formSchemas'

const Host = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(hostSchema),
    defaultValues: {
      course: '',
      date: '',
      time: '',
      spots: '',
      ageMin: 18,
      ageMax: 70,
      handicapMin: 0,
      handicapMax: 36,
      cost: '',
      notes: '',
    },
  })

  const onSubmit = (data) => {
    console.log('Host form:', data)
    navigate('/my-games')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">
          Host a Game
        </h1>
        <p className="mt-2 text-base text-muted sm:text-[15px]">
          Set up a round and find the right partners to join you on the links.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField label="Course" htmlFor="course" error={errors.course?.message}>
          <div className="relative">
            <Search
              size={18}
              strokeWidth={1.75}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              id="course"
              type="search"
              placeholder="Search courses in England..."
              className={`${inputClass} pl-10 ${errors.course ? inputErrorClass : ''}`}
              {...register('course')}
            />
          </div>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date" htmlFor="date" error={errors.date?.message}>
            <div className="relative">
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
            <div className="relative">
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
          <div className="grid grid-cols-2 gap-4">
            <FormField htmlFor="ageMin" error={errors.ageMin?.message}>
              <input
                id="ageMin"
                type="number"
                placeholder="18"
                className={`${inputClass} ${errors.ageMin ? inputErrorClass : ''}`}
                {...register('ageMin')}
              />
            </FormField>
            <FormField htmlFor="ageMax" error={errors.ageMax?.message}>
              <input
                id="ageMax"
                type="number"
                placeholder="70"
                className={`${inputClass} ${errors.ageMax ? inputErrorClass : ''}`}
                {...register('ageMax')}
              />
            </FormField>
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium text-ink">Handicap Range</p>
          <div className="grid grid-cols-2 gap-4">
            <FormField htmlFor="handicapMin" error={errors.handicapMin?.message}>
              <input
                id="handicapMin"
                type="number"
                placeholder="0"
                className={`${inputClass} ${errors.handicapMin ? inputErrorClass : ''}`}
                {...register('handicapMin')}
              />
            </FormField>
            <FormField htmlFor="handicapMax" error={errors.handicapMax?.message}>
              <input
                id="handicapMax"
                type="number"
                placeholder="36"
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
          disabled={isSubmitting}
          className="w-full rounded-lg bg-forest px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#244a37] active:scale-[0.99] disabled:opacity-60"
        >
          Post Game
        </button>
      </form>
    </div>
  )
}

export default Host
