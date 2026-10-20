import React, { useState, useEffect } from 'react';
import { User, Grade12Subject } from '../../types';
import { ALL_GRADE12_SUBJECTS } from '../../data/grade12Subjects';
import matricBanner from '../../assets/images/lumina_matric_banner_1792414055860.jpg';
import { BookOpen, Sparkles, FileText, Flame, Clock, Award, CheckCircle, ArrowRight, Play, Pause, RotateCcw, Calendar, Check } from 'lucide-react';

interface LearnerDashboardProps {
  currentUser: User;
  onNavigateToPastPapers: (subjectName?: string) => void;
  onNavigateToMzansiTuta: (subjectName?: string) => void;
  onOpenSubscription: () => void;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({
  currentUser,
  onNavigateToPastPapers,
  onNavigateToMzansiTuta,
  onOpenSubscription,
}) => {
  // Focus Timer state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');
  
  // Daily question state
  const [showDailyMemo, setShowDailyMemo] = useState(false);
  const [dailyAnswerChosen, setDailyAnswerChosen] = useState<number | null>(null);

  // Focus timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      if (timerMode === 'study') {
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        setTimerMode('study');
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, timerMode]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate days until NSC Finals (approx late October / November)
  const calculateDaysUntilNSC = () => {
    const targetDate = new Date('2026-10-26T09:00:00');
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const enrolledSubjectObjects = (currentUser.subjects || []).map((name) => {
    const found = ALL_GRADE12_SUBJECTS.find((s) => s.name.toLowerCase() === name.toLowerCase());
    return found || {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      category: 'Sciences & Math' as const,
      shortCode: name.slice(0, 4).toUpperCase(),
      paperCount: 16,
      examCode: 'DBE-NSC',
      color: 'amber',
      description: 'Grade 12 National Senior Certificate curriculum content.'
    };
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 overflow-hidden border border-slate-800 shadow-md">
        <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-luminosity">
          <img src={matricBanner} alt="Lumina Grade 12" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>South Africa Grade 12 National Senior Certificate (NSC)</span>
              <span aria-hidden="true">·</span>
              <span>Class of 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {currentUser.username} ({currentUser.initials})
            </h1>
            <p className="text-sm text-slate-300">
              Enrolled at <span className="text-white font-medium">{currentUser.school}</span> with{' '}
              <span className="text-amber-400 font-semibold">{currentUser.subjects.length} matric subjects</span>.
              Targeting Level 7 distinctions across your CAPS syllabus.
            </p>
          </div>

          {/* NSC Finals Countdown Pill/Box */}
          <div className="shrink-0 bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 text-center min-w-[200px]">
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400 block">
              NSC Final Exams In
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums my-1">
              {calculateDaysUntilNSC()} <span className="text-sm font-sans font-normal text-slate-400">days</span>
            </div>
            <span className="text-[11px] text-slate-400 block">
              DBE National Examination kickoff
            </span>
          </div>
        </div>
      </div>

      {/* Subscription & Free Trial Status Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-900/5 rounded-xl border border-amber-500/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-900">
                {currentUser.subscription?.status === 'trialing'
                  ? '7-Day Free Trial Active'
                  : currentUser.subscription?.plan === 'yearly'
                  ? 'Matric Year Pass ($49.99/year)'
                  : currentUser.subscription?.plan === 'monthly'
                  ? 'Monthly Plan ($6.99 / month)'
                  : 'Start Your 7-Day Free Trial'}
              </span>
              <span className="text-slate-400" aria-hidden="true">·</span>
              <span className="text-[11px] text-amber-800 font-semibold">
                {currentUser.subscription?.status === 'trialing'
                  ? 'Full AI & Past Papers Access ($0 today)'
                  : currentUser.subscription?.status === 'active'
                  ? 'Active Membership'
                  : 'Then $6.99 / mo or $49.99 / yr'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentUser.subscription?.status === 'trialing'
                ? 'Your 7-day trial gives you unlimited Mzansi Tutor AI summaries, flashcards, MCQs, and complete NSC Past Papers.'
                : currentUser.subscription?.status === 'active'
                ? 'Your account is fully unlocked for all 2026 DBE examination prep and revision.'
                : 'Try Lumina SA risk-free for 7 days. Monthly fee is $6.99/mo or save 30% with a yearly subscription.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSubscription}
          className="self-start sm:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-lg transition-colors shrink-0 shadow-xs flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>
            {currentUser.subscription?.status === 'trialing'
              ? 'Manage / Upgrade Plan'
              : currentUser.subscription?.status === 'active'
              ? 'View Subscription'
              : 'Start 7-Day Free Trial'}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Study Streak</div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {currentUser.studyStreakDays || 14} <span className="text-xs font-normal text-slate-500">days</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Hours Logged</div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {currentUser.hoursStudied || 38.5} <span className="text-xs font-normal text-slate-500">hrs</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Papers Practiced</div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {currentUser.papersCompleted || 16} <span className="text-xs font-normal text-slate-500">papers</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Enrolled Subjects</div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {currentUser.subjects.length} <span className="text-xs font-normal text-slate-500">subjects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: My Subjects + Study Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: My Enrolled Subjects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                My Grade 12 Subjects
              </h2>
              <p className="text-xs text-slate-500">
                Recommended past papers and AI study modules tailored to your registered curriculum
              </p>
            </div>
            <button
              onClick={() => onNavigateToPastPapers()}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
            >
              <span>View All Past Papers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enrolledSubjectObjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-amber-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 uppercase tracking-wider font-mono">
                      {subject.shortCode}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {subject.paperCount} Past Papers
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {subject.name}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {subject.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToPastPapers(subject.name)}
                    className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Past Papers</span>
                  </button>

                  <button
                    onClick={() => onNavigateToMzansiTuta(subject.name)}
                    className="flex-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>Mzansi Tutor</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Focus Timer & Question of the Day */}
        <div className="space-y-6">
          
          {/* Matric Focus Session (Pomodoro) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Matric Focus Timer</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                timerMode === 'study' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {timerMode === 'study' ? 'Study Interval' : 'Rest Break'}
              </span>
            </div>

            <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-100 my-2">
              <div className="text-4xl font-extrabold text-slate-900 font-mono tracking-wider tabular-nums">
                {formatTimer(timerSeconds)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {timerMode === 'study' ? 'Deep NSC exam preparation' : 'Time for water and mental reset'}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  isTimerRunning
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTimerRunning ? 'Pause Session' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(timerMode === 'study' ? 25 * 60 : 5 * 60);
                }}
                className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question of the Day */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                NSC Question of the Day
              </span>
              <span className="text-xs text-slate-400">Mathematics P1</span>
            </div>

            <p className="text-xs font-medium text-slate-800 leading-relaxed">
              If <span className="font-mono font-semibold">f(x) = 3x² - 12x + 7</span>, at what value of <span className="font-mono">x</span> does the function have its local minimum value?
            </p>

            <div className="space-y-1.5">
              {[
                { label: 'A', value: 'x = -2' },
                { label: 'B', value: 'x = 2' },
                { label: 'C', value: 'x = 4' },
                { label: 'D', value: 'x = -4' }
              ].map((opt, idx) => (
                <button
                  key={opt.label}
                  onClick={() => setDailyAnswerChosen(idx)}
                  className={`w-full text-left p-2 rounded-lg text-xs font-medium border transition-colors flex items-center justify-between ${
                    dailyAnswerChosen === idx
                      ? idx === 1
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-rose-50 border-rose-300 text-rose-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>
                    <strong className="mr-2 font-mono">{opt.label})</strong> {opt.value}
                  </span>
                  {dailyAnswerChosen === idx && (
                    idx === 1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="text-[10px] text-rose-600 font-bold">Incorrect</span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowDailyMemo(!showDailyMemo)}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold hover:underline"
              >
                {showDailyMemo ? 'Hide Official Memo' : 'Show Official DBE Marking Memo'}
              </button>

              {showDailyMemo && (
                <div className="mt-2 p-3 bg-slate-900 text-slate-100 text-xs rounded-lg font-mono space-y-1">
                  <div className="text-amber-400 font-bold">Official DBE Solution:</div>
                  <div>f'(x) = 6x - 12 = 0 ✓ (1 mark)</div>
                  <div>6x = 12 → x = 2 ✓ (1 mark)</div>
                  <div className="text-slate-400 text-[11px] font-sans">
                    f''(x) = 6 &gt; 0, confirming a local minimum at x = 2. Option B is correct.
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
