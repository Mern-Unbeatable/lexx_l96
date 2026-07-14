import { labelClass, errorClass } from './formStyles'

const FormField = ({ label, htmlFor, error, children }) => (
  <div>
    {label && (
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
    )}
    {children}
    {error && <p className={errorClass}>{error}</p>}
  </div>
)

export default FormField
