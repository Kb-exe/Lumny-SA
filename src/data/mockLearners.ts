import { User } from '../types';

export const INITIAL_LEARNERS: User[] = [
  {
    id: 'user-karabo',
    initials: 'K.L.',
    username: 'karabo_matric',
    email: 'karabolekalakala44@gmail.com',
    phone: '+27 82 459 1029',
    school: 'Pretoria Boys High School (Gauteng)',
    province: 'Gauteng',
    subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences', 'English Home Language', 'Afrikaans Eerste Addisionele Taal', 'Life Orientation', 'Information Technology (IT)'],
    role: 'learner',
    isVerified: true,
    createdAt: '2026-02-10T08:30:00.000Z',
    studyStreakDays: 14,
    hoursStudied: 42.5,
    papersCompleted: 18,
    subscription: {
      plan: 'free_trial',
      status: 'trialing',
      trialEndsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      currentPeriodEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      price: 6.99,
      billingCycle: 'monthly',
      currency: '$',
      autoRenew: true,
      paymentMethod: 'Capitec / Visa Card (ending 4012)'
    }
  },
  {
    id: 'user-thabo',
    initials: 'T.M.',
    username: 'thabo_m',
    email: 'thabo.mokoena@gmail.com',
    phone: '+27 71 832 9401',
    school: 'Crawford International Sandton (Gauteng)',
    province: 'Gauteng',
    subjects: ['Mathematics', 'Accounting', 'Business Studies', 'Economics', 'English Home Language', 'isiZulu (HL / FAL)', 'Life Orientation'],
    role: 'learner',
    isVerified: true,
    createdAt: '2026-02-14T09:15:00.000Z',
    studyStreakDays: 9,
    hoursStudied: 31.0,
    papersCompleted: 12,
    subscription: {
      plan: 'monthly',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
      price: 6.99,
      billingCycle: 'monthly',
      currency: '$',
      autoRenew: true,
      paymentMethod: 'Mastercard (ending 9821)'
    }
  },
  {
    id: 'user-nandi',
    initials: 'N.K.',
    username: 'nandi_khumalo',
    email: 'nandi.khumalo@gmail.com',
    phone: '+27 83 291 0482',
    school: 'Durban High School (KwaZulu-Natal)',
    province: 'KwaZulu-Natal',
    subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences', 'Geography', 'English Home Language', 'isiZulu (HL / FAL)', 'Life Orientation'],
    role: 'learner',
    isVerified: true,
    createdAt: '2026-02-18T14:20:00.000Z',
    studyStreakDays: 21,
    hoursStudied: 58.0,
    papersCompleted: 24,
    subscription: {
      plan: 'yearly',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 310 * 24 * 60 * 60 * 1000).toISOString(),
      price: 49.99,
      billingCycle: 'yearly',
      currency: '$',
      autoRenew: true,
      paymentMethod: 'FNB / Visa (ending 3310)'
    }
  },
  {
    id: 'user-liam',
    initials: 'L.V.',
    username: 'liam_vandermerwe',
    email: 'liam.vdm@gmail.com',
    phone: '+27 84 512 8794',
    school: 'Rondebosch Boys\' High School (Western Cape)',
    province: 'Western Cape',
    subjects: ['Mathematics', 'Physical Sciences', 'Information Technology (IT)', 'Engineering Graphics & Design (EGD)', 'English Home Language', 'Afrikaans Huistaal', 'Life Orientation'],
    role: 'learner',
    isVerified: true,
    createdAt: '2026-02-22T11:45:00.000Z',
    studyStreakDays: 5,
    hoursStudied: 19.5,
    papersCompleted: 8,
    subscription: {
      plan: 'monthly',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      price: 6.99,
      billingCycle: 'monthly',
      currency: '$',
      autoRenew: true,
      paymentMethod: 'Standard Bank EFT'
    }
  },
  {
    id: 'user-anika',
    initials: 'A.N.',
    username: 'anika_naidoo',
    email: 'anika.naidoo@gmail.com',
    phone: '+27 79 384 1928',
    school: 'Westville Boys\' High School (KwaZulu-Natal)',
    province: 'KwaZulu-Natal',
    subjects: ['Mathematical Literacy', 'Business Studies', 'Accounting', 'Tourism', 'English Home Language', 'Afrikaans Eerste Addisionele Taal', 'Life Orientation'],
    role: 'learner',
    isVerified: true,
    createdAt: '2026-03-01T16:10:00.000Z',
    studyStreakDays: 12,
    hoursStudied: 34.0,
    papersCompleted: 14
  },
  {
    id: 'user-sipho',
    initials: 'S.D.',
    username: 'sipho_d',
    email: 'sipho.dlamini@gmail.com',
    phone: '+27 82 109 4821',
    school: 'Inanda Seminary (KwaZulu-Natal)',
    province: 'KwaZulu-Natal',
    subjects: ['Mathematics', 'Life Sciences', 'Physical Sciences', 'History', 'English Home Language', 'isiXhosa (HL / FAL)', 'Life Orientation'],
    role: 'learner',
    isVerified: false, // Pending verification
    createdAt: '2026-03-08T10:05:00.000Z',
    studyStreakDays: 2,
    hoursStudied: 6.0,
    papersCompleted: 2
  },
  {
    id: 'user-banned-demo',
    initials: 'Z.M.',
    username: 'spammer_account',
    email: 'fake.spammer@gmail.com',
    school: 'Hoërskool Menlopark (Gauteng)',
    province: 'Gauteng',
    subjects: ['Mathematical Literacy', 'Tourism'],
    role: 'learner',
    isBanned: true,
    bannedReason: 'Suspicious bot activity detected by safety monitor.',
    isVerified: false,
    createdAt: '2026-03-12T04:12:00.000Z'
  }
];

