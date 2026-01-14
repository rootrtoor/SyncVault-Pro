
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  RefreshCw,
  Bell,
  CheckCircle2,
  LogOut,
  Database,
  ImageIcon,
  Video,
  FileText,
  Files
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import FileCard from './components/FileCard';
import SMSManager from './components/SMSManager';
import SettingsPanel from './components/SettingsPanel';
import AdminDashboard from './components/AdminDashboard';
import LoginView from './components/LoginView';
import { MOCK_FILES } from './constants';
import { CloudFile, SyncSettings, User } from './types';
import { format } from 'date-fns';
import { logActivity } from './utils/logger';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [files, setFiles] = useState<CloudFile[]>(MOCK_FILES);
  const [isDropboxConnected, setIsDropboxConnected] = useState(false);

  const categories = [
    { id: 'all', label: 'All', icon: Files },
    { id: 'image', label: 'Photos', icon: ImageIcon },
    { id: 'video', label: 'Videos', icon: Video },
    { id: 'document', label: 'Docs', icon: FileText },
  ];

  const syncWithDropbox = async () => {
    if (!currentUser) return;
    setIsSyncing(true);
    setSyncProgress('Connecting to Dropbox...');
    logActivity(currentUser.id, currentUser.name, 'Sync Initiated', 'Manual trigger for cloud sync.');

    try {
      await new Promise(r => setTimeout(r, 600));
      setSyncProgress('Scanning for changes...');
      await new Promise(r => setTimeout(r, 800));
      setSyncProgress('Downloading metadata...');
      await new Promise(r => setTimeout(r, 600));
      
      const newFiles: CloudFile[] = [
        {
          id: 'dbx-' + Date.now(),
          name: `Cloud_Sync_${Math.floor(Math.random() * 9000)}.jpg`,
          type: 'image',
          size: 1800000,
          createdAt: new Date().toISOString(),
          isSynced: true,
          url: '#',
          thumbnailUrl: `https://picsum.photos/seed/${Math.random()}/400/300`
        }
      ];

      setFiles(prev => [newFiles[0], ...prev]);
      logActivity(currentUser.id, currentUser.name, 'Sync Complete', `Added ${newFiles[0].name} to local index.`);
    } catch (error) {
      logActivity(currentUser.id, currentUser.name, 'Sync Failed', 'Network timeout during Dropbox handshake.');
      alert('Sync failed. Please check your connection.');
    } finally {
      setIsSyncing(false);
      setSyncProgress('');
    }
  };

  const [settings, setSettings] = useState<SyncSettings>({
    wifiOnly: true,
    autoBackup: true,
    syncPhotos: true,
    syncVideos: true,
    syncDocs: true,
    syncSMS: true,
    backupFrequency: 'daily',
  });

  const filteredFiles = useMemo(() => {
    let result = [...files];
    // Filter by type if a specific category is selected
    if (activeTab !== 'all' && activeTab !== 'sms' && activeTab !== 'settings') {
      result = result.filter(f => f.type === activeTab);
    }
    // Filter by search query
    if (searchQuery) {
      result = result.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [files, activeTab, searchQuery, sortOrder]);

  const handleLogout = () => {
    if (currentUser) {
      logActivity(currentUser.id, currentUser.name, 'Logout', 'Session terminated by user.');
    }
    setCurrentUser(null);
    setIsDropboxConnected(false);
    setActiveTab('all');
  };

  useEffect(() => {
    if (currentUser?.dropboxToken) {
      setIsDropboxConnected(true);
    }
  }, [currentUser]);

  if (!currentUser) {
    return <LoginView onLogin={(user) => {
      setCurrentUser(user);
      logActivity(user.id, user.name, 'Login', `Authenticated via ${user.dropboxToken ? 'Dropbox API' : 'Direct Email'}`);
    }} />;
  }

  if (currentUser.role === 'admin') {
    return <AdminDashboard onBack={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row antialiased">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 lg:ml-64 px-4 md:px-8 pt-4 md:pt-8 pb-32 lg:pb-8 transition-all duration-300">
        <header className="flex items-center justify-between mb-8 bg-white/70 backdrop-blur-xl sticky top-4 lg:top-8 z-20 p-3 md:p-4 rounded-[1.5rem] border border-white/40 shadow-xl shadow-slate-200/50">
          <div className="relative flex-1 max-w-sm md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search in Vault..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/50 border-none rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4 ml-4">
            <button 
              onClick={syncWithDropbox}
              disabled={isSyncing}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                isSyncing 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 shadow-sm active:translate-y-px'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync'}
            </button>
            <div className="hidden md:block w-[1px] h-8 bg-slate-200"></div>
            <button 
              onClick={handleLogout}
              className="p-2.5 text-slate-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"
              title="Logout"
            >
              <LogOut className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div className="flex items-center gap-3 pl-1">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-sm md:text-base font-bold shadow-lg shadow-blue-300 border-2 border-white">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {isSyncing && (
          <div className="mb-6 bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center justify-between shadow-lg shadow-blue-100 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm font-bold tracking-tight">{syncProgress}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Cloud Link Active</span>
          </div>
        )}

        {activeTab === 'sms' ? (
          <SMSManager />
        ) : activeTab === 'settings' ? (
          <SettingsPanel 
            settings={settings} 
            setSettings={setSettings} 
            user={currentUser}
            onConnectDropbox={() => {
              setIsDropboxConnected(true);
              logActivity(currentUser.id, currentUser.name, 'Account Linked', 'Verified Dropbox credentials manually.');
              alert('Successfully linked your Dropbox account!');
            }}
            isConnected={isDropboxConnected}
          />
        ) : (
          <div className="space-y-6 pb-24 lg:pb-0">
            {/* Mobile Category Switcher - Fixed UX Bug */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-xs font-bold transition-all border ${
                    activeTab === cat.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' 
                    : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 capitalize tracking-tight">
                  {activeTab === 'all' ? 'Cloud Library' : `${activeTab}s`}
                </h2>
                <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {filteredFiles.length}
                </span>
              </div>

              <div className="flex items-center gap-1 md:gap-2">
                <button 
                  onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                  className="p-2 text-slate-500 hover:bg-white hover:text-blue-600 rounded-lg transition-all border border-transparent hover:border-slate-200"
                  title="Toggle Chronological Order"
                >
                  <ArrowUpDown className="w-5 h-5" />
                </button>
                <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden md:block"></div>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600 border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600 border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {filteredFiles.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredFiles.map((file) => (
                    <FileCard key={file.id} file={file} />
                  ))}
                  <button 
                    onClick={syncWithDropbox}
                    className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 gap-3 hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-400 hover:text-blue-500 group active:scale-[0.98]"
                  >
                    <div className="p-3 bg-slate-50 rounded-full group-hover:bg-blue-100 transition-colors">
                      <Database className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-sm">Fetch More</span>
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-[1.5rem] overflow-x-auto shadow-sm">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">File Name</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Size</th>
                        <th className="px-6 py-4">Created</th>
                        <th className="px-6 py-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredFiles.map((file) => (
                        <tr key={file.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                          <td className="px-6 py-4 font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{file.name}</td>
                          <td className="px-6 py-4 text-slate-500 capitalize text-sm">{file.type}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{(file.size / 1024 / 1024).toFixed(1)} MB</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{format(new Date(file.createdAt), 'MMM d, yy')}</td>
                          <td className="px-6 py-4 text-right">
                            {file.isSynced ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                            ) : (
                              <RefreshCw className="w-5 h-5 text-amber-500 ml-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] py-20 px-6 text-center">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Files className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No {activeTab}s Found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                  We couldn't find any {activeTab === 'all' ? 'files' : activeTab + 's'} in this category. Sync with Dropbox to populate your vault.
                </p>
                <button 
                  onClick={syncWithDropbox}
                  className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Sync Library Now
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav 
        activeTab={activeTab === 'image' || activeTab === 'video' || activeTab === 'document' ? 'all' : activeTab} 
        setActiveTab={setActiveTab} 
        onUploadClick={syncWithDropbox}
      />
    </div>
  );
};

export default App;
