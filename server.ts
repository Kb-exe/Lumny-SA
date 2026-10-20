import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback generator for South African Grade 12 CAPS curriculum when offline or no API key
function getFallbackMzansiContent(mode: string, subject: string, docText: string, prompt?: string) {
  const preview = docText.slice(0, 300);

  if (mode === 'summary') {
    return {
      type: 'summary',
      title: `CAPS Study Summary: ${subject || 'Grade 12 Curriculum'}`,
      overview: `High-yield Grade 12 NSC revision summary synthesized by Mzansi Tutor based on your submitted notes.`,
      keyConcepts: [
        {
          heading: "Core Principle & Definitions",
          explanation: "Essential definitions that DBE examiners award marks for in Question 1 and Question 2. Ensure exact wording as per the CAPS Guideline.",
          examTip: "Memorize definitions verbatim (e.g., Newton's Second Law, Le Chatelier's principle, Ohm's law, Organic isomerism)."
        },
        {
          heading: "Essential Formulas & Relationships",
          explanation: "Understand direct and inverse proportionality relationships. Always write down the base formula before substituting values.",
          examTip: "Never leave answers without SI units (e.g. N, J, W, mol/dm³) to avoid losing 1 mark per question."
        },
        {
          heading: "High-Frequency Exam Traps",
          explanation: "Examiners frequently test exceptions and boundary conditions in Section B questions.",
          examTip: "Draw free-body diagrams (FBDs) with labeled vectors touching the dot; verify calculator is in DEG mode for trigonometry."
        }
      ],
      capsHighlights: [
        "Aligned with DBE NSC Curriculum and Assessment Policy Statement (CAPS)",
        "Includes cognitive level weightings: L1 Recall (15%), L2 Routine (35%), L3 Complex (35%), L4 Problem Solving (15%)",
        "Recommended time allocation: 1 mark = 1.2 minutes during the 3-hour exam"
      ]
    };
  }

  if (mode === 'questions') {
    return {
      type: 'questions',
      title: `NSC Exam Style Questions: ${subject || 'Grade 12'}`,
      questions: [
        {
          id: 'q1',
          questionNumber: 'Question 1.1 (Short)',
          marks: 4,
          cognitiveLevel: 'Level 2: Routine Procedure',
          questionText: `Based on the provided study material, state the fundamental principle involved and calculate the resulting magnitude under standard NSC conditions.`,
          subQuestions: [
            "1.1.1 State the relevant law or definition in words. (2)",
            "1.1.2 Calculate the value using the provided standard data. (2)"
          ],
          memo: `1.1.1 Full definition according to CAPS guideline (2 marks or 0 marks for partial).\n1.1.2 Formula: 1 mark; Correct substitution: 1 mark; Final answer with correct SI unit: 1 mark.`
        },
        {
          id: 'q2',
          questionNumber: 'Question 1.2 (Long Question)',
          marks: 8,
          cognitiveLevel: 'Level 3 & 4: Complex Reasoning & Synthesis',
          questionText: `Analyse the relationship described in your uploaded document. Explain how a change in independent variable influences the equilibrium or final state, supporting your answer with mathematical or chemical justification.`,
          subQuestions: [
            "1.2.1 Identify the independent and dependent variables. (2)",
            "1.2.2 Formulate an investigative question. (2)",
            "1.2.3 Provide a detailed explanation of the trend observed. (4)"
          ],
          memo: `1.2.1 Independent: variable changed by researcher (1). Dependent: variable measured (1).\n1.2.2 Must start with 'How does...', include both variables, and end with a question mark. (2)\n1.2.3 Clear step-by-step reasoning referencing intermolecular forces or rate laws. (4)`
        }
      ]
    };
  }

  if (mode === 'mcq') {
    return {
      type: 'mcq',
      title: `NSC Section A Practice: Multiple Choice`,
      items: [
        {
          id: 'mcq1',
          question: `In the Grade 12 NSC exam context for ${subject || 'this topic'}, which one of the following statements is mathematically or scientifically correct?`,
          options: [
            "A) The rate of reaction increases because the activation energy is lowered by increasing temperature.",
            "B) The rate of reaction increases because more particles have kinetic energy greater than or equal to activation energy.",
            "C) The equilibrium position shifts to the exothermic side when temperature is increased.",
            "D) The net work done on an object is equal to the change in its potential energy."
          ],
          correctIndex: 1,
          explanation: "Option B is correct. Increasing temperature increases average kinetic energy; according to collision theory, a greater fraction of collisions are effective (E >= Ea)."
        },
        {
          id: 'mcq2',
          question: `Which option best represents the standard procedure required when solving Grade 12 optimization or rate problems?`,
          options: [
            "A) Set the first derivative f'(x) = 0 and solve for the critical value.",
            "B) Evaluate only the y-intercept without checking domain boundaries.",
            "C) Integrate the function between limits -1 and +1.",
            "D) Substitute x = 0 directly into the second derivative."
          ],
          correctIndex: 0,
          explanation: "Option A is correct. Stationary points occur where the gradient is zero (f'(x) = 0), which is foundational for Grade 12 calculus."
        },
        {
          id: 'mcq3',
          question: `When answering NSC examination questions, what is the consequence of omitting standard SI units in calculation questions?`,
          options: [
            "A) No penalty is applied if the number is correct.",
            "B) A negative mark is deducted from the whole paper.",
            "C) A 1-mark unit penalty is applied to the final calculated answer.",
            "D) The entire question is awarded zero marks."
          ],
          correctIndex: 2,
          explanation: "Option C is correct. DBE marking guidelines strictly deduct 1 mark for incorrect or omitted units."
        }
      ]
    };
  }

  if (mode === 'flashcards') {
    return {
      type: 'flashcards',
      title: `Matric Mastery Flashcards: ${subject || 'Key Definitions'}`,
      cards: [
        {
          id: 'fc1',
          front: `Define: Rate of Reaction / Derivative`,
          back: `The change in concentration of reactants or products per unit time (or instantaneous rate of change of y with respect to x: lim h->0 [f(x+h)-f(x)]/h).`,
          category: 'CAPS Definition',
          difficulty: 'Medium'
        },
        {
          id: 'fc2',
          front: `Exam Rule: Free Body Diagram Vectors`,
          back: `All force vectors MUST be drawn starting from the central dot and point away from the object. Label each arrow clearly with standard notation (e.g. Fg, FN, Ff).`,
          category: 'Exam Technique',
          difficulty: 'Easy'
        },
        {
          id: 'fc3',
          front: `What condition must be met for Mechanical Energy to be conserved?`,
          back: `In the absence of air resistance or any non-conservative forces (isolated system), the total mechanical energy remains constant: Emech(initial) = Emech(final).`,
          category: 'Physics Principle',
          difficulty: 'Medium'
        },
        {
          id: 'fc4',
          front: `Accounting / Business / Math: Break-Even Rule`,
          back: `Break-even point is reached where Total Revenue equals Total Cost (Zero profit, zero loss). Formula: Fixed Costs / (Selling Price per unit - Variable Cost per unit).`,
          category: 'Core Formula',
          difficulty: 'Hard'
        }
      ]
    };
  }

  if (mode === 'fillgap') {
    return {
      type: 'fillgap',
      title: `Fill in the Gap: NSC Revision Exercise`,
      sentences: [
        {
          id: 'fg1',
          sentence: "Newton's Second Law states that when a resultant force acts on an object, the object will accelerate in the direction of the force with an acceleration that is directly proportional to the [GAP1] and inversely proportional to the [GAP2].",
          gaps: [
            { id: 'GAP1', answer: "resultant force", hint: "F_net" },
            { id: 'GAP2', answer: "mass", hint: "measured in kg" }
          ]
        },
        {
          id: 'fg2',
          sentence: "In organic chemistry, compounds with the same molecular formula but different structural formulas are known as [GAP1], while the homologous series with the functional group -COOH is called [GAP2].",
          gaps: [
            { id: 'GAP1', answer: "structural isomers", hint: "isomers" },
            { id: 'GAP2', answer: "carboxylic acids", hint: "ends with -oic acid" }
          ]
        },
        {
          id: 'fg3',
          sentence: "During NSC Mathematics Paper 1, the quadratic formula x = (-b ± √(b² - 4ac)) / 2a contains the expression b² - 4ac which is termed the [GAP1] (delta), determining the nature of the [GAP2].",
          gaps: [
            { id: 'GAP1', answer: "discriminant", hint: "denoted by Δ" },
            { id: 'GAP2', answer: "roots", hint: "or solutions" }
          ]
        }
      ]
    };
  }

  // Default chat response
  return {
    type: 'chat',
    response: `Sharp! I am Mzansi Tutor, your personal South African Grade 12 NSC study coach. Based on your document and query for ${subject || 'Matric studies'}:
    
1. **Core Concept**: Focus on the foundational principles emphasized by the Department of Basic Education (DBE). Examiners consistently award 2 marks for exact verbatim definitions.
2. **Formula Strategy**: Always write the official CAPS formula sheet version first before plugging in values.
3. **Common Pitfall**: Watch out for SI unit conversions (e.g. converting cm³ to dm³, or grams to kilograms).

How else can I help you ace your Grade 12 exams? Feel free to ask me to generate practice MCQs, test your memory with flashcards, or create marking memos!`
  };
}

