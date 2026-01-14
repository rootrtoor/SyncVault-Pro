
import { ActivityLog } from '../types';

const LOG_KEY = 'syncvault_activity_logs';

export const logActivity = (userId: string, userName: string, action: string, details: string) => {
  const logs: ActivityLog[] = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
  const newLog: ActivityLog = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    userName,
    action,
    details,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem(LOG_KEY, JSON.stringify([newLog, ...logs].slice(0, 100)));
};

export const getLogs = (): ActivityLog[] => {
  return JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
};
