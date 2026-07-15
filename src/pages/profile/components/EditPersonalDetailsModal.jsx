import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import FormField from '../../../components/form/FormField'
import { inputClass, inputErrorClass } from '../../../components/form/formStyles'
import { editPersonalDetailsSchema } from '../../../schemas/formSchemas'

const ENTER_MS = 20
const EXIT_MS = 280

const EditPersonalDetailsModal = ({ open, profile, onClose, onSave }) => {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editPersonalDetailsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      homeCourse: '',
      about: '',
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        homeCourse: profile.homeCourse,
        about: profile.about,
      })
      setMounted(true)
      const showTimer = window.setTimeout(() => setVisible(true), ENTER_MS)
      return () => window.clearTimeout(showTimer)
    }

    setVisible(false)
    const hideTimer = window.setTimeout(() => setMounted(false), EXIT_MS)
    return () => window.clearTimeout(hideTimer)
  }, [open, profile, reset])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!mounted) return null

  const onSubmit = async (data) => {
    await onSave?.(data)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className={`absolute inset-0 bg-ink/45 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Close modal"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className={`relative z-10 flex max-h-[min(40rem,94vh)] w-full max-w-xl flex-col overflow-hidden rounded-t-[1.35rem] border border-white/70 bg-white shadow-[0_24px_60px_rgba(26,46,38,0.22)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:rounded-[1.35rem] ${
          visible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-[0.97] sm:translate-y-4'
        }`}
      >
        <header className="flex items-start justify-between gap-3 border-b border-line/70 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="edit-profile-title"
              className="font-serif text-2xl font-semibold tracking-tight text-ink"
            >
              Edit Personal Details
            </h2>
            <p className="mt-1 text-sm text-muted">
              Update your contact and profile information.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-cream text-muted transition hover:bg-[#ebe8e1] hover:text-ink"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
          noValidate
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="First name"
                htmlFor="firstName"
                error={errors.firstName?.message}
              >
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  className={`${inputClass} ${errors.firstName ? inputErrorClass : ''}`}
                  {...register('firstName')}
                />
              </FormField>
              <FormField
                label="Last name"
                htmlFor="lastName"
                error={errors.lastName?.message}
              >
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  className={`${inputClass} ${errors.lastName ? inputErrorClass : ''}`}
                  {...register('lastName')}
                />
              </FormField>
            </div>

            <FormField
              label="Email"
              htmlFor="email"
              error={errors.email?.message}
            >
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`${inputClass} ${errors.email ? inputErrorClass : ''}`}
                {...register('email')}
              />
            </FormField>

            <FormField
              label="Phone"
              htmlFor="phone"
              error={errors.phone?.message}
            >
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                className={`${inputClass} ${errors.phone ? inputErrorClass : ''}`}
                {...register('phone')}
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Location"
                htmlFor="location"
                error={errors.location?.message}
              >
                <input
                  id="location"
                  type="text"
                  autoComplete="address-level2"
                  className={`${inputClass} ${errors.location ? inputErrorClass : ''}`}
                  {...register('location')}
                />
              </FormField>
              <FormField
                label="Home course"
                htmlFor="homeCourse"
                error={errors.homeCourse?.message}
              >
                <input
                  id="homeCourse"
                  type="text"
                  className={`${inputClass} ${errors.homeCourse ? inputErrorClass : ''}`}
                  {...register('homeCourse')}
                />
              </FormField>
            </div>

            <FormField
              label="About"
              htmlFor="about"
              error={errors.about?.message}
            >
              <textarea
                id="about"
                rows={4}
                className={`${inputClass} resize-y ${errors.about ? inputErrorClass : ''}`}
                {...register('about')}
              />
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-line/70 bg-white px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-[#f5f5f5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-forest px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#244a37] disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPersonalDetailsModal
