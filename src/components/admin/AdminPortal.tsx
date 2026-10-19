import React, { useState } from 'react';
import { User } from '../../types';
import { getStoredUsers, banUser, deleteUser, getSubjectPopularityStats, getSubscriptionRevenueStats, saveStoredUsers } from '../../services/storage';
import { Shield, Users, BarChart3, Trash2, Ban, CheckCircle, Search, Filter, AlertTriangle, X, Check, RefreshCw, CreditCard, DollarSign, Sparkles } from 'lucide-react';

interface AdminPortalProps {
  currentUser: User | null;
  onRefreshUser: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onRefreshUser,
}) => {
  const [users, setUsers] = useState<User[]>(getStoredUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'banned'>('all');
  
  // Ban modal state
  const [banModalUser, setBanModalUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState('Violation of academic integrity / inappropriate conduct.');

  // Delete modal state
  const [deleteModalUser, setDeleteModalUser] = useState<User | null>(null);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
            <Shield className="w-4 h-4 text-amber-600" />
            <span>Lumina SA Administrator Portal</span>
            <span aria-hidden="true">·</span>
            <span>National Senior Certificate Oversight</span>
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
            <span className="text-xs font-medium text-amber-700">Pending OTP</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 font-mono tabular-nums">
            {pendingCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Awaiting 6-digit confirmation code
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
            Accounts barred from portal access
          </p>
        </div>
      </div>

      {/* BEHIND-THE-SCENES ANALYTICS: Subscription & Revenue Breakdown */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl border border-slate-800 p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              Subscription &amp; Monetization Analytics ($6.99/mo &amp; 7-Day Free Trial)
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Real-time recurring revenue, free trial conversion funnel, and active Grade 12 memberships
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-amber-400 font-bold">Estimated MRR: ${revenueStats.mrr}</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-bold">ARR: ${revenueStats.arr}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/80">
            <div className="text-[11px] text-amber-400 font-medium">7-Day Free Trials</div>
            <div className="text-xl font-extrabold text-white font-mono tabular-nums mt-0.5">
              {revenueStats.activeTrials}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Active trialists ($0 due)
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/80">
            <div className="text-[11px] text-sky-400 font-medium">Monthly Subscribers</div>
            <div className="text-xl font-extrabold text-white font-mono tabular-nums mt-0.5">
              {revenueStats.monthlySubscribers}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              $6.99 / month recurring
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/80">
            <div className="text-[11px] text-emerald-400 font-medium">Yearly Subscribers</div>
            <div className="text-xl font-extrabold text-white font-mono tabular-nums mt-0.5">
              {revenueStats.yearlySubscribers}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              $49.99 / year (Save 30%)
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

      {/* BEHIND-THE-SCENES ANALYTICS: What is the most popular subject learners do? */}
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

              {/* Visual distribution bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    idx === 0 ? 'bg-amber-500' :
                    idx < 3 ? 'bg-slate-800' : 'bg-slate-400'
                  }`}
                  style={{ width: `${Math.max(8, item.percentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACCOUNT MANAGEMENT: Learner Accounts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              Manage Learner Accounts
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              View registered Grade 12 students, ban malicious accounts, or delete records
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
                                BANNED
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {user.email} {user.phone && `· ${user.phone}`}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{user.school}</div>
                      <div className="text-[10px] text-slate-400">{user.province || 'National'}</div>
                    </td>

                    <td className="px-4 py-3 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {(user.subjects || []).slice(0, 3).map((sub) => (
                          <span key={sub} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                            {sub}
                          </span>
                        ))}
                        {(user.subjects || []).length > 3 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{(user.subjects || []).length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {user.subscription?.status === 'trialing' ? (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          7-Day Free Trial
                        </span>
                      ) : user.subscription?.plan === 'yearly' ? (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Yearly ($49.99/yr)
                        </span>
                      ) : user.subscription?.plan === 'monthly' ? (
                        <span className="text-[10px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          Monthly ($6.99/mo)
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          None
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {user.isBanned ? (
                        <span className="text-rose-700 font-semibold flex items-center gap-1">
                          <Ban className="w-3.5 h-3.5" />
                          <span>Suspended</span>
                        </span>
                      ) : user.isVerified ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>OTP Verified</span>
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Pending OTP</span>
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setBanModalUser(user)}
                          title={user.isBanned ? 'Unban Account' : 'Ban Account'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.isBanned
                              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                              : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                        >
                          <Ban className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteModalUser(user)}
                          title="Delete Account"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* BAN / UNBAN MODAL */}
      {banModalUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-600" />
                {banModalUser.isBanned ? 'Lift Account Suspension' : 'Ban Learner Account'}
              </h3>
              <button
                onClick={() => setBanModalUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              {banModalUser.isBanned ? (
                <>
                  Are you sure you want to lift the suspension for <strong className="text-slate-900">{banModalUser.username}</strong> ({banModalUser.email})?
                </>
              ) : (
                <>
                  Suspend account access for <strong className="text-slate-900">{banModalUser.username}</strong> ({banModalUser.email}). The learner will be prevented from logging into the portal.
                </>
              )}
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
