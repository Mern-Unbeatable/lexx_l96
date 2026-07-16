import JoinRequestCard from './JoinRequestCard'

const PendingRequestsList = ({
  requests,
  acceptedIds,
  declinedIds,
  onAccept,
  onDecline,
  onOpenChat,
}) => {
  const visible = requests.filter((request) => !declinedIds?.has(request.id))

  return (
    <section className="mt-8">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">
        {visible.length} Pending Requests
      </p>
      <div className="mt-4 space-y-3">
        {visible.map((request) => (
          <JoinRequestCard
            key={request.id}
            request={request}
            accepted={acceptedIds?.has(request.id)}
            declined={declinedIds?.has(request.id)}
            onAccept={onAccept}
            onDecline={onDecline}
            onOpenChat={onOpenChat}
          />
        ))}
        {visible.length === 0 && (
          <div className="rounded-xl border border-line/80 bg-white px-5 py-8 text-center text-sm text-muted">
            No pending requests.
          </div>
        )}
      </div>
    </section>
  )
}

export default PendingRequestsList
