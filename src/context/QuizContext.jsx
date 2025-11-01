import { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { saveQuizSession, getQuizSession, removeQuizSession } from '../lib/storage';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const { user } = useAuth();
  const [quizSession, setQuizSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);

    // Load saved session on mount
  useEffect(() => {
    if (!user?.username) return;
    
    const savedSession = getQuizSession(user.username);
    if (savedSession) {
      setQuizSession(savedSession);
      setQuestions(savedSession.questions || []);
      setCurrentQuestionIndex(savedSession.currentQuestionIndex || 0);
      setAnswers(savedSession.answers || []);
      setMarkedForReview(savedSession.markedForReview || []);
      setTimeRemaining(savedSession.timeRemaining || 0);
      setIsQuizActive(savedSession.isQuizActive || false);
    }
  }, [user?.username]);

    // Save session to localStorage whenever state changes
  useEffect(() => {
    if (quizSession && user?.username) {
      const sessionData = {
        ...quizSession,
        questions,
        currentQuestionIndex,
        answers,
        markedForReview,
        timeRemaining,
        isQuizActive
      };
      console.log('Saving session to localStorage:', {
        questionsCount: questions.length,
        currentQuestion: currentQuestionIndex,
        answersCount: answers.filter(a => a !== '').length,
        timeRemaining,
        isQuizActive,
        username: user.username
      });
      saveQuizSession(sessionData, user.username);
    }
  }, [quizSession, questions, currentQuestionIndex, answers, markedForReview, timeRemaining, isQuizActive, user?.username]);

  const startQuiz = async (config) => {
    try {
      // Fetch questions from OpenTDB API
      const response = await fetch(
        `https://opentdb.com/api.php?amount=${config.numQuestions}&difficulty=${config.difficulty.toLowerCase()}&type=multiple`
      );
      const data = await response.json();
      
      if (data.results) {
        const formattedQuestions = data.results.map((q, index) => ({
          id: index + 1,
          question: q.question,
          correct_answer: q.correct_answer,
          incorrect_answers: q.incorrect_answers,
          all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
        }));

        const session = {
          id: Date.now(),
          difficulty: config.difficulty,
          totalQuestions: config.numQuestions,
          timeLimit: parseInt(config.numQuestions) * 60, // 1 minute per question
          startTime: Date.now(),
          username: user?.username || 'anonymous'
        };

        setQuizSession(session);
        setQuestions(formattedQuestions);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setMarkedForReview([]);
        setTimeRemaining(session.timeLimit);
        setIsQuizActive(true);

        return true;
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      return false;
    }
  };

  const submitAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;  // Store answer as string directly
    setAnswers(newAnswers);
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const toggleMarkForReview = (questionIndex) => {
    setMarkedForReview(prev => {
      if (prev.includes(questionIndex)) {
        return prev.filter(i => i !== questionIndex);
      } else {
        return [...prev, questionIndex];
      }
    });
  };

  const finishQuiz = () => {
    console.log('🏁 finishQuiz called - setting isQuizActive to false');
    setIsQuizActive(false);
  };

  const loadQuizSession = (sessionData) => {
    console.log('🔄 Loading quiz session:', sessionData);
    setQuizSession(sessionData);
    setQuestions(sessionData.questions || []);
    setCurrentQuestionIndex(sessionData.currentQuestionIndex || 0);
    setAnswers(sessionData.answers || []);
    setMarkedForReview(sessionData.markedForReview || []);
    setTimeRemaining(sessionData.timeRemaining || 0);
    setIsQuizActive(sessionData.isQuizActive || false);
  };

  const clearSession = () => {
    setQuizSession(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setMarkedForReview([]);
    setTimeRemaining(0);
    setIsQuizActive(false);
    if (user?.username) {
      removeQuizSession(user.username);
    }
  };

  return (
    <QuizContext.Provider value={{
      quizSession,
      questions,
      currentQuestionIndex,
      answers,
      markedForReview,
      timeRemaining,
      isQuizActive,
      startQuiz,
      submitAnswer,
      goToQuestion,
      goToNextQuestion,
      goToPreviousQuestion,
      toggleMarkForReview,
      finishQuiz,
      loadQuizSession,
      clearSession,
      setTimeRemaining
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export { QuizContext };
