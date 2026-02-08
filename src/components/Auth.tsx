import { useState, useEffect } from 'react';
import { User, Lock, Mail, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
}

interface AuthProps {
  onLogin: (user: UserData) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  // Clear messages when switching modes
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [isLoginMode]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!isLoginMode) {
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isLoginMode) {
      // Simulate login
      const users = JSON.parse(localStorage.getItem('pomodoro_users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        const userData: UserData = {
          id: user.id,
          email: user.email,
          name: user.name,
        };
        localStorage.setItem('pomodoro_current_user', JSON.stringify(userData));
        onLogin(userData);
      } else {
        setError('Invalid email or password');
      }
    } else {
      // Simulate signup
      const users = JSON.parse(localStorage.getItem('pomodoro_users') || '[]');

      if (users.some((u: any) => u.email === email)) {
        setError('An account with this email already exists');
        setIsLoading(false);
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name: name.trim(),
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('pomodoro_users', JSON.stringify(users));

      const userData: UserData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };
      localStorage.setItem('pomodoro_current_user', JSON.stringify(userData));

      setSuccess('Account created successfully! Logging you in...');

      setTimeout(() => {
        onLogin(userData);
      }, 1000);
    }

    setIsLoading(false);
  };

  const fillDemoCredentials = () => {
    setEmail('demo@example.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 flex items-center justify-center p-4 transition-all duration-300">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">🍅</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Pomodoro Timer</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLoginMode ? 'Welcome back! Sign in to continue.' : 'Create an account to get started.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50 dark:border-slate-700/50">
          {/* Toggle Tabs */}
          <div className="flex bg-gray-100/80 dark:bg-slate-700/50 rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${isLoginMode
                  ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
            >
              <span className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </span>
            </button>
            <button
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${!isLoginMode
                  ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
            >
              <span className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Sign Up
              </span>
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                  />
                </div>
              </div>
            )}

            {isLoginMode && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <button type="button" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isLoginMode ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                isLoginMode ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Demo Account Hint */}
          {isLoginMode && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={fillDemoCredentials}
                className="w-full py-2.5 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-xl transition-colors"
              >
                👆 Click to use demo account
              </button>
              <p className="text-center text-xs text-gray-400 mt-2">
                Email: demo@example.com | Password: password123
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
          >
            {isLoginMode ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
