'use client'
import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <div className="flex flex-col min-h-screen items-center  bg-zinc-50 font-sans dark:bg-black">
      <h1>{t('title')}</h1>
    </div>
  );
}
