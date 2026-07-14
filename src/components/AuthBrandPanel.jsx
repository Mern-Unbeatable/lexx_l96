import { Link } from 'react-router-dom'

const stats = [
  { value: '12,400+', label: 'Active Players' },
  { value: '840', label: 'Courses Listed' },
  { value: '238', label: 'Games Today' },
]

export default function AuthBrandPanel() {
  return (
    <aside className="relative hidden w-[48%] flex-col px-12 py-10 text-white lg:flex xl:px-16">
      <Link to="/" className="mt-10 flex items-center gap-4 xl:mt-14">
        <img
          src="/logo.png"
          alt=""
          className="h-14 w-auto object-contain drop-shadow-sm xl:h-16"
        />
        <span className="font-serif text-2xl font-semibold tracking-tight xl:text-3xl">
          Golf Links
        </span>
      </Link>

      <div className="flex flex-1 flex-col justify-center pb-16">
        <div className="max-w-[28rem]">
          <h1 className="font-serif text-5xl font-semibold leading-[1.15] tracking-tight xl:text-[3.5rem]">
            Golf on your own terms.
          </h1>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-white/80">
            Find solo golfers nearby who match your age group and handicap. No
            more awkward pairings — just great rounds.
          </p>
        </div>

        <div className="mt-16 grid max-w-lg grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-2xl font-semibold text-[#d4a017] xl:text-[1.75rem]">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs text-white/65">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/45">© 2026 Golf Links</p>
    </aside>
  )
}
