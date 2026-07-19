import { Link } from 'react-router-dom'

const stateContainerClass =
  'mx-auto flex min-h-[50vh] max-w-4xl flex-col items-center justify-center gap-4 px-4 text-center'

export const ProfileLoading = () => (
  <div className={stateContainerClass}>
    <p className="text-sm text-muted">Loading profile…</p>
  </div>
)

export const ProfileSignInRequired = () => (
  <div className={stateContainerClass}>
    <p className="text-muted">Sign in to view your profile.</p>
    <Link
      to="/login"
      className="rounded-lg bg-forest px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#244a37]"
    >
      Sign In
    </Link>
  </div>
)

export const ProfileLoadError = ({ error, onRetry }) => (
  <div className={stateContainerClass}>
    <p className="text-red-500">
      {error?.message || 'Unable to load your profile.'}
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="rounded-lg bg-forest px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#244a37]"
    >
      Try Again
    </button>
  </div>
)
