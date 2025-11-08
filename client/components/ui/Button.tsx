import React from 'react'

type ButtonProps = {
    onClick?: () => void,
    className: string,
    title: string,
}

export default function Button({onClick, className, title}: ButtonProps) {
  return (
    <button
          onClick={onClick}
          className={className}
        >
        {title}
    </button>
  )
}
