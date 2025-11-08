import Link from 'next/link'
import React from 'react'

type ButtonProps = {
    onClick?: () => void,
    className: string,
    title: string,
    to?: string,
}

export default function Button({onClick, className, title, to}: ButtonProps) {
  return (
    !to ? (
      <button
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
