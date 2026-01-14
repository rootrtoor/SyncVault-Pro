
import React from 'react';
import { 
  Files, 
  MessageSquare, 
  Settings, 
  Plus
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onUploadClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onUploadClick }) => {
  const items = [
    { id: 'all', label: 'Files', icon: Files },
    { id: 'sms', label: 'SMS', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 px-6 py-3 flex items-center justify-between z-40 pb-safe">
      {items.slice(0, 2).map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
        </button>
      ))}

      <button 
        onClick={onUploadClick}
        className="bg-blue-600 text-white p-4 rounded-full -mt-10 shadow-lg shadow-blue-200 active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      {items.slice(2).map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
