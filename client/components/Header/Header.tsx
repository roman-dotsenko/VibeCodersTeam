'use client'
import React, { useEffect, useRef, useState } from 'react'
import LanguageSwitcher from '../Language/LanguageSwitcher'
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Button from '../ui/Button';
import { authService, User } from '@/lib/auth';

export default function Header() {
    const t = useTranslations('Header');
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check if user is authenticated
        authService.checkAuth()
          .then((userData) => {
            setUser(userData);
          })
      }, []);

    // close on outside click or Escape
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!menuRef.current) return
            if (e.target instanceof Node && !menuRef.current.contains(e.target)) {
                setOpen(false)
            }
        }

        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false)
        }

        document.addEventListener('click', onDocClick)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('click', onDocClick)
            document.removeEventListener('keydown', onKey)
        }
    }, [])

    return (
        <header className="w-full relative flex items-center justify-between p-4 bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">CV</h2>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-4">
                <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 transition hover:text-indigo-600 hover:font-bold">
                    {t('dashboard')}
                </Link>
                <Link href="/agent" className="text-gray-700 dark:text-gray-300 transition hover:text-indigo-600 hover:font-bold">
                    {t('agent')}
                </Link>
            </nav>

            <div className="flex items-center gap-3">
                <div className="hidden sm:flex sm:gap-2">
                    <LanguageSwitcher />
                    {user ? (
                        <div className="flex items-center gap-2">
                            <img
                                src={user.picture || '/default-avatar.png'}
                                alt="User Avatar"
                                className="w-8 h-8 rounded-full border border-gray-300"
                            />
                            <Button
                                onClick={async () => { await authService.logout(); setUser(null); }}
                                className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
                                title='Logout'
                            />
                        </div>
                    ) : (
                        <Button title={t('register')} to='/login' className='px-3 py-1 rounded-lg bg-indigo-600 text-white'/>
                    )}
                </div>

                <div className="sm:hidden" ref={menuRef}>
                    <button
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        onClick={() => setOpen((v) => !v)}
                        className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {!open ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        )}
                    </button>

                    {open && (
                        <div id="mobile-menu" className="absolute right-4 top-full mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md p-3 z-50">
                            <nav className="flex flex-col gap-2">
                                <Link href="/dashboard" className="block text-gray-700 dark:text-gray-300 py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                    {t('dashboard')}
                                </Link>
                                <Link href="/agent" className="block text-gray-700 dark:text-gray-300 py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                    {t('agent')}
                                </Link>
                                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700">
                                    <LanguageSwitcher />
                                </div>
                                {user ? (
                                    <div className="flex flex-col items-center justify-center py-2 gap-2">
                                        <img
                                            src={user.picture || '/default-avatar.png'}
                                            alt="User Avatar"
                                            className="w-8 h-8 rounded-full border border-gray-300"
                                        />
                                       <Button
                                onClick={async () => { await authService.logout(); setUser(null); }}
                                className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
                                title='Logout'
                            />
                                    </div>
                                ) : (
                                    <Button title={t('register')} to='/login' className='px-3 py-1 rounded-lg bg-indigo-600 text-white w-full text-center'/>
                                )}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
