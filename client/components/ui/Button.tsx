import Link from 'next/link'
import React from 'react'

type ButtonProps = {
    onClick?: () => void,
    className: string,
    title: string,
    to?: string,
    disabled?: boolean,
}

export default function Button({onClick, className, title, to, disabled}: ButtonProps) {
  return (
    !to ? (
      <button
          disabled={disabled}
          onClick={onClick}
          className={className}
        >
        {title}
    </button>
    ) : (
      <Link
        href={to}
        className={className}
      >
        {title}
      </Link>
    )
  )
}
