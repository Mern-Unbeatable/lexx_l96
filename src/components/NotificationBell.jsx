import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '../context/NotificationsContext'

const formatRelativeTime = (value) => {
  const date = new Date(value)
  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60_000)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

const NotificationBell = ({ className = '' }) => {
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false)
  const {
    notifications,
    unreadCount,
    isLoading,
    openNotification,
    markAsRead,
    markAllAsRead,
    isMarkingAllRead,
  } = useNotifications()

  useEffect(() => {
    const handleOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [])

  const handleMarkAsRead = async (event, notificationId) => {
    event.stopPropagation()
    await markAsRead(notificationId)
  }

  const handleNotificationClick = async (notification) => {
    setOpen(false)
    await openNotification(notification)
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative inline-flex size-10 items-center justify-center rounded-lg border border-line bg-white text-ink transition hover:bg-[#f5f5f5] xl:size-auto xl:h-full xl:border-0 xl:bg-transparent xl:px-0 xl:hover:bg-transparent"
      >
        <Bell size={18} strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex min-w-[1.125rem] items-center justify-center rounded-full bg-[#c2410c] px-1 text-[10px] font-semibold leading-4 text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed left-4 right-4 top-[4.25rem] z-[80] overflow-hidden rounded-xl border border-line bg-white shadow-[0_16px_40px_rgba(26,46,38,0.14)] max-xl:max-h-[min(20rem,calc(100dvh-5.5rem))] xl:absolute xl:left-auto xl:right-0 xl:top-full xl:mt-2 xl:w-[22rem] xl:max-h-none">
          <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-3 sm:px-4">
            <p className="text-sm font-semibold text-ink">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                disabled={isMarkingAllRead}
                className="shrink-0 text-xs font-medium text-forest transition hover:text-ink disabled:opacity-50"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto overscroll-contain max-xl:max-h-[min(18rem,calc(100dvh-8rem))]">
            {isLoading && (
              <p className="px-4 py-6 text-center text-sm text-muted">
                Loading notifications…
              </p>
            )}

            {!isLoading && notifications.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-muted">
                No notifications yet.
              </p>
            )}

            {!isLoading &&
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex flex-col gap-2 border-b border-line/70 px-3 py-3 transition last:border-b-0 hover:bg-cream sm:flex-row sm:items-start sm:gap-2 ${
                    notification.isRead ? 'bg-white' : 'bg-[#f4f8f5]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-ink break-words">
                        {notification.title}
                      </p>
                      <span className="shrink-0 text-[11px] text-muted">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted break-words">
                      {notification.body}
                    </p>
                  </button>
                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={(event) => handleMarkAsRead(event, notification.id)}
                      aria-label="Mark notification as read"
                      className="self-end rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-medium text-forest transition hover:bg-cream sm:mt-0.5 sm:shrink-0 sm:self-auto"
                    >
                      Mark
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
