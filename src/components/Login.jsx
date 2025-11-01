import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Lock, Eye, EyeOff, Zap, Sparkles } from 'lucide-react';
import { errorAlert, toast } from '../lib/sweetalert';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !password) {
      await errorAlert('Missing Information', 'Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      await errorAlert('Invalid Username', 'Username must be at least 3 characters long');
      return;
    }

    if (password.length < 4) {
      await errorAlert('Invalid Password', 'Password must be at least 4 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate login process (in real app, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user object with username
      const user = {
        username,
        name: username, // Use username as display name
        isAuthenticated: true
      };
      
      // Set user in auth context
      login(user);
      
      // Show success message
      toast('success', `Welcome back, ${username}!`);
      
      // Navigate to quiz start
      navigate('/');
    } catch {
      await errorAlert('Login Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/30 mb-6 relative">
            <Zap className="h-10 w-10 text-white" />
            <Sparkles className="h-5 w-5 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome to QuizMaster
          </h1>
          <p className="text-gray-700 text-lg">Sign in to start your quiz journey ✨</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl shadow-slate-300/50 p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                <User className="w-4 h-4 text-indigo-500" />
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition"></div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="relative w-full px-4 py-4 pl-12 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition bg-white"
                  placeholder="Enter your username"
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                <Lock className="w-4 h-4 text-indigo-500" />
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition"></div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative w-full px-4 py-4 pl-12 pr-12 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition bg-white"
                  placeholder="Enter your password"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-8 text-center space-y-3">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
              <p className="text-sm font-semibold text-gray-800 mb-2">Demo Mode</p>
              <p className="text-xs text-gray-700">
                Use username and password (min 4 chars) to login and explore the quiz platform!
              </p>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-700 mt-6">
          By signing in, you agree to our <span className="text-indigo-600 font-semibold">Terms</span> and <span className="text-indigo-600 font-semibold">Privacy Policy</span>
        </p>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;
