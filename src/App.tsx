import { useState, useCallback, useEffect } from 'react';
import { PomodoroTimer } from './components/PomodoroTimer';
import { Dashboard } from './components/Dashboard';
import { Auth } from './components/Auth';
import { api } from './api';
import { Coffee, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { Toaster } from 'react-hot-toast';

type Mode = 'Focus' | 'Short Break' | 'Long Break';

interface UserData {
  id: string;
  email: string;
  name: string;
}

export function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('pomodoro_current_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('pomodoro_current_user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = useCallback((userData: UserData) => {
    setUser(userData);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('pomodoro_current_user');
    setUser(null);
  }, []);

  const handleSessionComplete = useCallback(async (mode: Mode, duration: number) => {
    // Save to our mocked backend
    await api.saveSession(mode, duration);
    // Trigger dashboard refresh by updating state
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-rose-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300">
      <Toaster position="top-center" />
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Coffee className="w-7 h-7 text-rose-500" />
              <span className="font-bold text-xl text-slate-900 dark:text-white">Focus Tracker</span>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-rose-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Stay focused, take breaks, and track your productivity with your personal dashboard.
          </p>
        </header>

        <main className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-start justify-center">
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <PomodoroTimer onSessionComplete={handleSessionComplete} />
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-start">
            <Dashboard refreshTrigger={refreshTrigger} userId={user.id} />
          </div>
        </main>
      </div>
    </div>
  );
}
