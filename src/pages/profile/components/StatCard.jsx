const StatCard = ({ icon: Icon, value, label }) => (
  <div className="rounded-xl border border-line/80 bg-white p-5 shadow-[0_1px_2px_rgba(26,46,38,0.04)]">
    <div className="flex size-10 items-center justify-center rounded-lg bg-[#e8f0ea] text-forest">
      <Icon size={18} strokeWidth={1.75} />
    </div>
    <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">
      {value}
    </p>
    <p className="mt-1 text-base text-[#6B7280]">{label}</p>
  </div>
)

export default StatCard
