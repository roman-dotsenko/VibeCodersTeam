'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function CallbackContent() {
  const router = useRouter();

  useEffect(() => {
    // After OAuth, the backend has set a cookie
    // Verify authentication and fetch user data
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:7018';
    
    fetch(`${backendUrl}/api/auth/me`, {
      credentials: 'include', // Important: include cookies
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Authentication failed');
        }
        return res.json();
      })
      .then((user) => {
        // Store user info locally for quick access
        localStorage.setItem('user', JSON.stringify(user));
        // Redirect to home page
        router.push('/');
      })
      .catch((error) => {
        console.error('Failed to fetch user info:', error);
        router.push('/login?error=auth_failed');
      });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Completing sign in...
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
