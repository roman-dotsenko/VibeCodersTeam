import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'

export default function AddResume() {
    const t = useTranslations('DashboardPage');
  return (
    <Link href='/dashboard/create-resume' className='py-40 px-20 border rounded-xl border-dotted border-gray-500 d-flex flex-col text-center transition hover:border-indigo-600 hover:text-indigo-600'>
        <h1>{t('createResume')}</h1>
        <h1>+</h1>
    </Link>
  )
}
