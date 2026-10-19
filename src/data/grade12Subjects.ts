import { Grade12Subject } from '../types';

export const ALL_GRADE12_SUBJECTS: Grade12Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    category: 'Sciences & Math',
    shortCode: 'MATH',
    paperCount: 24,
    examCode: 'DBE-101',
    color: 'emerald',
    description: 'Algebra, Functions, Calculus, Trigonometry, Analytical Geometry, Statistics & Probability.'
  },
  {
    id: 'mlit',
    name: 'Mathematical Literacy',
    category: 'Sciences & Math',
    shortCode: 'MLIT',
    paperCount: 22,
    examCode: 'DBE-102',
    color: 'emerald',
    description: 'Finance, Measurement, Maps & Plans, Data Handling & Probability in everyday South African context.'
  },
  {
    id: 'phsc',
    name: 'Physical Sciences',
    category: 'Sciences & Math',
    shortCode: 'PHSC',
    paperCount: 26,
    examCode: 'DBE-103',
    color: 'sky',
    description: 'Physics (Newtonian Mechanics, Work & Energy, Electrodynamics) & Chemistry (Organic, Rates, Acids & Bases).'
  },
  {
    id: 'lfsc',
    name: 'Life Sciences',
    category: 'Sciences & Math',
    shortCode: 'LFSC',
    paperCount: 20,
    examCode: 'DBE-104',
    color: 'teal',
    description: 'DNA Code of Life, Meiosis, Genetics & Inheritance, Human Reproduction, Responding to Environment & Evolution.'
  },
  {
    id: 'acct',
    name: 'Accounting',
    category: 'Commercial & Business',
    shortCode: 'ACCT',
    paperCount: 18,
    examCode: 'DBE-201',
    color: 'amber',
    description: 'Financial Statements, Cash Flow, Financial Analysis, Cost Accounting, Budgeting & Internal Controls.'
  },
  {
    id: 'bstd',
    name: 'Business Studies',
    category: 'Commercial & Business',
    shortCode: 'BSTD',
    paperCount: 18,
    examCode: 'DBE-202',
    color: 'amber',
    description: 'Business Environments, Business Ventures, Business Roles, Human Resources, Ethics & Contemporary Issues.'
  },
  {
    id: 'econ',
    name: 'Economics',
    category: 'Commercial & Business',
    shortCode: 'ECON',
    paperCount: 16,
    examCode: 'DBE-203',
    color: 'orange',
    description: 'Circular Flow, Business Cycles, Public Sector, Foreign Exchange, Protectionism & South African Economy.'
  },
  {
    id: 'geog',
    name: 'Geography',
    category: 'Humanities & Social',
    shortCode: 'GEOG',
    paperCount: 16,
    examCode: 'DBE-301',
    color: 'indigo',
    description: 'Climate & Weather, Geomorphology, Rural & Urban Settlement, Economic Geography of South Africa & Mapwork.'
  },
  {
    id: 'hist',
    name: 'History',
    category: 'Humanities & Social',
    shortCode: 'HIST',
    paperCount: 14,
    examCode: 'DBE-302',
    color: 'rose',
    description: 'The Cold War, Independent Africa, Civil Society Protests, The Collapse of the USSR & Coming of South African Democracy.'
  },
  {
    id: 'eng-hl',
    name: 'English Home Language',
    category: 'Languages',
    shortCode: 'ENG-HL',
    paperCount: 22,
    examCode: 'DBE-401',
    color: 'blue',
    description: 'Paper 1 (Language in Context), Paper 2 (Literature Study: Hamlet, Life of Pi), Paper 3 (Creative Writing).'
  },
  {
    id: 'eng-fal',
    name: 'English First Additional Language',
    category: 'Languages',
    shortCode: 'ENG-FAL',
    paperCount: 20,
    examCode: 'DBE-402',
    color: 'blue',
    description: 'Language, Comprehension, Summary, Poetry, Short Stories, Drama (My Children! My Africa!), and Writing.'
  },
  {
    id: 'afr-ht',
    name: 'Afrikaans Huistaal',
    category: 'Languages',
    shortCode: 'AFR-HT',
    paperCount: 16,
    examCode: 'DBE-403',
    color: 'purple',
    description: 'Taal in Konteks, Letterkunde (Poësie, Roman, Drama) en Kreatiewe Skryfwerk.'
  },
  {
    id: 'afr-eat',
    name: 'Afrikaans Eerste Addisionele Taal',
    category: 'Languages',
    shortCode: 'AFR-EAT',
    paperCount: 16,
    examCode: 'DBE-404',
    color: 'purple',
    description: 'Begripstoets, Opsomming, Taalstrukture, Voorgeskrewe Letterkunde en Skryf.'
  },
  {
    id: 'isizulu',
    name: 'isiZulu (HL / FAL)',
    category: 'Languages',
    shortCode: 'ZUL',
    paperCount: 14,
    examCode: 'DBE-405',
    color: 'emerald',
    description: 'Ulimi Lwasekhaya / Olwengeziwe Lokuqala: Ukufunda, Izincwadi Nemibhalo.'
  },
  {
    id: 'isixhosa',
    name: 'isiXhosa (HL / FAL)',
    category: 'Languages',
    shortCode: 'XHO',
    paperCount: 14,
    examCode: 'DBE-406',
    color: 'emerald',
    description: 'Ulwimi Lweenkobe / Olongezelelweyo Lokuqala: Uvavanyo lweelwimi noNcwadi.'
  },
  {
    id: 'sepedi',
    name: 'Sepedi (HL / FAL)',
    category: 'Languages',
    shortCode: 'SEP',
    paperCount: 12,
    examCode: 'DBE-407',
    color: 'teal',
    description: 'Polelo ya Gae / Tlaleletso ya Pele: Teko ya Polelo le Dingwalo.'
  },
  {
    id: 'sesotho',
    name: 'Sesotho (HL / FAL)',
    category: 'Languages',
    shortCode: 'SOT',
    paperCount: 12,
    examCode: 'DBE-408',
    color: 'teal',
    description: 'Puo ya Lapeng / ya Tlatsetso ya Pele: Puo le Dingolwa.'
  },
  {
    id: 'setswana',
    name: 'Setswana (HL / FAL)',
    category: 'Languages',
    shortCode: 'SET',
    paperCount: 12,
    examCode: 'DBE-409',
    color: 'teal',
    description: 'Puo ya Gae / ya Tlaleletso ya Ntlha: Puo le Ditlhamo.'
  },
  {
    id: 'cat',
    name: 'Computer Applications Technology (CAT)',
    category: 'Services & Tech',
    shortCode: 'CAT',
    paperCount: 16,
    examCode: 'DBE-501',
    color: 'cyan',
    description: 'Practical Examination (Word, Excel, Access, HTML) and Theory (Hardware, Software, Networks, Impact).'
  },
  {
    id: 'it',
    name: 'Information Technology (IT)',
    category: 'Services & Tech',
    shortCode: 'IT',
    paperCount: 16,
    examCode: 'DBE-502',
    color: 'cyan',
    description: 'Practical Programming (Java / Delphi, OOP, SQL, Algorithms) and Systems Theory Examination.'
  },
  {
    id: 'egd',
    name: 'Engineering Graphics & Design (EGD)',
    category: 'Services & Tech',
    shortCode: 'EGD',
    paperCount: 14,
    examCode: 'DBE-503',
    color: 'slate',
    description: 'Civil Drawing, Mechanical Drawing, Isometric, Perspective, Interpenetration & Developments.'
  },
  {
    id: 'tour',
    name: 'Tourism',
    category: 'Services & Tech',
    shortCode: 'TOUR',
    paperCount: 12,
    examCode: 'DBE-504',
    color: 'emerald',
    description: 'Mapwork & Tour Planning, Attractions, Culture & Heritage, Marketing, Customer Care & Forex.'
  },
  {
    id: 'agsc',
    name: 'Agricultural Sciences',
    category: 'Sciences & Math',
    shortCode: 'AGSC',
    paperCount: 12,
    examCode: 'DBE-505',
    color: 'lime',
    description: 'Animal Nutrition, Animal Production, Protection & Control, Animal Reproduction, Genetics & Agricultural Economics.'
  },
  {
    id: 'cnst',
    name: 'Consumer Studies',
    category: 'Services & Tech',
    shortCode: 'CNST',
    paperCount: 12,
    examCode: 'DBE-506',
    color: 'pink',
    description: 'The Consumer, Food & Nutrition, Clothing, Housing & Entrepreneurship.'
  },
  {
    id: 'lifo',
    name: 'Life Orientation',
    category: 'Humanities & Social',
    shortCode: 'LIFO',
    paperCount: 8,
    examCode: 'DBE-901',
    color: 'green',
    description: 'Development of the Self in Society, Careers & Career Choices, Democracy & Human Rights, Physical Education.'
  }
];

export const SA_PROVINCES = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Free State',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape'
];

export const NOTABLE_SA_SCHOOLS = [
  'Pretoria Boys High School (Gauteng)',
  'Crawford International Sandton (Gauteng)',
  'Rondebosch Boys\' High School (Western Cape)',
  'Durban High School (KwaZulu-Natal)',
  'St John\'s College (Gauteng)',
  'Westerford High School (Western Cape)',
  'Inanda Seminary (KwaZulu-Natal)',
  'Hoërskool Menlopark (Gauteng)',
  'Selborne College (Eastern Cape)',
  'Grey College (Free State)',
  'Bishops Diocesan College (Western Cape)',
  'Jeppe High School for Boys (Gauteng)',
  'Clarendon High School for Girls (Eastern Cape)',
  'Glenwood High School (KwaZulu-Natal)',
  'Hoërskool Waterkloof (Gauteng)',
  'Westville Boys\' High School (KwaZulu-Natal)',
  'Roedean School (Gauteng)',
  'Kingswood College (Eastern Cape)'
];
