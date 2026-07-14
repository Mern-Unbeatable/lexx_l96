import JoinRequestCard from './JoinRequestCard'

const PendingRequestsList = ({ requests }) => (
  <section className="mt-8">
    <p className="text-xs font-medium uppercase tracking-wider text-muted">
      {requests.length} Pending Requests
    </p>
    <div className="mt-4 space-y-3">
      {requests.map((request) => (
        <JoinRequestCard key={request.id} request={request} />
      ))}
    </div>
  </section>
)

export default PendingRequestsList
