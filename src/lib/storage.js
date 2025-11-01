// Storage utility functions for Quiz App
const STORAGE_KEYS = {
  USER: 'quiz_user',
  QUIZ_SESSION: 'quiz_session',
  USER_STATS: 'quiz_user_stats'
};

// Helper function to get user-specific key
const getUserSpecificKey = (baseKey, username) => {
  if (!username) return baseKey;
  return `${baseKey}_${username}`;
};

// User Storage
export const saveUser = (user) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

export const getUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user from localStorage:', error);
    return null;
  }
};

export const removeUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error removing user from localStorage:', error);
  }
};

// Quiz Session Storage (user-specific)
export const saveQuizSession = (session, username) => {
  try {
    const key = getUserSpecificKey(STORAGE_KEYS.QUIZ_SESSION, username);
    localStorage.setItem(key, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving quiz session to localStorage:', error);
  }
};

export const getQuizSession = (username) => {
  try {
    const key = getUserSpecificKey(STORAGE_KEYS.QUIZ_SESSION, username);
    const session = localStorage.getItem(key);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error getting quiz session from localStorage:', error);
    return null;
  }
};

export const removeQuizSession = (username) => {
  try {
    const key = getUserSpecificKey(STORAGE_KEYS.QUIZ_SESSION, username);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing quiz session from localStorage:', error);
  }
};

// User Stats Storage (user-specific)
export const saveUserStats = (stats, username) => {
  try {
    const key = getUserSpecificKey(STORAGE_KEYS.USER_STATS, username);
    localStorage.setItem(key, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving user stats to localStorage:', error);
  }
};

export const getUserStats = (username) => {
  try {
    const key = getUserSpecificKey(STORAGE_KEYS.USER_STATS, username);
    const stats = localStorage.getItem(key);
    return stats ? JSON.parse(stats) : { quizHistory: [], totalQuizzes: 0, averageScore: 0 };
  } catch (error) {
    console.error('Error getting user stats from localStorage:', error);
    return { quizHistory: [], totalQuizzes: 0, averageScore: 0 };
  }
};

export const clearAllStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
    // Clear all user-specific data for current user
    const user = getUser();
    if (user) {
      removeQuizSession(user.username);
      const userStatsKey = getUserSpecificKey(STORAGE_KEYS.USER_STATS, user.username);
      localStorage.removeItem(userStatsKey);
    }
  } catch (error) {
    console.error('Error clearing all storage:', error);
  }
};

// Check if saved quiz exists for current user
export const hasSavedQuiz = (username) => {
  const savedSession = getQuizSession(username);
  return savedSession && 
         savedSession.isQuizActive && 
         savedSession.username === username &&
         savedSession.questions && 
         savedSession.questions.length > 0;
};