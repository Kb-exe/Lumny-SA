import React from 'react';
import { User } from '../types';
import { BookOpen, Sparkles, FileText, LayoutDashboard, Shield, LogOut, LogIn, Lock } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: 'dashboard' | 'pastpapers' | 'mzansituta' | 'admin';
  setActiveTab: (tab: 'dashboard' | 'pastpapers' | 'mzansituta' | 'admin') => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenSubscription: () => void;
  onOpenAdminLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onOpenSubscription,
}) => {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab(isAdmin ? 'admin' : 'dashboard')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-base shadow-sm">
              L
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  LUMINA SA
                </span>
                {isAdmin ? (
                  <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                    <Shield className="w-3 h-3 text-rose-400" />
                    ADMIN CONSOLE
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    GRADE 12 NSC
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                {isAdmin ? 'Department of Basic Education Admin Access' : 'National Senior Certificate Portal · DBE CAPS'}
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation - Separate for Admin vs Learner */}
        <nav className="hidden md:flex items-center gap-1">
          {isAdmin ? (
            /* ADMIN NAVIGATION ONLY */
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('admin')}
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg bg-slate-800 text-amber-400 border border-amber-500/30 shadow-inner"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin Dashboard &amp; Analytics</span>
              </button>
            </div>
          ) : (
            /* LEARNER NAVIGATION ONLY - STRICTLY SEPARATE */
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-slate-800 text-white shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('pastpapers')}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'pastpapers'
                    ? 'bg-slate-800 text-white shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Past Papers</span>
              </button>

              <button
                onClick={() => setActiveTab('mzansituta')}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'mzansituta'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-amber-400/90 hover:text-amber-300 hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Mzansi Tutor (AI)</span>
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Primary Action / User Account */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Subscription Status & Upgrade Button (Learners only) */}
              {!isAdmin && (
                <button
                  onClick={onOpenSubscription}
                  className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                    currentUser.subscription?.status === 'trialing'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                      : currentUser.subscription?.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                  }`}
                  title="Manage Lumina SA Subscription & Free Trial"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>
                    {currentUser.subscription?.status === 'trialing'
                      ? '7-Day Free Trial Active'
                      : currentUser.subscription?.status === 'active'
                      ? `${currentUser.subscription.plan === 'yearly' ? 'Yearly' : 'Monthly ($6.99)'} Active`
                      : 'Free Trial · $6.99/mo'}
                  </span>
                </button>
              )}

              {/* User Identity Chip */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                  isAdmin ? 'bg-rose-600 text-white' : 'bg-slate-800 border border-slate-700 text-amber-400'
                }`}>
                  {currentUser.initials || (isAdmin ? 'AD' : 'L')}
                </div>
                <div className="hidden lg:block text-left leading-tight">
                  <div className="font-semibold text-white truncate max-w-[130px]">
                    {currentUser.username}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isAdmin ? 'System Administrator' : 'Grade 12 Learner'}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title={isAdmin ? 'Exit Admin Session' : 'Sign Out'}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                {isAdmin && <span className="text-xs hidden sm:inline">Exit Admin</span>}
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Learner Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation row - Learners only (separate) */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 px-2 py-1.5 bg-slate-900/95 text-xs">
        {isAdmin ? (
          <button
            onClick={() => setActiveTab('admin')}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded text-amber-400 font-semibold"
          >
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            <span>Admin Management</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 py-1.5 px-2 rounded ${
                activeTab === 'dashboard' ? 'text-amber-400 font-semibold' : 'text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('pastpapers')}
              className={`flex items-center gap-1.5 py-1.5 px-2 rounded ${
                activeTab === 'pastpapers' ? 'text-amber-400 font-semibold' : 'text-slate-400'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Papers</span>
            </button>
            <button
              onClick={() => setActiveTab('mzansituta')}
              className={`flex items-center gap-1.5 py-1.5 px-2 rounded ${
                activeTab === 'mzansituta' ? 'text-amber-400 font-semibold' : 'text-slate-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mzansi Tutor</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
