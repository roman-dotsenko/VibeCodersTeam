'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { authService, User } from '@/lib/auth';

interface QuizQuestion {
  id: string;
  question: string;
  responses: string[];
  correct_answer_index: number;
}

export default function QuizPage() {
  const t = useTranslations('QuizPage');
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [savingResults, setSavingResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

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

  // Timer effect
  useEffect(() => {
    if (!timerActive || showResults) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          // Auto-submit when time runs out
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerateQuiz = async () => {
    if (!theme.trim()) {
      setError('Please enter a theme for the quiz');
      return;
    }

    setLoading(true);
    setError('');
    setQuiz([]);
    setUserAnswers({});
    setShowResults(false);

    try {
      const chatUri = process.env.NEXT_PUBLIC_CHAT_URI || 'https://jobhelper-py.azurewebsites.net';
      const response = await fetch(`${chatUri}/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate quiz: ${response.status}`);
      }

      const data = await response.json();
      console.log('Quiz generated:', data);
      
      if (data.quiz && Array.isArray(data.quiz)) {
        setQuiz(data.quiz);
        setQuizId(data.quiz_id); // Save quiz ID from backend
        setTimeLeft(600); // Reset timer to 10 minutes
        setTimerActive(true); // Start timer
      } else {
        throw new Error('Invalid quiz format received');
      }
    } catch (err: any) {
      console.error('Error generating quiz:', err);
      setError(err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    if (showResults) return; // Don't allow changes after submitting
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const saveQuizResults = async (score: number) => {
    if (!user?.id || !quizId) {
      console.log('Cannot save results: user or quizId missing');
      return;
    }

    setSavingResults(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://job-helper-app.azurewebsites.net';
      const response = await fetch(`${backendUrl}/api/users/${user.id}/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quizId,
          quizScore: score,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save quiz results: ${response.status}`);
      }

      console.log('Quiz results saved successfully');
    } catch (err: any) {
      console.error('Error saving quiz results:', err);
      // Don't show error to user, just log it
    } finally {
      setSavingResults(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(userAnswers).length !== quiz.length && timeLeft > 0) {
      setError('Please answer all questions before submitting');
      return;
    }
    
    setTimerActive(false); // Stop timer
    const score = calculateScore();
    setShowResults(true);
    setError('');

    // Save results to backend
    await saveQuizResults(score.correct);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach(question => {
      if (userAnswers[question.id] === question.correct_answer_index) {
        correct++;
      }
    });
    return { correct, total: quiz.length };
  };

  const handleReset = () => {
    setTheme('');
    setQuiz([]);
    setQuizId(null);
    setUserAnswers({});
    setShowResults(false);
    setError('');
    setTimeLeft(600);
    setTimerActive(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black dark:text-white">
      <div className="max-w-4xl mx-auto w-full p-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">
          {t('title') || 'AI Quiz Generator'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t('subtitle') || 'Generate a custom quiz on any topic using AI'}
        </p>

        {/* Theme Input Section */}
        {quiz.length === 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              What topic would you like to be quizzed on?
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quiz Theme
                </label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g., JavaScript, World History, Machine Learning..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      handleGenerateQuiz();
                    }
                  }}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleGenerateQuiz}
                disabled={loading || !theme.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Quiz...
                  </span>
                ) : (
                  'Generate Quiz'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Quiz Questions Section */}
        {quiz.length > 0 && (
          <div className="space-y-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-200">
                  Quiz: {theme}
                </h2>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                  {quiz.length} questions
                </p>
              </div>
              
              {/* Timer */}
              {!showResults && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeLeft <= 60 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                    : timeLeft <= 180
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-mono text-lg font-semibold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
            </div>

            {quiz.map((question, qIndex) => {
              const isAnswered = question.id in userAnswers;
              const userAnswer = userAnswers[question.id];
              const isCorrect = userAnswer === question.correct_answer_index;

              return (
                <div
                  key={question.id}
                  className={`bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 border-2 ${
                    showResults
                      ? isCorrect
                        ? 'border-green-500'
                        : 'border-red-500'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start mb-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
                      {qIndex + 1}
                    </span>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white flex-1">
                      {question.question}
                    </h3>
                  </div>

                  <div className="space-y-2 ml-11">
                    {question.responses.map((response, rIndex) => {
                      const isSelected = userAnswer === rIndex;
                      const isCorrectAnswer = rIndex === question.correct_answer_index;

                      let buttonClass = 'w-full text-left px-4 py-3 rounded-lg border-2 transition-all ';
                      
                      if (showResults) {
                        if (isCorrectAnswer) {
                          buttonClass += 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-200';
                        } else if (isSelected && !isCorrect) {
                          buttonClass += 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200';
                        } else {
                          buttonClass += 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400';
                        }
                      } else {
                        if (isSelected) {
                          buttonClass += 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-200';
                        } else {
                          buttonClass += 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-gray-700 dark:text-gray-300';
                        }
                      }

                      return (
                        <button
                          key={rIndex}
                          onClick={() => handleAnswerSelect(question.id, rIndex)}
                          disabled={showResults}
                          className={buttonClass}
                        >
                          <div className="flex items-center">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 text-xs font-semibold">
                              {String.fromCharCode(65 + rIndex)}
                            </span>
                            <span className="flex-1">{response}</span>
                            {showResults && isCorrectAnswer && (
                              <span className="ml-2 text-green-600 dark:text-green-400">✓</span>
                            )}
                            {showResults && isSelected && !isCorrect && (
                              <span className="ml-2 text-red-600 dark:text-red-400">✗</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Submit/Results Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
              {!showResults ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length !== quiz.length || savingResults}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  {savingResults ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Results...
                    </span>
                  ) : (
                    'Submit Quiz'
                  )}
                </button>
              ) : (
                <div className="space-y-4">
                  {timeLeft === 0 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
                      <p className="text-yellow-700 dark:text-yellow-300 text-center">
                        ⏰ Time's up! Quiz auto-submitted.
                      </p>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      Quiz Complete!
                    </h3>
                    <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                      {calculateScore().correct} / {calculateScore().total}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {Math.round((calculateScore().correct / calculateScore().total) * 100)}% correct
                    </p>
                    {user && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                        ✓ Results saved to your account
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={handleReset}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Take Another Quiz
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
