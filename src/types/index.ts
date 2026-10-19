export interface User {
  id: string;
  initials: string;
  username: string;
  email: string;
  phone?: string;
  school: string;
  province?: string;
  subjects: string[];
  role: 'learner' | 'admin';
  isBanned?: boolean;
  bannedReason?: string;
  isVerified: boolean;
  createdAt: string;
  studyStreakDays?: number;
  hoursStudied?: number;
  papersCompleted?: number;
  subscription?: SubscriptionInfo;
}

export type SubscriptionPlan = 'free_trial' | 'monthly' | 'yearly' | 'none';

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  status: 'active' | 'trialing' | 'cancelled' | 'expired';
  trialEndsAt?: string;
  currentPeriodEnd?: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  currency: string;
  autoRenew: boolean;
  paymentMethod?: string;
}

export interface Grade12Subject {
  id: string;
  name: string;
  category: 'Sciences & Math' | 'Commercial & Business' | 'Humanities & Social' | 'Languages' | 'Services & Tech';
  shortCode: string;
  paperCount: number;
  examCode: string;
  color: string;
  description: string;
}

export interface PastPaper {
  id: string;
  subjectId: string;
  subjectName: string;
  year: number;
  session: 'Nov/Dec NSC Finals' | 'May/June Senior Certificate' | 'Sept Trial / Prelims' | 'Exemplar';
  paperNumber: 'P1' | 'P2' | 'P3' | 'Addendum';
  title: string;
  language: 'English' | 'Afrikaans';
  marks: number;
  durationHours: number;
  topicsCovered: string[];
  paperPreviewText: string;
  memoPreviewText: string;
  downloadUrl?: string;
}

export type MzansiMode = 'summary' | 'questions' | 'mcq' | 'flashcards' | 'fillgap' | 'chat';

export interface KeyConcept {
  heading: string;
  explanation: string;
  examTip: string;
}

export interface SummaryResult {
  type: 'summary';
  title: string;
  overview: string;
  keyConcepts: KeyConcept[];
  capsHighlights: string[];
}

export interface ExamQuestionItem {
  id: string;
  questionNumber: string;
  marks: number;
  cognitiveLevel: string;
  questionText: string;
  subQuestions: string[];
  memo: string;
}

export interface QuestionsResult {
  type: 'questions';
  title: string;
  questions: ExamQuestionItem[];
}

export interface McqOptionItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface McqResult {
  type: 'mcq';
  title: string;
  items: McqOptionItem[];
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface FlashcardsResult {
  type: 'flashcards';
  title: string;
  cards: FlashcardItem[];
}

export interface GapItem {
  id: string;
  sentence: string;
  gaps: {
    id: string;
    answer: string;
    hint: string;
  }[];
}

export interface FillGapResult {
  type: 'fillgap';
  title: string;
  sentences: GapItem[];
}

export interface ChatResult {
  type: 'chat';
  response: string;
}

export type MzansiTutaResponse = SummaryResult | QuestionsResult | McqResult | FlashcardsResult | FillGapResult | ChatResult;
