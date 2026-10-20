import React, { useState } from 'react';
import { User } from '../../types';
import { verifyAdminCredentials, getStoredUsers, setCurrentUser } from '../../services/storage';
import { INITIAL_ADMIN } from '../../data/mockLearners';
import { Shield, KeyRound, Lock, Eye, EyeOff, AlertTriangle, ArrowRight, X, CheckCircle2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminAuthenticated: (adminUser: User) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAdminAuthenticated,
}) => {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const u = adminUsername.trim();
    const p = adminPassword.trim();

    if (!u || !p) {
      setErrorMessage('Please enter both the designated administrator username and master password.');
      return;
    }

    if (failedAttempts >= 5) {
      setErrorMessage('Too many failed authorization attempts. Access is locked for security.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      const isValid = verifyAdminCredentials(u, p);

      if (isValid) {
        const allUsers = getStoredUsers();
        let adminUser = allUsers.find((user) => user.role === 'admin');
        if (!adminUser) {
          adminUser = INITIAL_ADMIN;
        }

        setCurrentUser(adminUser);
        setIsAuthenticating(false);
        setFailedAttempts(0);
        onAdminAuthenticated(adminUser);
        onClose();
      } else {
        setIsAuthenticating(false);
        setFailedAttempts((prev) => prev + 1);
        setErrorMessage(
          'Access Denied: Invalid administrator username or master password. This attempt has been logged.'
        );
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 text-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-inner">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-semibold block">
                  Staff &amp; Administrative Gate
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Admin Authorization
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              title="Close and return to learner portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 flex items-start gap-2 text-xs text-amber-200/90">
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              This portal is reserved strictly for designated Department &amp; System Administrators. Learners cannot access this console.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-lg p-3 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Specific Admin Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="e.g. admin_lumina"
                autoComplete="username"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Specific Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••••••"
                autoComplete="current-password"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isAuthenticating || failedAttempts >= 5}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAuthenticating ? (
                <>Verifying Authorization...</>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate &amp; Enter Admin Portal</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 py-2 rounded-xl text-xs font-medium transition-colors"
            >
              Cancel &amp; Return to Learner Portal
            </button>
          </div>
        </form>

        {/* Footer Audit Notice */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Security Audit: Active</span>
          <span className="text-amber-400">DBE CAPS Level 4</span>
        </div>
      </div>
    </div>
  );
};
