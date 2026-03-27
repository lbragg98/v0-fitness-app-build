'use client'

export function EmptyState({
  title,
  description,
  action,
  actionLabel,
}: {
  title: string
  description: string
  action?: () => void
  actionLabel?: string
}) {
  return (
    <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-12 text-center">
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      {action && actionLabel && (
        <button
          onClick={action}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export function ErrorState({
  title,
  message,
  retry,
}: {
  title: string
  message: string
  retry?: () => void
}) {
  return (
    <div className="rounded-lg border-2 border-dashed border-destructive/30 bg-destructive/10 p-12 text-center">
      <h3 className="text-xl font-bold text-destructive mb-2">{title}</h3>
      <p className="text-destructive/80 mb-6">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="px-6 py-2 bg-destructive text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
