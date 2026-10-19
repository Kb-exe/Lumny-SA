import React, { useState, useEffect } from 'react';
import { User } from './types';
import { getCurrentUser, setCurrentUser, getStoredUsers } from './services/storage';
import { INITIAL_ADMIN, INITIAL_LEARNERS } from './data/mockLearners';
import { Navbar } from './components/Navbar';
import { LearnerDashboard } from './components/dashboard/LearnerDashboard';
import { PastPapersSection } from './components/pastpapers/PastPapersSection';
import { MzansiTutaSection } from './components/mzansituta/MzansiTutaSection';
import { AdminPortal } from './components/admin/AdminPortal';
import { AuthModal } from './components/auth/AuthModal';
import { SubscriptionModal } from './components/subscription/SubscriptionModal';
import { Sparkles, Shield, BookOpen, Heart, GraduationCap, CreditCard } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(getCurrentUser());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pastpapers' | 'mzansituta' | 'admin'>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // Passing past paper content into Mzansi Tuta
  const [tutaDocText, setTutaDocText] = useState<string>('');
  const [tutaSubject, setTutaSubject] = useState<string>('Mathematics');
  const [tutaDocTitle, setTutaDocTitle] = useState<string>('');

  const handleUserLogin = (user: User) => {
    setCurrentUserState(user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUserState(null);
    setCurrentUser(null);
    setIsAuthModalOpen(true);
    setAuthInitialMode('login');
  };

  const handleSwitchToAdmin = () => {
    const users = getStoredUsers();
    const adminUser = users.find((u) => u.role === 'admin') || INITIAL_ADMIN;
    setCurrentUserState(adminUser);
    setCurrentUser(adminUser);
    setActiveTab('admin');
  };

  const handleSwitchToLearner = () => {
    const users = getStoredUsers();
    const learnerUser = users.find((u) => u.role === 'learner' && !u.isBanned) || INITIAL_LEARNERS[0];
    setCurrentUserState(learnerUser);
    setCurrentUser(learnerUser);
    setActiveTab('dashboard');
  };

  const handleSendToMzansiTuta = (docText: string, subject: string, title: string) => {
    setTutaDocText(docText);
    setTutaSubject(subject);
    setTutaDocTitle(title);
    setActiveTab('mzansituta');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Bar Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => {
          setAuthInitialMode('login');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onSwitchToAdmin={handleSwitchToAdmin}
        onSwitchToLearner={handleSwitchToLearner}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
      />

      {/* Main App Body */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          currentUser ? (
            <LearnerDashboard
              currentUser={currentUser}
              onNavigateToPastPapers={(subj) => {
                if (subj) setTutaSubject(subj);
                setActiveTab('pastpapers');
              }}
              onNavigateToMzansiTuta={(subj) => {
                if (subj) setTutaSubject(subj);
                setActiveTab('mzansituta');
              }}
              onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
            />
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto text-2xl font-black shadow-md">
                L
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                LUMINA SA (LUMNY SA)
              </h1>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                South Africa's premier Grade 12 National Senior Certificate (NSC) exam preparation hub.
                Log in to access your personalized dashboard, CAPS past papers, and Mzansi Tuta AI.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setAuthInitialMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg transition-colors shadow-sm"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthInitialMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-lg transition-colors"
                >
                  Create Grade 12 Account
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'pastpapers' && (
          <PastPapersSection
            currentUser={currentUser}
            initialSubject={tutaSubject}
            onSendToMzansiTuta={handleSendToMzansiTuta}
          />
        )}

        {activeTab === 'mzansituta' && (
          <MzansiTutaSection
            currentUser={currentUser}
            initialDocumentText={tutaDocText}
            initialSubject={tutaSubject}
            initialDocTitle={tutaDocTitle}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortal
            currentUser={currentUser}
            onRefreshUser={() => setCurrentUserState(getCurrentUser())}
          />
        )}
      </main>

      {/* Footer with South African Curriculum Attribution */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              L
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">LUMINA SA / LUMNY SA</span>
              <span className="text-[11px] text-slate-400 ml-2">
                South Africa Grade 12 NSC Learning Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Aligned with Department of Basic Education (DBE) CAPS</span>
            <span aria-hidden="true">·</span>
            <span>All 9 Provinces</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
            >
              <CreditCard className="w-3 h-3" />
              <span>Subscription &amp; Free Trial</span>
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleSwitchToAdmin}
              className="text-slate-300 hover:underline flex items-center gap-1 font-medium"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Login & Create Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleUserLogin}
        initialMode={authInitialMode}
      />

      {/* Subscription & 7-Day Free Trial Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentUser={currentUser}
        onSubscriptionUpdated={(updatedUser) => {
          setCurrentUserState(updatedUser);
        }}
      />
    </div>
  );
}
