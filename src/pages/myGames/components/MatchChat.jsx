import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, MessageCircle, MoreVertical, Pencil, Send, Trash2, X } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import { useSocket } from '../../../context/SocketContext'
import {
  findConversation,
  getConversationMessages,
} from '../../../services/chatApi'
import { isMessageMine, upsertChatMessage } from '../../../utils/chatMessages'

const ENTER_MS = 20
const EXIT_MS = 280
const TYPING_DEBOUNCE_MS = 1200
const MESSAGE_MENU_HEIGHT = 46
const MESSAGE_MENU_WIDTH = 82
const MESSAGE_MENU_GAP = 6

const formatMessageTime = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const MatchChat = ({ open, onClose, player, game, conversationId: initialConversationId }) => {
  const { user } = useAuth()
  const { socket } = useSocket()
  const currentUserId = user?.id

  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState([])
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [activePlayer, setActivePlayer] = useState(null)
  const [activeGame, setActiveGame] = useState(null)
  const [conversationId, setConversationId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [roomJoined, setRoomJoined] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [menuState, setMenuState] = useState(null)
  const [socketError, setSocketError] = useState('')

  const endRef = useRef(null)
  const inputRef = useRef(null)
  const menuRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const typingTimerRef = useRef(null)
  const sessionKeyRef = useRef(null)

  useEffect(() => {
    if (open && player && game) {
      setActivePlayer(player)
      setActiveGame(game)
      setMounted(true)
      const showTimer = window.setTimeout(() => setVisible(true), ENTER_MS)
      return () => window.clearTimeout(showTimer)
    }

    setVisible(false)
    const hideTimer = window.setTimeout(() => {
      setMounted(false)
      setActivePlayer(null)
      setActiveGame(null)
    }, EXIT_MS)
    return () => window.clearTimeout(hideTimer)
  }, [open, player, game])

  const leaveConversationRoom = useCallback(() => {
    if (!socket || !conversationId) return
    socket.emit('typing_stop', { conversationId })
    socket.emit('leave_conversation', { conversationId })
  }, [socket, conversationId])

  const stopTyping = useCallback(() => {
    if (!socket || !conversationId) return
    window.clearTimeout(typingTimerRef.current)
    socket.emit('typing_stop', { conversationId })
  }, [socket, conversationId])

  const handleClose = useCallback(() => {
    leaveConversationRoom()
    setOtherUserTyping(false)
    setRoomJoined(false)
    setConversationId(null)
    setMessages([])
    setDraft('')
    setLoadError('')
    setSocketError('')
    setEditingMessageId(null)
    setMenuState(null)
    onClose?.()
  }, [leaveConversationRoom, onClose])

  useEffect(() => {
    if (!open || !player || !game) return undefined

    const gameId = game.id || game.gameId
    const key = `${player.id}-${gameId}`
    if (sessionKeyRef.current !== key) {
      sessionKeyRef.current = key
      setDraft('')
      setMessages([])
      setLoadError('')
      setSocketError('')
      setRoomJoined(false)
      setOtherUserTyping(false)
      setEditingMessageId(null)
      setMenuState(null)
    }

    let cancelled = false

    const loadConversation = async () => {
      setLoading(true)
      setLoadError('')

      try {
        let resolvedId = initialConversationId ?? null

        if (!resolvedId) {
          const conversation = await findConversation({
            gameId: game.id || game.gameId,
            otherUserId: player.id,
          })
          resolvedId = conversation?.id ?? null
        }

        if (cancelled) return

        if (!resolvedId) {
          setConversationId(null)
          setLoadError(
            'Chat is available after the host accepts the join request.',
          )
          return
        }

        setConversationId(resolvedId)
        const history = await getConversationMessages(resolvedId, { limit: 100 })
        if (!cancelled) {
          setMessages(history)
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error?.message || 'Unable to open chat.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadConversation()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 320)

    return () => {
      cancelled = true
      document.body.style.overflow = previousOverflow
      window.clearTimeout(focusTimer)
    }
  }, [open, player, game, initialConversationId])

  useEffect(() => {
    if (!socket || !conversationId || !open) return undefined

    setRoomJoined(false)
    socket.emit('join_conversation', { conversationId })

    const handleJoined = ({ conversationId: joinedId }) => {
      if (joinedId === conversationId) {
        setRoomJoined(true)
      }
    }

    const handleSocketError = (payload) => {
      setSocketError(payload?.message || 'Chat error')
    }

    const handleConnect = () => {
      socket.emit('join_conversation', { conversationId })
    }

    socket.on('joined_conversation', handleJoined)
    socket.on('error', handleSocketError)
    socket.on('connect', handleConnect)

    return () => {
      socket.off('joined_conversation', handleJoined)
      socket.off('error', handleSocketError)
      socket.off('connect', handleConnect)
    }
  }, [socket, conversationId, open])

  const markIncomingAsSeen = useCallback(
    (messageList) => {
      if (!socket || !conversationId || !currentUserId) return

      const unseenIncomingIds = messageList
        .filter(
          (message) =>
            message.sender?.id !== currentUserId &&
            !message.isSeen &&
            !message.isDeleted,
        )
        .map((message) => message.id)

      if (unseenIncomingIds.length > 0) {
        socket.emit('mark_seen', {
          conversationId,
          messageIds: unseenIncomingIds,
        })
      }
    },
    [socket, conversationId, currentUserId],
  )

  useEffect(() => {
    if (!socket || !conversationId || !open || !currentUserId) return undefined

    const activeConversationId = conversationId

    const handleNewMessage = (message) => {
      if (message.conversationId !== activeConversationId) return

      setMessages((current) => upsertChatMessage(current, message))

      if (message.sender?.id !== currentUserId) {
        socket.emit('mark_seen', {
          conversationId: activeConversationId,
          messageIds: [message.id],
        })
      }
    }

    const handleEdited = (message) => {
      if (message.conversationId !== activeConversationId) return
      setMessages((current) => upsertChatMessage(current, message))
    }

    const handleDeleted = (message) => {
      if (message.conversationId !== activeConversationId) return
      setMessages((current) => upsertChatMessage(current, message))
    }

    const handleTyping = (payload) => {
      if (
        payload.conversationId === activeConversationId &&
        payload.userId !== currentUserId
      ) {
        setOtherUserTyping(payload.isTyping)
      }
    }

    const handleSeen = (payload) => {
      if (
        payload.conversationId !== activeConversationId ||
        payload.userId === currentUserId
      ) {
        return
      }

      setMessages((current) =>
        current.map((message) =>
          payload.messageIds.includes(message.id)
            ? { ...message, isSeen: true }
            : message,
        ),
      )
    }

    socket.on('new_message', handleNewMessage)
    socket.on('message_edited', handleEdited)
    socket.on('message_deleted', handleDeleted)
    socket.on('user_typing', handleTyping)
    socket.on('messages_seen', handleSeen)

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.off('message_edited', handleEdited)
      socket.off('message_deleted', handleDeleted)
      socket.off('user_typing', handleTyping)
      socket.off('messages_seen', handleSeen)
    }
  }, [socket, conversationId, open, currentUserId])

  useEffect(() => {
    if (!roomJoined || messages.length === 0) return
    markIncomingAsSeen(messages)
  }, [roomJoined, messages, markIncomingAsSeen])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, otherUserTyping])

  useEffect(() => {
    if (!open) {
      leaveConversationRoom()
    }
  }, [open, leaveConversationRoom])

  useEffect(() => {
    if (!menuState) return undefined

    const handlePointerDown = (event) => {
      if (menuRef.current?.contains(event.target)) return
      if (event.target.closest('[data-message-menu-trigger]')) return
      setMenuState(null)
    }

    const container = messagesContainerRef.current
    const handleScroll = () => setMenuState(null)

    const listenerTimer = window.setTimeout(() => {
      document.addEventListener('pointerdown', handlePointerDown)
    }, 0)

    container?.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.clearTimeout(listenerTimer)
      document.removeEventListener('pointerdown', handlePointerDown)
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [menuState])

  if (!mounted || !activePlayer || !activeGame) return null

  const handleDraftChange = (value) => {
    setDraft(value)
    if (!socket || !conversationId || !roomJoined || editingMessageId) return

    socket.emit('typing_start', { conversationId })
    window.clearTimeout(typingTimerRef.current)
    typingTimerRef.current = window.setTimeout(() => {
      socket.emit('typing_stop', { conversationId })
    }, TYPING_DEBOUNCE_MS)
  }

  const sendMessage = () => {
    const content = draft.trim()
    if (!content || !socket || !conversationId || !roomJoined) return

    socket.emit('send_message', { conversationId, content })
    stopTyping()
    setDraft('')
  }

  const closeMessageMenu = () => setMenuState(null)

  const openMessageMenu = (message, event) => {
    if (menuState?.messageId === message.id) {
      closeMessageMenu()
      return
    }

    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const bounds = messagesContainerRef.current?.getBoundingClientRect()
    const spaceAbove = bounds ? rect.top - bounds.top : rect.top
    const spaceBelow = bounds
      ? bounds.bottom - rect.bottom
      : window.innerHeight - rect.bottom

    const openBelow =
      spaceBelow >= MESSAGE_MENU_HEIGHT + MESSAGE_MENU_GAP ||
      spaceBelow >= spaceAbove

    const top = openBelow
      ? rect.bottom + MESSAGE_MENU_GAP
      : rect.top - MESSAGE_MENU_HEIGHT - MESSAGE_MENU_GAP

    let left = rect.left + rect.width / 2 - MESSAGE_MENU_WIDTH / 2
    left = Math.max(8, Math.min(left, window.innerWidth - MESSAGE_MENU_WIDTH - 8))

    const clampedTop = Math.max(
      8,
      Math.min(top, window.innerHeight - MESSAGE_MENU_HEIGHT - 8),
    )

    setMenuState({ messageId: message.id, top: clampedTop, left })
  }

  const activeMenuMessage = menuState
    ? messages.find((message) => message.id === menuState.messageId)
    : null

  const messageActionMenu =
    menuState &&
    activeMenuMessage &&
    createPortal(
      <div
        ref={menuRef}
        style={{ top: menuState.top, left: menuState.left }}
        className="fixed z-[100] flex items-center gap-0.5 overflow-hidden rounded-xl border border-line/80 bg-white p-1 shadow-[0_8px_24px_rgba(26,46,38,0.12)]"
      >
        <button
          type="button"
          onClick={() => startEditing(activeMenuMessage)}
          className="inline-flex size-9 items-center justify-center rounded-lg text-ink transition hover:bg-cream"
          aria-label="Edit message"
        >
          <Pencil size={16} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => deleteMessage(activeMenuMessage.id)}
          className="inline-flex size-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50"
          aria-label="Delete message"
        >
          <Trash2 size={16} strokeWidth={1.75} />
        </button>
      </div>,
      document.body,
    )

  const startEditing = (message) => {
    setEditingMessageId(message.id)
    setDraft(message.content || '')
    closeMessageMenu()
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  const cancelEditing = () => {
    setEditingMessageId(null)
    setDraft('')
  }

  const saveEdit = () => {
    const content = draft.trim()
    if (!content || !socket || !editingMessageId) return

    socket.emit('edit_message', {
      messageId: editingMessageId,
      content,
    })
    cancelEditing()
  }

  const deleteMessage = (messageId) => {
    if (!socket) return
    if (editingMessageId === messageId) {
      cancelEditing()
    }
    socket.emit('delete_message', { messageId })
    closeMessageMenu()
  }

  const handleSubmit = () => {
    if (editingMessageId) {
      saveEdit()
      return
    }
    sendMessage()
  }

  const canSubmit =
    roomJoined && !loading && !loadError && draft.trim().length > 0

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className={`absolute inset-0 bg-ink/45 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Close chat"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-chat-title"
        className={`relative z-10 flex h-[min(36rem,94vh)] w-full max-w-md flex-col overflow-hidden rounded-t-[1.35rem] border border-white/70 bg-white shadow-[0_24px_60px_rgba(26,46,38,0.22)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:rounded-[1.35rem] ${
          visible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-[0.97] sm:translate-y-4'
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#e8f0ea] to-transparent" />

        <header className="relative flex items-start gap-3 border-b border-line/70 px-4 pb-4 pt-4 sm:px-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white shadow-[0_6px_16px_rgba(45,106,79,0.28)]">
            {activePlayer.initials}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-center gap-2">
              <p
                id="match-chat-title"
                className="truncate font-semibold text-ink"
              >
                {activePlayer.name}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f0ea] px-2 py-0.5 text-[11px] font-medium text-forest">
                <span
                  className={`size-1.5 rounded-full ${roomJoined ? 'bg-forest' : 'bg-muted'}`}
                />
                {roomJoined ? 'Live' : 'Connecting'}
              </span>
            </div>
            <p className="mt-0.5 truncate text-sm text-muted">
              {activeGame.course}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {activeGame.date} · {activeGame.time}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-cream text-muted transition hover:bg-[#ebe8e1] hover:text-ink"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </header>

        <div
          ref={messagesContainerRef}
          className="relative flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#f7f6f1_0%,#f9f8f3_100%)] px-4 py-4 sm:px-5"
        >
          {loading && (
            <p className="py-8 text-center text-sm text-muted">Loading chat…</p>
          )}

          {!loading && loadError && (
            <div className="rounded-xl border border-line/70 bg-white px-4 py-6 text-center text-sm text-muted">
              {loadError}
            </div>
          )}

          {!loading && !loadError && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-forest shadow-[0_1px_3px_rgba(26,46,38,0.06)]">
                <MessageCircle size={22} strokeWidth={1.75} />
              </div>
              <p className="text-sm font-medium text-ink">Start the conversation</p>
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                Coordinate where to meet before tee-off.
              </p>
            </div>
          )}

          {!loading &&
            !loadError &&
            messages.map((message) => {
              const mine = isMessageMine(message, currentUserId)
              const menuOpen = menuState?.messageId === message.id

              return (
                <div
                  key={message.id}
                  className={`flex flex-col gap-1 ${mine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`flex max-w-[90%] items-end gap-1 ${
                      mine ? 'ml-auto flex-row' : 'flex-row'
                    }`}
                  >
                    {mine && !message.isDeleted && (
                      <div className="relative shrink-0 pb-1">
                        <button
                          type="button"
                          onPointerDown={(event) => event.stopPropagation()}
                          onClick={(event) => {
                            event.stopPropagation()
                            openMessageMenu(message, event)
                          }}
                          data-message-menu-trigger
                          className={`inline-flex size-8 items-center justify-center rounded-full transition hover:bg-black/5 hover:text-ink ${
                            menuOpen ? 'bg-black/5 text-ink' : 'text-muted'
                          }`}
                          aria-label="Message options"
                          aria-expanded={menuOpen}
                        >
                          <MoreVertical size={16} strokeWidth={1.75} />
                        </button>
                      </div>
                    )}

                    <div
                      className={`max-w-full rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                        mine
                          ? 'rounded-br-md bg-forest text-white'
                          : 'rounded-bl-md border border-line/70 bg-white text-ink'
                      } ${message.isDeleted ? 'italic opacity-70' : ''}`}
                    >
                      <p>
                        {message.isDeleted
                          ? 'This message was deleted'
                          : message.content}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 px-1 text-[11px] text-muted ${mine ? 'flex-row-reverse' : ''}`}
                  >
                    <span>{formatMessageTime(message.createdAt)}</span>
                    {message.isEdited && !message.isDeleted && (
                      <span>edited</span>
                    )}
                    {mine && message.isSeen && !message.isDeleted && (
                      <span>seen</span>
                    )}
                  </div>
                </div>
              )
            })}

          {otherUserTyping && (
            <p className="text-xs text-muted">typing…</p>
          )}

          <div ref={endRef} />
        </div>

        {(socketError || loadError) && (
          <p className="border-t border-line/70 px-4 py-2 text-xs text-red-500 sm:px-5">
            {socketError}
          </p>
        )}

        <form
          className="relative border-t border-line/70 bg-white p-3 sm:p-4"
          onSubmit={(event) => {
            event.preventDefault()
            handleSubmit()
          }}
        >
          <div className={`flex items-center gap-2 rounded-2xl border bg-cream/50 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(45,106,79,0.08)] ${
            editingMessageId
              ? 'border-forest/50 focus-within:border-forest/50'
              : 'border-line focus-within:border-forest/40'
          }`}>
            <label className="sr-only" htmlFor="match-chat-input">
              {editingMessageId ? 'Edit message' : 'Message'}
            </label>
            <textarea
              id="match-chat-input"
              ref={inputRef}
              rows={1}
              value={draft}
              disabled={!roomJoined || Boolean(loadError)}
              onChange={(event) => handleDraftChange(event.target.value)}
              onBlur={stopTyping}
              onKeyDown={(event) => {
                if (event.key === 'Escape' && editingMessageId) {
                  event.preventDefault()
                  cancelEditing()
                  return
                }
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  handleSubmit()
                }
              }}
              placeholder={
                editingMessageId
                  ? 'Edit your message…'
                  : roomJoined
                    ? 'Write you message here...'
                    : 'Connecting to chat…'
              }
              className="h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-5 text-ink outline-none placeholder:text-muted/80 disabled:cursor-not-allowed disabled:opacity-60"
            />
            {editingMessageId ? (
              <div className="flex shrink-0 items-center gap-1 self-center pr-0.5">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="inline-flex size-10 items-center justify-center rounded-lg text-muted transition hover:bg-black/5 hover:text-ink"
                  aria-label="Cancel edit"
                >
                  <X size={18} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={!canSubmit}
                  className="inline-flex size-10 items-center justify-center rounded-lg bg-forest text-white transition hover:bg-[#244a37] disabled:cursor-not-allowed disabled:bg-forest/35"
                  aria-label="Save edit"
                >
                  <Check size={18} strokeWidth={2} />
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex size-11 shrink-0 items-center justify-center self-center rounded-lg bg-forest text-white transition hover:bg-[#244a37] enabled:active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-forest/35"
                aria-label="Send message"
              >
                <Send size={17} strokeWidth={1.85} className="translate-x-px" />
              </button>
            )}
          </div>
        </form>

        {messageActionMenu}
      </div>
    </div>
  )
}

export default MatchChat


