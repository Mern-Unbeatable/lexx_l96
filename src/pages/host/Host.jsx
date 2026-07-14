import { Search, Calendar, Clock, ChevronDown } from 'lucide-react'

const inputClass =
  'w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-forest focus:ring-2 focus:ring-forest/15'

const labelClass = 'mb-1.5 block text-base font-medium text-ink'

const Host = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-bold  text-ink sm:text-5xl">
          Host a Game
        </h1>
        <p className="mt-2 text-base text-muted sm:text-[15px]">
          Set up a round and find the right partners to join you on the links.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="course" className={labelClass}>
            Course
          </label>
          <div className="relative">
            <Search
              size={18}
              strokeWidth={1.75}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              id="course"
              name="course"
              type="search"
              required
              placeholder="Search courses in England..."
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className={labelClass}>
              Date
            </label>
            <div className="relative">
              <input
                id="date"
                name="date"
                type="date"
                required
                className={`${inputClass} relative pr-10`}
              />
              <Calendar
                size={18}
                strokeWidth={1.75}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>
          <div>
            <label htmlFor="time" className={labelClass}>
              Time
            </label>
            <div className="relative">
              <input
                id="time"
                name="time"
                type="time"
                required
                className={`${inputClass} relative pr-10`}
              />
              <Clock
                size={18}
                strokeWidth={1.75}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="spots" className={labelClass}>
            Spots Available
          </label>
          <div className="relative">
            <select
              id="spots"
              name="spots"
              required
              defaultValue=""
              className={`${inputClass} appearance-none pr-10`}
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
        </div>

        <div>
          <label className={labelClass}>Age Range</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="ageMin"
              type="number"
              min={1}
              max={120}
              defaultValue={18}
              placeholder="18"
              className={inputClass}
            />
            <input
              name="ageMax"
              type="number"
              min={1}
              max={120}
              defaultValue={70}
              placeholder="70"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Handicap Range</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="handicapMin"
              type="number"
              min={0}
              max={54}
              defaultValue={0}
              placeholder="0"
              className={inputClass}
            />
            <input
              name="handicapMax"
              type="number"
              min={0}
              max={54}
              defaultValue={36}
              placeholder="36"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="cost" className={labelClass}>
            Cost per Round
          </label>
          <input
            id="cost"
            name="cost"
            type="text"
            placeholder="e.g. £25 per person"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="notes" className={labelClass}>
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="e.g. Happy to share a buggy, prefer to walk, meeting at the pro shop 15 mins before..."
            className={`${inputClass} resize-y`}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-forest px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#244a37] active:scale-[0.99]"
        >
          Post Game
        </button>
      </form>
    </div>
  )
}

export default Host
