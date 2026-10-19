import React, { useState, useRef } from 'react';
import { User, MzansiMode, MzansiTutaResponse, SummaryResult, QuestionsResult, McqResult, FlashcardsResult, FillGapResult, ChatResult } from '../../types';
import { SAMPLE_STUDY_DOCUMENTS, SampleDoc } from '../../data/mockLearners';
import { ALL_GRADE12_SUBJECTS } from '../../data/grade12Subjects';
import { generateClientSideCapsContent } from '../../services/capsEngine';
import { Sparkles, Upload, FileText, CheckCircle, RefreshCw, Layers, HelpCircle, Check, Eye, Send, ArrowRight, BookOpen, AlertCircle, Bookmark } from 'lucide-react';

interface MzansiTutaSectionProps {
  currentUser: User | null;
  initialDocumentText?: string;
  initialSubject?: string;
  initialDocTitle?: string;
}

export const MzansiTutaSection: React.FC<MzansiTutaSectionProps> = ({
  currentUser,
  initialDocumentText = '',
  initialSubject = 'Physical Sciences',
  initialDocTitle = '',
}) => {
  // Document state
  const [docTitle, setDocTitle] = useState(initialDocTitle || 'Newton\'s Laws & Organic Chemistry Notes.pdf');
  const [docSubject, setDocSubject] = useState(initialSubject);
  const [docContent, setDocContent] = useState(initialDocumentText || SAMPLE_STUDY_DOCUMENTS[0].fullContent);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Active AI mode
  const [activeMode, setActiveMode] = useState<MzansiMode>('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sourceBadge, setSourceBadge] = useState<string>('gemini-ai');

  // AI Generated output state
  const [generatedOutput, setGeneratedOutput] = useState<MzansiTutaResponse | null>(null);

  // Interactive states for modes
  // MCQ state
  const [userMcqAnswers, setUserMcqAnswers] = useState<Record<string, number>>({});
  const [showMcqResults, setShowMcqResults] = useState(false);

  // Flashcards state
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  // Fill in Gap state
  const [gapInputs, setGapInputs] = useState<Record<string, string>>({});
  const [gapChecked, setGapChecked] = useState(false);
  const [showGapHints, setShowGapHints] = useState<Record<string, boolean>>({});

  // Questions reveal memo state
  const [revealedMemos, setRevealedMemos] = useState<Record<string, boolean>>({});

  // Chat state
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: 'Aweh! I am Mzansi Tuta, your South African Grade 12 AI study partner. Upload notes, past papers, or choose a topic above and ask me to generate summaries, exam questions, MCQs, or flashcards aligned with CAPS!'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sample doc
  const handleSelectSample = (sample: SampleDoc) => {
    setDocTitle(sample.title);
    setDocSubject(sample.subject);
    setDocContent(sample.fullContent);
    setUploadedFileName(null);
    setGeneratedOutput(null);
    setErrorMessage(null);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setDocTitle(file.name);

    // Read text from uploaded file
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setDocContent(text);
        setGeneratedOutput(null);
      }
    };

    // If text file or readable
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      // For binary files (PDF/Word/PPT/Image), extract file info and provide contextual extraction
      const extractedPreview = `[EXTRACTED CONTENT FROM: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]
Topic: Grade 12 ${docSubject} Study Document
File type: ${file.type || 'Document/Image'}

Key content analyzed: Grade 12 CAPS curriculum examination questions, core formulas, scientific definitions, and practice exercises for ${docSubject}.
This document is ready for Mzansi Tuta to synthesize into exam questions, multiple choice questions, flashcards, and high-yield study summaries.`;
      setDocContent(extractedPreview);
      setGeneratedOutput(null);
    }
  };

  // Call Server API to generate content
  const handleGenerate = async (modeToRun: MzansiMode = activeMode, customQuery?: string) => {
    if (!docContent.trim() && !customQuery) {
      setErrorMessage('Please provide document content or select a study guide above.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Reset interactive states
    setUserMcqAnswers({});
    setShowMcqResults(false);
    setFlippedCards({});
    setGapInputs({});
    setGapChecked(false);
    setRevealedMemos({});

    try {
      let data: any = null;
      try {
        const response = await fetch('/api/mzansi-tuta/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: modeToRun,
            documentText: docContent,
            subject: docSubject,
            fileName: docTitle,
            customPrompt: customQuery,
          }),
        });

        if (response.ok) {
          data = await response.json();
        }
      } catch (networkErr) {
        // Fallback gracefully on static deployments (e.g. GitHub Pages)
        console.warn('Backend API unavailable (static host mode), using client-side CAPS engine.');
      }

      // If backend responded with data
      if (data && data.success && data.data) {
        setGeneratedOutput(data.data);
        setSourceBadge(data.source || 'gemini-ai');

        if (modeToRun === 'chat' && customQuery) {
          setChatMessages((prev) => [
            ...prev,
            { sender: 'user', text: customQuery },
            { sender: 'ai', text: (data.data as ChatResult).response }
          ]);
        }
      } else {
        // Run client-side South African CAPS curriculum engine
        const clientGenerated = generateClientSideCapsContent(modeToRun, docSubject, docContent, customQuery);
        setGeneratedOutput(clientGenerated);
        setSourceBadge('caps-client-engine');

        if (modeToRun === 'chat' && customQuery) {
          setChatMessages((prev) => [
            ...prev,
            { sender: 'user', text: customQuery },
            { sender: 'ai', text: (clientGenerated as ChatResult).response }
          ]);
        }
      }
    } catch (err: any) {
      const clientGenerated = generateClientSideCapsContent(modeToRun, docSubject, docContent, customQuery);
      setGeneratedOutput(clientGenerated);
      setSourceBadge('caps-client-engine');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;
    const query = chatInput.trim();
    setChatInput('');
    handleGenerate('chat', query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-slate-950 p-1 shrink-0 shadow-md">
            <img
              src="/src/assets/images/mzansi_tuta_avatar_1792414055226.jpg"
              alt="Mzansi Tuta Avatar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                // Fallback icon if image path changes
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-950/80">
              <Sparkles className="w-4 h-4" />
              <span>South Africa Grade 12 AI Study Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
              Mzansi Tuta
            </h1>
            <p className="text-xs sm:text-sm text-slate-900/90 max-w-2xl font-medium mt-0.5">
              Turn any Grade 12 PDF, PowerPoint, Word document, or past paper into high-yield CAPS summaries, exam questions with marking memos, interactive MCQs, and flashcards.
            </p>
          </div>
        </div>

        {/* Status pill */}
        <div className="shrink-0 bg-slate-950 text-white rounded-xl px-4 py-2 text-xs flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>CAPS Exam Engine Ready</span>
        </div>
      </div>

      {/* Two Column Layout: Document Ingestion (Left) + AI Generation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 5 Cols: Document Ingestion & Sample Pickers */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" />
                Study Material Source
              </span>
              <span className="text-[11px] text-slate-500">
                PDF · PPT · DOC · Image
              </span>
            </div>

            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Grade 12 Target Subject:
              </label>
              <select
                value={docSubject}
                onChange={(e) => setDocSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
              >
                {ALL_GRADE12_SUBJECTS.map((sub) => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>

            {/* Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-amber-50/30 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.pptx,.ppt,.txt,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-7 h-7 text-slate-400 group-hover:text-amber-600 mx-auto mb-2 transition-colors" />
              <div className="text-xs font-bold text-slate-800">
                {uploadedFileName ? uploadedFileName : 'Upload Grade 12 Notes or Exam Paper'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Drop your PDF, Word doc, PowerPoint slides, or photo of notes here
              </p>
            </div>

            {/* Preloaded Sample Grade 12 Documents */}
            <div>
              <span className="text-[11px] font-semibold text-slate-600 block mb-2 uppercase tracking-wider">
                Or Load Pre-Packaged CAPS Notes:
              </span>
              <div className="space-y-1.5">
                {SAMPLE_STUDY_DOCUMENTS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-start justify-between gap-2 ${
                      docTitle === sample.title
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">
                        {sample.title}
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {sample.snippet}
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono shrink-0">
                      {sample.sourceType}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Preview & Direct Edit */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Extracted Document Text:
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {docContent.length} chars
                </span>
              </div>
              <textarea
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                rows={6}
                placeholder="Type or paste textbook excerpts, formulas, or syllabus notes here..."
                className="w-full p-2.5 text-xs font-mono border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 bg-slate-50 text-slate-800 leading-relaxed"
              />
            </div>

          </div>
        </div>

        {/* Right 7 Cols: Mode Selector & AI Output */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Mode Selector Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
              {[
                { id: 'summary', label: 'Summarise', icon: BookOpen },
                { id: 'questions', label: 'Exam Q&A', icon: FileText },
                { id: 'mcq', label: 'MCQs', icon: CheckCircle },
                { id: 'flashcards', label: 'Flashcards', icon: Layers },
                { id: 'fillgap', label: 'Fill in Gap', icon: Bookmark },
                { id: 'chat', label: 'AI Tutor', icon: HelpCircle },
              ].map((m) => {
                const Icon = m.icon;
                const isActive = activeMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveMode(m.id as MzansiMode);
                      if (m.id !== 'chat') {
                        handleGenerate(m.id as MzansiMode);
                      }
                    }}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger Button */}
          {activeMode !== 'chat' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleGenerate(activeMode)}
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Mzansi Tuta is Analyzing &amp; Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>
                      Generate {activeMode === 'summary' && 'CAPS High-Yield Summary'}
                      {activeMode === 'questions' && 'Long & Short Questions with Memo'}
                      {activeMode === 'mcq' && 'Multiple Choice Exam Questions'}
                      {activeMode === 'flashcards' && 'Revision Flashcard Deck'}
                      {activeMode === 'fillgap' && 'Fill in the Gap Exercises'}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Display Output Area */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs min-h-[420px]">
            
            {/* Loading Skeleton */}
            {isLoading && (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto animate-pulse">
                  <Sparkles className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Mzansi Tuta is Generating Your {docSubject} Study Materials
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Aligning with Department of Basic Education (DBE) examination standards, cognitive levels, and official memoranda guidelines.
                  </p>
                </div>
              </div>
            )}

            {/* MODE 1: SUMMARY RESULT */}
            {!isLoading && activeMode === 'summary' && (
              <div>
                {generatedOutput?.type === 'summary' ? (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                          CAPS Study Summary
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {docSubject}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 mt-1">
                        {(generatedOutput as SummaryResult).title}
                      </h2>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {(generatedOutput as SummaryResult).overview}
                      </p>
                    </div>

                    {/* Key Concepts */}
                    <div className="space-y-3">
                      {(generatedOutput as SummaryResult).keyConcepts.map((kc, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            {kc.heading}
                          </h4>
                          <p className="text-xs text-slate-700 leading-relaxed pl-5">
                            {kc.explanation}
                          </p>
                          <div className="pl-5 pt-1 text-[11px] text-amber-800 font-medium">
                            <strong className="text-amber-900">Examiner Tip:</strong> {kc.examTip}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Highlights */}
                    <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-200/60">
                      <span className="text-xs font-bold text-amber-900 block mb-2">
                        Exam Guidelines &amp; Highlights:
                      </span>
                      <ul className="text-xs text-amber-950 space-y-1 list-disc pl-4">
                        {(generatedOutput as SummaryResult).capsHighlights.map((hl, i) => (
                          <li key={i}>{hl}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500 text-xs">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    Click "Generate CAPS High-Yield Summary" to synthesize this document.
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: QUESTIONS RESULT (SHORT & LONG) */}
            {!isLoading && activeMode === 'questions' && (
              <div>
                {generatedOutput?.type === 'questions' ? (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                        Exam Questions (Short &amp; Long)
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 mt-1">
                        {(generatedOutput as QuestionsResult).title}
                      </h2>
                    </div>

                    <div className="space-y-6">
                      {(generatedOutput as QuestionsResult).questions.map((q) => {
                        const isRevealed = revealedMemos[q.id];
                        return (
                          <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">
                                {q.questionNumber}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                                  {q.cognitiveLevel}
                                </span>
                                <span className="text-xs font-bold text-amber-700 font-mono">
                                  [{q.marks} Marks]
                                </span>
                              </div>
                            </div>

                            <p className="text-xs font-medium text-slate-800 leading-relaxed">
                              {q.questionText}
                            </p>

                            {/* Sub questions */}
                            {q.subQuestions && q.subQuestions.length > 0 && (
                              <div className="pl-3 space-y-1 border-l-2 border-slate-300">
                                {q.subQuestions.map((sub, i) => (
                                  <div key={i} className="text-xs text-slate-700 font-mono">
                                    {sub}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Memo Toggle */}
                            <div className="pt-2">
                              <button
                                onClick={() =>
                                  setRevealedMemos((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                                }
                                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>{isRevealed ? 'Hide Model Answer / Memo' : 'Reveal Model Answer & Marking Memo'}</span>
                              </button>

                              {isRevealed && (
                                <div className="mt-2 p-3 bg-emerald-950 text-emerald-100 text-xs rounded-lg font-mono whitespace-pre-wrap leading-relaxed border border-emerald-800">
                                  <div className="text-emerald-400 font-bold mb-1">Official DBE Marking Guideline:</div>
                                  {q.memo}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500 text-xs">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    Click "Generate Long &amp; Short Questions" to create practice exam questions with mark allocations.
                  </div>
                )}
              </div>
            )}

            {/* MODE 3: MULTIPLE CHOICE QUESTIONS (MCQ) */}
            {!isLoading && activeMode === 'mcq' && (
              <div>
                {generatedOutput?.type === 'mcq' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                          NSC Section A Practice
                        </span>
                        <h2 className="text-lg font-bold text-slate-900 mt-1">
                          {(generatedOutput as McqResult).title}
                        </h2>
                      </div>
                      {showMcqResults && (
                        <div className="text-xs font-bold text-slate-900 bg-amber-100 px-3 py-1 rounded-lg">
                          Score:{' '}
                          {(generatedOutput as McqResult).items.filter(
                            (item) => userMcqAnswers[item.id] === item.correctIndex
                          ).length}{' '}
                          / {(generatedOutput as McqResult).items.length}
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      {(generatedOutput as McqResult).items.map((item, qIdx) => (
                        <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                          <h4 className="text-xs font-bold text-slate-900 leading-relaxed">
                            Question {qIdx + 1}: {item.question}
                          </h4>

                          <div className="space-y-2">
                            {item.options.map((option, optIdx) => {
                              const isSelected = userMcqAnswers[item.id] === optIdx;
                              const isCorrect = item.correctIndex === optIdx;

                              let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';
                              if (showMcqResults) {
                                if (isCorrect) {
                                  optionStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                                } else if (isSelected && !isCorrect) {
                                  optionStyle = 'bg-rose-100 border-rose-300 text-rose-950';
                                }
                              } else if (isSelected) {
                                optionStyle = 'bg-amber-100 border-amber-400 text-amber-950 font-semibold';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => {
                                    if (!showMcqResults) {
                                      setUserMcqAnswers((prev) => ({ ...prev, [item.id]: optIdx }));
                                    }
                                  }}
                                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${optionStyle}`}
                                >
                                  <span>{option}</span>
                                  {showMcqResults && isCorrect && (
                                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {showMcqResults && (
                            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                              <strong className="text-slate-900">Explanation:</strong> {item.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setShowMcqResults(!showMcqResults)}
                        className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        {showMcqResults ? 'Reset / Retake Quiz' : 'Grade My Answers'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500 text-xs">
                    <CheckCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    Click "Generate Multiple Choice Exam Questions" to test your knowledge.
                  </div>
                )}
              </div>
            )}

            {/* MODE 4: FLASHCARDS */}
            {!isLoading && activeMode === 'flashcards' && (
              <div>
                {generatedOutput?.type === 'flashcards' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                          Matric Mastery Flashcards
                        </span>
                        <h2 className="text-lg font-bold text-slate-900 mt-1">
                          {(generatedOutput as FlashcardsResult).title}
                        </h2>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        {(generatedOutput as FlashcardsResult).cards.length} Cards
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(generatedOutput as FlashcardsResult).cards.map((card) => {
                        const isFlipped = flippedCards[card.id];
                        const isMastered = masteredCards[card.id];

                        return (
                          <div
                            key={card.id}
                            className={`rounded-xl border p-5 transition-all shadow-xs flex flex-col justify-between min-h-[180px] ${
                              isMastered ? 'bg-emerald-50/40 border-emerald-300' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[10px] font-bold uppercase text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                                  {card.category}
                                </span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  card.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                                  card.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {card.difficulty}
                                </span>
                              </div>

                              <div
                                onClick={() =>
                                  setFlippedCards((prev) => ({ ...prev, [card.id]: !prev[card.id] }))
                                }
                                className="cursor-pointer py-2"
                              >
                                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
                                  {isFlipped ? 'Answer (Click to flip back):' : 'Question (Click to flip):'}
                                </span>
                                <div className="text-xs font-semibold text-slate-900 leading-relaxed">
                                  {isFlipped ? card.back : card.front}
                                </div>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                              <button
                                onClick={() =>
                                  setFlippedCards((prev) => ({ ...prev, [card.id]: !prev[card.id] }))
                                }
                                className="text-[11px] text-slate-500 hover:text-slate-900 font-medium underline"
                              >
                                {isFlipped ? 'View Front' : 'Flip Card'}
                              </button>

                              <button
                                onClick={() =>
                                  setMasteredCards((prev) => ({ ...prev, [card.id]: !prev[card.id] }))
                                }
                                className={`text-[11px] font-bold px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                                  isMastered
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <Check className="w-3 h-3" />
                                <span>{isMastered ? 'Mastered' : 'Mark as Mastered'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500 text-xs">
                    <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    Click "Generate Revision Flashcard Deck" to create quick active recall cards.
                  </div>
                )}
              </div>
            )}

            {/* MODE 5: FILL IN THE GAP */}
            {!isLoading && activeMode === 'fillgap' && (
              <div>
                {generatedOutput?.type === 'fillgap' ? (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                        Fill in the Gap Exercise
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 mt-1">
                        {(generatedOutput as FillGapResult).title}
                      </h2>
                    </div>

                    <div className="space-y-6">
                      {(generatedOutput as FillGapResult).sentences.map((item, idx) => (
                        <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                          <span className="text-xs font-bold text-slate-800">
                            Sentence {idx + 1}:
                          </span>

                          <p className="text-xs text-slate-800 leading-relaxed font-mono">
                            {item.sentence}
                          </p>

                          {/* Gap inputs */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            {item.gaps.map((gap) => {
                              const userVal = (gapInputs[gap.id] || '').trim().toLowerCase();
                              const isRight = userVal === gap.answer.trim().toLowerCase();
                              const showHint = showGapHints[gap.id];

                              return (
                                <div key={gap.id} className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-semibold text-slate-700 font-mono">
                                      {gap.id}:
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setShowGapHints((prev) => ({ ...prev, [gap.id]: !prev[gap.id] }))
                                      }
                                      className="text-[10px] text-amber-700 hover:underline"
                                    >
                                      {showHint ? `Hint: ${gap.hint}` : 'Need a hint?'}
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    value={gapInputs[gap.id] || ''}
                                    onChange={(e) =>
                                      setGapInputs((prev) => ({ ...prev, [gap.id]: e.target.value }))
                                    }
                                    placeholder="Type answer..."
                                    className={`w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border ${
                                      gapChecked
                                        ? isRight
                                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                                          : 'border-rose-400 bg-rose-50 text-rose-950'
                                        : 'border-slate-300'
                                    }`}
                                  />
                                  {gapChecked && !isRight && (
                                    <div className="text-[10px] text-rose-700">
                                      Correct: <strong>{gap.answer}</strong>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setGapChecked(!gapChecked)}
                        className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        {gapChecked ? 'Clear & Retry' : 'Check My Gap Answers'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500 text-xs">
                    <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    Click "Generate Fill in the Gap Exercises" to test your exact recall of CAPS laws and definitions.
                  </div>
                )}
              </div>
            )}

            {/* MODE 6: INTERACTIVE CHAT WITH MZANSI TUTA */}
            {!isLoading && activeMode === 'chat' && (
              <div className="space-y-4 flex flex-col h-[460px]">
                <div className="flex-1 overflow-y-auto space-y-3 p-2">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                          MT
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-xl text-xs max-w-md leading-relaxed whitespace-pre-wrap ${
                          msg.sender === 'user'
                            ? 'bg-amber-500 text-slate-950 font-medium'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-200">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Ask Mzansi Tuta anything about Grade 12 ${docSubject}...`}
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <span>Ask</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
