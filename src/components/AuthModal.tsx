import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storage';
import { X, Lock, Mail, UserCheck, Shield, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Student');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regStudentId, setRegStudentId] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your campus email.');
      return;
    }

    const result = StorageService.loginUser(loginEmail.trim());
    if (result.success && result.user) {
      onLoginSuccess(result.user);
      onClose();
    } else {
      setErrorMsg(result.error || 'Access denied with suitable message. Account not found.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName.trim() || !regEmail.trim()) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }

    const result = StorageService.registerUser(
      regName.trim(),
      regEmail.trim(),
      regRole,
      regDept.trim(),
      regStudentId.trim() || undefined
    );

    if (result.success && result.user) {
      setSuccessMsg('Account registered successfully! Logging you in...');
      setTimeout(() => {
        onLoginSuccess(result.user!);
        onClose();
      }, 600);
    } else {
      setErrorMsg(result.error || 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              L
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-base">LostLink Authentication</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-6 pt-5">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                tab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                tab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Register Campus Account
            </button>
          </div>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Forms */}
        <div className="p-6">
          {/* Quick Demo Access Bar */}
          <div className="mb-5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Instant Demo Access (Click to sign in)
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  const student = StorageService.getUsers().find(u => u.role === 'Student') || StorageService.loginUser('anand.r@dmice.ac.in').user;
                  if (student) {
                    StorageService.setCurrentUser(student);
                    onLoginSuccess(student);
                    onClose();
                  }
                }}
                className="p-2 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-lg text-left transition-colors cursor-pointer shadow-2xs"
              >
                <div className="font-bold text-slate-900 text-xs">Student</div>
                <div className="text-[10px] text-slate-500 truncate">R. Anand</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  const faculty = StorageService.getUsers().find(u => u.role === 'Faculty/Staff') || StorageService.loginUser('malar.s@dmice.ac.in').user;
                  if (faculty) {
                    StorageService.setCurrentUser(faculty);
                    onLoginSuccess(faculty);
                    onClose();
                  }
                }}
                className="p-2 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-lg text-left transition-colors cursor-pointer shadow-2xs"
              >
                <div className="font-bold text-slate-900 text-xs">Faculty</div>
                <div className="text-[10px] text-slate-500 truncate">Prof. Malar</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  const admin = StorageService.getUsers().find(u => u.role === 'Administrator') || StorageService.loginUser('security.admin@dmice.ac.in').user;
                  if (admin) {
                    StorageService.setCurrentUser(admin);
                    onLoginSuccess(admin);
                    onClose();
                  }
                }}
                className="p-2 bg-white border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 rounded-lg text-left transition-colors cursor-pointer shadow-2xs"
              >
                <div className="font-bold text-slate-900 text-xs">Admin</div>
                <div className="text-[10px] text-slate-500 truncate">Campus Sec</div>
              </button>
            </div>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Campus Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. yourname@campus.edu"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Sign In to LostLink
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-xs text-blue-600 hover:underline cursor-pointer"
                >
                  Don&apos;t have an account yet? Register here
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Campus Email *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. j.doe@campus.edu"
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Role *
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty/Staff">Faculty/Staff</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={regStudentId}
                    onChange={(e) => setRegStudentId(e.target.value)}
                    placeholder="e.g. CS2026-1042"
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  required
                  value={regDept}
                  onChange={(e) => setRegDept(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-xs mt-2"
              >
                Create Account &amp; Log In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
