import React from 'react';
import { User } from '../types';
import { BookOpen, Sparkles, FileText, LayoutDashboard, Shield, LogOut, LogIn, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: 'dashboard' | 'pastpapers' | 'mzansituta' | 'admin';
  setActiveTab: (tab: 'dashboard' | 'pastpapers' | 'mzansituta' | 'admin') => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchToAdmin: () => void;
  onSwitchToLearner: () => void;
  onOpenSubscription: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onSwitchToAdmin,
  onSwitchToLearner,
  onOpenSubscription,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-base shadow-sm">
              L
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors whitespace-nowrap">
                LUMINA SA
              </span>
              <span className="text-[10px] text-amber-400/90 font-medium tracking-wider uppercase -mt-1">
                Grade 12 NSC Portal
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-amber-400 shadow-inner'
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
                ? 'bg-slate-800 text-amber-400 shadow-inner'
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
            <span>Mzansi Tuta (AI)</span>
          </button>

          {/* Admin link visible for admin users or easily accessible */}
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'admin'
                ? 'bg-slate-800 text-amber-400 shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin Portal</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / User Account */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Quick role toggle for testing */}
              <div className="hidden xl:flex items-center text-xs bg-slate-800/90 rounded-md p-0.5 border border-slate-700">
                <button
                  onClick={onSwitchToLearner}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    currentUser.role === 'learner'
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Learner View
                </button>
                <button
                  onClick={onSwitchToAdmin}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Admin View
                </button>
              </div>

              {/* Subscription Status & Upgrade Button */}
              {currentUser.role === 'learner' && (
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
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {currentUser.subscription?.status === 'trialing'
                      ? '7-Day Free Trial'
                      : currentUser.subscription?.plan === 'yearly'
                      ? 'Yearly Plan'
                      : currentUser.subscription?.plan === 'monthly'
                      ? '$6.99/mo Active'
                      : 'Free Trial'}
                  </span>
                </button>
              )}

              {/* User Avatar with Initials */}
              <div className="flex items-center gap-2.5">
                <div
                  title={`${currentUser.username} (${currentUser.school})`}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ring-2 ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-500 text-slate-950 ring-amber-400/50'
                      : 'bg-emerald-600 text-white ring-emerald-500/40'
                  }`}
                >
                  {currentUser.initials || currentUser.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-tight">
                    {currentUser.username}
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight">
                    {currentUser.role === 'admin' ? 'System Admin' : 'Grade 12 Learner'}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Sign out"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Sign Up</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 px-2 py-1.5 bg-slate-900/95 text-xs">
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
          <span>Mzansi Tuta</span>
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex items-center gap-1.5 py-1.5 px-2 rounded ${
            activeTab === 'admin' ? 'text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
};
