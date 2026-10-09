// src/dataStore.js
// Centralized reactive data store for Coaching Pro
// Seamlessly backed by Laravel REST API + MySQL database with offline fallback

import { api } from './api';

const STORAGE_KEYS = {
  BATCHES: 'coachingBatches',
  STUDENTS: 'coachingStudents',
  PAYMENTS: 'coachingPayments',
  ATTENDANCE: 'coachingAttendance',
  EXAMS: 'coachingExams',
  EXPENSES: 'coachingExpenses',
  STAFF: 'coachingStaff',
  SETTINGS: 'coachingSettings',
  FRONTEND: 'coachingFrontendSettings',
  FRONTEND_BN: 'coachingFrontendSettings_BN',
  FRONTEND_EN: 'coachingFrontendSettings_EN',
  PENDING_ADMISSIONS: 'pendingAdmissions',
  ENROLLMENT_LINKS: 'coachingEnrollmentLinks',
  LANGUAGE: 'coachingLanguage',
  DISMISSED_GUIDE: 'coachingDismissedGuide'
};

// Dispatch Custom Event for Reactive State
const notifyChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('coaching-data-change'));
    window.dispatchEvent(new Event('storage'));
  }
};

// Default Landing Page Frontend Settings (Bengali)
export const defaultFrontendSettings_BN = {
  // 1. Notice Bar
  notice: {
    enabled: true,
    badge: 'অফার ও আপডেট',
    text: '📢 HSC 2026 ও 2025 ব্যাচে সীমিত আসনে নতুন ভর্তি চলছে! সরাসরি ক্লাসরুমে ল্যাব সাপোর্ট।',
    btnText: 'অনলাইন ভর্তি আবেদন'
  },

  // 2. Branding & Tagline
  brand: {
    titlePrefix: "Maruf's",
    titleHighlight: "ICT Care",
    tagline: 'ICT মুখস্ত নয়, এসো শিখি',
    logoUrl: '/logo.png'
  },

  // 3. Hero Section
  hero: {
    pillBadge: 'কুষ্টিয়ার সেরা HSC ICT লার্নিং সেন্টার',
    titleLine1: 'HSC ICT-তে A+ নিশ্চিত করতে',
    titleHighlight: 'মুখস্ত নয়, এসো প্রযুক্তির সাথে শিখি',
    subtitle: 'তথ্য ও যোগাযোগ প্রযুক্তি মুখস্ত করার বিষয় নয়! সি প্রোগ্রামিং, এইচটিএমএল টেবিল, লজিক গেইট এবং ডেটাবেজ ম্যানেজমেন্ট প্রজেক্টর ও ল্যাপটপে হাতে-কলমে প্র্যাকটিক্যাল ল্যাবে আয়ত্ত করে বোর্ড পরীক্ষায় পূর্ণাঙ্গ ১০০ নম্বর অর্জন করো।',
    tags: [
      'সংখ্যা পদ্ধতি ও লজিক গেইট',
      'HTML5 ওয়েব ডিজাইন',
      'সি প্রোগ্রামিং ল্যাব',
      'SQL ডেটাবেজ'
    ],
    primaryBtnText: 'লগইন করুন',
    enrollBtnText: 'অনলাইন ভর্তি আবেদন',
    stat1: { number: 98, suffix: '%+', label: 'বোর্ড পরীক্ষায় A+ পাশের হার' },
    stat2: { number: 1200, suffix: '+', label: 'সফল ও সন্তুষ্ট শিক্ষার্থী' },
    stat3: { number: 100, suffix: '%', label: 'প্র্যাকটিক্যাল ল্যাব সাপোর্ট' }
  },

  // 4. Curriculum & Chapters (HSC ICT 1 - 6)
  curriculum: {
    badge: 'পূর্ণাঙ্গ বোর্ড কারিকুলাম',
    title: 'HSC ICT সম্পূর্ণ পাঠ্যসূচি (অধ্যায় ১ - ৬)',
    subtitle: 'প্রতিটি অধ্যায়ের জটিল টপিকগুলোকে সহজবোধ্য বিশ্লেষণের মাধ্যমে পূর্ণাঙ্গ প্রস্তুত করা হয়।',
    chapters: [
      {
        id: 'ch-1',
        num: '০১',
        title: 'তথ্য ও যোগাযোগ প্রযুক্তি: বিশ্ব ও বাংলাদেশ প্রেক্ষিত',
        subtitle: 'Global & Bangladesh Perspective',
        iconName: 'Globe',
        color: '#38bdf8',
        bgGrad: 'rgba(56, 189, 248, 0.15)',
        cqMarks: 'বোর্ডে ১০-১৫ মার্কস নিশ্চিত',
        topics: [
          'ভার্চুয়াল রিয়েলিটি (VR) ও অগমেন্টেড রিয়েলিটি (AR)',
          'কৃত্রিম বুদ্ধিমত্তা (AI) ও রোবটিক্স প্রযুক্তি',
          'ক্রায়োসার্জারি ও চিকিৎসা ক্ষেত্রে ICT প্রয়োগ',
          'বায়োমেট্রিক্স, বায়োইনফরমেটিক্স ও জেনেটিক ইঞ্জিনিয়ারিং',
          'ন্যানোটেকনোলজি ও সাইবার ক্রাইম / তথ্যপ্রযুক্তি নিরাপত্তা'
        ],
        practical: 'আধুনিক টেকনোলজি ভিডিও ডেমো ও প্রজেক্টর ভিজ্যুয়ালাইজেশন',
        tips: 'বোর্ড পরীক্ষায় অনুধাবনমূলক ও প্রয়োগমূলক প্রশ্নে বাস্তব প্রয়োগভিত্তিক ব্যাখ্যা প্রয়োজন।'
      },
      {
        id: 'ch-2',
        num: '০২',
        title: 'কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং',
        subtitle: 'Communication Systems & Networking',
        iconName: 'Cpu',
        color: '#a855f7',
        bgGrad: 'rgba(168, 85, 247, 0.15)',
        cqMarks: '১টি পূর্ণাঙ্গ CQ প্রশ্ন আসবেই',
        topics: [
          'ডেটা ট্রান্সমিশন মেথড (সিনক্রোনাস, অ্যাসিনক্রোনাস, আইসোক্রোনাস)',
          'ডেটা ট্রান্সমিশন মোড (সিমপ্লেক্স, হাফ-ডুপ্লেক্স, ফুল-ডুপ্লেক্স)',
          'কমিউনিকেশন মাধ্যম (টুইস্টেড পেয়ার, কো-অ্যাক্সিয়াল ও ফাইবার অপটিক)',
          'ওয়্যারলেস মিডিয়া (WiFi, WiMAX, Bluetooth, মাইক্রোওয়েভ)',
          'নেটওয়ার্ক টপোলজি (স্টার, বাস, রিং, ট্রি, মেশ, হাইব্রিড) ও ক্লাউড কম্পিউটিং'
        ],
        practical: 'ল্যান কেবল, রাউটার ও নেটওয়ার্ক টপোলজি প্র্যাকটিক্যাল ল্যাব ডেমো',
        tips: 'টপোলজি থেকে চিত্রভিত্তিক সৃজনশীল প্রশ্ন প্রতি বছর সব বোর্ডে কমন থাকে।'
      },
      {
        id: 'ch-3',
        num: '০৩',
        title: 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস',
        subtitle: 'Number Systems & Digital Logic Gates',
        iconName: 'Binary',
        color: '#f59e0b',
        bgGrad: 'rgba(245, 158, 11, 0.15)',
        cqMarks: '২টি CQ (২০ মার্কস) সম্ভাব্য',
        topics: [
          'পজিশনাল সংখ্যা পদ্ধতি রূপান্তর (বাইনারি, অক্টাল, ডেসিমাল, হেক্সাডেসিমাল)',
          'চিহ্নযুক্ত সংখ্যা ও ২-এর পরিপূরক (2\'s Complement) যোগ-বিয়োগ',
          'মৌলিক লজিক গেইট (AND, OR, NOT) ও সার্বজনীন গেইট (NAND, NOR)',
          'বিশেষ গেইট (XOR, XNOR) ও বুলিয়ান অ্যালজেবরা সরলীকরণ',
          'এনকোডার, ডিকোডার, হাফ এডার ও ফুল এডার সার্কিট ডিজাইন'
        ],
        practical: 'লজিক সার্কিট ড্রয়িং ও লাইভ টুথ-টেবিল ভেরিফিকেশন',
        tips: 'সংখ্যা পদ্ধতির শর্টকাট টেকনিক ও লজিক গেইটের সত্যক সারণী শতভাগ আয়ত্ত করানো হয়।'
      },
      {
        id: 'ch-4',
        num: '০৪',
        title: 'ওয়েব ডিজাইন পরিচিতি এবং HTML',
        subtitle: 'Web Design & HTML5 Structure',
        iconName: 'Code',
        color: '#10b981',
        bgGrad: 'rgba(16, 185, 129, 0.15)',
        cqMarks: '১টি পূর্ণাঙ্গ CQ (১০ মার্কস)',
        topics: [
          'ওয়েবপেজের ধারণা, ডোমেন নেম, ওয়েব হোস্টিং ও ওয়েবসাইট কাঠামো',
          'HTML বেসিক কাঠামো, ট্যাগ, অ্যাট্রিবিউট ও এলিমেন্ট',
          'টেবিল ডিজাইন (<table>, <tr>, <td>, colspan, rowspan)',
          'হাইপারলিংক (<a> ট্যাগ), ইমেজ ইনসার্ট (<img>) ও অর্ডার্ড/আন-অর্ডার্ড লিস্ট',
          'ফর্ম উপাদান (ইনপুট, রেডিও, চেকবক্স, সাবমিট বাটন)'
        ],
        practical: 'কম্পিউটার ল্যাবে প্রতিটি শিক্ষার্থীর নিজস্ব এইচটিএমএল পেজ তৈরি',
        tips: 'বোর্ড পরীক্ষায় সাধারণত টেবিল কোডিং অথবা লিস্ট/ইমেজ সংযোগের প্রশ্ন আসে।'
      },
      {
        id: 'ch-5',
        num: '০৫',
        title: 'প্রোগ্রামিং ভাষা (C Programming)',
        subtitle: 'Programming Languages & C Language',
        iconName: 'Terminal',
        color: '#ec4899',
        bgGrad: 'rgba(236, 72, 153, 0.15)',
        cqMarks: '১টি পূর্ণাঙ্গ CQ (১০ মার্কস)',
        topics: [
          'প্রোগ্রামিং ভাষার স্তর, অনুবাদক প্রোগ্রাম (কম্পাইলার, ইন্টারপ্রেটার)',
          'অ্যালগরিদম ও ফ্লোচার্ট (ধারাবাহিকতা, সিদ্ধান্ত ও লুপ)',
          'সি ভাষার ডেটা টাইপ, চলক, ধ্রুবক ও ইনপুট/আউটপুট (printf, scanf)',
          'কন্ডিশনাল স্টেটমেন্ট (if-else, switch-case) ও লিপ ইয়ার লজিক',
          'লুপ কন্ট্রোল (for, while, do-while), অ্যারে (Array) ও ফাংশন'
        ],
        practical: 'ল্যাপটপে Code::Blocks / GCC দিয়ে লাইভ সি কোড কম্পাইলেশন ও রান',
        tips: 'প্রোগ্রামিং মুখস্ত করা অসম্ভব; ক্লাসে লজিক বিল্ড-আপের মাধ্যমে কোড তৈরি শেখানো হয়।'
      },
      {
        id: 'ch-6',
        num: '০৬',
        title: 'ডেটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)',
        subtitle: 'Database Management Systems & SQL',
        iconName: 'Database',
        color: '#6366f1',
        bgGrad: 'rgba(99, 102, 241, 0.15)',
        cqMarks: '১টি পূর্ণাঙ্গ CQ প্রশ্ন',
        topics: [
          'ডেটাবেজ কনসেপ্ট, ফিল্ড, রেকর্ড, টেবিল ও ফাইল রিলেশন',
          'প্রাইমারি কি (Primary Key), কম্পোজিট কি ও ফরেন কি',
          'ডেটাবেজ রিলেশনশিপ (1:1, 1:Many, Many:Many)',
          'SQL কোয়েরি কমান্ড (SELECT, WHERE, ORDER BY, UPDATE, DELETE)',
          'ডেটা সিকিউরিটি, এনক্রিপশন ও ইনডেক্সিং এর গুরুত্ব'
        ],
        practical: 'প্র্যাকটিক্যাল SQL কুয়েরি ও রিলেশনাল ডেটা টেবিল প্র্যাকটিস',
        tips: 'SQL কুয়েরি লেখার নিয়ম এবং ডেটাবেজ রিলেশনের চিত্র আঁকা শিখলে পুরো নম্বর পাওয়া যায়।'
      }
    ]
  },

  // 5. Mentor Hero Showcase & Badges
  mentorHero: {
    image: '/m2.png',
    name: 'মারুফ হোসেন',
    role: 'AI Engineer | Blockchain Developer | Quantum Expert',
    badge1Title: 'মারুফ হোসেন',
    badge1Sub: 'প্রধান শিক্ষক ও প্রতিষ্ঠাতা',
    badge2Title: 'HSC ICT স্পেশালিস্ট',
    badge2Sub: '১০+ বছর সফল পাঠদান',
    badge3Title: '১,২০০+ শিক্ষার্থী A+',
    badge3Sub: '৫.০ রেটিং',
    badge4Title: 'সরাসরি ল্যাব ক্লাস',
    badge4Sub: 'ল্যাপটপ ও প্রজেক্টরে প্র্যাকটিস',
    chips: [
      '🤖 Artificial Intelligence',
      '⛓️ Blockchain & Web3',
      '⚛️ Quantum Computing',
      '🧠 Deep Learning & LLMs'
    ]
  },

  // 5. Mentor Detailed Profile Section
  mentorSection: {
    pill: '"ICT মুখস্ত নয়, এসো শিখি"',
    title: 'প্রযুক্তির যুগে মুখস্ত বিদ্যার কোনো স্থান নেই',
    bio: '"এইচএসসি পরীক্ষার সবচেয়ে আধুনিক ও গুরুত্বপূর্ণ বিষয় হচ্ছে তথ্য ও যোগাযোগ প্রযুক্তি (ICT)। কিন্তু অনেকেই সঠিক গাইডলাইনের অভাবে সি প্রোগ্রামিং কিংবা লজিক গেইট মুখস্ত করার চেষ্টা করে হতাশ হয়। আমাদের ক্লাসরুমে প্রতিটি টপিক ল্যাপটপ এবং মাল্টিমিডিয়া স্ক্রিনে জীবন্ত করে তোলা হয়, যাতে প্রতিটি শিক্ষার্থী আত্মবিশ্বাসের সাথে A+ অর্জন করতে পারে।"',
    bullets: [
      '১০+ বছরের অভিজ্ঞ ICT শিক্ষক ও সফটওয়্যার প্রফেশনাল',
      'সহজ ভাষায় লজিক বিল্ড-আপ ও প্রোগ্রামিং প্রশিক্ষণ কৌশল',
      'যেকোনো পরামর্শ বা পড়ালেখা সংক্রান্ত প্রয়োজনে সার্বক্ষণিক মেন্টরিং'
    ],
    phone: '01723619524',
    whatsapp: '8801723619524'
  },

  // 6. Testimonials
  testimonials: [
    {
      id: 1,
      name: 'তামিম ইকবাল',
      college: 'কুষ্টিয়া সরকারি কলেজ',
      score: 'ICT: ৯৮/১০০ (A+)',
      text: 'ICT-এর ৩য় ও ৫ম অধ্যায় নিয়ে সবাই বলত মুখস্ত করা কঠিন। মারুফ স্যারের ক্লাসে ল্যাপটপে সি কোডিং এবং ডিজিটাল লজিক গেইট প্র্যাকটিক্যালি দেখার পর ভয় একদম কেটে যায়। ফাইনাল পরীক্ষায় ৯৮ পেয়েছি!'
    },
    {
      id: 2,
      name: 'সুমাইয়া ফারহানা',
      college: 'কুষ্টিয়া সরকারি মহিলা কলেজ',
      score: 'ICT: ৯৬/১০০ (A+)',
      text: 'স্যারের কোচিংয়ের স্টুডেন্ট পোর্টালটা দারুণ! প্রতি ক্লাসের হাজিরা আর সাপ্তাহিক টেস্টের মার্কশীট মোবাইল দিয়েই দেখতে পেয়েছি। কোনো টপিক বুঝতে সমস্যা হলে স্যার আলাদা সময়ে বুঝিয়ে দিয়েছেন।'
    },
    {
      id: 3,
      name: 'আরিফুল ইসলাম',
      college: 'কুষ্টিয়া ইসলামিয়া কলেজ',
      score: 'ICT: ৯৫/১০০ (A+)',
      text: 'অধ্যায় ৪-এর HTML টেবিল আর অধ্যায় ৬-এর SQL কুয়েরি ক্লাসেই সম্পূর্ণ প্র্যাকটিস করানো হয়েছিল। বিগত ১০ বছরের বোর্ড প্রশ্ন সলভ করায় পরীক্ষার হলে সব প্রশ্ন হুবহু কমন পেয়েছি।'
    }
  ],

  // 7. FAQ Section
  faq: [
    {
      id: 1,
      question: 'আমার আগে কোনো কোডিং বা কম্পিউটার অভিজ্ঞতা নেই, আমি কি পারব?',
      answer: 'অবশ্যই! আমাদের কোর্সটি একদম জিরো লেভেল থেকে শুরু হয়। অ্যালগরিদম, ফ্লোচার্ট ও সি প্রোগ্রামিং এত সহজ উদাহরণ দিয়ে ক্লাসে ল্যাপটপে দেখানো হয় যে কোনো পূর্ব অভিজ্ঞতা ছাড়াই যে কেউ সহজেই বুঝতে পারে।'
    },
    {
      id: 2,
      question: 'স্টুডেন্ট পোর্টালে লগইন করার নিয়ম কী?',
      answer: 'কোনো জটিল আইডি বা পাসওয়ার্ডের ঝামেলা নেই। ভর্তি হওয়ার সময় যে মোবাইল নম্বর দিয়েছেন, সেই নম্বরটি দিয়েই উপরের "লগইন" বাটনে ক্লিক করে এক সেকেন্ডে লগইন করা যায়।'
    },
    {
      id: 3,
      question: 'কোনো ক্লাস মিস হয়ে গেলে কীভাবে কভার করব?',
      answer: 'অসুস্থতা বা পরীক্ষার কারণে কোনো ক্লাস মিস হলে আমাদের স্যারের সাথে কথা বলে ব্যাকআপ ক্লাসে বা অন্য ব্যাচের সাথে ক্লাসটি ফ্রিতে কভার করে নেওয়া যায়।'
    },
    {
      id: 4,
      question: 'ভর্তি হতে চাইলে কীভাবে আবেদন করব?',
      answer: 'আমাদের ওয়েবসাইটে "অনলাইন ভর্তি আবেদন" ফর্মে নাম ও ফোন নম্বর দিয়ে আবেদন করতে পারেন, অথবা কুষ্টিয়া সরকারি কলেজ গেটের ক্যাম্পাসে সরাসরি এসে ভর্তি হতে পারেন।'
    }
  ],

  // 8. Contact & Footer
  contact: {
    address: 'কুষ্টিয়া সরকারি কলেজ গেট, কুষ্টিয়া, বাংলাদেশ',
    phone: '+৮৮০ ১৭২৩-৬১৯৫২৪',
    phoneRaw: '01723619524',
    whatsapp: '8801723619524',
    hours: 'সকাল ৭:০০ - রাত ৮:০০ (প্রতিদিন খোলা)',
    copyright: "© 2026 Maruf's ICT Care. সর্বস্বত্ব সংরক্ষিত।",
    footerTagline: 'Designed for HSC ICT Students • ICT মুখস্ত নয়, এসো শিখি'
  }
};

// Default Landing Page Frontend Settings (English)
export const defaultFrontendSettings_EN = {
  // 1. Notice Bar
  notice: {
    enabled: true,
    badge: 'Special Announcement',
    text: '📢 Limited seats available for HSC 2026 & 2025 batches! Hands-on classroom lab support included.',
    btnText: 'Online Admission'
  },

  // 2. Branding & Tagline
  brand: {
    titlePrefix: "Maruf's",
    titleHighlight: "ICT Care",
    tagline: 'Do Not Memorize ICT, Let Us Learn Practically',
    logoUrl: '/logo.png'
  },

  // 3. Hero Section
  hero: {
    pillBadge: "Kushtia's Premier HSC ICT Learning Center",
    titleLine1: 'To Secure an A+ in HSC ICT',
    titleHighlight: 'Learn with Practical Tech, Not Rote Learning',
    subtitle: 'Information and Communication Technology is not a subject to memorize! Master C Programming, HTML Tables, Logic Gates, and SQL Database with interactive laptop lab sessions to achieve a full 100/100 on your board exams.',
    tags: [
      'Number Systems & Logic Gates',
      'HTML5 Web Design',
      'C Programming Lab',
      'SQL Database'
    ],
    primaryBtnText: 'Login Now',
    enrollBtnText: 'Online Admission Form',
    stat1: { number: 98, suffix: '%+', label: 'A+ Pass Rate in Board Exams' },
    stat2: { number: 1200, suffix: '+', label: 'Successful Students' },
    stat3: { number: 100, suffix: '%', label: 'Practical Lab Support' }
  },

  // 4. Curriculum & Chapters (HSC ICT 1 - 6)
  curriculum: {
    badge: 'Complete Board Curriculum',
    title: 'HSC ICT Complete Syllabus (Chapters 1 - 6)',
    subtitle: 'Complex concepts in each chapter are thoroughly prepared through intuitive and comprehensive analysis.',
    chapters: [
      {
        id: 'ch-1',
        num: '01',
        title: 'Information & Communication Technology: World & BD Perspective',
        subtitle: 'Global & Bangladesh Perspective',
        iconName: 'Globe',
        color: '#38bdf8',
        bgGrad: 'rgba(56, 189, 248, 0.15)',
        cqMarks: '10-15 Marks in Board Exam',
        topics: [
          'Virtual Reality (VR) & Augmented Reality (AR)',
          'Artificial Intelligence (AI) & Robotics Technology',
          'Cryosurgery & ICT Applications in Healthcare',
          'Biometrics, Bioinformatics & Genetic Engineering',
          'Nanotechnology & Cyber Security / Cyber Crime'
        ],
        practical: 'Modern Technology Video Demos & Projector Visualization',
        tips: 'Analytical and application-based board questions require real-world practical explanations.'
      },
      {
        id: 'ch-2',
        num: '02',
        title: 'Communication Systems & Networking',
        subtitle: 'Communication Systems & Networking',
        iconName: 'Cpu',
        color: '#a855f7',
        bgGrad: 'rgba(168, 85, 247, 0.15)',
        cqMarks: '1 Full Board CQ Guaranteed',
        topics: [
          'Data Transmission Methods (Sync, Async, Isochronous)',
          'Data Transmission Modes (Simplex, Half-Duplex, Full-Duplex)',
          'Communication Media (Twisted Pair, Coaxial & Fiber Optic)',
          'Wireless Media (WiFi, WiMAX, Bluetooth, Microwave)',
          'Network Topologies (Star, Bus, Ring, Tree, Mesh) & Cloud Computing'
        ],
        practical: 'LAN Cables, Routers & Network Topology Practical Lab Demo',
        tips: 'Diagram-based questions on network topologies are common in board exams every year.'
      },
      {
        id: 'ch-3',
        num: '03',
        title: 'Number Systems & Digital Logic Gates',
        subtitle: 'Number Systems & Digital Logic Gates',
        iconName: 'Binary',
        color: '#f59e0b',
        bgGrad: 'rgba(245, 158, 11, 0.15)',
        cqMarks: '2 Full CQs (20 Marks) Expected',
        topics: [
          'Positional Number Conversions (Binary, Octal, Decimal, Hex)',
          'Signed Numbers & 2\'s Complement Arithmetic',
          'Basic Logic Gates (AND, OR, NOT) & Universal Gates (NAND, NOR)',
          'Special Gates (XOR, XNOR) & Boolean Algebra Simplification',
          'Encoders, Decoders, Half Adder & Full Adder Circuit Design'
        ],
        practical: 'Logic Circuit Drawing & Live Truth-Table Verification',
        tips: 'Number conversion shortcut techniques and truth tables are thoroughly practiced.'
      },
      {
        id: 'ch-4',
        num: '04',
        title: 'Web Design & HTML5 Structure',
        subtitle: 'Web Design & HTML5 Structure',
        iconName: 'Code',
        color: '#10b981',
        bgGrad: 'rgba(16, 185, 129, 0.15)',
        cqMarks: '1 Full Board CQ (10 Marks)',
        topics: [
          'Web Concepts, Domain Names, Web Hosting & Website Structure',
          'HTML Structure, Tags, Attributes & Elements',
          'Table Design (<table>, <tr>, <td>, colspan, rowspan)',
          'Hyperlinks (<a> tag), Images (<img>) & Ordered/Unordered Lists',
          'HTML Form Elements (input, radio, checkbox, submit button)'
        ],
        practical: 'Each student codes and builds their own HTML webpage in computer lab',
        tips: 'Board exams almost always test Table coding or List/Image linking.'
      },
      {
        id: 'ch-5',
        num: '05',
        title: 'Programming Languages & C Language',
        subtitle: 'Programming Languages & C Language',
        iconName: 'Terminal',
        color: '#ec4899',
        bgGrad: 'rgba(236, 72, 153, 0.15)',
        cqMarks: '1 Full Board CQ (10 Marks)',
        topics: [
          'Programming Paradigms & Translators (Compiler, Interpreter)',
          'Algorithms & Flowcharts (Sequential, Decision & Loop)',
          'C Data Types, Variables, Constants & I/O (printf, scanf)',
          'Conditional Statements (if-else, switch-case) & Leap Year Logic',
          'Loop Control (for, while, do-while), Arrays & Functions'
        ],
        practical: 'Live C Code Compilation & Execution with Code::Blocks / GCC on Laptops',
        tips: 'Programming cannot be memorized; code generation is taught via logic building.'
      },
      {
        id: 'ch-6',
        num: '06',
        title: 'Database Management Systems & SQL',
        subtitle: 'Database Management Systems & SQL',
        iconName: 'Database',
        color: '#6366f1',
        bgGrad: 'rgba(99, 102, 241, 0.15)',
        cqMarks: '1 Full Board CQ Guaranteed',
        topics: [
          'Database Concepts, Fields, Records, Tables & File Relationships',
          'Primary Key, Composite Key & Foreign Key',
          'Database Relationships (1:1, 1:Many, Many:Many)',
          'SQL Query Commands (SELECT, WHERE, ORDER BY, UPDATE, DELETE)',
          'Data Security, Encryption & Indexing Importance'
        ],
        practical: 'Hands-on SQL Queries & Relational Data Table Practice in Lab',
        tips: 'Full marks are guaranteed by mastering SQL syntax and drawing relationship diagrams.'
      }
    ]
  },

  // 5. Mentor Hero Showcase & Badges
  mentorHero: {
    image: '/m2.png',
    name: 'Maruf Hossain',
    role: 'AI Engineer | Blockchain Developer | Quantum Expert',
    badge1Title: 'Maruf Hossain',
    badge1Sub: 'Lead Instructor & Founder',
    badge2Title: 'HSC ICT Specialist',
    badge2Sub: '10+ Years Teaching Excellence',
    badge3Title: '1,200+ Students A+',
    badge3Sub: '5.0 Star Rating',
    badge4Title: 'Hands-on Lab Classes',
    badge4Sub: 'Practiced on Laptops & Projectors',
    chips: [
      '🤖 Artificial Intelligence',
      '⛓️ Blockchain & Web3',
      '⚛️ Quantum Computing',
      '🧠 Deep Learning & LLMs'
    ]
  },

  // 5. Mentor Detailed Profile Section
  mentorSection: {
    pill: '"Do Not Memorize ICT, Learn Practically"',
    title: 'In the Age of Technology, Rote Learning Has No Place',
    bio: '"HSC ICT is the most modern and essential subject for future careers. Yet without proper guidance, many students struggle by attempting to memorize C code or logic gates. In our classroom, every concept comes alive on laptop screens and projectors, empowering every student to achieve an A+ with genuine confidence."',
    bullets: [
      '10+ years experienced ICT mentor & software engineering professional',
      'Intuitive logic-building and practical programming methodologies',
      '24/7 personalized academic mentorship and doubt resolution'
    ],
    phone: '+880 1723-619524',
    whatsapp: '8801723619524'
  },

  // 6. Testimonials
  testimonials: [
    {
      id: 1,
      name: 'Tamim Iqbal',
      college: 'Kushtia Govt. College',
      score: 'ICT: 98/100 (A+)',
      text: 'Everyone warned me chapters 3 and 5 were difficult to memorize. But after practicing C coding and digital logic gates on laptops with Maruf Sir, all fears vanished. I scored 98 in the board exams!'
    },
    {
      id: 2,
      name: 'Sumaiya Farhana',
      college: 'Kushtia Govt. Women College',
      score: 'ICT: 96/100 (A+)',
      text: 'The student portal is incredible! I could track my attendance and weekly exam scores right from my phone. Whenever I had difficulties, Sir provided 1-on-1 support.'
    },
    {
      id: 3,
      name: 'Ariful Islam',
      college: 'Kushtia Islamia College',
      score: 'ICT: 95/100 (A+)',
      text: 'Hands-on practice with HTML tables in Chapter 4 and SQL queries in Chapter 6 made all the difference. Solving 10 years of past board questions meant zero surprises in the final exam.'
    }
  ],

  // 7. FAQ Section
  faq: [
    {
      id: 1,
      question: 'I have no prior computer or coding experience. Can I succeed?',
      answer: 'Absolutely! Our curriculum starts from ground zero. Algorithms, flowcharts, and C programming are taught with simple real-life examples on live laptop displays so anyone can grasp them easily.'
    },
    {
      id: 2,
      question: 'How do I log in to the Student Portal?',
      answer: 'No complicated ID or password needed. Simply click the "Login" button above and enter the mobile number registered during your admission for 1-second instant access.'
    },
    {
      id: 3,
      question: 'What if I miss a scheduled class?',
      answer: 'If you miss a class due to illness or exam conflicts, you can easily attend a free backup session or join another batch by consulting the instructor.'
    },
    {
      id: 4,
      question: 'How do I apply for admission?',
      answer: 'You can submit the "Online Admission" form on this website or visit our physical campus at Kushtia Govt. College Gate directly.'
    }
  ],

  // 8. Contact & Footer
  contact: {
    address: 'Kushtia Govt. College Gate, Kushtia, Bangladesh',
    phone: '+880 1723-619524',
    phoneRaw: '01723619524',
    whatsapp: '8801723619524',
    hours: '7:00 AM - 8:00 PM (Open Daily)',
    copyright: "© 2026 Maruf's ICT Care. All rights reserved.",
    footerTagline: 'Designed for HSC ICT Students • Do Not Memorize ICT, Learn Practically'
  }
};

// Backward-compatible default alias
export const defaultFrontendSettings = defaultFrontendSettings_BN;

// Default Academic Batches for HSC ICT Coaching
export const DEFAULT_INITIAL_BATCHES = [
  {
    id: 'BAT-2026',
    name: 'HSC 2026 রেগুলার ব্যাচ',
    tagline: 'সম্পূর্ণ সিলেবাস বেসিক থেকে বোর্ড A+ প্রস্তুতি',
    days: 'শনি, সোম, বুধ',
    time: 'সকাল ৮:০০ ও বিকাল ৪:০০ (২টি স্লট)',
    seatLimit: 50,
    seatsLeft: '৪টি আসন খালি',
    status: 'ভর্তি চলছে',
    coverage: 'অধ্যায় ১-৬ + প্র্যাকটিক্যাল ল্যাব',
    featured: true
  },
  {
    id: 'BAT-2025',
    name: 'HSC 2025 রিভিশন ও টেস্ট পেপার সলভ',
    tagline: 'বিগত বছরের বোর্ড CQ-MCQ ও বিশেষ সাজেশন',
    days: 'রবি, মঙ্গল, বৃহস্পতি',
    time: 'সকাল ৯:০০ ও বিকাল ৫:০০ (২টি স্লট)',
    seatLimit: 50,
    seatsLeft: '৩টি আসন খালি',
    status: 'সীমিত আসন',
    coverage: 'অধ্যায় ১-৬ + প্র্যাকটিক্যাল ল্যাব',
    featured: false
  },
  {
    id: 'BAT-2027',
    name: 'HSC 2027 ফাউন্ডেশন কোর্স',
    tagline: 'আইসিটি শুরু থেকেই সহজ ও আনন্দময় করার ব্যাচ',
    days: 'শনি, সোম, বুধ',
    time: 'সকাল ১০:০০ টা',
    seatLimit: 50,
    seatsLeft: '৮টি আসন খালি',
    status: 'ভর্তি চলছে',
    coverage: 'অধ্যায় ১-৬ + প্র্যাকটিক্যাল ল্যাব',
    featured: false
  }
];

