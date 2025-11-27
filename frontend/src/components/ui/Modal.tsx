import React from 'react'
import Button from './Button'

type Props = {
  title?: string
  open: boolean
  onClose: () => void
  children?: React.ReactNode
}

export default function Modal({ title, open, onClose, children }: Props) {
  const dialogRef = React.useRef<HTMLDivElement | null>(null)
  const previouslyFocused = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement as HTMLElement
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    firstFocusable?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previouslyFocused.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className="w-[92%] max-w-2xl bg-white dark:bg-gray-800 rounded-lg p-4"
      >
        <div className="flex justify-between items-center">
          <h3 id="modal-title" className="text-lg font-semibold m-0">{title}</h3>
          <Button onClick={onClose} aria-label="Close modal">✕</Button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
