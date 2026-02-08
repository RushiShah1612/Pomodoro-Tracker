export interface Session {
  id: string;
  userId: string;
  mode: string;
  duration: number; // in seconds
  timestamp: number;
}

export interface UserStats {
  totalFocusTime: number; // in seconds
  focusSessionsCompleted: number;
  recentSessions: Session[];
}

const SESSIONS_KEY = "pomodoro_sessions";
const CURRENT_USER_KEY = "pomodoro_current_user";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Get current user ID from localStorage
const getCurrentUserId = (): string | null => {
  const userData = localStorage.getItem(CURRENT_USER_KEY);
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user.id;
    } catch {
      return null;
    }
  }
  return null;
};

export const api = {
  // Save a completed session to the "database"
  saveSession: async (mode: string, duration: number): Promise<void> => {
    await delay(300); // simulate network latency
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const sessions = api._getSessions();
    const newSession: Session = {
      id: crypto.randomUUID(),
      userId,
      mode,
      duration,
      timestamp: Date.now(),
    };
    sessions.push(newSession);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  },

  // Get user stats from the "database"
  getUserStats: async (userId?: string): Promise<UserStats> => {
    await delay(300); // simulate network latency
    const targetUserId = userId || getCurrentUserId();
    if (!targetUserId) {
      return {
        totalFocusTime: 0,
        focusSessionsCompleted: 0,
        recentSessions: [],
      };
    }
    
    const sessions = api._getSessions();
    const userSessions = sessions.filter((s) => s.userId === targetUserId);
    const focusSessions = userSessions.filter((s) => s.mode === "Focus");
    
    const totalFocusTime = focusSessions.reduce((acc, curr) => acc + curr.duration, 0);
    const focusSessionsCompleted = focusSessions.length;
    
    // Get 5 most recent sessions
    const recentSessions = [...userSessions].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
    
    return {
      totalFocusTime,
      focusSessionsCompleted,
      recentSessions,
    };
  },

  // Internal helper to get raw data
  _getSessions: (): Session[] => {
    const data = localStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  // Clear all data
  clearData: async (): Promise<void> => {
    await delay(200);
    localStorage.removeItem(SESSIONS_KEY);
  }
};
