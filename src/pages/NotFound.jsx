import { Link } from 'react-router-dom'

const NotFound = () => (
  <section>
    <h1 className="text-3xl font-semibold tracking-tight">404</h1>
    <p className="mt-3 text-slate-600">Page not found.</p>
    <Link to="/" className="mt-4 inline-block text-sky-600 hover:underline">
      Back to Home
    </Link>
  </section>
)

export default NotFound
