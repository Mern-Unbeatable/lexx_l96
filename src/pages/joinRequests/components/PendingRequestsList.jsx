import JoinRequestCard from './JoinRequestCard'

const PendingRequestsList = ({
  requests,
  acceptedIds,
  onAccept,
  onDecline,
  onOpenChat,
}) => (
  <section className="mt-8">
    <p className="text-xs font-medium uppercase tracking-wider text-muted">
      {requests.length} Pending Requests
    </p>
    <div className="mt-4 space-y-3">
      {requests.map((request) => (
        <JoinRequestCard
          key={request.id}
          request={request}
          accepted={acceptedIds?.has(request.id)}
          onAccept={onAccept}
          onDecline={onDecline}
          onOpenChat={onOpenChat}
        />
      ))}
    </div>
  </section>
)

export default PendingRequestsList
