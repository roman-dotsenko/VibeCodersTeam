import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'

export default function AddResume() {
    const t = useTranslations('DashboardPage');
  return (
    <Link 
      href='/dashboard/create-resume' 
      className='group border rounded-xl border-dashed border-gray-400 dark:border-gray-600 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-md transition-all hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 flex flex-col items-center justify-center text-center min-h-[280px]'
    >
      <div className="flex flex-col items-center justify-center">
        {/* Plus Icon */}
        <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/40 transition-colors">
          <span className="text-4xl text-indigo-600 dark:text-indigo-400 font-light">+</span>
        </div>
        
        {/* Text */}
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {t('createResume') || 'Create New Resume'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Start from scratch
        </p>
      </div>
    </Link>
  )
}
