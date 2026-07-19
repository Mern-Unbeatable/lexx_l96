import { Info } from 'lucide-react'

const PaymentInfoBox = () => (
  <aside
    role="note"
    className="flex gap-3 rounded-xl border border-forest/20 bg-[#e8f0ea] px-4 py-3.5 sm:px-5 sm:py-4"
  >
    <Info
      size={20}
      strokeWidth={1.75}
      className="mt-0.5 shrink-0 text-forest"
      aria-hidden="true"
    />
    <p className="text-sm leading-relaxed text-ink/85 sm:text-[15px]">
      Golfers are responsible for organising their own payments for green fees,
      buggies, and any other costs. Golf Linking is not responsible for any
      transactions between players.
    </p>
  </aside>
)

export default PaymentInfoBox
