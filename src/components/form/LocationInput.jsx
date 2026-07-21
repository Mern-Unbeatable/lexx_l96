import { useEffect, useId, useRef, useState } from 'react'
import { Loader2, LocateFixed, MapPin } from 'lucide-react'
import {
  fetchLocationSuggestions,
  getCurrentPosition,
  reverseGeocodeLocation,
} from '../../services/locationApi'

const LocationInput = ({
  id,
  value = '',
  onChange,
  onLocationSelect,
  onBlur,
  error,
  placeholder = 'e.g. London, SW1A 1AA',
  name,
  showLocateButton = true,
}) => {
  const listId = useId()
  const rootRef = useRef(null)
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [loadingSuggest, setLoadingSuggest] = useState(false)
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState('')

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    const handleOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setSuggestions([])
      setLoadingSuggest(false)
      return undefined
    }

    let cancelled = false
    setLoadingSuggest(true)
    const timer = window.setTimeout(async () => {
      try {
        const results = await fetchLocationSuggestions(q)
        if (!cancelled) {
          setSuggestions(results)
          setOpen(true)
        }
      } catch {
        if (!cancelled) setSuggestions([])
      } finally {
        if (!cancelled) setLoadingSuggest(false)
      }
    }, 250)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query])

  const emitChange = (next, location = null) => {
    setQuery(next)
    onChange?.(next)
    onLocationSelect?.(location)
    setGeoError('')
  }

  const pickSuggestion = (location) => {
    emitChange(location.displayName, location)
    setSuggestions([])
    setOpen(false)
  }

  const handleLocate = async () => {
    if (locating) return
    setLocating(true)
    setGeoError('')
    setOpen(false)

    try {
      const coords = await getCurrentPosition()
      const location = await reverseGeocodeLocation(coords.lat, coords.lng)
      if (!location?.displayName) {
        throw new Error('Unable to resolve your location')
      }
      emitChange(location.displayName, location)
      setSuggestions([])
    } catch (err) {
      setGeoError(err?.message || 'Unable to retrieve your location')
    } finally {
      setLocating(false)
    }
  }

  const showError = geoError || error

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
      <div
        className={`flex w-full min-w-0 overflow-hidden rounded-lg border bg-white transition focus-within:ring-2 ${
          showError
            ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-400/20'
            : 'border-line focus-within:border-forest focus-within:ring-forest/15'
        }`}
      >
        <input
          id={id}
          name={name}
          type="text"
          autoComplete="off"
          role="combobox"
          aria-expanded={open && (suggestions.length > 0 || loadingSuggest)}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder={placeholder}
          value={query}
          onChange={(event) => emitChange(event.target.value, null)}
          onFocus={() => {
            if (query.trim().length >= 2) setOpen(true)
          }}
          onBlur={onBlur}
          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/70"
        />

        {showLocateButton && (
          <button
            type="button"
            onClick={handleLocate}
            disabled={locating}
            title="Use current location"
            aria-label="Use current location"
            className="inline-flex w-12 shrink-0 items-center justify-center border-l border-line bg-[#f3f4f6] text-muted transition hover:bg-[#e8eaed] hover:text-ink disabled:opacity-60"
          >
            {locating ? (
              <Loader2 size={18} strokeWidth={1.75} className="animate-spin" />
            ) : (
              <LocateFixed size={18} strokeWidth={1.75} />
            )}
          </button>
        )}
      </div>

      {open && (suggestions.length > 0 || loadingSuggest) && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-56 w-full overflow-auto rounded-lg border border-line bg-white py-1 shadow-[0_12px_28px_rgba(26,46,38,0.12)]"
        >
          {loadingSuggest && suggestions.length === 0 ? (
            <li className="px-3.5 py-2.5 text-sm text-muted">Searching…</li>
          ) : suggestions.length === 0 ? (
            <li className="px-3.5 py-2.5 text-sm text-muted">No locations found</li>
          ) : (
            suggestions.map((item) => (
              <li key={item.placeId ?? item.displayName} role="option">
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => pickSuggestion(item)}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-ink transition hover:bg-[#e8f0ea]"
                >
                  <MapPin
                    size={15}
                    strokeWidth={1.75}
                    className="shrink-0 text-muted"
                  />
                  <span>{item.displayName}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {showError && (
        <p className="mt-1.5 text-sm text-red-500">{showError}</p>
      )}
    </div>
  )
}

export default LocationInput
