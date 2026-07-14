const Detail = ({ label, value, valueClassName = 'text-[#122424]' }) => (
  <div>
    <p className="text-sm font-medium uppercase tracking-wide text-muted">
      {label}
    </p>
    <p className={`mt-1  font-medium text-base ${valueClassName}`}>
      {value}
    </p>
  </div>
)

export default Detail
