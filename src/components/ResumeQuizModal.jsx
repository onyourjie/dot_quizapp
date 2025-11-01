import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQuiz } from '../hooks/useQuiz';
import { getQuizSession, removeQuizSession } from '../lib/storage';

const ResumeQuizModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [savedQuiz, setSavedQuiz] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loadQuizSession, clearSession } = useQuiz();

  useEffect(() => {
    if (!user?.username) return;

    // Check for saved quiz session when user logs in
    const checkSavedQuiz = () => {
      const sessionData = getQuizSession(user.username);
      
      if (sessionData && 
          sessionData.isQuizActive && 
          sessionData.questions && 
          sessionData.questions.length > 0) {
        
        console.log('🔍 Found saved quiz session:', sessionData);
        setSavedQuiz(sessionData);
        setShowModal(true);
      }
    };

    // Small delay to ensure components are loaded
    const timer = setTimeout(checkSavedQuiz, 1000);
    return () => clearTimeout(timer);
  }, [user?.username]);

  const handleContinueQuiz = () => {
    console.log('Continuing saved quiz');
    
    // Load the saved session
    loadQuizSession(savedQuiz);
    
    // Close modal and navigate
    setShowModal(false);
    navigate('/quiz');
  };

  const handleStartNew = () => {
    console.log('Starting new quiz - clearing saved session');
    
    // Clear the saved session
    clearSession();
    if (user?.username) {
      removeQuizSession(user.username);
    }
    
    // Close modal and stay on home
    setShowModal(false);
  };

  if (!showModal || !savedQuiz) return null;

  const progress = Math.round(((savedQuiz.currentQuestionIndex + 1) / savedQuiz.questions.length) * 100);
  const answeredCount = savedQuiz.answers ? savedQuiz.answers.filter(a => a !== '').length : 0;
  const timeMinutes = Math.floor((savedQuiz.timeRemaining || 0) / 60);
  const timeSeconds = (savedQuiz.timeRemaining || 0) % 60;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Quiz Belum Selesai</h2>
          <p className="text-gray-600">Kamu memiliki quiz yang belum diselesaikan</p>
        </div>

        {/* Quiz Details */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Difficulty:</span>
              <span className="font-semibold text-blue-600 capitalize">{savedQuiz.difficulty}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Progress:</span>
              <span className="font-semibold text-green-600">
                {savedQuiz.currentQuestionIndex + 1}/{savedQuiz.questions.length} ({progress}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Answered:</span>
              <span className="font-semibold text-emerald-600">{answeredCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Time Left:</span>
              <span className="font-semibold text-orange-600">
                {timeMinutes}:{timeSeconds.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 mb-6">
          Mau lanjutkan quiz yang tadi atau mulai quiz baru?
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleContinueQuiz}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Lanjutkan Quiz
          </button>
          <button
            onClick={handleStartNew}
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            Mulai Quiz Baru
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeQuizModal;