import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import FormField from './form/FormField'
import { inputClass, inputErrorClass } from './form/formStyles'
import { submitContactForm } from '../services/contactApi'
import { showErrorToast, showSuccessToast } from '../utils/toast'

const ENTER_MS = 20
const EXIT_MS = 280

const EMPTY_FORM = {
  name: '',
  email: '',
  message: '',
}

const ContactModal = ({ open, onClose }) => {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM)
      setErrors({})
      setSubmitting(false)
      setMounted(true)
      const showTimer = window.setTimeout(() => setVisible(true), ENTER_MS)
      return () => window.clearTimeout(showTimer)
    }

    setVisible(false)
    const hideTimer = window.setTimeout(() => setMounted(false), EXIT_MS)
    return () => window.clearTimeout(hideTimer)
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!mounted) return null

  const updateField = (field) => (event) => {
    const value = event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const nextErrors = {}
    const name = form.name.trim()
    const email = form.email.trim()
    const message = form.message.trim()

    if (!name) nextErrors.name = 'Name is required'
    if (!email) nextErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Please enter a valid email address'
    }
    if (!message) nextErrors.message = 'Message is required'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await submitContactForm({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      })
      showSuccessToast('Your message has been sent successfully.')
      onClose()
    } catch (error) {
      showErrorToast(error?.message || 'Unable to send your message. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
        aria-labelledby="contact-title"
        className={`relative z-10 w-full max-w-lg overflow-hidden rounded-t-[1.35rem] border border-white/70 bg-white shadow-[0_24px_60px_rgba(26,46,38,0.22)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:rounded-[1.35rem] ${
          visible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-[0.97] sm:translate-y-4'
        }`}
      >
        <header className="flex items-start justify-between gap-3 border-b border-line/70 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="contact-title"
              className="text-xl font-semibold tracking-tight text-ink"
            >
              Contact Us
            </h2>
            <p className="mt-1 text-sm text-muted">
              Send us a message and we will get back to you.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-[#f5f5f5] hover:text-ink"
            aria-label="Close"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 px-5 py-5 sm:px-6">
            <FormField label="Name" htmlFor="contact-name" error={errors.name}>
              <input
                id="contact-name"
                type="text"
                value={form.name}
                onChange={updateField('name')}
                autoComplete="name"
                className={`${inputClass} ${errors.name ? inputErrorClass : ''}`}
              />
            </FormField>

            <FormField label="Email" htmlFor="contact-email" error={errors.email}>
              <input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={updateField('email')}
                autoComplete="email"
                className={`${inputClass} ${errors.email ? inputErrorClass : ''}`}
              />
            </FormField>

            <FormField
              label="Message"
              htmlFor="contact-message"
              error={errors.message}
            >
              <textarea
                id="contact-message"
                rows={4}
                value={form.message}
                onChange={updateField('message')}
                className={`${inputClass} resize-y ${errors.message ? inputErrorClass : ''}`}
              />
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-line/70 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-[#f5f5f5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-forest px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#244a37] disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactModal
