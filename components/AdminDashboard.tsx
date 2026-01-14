
import React, { useEffect, useState } from 'react';
import { getLogs } from '../utils/logger';
import { ActivityLog } from '../types';
// Fix: Added missing RefreshCw to the lucide-react import list
import { Shield, Clock, User as UserIcon, Activity, ArrowLeft, Terminal, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchLogs = () => {
      const data = getLogs();
      // Ensure strictly chronological
      const sorted = [...data].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setLogs(sorted);
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const getActionColor = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('login') || act.includes('auth')) return 'bg-blue-100 text-blue-700';
    if (act.includes('sync') || act.includes('complete')) return 'bg-green-100 text-green-700';
    if (act.includes('fail') || act.includes('security')) return 'bg-red-100 text-red-700';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-3 hover:bg-slate-100 rounded-2xl transition-all active:scale-90">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div className="bg-red-50 p-3 rounded-2xl text-red-600 shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Admin Control Center</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Live Environment Monitor</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Logs</p>
            <p className="text-2xl font-black text-slate-900 leading-none">{logs.length}</p>
          </div>
          <div className="h-12 w-[1px] bg-slate-200"></div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
            <div className="flex items-center gap-2 justify-end">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-200"></div>
              <p className="text-sm font-black text-green-600 uppercase tracking-tighter">Healthy</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-3 font-black text-slate-800 uppercase text-xs tracking-[0.2em]">
            <Terminal className="w-5 h-5 text-blue-600" />
            System Audit Stream
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
            <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
            Auto-refreshing
          </div>
        </div>
        
        <div className="divide-y divide-slate-50 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {logs.length > 0 ? logs.map((log) => (
            <div key={log.id} className="p-8 flex items-start gap-6 hover:bg-slate-50/50 transition-colors">
              <div className="bg-slate-100 p-3 rounded-2xl shadow-inner shrink-0">
                <UserIcon className="w-6 h-6 text-slate-500" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-black text-slate-900">{log.userName}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    {format(new Date(log.timestamp), 'MMM d, HH:mm:ss')}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {log.details}
                  </p>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-32 text-center">
              <Activity className="w-16 h-16 mx-auto mb-6 text-slate-100" />
              <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Null stream detected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
