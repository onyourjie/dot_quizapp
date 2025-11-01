import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import { useAuth } from '../hooks/useAuth';
import Timer from './Timer';
import { LogOut, Zap, ChevronLeft, ChevronRight, Flag, CheckCircle2, X } from 'lucide-react';
import Swal from 'sweetalert2';

const Quiz = () => {
  const { 
    questions, 
    currentQuestionIndex, 
    answers,
    markedForReview,
    quizSession,
    submitAnswer,
    goToQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    toggleMarkForReview,
    finishQuiz,
    isQuizActive
  } = useQuiz();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showQuestionOverview, setShowQuestionOverview] = useState(false);

  useEffect(() => {
    // Check if quiz is active, if not redirect to home
    // But don't redirect if quiz was just finished (data still exists but isQuizActive = false)
    if (!questions.length) {
      console.log('Quiz.jsx: No questions found, redirecting to home');
      navigate('/');
    }
    // Note: We removed isQuizActive check to allow finishing quiz properly
  }, [questions, navigate]);

  // Load current answer if exists
  useEffect(() => {
    const currentAnswer = answers[currentQuestionIndex];
    if (currentAnswer) {
      setSelectedAnswer(currentAnswer);
    } else {
      setSelectedAnswer('');
    }
  }, [currentQuestionIndex, answers]);

  if (!questions.length || !isQuizActive) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = answers.filter(a => a && a !== '').length;
  const isMarked = markedForReview.includes(currentQuestionIndex);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    submitAnswer(answer);
    
    // Auto-advance to next question after short delay (requirement f)
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        goToNextQuestion();
      } else {
        // If this is the last question, don't auto-finish
        // Let user manually finish or wait for timer
        console.log('Last question answered, waiting for manual finish or timer');
      }
    }, 800); // Short delay to show the selection before advancing
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      goToNextQuestion();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      goToPreviousQuestion();
    }
  };

  const handleFinishQuiz = async () => {
    // Calculate quiz statistics
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const markedQuestions = Object.values(markedForReview).filter(Boolean).length;
    const unansweredQuestions = totalQuestions - answeredQuestions;

    const result = await Swal.fire({
      title: 'Finish Quiz?',
      html: `
        <div class="text-left space-y-3 mt-4">
          <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span class="text-gray-700">Total Questions:</span>
            <span class="font-bold text-blue-600">${totalQuestions}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span class="text-gray-700">Answered:</span>
            <span class="font-bold text-green-600">${answeredQuestions}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <span class="text-gray-700">Marked for Review:</span>
            <span class="font-bold text-yellow-600">${markedQuestions}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <span class="text-gray-700">Unanswered:</span>
            <span class="font-bold text-red-600">${unansweredQuestions}</span>
          </div>
        </div>
        <p class="text-gray-600 mt-4 text-sm">Are you sure you want to finish the quiz?</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Finish Quiz',
      cancelButtonText: 'Continue Quiz',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200',
        cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded-xl transition-all duration-200'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      console.log('🎯 Finishing quiz...');
      console.log('Before finishQuiz - questions:', questions.length);
      console.log('Before finishQuiz - answers:', answers.length);
      console.log('Before finishQuiz - quizSession:', quizSession);
      
      finishQuiz();
      
      console.log('🚀 Navigating to /result...');
      navigate('/result');
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Your quiz progress will be lost. Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Stay',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200',
        cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded-xl transition-all duration-200'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      logout();
      navigate('/login');
    }
  };

  const handleQuestionClick = (index) => {
    goToQuestion(index);
    setShowQuestionOverview(false);
  };

  // Decode HTML entities
  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const getQuestionStatus = (index) => {
    if (answers[index]) return 'answered';
    if (markedForReview.includes(index)) return 'marked';
    return 'unanswered';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f6ff] via-white to-white">
      {/* Header */}
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto flex h-16 sm:h-20 w-full max-w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-indigo-600">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-semibold text-gray-900">QuizMaster</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Timer />
            <button
              onClick={handleLogout}
              className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-slate-100 hover:bg-slate-200 transition"
              title="Logout"
            >
              <LogOut className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:pt-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            
            {/* Main Quiz Area */}
            <div className="lg:col-span-8 space-y-4">
              {/* Progress Info */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-gray-800">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-slate-300"></span>
                    <span className="text-sm font-semibold text-indigo-600">
                      {answeredCount} Answered
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 sm:px-6 py-4 sm:py-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-indigo-100">
                        {quizSession?.difficulty} Level
                      </span>
                      <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-indigo-300"></span>
                      <span className="text-xs sm:text-sm font-semibold text-indigo-100">
                        Multiple Choice
                      </span>
                    </div>
                    <button
                      onClick={() => toggleMarkForReview(currentQuestionIndex)}
                      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                        isMarked
                          ? 'bg-amber-500 text-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <Flag className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">{isMarked ? 'Marked' : 'Mark for Review'}</span>
                    </button>
                  </div>
                  <h2 className="text-base sm:text-xl font-semibold text-white leading-relaxed">
                    {decodeHTML(currentQuestion.question)}
                  </h2>
                </div>

                {/* Answers */}
                <div className="p-4 sm:p-6 space-y-3">
                  {currentQuestion.all_answers.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(answer)}
                      className={`w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 transition-all font-medium ${
                        selectedAnswer === answer
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200'
                          : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm font-bold ${
                          selectedAnswer === answer
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-sm sm:text-base">{decodeHTML(answer)}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="border-t border-slate-200 p-4 sm:p-6 bg-slate-50">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-gray-800 bg-white border-2 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <button
                      onClick={() => setShowQuestionOverview(!showQuestionOverview)}
                      className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-semibold text-indigo-600 bg-white border-2 border-indigo-200 hover:bg-indigo-50 transition text-xs sm:text-sm"
                    >
                      Overview
                    </button>

                    {currentQuestionIndex === questions.length - 1 ? (
                      <button
                        onClick={handleFinishQuiz}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition text-sm sm:text-base"
                      >
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Finish Quiz</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition text-sm sm:text-base"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Question Overview Sidebar - Desktop */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Question Overview</h3>
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {questions.map((_, index) => {
                    const status = getQuestionStatus(index);
                    const isCurrent = index === currentQuestionIndex;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuestionClick(index)}
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm font-semibold transition ${
                          isCurrent
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                            : status === 'answered'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : status === 'marked'
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-indigo-600"></div>
                                        <span className="text-gray-700">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                    <span className="text-gray-700">Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-gray-700">Marked ({markedForReview.length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-700">Not Answered ({totalQuestions - answeredCount})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Question Overview Modal - Mobile */}
      {showQuestionOverview && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Question Overview</h3>
              <button
                onClick={() => setShowQuestionOverview(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(index)}
                      className={`aspect-square flex items-center justify-center rounded-lg text-sm font-semibold transition ${
                        isCurrent
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                          : status === 'answered'
                          ? 'bg-emerald-100 text-emerald-700'
                          : status === 'marked'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-indigo-600"></div>
                  <span className="text-gray-700">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-100 border-2 border-emerald-400"></div>
                  <span className="text-gray-700">Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-100 border-2 border-amber-400"></div>
                  <span className="text-gray-700">Marked ({markedForReview.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-300"></div>
                  <span className="text-gray-700">Not Answered ({totalQuestions - answeredCount})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
