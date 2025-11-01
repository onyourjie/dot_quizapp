import { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { saveUserStats, getUserStats } from '../lib/storage';

const UserStatsContext = createContext();

export const UserStatsProvider = ({ children }) => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    totalQuizzes: 0,
    quizHistory: []
  });

  // Load stats from localStorage when user changes
  useEffect(() => {
    if (user?.username) {
      const savedStats = getUserStats(user.username);
      setUserStats(savedStats);
    } else {
      // Reset stats when no user
      setUserStats({
        totalQuestions: 0,
        correctAnswers: 0,
        totalQuizzes: 0,
        quizHistory: []
      });
    }
  }, [user?.username]);

  // Save stats to localStorage whenever it changes
  useEffect(() => {
    if (user?.username && userStats.totalQuizzes > 0) {
      saveUserStats(userStats, user.username);
    }
  }, [userStats, user?.username]);

  // Add quiz result to history
  const addQuizResult = (quizData) => {
    console.log('📝 Adding quiz result:', quizData);

    // Generate unique ID based on timestamp and quiz details
    const uniqueId = `${Date.now()}_${quizData.difficulty}_${quizData.totalQuestions}_${quizData.correctAnswers}`;

    // Prevent duplicate entries - check by unique characteristics
    const isDuplicate = userStats.quizHistory.some(quiz => {
      const timeDiff = Math.abs(new Date(quiz.date).getTime() - Date.now());
      return timeDiff < 10000 && // Within 10 seconds
             quiz.difficulty === quizData.difficulty &&
             quiz.totalQuestions === quizData.totalQuestions &&
             quiz.correctAnswers === quizData.correctAnswers &&
             quiz.percentage === quizData.percentage;
    });

    if (isDuplicate) {
      console.log('Duplicate quiz detected - skipping');
      return;
    }

    const newQuizHistory = {
      id: uniqueId,
      date: new Date().toISOString(),
      difficulty: quizData.difficulty,
      totalQuestions: quizData.totalQuestions,
      correctAnswers: quizData.correctAnswers,
      wrongAnswers: quizData.wrongAnswers,
      unanswered: quizData.unanswered,
      score: quizData.score,
      percentage: quizData.percentage,
      timeSpent: quizData.timeSpent || 0
    };

    console.log('Adding unique quiz to history:', newQuizHistory);

    setUserStats(prev => {
      const newHistory = [newQuizHistory, ...prev.quizHistory].slice(0, 20);
      return {
        totalQuestions: prev.totalQuestions + quizData.totalQuestions,
        correctAnswers: prev.correctAnswers + quizData.correctAnswers,
        totalQuizzes: prev.totalQuizzes + 1,
        quizHistory: newHistory
      };
    });
  };

  // Get average score
  const getAverageScore = () => {
    if (userStats.quizHistory.length === 0) return 0;
    const totalPercentage = userStats.quizHistory.reduce((sum, quiz) => sum + quiz.percentage, 0);
    return Math.round(totalPercentage / userStats.quizHistory.length);
  };

  // Get recent quizzes (last 3)
  const getRecentQuizzes = () => {
    return userStats.quizHistory.slice(0, 3);
  };

  // Reset all stats
  const resetStats = () => {
    setUserStats({
      totalQuestions: 0,
      correctAnswers: 0,
      totalQuizzes: 0,
      quizHistory: []
    });
    localStorage.removeItem('userStats');
  };

  return (
    <UserStatsContext.Provider
      value={{
        userStats,
        addQuizResult,
        getAverageScore,
        getRecentQuizzes,
        resetStats
      }}
    >
      {children}
    </UserStatsContext.Provider>
  );
};

export { UserStatsContext };
