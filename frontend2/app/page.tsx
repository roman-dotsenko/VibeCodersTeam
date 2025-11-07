'use client'
import { useTranslation } from "react-i18next";
import {useTranslations} from 'next-intl';
import LanguageSwitcher from "../components/Language/LanguageSwitcher";
import Header from "../components/Header/Header";

export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <div className="flex flex-col min-h-screen items-center  bg-zinc-50 font-sans dark:bg-black">
      <h1>{t('title')}</h1>
    </div>
  );
}
