'use client'
import { useEffect, useState } from 'react';
import AddResume from '@/components/AddResume/AddResume';
import ResumeCard from '@/components/ResumeCard/ResumeCard';
import QuizStats from '@/components/QuizStats/QuizStats';
import { useGetResumes } from '@/hooks/useGetResumes';
import { authService, User } from '@/lib/auth';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('DashboardPage');
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const cachedUser = authService.getUser();
    if (cachedUser) {
      setUser(cachedUser);
    }

    authService.checkAuth().then((userData) => {
      if (userData) {
        setUser(userData);
      }
    });
  }, []);

  const { resumes, loading, error } = useGetResumes(user?.id);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black dark:text-white p-8">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          {t('title') || 'My Resumes'}
        </h1>
        
        {/* Main Layout: Resumes Grid + Quiz Stats Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side: Resumes Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Add New Resume Card */}
          <AddResume />
          
          {/* Existing Resumes */}
          {loading && (
            <div className="col-span-1 flex items-center justify-center p-6">
              <p className="text-gray-500">Loading resumes...</p>
            </div>
          )}
          
          {error && (
            <div className="col-span-1 flex items-center justify-center p-6">
              <p className="text-red-500">Error: {error}</p>
            </div>
          )}
          
          {!loading && !error && resumes && resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              id={resume.id}
              name={resume.personalDetails.name || 'Untitled Resume'}
              resume={resume}
            />
          ))}
          
          {!loading && !error && resumes && resumes.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p>No resumes yet. Create your first resume to get started!</p>
            </div>
          )}
            </div>
          </div>

          {/* Right Side: Quiz Stats */}
          {user && (
            <div className="lg:w-96 flex-shrink-0">
              <QuizStats userId={user.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
