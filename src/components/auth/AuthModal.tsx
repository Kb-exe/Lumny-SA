import React, { useState } from 'react';
import { User } from '../../types';
import { ALL_GRADE12_SUBJECTS, NOTABLE_SA_SCHOOLS, SA_PROVINCES } from '../../data/grade12Subjects';
import { validatePassword, getStoredUsers, saveStoredUsers, setCurrentUser, generateOTP, verifyOTP, getStoredPasswords, saveStoredPasswords } from '../../services/storage';
import { Check, X, ShieldAlert, KeyRound, Mail, Smartphone, School, BookOpen, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'otp'>(initialMode);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [school, setSchool] = useState('');
  const [customSchool, setCustomSchool] = useState('');
  const [province, setProvince] = useState('Gauteng');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Mathematics',
    'Physical Sciences',
    'Life Sciences',
    'English Home Language',
    'Life Orientation'
  ]);
  const [initials, setInitials] = useState('');
  const [username, setUsername] = useState('');
  const [gmail, setGmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpDeliveryMethod, setOtpDeliveryMethod] = useState<'gmail' | 'sms'>('gmail');

  // Forgot password fields
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // OTP Verification state
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [generatedDemoCode, setGeneratedDemoCode] = useState<string>('');
  const [otpTarget, setOtpTarget] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState(60);

  if (!isOpen) return null;

  const currentPasswordVal = mode === 'register' 
    ? validatePassword(registerPassword) 
    : mode === 'forgot' 
    ? validatePassword(newPassword) 
    : null;

  const handleToggleSubject = (subjectName: string) => {
    if (selectedSubjects.includes(subjectName)) {
      if (selectedSubjects.length <= 1) {
        setErrorMessage('Grade 12 requires at least one enrolled subject.');
        return;
      }
      setSelectedSubjects(selectedSubjects.filter(s => s !== subjectName));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectName]);
    }
    setErrorMessage(null);
  };

  // 1. Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const identifier = loginIdentifier.trim().toLowerCase();
    const password = loginPassword.trim();

    if (!identifier || !password) {
      setErrorMessage('Please enter both your Gmail/Username and your password.');
      return;
    }

    // Check strict password rules on login attempt too
    const pwdVal = validatePassword(password);
    if (!pwdVal.valid) {
      setErrorMessage(`Incorrect password format: ${pwdVal.errorMessage}`);
      return;
    }

    const users = getStoredUsers();
    const user = users.find(
      u => u.username.toLowerCase() === identifier || u.email.toLowerCase() === identifier
    );

    if (!user) {
      setErrorMessage('Account not found. Please verify your details or create a new account.');
      return;
    }

    if (user.isBanned) {
      setErrorMessage(`Account Banned: ${user.bannedReason || 'This account has been suspended by the administrator.'}`);
      return;
    }

    const storedPasswords = getStoredPasswords();
    const registeredPwd = storedPasswords[user.email.toLowerCase()] || storedPasswords[user.username.toLowerCase()];
    
    // Check password match (or default allow for seeded users if not modified)
    if (registeredPwd && registeredPwd !== password) {
      setErrorMessage('Incorrect password. Please try again or use Forgot Password.');
      return;
    }

    // Success!
    setCurrentUser(user);
    onSuccess(user);
    onClose();
  };

  // 2. Handle Register (Step 1 -> generates OTP)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const effectiveSchool = school === 'Other' ? customSchool.trim() : school.trim();
    if (!effectiveSchool) {
      setErrorMessage('Please select or specify your Grade 12 high school.');
      return;
    }

    if (selectedSubjects.length < 4) {
      setErrorMessage('Please select at least 4 Grade 12 subjects (CAPS requires 7 subjects for matric).');
      return;
    }

    const cleanInitials = initials.trim().toUpperCase();
    if (!cleanInitials) {
      setErrorMessage('Please enter your initials (e.g. K.L.).');
      return;
    }

    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '_');
    if (cleanUsername.length < 3) {
      setErrorMessage('Username must be at least 3 characters.');
      return;
    }

    const cleanGmail = gmail.trim().toLowerCase();
    if (!cleanGmail || !cleanGmail.includes('@')) {
      setErrorMessage('Please provide a valid Gmail / Email address.');
      return;
    }

    // Validate strict password
    const pwdVal = validatePassword(registerPassword);
    if (!pwdVal.valid) {
      setErrorMessage(`Password does not meet required criteria: ${pwdVal.errorMessage}`);
      return;
    }

    // Check if user already exists
    const users = getStoredUsers();
    const existing = users.find(
      u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanGmail
    );
    if (existing) {
      setErrorMessage('An account with this username or Gmail already exists. Please log in.');
      return;
    }

    // Create pending user
    const newUser: User = {
      id: `user-${Date.now()}`,
      initials: cleanInitials,
      username: cleanUsername,
      email: cleanGmail,
      phone: phone.trim() || undefined,
      school: effectiveSchool,
      province,
      subjects: selectedSubjects,
      role: 'learner',
      isVerified: false,
      createdAt: new Date().toISOString(),
      studyStreakDays: 1,
      hoursStudied: 0,
      papersCompleted: 0
    };

    // Save password
    const storedPasswords = getStoredPasswords();
    storedPasswords[cleanGmail] = registerPassword;
    storedPasswords[cleanUsername] = registerPassword;
    saveStoredPasswords(storedPasswords);

    // Save pending user into stored list
    saveStoredUsers([...users, newUser]);
    setPendingUser(newUser);

    // Generate authentic OTP
    const target = otpDeliveryMethod === 'sms' && phone.trim() ? phone.trim() : cleanGmail;
    setOtpTarget(target);
    const { code } = generateOTP(target);
    setGeneratedDemoCode(code);

    // Move to OTP screen
    setMode('otp');
    setSuccessMessage(`OTP sent successfully to your ${otpDeliveryMethod === 'sms' ? 'phone' : 'Gmail'}!`);
  };

  // 3. Handle OTP Verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otpCode || otpCode.trim().length < 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    const isValid = verifyOTP(otpTarget, otpCode.trim());
    if (!isValid) {
      setErrorMessage('Invalid or expired OTP code. Please check and try again.');
      return;
    }

    if (mode === 'forgot') {
      // Password reset succeeded
      const storedPasswords = getStoredPasswords();
      storedPasswords[otpTarget.toLowerCase()] = newPassword;
      saveStoredPasswords(storedPasswords);

      const users = getStoredUsers();
      const updatedUser = users.find(
        u => u.email.toLowerCase() === otpTarget.toLowerCase() || u.phone === otpTarget
      );

      if (updatedUser) {
        setCurrentUser(updatedUser);
        onSuccess(updatedUser);
      }
      setSuccessMessage('Password successfully updated! You are now logged in.');
      setTimeout(() => onClose(), 800);
      return;
    }

    // New user registration verification
    if (pendingUser) {
      const users = getStoredUsers();
      const updatedList = users.map(u => {
        if (u.id === pendingUser.id) {
          return { ...u, isVerified: true };
        }
        return u;
      });
      saveStoredUsers(updatedList);
      const verifiedUser = { ...pendingUser, isVerified: true };
      setCurrentUser(verifiedUser);
      onSuccess(verifiedUser);
      setSuccessMessage('Account verified successfully! Welcome to Lumina SA.');
      setTimeout(() => onClose(), 800);
    }
  };

  // 4. Handle Forgot Password (Step 1)
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanTarget = forgotIdentifier.trim().toLowerCase();
    if (!cleanTarget) {
      setErrorMessage('Please enter your registered Gmail or phone number.');
      return;
    }

    const pwdVal = validatePassword(newPassword);
    if (!pwdVal.valid) {
      setErrorMessage(`New password does not meet required criteria: ${pwdVal.errorMessage}`);
      return;
    }

    const users = getStoredUsers();
    const user = users.find(
      u => u.email.toLowerCase() === cleanTarget || u.phone === cleanTarget
    );

    if (!user) {
      setErrorMessage('No account found with this Gmail address or phone number.');
      return;
    }

    // Generate reset OTP
    setOtpTarget(cleanTarget);
    const { code } = generateOTP(cleanTarget);
    setGeneratedDemoCode(code);
    setMode('otp');
    setSuccessMessage(`Reset code sent to ${cleanTarget}!`);
  };

  // Quick 1-click test credentials
  const fillDemoLearner = () => {
    setLoginIdentifier('karabolekalakala44@gmail.com');
    setLoginPassword('Matric2026Pass#1');
  };

  const fillDemoAdmin = () => {
    setLoginIdentifier('admin@lumina.co.za');
    setLoginPassword('LuminaSA#2026Admin');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm">
              L
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {mode === 'login' && 'Log In to Lumina SA'}
                {mode === 'register' && 'Create Grade 12 Account'}
                {mode === 'forgot' && 'Reset Your Password'}
                {mode === 'otp' && 'Verify Security OTP'}
              </h2>
              <p className="text-xs text-slate-400">
                South Africa National Senior Certificate (NSC) Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Navigation Tabs (Login vs Create Account) */}
        {(mode === 'login' || mode === 'register') && (
          <div className="flex border-b border-slate-200 bg-slate-50 text-sm font-medium">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                mode === 'login'
                  ? 'border-amber-500 text-amber-900 bg-white font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                mode === 'register'
                  ? 'border-amber-500 text-amber-900 bg-white font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gmail Account or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. karabolekalakala44@gmail.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-xs text-amber-600 hover:text-amber-700 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Must be at least 15 characters"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-xs"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  South African NSC security requirement: 15+ characters, 1 uppercase, 1 number, 1 special symbol.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Log In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Fill Test Helpers */}
              <div className="pt-4 border-t border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block mb-2 uppercase tracking-wider">
                  Quick Demo Accounts
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={fillDemoLearner}
                    className="p-2 text-left border border-slate-200 hover:border-amber-400 rounded-lg bg-slate-50 hover:bg-amber-50/50 transition-colors text-xs"
                  >
                    <div className="font-semibold text-slate-800">Karabo (Learner)</div>
                    <div className="text-[10px] text-slate-500 truncate">Matric 7 Subjects</div>
                  </button>
                  <button
                    type="button"
                    onClick={fillDemoAdmin}
                    className="p-2 text-left border border-slate-200 hover:border-amber-400 rounded-lg bg-slate-50 hover:bg-amber-50/50 transition-colors text-xs"
                  >
                    <div className="font-semibold text-slate-800">Admin Portal</div>
                    <div className="text-[10px] text-slate-500 truncate">Manage Users & Stats</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: CREATE ACCOUNT */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* School and Province */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Province
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    {SA_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    School (Grade 12) *
                  </label>
                  <select
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">-- Select Your High School --</option>
                    {NOTABLE_SA_SCHOOLS.map((sch) => (
                      <option key={sch} value={sch}>{sch}</option>
                    ))}
                    <option value="Other">Other / Not Listed</option>
                  </select>
                </div>
              </div>

              {school === 'Other' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter High School Name
                  </label>
                  <input
                    type="text"
                    value={customSchool}
                    onChange={(e) => setCustomSchool(e.target.value)}
                    placeholder="e.g. Athlone High School"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}

              {/* Grade 12 Subjects Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Grade 12 Subjects Enrolled *
                  </label>
                  <span className="text-[11px] text-amber-700 font-medium">
                    {selectedSubjects.length} subjects chosen
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">
                  Select the CAPS subjects you take in Grade 12 for personalized past papers and AI tutoring:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                  {ALL_GRADE12_SUBJECTS.map((subj) => {
                    const isSelected = selectedSubjects.includes(subj.name);
                    return (
                      <button
                        type="button"
                        key={subj.id}
                        onClick={() => handleToggleSubject(subj.name)}
                        className={`text-left px-2 py-1.5 rounded text-[11px] font-medium border transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate mr-1">{subj.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-amber-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Initials & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Initials * (e.g. K.L.)
                  </label>
                  <input
                    type="text"
                    value={initials}
                    onChange={(e) => setInitials(e.target.value.toUpperCase())}
                    placeholder="e.g. K.L."
                    maxLength={6}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 uppercase font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. karabo_26"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Gmail & Optional Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gmail Account *
                  </label>
                  <input
                    type="email"
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    placeholder="e.g. learner@gmail.com"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+27 82 000 0000"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* OTP Delivery Choice */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Send Verification OTP via:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer ${
                    otpDeliveryMethod === 'gmail' ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold' : 'border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="otpMethod"
                      checked={otpDeliveryMethod === 'gmail'}
                      onChange={() => setOtpDeliveryMethod('gmail')}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <span>Gmail Verification</span>
                  </label>
                  <label className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer ${
                    otpDeliveryMethod === 'sms' ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold' : 'border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="otpMethod"
                      checked={otpDeliveryMethod === 'sms'}
                      onChange={() => setOtpDeliveryMethod('sms')}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <span>SMS Verification</span>
                  </label>
                </div>
              </div>

              {/* Password with Strict Rule Engine */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="At least 15 characters, uppercase, number, symbol"
                  required
                  className={`w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 font-mono ${
                    registerPassword && !currentPasswordVal?.valid
                      ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-amber-500'
                  }`}
                />

                {/* Password Rules Visual Checklist */}
                <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Strict Password Rules (Mandatory for NSC Portal):
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${currentPasswordVal?.hasLength ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                      {currentPasswordVal?.hasLength ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400 ml-1 mr-1" />}
                      <span>At least 15 characters ({registerPassword.length}/15)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${currentPasswordVal?.hasUpper ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                      {currentPasswordVal?.hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400 ml-1 mr-1" />}
                      <span>One uppercase letter (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${currentPasswordVal?.hasNumber ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                      {currentPasswordVal?.hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400 ml-1 mr-1" />}
                      <span>One number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${currentPasswordVal?.hasSpecial ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                      {currentPasswordVal?.hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400 ml-1 mr-1" />}
                      <span>One special symbol (!@#$...)</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Continue to OTP Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 3: OTP VERIFICATION */}
          {mode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Enter 6-Digit Verification Code</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  We sent a 6-digit one-time PIN to: <strong className="text-slate-900">{otpTarget}</strong>
                </p>
              </div>

              {/* Demo Helper Box */}
              {generatedDemoCode && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-amber-900">Simulated OTP Code:</span>
                    <span className="ml-2 font-mono font-bold text-slate-900 text-sm tracking-wider">
                      {generatedDemoCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpCode(generatedDemoCode)}
                    className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-2 py-1 rounded transition-colors"
                  >
                    Autofill OTP
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="● ● ● ● ● ●"
                  required
                  className="w-full text-center tracking-[0.5em] py-3 text-lg font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Verify & Complete</span>
                <Check className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const { code } = generateOTP(otpTarget);
                    setGeneratedDemoCode(code);
                    setSuccessMessage(`New code generated: ${code}`);
                  }}
                  className="hover:text-amber-700 flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Resend OTP Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="hover:text-slate-900 underline"
                >
                  Back to Log In
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <p className="text-xs text-slate-600 mb-3">
                  Enter your registered Gmail or phone number. We will send you an OTP to verify your identity and set a new password.
                </p>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gmail or Phone Number
                </label>
                <input
                  type="text"
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  placeholder="e.g. karabolekalakala44@gmail.com"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create New Password *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Must be at least 15 characters"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono"
                />

                {/* Password checklist */}
                <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Password Requirements:
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div className={`flex items-center gap-1 ${currentPasswordVal?.hasLength ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {currentPasswordVal?.hasLength ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mx-1" />}
                      <span>15+ characters</span>
                    </div>
                    <div className={`flex items-center gap-1 ${currentPasswordVal?.hasUpper ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {currentPasswordVal?.hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mx-1" />}
                      <span>1 uppercase</span>
                    </div>
                    <div className={`flex items-center gap-1 ${currentPasswordVal?.hasNumber ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {currentPasswordVal?.hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mx-1" />}
                      <span>1 number</span>
                    </div>
                    <div className={`flex items-center gap-1 ${currentPasswordVal?.hasSpecial ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {currentPasswordVal?.hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mx-1" />}
                      <span>1 special symbol</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Send Reset OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-500 hover:text-slate-900 underline"
                >
                  Return to Log In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
