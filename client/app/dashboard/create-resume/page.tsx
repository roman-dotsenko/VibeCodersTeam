'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header/Header'

interface Resume {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  email: string
  name?: string
}

export default function CreateResume() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  useEffect(() => {
    fetchUserAndResumes()
  }, [])

  const fetchUserAndResumes = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch current user
      const userResponse = await fetch(`${baseUrl}/api/auth/me`, {
        credentials: 'include',
      })

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data. Please log in.')
      }

      const userData = await userResponse.json()
      setUser(userData)

      // Fetch user's resumes
      const resumesResponse = await fetch(`${baseUrl}/api/users/${userData.id}/resumes`, {
        credentials: 'include',
      })

      if (!resumesResponse.ok) {
        throw new Error('Failed to fetch resumes')
      }

      const resumesData = await resumesResponse.json()
      setResumes(resumesData)
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNewResume = async () => {
    if (!user) return

    try {
      const response = await fetch(`${baseUrl}/api/users/${user.id}/resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: 'New Resume',
          // Add other required fields here
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create resume')
      }

      const newResume = await response.json()
      router.push(`/dashboard/create-resume/${newResume.id}`)
    } catch (err) {
      console.error('Error creating resume:', err)
      setError('Failed to create new resume')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchUserAndResumes}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Resumes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage your professional resumes
          </p>
        </div>

        {/* Create New Resume Button */}
        <div className="mb-8">
          <button
            onClick={handleCreateNewResume}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Resume
          </button>
        </div>

        {/* Resumes Grid */}
        {resumes.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No resumes yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first resume to get started
            </p>
            <button
              onClick={handleCreateNewResume}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => router.push(`/dashboard/create-resume/${resume.id}`)}
              >
                {/* Resume Icon */}
                <div className="w-16 h-20 bg-blue-100 dark:bg-blue-900 rounded mb-4 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                {/* Resume Info */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                  {resume.title}
                </h3>
                
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>Created: {formatDate(resume.createdAt)}</p>
                  <p>Updated: {formatDate(resume.updatedAt)}</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/dashboard/create-resume/${resume.id}`)
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // Add view functionality
                    }}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