export const INITIAL_ADMIN: User = {
  id: 'admin-lumina-super',
  initials: 'L.A.',
  username: 'admin_lumina',
  email: 'admin@lumina.co.za',
  school: 'Department of Basic Education / Lumina Portal (National)',
  province: 'Gauteng',
  subjects: ['Mathematics', 'Physical Sciences', 'Life Sciences', 'Accounting'],
  role: 'admin',
  isVerified: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  studyStreakDays: 99,
  hoursStudied: 120.0,
  papersCompleted: 50
};

export interface SampleDoc {
  id: string;
  title: string;
  subject: string;
  sourceType: 'PDF' | 'PowerPoint' | 'Word' | 'Images / Notes';
  snippet: string;
  fullContent: string;
}

export const SAMPLE_STUDY_DOCUMENTS: SampleDoc[] = [
  {
    id: 'sample-doc-phys',
    title: 'Physical Sciences: Newton\'s Laws & Organic Chemistry Notes.pdf',
    subject: 'Physical Sciences',
    sourceType: 'PDF',
    snippet: 'Complete breakdown of Newton 1, 2, 3, friction calculations, IUPAC rules, isomers & boiling point trends.',
    fullContent: `DEPARTMENT OF BASIC EDUCATION - GRADE 12 PHYSICAL SCIENCES STUDY GUIDE
MODULE 1: NEWTON'S SECOND LAW OF MOTION (PAPER 1)
Statement: When a resultant or net force acts on an object, the object will accelerate in the direction of the force. This acceleration is directly proportional to the net force and inversely proportional to the mass of the object: F_net = m · a.
Key Exam Technique:
1. Identify all forces acting on the object: Gravity (Fg = mg downwards), Normal Force (Fn perpendicular to contact surface), Tension (T), Friction (fk = μk · Fn).
2. Draw a free-body diagram with labeled arrows originating from a single central dot. Arrows must touch the dot and point away.
3. Apply F_net = ma along the axis of motion. Choose a positive direction and stick to it.
4. When two objects are connected by a light inextensible cord passing over a frictionless pulley, both objects experience identical acceleration magnitude and equal tension forces.

MODULE 2: ORGANIC CHEMISTRY (PAPER 2)
1. Homologous Series & Functional Groups:
- Alkanes (CnH2n+2): Saturated hydrocarbons, only single carbon-carbon bonds. Weak London dispersion forces.
- Haloalkanes: Alkane chain with halogen substituent (-F, -Cl, -Br, -I). Dipole-dipole forces.
- Alcohols (-OH group, suffix -ol): Strong hydrogen bonding. Primary, secondary, tertiary alcohols depending on carbon attached to -OH.
- Carboxylic Acids (-COOH group, suffix -oic acid): Form dimers with TWO sites of hydrogen bonding. Highest boiling points among hydrocarbons of comparable molar mass.
- Esters (-COO-): Formed via esterification of an alcohol and a carboxylic acid with concentrated H2SO4 catalyst under reflux. Sweet, fruity fragrance.

2. Physical Properties & Boiling Points:
- Trend: As chain length / molar mass increases, surface area increases, London dispersion forces strengthen, and boiling point increases.
- Branching: More branched isomers are more spherical, possess smaller contact surface area, weaker London forces, and lower boiling points than unbranched chain counterparts.`
  },
  {
    id: 'sample-doc-math',
    title: 'Mathematics: Differential Calculus & Curve Sketching.docx',
    subject: 'Mathematics',
    sourceType: 'Word',
    snippet: 'First principles derivation, stationary points, inflection points, tangents, and maximum/minimum optimization.',
    fullContent: `GRADE 12 MATHEMATICS CAPS EXAMINATION REVISION: CALCULUS
1. First Principles:
Formula: f'(x) = lim_{h -> 0} [f(x + h) - f(x)] / h
Rules: Always write the limit symbol on every line until the substitution h = 0 is executed. Never omit limit notation before dividing out h.

2. Differentiation Rules:
- Power Rule: d/dx [a·x^n] = n·a·x^(n - 1)
- Constant Rule: d/dx [c] = 0
- Sum/Difference: d/dx [f(x) ± g(x)] = f'(x) ± g'(x)
- Exponential & Rational rewriting: Always convert radicals and fractional powers into standard exponential notation (e.g., 5/√x = 5x^(-1/2)) BEFORE taking derivatives.

3. Cubic Functions: f(x) = ax³ + bx² + cx + d
- Y-intercept: Let x = 0 -> (0 ; d)
- X-intercepts: Solve f(x) = 0 using factor theorem, synthetic division, or inspection.
- Stationary Points (Turning Points): Set f'(x) = 0 and solve for x. Substitute x values into f(x) to find y-coordinates.
- Point of Inflection: Set f''(x) = 0 or calculate x = -b / (3a). The graph changes concavity at this point.
- Concavity: If f''(x) > 0, graph is concave up (local minimum). If f''(x) < 0, graph is concave down (local maximum).

4. Real-World Optimization:
Step 1: Express the quantity to be maximized or minimized in terms of ONE variable using given constraints.
Step 2: Differentiate with respect to that variable.
Step 3: Equate first derivative to zero and solve.
Step 4: Answer the specific question (dimensions, max volume, min cost) with proper units.`
  },
  {
    id: 'sample-doc-bio',
    title: 'Life Sciences: Genetics, DNA & Meiosis Summary.pptx',
    subject: 'Life Sciences',
    sourceType: 'PowerPoint',
    snippet: 'DNA replication, transcription to mRNA, translation by tRNA at ribosomes, Mendel’s laws, and crossing over in Meiosis.',
    fullContent: `GRADE 12 CAPS LIFE SCIENCES: GENETICS & MOLECULAR BIOLOGY
TOPIC 1: DNA & RNA (Code of Life)
- DNA Structure: Double helix composed of nucleotides (Deoxyribose sugar, phosphate group, nitrogenous base: Adenine, Thymine, Guanine, Cytosine). A pairs with T (2 hydrogen bonds), G pairs with C (3 hydrogen bonds).
- DNA Replication: Takes place during Interphase in the nucleus. Double helix unwinds and unzips as hydrogen bonds break. Each original strand acts as a template for free nucleotides. Results in two identical DNA molecules (Semi-conservative replication).
- Protein Synthesis:
  1. Transcription: DNA unwinds; complementary mRNA strand is synthesized using RNA polymerase. Thymine is replaced with Uracil in RNA. mRNA leaves nucleus through nuclear pore into cytoplasm.
  2. Translation: mRNA attaches to ribosome. tRNA carrying specific amino acid binds complementary codon via its anticodon. Peptide bonds form between amino acids, creating a polypeptide chain.

TOPIC 2: MEIOSIS & VARIATION
- Purpose: Produces haploid gametes (n = 23 in humans) for sexual reproduction, preventing doubling of chromosomes at fertilization.
- Crossing Over (Prophase I): Non-sister chromatids of homologous chromosomes overlap at chiasmata and exchange genetic material. Introduces genetic variation.
- Random Arrangement (Metaphase I & II): Homologous pairs align randomly along the equator, ensuring independent assortment of maternal and paternal chromosomes.

TOPIC 3: GENETIC CROSSES
- Format required by DBE examiners:
  P1 phenotype: [e.g. Normal blood clotting × Hemophiliac male]
  P1 genotype: [e.g. X^H X^h × X^h Y]
  Meiosis / Gametes: [Show separate gametes]
  Fertilization / Punnett Square: [Show 4 offspring combinations]
  F1 genotype & phenotype ratios: [State exact percentage or ratio].`
  },
  {
    id: 'sample-doc-bstd',
    title: 'Business Studies: Macro Environment & B-BBEE Legislation.pdf',
    subject: 'Business Studies',
    sourceType: 'PDF',
    snippet: 'Macro forces, PESTLE analysis, labor legislation, B-BBEE pillars, and corporate social responsibility (CSR).',
    fullContent: `GRADE 12 BUSINESS STUDIES: BUSINESS ENVIRONMENTS & LEGISLATION
1. Macro Environment (PESTLE Analysis):
- Political: Government policies, tax regulations, political stability.
- Economic: Inflation rates, interest rates set by SARB (South African Reserve Bank), exchange rate (Rand against Dollar/Euro).
- Social: Unemployment, poverty, crime, literacy rates, changing demographics.
- Technological: E-commerce, automation, artificial intelligence, cyber-security.
- Legal: South African acts including BCEA, LRA, EEA, CPA, and B-BBEE.
- Environmental: Carbon footprint, pollution, waste management, renewable energy adoption.

2. Broad-Based Black Economic Empowerment (B-BBEE Act 53 of 2003):
- Purpose: Redress historic economic imbalances, increase black ownership, empower historically disadvantaged South Africans.
- Core Pillars:
  1. Direct Ownership (voting rights and economic interest)
  2. Management Control (board participation and senior management representation)
  3. Skills Development (training investment and learnerships)
  4. Enterprise and Supplier Development (ESD: purchasing from black-owned suppliers and preferential procurement)
  5. Socio-Economic Development (SED: community contributions and education programs).

3. Porter's Five Forces Model:
- Threat of new entrants: High startup capital acts as barrier to entry.
- Bargaining power of buyers: Customers demand lower prices if alternatives abound.
- Bargaining power of suppliers: Few dominant suppliers can dictate component prices.
- Threat of substitute products: Alternative goods fulfilling identical consumer need.
- Rivalry among existing competitors: Intensity of price wars, promotional campaigns.`
  }
];
