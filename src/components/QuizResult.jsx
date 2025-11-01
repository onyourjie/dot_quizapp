import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import { useAuth } from '../hooks/useAuth';
import { useUserStats } from '../hooks/useUserStats';
import { Trophy, Target, CheckCircle, XCircle, Clock, Zap, RotateCcw, Home, Award, TrendingUp } from 'lucide-react';
import Swal from 'sweetalert2';

const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const QuizResult = () => {
  const { questions, answers, quizSession, clearSession } = useQuiz();
  const { user, logout } = useAuth();
  const { addQuizResult } = useUserStats();
  const navigate = useNavigate();
  const hasAddedResult = useRef(false);
  
  // Store quiz data locally to prevent loss after clearSession
  const [localQuizData, setLocalQuizData] = useState(null);

  useEffect(() => {
    console.log('QuizResult mounted!');
    console.log('quizSession:', quizSession);
    console.log('questions.length:', questions.length);
    console.log('answers.length:', answers.length);
    
    // if no quiz session or questions, redirect to start
    // but allow access if quiz was just finished (isQuizActive = false but data exists)
    if (!quizSession || !questions.length) {
      console.log('No quiz data found, redirecting to start');
      console.log('Missing quizSession:', !quizSession);
      console.log('Missing questions:', !questions.length);
      navigate('/');
      return;
    }
    
    console.log('Quiz data found, showing results');

    // Store data locally BEFORE any processing
    setLocalQuizData({
      questions: [...questions],
      answers: [...answers],
      quizSession: { ...quizSession }
    });

    // Prevent duplicate result saving
    if (hasAddedResult.current) {
      console.log('Result already added, skipping');
      return;
    }
    
    // Calculate results properly
    const totalQuestions = questions.length;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;

    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (!userAnswer || userAnswer === '') {
        unanswered++;
      } else if (userAnswer === question.correct_answer) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }
    });

    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    addQuizResult({
      difficulty: quizSession.difficulty || 'Medium',
      totalQuestions,
      correctAnswers: correctAnswers,
      wrongAnswers: wrongAnswers,
      unanswered: unanswered,
      score: `${correctAnswers}/${totalQuestions}`,
      percentage,
      timeSpent: quizSession.timeSpent || 0
    });

    hasAddedResult.current = true;
    console.log('Quiz result added to user stats');

    const getIcon = () => {
      if (percentage >= 80) return 'success';
      if (percentage >= 60) return 'info';
      return 'warning';
    };

    const getMessage = () => {
      if (percentage >= 80) return 'Excellent work!';
      if (percentage >= 60) return 'Good job!';
      return 'Keep practicing!';
    };

    Swal.fire({
      icon: getIcon(),
      title: 'Quiz Completed!',
      html: `
        <div class="space-y-4 p-4">
          <div class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ${correctAnswers}/${totalQuestions}
          </div>
          <p class="text-gray-700">${getMessage()}</p>
          <div class="bg-slate-50 rounded-xl p-4">
            <div class="text-3xl font-bold text-slate-700">${percentage}%</div>
            <p class="text-sm text-gray-700">Success Rate</p>
          </div>
        </div>
      `,
      confirmButtonText: 'View Results',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg'
      },
      width: '450px',
    }).then(() => {
      // Clear the quiz session after showing results
      clearSession();
      console.log('🧹 Quiz session cleared after showing results');
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Use local data if available, otherwise use context data
  const displayQuestions = localQuizData?.questions || questions;
  const displayAnswers = localQuizData?.answers || answers;
  const displaySession = localQuizData?.quizSession || quizSession;

  if (!displayQuestions.length || !displaySession) {
    console.log('Rendering null - no quiz data');
    return null;
  }

  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  displayQuestions.forEach((question, index) => {
    const userAnswer = displayAnswers[index];
    if (!userAnswer || userAnswer === '') {
      unansweredCount++;
    } else if (userAnswer === question.correct_answer) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const totalQuestions = displayQuestions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const getPerformanceLevel = () => {
    if (percentage >= 80) return { level: 'Excellent', color: 'emerald', icon: Trophy, message: 'Outstanding performance!' };
    if (percentage >= 60) return { level: 'Good', color: 'indigo', icon: Award, message: 'Well done!' };
    if (percentage >= 40) return { level: 'Fair', color: 'amber', icon: Target, message: 'Keep practicing!' };
    return { level: 'Needs Improvement', color: 'rose', icon: TrendingUp, message: 'Don\'t give up!' };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;

  const handleRetakeQuiz = () => {
    clearSession();
    navigate('/');
  };

  const handleGoHome = () => {
    clearSession();
    navigate('/');
  };

  const handleLogout = () => {
    clearSession();
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f6ff] via-white to-white">
      {/* Header */}
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-20 w-full max-w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">QuizMaster</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 hidden sm:inline">
              {user?.name || user?.email}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        <div className="mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
          {/* Result Header */}
          <div className="text-center mb-12">
            <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-${performance.color}-100`}>
              <PerformanceIcon className={`h-12 w-12 text-${performance.color}-600`} />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Quiz Complete!
            </h1>
            <p className="text-xl text-gray-800">
              {performance.level} Performance
            </p>
          </div>

          {/* Score Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/40 border border-slate-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-8 text-center">
              <p className="text-indigo-100 text-sm font-semibold mb-2">Your Score</p>
              <div className="text-6xl font-bold text-white mb-2">
                {percentage}%
              </div>
              <p className="text-indigo-100">
                {correctCount} out of {totalQuestions} correct
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-6 sm:p-10">
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-emerald-700">{correctCount}</div>
                <div className="text-sm text-emerald-600 font-medium">Correct</div>
              </div>

              <div className="text-center p-4 bg-rose-50 rounded-xl">
                <XCircle className="h-8 w-8 text-rose-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-rose-700">{wrongCount}</div>
                <div className="text-sm text-rose-600 font-medium">Wrong</div>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <Clock className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-700">{unansweredCount}</div>
                <div className="text-sm text-slate-600 font-medium">Unanswered</div>
              </div>
            </div>
          </div>

          {/* Quiz Details */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quiz Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-gray-700">Difficulty Level</span>
                <span className="font-semibold text-gray-900">{displaySession.difficulty}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-gray-700">Total Questions</span>
                <span className="font-semibold text-gray-900">{totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Questions Answered</span>
                <span className="font-semibold text-gray-900">{displayAnswers.length}</span>
              </div>
            </div>
          </div>

          {/* Review Answers */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Review Jawaban</h3>
            <div className="space-y-4">
              {displayQuestions.map((question, index) => {
                const userAnswer = displayAnswers[index];
                const isAnswered = userAnswer !== null && userAnswer !== undefined && userAnswer !== '';
                const isCorrect = isAnswered && userAnswer === question.correct_answer;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      !isAnswered
                        ? 'border-gray-300 bg-gray-50'
                        : isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          !isAnswered
                            ? 'bg-gray-300 text-gray-700'
                            : isCorrect
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-2">
                          {decodeHTML(question.question)}
                        </p>
                        <div className="space-y-1 text-sm">
                          {isAnswered && (
                            <p>
                              <span className="font-medium">Jawaban Kamu:</span>{' '}
                              <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                                {decodeHTML(userAnswer)}
                              </span>
                            </p>
                          )}
                          {!isCorrect && isAnswered && (
                            <p>
                              <span className="font-medium">Jawaban Benar:</span>{' '}
                              <span className="text-green-700">
                                {decodeHTML(question.correct_answer)}
                              </span>
                            </p>
                          )}
                          {!isAnswered && (
                            <p className="text-gray-600 italic">Tidak dijawab</p>
                          )}
                        </div>
                      </div>
                      <span className="flex-shrink-0 text-2xl">
                        {!isAnswered ? '⏭️' : isCorrect ? '✅' : '❌'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={handleRetakeQuiz}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-400/40"
            >
              <RotateCcw className="h-5 w-5" />
              Retake Quiz
            </button>

            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition"
            >
              <Home className="h-5 w-5" />
              Go Home
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizResult;
