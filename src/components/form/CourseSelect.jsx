import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, LandPlot, Search } from 'lucide-react'
import { englandCourses, searchEnglandCourses } from '../../data/englandCourses'
import { inputClass, inputErrorClass } from './formStyles'

const CourseSelect = ({
  id,
  value = '',
  onChange,
  onSelectCourse,
  onBlur,
  error,
  name,
  placeholder = 'Select a course',
}) => {
  const listId = useId()
  const rootRef = useRef(null)
  const searchRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selected = useMemo(
    () => englandCourses.find((course) => course.name === value) ?? null,
    [value],
  )

  const options = useMemo(
    () => (query.trim() ? searchEnglandCourses(query, 200) : englandCourses),
    [query],
  )

  useEffect(() => {
    const handleOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      window.setTimeout(() => searchRef.current?.focus(), 0)
    }
  }, [open])

  const pick = (course) => {
    onChange?.(course.name)
    onSelectCourse?.(course)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
      <button
        id={id}
        type="button"
        name={name}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        onBlur={onBlur}
        className={`${inputClass} flex items-center justify-between gap-2 text-left ${
          error ? inputErrorClass : ''
        }`}
      >
        <span className={`min-w-0 truncate ${selected ? 'text-ink' : 'text-muted/70'}`}>
          {selected ? selected.name : placeholder}
        </span>
        <ChevronDown
          size={18}
          strokeWidth={1.75}
          className={`shrink-0 text-muted transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-lg border border-line bg-white shadow-[0_12px_28px_rgba(26,46,38,0.12)]">
          <div className="flex items-center gap-2 border-b border-line px-3 py-2">
            <Search size={15} strokeWidth={1.75} className="shrink-0 text-muted" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search England courses…"
              className="min-w-0 flex-1 border-0 bg-transparent py-1.5 text-sm text-ink outline-none placeholder:text-muted/70"
            />
          </div>

          <ul
            id={listId}
            role="listbox"
            className="max-h-64 overflow-auto py-1"
          >
            {options.length === 0 ? (
              <li className="px-3.5 py-3 text-sm text-muted">No courses found</li>
            ) : (
              options.map((course) => {
                const isActive = course.name === value
                return (
                  <li key={`${course.name}-${course.location}`} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => pick(course)}
                      className={`flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left transition hover:bg-[#e8f0ea] ${
                        isActive ? 'bg-[#e8f0ea]' : ''
                      }`}
                    >
                      <LandPlot
                        size={16}
                        strokeWidth={1.75}
                        className="mt-0.5 shrink-0 text-forest"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-ink">
                          {course.name}
                        </span>
                        <span className="block text-xs text-muted">
                          {course.location}
                        </span>
                      </span>
                      {isActive && (
                        <Check size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-forest" />
                      )}
                    </button>
                  </li>
                )
              })
            )}
          </ul>

          {/* <p className="border-t border-line px-3.5 py-2 text-[11px] text-muted">
            {options.length} of {englandCourses.length} England courses
          </p> */}
        </div>
      )}
    </div>
  )
}

export default CourseSelect
