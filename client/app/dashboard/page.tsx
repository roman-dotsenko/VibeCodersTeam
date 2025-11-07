'use client'
import AddResume from '@/components/AddResume/AddResume';
import Input, { InputType } from '@/components/ui/Input';
import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations('DashboardPage');
  return (
    <div className="flex flex-col min-h-screen items-center  bg-zinc-50 font-sans dark:bg-black dark:text-white pt-5">
      <AddResume/>
    </div>
  );
}
