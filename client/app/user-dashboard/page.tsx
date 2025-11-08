'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '@/lib/auth';

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get user from localStorage first
    const cachedUser = authService.getUser();
    
    if (cachedUser) {
      setUser(cachedUser);
      setLoading(false);
    }

    // Always verify with backend
    authService.checkAuth()
      .then((userData) => {
        if (userData) {
          setUser(userData);
          setLoading(false);
        } else {
          // Not authenticated, redirect to login
          router.push('/login');
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) {
      alert('User not found');
      return;
    }

    const confirmed = confirm(
      'WARNING: This will permanently delete your account and ALL your data including:\n\n' +
      '• All your resumes\n' +
      '• All quiz results\n' +
      '• Your profile information\n\n' +
      'This action CANNOT be undone!\n\n' +
      'Are you absolutely sure you want to delete your account?'
    );

    if (!confirmed) {
      return;
    }

    // Double confirmation
    const doubleConfirm = confirm(
      'This is your FINAL warning!\n\n' +
      'Type your email in the next prompt to confirm account deletion.'
    );

    if (!doubleConfirm) {
      return;
    }

    const emailConfirmation = prompt('Please type your email to confirm deletion:');
    
    if (emailConfirmation !== user.email) {
      alert('Email does not match. Account deletion cancelled.');
      return;
    }

    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://job-helper-app.azurewebsites.net';
      
      const response = await fetch(`${backendUrl}/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete account: ${response.status}`);
      }

      alert('✓ Your account has been successfully deleted.');
      
      // Logout and redirect
      await authService.logout();
      router.push('/login');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      alert(`Failed to delete account: ${error.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                JobHelper
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {user?.email}
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.name}!
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You are successfully logged in to JobHelper
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Information
            </h3>
            <div className="mt-4 space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Name:{' '}
                </span>
                <span className="text-gray-900 dark:text-white">
                  {user?.name}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Email:{' '}
                </span>
                <span className="text-gray-900 dark:text-white">
                  {user?.email}
                </span>
              </div>
              {user?.givenName && (
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400">
                    Given Name:{' '}
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {user.givenName}
                  </span>
                </div>
              )}
              {user?.surname && (
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400">
                    Surname:{' '}
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {user.surname}
                  </span>
                </div>
              )}
            </div>
            {user?.picture && (
              <div className="mt-4">
                <img
                  src={user.picture}
                  alt="Profile"
                  className="h-16 w-16 rounded-full"
                />
              </div>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h3>
            <div className="mt-4 space-y-2">
              <button className="w-full rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                View Jobs
              </button>
              <button className="w-full rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                Applications
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="w-full rounded-lg bg-red-100 px-4 py-2 text-left text-sm font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
              >
                Delete Account
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              No recent activity to display
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
