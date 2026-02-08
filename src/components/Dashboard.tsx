import { useEffect, useState } from 'react';
import { api, UserStats } from '../api';
import { Activity, Clock, Award } from 'lucide-react';

interface Props {
  refreshTrigger: number;
  userId: string;
}

export const Dashboard: React.FC<Props> = ({ refreshTrigger, userId }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await api.getUserStats(userId);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger, userId]);

  if (loading && !stats) {
    return (
      <div className="w-full max-w-md p-6 bg-white rounded-3xl shadow-lg flex justify-center items-center h-48">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatTotalTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-lg transition-all">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center">
        <Activity className="w-5 h-5 mr-2 text-rose-500" /> Dashboard
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl flex flex-col">
          <div className="flex items-center text-rose-500 mb-2">
            <Award className="w-4 h-4 mr-1.5" />
            <span className="text-sm font-medium">Sessions</span>
          </div>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats?.focusSessionsCompleted || 0}
          </span>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl flex flex-col">
          <div className="flex items-center text-emerald-500 mb-2">
            <Clock className="w-4 h-4 mr-1.5" />
            <span className="text-sm font-medium">Focus Time</span>
          </div>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatTotalTime(stats?.totalFocusTime || 0)}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Recent Activity</h3>
        {stats?.recentSessions.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No recent sessions.</p>
        ) : (
          <ul className="space-y-3">
            {stats?.recentSessions.map((session) => (
              <li key={session.id} className="flex justify-between items-center text-sm border-b border-gray-50 dark:border-gray-700 pb-2">
                <span className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${session.mode === 'Focus' ? 'bg-rose-500' : session.mode === 'Short Break' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                  {session.mode}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
