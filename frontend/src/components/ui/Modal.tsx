import Button from 'src/components/ui/Button';
import React from 'react'

type Props = {
  title?: string
  open: boolean
  onClose: () => void
  children?: React.ReactNode
}

export default function Modal({ title, open, onClose, children }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[92%] max-w-2xl bg-white rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold m-0">{title}</h3>
          <Button onClick={onClose} aria-label="Close">✕</Button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
