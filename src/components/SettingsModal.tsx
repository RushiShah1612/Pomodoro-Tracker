import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

type Mode = 'Focus' | 'Short Break' | 'Long Break';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    durations: Record<Mode, number>;
    onUpdateDurations: (newDurations: Record<Mode, number>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    durations,
    onUpdateDurations,
}) => {
    const [localDurations, setLocalDurations] = useState(durations);

    useEffect(() => {
        setLocalDurations(durations);
    }, [durations, isOpen]);

    if (!isOpen) return null;

    const handleChange = (mode: Mode, value: string) => {
        const minutes = parseInt(value) || 0;
        setLocalDurations((prev) => ({
            ...prev,
            [mode]: minutes * 60, // Convert to seconds
        }));
    };

    const handleSave = () => {
        onUpdateDurations(localDurations);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Timer Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {(Object.keys(localDurations) as Mode[]).map((mode) => (
                        <div key={mode} className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {mode} (minutes)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="60"
                                value={localDurations[mode] / 60}
                                onChange={(e) => handleChange(mode, e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:text-white transition-all"
                            />
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors shadow-sm shadow-rose-500/25"
                    >
                        <Save size={18} className="mr-2" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
