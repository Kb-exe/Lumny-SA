import { PastPaper } from '../types';

export const PAST_PAPERS_CATALOG: PastPaper[] = [
  // MATHEMATICS P1
  {
    id: 'math-2024-nov-p1',
    subjectId: 'math',
    subjectName: 'Mathematics',
    year: 2024,
    session: 'Nov/Dec NSC Finals',
    paperNumber: 'P1',
    title: 'Mathematics Paper 1 (Algebra, Calculus, Financial Math, Probability)',
    language: 'English',
    marks: 150,
    durationHours: 3,
    topicsCovered: ['Algebra & Equations', 'Patterns & Sequences', 'Functions & Inverses', 'Financial Mathematics', 'Differential Calculus', 'Probability'],
    paperPreviewText: `NATIONAL SENIOR CERTIFICATE: MATHEMATICS P1 - NOVEMBER 2024

QUESTION 1
1.1 Solve for x:
    1.1.1  x(x - 7) = 0                                         (2)
    1.1.2  3x² - 5x - 1 = 0 (correct to TWO decimal places)      (3)
    1.1.3  x² - 3x - 10 > 0                                     (3)
    1.1.4  √(2x + 5) - x = 1                                    (4)

1.2 Solve simultaneously for x and y:
    y + 2x = 5
    2x² + y² - 3xy = 5                                          (6)

QUESTION 2 (SEQUENCES & SERIES)
2.1 Given the quadratic sequence: 3 ; 9 ; 17 ; 27 ; ...
    2.1.1 Write down the value of the next term.                (1)
    2.1.2 Determine an expression for the nth term, Tn.          (4)
    2.1.3 Which term in the sequence is equal to 323?           (4)

QUESTION 7 (CALCULUS)
7.1 Determine f'(x) from FIRST PRINCIPLES if f(x) = 2x² - 5.     (5)
7.2 Determine dy/dx if:
    7.2.1 y = 4x³ - 5/√x                                        (3)
    7.2.2 y = (2x - 3)(x² + 4)                                  (3)`,
    memoPreviewText: `MARKING GUIDELINE / MEMORANDUM: MATHEMATICS P1 - NOV 2024

1.1.1  x = 0  ✓  or  x = 7  ✓                                  (2)
1.1.2  Formula: x = (-b ± √(b² - 4ac)) / (2a)
       Substitution: x = (-(-5) ± √((-5)² - 4(3)(-1))) / (2(3))  ✓
       x = (5 ± √37) / 6
       x = 1.85  ✓  or  x = -0.18  ✓                            (3)
1.1.3  (x - 5)(x + 2) > 0  ✓ Critical values: x = 5, x = -2  ✓
       x < -2  or  x > 5  ✓                                      (3)
1.1.4  √(2x + 5) = x + 1
       2x + 5 = x² + 2x + 1  ✓
       x² - 4 = 0
       (x - 2)(x + 2) = 0
       x = 2  ✓  (Test: √(9) = 3 = 2+1, valid)
       x = -2 is invalid / rejected  ✓                           (4)

7.1  f(x + h) = 2(x + h)² - 5 = 2x² + 4xh + 2h² - 5  ✓
     f'(x) = lim h→0 [f(x+h) - f(x)] / h  ✓
           = lim h→0 [4xh + 2h²] / h  ✓
           = lim h→0 [4x + 2h]  ✓
           = 4x  ✓                                               (5)`
  },

  // MATHEMATICS P2
  {
    id: 'math-2024-nov-p2',
    subjectId: 'math',
    subjectName: 'Mathematics',
    year: 2024,
    session: 'Nov/Dec NSC Finals',
    paperNumber: 'P2',
    title: 'Mathematics Paper 2 (Analytical Geometry, Trigonometry, Euclidean Geometry, Statistics)',
    language: 'English',
    marks: 150,
    durationHours: 3,
    topicsCovered: ['Statistics & Regression', 'Analytical Geometry', 'Trigonometry & Identities', 'Euclidean Geometry & Circle Theorems'],
    paperPreviewText: `NATIONAL SENIOR CERTIFICATE: MATHEMATICS P2 - NOVEMBER 2024

QUESTION 3 (ANALYTICAL GEOMETRY)
In the Cartesian plane, circle centered at M(2 ; -1) passes through point A(6 ; 2).
3.1 Determine the equation of the circle in the form (x - a)² + (y - b)² = r².  (3)
3.2 Show that the point B(5 ; 3) lies outside the circle.                     (2)
3.3 Determine the equation of the tangent to the circle at point A(6 ; 2).     (4)

QUESTION 5 (TRIGONOMETRY)
5.1 Simplify without using a calculator:
    (sin 140° · cos 20° - cos 140° · sin 20°) / (cos² 15° - sin² 15°)          (6)
5.2 Prove the identity:
    (1 - cos 2θ) / (sin 2θ) = tan θ                                            (3)`,
    memoPreviewText: `MARKING GUIDELINE / MEMORANDUM: MATHEMATICS P2 - NOV 2024

3.1  r² = (6 - 2)² + (2 - (-1))²  ✓
     r² = 4² + 3² = 25  ✓
     Equation: (x - 2)² + (y + 1)² = 25  ✓                             (3)

3.3  Gradient of radius MA: m_MA = (2 - (-1)) / (6 - 2) = 3/4  ✓
     Tangent is perpendicular to radius: m_tan = -4/3  ✓
     y - 2 = -4/3 (x - 6)  ✓
     y = -4/3 x + 10  ✓                                                (4)

5.1  Numerator = sin(140° - 20°) = sin 120°  ✓
               = sin 60° = √3 / 2  ✓
     Denominator = cos(2 × 15°) = cos 30° = √3 / 2  ✓
     Result = (√3 / 2) / (√3 / 2) = 1  ✓                              (6)`
  },

  // PHYSICAL SCIENCES P1 (PHYSICS)
  {
    id: 'phsc-2024-nov-p1',
    subjectId: 'phsc',
    subjectName: 'Physical Sciences',
    year: 2024,
    session: 'Nov/Dec NSC Finals',
    paperNumber: 'P1',
    title: 'Physical Sciences Paper 1: Physics (Mechanics, Waves, Electrodynamics)',
    language: 'English',
    marks: 150,
    durationHours: 3,
    topicsCovered: ['Newtonian Mechanics', 'Vertical Projectile Motion', 'Work, Energy & Power', 'Doppler Effect', 'Electric Circuits', 'Photoelectric Effect'],
    paperPreviewText: `NATIONAL SENIOR CERTIFICATE: PHYSICAL SCIENCES P1 - NOVEMBER 2024

QUESTION 2 (NEWTON'S LAWS)
A block of mass 6 kg on a rough horizontal surface is connected by a light inextensible string passing over a frictionless pulley to a hanging mass of 4 kg. A horizontal force F of 15 N is applied to the 6 kg block to the left. The coefficient of kinetic friction between the 6 kg block and the surface is 0.25.

2.1 State Newton's Second Law of Motion in words.                              (2)
2.2 Draw a labeled free-body diagram for the 6 kg block.                      (4)
2.3 Calculate the magnitude of the kinetic frictional force on the 6 kg block. (3)
2.4 Calculate the acceleration of the system.                                  (5)

QUESTION 6 (DOPPLER EFFECT)
An ambulance moving at a constant speed of 28 m·s⁻¹ emits sound of frequency 750 Hz.
Take the speed of sound in air as 340 m·s⁻¹.
6.1 State the Doppler Effect in words.                                         (2)
6.2 Calculate the frequency heard by a stationary listener as ambulance approaches. (4)`,
    memoPreviewText: `MARKING GUIDELINE / MEMORANDUM: PHYSICAL SCIENCES P1 - NOV 2024

2.1  When a resultant/net force acts on an object, the object will accelerate in the direction of the force with an acceleration directly proportional to the force and inversely proportional to the mass of the object.  ✓✓ (2 or 0)

2.2  Free-body diagram:
     - Normal force (F_N) pointing vertically upwards  ✓
     - Gravitational force (F_g / w) pointing vertically downwards  ✓
     - Tension (T) pointing horizontally to the right  ✓
     - Applied force (F) and Friction (f_k) pointing to the left  ✓  (4)

2.3  f_k = μ_k · N = μ_k · m · g  ✓
     f_k = 0.25 × 6 × 9.8  ✓
     f_k = 14.7 N  ✓                                                  (3)

6.2  f_L = (v ± v_L) / (v ± v_s) · f_s  ✓
     f_L = (340 / (340 - 28)) × 750  ✓✓
     f_L = (340 / 312) × 750 = 817.31 Hz  ✓                           (4)`
  },

  // PHYSICAL SCIENCES P2 (CHEMISTRY)
  {
    id: 'phsc-2024-nov-p2',
    subjectId: 'phsc',
    subjectName: 'Physical Sciences',
    year: 2024,
    session: 'Nov/Dec NSC Finals',
    paperNumber: 'P2',
    title: 'Physical Sciences Paper 2: Chemistry (Organic Chemistry, Rates, Equilibrium, Acids & Bases)',
    language: 'English',
    marks: 150,
    durationHours: 3,
    topicsCovered: ['Organic Chemistry & IUPAC Nomenclature', 'Intermolecular Forces & Boiling Points', 'Rate of Reaction', 'Chemical Equilibrium & Kc', 'Acids & Bases', 'Electrochemical Cells'],
    paperPreviewText: `NATIONAL SENIOR CERTIFICATE: PHYSICAL SCIENCES P2 - NOVEMBER 2024

QUESTION 2 (ORGANIC CHEMISTRY)
Consider the following organic compounds:
A: CH₃-CH(CH₃)-CH₂-OH
B: CH₃-COO-CH₂-CH₃
C: CH₃-CH₂-CHO
D: Pentanoic acid

2.1 Write down the:
    2.1.1 IUPAC name for compound A.                                          (2)
    2.1.2 Homologous series to which compound B belongs.                       (1)
    2.1.3 Structural formula for the functional isomer of compound B.          (2)
2.2 Explain why compound D has a higher boiling point than compound A. Refer to intermolecular forces and energy required.                                   (4)

QUESTION 6 (CHEMICAL EQUILIBRIUM)
N₂(g) + 3H₂(g) ⇌ 2NH₃(g)   ΔH < 0
6.1 State Le Chatelier's Principle in words.                                   (2)
6.2 How will an increase in pressure affect the yield of NH₃? Explain.         (3)`,
    memoPreviewText: `MARKING GUIDELINE / MEMORANDUM: PHYSICAL SCIENCES P2 - NOV 2024

2.1.1  2-methylpropan-1-ol  ✓✓ (1 for stem propan-1-ol, 1 for substituent)   (2)
2.1.2  Esters  ✓                                                              (1)
2.1.3  Butanoic acid structural formula: CH₃-CH₂-CH₂-COOH drawn out correctly. ✓✓ (2)

2.2  - Both compounds have hydrogen bonding.  ✓
     - Compound D has TWO sites for hydrogen bonding (dimer formation) whereas compound A has only ONE.  ✓
     - Intermolecular forces in compound D are stronger than in compound A.  ✓
     - More thermal energy is required to overcome intermolecular forces in D. ✓ (4)

6.1  When the equilibrium in a closed system is disturbed, the system will reinstate a new equilibrium by favoring the reaction that opposes the disturbance. ✓✓ (2)`
  },

  // LIFE SCIENCES P1
  {
    id: 'lfsc-2024-nov-p1',
    subjectId: 'lfsc',
    subjectName: 'Life Sciences',
    year: 2024,
    session: 'Nov/Dec NSC Finals',
    paperNumber: 'P1',
    title: 'Life Sciences Paper 1 (Human Reproduction, Responding to the Environment, Endocrine)',
    language: 'English',
    marks: 150,
    durationHours: 2.5,
    topicsCovered: ['Reproduction in Vertebrates', 'Human Reproduction & Menstrual Cycle', 'Responding to the Environment: Humans', 'Human Endocrine System & Homeostasis'],
    paperPreviewText: `NATIONAL SENIOR CERTIFICATE: LIFE SCIENCES P1 - NOVEMBER 2024

QUESTION 1
1.1 Provide the correct biological term for each of the following:
    1.1.1 The structure in the ear responsible for balance during dynamic movement. (1)
    1.1.2 The hormone that prepares the endometrium for embryo implantation.       (1)
    1.1.3 The fluid that protects the human developing fetus against shocks.        (1)

QUESTION 2 (HUMAN EYE & ACCOMMODATION)
Describe the pupillary mechanism when moving from a dimly lit room into bright African sunlight. (6 marks)`,
    memoPreviewText: `MARKING GUIDELINE / MEMORANDUM: LIFE SCIENCES P1 - NOV 2024

1.1.1  Semicircular canals / Cristae  ✓                                         (1)
1.1.2  Progesterone  ✓                                                          (1)
1.1.3  Amniotic fluid  ✓                                                        (1)

QUESTION 2: PUPILLARY MECHANISM IN BRIGHT LIGHT
- Circular muscles of the iris contract.  ✓
- Radial muscles of the iris relax.  ✓
- The pupil constricts / becomes smaller.  ✓
- Less light enters the eye.  ✓
- This prevents damage / blinding of the photoreceptors on the retina.  ✓✓      (6)`
  },

  // ACCOUNTING P1
  {
    id: 'acct-2024-nov-p1',
    subjectId: 'acct',
    subjectName: 'Accounting',
    year: 2024,
    session: 'Nov/Dec NSC Finals',
    paperNumber: 'P1',
    title: 'Accounting Paper 1: Financial Reporting & Corporate Governance',
    language: 'English',
    marks: 150,
    durationHours: 2,
    topicsCovered: ['Statement of Comprehensive Income (Income Statement)', 'Balance Sheet (Statement of Financial Position)', 'Cash Flow Statement & Financial Ratios', 'Corporate Governance & Audit Reports'],
    paperPreviewText: `NATIONAL SENIOR CERTIFICATE: ACCOUNTING P1 - NOVEMBER 2024

QUESTION 2 (FINANCIAL STATEMENTS)
Prepare the Statement of Comprehensive Income for ZuluTech Ltd for the year ended 28 February 2024. Take into account the adjustments for depreciation, bad debts written off, provision for bad debts, and interest on loan capital. (55 marks)

QUESTION 3 (FINANCIAL INDICATORS)
Calculate:
3.1 Debt-equity ratio.                                                         (3)
3.2 Net Asset Value per share (NAV).                                            (3)
3.3 Comment on the company's liquidity position with reference to the Acid-Test ratio. (4)`,
    memoPreviewText: `MARKING GUIDELINE / MEMORANDUM: ACCOUNTING P1 - NOV 2024

3.1  Debt-Equity Ratio = Non-current Liabilities : Shareholders' Equity
     = R1,200,000 : R3,600,000  ✓
     = 0.33 : 1  ✓  (Low financial risk, company is not highly geared)  ✓       (3)

3.3  Acid-Test Ratio = (Current Assets - Inventories) : Current Liabilities
     = (R950,000 - R400,000) : R500,000 = 1.1 : 1  ✓
     Comment: The company can comfortably cover its short-term debt without relying on inventory sales. The ratio is above the accepted 1:1 norm. ✓✓✓ (4)`
  },

  // BUSINESS STUDIES P1
  {
    id: 'bstd-2024-nov-p1',
    subjectId: 'bstd',
    subjectName: 'Business Studies',
    year: 2024,
    session: 'Nov/Dec NSC Finals',
    paperNumber: 'P1',
    title: 'Business Studies Paper 1: Business Environments & Operations',
    language: 'English',
    marks: 150,
    durationHours: 2,
    topicsCovered: ['Macro, Market and Micro Environments', 'Legislation (B-BBEE, BCEA, LRA, EEA)', 'Business Strategies (Porter, SWOT, PESTLE)', 'Human Resources & Quality of Performance'],
    paperPreviewText: `NATIONAL SENIOR CERTIFICATE: BUSINESS STUDIES P1 - NOVEMBER 2024

QUESTION 4 (LEGISLATION)
4.1 Discuss the impact of the Broad-Based Black Economic Empowerment Act (B-BBEE), 2003 (Act 53 of 2003) on businesses. (8 marks)
4.2 Outline the pillars of the B-BBEE scorecard.                               (6 marks)

QUESTION 6 (ESSAY: BUSINESS STRATEGIES)
Businesses operate in turbulent environments.
- Explain the steps in strategy evaluation.
- Discuss Porter's Five Forces model in analyzing the market environment.
- Advise businesses on intensive strategies to counter market competition. (40 marks)`,
    memoPreviewText: `MARKING GUIDELINE / MEMORANDUM: BUSINESS STUDIES P1 - NOV 2024

4.1 POSITIVE IMPACT OF B-BBEE:
- Encourages business partnerships and transformation in South Africa.  ✓✓
- Qualifies businesses for government tenders and state contracts.  ✓✓
- Promotes workforce diversity and economic inclusivity.  ✓✓
NEGATIVE IMPACT:
- High compliance and administrative auditing costs.  ✓✓ (Max 8)

4.2 PILLARS OF B-BBEE SCORECARD:
- Ownership  ✓
- Management Control  ✓
- Skills Development  ✓
- Enterprise and Supplier Development (ESD)  ✓
- Socio-Economic Development (SED)  ✓✓                                          (6)`
  },

  // MATHEMATICAL LITERACY P1
  {
    id: 'mlit-2024-nov-p1',
    subjectId: 'mlit',
    subjectName: 'Mathematical Literacy',
    year: 2024,
    session: 'Nov/Dec NSC Finals',
    paperNumber: 'P1',
    title: 'Mathematical Literacy Paper 1: Finance and Data Handling',
    language: 'English',
    marks: 150,
    durationHours: 3,
    topicsCovered: ['Financial Documents (Payslips, Bank Statements)', 'Taxation & SARS Income Tax Brackets', 'Tariff Systems (Water, Electricity, Cellphone)', 'Data Handling & Statistics'],
    paperPreviewText: `NATIONAL SENIOR CERTIFICATE: MATHEMATICAL LITERACY P1 - NOVEMBER 2024

QUESTION 1 (FINANCE & SARS TAXATION)
Lerato earns a gross monthly salary of R32,500. She contributes 7.5% of her salary to a recognized pension fund.
1.1 Calculate Lerato's annual pension fund contribution.                        (3)
1.2 Calculate her annual taxable income.                                       (3)
1.3 Using the SARS 2024/2025 tax bracket table, determine her net monthly pay after PAYE and UIF. (6)`,
    memoPreviewText: `MARKING GUIDELINE / MEMORANDUM: MATHEMATICAL LITERACY P1 - NOV 2024

1.1  Monthly pension = R32,500 × 7.5% = R2,437.50  ✓
     Annual pension = R2,437.50 × 12 = R29,250.00  ✓✓                          (3)

1.2  Annual gross = R32,500 × 12 = R390,000  ✓
     Taxable income = R390,000 - R29,250 = R360,750  ✓✓                        (3)`
  },

  // GEOGRAPHY P1
  {
    id: 'geog-2024-nov-p1',
    subjectId: 'geog',
    subjectName: 'Geography',
    year: 2024,
    session: 'Nov/Dec NSC Finals',
    paperNumber: 'P1',
    title: 'Geography Paper 1: Climate & Weather, Geomorphology and Mapwork',
    language: 'English',
    marks: 150,
    durationHours: 3,
    topicsCovered: ['Mid-latitude Cyclones', 'Tropical Cyclones', 'Subtropical Anticyclones & Valley Climates', 'Drainage Systems & River Profiles', 'GIS & Topographical Mapwork'],
    paperPreviewText: `NATIONAL SENIOR CERTIFICATE: GEOGRAPHY P1 - NOVEMBER 2024

QUESTION 1 (CLIMATE & WEATHER)
Refer to the synoptic weather map showing Tropical Cyclone 'Freddy' off the Mozambique coast.
1.1 State TWO conditions necessary for the formation of a tropical cyclone.     (2)
1.2 Explain why the cyclone dissipates rapidly once it makes landfall.        (4)
1.3 Discuss strategies local communities can implement to mitigate cyclone flooding. (4)`,
    memoPreviewText: `MARKING GUIDELINE / MEMORANDUM: GEOGRAPHY P1 - NOV 2024

1.1  - Sea surface temperatures of 26.5°C or higher.  ✓
     - High humidity and abundant moisture in lower atmosphere.  ✓ (or Coriolis force $\ge$ 5° from equator) (2)

1.2  - Loss of warm ocean water as energy/moisture source.  ✓✓
     - Surface friction over rugged landmass slows rotational wind velocity. ✓✓ (4)`
  },

  // HISTORY P1
  {
    id: 'hist-2024-nov-p1',
    subjectId: 'hist',
    subjectName: 'History',
    year: 2024,
    session: 'Nov/Dec NSC Finals',
    paperNumber: 'P1',
    title: 'History Paper 1: The Cold War and Civil Society Protests (1950s–1970s)',
    language: 'English',
    marks: 150,
    durationHours: 3,
    topicsCovered: ['Origins of the Cold War', 'Cuban Missile Crisis', 'Vietnam War', 'Civil Rights Movement in the USA', 'Black Power Movement'],
    paperPreviewText: `NATIONAL SENIOR CERTIFICATE: HISTORY P1 - NOVEMBER 2024

SECTION A: SOURCE-BASED QUESTIONS
QUESTION 1: THE CUBAN MISSILE CRISIS (1962)
Study Sources 1A, 1B, 1C and 1D.
1.1 Explain why Soviet Premier Nikita Khrushchev positioned nuclear warheads in Cuba. (2)
1.2 Evaluate the usefulness of Source 1B to a historian researching John F. Kennedy's naval blockade decision. (4)`,
    memoPreviewText: `MARKING GUIDELINE / MEMORANDUM: HISTORY P1 - NOV 2024

1.1  - To protect the Cuban socialist revolution against US intervention (after Bay of Pigs). ✓
     - To counterbalance US Jupiter missiles stationed in Turkey. ✓             (2)

1.2  - Source is an official White House declassified tape transcript (high reliability). ✓
     - Directly captures Kennedy's deliberations with ExComm. ✓
     - Limitation: Focuses purely on American perspective without Soviet viewpoint. ✓✓ (4)`
  },

  // 2023 PAPERS
  {
    id: 'math-2023-nov-p1',
    subjectId: 'math',
    subjectName: 'Mathematics',
    year: 2023,
    session: 'Nov/Dec NSC Finals',
    paperNumber: 'P1',
    title: 'Mathematics Paper 1 (NSC 2023 Standard)',
    language: 'English',
    marks: 150,
    durationHours: 3,
    topicsCovered: ['Algebra & Exponential equations', 'Arithmetic and Geometric Series', 'Hyperbola and Parabola', 'Financial Annuities', 'Cubic Polynomials & Optimization'],
    paperPreviewText: `NATIONAL SENIOR CERTIFICATE: MATHEMATICS P1 - NOVEMBER 2023

QUESTION 6 (FINANCIAL MATHEMATICS)
A learner purchases a car for R250,000. She pays a 15% deposit and finances the balance via a bank loan at 11.5% p.a. compounded monthly over 5 years.
6.1 Calculate the monthly installment payment. (4 marks)
6.2 Calculate the outstanding balance after 24 payments. (4 marks)`,
    memoPreviewText: `MARKING GUIDELINE / MEMORANDUM: MATHEMATICS P1 - NOV 2023

6.1  Deposit = 0.15 × 250,000 = R37,500.
     Loan amount P = R212,500  ✓
     Formula: P = x [1 - (1 + i)^(-n)] / i  ✓
     i = 0.115 / 12, n = 60
     x = R4,668.21  ✓✓                                                  (4)`
  },

  {
    id: 'phsc-2023-nov-p1',
    subjectId: 'phsc',
    subjectName: 'Physical Sciences',
    year: 2023,
    session: 'Nov/Dec NSC Finals',
    paperNumber: 'P1',
    title: 'Physical Sciences Paper 1: Physics (NSC 2023)',
    language: 'English',
    marks: 150,
    durationHours: 3,
    topicsCovered: ['Vertical Projectile Motion', 'Momentum and Impulse', 'Work-Energy Theorem', 'Electric Generators & Alternating Current'],
    paperPreviewText: `NATIONAL SENIOR CERTIFICATE: PHYSICAL SCIENCES P1 - NOVEMBER 2023

QUESTION 3 (VERTICAL PROJECTILE MOTION)
A ball is thrown vertically upwards from the edge of a cliff 45 m high with an initial velocity of 12 m·s⁻¹.
3.1 Calculate the maximum height above the ground reached by the ball. (4 marks)
3.2 Calculate the total time taken for the ball to hit the ground below. (4 marks)`,
    memoPreviewText: `MARKING GUIDELINE / MEMORANDUM: PHYSICAL SCIENCES P1 - NOV 2023

3.1  v_f² = v_i² + 2aΔy  ✓
     0 = (12)² + 2(-9.8)Δy  ✓
     Δy = 7.35 m above cliff top.  ✓
     Total height above ground = 45 + 7.35 = 52.35 m  ✓               (4)`
  }
];
