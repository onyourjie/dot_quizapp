import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import { useAuth } from '../hooks/useAuth';
import { useUserStats } from '../hooks/useUserStats';
import {
  Play,
  Zap,
  Trophy,
  Target,
  BarChart3,
  ListChecks,
  LogOut,
  Sparkles,
  Clock,
  Brain,
  Star,
  Calendar,
  TrendingUp
} from 'lucide-react';
import Swal from 'sweetalert2';

const QuizStart = () => {
  const [difficulty, setDifficulty] = useState('');
  const [numQuestions, setNumQuestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { startQuiz } = useQuiz();
  const { user, logout } = useAuth();
  const { userStats, getAverageScore, getRecentQuizzes } = useUserStats();
  const navigate = useNavigate();

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const questionCounts = ['5', '10', '15', '20'];

  const handleStartQuiz = async () => {
    if (!difficulty || !numQuestions) {
      await Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please select both difficulty level and number of questions',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold'
        }
      });
      return;
    }

    // Show confirmation with quiz details
    const result = await Swal.fire({
      title: 'Ready to Start?',
      html: `
          <div class="space-y-4 p-4">
            <div class="text-center mb-6">
              <div class="text-6xl mb-4"></div>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">Ready to Start?</h2>
            </div>
            <p class="text-gray-700 text-base mb-4">You're about to begin a quiz with:</p>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span class="text-gray-800 font-medium">Questions:</span>
                <span class="text-gray-900 font-bold">${numQuestions}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span class="text-gray-800 font-medium">Difficulty:</span>
                <span class="text-gray-900 font-bold capitalize">${difficulty}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span class="text-gray-800 font-medium">Time Limit:</span>
                <span class="text-gray-900 font-bold">${numQuestions} minutes</span>
              </div>
            </div>
            <p class="text-gray-600 text-sm mt-4">Tip: You can mark questions for review and navigate freely!</p>
          </div>
        `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Let\'s Go!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg',
        cancelButton: 'px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold'
      },
      width: '500px',
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      Swal.fire({
        title: 'Loading Questions...',
        text: 'Please wait while we prepare your quiz',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const success = await startQuiz({
        difficulty,
        numQuestions
      });
      
      Swal.close();
      
      if (success) {
        await Swal.fire({
          icon: 'success',
          title: 'Quiz Ready!',
          text: 'Let\'s test your knowledge!',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-2xl'
          }
        });
        navigate('/quiz');
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Failed to Load Quiz',
          text: 'Please check your internet connection and try again',
          confirmButtonText: 'Try Again',
          customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold'
          }
        });
        setIsLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Stay',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold',
        cancelButton: 'px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold'
      },
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      logout();
      await Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'See you soon!',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl'
        }
      });
      navigate('/login');
    }
  };

  const isFormValid = Boolean(difficulty && numQuestions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/20 bg-white/60 backdrop-blur-lg shadow-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">QuizMaster</span>
              <p className="text-xs text-gray-600">Test Your Knowledge</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/80 rounded-xl border border-indigo-100">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">{user?.name || user?.username || 'User'}</p>
                <p className="text-xs text-gray-600">@{user?.username}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all hover:scale-105"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/30 relative">
              <Play className="h-12 w-12 fill-white text-white" />
              <Sparkles className="h-6 w-6 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Start Your Quiz Journey
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-700">
              Configure your quiz settings and challenge yourself with questions tailored to your skill level. 🚀
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                    {userStats.totalQuestions}
                  </p>
                  <p className="text-sm text-gray-600">Questions Solved</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
                  <Trophy className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {getAverageScore()}%
                  </p>
                  <p className="text-sm text-gray-600">Average Score</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
                  <Star className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {userStats.totalQuizzes}
                  </p>
                  <p className="text-sm text-gray-600">Quizzes Completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Configuration Card */}
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <div className="overflow-hidden rounded-3xl border-2 border-white/40 bg-white/80 backdrop-blur-lg shadow-2xl">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-10 text-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                  <div className="relative">
                    <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
                      <Target className="h-8 w-8" />
                      Quiz Configuration
                    </h2>
                    <p className="mt-2 text-base text-indigo-100">Customize your perfect learning experience</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="space-y-8 px-8 py-10">
                  {/* Difficulty Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <label className="text-lg font-bold text-gray-900">Difficulty Level</label>
                        <p className="text-sm text-gray-600">Choose your challenge intensity</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {difficulties.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDifficulty(level)}
                          className={`relative overflow-hidden rounded-2xl border-2 p-6 text-center transition-all hover:scale-105 ${
                            difficulty === level
                              ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg'
                              : 'border-slate-200 bg-white hover:border-indigo-300'
                          }`}
                        >
                          <div className={`text-3xl mb-2 ${
                            difficulty === level ? 'scale-110' : ''
                          } transition-transform`}>
                            {level === 'Easy' ? '😊' : level === 'Medium' ? '🤔' : '🔥'}
                          </div>
                          <p className={`font-bold ${
                            difficulty === level ? 'text-indigo-600' : 'text-gray-800'
                          }`}>
                            {level}
                          </p>
                          {difficulty === level && (
                            <div className="absolute top-2 right-2">
                              <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center">
                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question Count Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <ListChecks className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <label className="text-lg font-bold text-gray-900">Number of Questions</label>
                        <p className="text-sm text-gray-700">More questions = Better practice</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                      {questionCounts.map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setNumQuestions(count)}
                          className={`relative overflow-hidden rounded-2xl border-2 p-6 text-center transition-all hover:scale-105 ${
                            numQuestions === count
                              ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                              : 'border-slate-200 bg-white hover:border-purple-300'
                          }`}
                        >
                          <p className={`text-3xl font-bold mb-1 ${
                            numQuestions === count ? 'text-purple-600' : 'text-slate-700'
                          }`}>
                            {count}
                          </p>
                          <p className="text-xs text-gray-700">questions</p>
                          {numQuestions === count && (
                            <div className="absolute top-2 right-2">
                              <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center">
                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Estimate */}
                  {numQuestions && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-indigo-100">
                      <div className="flex items-center gap-4">
                        <Clock className="h-10 w-10 text-indigo-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Estimated Time</p>
                          <p className="text-2xl font-bold text-indigo-600">{numQuestions} minutes</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Start Button */}
                  <button
                    onClick={handleStartQuiz}
                    disabled={!isFormValid || isLoading}
                    className="relative w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group hover:scale-[1.02]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          Loading Questions...
                        </>
                      ) : (
                        <>
                          <Play className="w-6 h-6 fill-white" />
                          Start Quiz Now!
                          <Sparkles className="w-5 h-5" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>

                  {/* Tips */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-amber-800">
                      <span className="font-bold">💡 Pro Tip:</span> You can navigate between questions, mark them for review, and change your answers anytime during the quiz!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Quiz History */}
          {getRecentQuizzes().length > 0 && (
            <div className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Recent Quiz History
                </h2>
                <p className="text-gray-700">Track your progress and improvement</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getRecentQuizzes().map((quiz) => {
                  const difficultyConfig = {
                    Easy: { emoji: '😊', color: 'from-emerald-400 to-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', borderColor: 'border-emerald-200' },
                    Medium: { emoji: '🤔', color: 'from-amber-400 to-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-600', borderColor: 'border-amber-200' },
                    Hard: { emoji: '🔥', color: 'from-red-400 to-red-500', bgColor: 'bg-red-50', textColor: 'text-red-600', borderColor: 'border-red-200' }
                  };
                  const config = difficultyConfig[quiz.difficulty] || difficultyConfig.Medium;
                  const timeAgo = new Date(quiz.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                  return (
                    <div 
                      key={quiz.id}
                      className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 ${config.borderColor} shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl`}>
                          {config.emoji}
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${config.bgColor} ${config.textColor} text-xs font-bold`}>
                            <Calendar className="h-3 w-3" />
                            {timeAgo}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-800 mb-2">
                        {quiz.difficulty} Quiz
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Questions:</span>
                          <span className="font-semibold text-gray-900">{quiz.totalQuestions}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Correct:</span>
                          <span className="font-semibold text-emerald-600">{quiz.correctAnswers}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Wrong:</span>
                          <span className="font-semibold text-red-600">{quiz.wrongAnswers}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Score</span>
                          <div className="flex items-center gap-2">
                            <TrendingUp className={`h-4 w-4 ${config.textColor}`} />
                            <span className={`text-2xl font-bold ${config.textColor}`}>
                              {quiz.percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default QuizStart;
