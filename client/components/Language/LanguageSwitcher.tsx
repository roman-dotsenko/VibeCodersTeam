'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<string>('en')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const cookieLocale = document.cookie
      .split('; ')
      .find((row) => row.startsWith('NEXT_LOCALE= '))
      ?.split('=')[1]

    if (cookieLocale) {
      setLocale(cookieLocale)
    } else {
      const browserLocale = navigator.language.slice(0, 2)
      setLocale(browserLocale)
      document.cookie = `NEXT_LOCALE=${browserLocale}; `
      router.refresh()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const switchLocale = (newLocale: string) => {
    // Persist selection
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/;`
    setLocale(newLocale)
    router.refresh()
  }

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => switchLocale('en')}
        aria-pressed={locale === 'en'}
        className={`px-3 py-1 rounded ${
          locale === 'en' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
        }`}
      >
        EN
      </button>

      <button
        onClick={() => switchLocale('ua')}
        aria-pressed={locale === 'ua'}
        className={`px-3 py-1 rounded ${
          locale === 'ua' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
        }`}
      >
        UA
      </button>
    </div>
  )
}
