const Detail = ({ label, value, valueClassName = 'text-ink' }) => (
  <div>
    <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
      {label}
    </p>
    <p className={`mt-1 text-sm font-medium sm:text-[15px] ${valueClassName}`}>
      {value}
    </p>
  </div>
)

export default Detail
