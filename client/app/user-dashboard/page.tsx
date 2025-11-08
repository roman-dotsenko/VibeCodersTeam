'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '@/lib/auth';

interface Resume {
  id: string;
  templateId: number;
  personalDetails: {
    fullName: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface Quiz {
  quizId: string;
  quizScore: number;
  completedAt?: string;
}

interface Activity {
  type: 'resume' | 'quiz';
  id: string;
  title: string;
  timestamp: string;
  score?: number;
}

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    // Try to get user from localStorage first
    const cachedUser = authService.getUser();
    
    if (cachedUser) {
      setUser(cachedUser);
      setLoading(false);
    }

    // Always verify with backend
    authService.checkAuth()
      .then(async (userData) => {
        if (userData) {
          setUser(userData);
          setLoading(false);
          
          // Fetch recent activity
          try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://job-helper-app.azurewebsites.net';
            
            const [resumesRes, quizzesRes] = await Promise.all([
              fetch(`${backendUrl}/api/users/${userData.id}/resumes`),
              fetch(`${backendUrl}/api/users/${userData.id}/quizzes`)
            ]);

            const resumes: Resume[] = resumesRes.ok ? await resumesRes.json() : [];
            const quizzes: Quiz[] = quizzesRes.ok ? await quizzesRes.json() : [];

            // Combine and sort activities
            const activities: Activity[] = [];

            // Add resumes to activities
            resumes.forEach((resume) => {
              activities.push({
                type: 'resume',
                id: resume.id,
                title: resume.personalDetails?.fullName || 'Untitled Resume',
                timestamp: resume.updatedAt || resume.createdAt || new Date().toISOString(),
              });
            });

            // Add quizzes to activities
            quizzes.forEach((quiz, index) => {
              activities.push({
                type: 'quiz',
                id: quiz.quizId,
                title: `Quiz #${index + 1}`,
                timestamp: quiz.completedAt || new Date().toISOString(),
                score: quiz.quizScore,
              });
            });

            // Sort by timestamp (most recent first) and take top 5
            activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setRecentActivity(activities.slice(0, 5));
          } catch (error) {
            console.error('Error fetching activity:', error);
          }
        } else {
          // Not authenticated, redirect to login
          router.push('/login');
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

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
                onClick={() => setShowSettings(true)}
                className="w-full rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Settings
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No recent activity to display
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={`${activity.type}-${activity.id}`}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {activity.type === 'resume' ? (
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {activity.title}
                        </p>
                        {activity.type === 'quiz' && activity.score !== undefined && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            activity.score >= 8
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : activity.score >= 6
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {activity.score}/10
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.type === 'resume' ? 'Resume' : 'Quiz'} • {new Date(activity.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Account Settings
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Manage your account preferences and data
                  </p>
                </div>

                {/* GDPR Data Export */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Your Data
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Export all your data in JSON format (GDPR Article 15)
                  </p>
                  <button
                    onClick={async () => {
                      if (!user?.id) return;
                      try {
                        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://job-helper-app.azurewebsites.net';
                        
                        // Fetch user data
                        const [resumesRes, quizzesRes] = await Promise.all([
                          fetch(`${backendUrl}/api/users/${user.id}/resumes`),
                          fetch(`${backendUrl}/api/users/${user.id}/quizzes`)
                        ]);

                        const resumes = resumesRes.ok ? await resumesRes.json() : [];
                        const quizzes = quizzesRes.ok ? await quizzesRes.json() : [];

                        const exportData = {
                          user: {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            givenName: user.givenName,
                            surname: user.surname,
                            picture: user.picture
                          },
                          resumes,
                          quizzes,
                          exportDate: new Date().toISOString()
                        };

                        // Create and download JSON file
                        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `jobhelper-data-${user.id}-${new Date().toISOString().split('T')[0]}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);

                        alert('✓ Your data has been downloaded successfully!');
                      } catch (error) {
                        console.error('Error exporting data:', error);
                        alert('Failed to export data. Please try again.');
                      }
                    }}
                    className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Download My Data
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                  <h4 className="text-sm font-semibold text-red-900 dark:text-red-400 mb-2 flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Danger Zone
                  </h4>
                  <p className="text-xs text-red-800 dark:text-red-300 mb-3">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      handleDeleteAccount();
                    }}
                    className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 dark:border-gray-700">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
