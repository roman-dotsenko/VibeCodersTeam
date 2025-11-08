import React from 'react';
import { useGetQuizzes } from '@/hooks/useGetQuizzes';

interface QuizStatsProps {
  userId: string;
}

export default function QuizStats({ userId }: QuizStatsProps) {
  const { quizzes, loading, error } = useGetQuizzes(userId);

  const calculateAverage = () => {
    if (quizzes.length === 0) return 0;
    const total = quizzes.reduce((sum, quiz) => sum + quiz.quizScore, 0);
    return Math.round(total / quizzes.length);
  };

  const getHighestScore = () => {
    if (quizzes.length === 0) return 0;
    return Math.max(...quizzes.map(q => q.quizScore));
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400';
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (score >= 6) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
        <p className="text-red-500 text-sm">Error loading quiz stats</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Quiz Statistics</h2>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-white/80 text-xs mb-1">Total Quizzes</p>
            <p className="text-2xl font-bold text-white">{quizzes.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-white/80 text-xs mb-1">Average Score</p>
            <p className="text-2xl font-bold text-white">{calculateAverage()}/10</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-white/80 text-xs mb-1">Best Score</p>
            <p className="text-2xl font-bold text-white">{getHighestScore()}/10</p>
          </div>
        </div>
      </div>

      {/* Quiz List */}
      <div className="p-6">
        {quizzes.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 mb-2">No quizzes taken yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Take a quiz to see your results here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Recent Quizzes ({quizzes.length})
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
              {quizzes.map((quiz, index) => (
                <div
                  key={quiz.quizId}
                  className={`flex items-center justify-between p-3 rounded-lg border ${getScoreBgColor(quiz.quizScore)}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {quizzes.length - index}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Quiz ID: {quiz.quizId.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${getScoreColor(quiz.quizScore)}`}>
                      {quiz.quizScore}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">/10</span>
                    {quiz.quizScore >= 8 && (
                      <span className="ml-2 text-lg">🏆</span>
                    )}
                    {quiz.quizScore >= 6 && quiz.quizScore < 8 && (
                      <span className="ml-2 text-lg">⭐</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
