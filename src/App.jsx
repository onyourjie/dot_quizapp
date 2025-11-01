import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { QuizProvider } from './context/QuizContext';
import { UserStatsProvider } from './context/UserStatsContext';
import Login from './components/Login';
import QuizStart from './components/QuizStart';
import Quiz from './components/Quiz';
import QuizResult from './components/QuizResult';
import ResumeQuizModal from './components/ResumeQuizModal';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <UserStatsProvider>
        <QuizProvider>
          <Router>
            <ResumeQuizModal />
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <QuizStart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz" 
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/result" 
              element={
                <ProtectedRoute>
                  <QuizResult />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </QuizProvider>
      </UserStatsProvider>
    </AuthProvider>
  );
}

export default App;