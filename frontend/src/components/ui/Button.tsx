import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({ variant = 'primary', size = 'md', children, className = '', disabled, ...rest }: Props) {
  const sizeCls = size === 'sm' ? 'px-2 py-1 text-sm' : size === 'lg' ? 'px-4 py-3 text-base' : 'px-3 py-2 text-sm'

  const variantCls =
    variant === 'primary'
      ? 'bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60'
      : variant === 'secondary'
      ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-60'
      : 'bg-transparent text-gray-700 hover:bg-gray-100 disabled:opacity-60'

  const classes = `${variantCls} ${sizeCls} rounded-md inline-flex items-center gap-2 ${className}`.trim()

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
