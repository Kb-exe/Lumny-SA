import React, { useState, useEffect, useRef } from 'react';
import { User, MzansiMode, MzansiTutorResponse, SummaryResult, QuestionsResult, McqResult, FlashcardsResult, FillGapResult, ChatResult } from '../../types';
import { ALL_GRADE12_SUBJECTS } from '../../data/grade12Subjects';
import { SAMPLE_STUDY_DOCUMENTS, SampleDoc } from '../../data/mockLearners';
import { generateClientSideCapsContent } from '../../services/capsEngine';
import { parseUploadedDocument, ParsedDocumentResult } from '../../services/documentParser';
import mzansiAvatar from '../../assets/images/mzansi_tuta_avatar_1792414055226.jpg';
import { Sparkles, Upload, FileText, CheckCircle, RefreshCw, Layers, HelpCircle, Check, Eye, Send, ArrowRight, BookOpen, AlertCircle, Bookmark, Image as ImageIcon, Presentation, FileCode, X, Maximize2 } from 'lucide-react';

interface MzansiTutorSectionProps {
  currentUser: User | null;
  initialDocumentText?: string;
  initialSubject?: string;
  initialDocTitle?: string;
}

export const MzansiTutorSection: React.FC<MzansiTutorSectionProps> = ({
  currentUser,
  initialDocumentText = '',
  initialSubject = 'Mathematics',
  initialDocTitle = '',
}) => {
  const [docSubject, setDocSubject] = useState(initialSubject);
  const [docTitle, setDocTitle] = useState(initialDocTitle || 'CAPS Exam Revision Document');
  const [docContent, setDocContent] = useState(
    initialDocumentText || SAMPLE_STUDY_DOCUMENTS[0].fullContent
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parsedDocInfo, setParsedDocInfo] = useState<ParsedDocumentResult | null>(null);
  const [isParsingDocument, setIsParsingDocument] = useState(false);
  const [showExtractedPreview, setShowExtractedPreview] = useState(false);
  const [activeMode, setActiveMode] = useState<MzansiMode>('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sourceBadge, setSourceBadge] = useState<string | null>(null);

  // Results state
  const [generatedOutput, setGeneratedOutput] = useState<MzansiTutorResponse | null>(null);

  // Interactive MCQ State
  const [userMcqAnswers, setUserMcqAnswers] = useState<Record<string, string>>({});
  const [showMcqResults, setShowMcqResults] = useState(false);

  // Interactive Flashcards State
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  // Interactive Fill In The Gap State
  const [gapInputs, setGapInputs] = useState<Record<string, Record<string, string>>>({});
  const [gapChecked, setGapChecked] = useState(false);

  // Exam Questions Revealer State
  const [revealedMemos, setRevealedMemos] = useState<Record<string, boolean>>({});

  // Interactive Chat State
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: 'Aweh! I am Mzansi Tutor, your South African Grade 12 AI study partner. Upload PDF, Word, PowerPoint notes, past papers, or photos of questions and ask me to generate summaries, exam questions with marking memos, MCQs, or flashcards aligned with CAPS!'
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
    setParsedDocInfo(null);
    setGeneratedOutput(null);
    setErrorMessage(null);
  };

  // Handle universal file upload (PDF, Word, PPT, Image, Text)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingDocument(true);
    setErrorMessage(null);

    try {
      const parsed = await parseUploadedDocument(file, docSubject);
      setParsedDocInfo(parsed);
      setUploadedFileName(parsed.fileName);
      setDocTitle(parsed.fileName);
      setDocContent(parsed.extractedText);
      setGeneratedOutput(null);
    } catch (err: any) {
      console.error('Document parsing error:', err);
      setErrorMessage(`Could not parse document: ${err.message || 'Unknown format'}. Please try another file.`);
    } finally {
      setIsParsingDocument(false);
      // Reset input value so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Call Server API to generate content with fallback
  const handleGenerate = async (modeToRun: MzansiMode = activeMode, customQuery?: string) => {
    if (!docContent.trim() && !customQuery) {
      setErrorMessage('Please provide document content, upload a file, or select a study guide above.');
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
        // Try modern endpoint first
        let response = await fetch('/api/mzansi-tutor/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: modeToRun,
            documentText: docContent,
            subject: docSubject,
            fileName: docTitle,
            customPrompt: customQuery,
            fileData: parsedDocInfo?.imageDataUrl,
            fileMimeType: parsedDocInfo?.imageMimeType,
          }),
        });

        // Fallback to legacy endpoint if 404
        if (response.status === 404) {
          response = await fetch('/api/mzansi-tuta/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mode: modeToRun,
              documentText: docContent,
              subject: docSubject,
              fileName: docTitle,
              customPrompt: customQuery,
              fileData: parsedDocInfo?.imageDataUrl,
              fileMimeType: parsedDocInfo?.imageMimeType,
            }),
          });
        }

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
      <div className="relative rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 p-6 sm:p-8 text-slate-950 overflow-hidden shadow-md border border-amber-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-950 border-2 border-slate-950/20 shadow-md shrink-0">
            <img
              src={mzansiAvatar}
              alt="Mzansi Tutor Avatar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
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
              Mzansi Tutor
            </h1>
            <p className="text-xs sm:text-sm text-slate-900/90 max-w-2xl font-medium mt-0.5">
              Upload any Grade 12 PDF, Word document, PowerPoint presentation, or photo of questions to generate high-yield CAPS summaries, exam questions with marking memos, interactive MCQs, and flashcards.
            </p>
          </div>
        </div>

        {/* Status pill */}
        <div className="shrink-0 bg-slate-950 text-white rounded-xl px-4 py-2 text-xs flex items-center gap-2 font-mono shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>CAPS AI Multimodal Engine Active</span>
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
              <span className="text-[11px] text-slate-500 font-mono">
                PDF · Word · PPT · Images
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
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-medium text-slate-800 bg-white"
              >
                {ALL_GRADE12_SUBJECTS.map((sub) => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>

            {/* Universal Document Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-5 text-center cursor-pointer transition-all bg-slate-50 hover:bg-amber-50/40 group relative"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.pptx,.ppt,.txt,.md,.png,.jpg,.jpeg,.webp"
                onChange={handleFileUpload}
                className="hidden"
              />

              {isParsingDocument ? (
                <div className="py-2 space-y-2">
                  <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
                  <div className="text-xs font-bold text-slate-800">
                    Extracting Document Content...
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Parsing pages, slides, formulas, and diagrams for Mzansi Tutor AI
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-amber-600 mx-auto mb-2 transition-colors" />
                  <div className="text-xs font-bold text-slate-800">
                    {uploadedFileName ? uploadedFileName : 'Upload Document for Mzansi Tutor'}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Accepts <strong>PDF</strong>, <strong>Word (.docx)</strong>, <strong>PowerPoint (.pptx)</strong>, or <strong>Images (PNG/JPG)</strong>
                  </p>
                  
                  {/* File type badges */}
                  <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] font-mono">
                    <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">PDF</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Word (.docx)</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-bold">PowerPoint (.pptx)</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">Images (JPG/PNG)</span>
                  </div>
                </>
              )}
            </div>

            {/* Parsed Document Card if Uploaded */}
            {parsedDocInfo && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    {parsedDocInfo.fileType === 'pdf' && (
                      <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                        PDF
                      </div>
                    )}
                    {(parsedDocInfo.fileType === 'docx' || parsedDocInfo.fileType === 'doc') && (
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        DOC
                      </div>
                    )}
                    {(parsedDocInfo.fileType === 'pptx' || parsedDocInfo.fileType === 'ppt') && (
                      <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0">
                        PPT
                      </div>
                    )}
                    {parsedDocInfo.fileType === 'image' && (
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {parsedDocInfo.fileName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {parsedDocInfo.summaryNote}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setParsedDocInfo(null);
                      setUploadedFileName(null);
                      setDocContent(SAMPLE_STUDY_DOCUMENTS[0].fullContent);
                      setDocTitle(SAMPLE_STUDY_DOCUMENTS[0].title);
                    }}
                    className="text-slate-400 hover:text-slate-600 p-1"
                    title="Clear file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Image Thumbnail Preview if image */}
                {parsedDocInfo.imageDataUrl && (
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 max-h-48 flex items-center justify-center">
                    <img
                      src={parsedDocInfo.imageDataUrl}
                      alt="Uploaded Diagram / Exam question"
                      className="max-h-48 w-auto object-contain"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-950/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-mono">
                      Image Document for Visual AI
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Parsed &amp; Ready for Generation
                  </span>
                  <button
                    onClick={() => setShowExtractedPreview(!showExtractedPreview)}
                    className="text-amber-700 hover:text-amber-800 font-medium underline flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{showExtractedPreview ? 'Hide Text' : 'Inspect Text'}</span>
                  </button>
                </div>
              </div>
            )}

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
                      docTitle === sample.title && !uploadedFileName
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

            {/* Extracted Document Text Preview / Edit */}
            {(!uploadedFileName || showExtractedPreview) && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Document Text for AI Processing:
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {docContent.length} chars
                  </span>
                </div>
                <textarea
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  rows={5}
                  placeholder="Extracted textbook excerpts, formulas, or syllabus notes..."
                  className="w-full p-2.5 text-xs font-mono border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 bg-slate-50 text-slate-800 leading-relaxed"
                />
              </div>
            )}

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
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          {activeMode !== 'chat' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleGenerate(activeMode)}
                disabled={isLoading || isParsingDocument}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Mzansi Tutor is Analyzing &amp; Synthesizing...</span>
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
                    Mzansi Tutor is Generating Your {docSubject} Study Materials
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
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {(generatedOutput as SummaryResult).overview}
                      </p>
                    </div>

                    {/* Key Concepts Grid */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Core Examination Concepts &amp; Definitions
                      </h3>
                      {(generatedOutput as SummaryResult).keyConcepts.map((kc, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            {kc.heading}
                          </h4>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {kc.explanation}
                          </p>
                          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 flex items-start gap-1.5 font-medium">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span><strong>DBE Exam Tip:</strong> {kc.examTip}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CAPS Highlights List */}
                    <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
                      <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        <span>Curriculum Checklist (CAPS DBE)</span>
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                        {(generatedOutput as SummaryResult).capsHighlights.map((hl, i) => (
                          <li key={i}>{hl}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-500 text-xs">
                    Click <strong>Generate CAPS High-Yield Summary</strong> to synthesize your uploaded study document.
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: QUESTIONS & MARKING MEMO */}
            {!isLoading && activeMode === 'questions' && (
              <div>
                {generatedOutput?.type === 'questions' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                          NSC Exam Simulation
                        </span>
                        <h2 className="text-base font-bold text-slate-900 mt-1">
                          {(generatedOutput as QuestionsResult).title}
                        </h2>
                      </div>
                      <span className="text-xs font-mono text-slate-500">
                        Official DBE Rubric
                      </span>
                    </div>

                    <div className="space-y-6">
                      {(generatedOutput as QuestionsResult).questions.map((q) => {
                        const isRevealed = revealedMemos[q.id];
                        return (
                          <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900">
                                {q.questionNumber}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                                  {q.cognitiveLevel}
                                </span>
                                <span className="text-xs font-bold text-amber-600 font-mono">
                                  [{q.marks} Marks]
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-800 leading-relaxed font-medium">
                              {q.questionText}
                            </p>

                            {q.subQuestions && q.subQuestions.length > 0 && (
                              <div className="pl-3 border-l-2 border-amber-300 space-y-1.5 text-xs text-slate-700">
                                {q.subQuestions.map((sq, i) => (
                                  <div key={i}>{sq}</div>
                                ))}
                              </div>
                            )}

                            {/* Memorandum toggle */}
                            <div className="pt-2">
                              <button
                                onClick={() => setRevealedMemos((prev) => ({ ...prev, [q.id]: !isRevealed }))}
                                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>{isRevealed ? 'Hide Marking Memorandum' : 'Reveal DBE Marking Memo'}</span>
                              </button>

                              {isRevealed && (
                                <div className="mt-3 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-mono whitespace-pre-wrap leading-relaxed">
                                  <div className="font-bold text-[11px] uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Department of Basic Education Marking Memo</span>
                                  </div>
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
                  <div className="py-16 text-center text-slate-500 text-xs">
                    Click <strong>Generate Long &amp; Short Questions</strong> to formulate exam-standard problems from your document.
                  </div>
                )}
              </div>
            )}

            {/* MODE 3: MULTIPLE CHOICE QUESTIONS (MCQs) */}
            {!isLoading && activeMode === 'mcq' && (
              <div>
                {generatedOutput?.type === 'mcq' ? (
                  <div className="space-y-6">
                    {(() => {
                      const mcqData = generatedOutput as McqResult;
                      const rawQuestions = mcqData.questions || [];
                      const rawItems = mcqData.items || [];
                      const mcqItems = rawQuestions.length > 0
                        ? rawQuestions
                        : rawItems.map((item, idx) => ({
                            id: item.id || `mcq-${idx}`,
                            questionText: item.question,
                            options: item.options.map((optText, oIdx) => ({
                              id: ['A', 'B', 'C', 'D'][oIdx] || `${oIdx}`,
                              text: optText.replace(/^[A-D]\)\s*/, ''),
                            })),
                            correctOptionId: ['A', 'B', 'C', 'D'][item.correctIndex] || 'A',
                            explanation: item.explanation,
                            examTrap: undefined,
                          }));

                      return (
                        <>
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                                Section A Practice
                              </span>
                              <h2 className="text-base font-bold text-slate-900 mt-1">
                                {mcqData.title}
                              </h2>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">
                              {mcqItems.length} Questions
                            </span>
                          </div>

                          <div className="space-y-5">
                            {mcqItems.map((mcq, qIdx) => {
                              const selectedOption = userMcqAnswers[mcq.id];

                              return (
                                <div key={mcq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                                  <div className="text-xs font-bold text-slate-900">
                                    Question {qIdx + 1}: {mcq.questionText}
                                  </div>

                                  <div className="space-y-1.5">
                                    {mcq.options.map((opt) => {
                                      const isSelected = selectedOption === opt.id;
                                      let btnClasses = "w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ";

                                      if (!showMcqResults) {
                                        btnClasses += isSelected
                                          ? "bg-amber-100 border-amber-400 text-amber-950 font-semibold"
                                          : "bg-white border-slate-200 hover:border-slate-300 text-slate-700";
                                      } else {
                                        if (opt.id === mcq.correctOptionId) {
                                          btnClasses += "bg-emerald-100 border-emerald-400 text-emerald-950 font-bold";
                                        } else if (isSelected) {
                                          btnClasses += "bg-rose-100 border-rose-400 text-rose-950 line-through";
                                        } else {
                                          btnClasses += "bg-white border-slate-200 text-slate-400 opacity-60";
                                        }
                                      }

                                      return (
                                        <button
                                          key={opt.id}
                                          onClick={() => {
                                            if (!showMcqResults) {
                                              setUserMcqAnswers((prev) => ({ ...prev, [mcq.id]: opt.id }));
                                            }
                                          }}
                                          className={btnClasses}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 font-mono font-bold text-[10px] flex items-center justify-center">
                                              {opt.id}
                                            </span>
                                            <span>{opt.text}</span>
                                          </div>
                                          {showMcqResults && opt.id === mcq.correctOptionId && (
                                            <Check className="w-4 h-4 text-emerald-600" />
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Rationale and Trap Explanation */}
                                  {showMcqResults && (
                                    <div className="pt-2 text-xs space-y-1.5 border-t border-slate-200">
                                      <div className="text-emerald-900 font-medium">
                                        <strong>Memo Reason:</strong> {mcq.explanation}
                                      </div>
                                      {mcq.examTrap && (
                                        <div className="text-amber-800 text-[11px]">
                                          <strong>Examiner Trap:</strong> {mcq.examTrap}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="pt-2 flex items-center justify-between">
                            <button
                              onClick={() => setShowMcqResults(!showMcqResults)}
                              className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                            >
                              {showMcqResults ? 'Hide Results & Retry' : 'Check Answers & Show Memos'}
                            </button>

                            {showMcqResults && (
                              <div className="text-xs font-mono font-bold text-slate-800">
                                Score: {Object.entries(userMcqAnswers).filter(([id, ans]) => {
                                  const q = mcqItems.find(x => x.id === id);
                                  return q && q.correctOptionId === ans;
                                }).length} / {mcqItems.length} Correct
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-500 text-xs">
                    Click <strong>Generate Multiple Choice Exam Questions</strong> to create interactive practice items.
                  </div>
                )}
              </div>
            )}

            {/* MODE 4: INTERACTIVE FLASHCARDS */}
            {!isLoading && activeMode === 'flashcards' && (
              <div>
                {generatedOutput?.type === 'flashcards' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                          Active Recall
                        </span>
                        <h2 className="text-base font-bold text-slate-900 mt-1">
                          {(generatedOutput as FlashcardsResult).title}
                        </h2>
                      </div>
                      <span className="text-xs text-slate-500">
                        Click any card to flip
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(generatedOutput as FlashcardsResult).cards.map((card) => {
                        const isFlipped = flippedCards[card.id];

                        return (
                          <div
                            key={card.id}
                            onClick={() => setFlippedCards((prev) => ({ ...prev, [card.id]: !isFlipped }))}
                            className={`p-5 rounded-xl border transition-all cursor-pointer min-h-[160px] flex flex-col justify-between select-none ${
                              isFlipped
                                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md rotate-y-180'
                                : 'bg-slate-900 text-white border-slate-800 hover:border-slate-700 shadow-xs'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] uppercase font-mono">
                              <span className={isFlipped ? 'text-slate-900 font-bold' : 'text-amber-400 font-semibold'}>
                                {card.category}
                              </span>
                              <span className={isFlipped ? 'text-slate-800' : 'text-slate-500'}>
                                {isFlipped ? 'Answer (Memo)' : 'Prompt / Definition'}
                              </span>
                            </div>

                            <div className="my-auto py-2 text-xs font-semibold leading-relaxed">
                              {isFlipped ? card.back : card.front}
                            </div>

                            <div className="text-[10px] text-right font-mono opacity-60">
                              Click to flip ↷
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-500 text-xs">
                    Click <strong>Generate Revision Flashcard Deck</strong> to practice active recall on key Grade 12 concepts.
                  </div>
                )}
              </div>
            )}

            {/* MODE 5: FILL IN THE GAP */}
            {!isLoading && activeMode === 'fillgap' && (
              <div>
                {generatedOutput?.type === 'fillgap' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                          Cloze Test
                        </span>
                        <h2 className="text-base font-bold text-slate-900 mt-1">
                          {(generatedOutput as FillGapResult).title}
                        </h2>
                      </div>
                      <span className="text-xs text-slate-500">
                        Type the missing terms
                      </span>
                    </div>

                    <div className="space-y-4">
                      {(generatedOutput as FillGapResult).sentences.map((item, idx) => (
                        <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs leading-loose">
                          <div className="font-bold text-slate-900">
                            Problem {idx + 1}:
                          </div>

                          <div className="text-slate-800">
                            {item.sentence}
                          </div>

                          {/* Gap inputs */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                            {item.gaps.map((g) => {
                              const val = gapInputs[item.id]?.[g.id] || '';
                              const isMatch = val.trim().toLowerCase() === g.answer.toLowerCase();

                              return (
                                <div key={g.id} className="space-y-1">
                                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                                    <span>Fill <strong>[{g.id}]</strong>:</span>
                                    <span className="text-slate-400 italic">Hint: {g.hint}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={val}
                                      onChange={(e) => {
                                        const newVal = e.target.value;
                                        setGapInputs((prev) => ({
                                          ...prev,
                                          [item.id]: {
                                            ...(prev[item.id] || {}),
                                            [g.id]: newVal
                                          }
                                        }));
                                      }}
                                      placeholder="Type answer here..."
                                      className={`w-full px-2.5 py-1.5 text-xs rounded border font-mono ${
                                        gapChecked
                                          ? isMatch
                                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                                            : 'bg-rose-50 border-rose-500 text-rose-900'
                                          : 'bg-white border-slate-300'
                                      }`}
                                    />
                                    {gapChecked && (
                                      isMatch ? (
                                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                      ) : (
                                        <span className="text-[10px] text-emerald-700 font-mono font-bold shrink-0">
                                          ({g.answer})
                                        </span>
                                      )
                                    )}
                                  </div>
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
                        className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                      >
                        {gapChecked ? 'Clear Corrections' : 'Check Answers & Reveal Hints'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-500 text-xs">
                    Click <strong>Generate Fill in the Gap Exercises</strong> to test precision recall.
                  </div>
                )}
              </div>
            )}

            {/* MODE 6: INTERACTIVE CHAT WITH MZANSI TUTOR */}
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
                    placeholder={`Ask Mzansi Tutor anything about Grade 12 ${docSubject}...`}
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

// Backward-compatible alias
export const MzansiTutaSection = MzansiTutorSection;
