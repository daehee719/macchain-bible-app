import Button from 'src/components/ui/Button';
import React from 'react'

type Props = {
  title?: string
  children?: React.ReactNode
}

export default function Card({ title, children }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 mb-3" role="region">
      {title && <h3 className="text-base font-semibold mb-2">{title}</h3>}
      <div>{children}</div>
    </div>
  )
}
