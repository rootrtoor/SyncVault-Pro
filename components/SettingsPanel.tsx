
import React from 'react';
import { Wifi, Cloud, Smartphone, Clock, ShieldCheck, Database, LayoutGrid } from 'lucide-react';
import { SyncSettings, User } from '../types';

interface SettingsPanelProps {
  settings: SyncSettings;
  setSettings: React.Dispatch<React.SetStateAction<SyncSettings>>;
  user: User;
  onConnectDropbox: () => void;
  isConnected: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings, user, onConnectDropbox, isConnected }) => {
  const toggle = (key: keyof SyncSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setFrequency = (freq: SyncSettings['backupFrequency']) => {
    setSettings(prev => ({ ...prev, backupFrequency: freq }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-32 lg:pb-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Account & Sync Settings</h2>
        <p className="text-slate-500">Manage your connection to Dropbox and backup rules.</p>
      </div>

      <section className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 md:p-8 rounded-[2rem] text-white shadow-xl shadow-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
            <Database className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Dropbox Integration</h3>
            <p className="text-blue-100 text-sm">
              {isConnected ? `Connected as ${user.name}` : 'Sync your files directly from Dropbox'}
            </p>
          </div>
        </div>
        <button 
          onClick={onConnectDropbox}
          disabled={isConnected}
          className={`px-8 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${
            isConnected 
            ? 'bg-green-500 text-white cursor-default' 
            : 'bg-white text-blue-600 hover:bg-blue-50'
          }`}
        >
          {isConnected ? 'Linked' : 'Connect Account'}
        </button>
      </section>

      <div className="grid grid-cols-1 gap-6">
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Cloud className="w-6 h-6 text-blue-500" />
            <h3 className="font-bold text-slate-800 text-lg">General Backup</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-semibold text-slate-800">Auto Backup</p>
                <p className="text-xs text-slate-500">Automatically backup files when new content is detected.</p>
              </div>
              <button 
                onClick={() => toggle('autoBackup')}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoBackup ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.autoBackup ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-slate-400" />
                  <p className="font-semibold text-slate-800">Wi-Fi Only</p>
                </div>
                <p className="text-xs text-slate-500">Save mobile data by only syncing while connected to Wi-Fi.</p>
              </div>
              <button 
                onClick={() => toggle('wifiOnly')}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.wifiOnly ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.wifiOnly ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-amber-500" />
            <h3 className="font-bold text-slate-800 text-lg">Scheduling</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {(['hourly', 'daily', 'weekly'] as const).map((freq) => (
              <button
                key={freq}
                onClick={() => setFrequency(freq)}
                className={`flex-1 py-4 px-2 md:px-4 rounded-2xl border-2 transition-all text-center ${
                  settings.backupFrequency === freq 
                    ? 'border-blue-600 bg-blue-50 text-blue-600' 
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                }`}
              >
                <span className="block font-bold capitalize text-sm md:text-base">{freq}</span>
                <span className="text-[8px] md:text-[10px] uppercase font-bold tracking-widest opacity-60">Frequency</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPanel;
