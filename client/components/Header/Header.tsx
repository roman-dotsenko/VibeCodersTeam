import React from 'react'
import LanguageSwitcher from '../Language/LanguageSwitcher'
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Header() {
    const t = useTranslations('Header');
  return (
    <header className="w-full flex justify-between p-4 bg-white dark:bg-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">CV</h2>
        <li className='flex items-center justify-center gap-4'>
            <Link href="/" className="text-gray-700 dark:text-gray-300 transition hover:text-indigo-600 hover:font-bold">
                {t('dashboard')}
            </Link>    
            <Link href="/agent" className="text-gray-700 dark:text-gray-300 transition hover:text-indigo-600 hover:font-bold">
                {t('agent')}
            </Link>    

        </li>
        <LanguageSwitcher/>
    </header>
  )
}
