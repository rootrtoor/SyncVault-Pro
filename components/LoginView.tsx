
import React, { useState } from 'react';
import { CloudUpload, User, Lock, ArrowRight, ShieldCheck, Info, Database } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginViewProps {
  onLogin: (user: UserType) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      // Admin Credentials as requested: rootrtoor12@gmail.com / Plmoknijb13!
      if (isAdminMode) {
        if (email === 'rootrtoor12@gmail.com' && password === 'Plmoknijb13!') {
          onLogin({ 
            id: 'admin-root', 
            name: 'Root Administrator', 
            email: 'rootrtoor12@gmail.com', 
            role: 'admin' 
          });
        } else {
          alert('Invalid admin credentials. Please use the provided root account.');
        }
      } else {
        // Sample User Credentials: sample@syncvault.com / sync123
        if (email === 'sample@syncvault.com' && password === 'sync123') {
          onLogin({ 
            id: 'u-sample-001', 
            name: 'Sample User', 
            email: 'sample@syncvault.com', 
            role: 'user' 
          });
        } else {
          // Dynamic login/register for demo
          onLogin({ 
            id: 'u-' + Math.random().toString(36).substr(2, 5), 
            name: email.split('@')[0] || 'New User', 
            email, 
            role: 'user' 
          });
        }
      }
    }, 800);
  };

  const handleDropboxAuth = () => {
    setIsLoading(true);
    // In a production app, this would redirect to Dropbox OAuth:
    // window.location.href = `https://www.dropbox.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=${window.location.origin}/auth-callback`;
    
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        id: 'dbx-' + Math.random().toString(36).substr(2, 5),
        name: 'Cloud Voyager',
        email: 'dropbox.user@example.com',
        role: 'user',
        dropboxToken: 'simulated_token_12345'
      });
      alert('Authenticated successfully via Dropbox!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100">
        <div className="text-center">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-100">
            <CloudUpload className="text-white w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">SyncVault Pro</h2>
          <p className="mt-2 text-slate-500 font-medium">
            {isAdminMode 
              ? 'Management Console Access' 
              : isRegistering ? 'Create your secure vault' : 'Connect your cloud life'}
          </p>
        </div>

        {!isAdminMode && (
          <div className="space-y-4">
            <button
              onClick={handleDropboxAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-[#0061FF] hover:bg-[#0054E0] text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-100 active:scale-[0.98] disabled:opacity-50"
            >
              <Database className="w-5 h-5 fill-current" />
              {isRegistering ? 'Register with Dropbox' : 'Continue with Dropbox'}
            </button>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or email</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-700 leading-relaxed">
            {isAdminMode ? (
              <p><strong>Admin Credentials:</strong><br/>Email: rootrtoor12@gmail.com<br/>Pass: Plmoknijb13!</p>
            ) : (
              <p><strong>Sample User:</strong><br/>Email: sample@syncvault.com<br/>Pass: sync123</p>
            )}
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                required
                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                placeholder={isAdminMode ? "Admin Email" : isRegistering ? "Full Name or Email" : "Email Address"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="password"
                required
                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-100 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {isAdminMode ? 'Authenticate Admin' : isRegistering ? 'Create Account' : 'Sign In'}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 space-y-4">
          {!isAdminMode && (
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="block w-full text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          )}
          
          <button 
            onClick={() => {
              setIsAdminMode(!isAdminMode);
              setIsRegistering(false);
              setEmail('');
              setPassword('');
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
          >
            {isAdminMode ? <User className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            {isAdminMode ? 'Switch to User Login' : 'System Administration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
