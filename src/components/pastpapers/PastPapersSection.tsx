import React, { useState } from 'react';
import { User, PastPaper } from '../../types';
import { PAST_PAPERS_CATALOG } from '../../data/pastPapersData';
import { ALL_GRADE12_SUBJECTS } from '../../data/grade12Subjects';
import { FileText, Search, Filter, BookOpen, Download, Clock, Check, Sparkles, X, Columns, Eye, ChevronRight } from 'lucide-react';

interface PastPapersSectionProps {
  currentUser: User | null;
  initialSubject?: string;
  onSendToMzansiTuta: (docText: string, subject: string, title: string) => void;
}

export const PastPapersSection: React.FC<PastPapersSectionProps> = ({
  currentUser,
  initialSubject,
  onSendToMzansiTuta,
}) => {
  const [filterMode, setFilterMode] = useState<'recommended' | 'all'>(
    currentUser && currentUser.subjects?.length ? 'recommended' : 'all'
  );
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || 'all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedPaperNum, setSelectedPaperNum] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active viewing paper for modal
  const [activePaper, setActivePaper] = useState<PastPaper | null>(null);
  const [viewSplitMode, setViewSplitMode] = useState<'split' | 'paper' | 'memo'>('split');
  const [examTimer, setExamTimer] = useState<number>(3 * 3600); // 3 hours
  const [isExamTimerRunning, setIsExamTimerRunning] = useState(false);
  const [completedPapers, setCompletedPapers] = useState<string[]>([]);

  // Filter logic
  const filteredPapers = PAST_PAPERS_CATALOG.filter((paper) => {
    // 1. Recommended vs All
    if (filterMode === 'recommended' && currentUser?.subjects?.length) {
      const isEnrolled = currentUser.subjects.some(
        (s) => s.toLowerCase() === paper.subjectName.toLowerCase()
      );
      if (!isEnrolled) return false;
    }

    // 2. Subject filter
    if (selectedSubject !== 'all' && paper.subjectName.toLowerCase() !== selectedSubject.toLowerCase()) {
      return false;
    }

    // 3. Year filter
    if (selectedYear !== 'all' && paper.year.toString() !== selectedYear) {
      return false;
    }

    // 4. Paper number
    if (selectedPaperNum !== 'all' && paper.paperNumber !== selectedPaperNum) {
      return false;
    }

    // 5. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = paper.title.toLowerCase().includes(q);
      const matchSubject = paper.subjectName.toLowerCase().includes(q);
      const matchTopics = (paper.topicsCovered || []).some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSubject && !matchTopics) return false;
    }

    return true;
  });

  const togglePaperCompleted = (paperId: string) => {
    if (completedPapers.includes(paperId)) {
      setCompletedPapers(completedPapers.filter((id) => id !== paperId));
    } else {
      setCompletedPapers([...completedPapers, paperId]);
    }
  };

  const formatExamTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
            <span>National Senior Certificate (NSC) Archive</span>
            <span aria-hidden="true">·</span>
            <span>Department of Basic Education CAPS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Grade 12 Past Exam Papers & Marking Guidelines
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Official question papers paired with Department of Basic Education (DBE) marking guidelines.
            Filter by your enrolled Grade 12 subjects or browse the entire South African curriculum.
          </p>
        </div>

        {/* Recommended vs All Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg shrink-0 self-start md:self-auto">
          <button
            onClick={() => setFilterMode('recommended')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filterMode === 'recommended'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recommended for You ({currentUser?.subjects?.length || 0})
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Browse All NSC Subjects
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic e.g. Calculus, Acids..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Subject Dropdown */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
            >
              <option value="all">All Subjects (Grade 12)</option>
              {ALL_GRADE12_SUBJECTS.map((sub) => (
                <option key={sub.id} value={sub.name}>{sub.name}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-800 font-medium"
            >
              <option value="all">All Exam Years</option>
              <option value="2024">2024 (Latest NSC)</option>
              <option value="2023">2023 (NSC)</option>
              <option value="2022">2022 (NSC)</option>
              <option value="2021">2021 (NSC)</option>
            </select>
          </div>

          {/* Paper Number */}
          <div>
            <select
              value={selectedPaperNum}
              onChange={(e) => setSelectedPaperNum(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-800 font-medium"
            >
              <option value="all">Paper 1 &amp; Paper 2</option>
              <option value="P1">Paper 1 (P1)</option>
              <option value="P2">Paper 2 (P2)</option>
              <option value="P3">Paper 3 (P3)</option>
            </select>
          </div>
        </div>

        {/* Quick subject pills for learner's subjects */}
        {currentUser && currentUser.subjects && currentUser.subjects.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
            <span className="text-[11px] font-semibold text-slate-500 shrink-0 mr-1">
              Quick Filter:
            </span>
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedSubject === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All My Subjects
            </button>
            {currentUser.subjects.map((subName) => (
              <button
                key={subName}
                onClick={() => setSelectedSubject(subName)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedSubject === subName
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {subName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Papers Grid */}
      {filteredPapers.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No past papers match your active filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try switching from "Recommended" to "Browse All NSC Subjects" or clearing your search term.
          </p>
          <button
            onClick={() => {
              setFilterMode('all');
              setSelectedSubject('all');
              setSelectedYear('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPapers.map((paper) => {
            const isDone = completedPapers.includes(paper.id);
            return (
              <div
                key={paper.id}
                className={`bg-white rounded-xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isDone ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono">
                      {paper.year} · {paper.paperNumber}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {paper.session}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                    {paper.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 font-mono">
                    <span>{paper.marks} Marks</span>
                    <span aria-hidden="true">·</span>
                    <span>{paper.durationHours} Hours</span>
                    <span aria-hidden="true">·</span>
                    <span>{paper.language}</span>
                  </div>

                  {/* Topics covered */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {paper.topicsCovered.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                    {paper.topicsCovered.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{paper.topicsCovered.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActivePaper(paper);
                      setViewSplitMode('split');
                    }}
                    className="flex-1 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Paper &amp; Memo</span>
                  </button>

                  <button
                    onClick={() =>
                      onSendToMzansiTuta(
                        paper.paperPreviewText,
                        paper.subjectName,
                        `${paper.subjectName} ${paper.year} ${paper.paperNumber}`
                      )
                    }
                    title="Send paper to Mzansi Tuta for AI questions, MCQs & flashcards"
                    className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => togglePaperCompleted(paper.id)}
                    title={isDone ? 'Marked as Practiced' : 'Mark as Practiced'}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isDone
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-300 text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Split-Screen Interactive Paper & Marking Guideline Viewer */}
      {activePaper && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-3.5 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs font-mono">
                  {activePaper.paperNumber}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">
                    {activePaper.subjectName} - {activePaper.year} {activePaper.session}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {activePaper.marks} Marks · {activePaper.durationHours} Hours · DBE National Senior Certificate
                  </p>
                </div>
              </div>

              {/* View mode toggle & Actions */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center bg-slate-800 p-0.5 rounded-lg text-xs font-medium border border-slate-700">
                  <button
                    onClick={() => setViewSplitMode('split')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      viewSplitMode === 'split' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
                    }`}
                  >
                    Split View
                  </button>
                  <button
                    onClick={() => setViewSplitMode('paper')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      viewSplitMode === 'paper' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
                    }`}
                  >
                    Question Paper
                  </button>
                  <button
                    onClick={() => setViewSplitMode('memo')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      viewSplitMode === 'memo' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'
                    }`}
                  >
                    Official Memo
                  </button>
                </div>

                {/* Send to Mzansi Tuta AI */}
                <button
                  onClick={() => {
                    onSendToMzansiTuta(
                      activePaper.paperPreviewText,
                      activePaper.subjectName,
                      `${activePaper.subjectName} ${activePaper.year} ${activePaper.paperNumber}`
                    );
                    setActivePaper(null);
                  }}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze in Mzansi Tuta</span>
                </button>

                <button
                  onClick={() => setActivePaper(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split Screen Body */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              
              {/* Left Column: Question Paper */}
              {(viewSplitMode === 'split' || viewSplitMode === 'paper') && (
                <div className={`p-6 bg-slate-50 overflow-y-auto ${viewSplitMode === 'paper' ? 'md:col-span-2' : ''}`}>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-600" />
                      Official Question Paper
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {activePaper.marks} Total Marks
                    </span>
                  </div>

                  <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-normal bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                    {activePaper.paperPreviewText}
                  </pre>
                </div>
              )}

              {/* Right Column: Marking Guideline (Memorandum) */}
              {(viewSplitMode === 'split' || viewSplitMode === 'memo') && (
                <div className={`p-6 bg-white overflow-y-auto ${viewSplitMode === 'memo' ? 'md:col-span-2' : ''}`}>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Department of Basic Education Memorandum (Rubric)
                    </span>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-semibold">
                      Marking Guideline
                    </span>
                  </div>

                  <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-normal bg-emerald-50/20 p-4 rounded-lg border border-emerald-200/60 shadow-2xs">
                    {activePaper.memoPreviewText}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer with Exam timer simulation */}
            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Exam Practice Simulator:</span>
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {formatExamTimer(examTimer)}
                </span>
                <button
                  onClick={() => setIsExamTimerRunning(!isExamTimerRunning)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                    isExamTimerRunning
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  {isExamTimerRunning ? 'Pause' : 'Start 3-Hour Exam'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePaperCompleted(activePaper.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    completedPapers.includes(activePaper.id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {completedPapers.includes(activePaper.id) ? 'Completed' : 'Mark as Practiced'}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
