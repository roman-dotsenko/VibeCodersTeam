import React from 'react'

export enum InputType {
    TEXT = 'text',
    PASSWORD = 'password',
    EMAIL = 'email',
    NUMBER = 'number',
    TEXTAREA = 'textarea',
    DATE = 'date',
}

type InputProps = {
    className?: string
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    inputType: InputType
    name?: string
}

export const inputStyles =
  'w-full px-3 py-2 rounded-md border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-transparent dark:border-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-500'

export default function Input({...props}: InputProps) {
  const { className, placeholder = 'Input', inputType, ...rest } = props

  return (
    inputType === InputType.TEXTAREA ? (
      <textarea
        className={`${inputStyles} ${className ?? ''}`.trim()}
        placeholder={placeholder}
        {...rest}
      />
    ) : (
      <input
        className={`${inputStyles} ${className ?? ''}`.trim()}
        placeholder={placeholder}
        type={inputType}
        {...rest}
      />
    )
  )
}