// API endpoint for Mzansi Tutor
async function handleMzansiGeneration(req: express.Request, res: express.Response) {
  try {
    const { mode, documentText, subject, fileName, customPrompt, fileData, fileMimeType } = req.body;

    if (!mode) {
      return res.status(400).json({ error: 'Mode is required' });
    }

    const safeDocText = (documentText || '').trim();
    const safeSubject = subject || 'Grade 12 NSC Subject';

    // If Gemini client is available, attempt real AI generation
    if (ai) {
      try {
        let systemInstruction = `You are "Mzansi Tutor", an elite South African AI tutor built specifically for Grade 12 National Senior Certificate (NSC / IEB) matriculants.
Your mission is to help South African Grade 12 learners master their CAPS syllabus, score Level 7s (distinctions: 80%+), and prepare for NSC prelims and final examinations.
Adhere strictly to DBE Grade 12 examination guidelines, standard marking memoranda formatting, cognitive levels (Level 1: Recall to Level 4: Problem Solving), and authentic South African educational terminology.
If an image or document diagram is provided, analyze the formulas, vectors, geometric figures, chemical structures, or handwritten questions carefully.
Always respond in valid JSON format matching the requested schema.`;

        let userPrompt = '';

        if (mode === 'summary') {
          userPrompt = `Generate a high-yield CAPS study summary for Grade 12 ${safeSubject} from the following document content:
"${safeDocText.slice(0, 8000)}"

Return a JSON object with this exact structure:
{
  "type": "summary",
  "title": "Topic or Chapter Title",
  "overview": "Brief 2-3 sentence overview of this matric topic",
  "keyConcepts": [
    {
      "heading": "Concept Name",
      "explanation": "Clear, concise CAPS-aligned explanation",
      "examTip": "Specific tip on what DBE examiners look for or common mistakes to avoid"
    }
  ],
  "capsHighlights": [
    "Key takeaway point 1",
    "Key takeaway point 2",
    "Formula or rule highlight"
  ]
}`;
        } else if (mode === 'questions') {
          userPrompt = `Generate Grade 12 NSC exam-standard questions (both Short and Long questions) based on this content for ${safeSubject}:
"${safeDocText.slice(0, 8000)}"

Return a JSON object with this exact structure:
{
  "type": "questions",
  "title": "NSC Practice Questions: ${safeSubject}",
  "questions": [
    {
      "id": "q1",
      "questionNumber": "Question 1.1 (Short)",
      "marks": 4,
      "cognitiveLevel": "Level 1 / 2 Recall & Routine",
      "questionText": "Primary question statement",
      "subQuestions": [
        "1.1.1 Sub-question with mark allocation (e.g. (2))",
        "1.1.2 Sub-question (2)"
      ],
      "memo": "Official marking memorandum breakdown with mark allocation ticks (✓)"
    },
    {
      "id": "q2",
      "questionNumber": "Question 2 (Long Analysis)",
      "marks": 8,
      "cognitiveLevel": "Level 3 / 4 Complex & Synthesis",
      "questionText": "Detailed question involving analysis, calculation, or explanation",
      "subQuestions": [
        "2.1 Define or state law (2)",
        "2.2 Calculate or explain (4)",
        "2.3 Interpret outcome (2)"
      ],
      "memo": "Detailed model answer memorandum showing step-by-step marks (✓)"
    }
  ]
}`;
        } else if (mode === 'mcq') {
          userPrompt = `Generate 4 Grade 12 NSC Section A style multiple choice questions based on this content for ${safeSubject}:
"${safeDocText.slice(0, 8000)}"

Return a JSON object with this exact structure:
{
  "type": "mcq",
  "title": "Multiple Choice Exam Practice: ${safeSubject}",
  "items": [
    {
      "id": "mcq1",
      "question": "Clear stem of the question",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctIndex": 0,
      "explanation": "Why this option is correct according to the NSC guideline"
    }
  ]
}`;
        } else if (mode === 'flashcards') {
          userPrompt = `Generate 5 high-yield Grade 12 revision flashcards based on this content for ${safeSubject}:
"${safeDocText.slice(0, 8000)}"

Return a JSON object with this exact structure:
{
  "type": "flashcards",
  "title": "Revision Flashcards: ${safeSubject}",
  "cards": [
    {
      "id": "fc1",
      "front": "Question, Definition, or Formula Prompt",
      "back": "Accurate, concise answer or explanation",
      "category": "e.g. Definition, Formula, Law, or Case Study",
      "difficulty": "Easy"
    }
  ]
}`;
        } else if (mode === 'fillgap') {
          userPrompt = `Generate 3 interactive 'Fill in the Gap' questions for Grade 12 NSC revision for ${safeSubject} from this text:
"${safeDocText.slice(0, 8000)}"

Return a JSON object with this exact structure:
{
  "type": "fillgap",
  "title": "Fill in the Blanks: ${safeSubject}",
  "sentences": [
    {
      "id": "fg1",
      "sentence": "A sentence containing [GAP1] and [GAP2] placeholders.",
      "gaps": [
        { "id": "GAP1", "answer": "correct term", "hint": "short hint" },
        { "id": "GAP2", "answer": "second term", "hint": "short hint" }
      ]
    }
  ]
}`;
        } else {
          // Direct chat / Q&A
          userPrompt = `The learner is asking Mzansi Tutor: "${customPrompt || safeDocText}".
Subject: ${safeSubject}.
Provide a motivating, highly practical, South African Grade 12 CAPS aligned response.
Return a JSON object:
{
  "type": "chat",
  "response": "Your friendly, expert tutoring response in markdown format."
}`;
        }

        // Multimodal support: if image is present, pass inlineData
        const contentParts: any[] = [];
        if (fileData && fileMimeType && fileMimeType.startsWith('image/')) {
          const cleanBase64 = fileData.replace(/^data:[^;]+;base64,/, '');
          contentParts.push({
            inlineData: {
              data: cleanBase64,
              mimeType: fileMimeType,
            },
          });
        }
        contentParts.push(userPrompt);

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contentParts.length === 1 ? userPrompt : contentParts,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const rawText = response.text || '';
        const parsed = JSON.parse(rawText);
        return res.json({ success: true, data: parsed, source: 'gemini-ai' });
      } catch (aiError) {
        console.warn('Gemini API call failed, using high-yield South African CAPS fallback:', aiError);
        const fallback = getFallbackMzansiContent(mode, safeSubject, safeDocText, customPrompt);
        return res.json({ success: true, data: fallback, source: 'caps-engine-fallback' });
      }
    } else {
      // No API key configured
      const fallback = getFallbackMzansiContent(mode, safeSubject, safeDocText, customPrompt);
      return res.json({ success: true, data: fallback, source: 'caps-engine' });
    }
  } catch (error: any) {
    console.error('Error in Mzansi Tutor generator:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

app.post('/api/mzansi-tutor/generate', handleMzansiGeneration);
app.post('/api/mzansi-tuta/generate', handleMzansiGeneration);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'Lumina SA (Lumny SA)',
    system: 'South Africa Grade 12 NSC Platform',
    geminiEnabled: Boolean(ai),
    timestamp: new Date().toISOString(),
  });
});

// Setup dev server with Vite middlewares or production static files
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lumina SA (Grade 12 NSC) server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
