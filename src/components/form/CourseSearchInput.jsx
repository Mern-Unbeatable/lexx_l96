import { useEffect, useId, useRef, useState } from 'react'
import { LandPlot, Loader2 } from 'lucide-react'
import { searchEnglandCourses } from '../../data/englandCourses'

const CourseSearchInput = ({
  id,
  value = '',
  onChange,
  onSelectCourse,
  onBlur,
  error,
  placeholder = 'e.g. Sunningdale Golf Club',
  name,
}) => {
  const listId = useId()
  const rootRef = useRef(null)
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

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
      setLoading(false)
      return undefined
    }

    setLoading(true)
    const timer = window.setTimeout(() => {
      setSuggestions(searchEnglandCourses(q))
      setOpen(true)
      setLoading(false)
    }, 200)

    return () => window.clearTimeout(timer)
  }, [query])

  const emitChange = (next) => {
    setQuery(next)
    onChange?.(next)
  }

  const pick = (course) => {
    emitChange(course.name)
    onSelectCourse?.(course)
    setSuggestions([])
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <div
        className={`flex overflow-hidden rounded-lg border bg-white transition focus-within:ring-2 ${
          error
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
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listId}
          placeholder={placeholder}
          value={query}
          onChange={(event) => emitChange(event.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true)
          }}
          onBlur={onBlur}
          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/70"
        />
        {loading && (
          <span className="inline-flex items-center pr-3 text-muted">
            <Loader2 size={16} className="animate-spin" />
          </span>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-64 w-full overflow-auto rounded-lg border border-line bg-white py-1 shadow-[0_12px_28px_rgba(26,46,38,0.12)]"
        >
          {suggestions.map((course) => (
            <li key={`${course.name}-${course.location}`} role="option">
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(course)}
                className="flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left transition hover:bg-[#e8f0ea]"
              >
                <LandPlot
                  size={16}
                  strokeWidth={1.75}
                  className="mt-0.5 shrink-0 text-forest"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-ink">
                    {course.name}
                  </span>
                  <span className="block text-xs text-muted">{course.location}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CourseSearchInput
