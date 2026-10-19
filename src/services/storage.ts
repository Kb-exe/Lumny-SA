import { User } from '../types';
import { INITIAL_LEARNERS, INITIAL_ADMIN } from '../data/mockLearners';

const USERS_KEY = 'lumina_sa_users_v2';
const CURRENT_USER_KEY = 'lumina_sa_current_user_v2';
const OTP_STORE_KEY = 'lumina_sa_otps_v2';
const PASSWORDS_KEY = 'lumina_sa_passwords_v2';

export interface PasswordValidation {
  valid: boolean;
  hasLength: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  errorMessage?: string;
}

export function validatePassword(password: string): PasswordValidation {
  const hasLength = password.length >= 15;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

  const valid = hasLength && hasUpper && hasNumber && hasSpecial;

  let errorMessage: string | undefined;
  if (!valid) {
    if (!hasLength) {
      errorMessage = 'Password must be at least 15 characters long.';
    } else if (!hasUpper) {
      errorMessage = 'Password must include at least one uppercase letter (A-Z).';
    } else if (!hasNumber) {
      errorMessage = 'Password must include at least one number (0-9).';
    } else if (!hasSpecial) {
      errorMessage = 'Password must include at least one special character (!@#$%^&*...).';
    }
  }

  return {
    valid,
    hasLength,
    hasUpper,
    hasNumber,
    hasSpecial,
    errorMessage
  };
}

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      const initial = [...INITIAL_LEARNERS, INITIAL_ADMIN];
      localStorage.setItem(USERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [...INITIAL_LEARNERS, INITIAL_ADMIN];
  }
}

export function saveStoredUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

export function getStoredPasswords(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PASSWORDS_KEY);
    if (!raw) {
      // Default passwords meeting strict 15-character policy
      const defaults: Record<string, string> = {
        'karabolekalakala44@gmail.com': 'Matric2026Pass#1',
        'karabo_matric': 'Matric2026Pass#1',
        'admin@lumina.co.za': 'LuminaSA#2026Admin',
        'admin_lumina': 'LuminaSA#2026Admin',
      };
      localStorage.setItem(PASSWORDS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export function saveStoredPasswords(passwords: Record<string, string>): void {
  try {
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
  } catch (e) {
    console.error('Failed to save passwords', e);
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) {
      // Default active user is Karabo Lekalakala (Grade 12 learner)
      const defaultUser = INITIAL_LEARNERS[0];
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_LEARNERS[0] || null;
  }
}

export function setCurrentUser(user: User | null): void {
  try {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Failed to set current user', e);
  }
}

// In-memory or stored OTP generation
export function generateOTP(targetIdentifier: string): { code: string; expiresAt: number } {
  // Generate authentic 6-digit numeric OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  try {
    const stored = JSON.parse(localStorage.getItem(OTP_STORE_KEY) || '{}');
    stored[targetIdentifier.toLowerCase()] = { code, expiresAt };
    localStorage.setItem(OTP_STORE_KEY, JSON.stringify(stored));
  } catch (e) {}

  return { code, expiresAt };
}

export function verifyOTP(targetIdentifier: string, codeInput: string): boolean {
  try {
    const stored = JSON.parse(localStorage.getItem(OTP_STORE_KEY) || '{}');
    const entry = stored[targetIdentifier.toLowerCase()];
    if (!entry) {
      // Fallback: accept 123456 or 749201 for test ease if not stored
      return codeInput === '123456' || codeInput === '749201';
    }
    if (Date.now() > entry.expiresAt) {
      return false;
    }
    return entry.code.trim() === codeInput.trim();
  } catch (e) {
    return codeInput === '123456';
  }
}

export function banUser(userId: string, reason?: string): User[] {
  const users = getStoredUsers();
  const updated = users.map(u => {
    if (u.id === userId) {
      return {
        ...u,
        isBanned: !u.isBanned,
        bannedReason: !u.isBanned ? (reason || 'Account suspended by Lumina administrator.') : undefined
      };
    }
    return u;
  });
  saveStoredUsers(updated);

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const updatedCurrent = updated.find(u => u.id === userId) || null;
    setCurrentUser(updatedCurrent);
  }

  return updated;
}

export function deleteUser(userId: string): User[] {
  const users = getStoredUsers();
  const updated = users.filter(u => u.id !== userId);
  saveStoredUsers(updated);

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    setCurrentUser(null);
  }

  return updated;
}

export function getSubjectPopularityStats(): { subject: string; count: number; percentage: number }[] {
  const users = getStoredUsers().filter(u => u.role === 'learner');
  const counts: Record<string, number> = {};

  users.forEach(user => {
    (user.subjects || []).forEach(sub => {
      counts[sub] = (counts[sub] || 0) + 1;
    });
  });

  const totalLearners = users.length || 1;
  const sorted = Object.entries(counts)
    .map(([subject, count]) => ({
      subject,
      count,
      percentage: Math.round((count / totalLearners) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  return sorted;
}

export function updateUserSubscription(userId: string, subscription: import('../types').SubscriptionInfo): User | null {
  const users = getStoredUsers();
  let updatedUser: User | null = null;
  const updated = users.map(u => {
    if (u.id === userId) {
      updatedUser = {
        ...u,
        subscription
      };
      return updatedUser;
    }
    return u;
  });

  saveStoredUsers(updated);

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId && updatedUser) {
    setCurrentUser(updatedUser);
  }

  return updatedUser;
}

export function cancelUserSubscription(userId: string): User | null {
  const users = getStoredUsers();
  let updatedUser: User | null = null;
  const updated = users.map(u => {
    if (u.id === userId && u.subscription) {
      updatedUser = {
        ...u,
        subscription: {
          ...u.subscription,
          autoRenew: false,
          status: 'cancelled'
        }
      };
      return updatedUser;
    }
    return u;
  });

  saveStoredUsers(updated);

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId && updatedUser) {
    setCurrentUser(updatedUser);
  }

  return updatedUser;
}

export function getSubscriptionRevenueStats() {
  const users = getStoredUsers().filter(u => u.role === 'learner');
  let activeTrials = 0;
  let monthlySubscribers = 0;
  let yearlySubscribers = 0;
  let cancelledOrExpired = 0;

  users.forEach(u => {
    const sub = u.subscription;
    if (!sub || sub.status === 'expired') {
      cancelledOrExpired++;
    } else if (sub.status === 'trialing') {
      activeTrials++;
    } else if (sub.status === 'active') {
      if (sub.plan === 'monthly') {
        monthlySubscribers++;
      } else if (sub.plan === 'yearly') {
        yearlySubscribers++;
      }
    } else if (sub.status === 'cancelled') {
      cancelledOrExpired++;
    }
  });

  // Calculate MRR: monthly ($6.99) + yearly amortized ($49.99 / 12 = $4.17)
  const mrr = (monthlySubscribers * 6.99) + (yearlySubscribers * (49.99 / 12));
  const arr = mrr * 12;

  return {
    totalLearners: users.length,
    activeTrials,
    monthlySubscribers,
    yearlySubscribers,
    totalPaying: monthlySubscribers + yearlySubscribers,
    cancelledOrExpired,
    mrr: Number(mrr.toFixed(2)),
    arr: Number(arr.toFixed(2)),
  };
}