export const dataStore = {
  // --- BACKEND SYNCHRONIZATION ---
  async syncWithBackend() {
    try {
      const [
        batches,
        students,
        payments,
        attendance,
        exams,
        expenses,
        staff,
        settings,
        onlineAdmissions
      ] = await Promise.all([
        api.getBatches().catch(() => null),
        api.getStudents().catch(() => null),
        api.getPayments().catch(() => null),
        api.getAttendance().catch(() => null),
        api.getExams().catch(() => null),
        api.getExpenses().catch(() => null),
        api.getStaff().catch(() => null),
        api.getSettings().catch(() => null),
        api.getOnlineAdmissions().catch(() => null),
      ]);

      if (batches && Array.isArray(batches)) {
        localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
      }
      if (students && Array.isArray(students)) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      }
      if (payments && Array.isArray(payments)) {
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
      }
      if (attendance && typeof attendance === 'object') {
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
      }
      if (exams && Array.isArray(exams)) {
        localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
      }
      if (expenses && Array.isArray(expenses)) {
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
      }
      if (staff && Array.isArray(staff)) {
        localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
      }
      if (settings && typeof settings === 'object') {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      }
      if (onlineAdmissions && Array.isArray(onlineAdmissions)) {
        localStorage.setItem(STORAGE_KEYS.PENDING_ADMISSIONS, JSON.stringify(onlineAdmissions));
        localStorage.setItem('pendingStudents', JSON.stringify(onlineAdmissions));
      }

      // Automatically evaluate and update student statuses for overdue (> 2 days)
      this.checkAndUpdateOverdueStudents();

      notifyChange();
      console.log('[DataStore] Successfully synced with Laravel backend (MySQL)');
      return true;
    } catch (err) {
      console.warn('[DataStore] Backend sync failed, using offline cache:', err.message);
      return false;
    }
  },

  // --- BATCHES ---
  getEnrollmentUrl(batchName) {
    if (!batchName) return '';
    const origin = typeof window !== 'undefined' && window.location && window.location.origin 
      ? window.location.origin 
      : 'http://localhost:5173';
    return `${origin}/#/enroll/${encodeURIComponent(batchName.trim())}`;
  },

  getBatches() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BATCHES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((b, idx) => {
            const name = typeof b === 'string' ? b.trim() : (b.name ? b.name.trim() : '');
            return {
              id: b.id || `BAT-${Math.random().toString().slice(2, 6)}`,
              name,
              enrollUrl: this.getEnrollmentUrl(name),
              days: (b && b.days) || (idx % 2 === 0 ? 'শনি, সোম, বুধ' : 'রবি, মঙ্গল, বৃহস্পতি'),
              time: (b && b.time) || (idx === 0 ? 'সকাল ৮:০০ ও বিকাল ৪:০০ (২টি স্লট)' : 'সকাল ৯:০০ ও বিকাল ৫:০০ (২টি স্লট)'),
              tagline: (b && b.tagline) || 'সম্পূর্ণ সিলেবাস বেসিক থেকে বোর্ড A+ প্রস্তুতি',
              seatLimit: Number(b && b.seatLimit) || 50,
              seatsLeft: (b && b.seatsLeft) || '',
              status: (b && b.status) || 'ভর্তি চলছে',
              coverage: (b && b.coverage) || 'অধ্যায় ১-৬ + প্র্যাকটিক্যাল ল্যাব',
              featured: b && b.featured !== undefined ? Boolean(b.featured) : (idx === 0)
            };
          });
        }
      }
    } catch (e) {}
    return DEFAULT_INITIAL_BATCHES.map(b => ({
      ...b,
      enrollUrl: this.getEnrollmentUrl(b.name)
    }));
  },

  saveBatches(batches) {
    const cleaned = batches.map(b => ({
      id: b.id,
      name: (b.name || '').trim(),
      days: (b.days || '').trim(),
      time: (b.time || '').trim(),
      tagline: (b.tagline || '').trim(),
      seatLimit: Number(b.seatLimit) || 50,
      seatsLeft: (b.seatsLeft || '').trim(),
      status: b.status || 'ভর্তি চলছে',
      coverage: b.coverage || 'অধ্যায় ১-৬ + প্র্যাকটিক্যাল ল্যাব',
      featured: Boolean(b.featured)
    }));
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(cleaned));
    notifyChange();
  },

  addBatch(batchInput) {
    const batches = this.getBatches();
    const isObj = typeof batchInput === 'object' && batchInput !== null;
    const batchName = isObj 
      ? (batchInput.name ? batchInput.name.trim() : '') 
      : (typeof batchInput === 'string' ? batchInput.trim() : '');
    if (!batchName) return null;

    const newBatch = {
      id: (isObj && batchInput.id) || `BAT-${Date.now().toString().slice(-4)}`,
      name: batchName,
      days: (isObj && batchInput.days && batchInput.days.trim()) || 'শনি, সোম, বুধ',
      time: (isObj && batchInput.time && batchInput.time.trim()) || 'সকাল ১০:০০ টা',
      tagline: (isObj && batchInput.tagline && batchInput.tagline.trim()) || 'সম্পূর্ণ সিলেবাস বেসিক থেকে বোর্ড A+ প্রস্তুতি',
      seatLimit: Number(isObj && batchInput.seatLimit) || 50,
      seatsLeft: (isObj && batchInput.seatsLeft && batchInput.seatsLeft.trim()) || '',
      status: (isObj && batchInput.status) || 'ভর্তি চলছে',
      coverage: (isObj && batchInput.coverage) || 'অধ্যায় ১-৬ + প্র্যাকটিক্যাল ল্যাব',
      featured: isObj && batchInput.featured !== undefined ? Boolean(batchInput.featured) : false
    };
    const updated = [...batches, newBatch];
    this.saveBatches(updated);

    // Sync to Laravel API in background
    api.createBatch(batchName)
      .then(res => {
        if (res && res.id) {
          const fresh = this.getBatches().map(b => b.name === batchName ? { ...b, id: res.id } : b);
          localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(fresh));
          notifyChange();
        }
      })
      .catch(e => console.error('[API Batch Error]', e));

    return newBatch;
  },

  updateBatch(id, updatedData) {
    const batches = this.getBatches();
    const isObj = typeof updatedData === 'object' && updatedData !== null;
    const newName = isObj 
      ? (updatedData.name ? updatedData.name.trim() : '') 
      : (typeof updatedData === 'string' ? updatedData.trim() : '');

    const updated = batches.map(b => {
      if (b.id === id || b.name === id) {
        if (isObj) {
          return {
            ...b,
            ...updatedData,
            name: newName || b.name,
            seatLimit: Number(updatedData.seatLimit) || b.seatLimit || 50
          };
        }
        return { ...b, name: newName || b.name };
      }
      return b;
    });
    this.saveBatches(updated);

    api.updateBatch(id, newName || id).catch(e => console.error('[API Batch Update Error]', e));
  },

  deleteBatch(id) {
    const batches = this.getBatches();
    const target = batches.find(b => b.id === id || b.name === id);
    const updated = batches.filter(b => b.id !== id && b.name !== id);
    this.saveBatches(updated);

    if (target) {
      this.deleteEnrollmentLink(target.id);
      this.deleteEnrollmentLink(target.name);
    }

    api.deleteBatch(id).catch(e => console.error('[API Batch Delete Error]', e));
  },

  // --- ENROLLMENT LINKS ---
  getEnrollmentLinks() {
    const batches = this.getBatches();
    const origin = typeof window !== 'undefined' && window.location && window.location.origin 
      ? window.location.origin 
      : 'http://localhost:5173';

    let customLinks = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENROLLMENT_LINKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) customLinks = parsed;
      }
    } catch (e) {}

    // Every batch in dataStore ALWAYS has an auto-generated active enrollment link
    const autoLinks = batches.map((b, idx) => ({
      id: b.id || `link-${idx}-${b.name}`,
      batch: b.name,
      url: `${origin}/#/enroll/${encodeURIComponent(b.name)}`,
      isAuto: true
    }));

    // Merge: maintain unique batch entries, keeping batch autoLinks primary
    const map = new Map();
    autoLinks.forEach(l => map.set(l.batch, l));
    customLinks.forEach(c => {
      if (c && c.batch && !map.has(c.batch)) {
        map.set(c.batch, c);
      }
    });

    return Array.from(map.values());
  },

  saveEnrollmentLinks(links) {
    localStorage.setItem(STORAGE_KEYS.ENROLLMENT_LINKS, JSON.stringify(links));
    notifyChange();
  },

  createEnrollmentLink(batchName) {
    if (!batchName || !batchName.trim()) return null;
    const origin = typeof window !== 'undefined' && window.location && window.location.origin 
      ? window.location.origin 
      : 'http://localhost:5173';
    const name = batchName.trim();
    const url = `${origin}/#/enroll/${encodeURIComponent(name)}`;
    const current = this.getEnrollmentLinks();
    const existing = current.find(l => l.batch === name);
    if (existing) return existing;

    const newLink = {
      id: `link-${Date.now()}`,
      batch: name,
      url,
      isAuto: false
    };
    const updated = [newLink, ...current];
    this.saveEnrollmentLinks(updated);
    return newLink;
  },

  deleteEnrollmentLink(id) {
    let current = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENROLLMENT_LINKS);
      if (saved) current = JSON.parse(saved);
      if (!Array.isArray(current)) current = [];
    } catch (e) {}
    const filtered = current.filter(l => l.id !== id && l.batch !== id);
    localStorage.setItem(STORAGE_KEYS.ENROLLMENT_LINKS, JSON.stringify(filtered));
    notifyChange();
  },

  // --- STUDENTS ---
  getStudents() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  },

  saveStudents(students) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    notifyChange();
  },

  addStudent(student) {
    const students = this.getStudents();
    const initials = student.name ? student.name.trim().substring(0, 2).toUpperCase() : 'ST';
    const newStudent = {
      id: student.id || `STU-${Math.floor(10000 + Math.random() * 90000)}`,
      name: student.name.trim(),
      initials,
      batch: student.batch || 'Unassigned',
      status: student.status || 'Active',
      phone: student.phone || '',
      guardianPhone: student.guardianPhone || '',
      feeType: student.feeType || 'monthly',
      feeAmount: Number(student.feeAmount) || 0,
      admissionFee: Number(student.admissionFee) || 0,
      discount: Number(student.discount) || 0,
      installments: Number(student.installments) || 1,
      paidAmount: Number(student.paidAmount) || 0,
      billingDate: student.feeType === 'monthly' ? '1st of every month' : null,
      nextInstallmentDate: student.feeType === 'course' ? student.nextInstallmentDate || '01/11/2026' : null,
      admissionDate: student.admissionDate || new Date().toLocaleDateString('en-GB')
    };
    const updated = [newStudent, ...students];
    this.saveStudents(updated);

    // Sync to Laravel API
    api.createStudent({
      id: newStudent.id,
      name: newStudent.name,
      phone: newStudent.phone,
      guardianPhone: newStudent.guardianPhone,
      batch: newStudent.batch,
      feeType: newStudent.feeType,
      feeAmount: newStudent.feeAmount,
      admissionFee: newStudent.admissionFee,
      discount: newStudent.discount,
      installments: newStudent.installments,
      paidAmount: newStudent.paidAmount,
      status: newStudent.status,
      admissionDate: newStudent.admissionDate
    }).catch(e => console.error('[API Add Student Error]', e));

    return newStudent;
  },

  updateStudent(id, updatedData) {
    const students = this.getStudents();
    const updated = students.map(s => {
      if (s.id === id) {
        const initials = updatedData.name ? updatedData.name.trim().substring(0, 2).toUpperCase() : s.initials;
        return { ...s, ...updatedData, initials };
      }
      return s;
    });
    this.saveStudents(updated);

    api.updateStudent(id, updatedData).catch(e => console.error('[API Update Student Error]', e));
  },

  deleteStudent(id) {
    const students = this.getStudents();
    const updated = students.filter(s => s.id !== id);
    this.saveStudents(updated);

    api.deleteStudent(id).catch(e => console.error('[API Delete Student Error]', e));
  },

  // --- PAYMENTS ---
  getPayments() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  },

  savePayments(payments) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    notifyChange();
  },

  recordPayment({ studentId, amount, method, collectedBy, note, date, time }) {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    const numericAmount = Number(amount) || 0;
    if (numericAmount <= 0) return null;

    const payments = this.getPayments();
    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: student.id,
      studentName: student.name,
      batch: student.batch,
      amount: numericAmount,
      feeType: student.feeType,
      method: method || 'Cash',
      collectedBy: collectedBy || 'Admin',
      date: date || new Date().toLocaleDateString('en-GB'),
      time: time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      note: note || `${student.feeType === 'monthly' ? 'Monthly Fee' : 'Course Fee Installment'}`
    };

    // Update student paid amount & clear attendance suspension (student remains Active throughout)
    let updatedStudentRef = null;
    const updatedStudents = students.map(s => {
      if (s.id === studentId) {
        const newPaid = (Number(s.paidAmount) || 0) + numericAmount;
        updatedStudentRef = {
          ...s,
          paidAmount: newPaid,
          status: 'Active',           // Ensure Active regardless
          attendanceSuspended: false, // Lift attendance suspension immediately!
          attendanceSuspendedReason: null,
          autoInactive: false,
          inactiveReason: null
        };
        return updatedStudentRef;
      }
      return s;
    });

    this.saveStudents(updatedStudents);

    // Re-run overdue check so suspension flag is recalculated fresh after payment
    // (async, so UI reflects immediately via notifyChange above)
    setTimeout(() => this.checkAndUpdateOverdueStudents(), 100);

    // Sync status to Laravel API
    if (updatedStudentRef) {
      api.updateStudent(studentId, { status: 'Active', attendanceSuspended: false }).catch(e => console.error('[API Payment Clear Error]', e));
    }

    const updatedPayments = [newTxn, ...payments];
    this.savePayments(updatedPayments);

    // Sync to Laravel API
    api.createPayment({
      id: newTxn.id,
      studentId: student.id,
      studentName: student.name,
      batch: student.batch,
      amount: numericAmount,
      method: newTxn.method,
      collectedBy: newTxn.collectedBy,
      date: newTxn.date,
      time: newTxn.time,
      note: newTxn.note
    }).catch(e => console.error('[API Record Payment Error]', e));

    return newTxn;
  },

  // --- ATTENDANCE ---
  getAttendance() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {};
  },

  getAttendanceForDateAndBatch(date, batch) {
    const all = this.getAttendance();
    const key = `${date}_${batch}`;
    return all[key] || {};
  },

  saveAttendanceForDateAndBatch(date, batch, records) {
    const all = this.getAttendance();
    const key = `${date}_${batch}`;
    all[key] = records;
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(all));
    notifyChange();

    // Sync to Laravel API
    api.saveAttendance(date, batch, records).catch(e => console.error('[API Save Attendance Error]', e));
  },

  getStudentAttendanceStats(studentId) {
    const all = this.getAttendance();
    let present = 0, absent = 0, late = 0, leave = 0, total = 0;
    Object.values(all).forEach(batchRecord => {
      if (batchRecord[studentId]) {
        total++;
        const status = batchRecord[studentId];
        if (status === 'Present') present++;
        else if (status === 'Absent') absent++;
        else if (status === 'Late') late++;
        else if (status === 'Leave') leave++;
      }
    });
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { present, absent, late, leave, total, percentage };
  },

  // --- EXAMS ---
  getExams() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXAMS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  },

  saveExams(exams) {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
    notifyChange();
  },

  addExam(exam) {
    const exams = this.getExams();
    const newExam = {
      id: `EXM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: exam.name.trim(),
      batch: exam.batch || 'All Batches',
      subject: exam.subject.trim(),
      date: exam.date || new Date().toISOString().substring(0, 10),
      totalMarks: Number(exam.totalMarks) || 50,
      passMarks: Number(exam.passMarks) || 40,
      marks: {}
    };
    const updated = [newExam, ...exams];
    this.saveExams(updated);

    api.createExam({
      name: newExam.name,
      batch: newExam.batch,
      subject: newExam.subject,
      date: newExam.date,
      totalMarks: newExam.totalMarks,
      passMarks: newExam.passMarks
    }).then(res => {
      if (res && res.id) {
        const fresh = this.getExams().map(e => e.id === newExam.id ? { ...e, id: res.id, db_id: res.db_id } : e);
        this.saveExams(fresh);
      }
    }).catch(e => console.error('[API Create Exam Error]', e));

    return newExam;
  },

  saveExamMarks(examId, marks) {
    const exams = this.getExams();
    const updated = exams.map(e => e.id === examId ? { ...e, marks: { ...e.marks, ...marks } } : e);
    this.saveExams(updated);

    api.saveExamMarks(examId, marks).catch(e => console.error('[API Save Exam Marks Error]', e));
  },

  deleteExam(id) {
    const exams = this.getExams();
    const updated = exams.filter(e => e.id !== id);
    this.saveExams(updated);

    api.deleteExam(id).catch(e => console.error('[API Delete Exam Error]', e));
  },

  // --- EXPENSES ---
  getExpenses() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  },

  saveExpenses(expenses) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    notifyChange();
  },

  addExpense(expense) {
    const expenses = this.getExpenses();
    const newExp = {
      id: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: expense.title.trim(),
      amount: Number(expense.amount) || 0,
      category: expense.category || 'General',
      date: expense.date || new Date().toISOString().substring(0, 10)
    };
    const updated = [newExp, ...expenses];
    this.saveExpenses(updated);

    api.createExpense({
      title: newExp.title,
      amount: newExp.amount,
      category: newExp.category,
      date: newExp.date
    }).then(res => {
      if (res && res.id) {
        const fresh = this.getExpenses().map(ex => ex.id === newExp.id ? { ...ex, id: res.id } : ex);
        this.saveExpenses(fresh);
      }
    }).catch(e => console.error('[API Create Expense Error]', e));

    return newExp;
  },

  deleteExpense(id) {
    const expenses = this.getExpenses();
    const updated = expenses.filter(e => e.id !== id);
    this.saveExpenses(updated);

    api.deleteExpense(id).catch(e => console.error('[API Delete Expense Error]', e));
  },

  // --- STAFF ---
  getStaff() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STAFF);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  },

  saveStaff(staff) {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
    notifyChange();
  },

  addStaff(member) {
    const staff = this.getStaff();
    const newMember = {
      id: Date.now(),
      name: member.name.trim(),
      phone: member.phone.trim(),
      role: member.role || 'Manager',
      status: 'Active'
    };
    const updated = [newMember, ...staff];
    this.saveStaff(updated);

    api.createStaff({
      name: newMember.name,
      phone: newMember.phone,
      role: newMember.role,
      status: newMember.status
    }).catch(e => console.error('[API Add Staff Error]', e));

    return newMember;
  },

  deleteStaff(id) {
    const staff = this.getStaff();
    const updated = staff.filter(s => s.id !== id);
    this.saveStaff(updated);

    api.deleteStaff(id).catch(e => console.error('[API Delete Staff Error]', e));
  },

  // --- SETTINGS ---
  getSettings() {
    const defaultSettings = {
      coachingName: "Maruf's ICT Care",
      phone: '01723619524',
      address: 'Kushtia Govt. College Gate, Kushtia',
      tagline: "Don't Memorise, Come To Learn",
      currency: '৳',
      adminPassword: 'admin'
    };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        if (typeof parsed === 'object') return { ...defaultSettings, ...parsed };
      }
    } catch (e) {}
    return defaultSettings;
  },

  saveSettings(settings) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    notifyChange();

    api.updateSettings(updated).catch(e => console.error('[API Save Settings Error]', e));
    return updated;
  },

  // --- FRONTEND LANDING PAGE CMS SETTINGS (Single Unified Content Store) ---
  getFrontendSettings() {
    const defaults = defaultFrontendSettings_BN;
    try {
      let data = localStorage.getItem(STORAGE_KEYS.FRONTEND);
      if (!data) {
        data = localStorage.getItem(STORAGE_KEYS.FRONTEND_BN);
      }

      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === 'object') {
          return {
            ...defaults,
            ...parsed,
            notice: { ...defaults.notice, ...(parsed.notice || {}) },
            brand: { ...defaults.brand, ...(parsed.brand || {}) },
            hero: { 
              ...defaults.hero, 
              ...(parsed.hero || {}),
              tags: Array.isArray(parsed.hero?.tags) ? parsed.hero.tags : defaults.hero.tags,
              stat1: { ...defaults.hero.stat1, ...(parsed.hero?.stat1 || {}) },
              stat2: { ...defaults.hero.stat2, ...(parsed.hero?.stat2 || {}) },
              stat3: { ...defaults.hero.stat3, ...(parsed.hero?.stat3 || {}) }
            },
            mentorHero: { 
              ...defaults.mentorHero, 
              ...(parsed.mentorHero || {}),
              chips: Array.isArray(parsed.mentorHero?.chips) ? parsed.mentorHero.chips : defaults.mentorHero.chips
            },
            mentorSection: { 
              ...defaults.mentorSection, 
              ...(parsed.mentorSection || {}),
              bullets: Array.isArray(parsed.mentorSection?.bullets) ? parsed.mentorSection.bullets : defaults.mentorSection.bullets
            },
            curriculum: {
              ...defaults.curriculum,
              ...(parsed.curriculum || {}),
              chapters: Array.isArray(parsed.curriculum?.chapters) && parsed.curriculum.chapters.length > 0
                ? parsed.curriculum.chapters
                : defaults.curriculum.chapters
            },
            contact: { ...defaults.contact, ...(parsed.contact || {}) },
            testimonials: Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0 
              ? parsed.testimonials 
              : defaults.testimonials,
            faq: Array.isArray(parsed.faq) && parsed.faq.length > 0 
              ? parsed.faq 
              : defaults.faq
          };
        }
      }
    } catch (e) {
      console.warn('[dataStore] Failed to read frontend settings', e);
    }
    return JSON.parse(JSON.stringify(defaults));
  },

  saveFrontendSettings(newSettings) {
    const current = this.getFrontendSettings();
    const updated = {
      ...current,
      ...newSettings,
      notice: { ...current.notice, ...(newSettings.notice || {}) },
      brand: { ...current.brand, ...(newSettings.brand || {}) },
      hero: { 
        ...current.hero, 
        ...(newSettings.hero || {}),
        tags: Array.isArray(newSettings.hero?.tags) ? newSettings.hero.tags : current.hero.tags,
        stat1: { ...current.hero.stat1, ...(newSettings.hero?.stat1 || {}) },
        stat2: { ...current.hero.stat2, ...(newSettings.hero?.stat2 || {}) },
        stat3: { ...current.hero.stat3, ...(newSettings.hero?.stat3 || {}) }
      },
      curriculum: {
        ...current.curriculum,
        ...(newSettings.curriculum || {}),
        chapters: Array.isArray(newSettings.curriculum?.chapters)
          ? newSettings.curriculum.chapters
          : current.curriculum.chapters
      },
      mentorHero: { 
        ...current.mentorHero, 
        ...(newSettings.mentorHero || {}),
        chips: Array.isArray(newSettings.mentorHero?.chips) ? newSettings.mentorHero.chips : current.mentorHero.chips
      },
      mentorSection: { 
        ...current.mentorSection, 
        ...(newSettings.mentorSection || {}),
        bullets: Array.isArray(newSettings.mentorSection?.bullets) ? newSettings.mentorSection.bullets : current.mentorSection.bullets
      },
      contact: { ...current.contact, ...(newSettings.contact || {}) },
      testimonials: Array.isArray(newSettings.testimonials) ? newSettings.testimonials : current.testimonials,
      faq: Array.isArray(newSettings.faq) ? newSettings.faq : current.faq
    };
    try {
      localStorage.setItem(STORAGE_KEYS.FRONTEND, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEYS.FRONTEND_BN, JSON.stringify(updated));
    } catch (e) {
      console.error('[dataStore] Failed to save frontend settings', e);
    }
    notifyChange();
    return updated;
  },

  resetFrontendSettings() {
    const defaults = defaultFrontendSettings_BN;
    try {
      localStorage.setItem(STORAGE_KEYS.FRONTEND, JSON.stringify(defaults));
      localStorage.setItem(STORAGE_KEYS.FRONTEND_BN, JSON.stringify(defaults));
    } catch (e) {
      console.error('[dataStore] Failed to reset frontend settings', e);
    }
    notifyChange();
    return JSON.parse(JSON.stringify(defaults));
  },

  // --- ONLINE ADMISSIONS ---
  getPendingAdmissions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PENDING_ADMISSIONS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  },

  savePendingAdmissions(admissions) {
    localStorage.setItem(STORAGE_KEYS.PENDING_ADMISSIONS, JSON.stringify(admissions));
    localStorage.setItem('pendingStudents', JSON.stringify(admissions));
    notifyChange();
  },

  addPendingAdmission(appData) {
    const current = this.getPendingAdmissions();
    const updated = [appData, ...current];
    this.savePendingAdmissions(updated);

    api.createOnlineAdmission(appData).catch(e => console.error('[API Online Admission Error]', e));
  },

  deletePendingAdmission(id) {
    const current = this.getPendingAdmissions();
    const updated = current.filter(a => a.id !== id);
    this.savePendingAdmissions(updated);

    api.deleteOnlineAdmission(id).catch(e => console.error('[API Delete Admission Error]', e));
  },

  // --- LANGUAGE MANAGEMENT ---
  getLanguage() {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'BN';
  },

  setLanguage(lang) {
    const selected = (lang === 'EN') ? 'EN' : 'BN';
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, selected);
    notifyChange();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('coaching-language-change', { detail: selected }));
    }
    return selected;
  },

  // --- CALCULATIONS & STATS ---
  calculateDue(student) {
    const totalFee = Number(student.feeAmount) || 0;
    const paid = Number(student.paidAmount) || 0;
    const dueAmount = Math.max(0, totalFee - paid);
    const isDue = dueAmount > 0;
    return { dueAmount, isDue };
  },

  // Centralized Smart Notification Engine
  getNotifications(refDate = new Date()) {
    // Check all enrolled students for dues (both Active and attendance-suspended)
    const students = this.getStudents();
    const payments = this.getPayments();
    const pendingAdmissions = this.getPendingAdmissions();
    const now = refDate instanceof Date ? refDate : new Date();

    // 1. ONLINE ADMISSION NOTIFICATIONS (নতুন অনলাইন এডমিশন রিকুয়েস্ট)
    const onlineAdmissions = pendingAdmissions.map(adm => ({
      id: `adm-${adm.id || Math.random().toString().slice(2, 7)}`,
      type: 'online_admission',
      titleEn: 'New Online Admission Request',
      titleBn: 'নতুন অনলাইন ভর্তি আবেদন এসেছে',
      applicantName: adm.name,
      phone: adm.phone,
      guardianPhone: adm.guardianPhone,
      batch: adm.preferredBatch || adm.batch || 'Unassigned',
      date: adm.date || new Date().toLocaleDateString('en-GB'),
      status: adm.status || 'Pending',
      raw: adm
    }));

    // 2. COURSE SYSTEM: 1 month after payment (or admission) next installment due
    // (পেমেন্ট করা একমাস হয়ে গেলেই পরবর্তী পেমেন্ট নোটিফিকেশন আসবে কোর্স সিস্টেম এ যারা ভর্তি হবে তাদের)
    const courseDues = [];

    // 3. MONTHLY SYSTEM: Monthly fee dues
    // (প্রতি মাসে যাদের বেতন ডিও আসবে তাদের মেনশন করে নোটিফিকেশন আসবে)
    const monthlyDues = [];

    students.forEach(student => {
      const isCourse = student.feeType === 'course';
      const totalFee = Number(student.feeAmount) || 0;
      const paid = Number(student.paidAmount) || 0;
      const dueAmount = Math.max(0, totalFee - paid);

      if (isCourse) {
        if (dueAmount > 0) {
          // Find student payments sorted by date descending
          const stuPayments = payments
            .filter(p => p.studentId === student.id || p.studentName === student.name)
            .sort((a, b) => {
              const dA = parseDateString(a.date) || new Date(0);
              const dB = parseDateString(b.date) || new Date(0);
              return dB.getTime() - dA.getTime();
            });

          let referenceDateStr = null;
          let lastPaymentAmount = null;

          if (stuPayments.length > 0) {
            referenceDateStr = stuPayments[0].date;
            lastPaymentAmount = stuPayments[0].amount;
          } else if (student.admissionDate) {
            referenceDateStr = student.admissionDate;
          }

          const lastDateObj = parseDateString(referenceDateStr);
          let daysElapsed = 0;
          let isOneMonthElapsed = false;

          if (lastDateObj) {
            daysElapsed = Math.floor((now.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));
            const oneMonthLater = new Date(lastDateObj.getTime());
            oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
            if (now >= oneMonthLater || daysElapsed >= 30) {
              isOneMonthElapsed = true;
            }
          } else {
            isOneMonthElapsed = true;
            daysElapsed = 30;
          }

          // Check if specific next installment date is provided and reached
          if (student.nextInstallmentDate) {
            const nextDate = parseDateString(student.nextInstallmentDate);
            if (nextDate && now >= nextDate) {
              isOneMonthElapsed = true;
            }
          }

          if (isOneMonthElapsed) {
            const totalInstallments = Number(student.installments) || 2;
            const remainingInstallments = Math.max(1, totalInstallments - stuPayments.length);
            const installmentAmount = Math.round(dueAmount / remainingInstallments);

            courseDues.push({
              id: `course-${student.id}`,
              type: 'course_installment',
              titleEn: 'Course Fee Next Installment Due (1 Month Passed)',
              titleBn: 'কোর্স ফি পরবর্তী কিস্তি প্রদানের সময় হয়েছে (১ মাস পূর্ণ)',
              studentId: student.id,
              studentName: student.name,
              batch: student.batch,
              phone: student.phone,
              guardianPhone: student.guardianPhone,
              totalFee,
              paidAmount: paid,
              dueAmount,
              installmentAmount,
              lastPaymentDate: referenceDateStr || 'ভর্তির তারিখ',
              lastPaymentAmount,
              daysElapsed,
              installmentsCount: totalInstallments,
              installmentsPaid: stuPayments.length,
              studentObj: student
            });
          }
        }
      } else {
        // Monthly tuition fee
        // Find payments made by this student
        const stuPayments = payments.filter(p => p.studentId === student.id || p.studentName === student.name);
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Check if student has paid in the current month
        const paidThisMonth = stuPayments.some(p => {
          const pDate = parseDateString(p.date);
          return pDate && pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear;
        });

        // Student has monthly due if unpaid balance exists OR hasn't paid for the current month
        const hasMonthlyDue = dueAmount > 0 || !paidThisMonth;
        const currentMonthDueAmount = dueAmount > 0 ? dueAmount : totalFee;

        if (hasMonthlyDue) {
          monthlyDues.push({
            id: `monthly-${student.id}`,
            type: 'monthly_due',
            titleEn: 'Monthly Tuition Fee Due Alert',
            titleBn: 'মাসিক কোচিং ফি বকেয়া রয়েছে',
            studentId: student.id,
            studentName: student.name,
            batch: student.batch,
            phone: student.phone,
            guardianPhone: student.guardianPhone,
            monthlyFee: totalFee,
            paidAmount: paid,
            dueAmount: currentMonthDueAmount,
            admissionDate: student.admissionDate,
            studentObj: student
          });
        }
      }
    });

    const totalCount = onlineAdmissions.length + courseDues.length + monthlyDues.length;

    return {
      all: [...onlineAdmissions, ...courseDues, ...monthlyDues],
      onlineAdmissions,
      courseDues,
      monthlyDues,
      totalCount,
      admissionCount: onlineAdmissions.length,
      courseCount: courseDues.length,
      monthlyCount: monthlyDues.length
    };
  },

  getStats() {
    const students = this.getStudents();
    const payments = this.getPayments();
    const batches = this.getBatches();
    const expenses = this.getExpenses();
    const attendance = this.getAttendance();

    const activeStudents = students.filter(s => s.status === 'Active');
    
    // Collected this month
    const totalCollected = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // Total Due
    let totalDues = 0;
    let dueCount = 0;
    students.forEach(s => {
      const { dueAmount, isDue } = this.calculateDue(s);
      if (isDue) {
        totalDues += dueAmount;
        dueCount++;
      }
    });

    // Attendance Avg calculation
    let totalAttRecords = 0;
    let presentCount = 0;
    Object.values(attendance).forEach(record => {
      Object.values(record).forEach(status => {
        totalAttRecords++;
        if (status === 'Present' || status === 'Late') presentCount++;
      });
    });
    const attendanceAvg = totalAttRecords > 0 ? Math.round((presentCount / totalAttRecords) * 100) + '%' : '92%';

    // Total Expenses
    const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

    const notifs = this.getNotifications();

    return {
      activeStudentsCount: activeStudents.length,
      totalCollected,
      totalDues,
      dueCount,
      notificationCount: notifs.totalCount,
      attendanceAvg,
      totalBatches: batches.length,
      totalExpenses,
      netProfit: totalCollected - totalExpenses
    };
  },

  // Checks and updates attendance suspension flag for overdue fee (> 2 days)
  // Keeps student status Active so payments, collections, and notifications remain active!
  // Only temporarily removes student from daily attendance roll-call until payment is received.
  // All historical attendance records and reports are preserved 100%.
  isAttendanceSuspended(student, currentDate = new Date()) {
    if (!student) return false;
    // If manually marked inactive by user, not in active roll-call
    if (student.status === 'Inactive' && !student.autoInactive) return true;

    // Direct flag check
    if (student.attendanceSuspended) return true;

    const totalFee = Number(student.feeAmount) || 0;
    const paid = Number(student.paidAmount) || 0;
    const dueAmount = Math.max(0, totalFee - paid);
    if (dueAmount <= 0) return false;

    // Check overdue (> 2 days)
    const payments = this.getPayments();
    if (student.feeType === 'course') {
      const stuPayments = payments
        .filter(p => p.studentId === student.id || p.studentName === student.name)
        .sort((a, b) => {
          const dA = parseDateString(a.date) || new Date(0);
          const dB = parseDateString(b.date) || new Date(0);
          return dB.getTime() - dA.getTime();
        });

      let refDateStr = stuPayments.length > 0 ? stuPayments[0].date : student.admissionDate;
      const refDate = parseDateString(refDateStr);

      if (refDate) {
        let dueDate = new Date(refDate.getTime());
        dueDate.setMonth(dueDate.getMonth() + 1);
        if (student.nextInstallmentDate) {
          const nDate = parseDateString(student.nextInstallmentDate);
          if (nDate) dueDate = nDate;
        }
        const graceCutoff = new Date(dueDate.getTime());
        graceCutoff.setDate(graceCutoff.getDate() + 2);
        return currentDate > graceCutoff;
      }
      return true;
    } else {
      const currentMonthDue = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthlyGraceCutoff = new Date(currentMonthDue.getTime());
      monthlyGraceCutoff.setDate(monthlyGraceCutoff.getDate() + 2);
      return currentDate > monthlyGraceCutoff;
    }
  },

  checkAndUpdateOverdueStudents(currentDate = new Date()) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (!data) return [];
      const students = JSON.parse(data);
      if (!Array.isArray(students)) return [];

      const pData = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      const payments = pData ? JSON.parse(pData) : [];

      let hasChanged = false;

      const updated = students.map(student => {
        const totalFee = Number(student.feeAmount) || 0;
        const paid = Number(student.paidAmount) || 0;
        const dueAmount = Math.max(0, totalFee - paid);

        // Ensure student status is Active (overdue fees only suspend attendance temporarily; students stay Active for payments and notifications)
        let currentStatus = 'Active';
        if (student.status !== 'Active') {
          hasChanged = true;
          api.updateStudent(student.id, { status: 'Active' }).catch(() => {});
        }

        // 1. If due is cleared (0 due), lift any attendance suspension!
        if (dueAmount <= 0) {
          if (student.attendanceSuspended || student.autoInactive) {
            hasChanged = true;
            return {
              ...student,
              status: currentStatus,
              attendanceSuspended: false,
              attendanceSuspendedReason: null,
              autoInactive: false,
              inactiveReason: null
            };
          }
          if (student.status !== currentStatus) {
            return { ...student, status: currentStatus };
          }
          return student;
        }

        // 2. Student has due > 0. Check if more than 2 days have passed since due date!
        let isOverdueByTwoDays = false;
        let overdueReason = '';

        if (student.feeType === 'course') {
          // Course student: Due 1 month after previous payment date (or admission date)
          const stuPayments = payments
            .filter(p => p.studentId === student.id || p.studentName === student.name)
            .sort((a, b) => {
              const dA = parseDateString(a.date) || new Date(0);
              const dB = parseDateString(b.date) || new Date(0);
              return dB.getTime() - dA.getTime();
            });

          let refDateStr = stuPayments.length > 0 ? stuPayments[0].date : student.admissionDate;
          const refDate = parseDateString(refDateStr);

          if (refDate) {
            let dueDate = new Date(refDate.getTime());
            dueDate.setMonth(dueDate.getMonth() + 1);

            if (student.nextInstallmentDate) {
              const nDate = parseDateString(student.nextInstallmentDate);
              if (nDate) dueDate = nDate;
            }

            // 2-day grace period
            const graceCutoff = new Date(dueDate.getTime());
            graceCutoff.setDate(graceCutoff.getDate() + 2);

            if (currentDate > graceCutoff) {
              isOverdueByTwoDays = true;
              const daysOver = Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
              overdueReason = `কোর্স ফি কিস্তি বকেয়া (${daysOver} দিন অতিক্রান্ত)`;
            }
          } else {
            isOverdueByTwoDays = true;
            overdueReason = 'কোর্স ফি কিস্তি বকেয়া (২+ দিন)';
          }
        } else {
          // Monthly student: Due on 1st of each month; 2-day grace period (up to 3rd of month)
          const currentMonthDue = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const monthlyGraceCutoff = new Date(currentMonthDue.getTime());
          monthlyGraceCutoff.setDate(monthlyGraceCutoff.getDate() + 2); // 3rd of month

          if (currentDate > monthlyGraceCutoff) {
            isOverdueByTwoDays = true;
            const daysOver = Math.floor((currentDate.getTime() - currentMonthDue.getTime()) / (1000 * 60 * 60 * 24));
            overdueReason = `চলতি মাসের বেতন বকেয়া (${daysOver} দিন অতিক্রান্ত)`;
          }
        }

        // Only suspend attendance, do NOT mark the student Inactive!
        // Student remains Active for payments, collections, and notifications.
        if (isOverdueByTwoDays !== Boolean(student.attendanceSuspended) || student.status !== currentStatus) {
          hasChanged = true;
          return {
            ...student,
            status: currentStatus,
            attendanceSuspended: isOverdueByTwoDays,
            attendanceSuspendedReason: isOverdueByTwoDays ? overdueReason : null,
            autoInactive: false,
            inactiveReason: null
          };
        }

        return student;
      });

      if (hasChanged) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
        notifyChange();
      }

      return updated;
    } catch (e) {
      return [];
    }
  }
};

// Robust date string parsing helper (handles DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY)
export function parseDateString(dStr) {
  if (!dStr) return null;
  if (dStr instanceof Date) return dStr;
  const str = String(dStr).trim();
  
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parseInt(parts[2], 10);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
        return new Date(y, m, d);
      }
    }
  }
  if (str.includes('-')) {
    const parts = str.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
          return new Date(y, m, d);
        }
      } else {
        // DD-MM-YYYY
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parseInt(parts[2], 10);
        if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
          return new Date(y, m, d);
        }
      }
    }
  }
  const dt = new Date(str);
  return isNaN(dt.getTime()) ? null : dt;
}

// Automatically sync with Laravel backend when loaded in browser
if (typeof window !== 'undefined') {
  dataStore.syncWithBackend();

  // Re-sync on tab refocus to get any updates made elsewhere
  window.addEventListener('focus', () => {
    dataStore.syncWithBackend();
  });
}
