import React, { useState } from 'react';
import { User } from '../../types';
import {
  getStoredUsers,
  banUser,
  deleteUser,
  getSubjectPopularityStats,
  getSubscriptionRevenueStats,
  getAdminCredentials,
  updateAdminCredentials,
  validatePassword
} from '../../services/storage';
import {
  Shield,
  Users,
  BarChart3,
  Trash2,
  Ban,
  CheckCircle,
  Search,
  Filter,
  AlertTriangle,
  X,
  Check,
  RefreshCw,
  CreditCard,
  DollarSign,
  Sparkles,
  Lock,
  KeyRound,
  ShieldAlert,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminPortalProps {
  currentUser: User | null;
  onRefreshUser: () => void;
  onOpenAdminLogin?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onRefreshUser,
  onOpenAdminLogin,
}) => {
  const [users, setUsers] = useState<User[]>(getStoredUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'banned'>('all');
  
  // Ban modal state
  const [banModalUser, setBanModalUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState('Violation of academic integrity / inappropriate conduct.');

  // Delete modal state
  const [deleteModalUser, setDeleteModalUser] = useState<User | null>(null);

  // Admin Credentials management state
  const adminCreds = getAdminCredentials();
  const [newAdminUser, setNewAdminUser] = useState(adminCreds.username);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [credSuccessMsg, setCredSuccessMsg] = useState<string | null>(null);
  const [credErrorMsg, setCredErrorMsg] = useState<string | null>(null);

  // Strict check: if user is not admin, deny access
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 px-6 py-10 bg-white border border-slate-200 rounded-2xl shadow-xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-inner">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-rose-600 tracking-wider">
            Access Restricted
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            Administrator Authorization Required
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
          Learner accounts cannot view or access the Admin Portal. Only authorized personnel possessing the designated administrator username and master password can enter this console.
        </p>
        <div className="pt-3">
          <button
            onClick={onOpenAdminLogin}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Open Administrator Authorization Gate</span>
          </button>
        </div>
      </div>
    );
  }

  const refreshData = () => {
    const updated = getStoredUsers();
    setUsers(updated);
    onRefreshUser();
  };

  const learners = users.filter((u) => u.role === 'learner');
  const verifiedCount = learners.filter((u) => u.isVerified && !u.isBanned).length;
  const pendingCount = learners.filter((u) => !u.isVerified && !u.isBanned).length;
  const bannedCount = learners.filter((u) => u.isBanned).length;

  const subjectStats = getSubjectPopularityStats();
  const revenueStats = getSubscriptionRevenueStats();

  // Filtered users for table
  const filteredUsers = learners.filter((u) => {
    if (statusFilter === 'verified' && (!u.isVerified || u.isBanned)) return false;
    if (statusFilter === 'pending' && (u.isVerified || u.isBanned)) return false;
    if (statusFilter === 'banned' && !u.isBanned) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.username.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchSchool = u.school.toLowerCase().includes(q);
      const matchSubject = (u.subjects || []).some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchEmail && !matchSchool && !matchSubject) return false;
    }

    return true;
  });

  const handleConfirmBan = () => {
    if (!banModalUser) return;
    banUser(banModalUser.id, banReason);
    setBanModalUser(null);
    refreshData();
  };

  const handleConfirmDelete = () => {
    if (!deleteModalUser) return;
    deleteUser(deleteModalUser.id);
    setDeleteModalUser(null);
    refreshData();
  };

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredErrorMsg(null);
    setCredSuccessMsg(null);

    const userClean = newAdminUser.trim();
    if (!userClean) {
      setCredErrorMsg('Admin username cannot be blank.');
      return;
    }

    if (!newAdminPassword) {
      setCredErrorMsg('Please provide a new master password to update.');
      return;
    }

    if (newAdminPassword !== confirmAdminPassword) {
      setCredErrorMsg('Password confirmation does not match.');
      return;
    }

    const val = validatePassword(newAdminPassword);
    if (!val.valid) {
      setCredErrorMsg(`Password policy: ${val.errorMessage}`);
      return;
    }

    updateAdminCredentials(userClean, newAdminPassword);
    setNewAdminPassword('');
    setConfirmAdminPassword('');
    setCredSuccessMsg('Administrator credentials successfully updated! Only you now have this login.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 mb-1">
            <Shield className="w-4 h-4 text-rose-600" />
            <span>Lumina SA Administrator Portal</span>
            <span aria-hidden="true">·</span>
            <span>National Senior Certificate Oversight (Restricted Access)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Learner Management &amp; Behind-the-Scenes Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Monitor real-time Grade 12 matric learner enrollment, audit curriculum popularity, and manage learner accounts.
          </p>
        </div>

        <button
          onClick={refreshData}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Behind-the-scenes Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Registered Learners</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {learners.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Grade 12 matriculants across South Africa
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-700">Verified &amp; Active</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
            {verifiedCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Confirmed via Gmail/SMS OTP verification
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-amber-700">Pending Verification</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 font-mono tabular-nums">
            {pendingCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Awaiting 6-digit verification code input
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-rose-700">Suspended / Banned</span>
            <Ban className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-700 font-mono tabular-nums">
            {bannedCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Academic integrity &amp; bot suspensions
          </p>
        </div>
      </div>

      {/* Subscription Revenue & Free Trial Oversight */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <CreditCard className="w-4 h-4" />
              <span>Subscription &amp; Monetization Analytics</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Monthly ($6.99) &amp; Yearly ($49.99) Revenue Stream
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            7-Day Free Trial Engine Active
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/80">
            <div className="text-[11px] text-amber-400 font-medium">Monthly Recurring (MRR)</div>
            <div className="text-xl font-extrabold text-white font-mono tabular-nums mt-0.5">
              ${revenueStats.mrr.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Annualized: ${revenueStats.arr.toFixed(2)}
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/80">
            <div className="text-[11px] text-amber-300 font-medium">Active 7-Day Trials</div>
            <div className="text-xl font-extrabold text-white font-mono tabular-nums mt-0.5">
              {revenueStats.activeTrials}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Converting to $6.99/mo
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/80">
            <div className="text-[11px] text-emerald-400 font-medium">Monthly ($6.99/mo)</div>
            <div className="text-xl font-extrabold text-white font-mono tabular-nums mt-0.5">
              {revenueStats.monthlySubscribers}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Regular active learners
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/80">
            <div className="text-[11px] text-blue-400 font-medium">Yearly ($49.99/yr)</div>
            <div className="text-xl font-extrabold text-white font-mono tabular-nums mt-0.5">
              {revenueStats.yearlySubscribers}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Matric pass package
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/80">
            <div className="text-[11px] text-purple-400 font-medium">Total Paying Learners</div>
            <div className="text-xl font-extrabold text-white font-mono tabular-nums mt-0.5">
              {revenueStats.totalPaying}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {learners.length ? Math.round((revenueStats.totalPaying / learners.length) * 100) : 0}% paid conversion
            </div>
          </div>
        </div>
      </div>

      {/* BEHIND-THE-SCENES ANALYTICS: Most popular subject */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-600" />
              Most Popular Subjects Learners Take in South Africa
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time curriculum distribution ranked by learner enrollment percentage
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {subjectStats.length} Subjects Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 pt-2">
          {subjectStats.map((item, idx) => (
            <div key={item.subject} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[10px] ${
                    idx === 0 ? 'bg-amber-500 text-slate-950' :
                    idx === 1 ? 'bg-slate-300 text-slate-900' :
                    idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{item.subject}</span>
                </div>
                <div className="font-mono text-slate-600">
                  <strong className="text-slate-900">{item.count}</strong> learners ({item.percentage}%)
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    idx === 0 ? 'bg-amber-500' :
                    idx === 1 ? 'bg-slate-700' :
                    idx === 2 ? 'bg-amber-700' : 'bg-slate-400'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Security & Specific Credentials Manager */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Administrator Security &amp; Credentials
              </h3>
              <p className="text-[11px] text-slate-400">
                Only the administrator has access to this username and password. Learners cannot see or use these.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded">
            Confidential
          </span>
        </div>

        {credSuccessMsg && (
          <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{credSuccessMsg}</span>
          </div>
        )}

        {credErrorMsg && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{credErrorMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdateCredentials} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Specific Admin Username
            </label>
            <input
              type="text"
              value={newAdminUser}
              onChange={(e) => setNewAdminUser(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              New Master Password (15+ chars)
            </label>
            <div className="relative">
              <input
                type={showAdminPassword ? 'text' : 'password'}
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                placeholder="New confidential password"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 pr-8 py-2 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showAdminPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="flex gap-2">
              <input
                type={showAdminPassword ? 'text' : 'password'}
                value={confirmAdminPassword}
                onChange={(e) => setConfirmAdminPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 text-xs rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Main Learner Management Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              Learner Registry &amp; Academic Status
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review enrolled Grade 12 students, OTP verification, and manage account suspensions.
            </p>
          </div>

          {/* Filter and Search controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search username, school, email..."
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-medium"
            >
              <option value="all">All Statuses ({learners.length})</option>
              <option value="verified">Verified ({verifiedCount})</option>
              <option value="pending">Pending ({pendingCount})</option>
              <option value="banned">Banned ({bannedCount})</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Learner</th>
                <th className="px-4 py-3">Grade 12 School</th>
                <th className="px-4 py-3">Subjects Enrolled</th>
                <th className="px-4 py-3">Subscription</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No learners match the current search or status filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                          {user.initials || user.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{user.username}</span>
                            {user.isBanned && (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                Suspended
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 truncate max-w-[180px]">
                        {user.school}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {user.province}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {(user.subjects || []).slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
                          >
                            {s}
                          </span>
                        ))}
                        {(user.subjects || []).length > 3 && (
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                            +{(user.subjects || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {user.subscription?.status === 'trialing' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          7-Day Trial
                        </span>
                      ) : user.subscription?.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          {user.subscription.plan === 'yearly' ? 'Yearly ($49.99)' : 'Monthly ($6.99)'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">
                          Expired / Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>OTP Pending</span>
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setBanModalUser(user);
                            setBanReason(user.bannedReason || 'Violation of academic integrity rules.');
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                            user.isBanned
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          }`}
                        >
                          {user.isBanned ? 'Lift Suspension' : 'Suspend'}
                        </button>

                        <button
                          onClick={() => setDeleteModalUser(user)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                          title="Delete Learner Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BAN / SUSPEND MODAL */}
      {banModalUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-600" />
                {banModalUser.isBanned ? 'Reinstate Learner Account' : 'Suspend Grade 12 Learner'}
              </h3>
              <button
                onClick={() => setBanModalUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              {banModalUser.isBanned
                ? `Lift suspension for ${banModalUser.username} (${banModalUser.email}). The learner will regain access to past papers and Mzansi Tutor.`
                : `Suspend ${banModalUser.username} (${banModalUser.email}) from logging in. This is visible to Department moderators.`}
            </p>

            {!banModalUser.isBanned && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Suspension:
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  rows={2}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setBanModalUser(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBan}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  banModalUser.isBanned
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                {banModalUser.isBanned ? 'Lift Suspension' : 'Confirm Ban'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 text-rose-600">
                <Trash2 className="w-4 h-4" />
                Permanent Account Deletion
              </h3>
              <button
                onClick={() => setDeleteModalUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete the account for <strong className="text-slate-900">{deleteModalUser.username}</strong> ({deleteModalUser.email})?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModalUser(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
