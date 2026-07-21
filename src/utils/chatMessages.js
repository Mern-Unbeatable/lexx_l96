export const upsertChatMessage = (messages, incoming) => {
  const exists = messages.some((message) => message.id === incoming.id)

  const next = exists
    ? messages.map((message) =>
        message.id === incoming.id ? { ...message, ...incoming } : message,
      )
    : [...messages, incoming]

  return next.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
}

export const isMessageMine = (message, currentUserId) =>
  message.sender?.id === currentUserId
