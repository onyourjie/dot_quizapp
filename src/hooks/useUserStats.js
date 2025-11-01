import { useContext } from 'react';
import { UserStatsContext } from '../context/UserStatsContext';

export const useUserStats = () => {
  const context = useContext(UserStatsContext);
  if (!context) {
    throw new Error('useUserStats must be used within UserStatsProvider');
  }
  return context;
};