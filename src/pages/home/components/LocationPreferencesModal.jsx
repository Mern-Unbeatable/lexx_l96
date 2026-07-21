import { useEffect, useRef, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import LocationInput from '../../../components/form/LocationInput'
import FormField from '../../../components/form/FormField'
import { searchLocations } from '../../../services/locationApi'

const ENTER_MS = 20
const EXIT_MS = 280

const radiusOptions = [
  { value: '10', label: 'Within 10 km' },
  { value: '20', label: 'Within 20 km' },
  { value: '40', label: 'Within 40 km' },
  { value: '60', label: 'Within 60 km' },
  { value: '100', label: 'Within 100 km' },
]

const getLocationCoords = (location) => {
  if (!location) return null

  const latitude = location.latitude ?? location.lat
  const longitude = location.longitude ?? location.lon

  if (latitude == null || longitude == null) return null

  return { latitude, longitude }
}

const resolveLocationForSearch = async (query, selectedLocation) => {
  const trimmedQuery = query.trim()
  const selectionMatchesInput =
    selectedLocation?.displayName?.trim() === trimmedQuery

  if (selectionMatchesInput) {
    const coords = getLocationCoords(selectedLocation)
    if (coords) {
      return {
        ...coords,
        displayName: selectedLocation.displayName,
      }
    }
  }

  const results = await searchLocations(trimmedQuery, { limit: 1 })
  const match = results[0]
  const coords = getLocationCoords(match)

  if (!coords) return null

  return {
    ...coords,
    displayName: match.displayName || trimmedQuery,
  }
}

const formatRadiusLabel = (value) => {
  const match = radiusOptions.find((option) => option.value === String(value))
  if (match) return match.label
  const num = String(value).trim()
  if (!num) return ''
  return `Within ${num} km`
}

const RadiusDropdown = ({ id, value, onChange }) => {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(String(value ?? ''))
  const rootRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setDraft(String(value ?? ''))
  }, [value])

  useEffect(() => {
    const handleOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
        const cleaned = draft.replace(/\D/g, '')
        if (cleaned) onChange(cleaned)
        setDraft('')
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [draft, onChange])

  const commitDraft = () => {
    const cleaned = draft.replace(/\D/g, '')
    if (!cleaned) {
      setDraft('')
      return
    }
    onChange(cleaned)
    setDraft('')
  }

  const filteredOptions = radiusOptions.filter((option) => {
    const q = draft.trim().toLowerCase()
    if (!q) return true
    return (
      option.label.toLowerCase().includes(q) ||
      option.value.includes(q)
    )
  })

  return (
    <div ref={rootRef} className="relative">
      <div
        className={`flex overflow-hidden rounded-lg border bg-white transition focus-within:ring-2 ${
          open
            ? 'border-forest ring-2 ring-forest/15'
            : 'border-line focus-within:border-forest focus-within:ring-forest/15'
        }`}
      >
        <input
          id={id}
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          placeholder="e.g. 25"
          value={open ? draft : formatRadiusLabel(value) || draft}
          onFocus={() => {
            setDraft('')
            setOpen(true)
          }}
          onChange={(event) => {
            const next = event.target.value.replace(/[^\d]/g, '')
            setDraft(next)
            setOpen(true)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              commitDraft()
              setOpen(false)
              inputRef.current?.blur()
            }
            if (event.key === 'Escape') {
              setOpen(false)
              setDraft('')
            }
          }}
          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/70"
        />
        <button
          type="button"
          aria-label="Toggle radius suggestions"
          onClick={() => {
            if (open) {
              setOpen(false)
              setDraft('')
              return
            }
            setDraft('')
            setOpen(true)
            inputRef.current?.focus()
          }}
          className="inline-flex w-11 shrink-0 items-center justify-center border-l border-line bg-[#f3f4f6] text-muted transition hover:bg-[#e8eaed] hover:text-ink"
        >
          <ChevronDown
            size={18}
            strokeWidth={1.75}
            className={`transition duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {open && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-56 w-full overflow-auto rounded-lg border border-line bg-white py-1 shadow-[0_12px_28px_rgba(26,46,38,0.12)]"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-2.5 text-sm text-muted">
              {draft.trim()
                ? `Use custom: Within ${draft.replace(/\D/g, '') || '…'} km`
                : 'No suggestions'}
            </li>
          ) : (
            filteredOptions.map((option) => {
              const isActive = option.value === String(value)
              return (
                <li key={option.value} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      onChange(option.value)
                      setDraft('')
                      setOpen(false)
                    }}
                    className={`flex w-full px-4 py-2.5 text-left text-sm transition ${
                      isActive
                        ? 'bg-[#e8f0ea] font-medium text-forest'
                        : 'text-ink hover:bg-[#f5f5f5]'
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}

const LocationPreferencesModal = ({
  open,
  onClose,
  onApply,
  initialLocation = '',
  initialRadius = '',
  initialLatitude = null,
  initialLongitude = null,
}) => {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [location, setLocation] = useState(initialLocation)
  const [radius, setRadius] = useState(initialRadius)
  const [selectedLocation, setSelectedLocation] = useState(
    initialLatitude != null && initialLongitude != null
      ? {
          displayName: initialLocation,
          latitude: initialLatitude,
          longitude: initialLongitude,
        }
      : null,
  )
  const [locationError, setLocationError] = useState('')
  const [radiusError, setRadiusError] = useState('')
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    if (open) {
      setLocation(initialLocation)
      setRadius(initialRadius)
      setSelectedLocation(
        initialLatitude != null && initialLongitude != null
          ? {
              displayName: initialLocation,
              latitude: initialLatitude,
              longitude: initialLongitude,
            }
          : null,
      )
      setLocationError('')
      setRadiusError('')
      setMounted(true)
      const showTimer = window.setTimeout(() => setVisible(true), ENTER_MS)
      return () => window.clearTimeout(showTimer)
    }

    setVisible(false)
    const hideTimer = window.setTimeout(() => setMounted(false), EXIT_MS)
    return () => window.clearTimeout(hideTimer)
  }, [
    open,
    initialLocation,
    initialRadius,
    initialLatitude,
    initialLongitude,
  ])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!mounted) return null

  const handleApply = async () => {
    setLocationError('')
    setRadiusError('')

    if (!location.trim()) {
      setLocationError('Please enter a location or postcode')
      return
    }

    if (!radius) {
      setRadiusError('Please choose a search radius')
      return
    }

    setApplying(true)

    try {
      const resolved = await resolveLocationForSearch(location, selectedLocation)

      if (!resolved) {
        setLocationError('No location found. Try a different search term.')
        return
      }

      onApply?.({
        location: resolved.displayName,
        radius,
        latitude: resolved.latitude,
        longitude: resolved.longitude,
      })
      onClose()
    } catch (error) {
      setLocationError(error?.message || 'Unable to find that location.')
    } finally {
      setApplying(false)
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
        aria-labelledby="location-prefs-title"
        className={`relative z-10 w-full max-w-lg overflow-visible rounded-t-[1.35rem] border border-white/70 bg-white shadow-[0_24px_60px_rgba(26,46,38,0.22)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:rounded-[1.35rem] ${
          visible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-[0.97] sm:translate-y-4'
        }`}
      >
        <header className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <h2
            id="location-prefs-title"
            className="text-xl font-semibold tracking-tight text-ink"
          >
            Set Location Preferences
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-[#f5f5f5] hover:text-ink"
            aria-label="Close"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </header>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          <FormField
            label="Enter a Location or Postcode"
            htmlFor="prefs-location"
          >
            <LocationInput
              id="prefs-location"
              value={location}
              onChange={(value) => {
                setLocation(value)
                if (value.trim()) setLocationError('')
              }}
              onLocationSelect={setSelectedLocation}
              error={locationError}
              placeholder="e.g. London, SW1A 1AA"
            />
          </FormField>

          <FormField label="Search Radius" htmlFor="prefs-radius" error={radiusError}>
            <RadiusDropdown
              id="prefs-radius"
              value={radius}
              onChange={(value) => {
                setRadius(value)
                if (value) setRadiusError('')
              }}
            />
          </FormField>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-5 pb-5 sm:px-6 sm:pb-6">
          <button
            type="button"
            onClick={onClose}
            disabled={applying}
            className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-[#f5f5f5] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={applying}
            className="rounded-lg bg-forest px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#244a37] disabled:opacity-60"
          >
            {applying ? 'Applying…' : 'Apply Filter'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LocationPreferencesModal
