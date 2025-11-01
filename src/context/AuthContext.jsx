import { createContext, useState, useEffect } from 'react';
import { getUser, saveUser, removeUser } from '../lib/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    saveUser(userData);
  };

  const logout = () => {
    setUser(null);
    removeUser();
    localStorage.removeItem('quiz_session'); // Clear quiz session
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
