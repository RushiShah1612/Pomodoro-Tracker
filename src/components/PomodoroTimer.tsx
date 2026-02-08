import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { playBeep } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import toast from 'react-hot-toast';
import { Settings } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

type Mode = 'Focus' | 'Short Break' | 'Long Break';

const DEFAULT_DURATIONS: Record<Mode, number> = {
  'Focus': 25 * 60,
  'Short Break': 5 * 60,
  'Long Break': 15 * 60,
};

interface Props {
  onSessionComplete: (mode: Mode, duration: number) => void;
}

export const PomodoroTimer: React.FC<Props> = ({ onSessionComplete }) => {
  const [durations, setDurations] = useState<Record<Mode, number>>(() => {
    const saved = localStorage.getItem('pomodoro_durations');
    return saved ? JSON.parse(saved) : DEFAULT_DURATIONS;
  });

  const [currentMode, setCurrentMode] = useState<Mode>('Focus');
  const [timeLeft, setTimeLeft] = useState(durations['Focus']);
  const [isActive, setIsActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Helper to format MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Switch mode function
  const handleModeChange = (mode: Mode) => {
    setCurrentMode(mode);
    setTimeLeft(durations[mode]);
    setIsActive(false);
  };

  // Update durations
  const handleUpdateDurations = (newDurations: Record<Mode, number>) => {
    setDurations(newDurations);
    localStorage.setItem('pomodoro_durations', JSON.stringify(newDurations));
    if (!isActive) {
      setTimeLeft(newDurations[currentMode]);
    }
  };

  // Reset timer
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(durations[currentMode]);
  };

  // Toggle play/pause
  const toggleTimer = () => {
    setIsActive((prev) => !prev);
  };

  // The main countdown effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer finished!
      setIsActive(false);
      playBeep();
      onSessionComplete(currentMode, durations[currentMode]);

      if (currentMode === 'Focus') {
        triggerConfetti();
        toast.success("Focus session complete! Take a break.", {
          icon: '🎉',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        handleModeChange('Short Break');
      } else {
        toast("Focus time! Let's get back to work.", {
          icon: '💪',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        handleModeChange('Focus');
      }
    }

    // Cleanup interval on unmount or dependency change to prevent memory leaks
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, timeLeft, currentMode, onSessionComplete]);

  // Update document title dynamically
  useEffect(() => {
    const titleString = isActive
      ? `(${formatTime(timeLeft)}) ${currentMode} - Pomodoro`
      : 'Pomodoro Timer';
    document.title = titleString;

    // Cleanup title on unmount
    return () => {
      document.title = 'Pomodoro Timer';
    };
  }, [timeLeft, isActive, currentMode]);

  // Theme colors per mode
  const bgColors: Record<Mode, string> = {
    'Focus': 'bg-rose-500 hover:bg-rose-600 text-rose-50',
    'Short Break': 'bg-emerald-500 hover:bg-emerald-600 text-emerald-50',
    'Long Break': 'bg-blue-500 hover:bg-blue-600 text-blue-50',
  };

  const textColors: Record<Mode, string> = {
    'Focus': 'text-rose-500',
    'Short Break': 'text-emerald-500',
    'Long Break': 'text-blue-500',
  };

  return (
    <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md transition-all duration-500 ease-in-out">
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        durations={durations}
        onUpdateDurations={handleUpdateDurations}
      />

      {/* Mode Selectors */}
      <div className="flex space-x-2 bg-gray-100 dark:bg-slate-700 p-1 rounded-full mb-8">
        {(Object.keys(durations) as Mode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentMode === mode
              ? 'bg-white dark:bg-slate-600 shadow-sm text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className={`text-8xl font-bold tracking-tighter mb-8 tabular-nums transition-colors duration-500 ${textColors[currentMode]}`}>
        {formatTime(timeLeft)}
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTimer}
          className={`flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 ${bgColors[currentMode]}`}
          aria-label={isActive ? "Pause" : "Start"}
        >
          {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Reset"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};
