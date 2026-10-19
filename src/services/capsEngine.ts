import { MzansiTutaResponse } from '../types';

export function generateClientSideCapsContent(
  mode: string,
  subject: string,
  docText: string,
  prompt?: string
): MzansiTutaResponse {
  const safeSubject = subject || 'Grade 12 NSC Subject';
  const textSample = docText.trim();

  if (mode === 'summary') {
    return {
      type: 'summary',
      title: `CAPS High-Yield Revision: ${safeSubject}`,
      overview: `High-yield Grade 12 National Senior Certificate (NSC) study summary synthesized by Mzansi Tuta. Formatted according to the Department of Basic Education examination guidelines.`,
      keyConcepts: [
        {
          heading: "Core CAPS Definitions & Statements",
          explanation: "Essential laws, definitions, and theorems that examiners award full marks for in Question 1 and Question 2. Exact verbatim terminology is required by DBE marking rubrics.",
          examTip: "Memorize definitions verbatim (e.g., Newton's Second Law, Le Chatelier's Principle, First Principles, Break-Even Analysis)."
        },
        {
          heading: "Formulaic Relationships & Proportionality",
          explanation: "Understand direct and inverse proportionality relationships. Always write down the base formula from the official formula sheet before substituting numerical values.",
          examTip: "Always include standard SI units (N, J, W, mol·dm⁻³, kg, m·s⁻¹) to prevent the standard 1-mark unit penalty."
        },
        {
          heading: "Section B Problem-Solving Strategy",
          explanation: "DBE examiners frequently test exceptions, multi-step calculations, and experimental verification in Section B.",
          examTip: "Draw labeled free-body diagrams (vectors touching the origin dot), verify calculator mode (DEG), and check algebraic signs."
        }
      ],
      capsHighlights: [
        "100% Aligned with DBE Curriculum and Assessment Policy Statement (CAPS)",
        "Cognitive Level Balance: L1 Recall (15%), L2 Routine (35%), L3 Complex (35%), L4 Synthesis & Problem Solving (15%)",
        "Exam Pacing Guide: Allocate exactly 1.2 minutes per mark during the 3-hour matric paper"
      ]
    };
  }

  if (mode === 'questions') {
    return {
      type: 'questions',
      title: `Grade 12 NSC Practice Questions: ${safeSubject}`,
      questions: [
        {
          id: 'q1',
          questionNumber: 'Question 1.1 (Short Question)',
          marks: 4,
          cognitiveLevel: 'Level 2: Routine Procedure',
          questionText: `Based on the provided ${safeSubject} study notes, state the fundamental law or definition in words, and calculate the primary variable under standard examination conditions.`,
          subQuestions: [
            "1.1.1 State the relevant scientific law or definition in words. (2)",
            "1.1.2 Calculate the value using the provided standard examination data. (2)"
          ],
          memo: `1.1.1 Exact definition according to the official CAPS Guideline (2 marks for complete verbatim statement, 0 marks for partial).\n1.1.2 Correct formula: 1 mark; Correct substitution: 1 mark; Final numerical value with correct SI unit: 1 mark.`
        },
        {
          id: 'q2',
          questionNumber: 'Question 2.1 (Long Analytical Question)',
          marks: 8,
          cognitiveLevel: 'Level 3 & 4: Complex Reasoning & Analysis',
          questionText: `Analyse the relationship described in your uploaded document. Explain how modifying the independent variable influences the equilibrium state or result, supporting your argument with mathematical or conceptual justification.`,
          subQuestions: [
            "2.1.1 Identify the independent and dependent variables in this investigation. (2)",
            "2.1.2 Formulate a suitable investigative question. (2)",
            "2.1.3 Provide a detailed step-by-step scientific/mathematical explanation of the observed trend. (4)"
          ],
          memo: `2.1.1 Independent variable: factor manipulated by researcher (1). Dependent variable: outcome measured (1).\n2.1.2 Must state a clear relationship, include both variables, and end with a question mark. (2)\n2.1.3 Comprehensive step-by-step reasoning referencing underlying collision theory, calculus stationary points, or accounting principles. (4 marks)`
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
          question: `In the Grade 12 NSC exam context for ${safeSubject}, which one of the following statements is mathematically or scientifically correct?`,
          options: [
            "A) The rate of reaction increases because activation energy is lowered by increasing temperature.",
            "B) The rate of reaction increases because a greater fraction of colliding particles possess kinetic energy greater than or equal to activation energy.",
            "C) The equilibrium position shifts to the exothermic side when temperature is elevated.",
            "D) Net work done on an isolated object equals the change in its potential energy."
          ],
          correctIndex: 1,
          explanation: "Option B is correct. Increasing temperature increases the average kinetic energy of molecules. According to collision theory, more collisions have E >= Ea per second."
        },
        {
          id: 'mcq2',
          question: `Which procedure is strictly required when determining stationary turning points or rates of change in Grade 12 curriculum?`,
          options: [
            "A) Set the first derivative f'(x) = 0 and solve for the critical roots.",
            "B) Evaluate the y-intercept without verifying domain boundary conditions.",
            "C) Integrate the function between arbitrary limits without constants.",
            "D) Substitute x = 0 directly into the second derivative."
          ],
          correctIndex: 0,
          explanation: "Option A is correct. Stationary points occur where the gradient of the tangent is zero (f'(x) = 0)."
        },
        {
          id: 'mcq3',
          question: `When answering DBE National Senior Certificate final exam questions, what is the penalty for omitting required SI units on final calculated answers?`,
          options: [
            "A) No mark deduction occurs if the numeric value is accurate.",
            "B) Negative marking is deducted from the entire question paper.",
            "C) Exactly 1 mark is penalized on the final calculated answer.",
            "D) The candidate receives zero marks for all sub-questions."
          ],
          correctIndex: 2,
          explanation: "Option C is correct. DBE marking guidelines enforce a 1-mark penalty for missing or incorrect SI units."
        }
      ]
    };
  }

  if (mode === 'flashcards') {
    return {
      type: 'flashcards',
      title: `Matric Revision Flashcards: ${safeSubject}`,
      cards: [
        {
          id: 'fc1',
          front: `Define: Rate of Reaction / Derivative in ${safeSubject}`,
          back: `The change in concentration of reactants or products per unit time (or instantaneous rate of change: lim h->0 [f(x+h)-f(x)]/h).`,
          category: 'CAPS Definition',
          difficulty: 'Medium'
        },
        {
          id: 'fc2',
          front: `Exam Rule: Free Body Diagram Arrow Vectors`,
          back: `All force vectors must originate directly from the central dot and point outward. Clearly label each force arrow (e.g. Fg, FN, Ff, T).`,
          category: 'Exam Technique',
          difficulty: 'Easy'
        },
        {
          id: 'fc3',
          front: `Condition for Mechanical Energy Conservation`,
          back: `In an isolated system (absence of friction or external non-conservative forces), the total mechanical energy remains constant: E_mech(initial) = E_mech(final).`,
          category: 'Core Principle',
          difficulty: 'Medium'
        },
        {
          id: 'fc4',
          front: `Break-Even / Optimization Analysis`,
          back: `The point where total revenue equals total cost (Zero profit, zero loss). Formula: Fixed Costs / (Selling Price per unit - Variable Cost per unit).`,
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
          sentence: "Newton's Second Law states that when a resultant force acts on an object, the object will accelerate in the direction of the force with an acceleration directly proportional to the [GAP1] and inversely proportional to the [GAP2].",
          gaps: [
            { id: 'GAP1', answer: "resultant force", hint: "or net force (F_net)" },
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
          sentence: "During NSC Mathematics Paper 1, the quadratic formula x = (-b ± √(b² - 4ac)) / 2a contains the expression b² - 4ac which is termed the [GAP1], determining the nature of the [GAP2].",
          gaps: [
            { id: 'GAP1', answer: "discriminant", hint: "delta (Δ)" },
            { id: 'GAP2', answer: "roots", hint: "or solutions" }
          ]
        }
      ]
    };
  }

  return {
    type: 'chat',
    response: `Sharp! I am Mzansi Tuta, your personal South African Grade 12 NSC study coach.
    
1. **Core Concept**: Focus on the foundational principles emphasized by the Department of Basic Education (DBE). Examiners consistently award 2 marks for exact verbatim definitions.
2. **Formula Strategy**: Always write down the official CAPS formula sheet version first before substituting values.
3. **Common Pitfall**: Watch out for SI unit conversions (e.g. converting cm³ to dm³, or grams to kilograms).

How else can I help you ace your Grade 12 exams? Feel free to ask me to generate practice MCQs, test your memory with flashcards, or create marking memos!`
  };
}
