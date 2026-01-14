
import React, { useState } from 'react';
import { MessageSquare, Download, Upload, Calendar, Search, History, Loader2 } from 'lucide-react';
import { MOCK_SMS } from '../constants';
// Fix: Removed parseISO, startOfDay, and endOfDay as they were reported as missing from date-fns
import { format, isWithinInterval } from 'date-fns';

const SMSManager: React.FC = () => {
  const [messages, setMessages] = useState(MOCK_SMS);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupCount, setBackupCount] = useState(MOCK_SMS.length);

  const handleBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupCount(messages.length);
      alert(`Cloud backup updated: ${messages.length} messages secured.`);
    }, 1500);
  };

  const handleRestore = () => {
    setIsRestoring(true);
    setTimeout(() => {
      let filtered = [...MOCK_SMS];
      if (startDate && endDate) {
        try {
          filtered = MOCK_SMS.filter(msg => {
            // Fix: Use native Date constructor instead of parseISO
            const msgDate = new Date(msg.timestamp);
            
            // Fix: Manually calculate start and end of day to avoid missing date-fns exports
            const startLimit = new Date(startDate);
            startLimit.setHours(0, 0, 0, 0);
            
            const endLimit = new Date(endDate);
            endLimit.setHours(23, 59, 59, 999);

            return isWithinInterval(msgDate, {
              start: startLimit,
              end: endLimit
            });
          });
          setMessages(filtered);
          alert(`Restored ${filtered.length} messages from history.`);
        } catch (e) {
          alert("Invalid date range selected.");
        }
      } else {
        setMessages(MOCK_SMS);
        alert('Complete history restored.');
      }
      setIsRestoring(false);
    }, 1200);
  };

  const filteredDisplay = messages.filter(m => 
    m.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 lg:pb-0 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">SMS History Vault</h2>
          <div className="flex items-center gap-2 mt-1">
             <History className="w-4 h-4 text-green-500" />
             <p className="text-slate-500 text-sm font-medium">Synced: {backupCount} messages secured</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleBackup}
            disabled={isBackingUp || isRestoring}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-50"
          >
            {isBackingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {isBackingUp ? 'Syncing...' : 'Backup'}
          </button>
          <button 
            onClick={handleRestore}
            disabled={isRestoring || isBackingUp}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            {isRestoring ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <Download className="w-4 h-4" />}
            Restore
          </button>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">Sync Start</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 pointer-events-none transition-colors" />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">Sync End</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 pointer-events-none transition-colors" />
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">Global Filter</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 pointer-events-none transition-colors" />
              <input 
                type="text" 
                placeholder="Keywords or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-5 max-h-[60vh] md:max-h-[450px] overflow-y-auto pr-2 scroll-smooth custom-scrollbar">
          {filteredDisplay.length > 0 ? (
            filteredDisplay.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-4 shadow-sm border ${
                  msg.type === 'sent' 
                    ? 'bg-blue-600 text-white border-blue-500' 
                    : 'bg-slate-50 text-slate-800 border-slate-100'
                }`}>
                  <div className="flex justify-between items-center gap-8 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{msg.contact}</span>
                    <span className="text-[10px] opacity-60 font-medium">
                      {format(new Date(msg.timestamp), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-[1.5rem] border-2 border-dashed border-slate-200">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MessageSquare className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-slate-500 font-bold px-4">No results found.</p>
              <button 
                onClick={() => {setStartDate(''); setEndDate(''); setMessages(MOCK_SMS);}}
                className="mt-4 text-blue-600 text-xs font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SMSManager;
