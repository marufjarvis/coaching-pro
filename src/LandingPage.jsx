// src/LandingPage.jsx
// High-Converting, Eye-Catching HSC ICT Coaching Landing Page for Maruf's ICT Care
// Fully Bilingual (EN / BN) with live reactive language switching and dynamic CMS synchronization

import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Code, 
  Cpu, 
  Database, 
  Globe, 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Phone, 
  MapPin, 
  Clock, 
  Users, 
  BookOpen, 
  Award, 
  Lightbulb, 
  Binary, 
  MessageCircle, 
  Menu, 
  X, 
  ChevronRight, 
  Laptop, 
  FileCheck, 
  Send, 
  Lock
} from 'lucide-react';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './landing-page.css';

// Bengali numeral formatter
const toBengaliDigits = (num) => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => bnDigits[Number(d)]);
};

const formatBengaliNumber = (num) => {
  const formattedEn = num.toLocaleString('en-US');
  return toBengaliDigits(formattedEn);
};

// Smooth animated counting system
function AnimatedCounter({ end, suffix = '', duration = 1800, isEn = false }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    let animationFrameId;

    const startCounting = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;
      let startTimestamp = null;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Silky smooth ease-out cubic deceleration
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        const current = progress >= 1 ? end : Math.round(easeOutProgress * end);
        setCount(current);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startCounting();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    // Immediate start on mount if in view
    const fallbackTimer = setTimeout(() => {
      startCounting();
    }, 100);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [end, duration]);

  return (
    <span ref={elementRef} className="counter-number">
      {isEn ? count.toLocaleString('en-US') : formatBengaliNumber(count)}{suffix}
    </span>
  );
}

function LandingPage({ 
  onGoToLogin,
  onGoToStudentLogin, 
  onGoToAdminLogin, 
  onGoToEnroll, 
  onGoToDashboard, 
  onGoToStudentDashboard,
  isAdminLoggedIn,
  isStudentLoggedIn,
  batches = []
}) {
  const handleOpenLogin = onGoToLogin || onGoToStudentLogin || onGoToAdminLogin;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Translation & Language Context
  const { lang, setLang } = useTranslation();
  const isEn = lang === 'EN';

  // Dynamic Frontend CMS Data (syncs with language selection)
  const [frontendData, setFrontendData] = useState(() => dataStore.getFrontendSettings(lang));

  useEffect(() => {
    setFrontendData(dataStore.getFrontendSettings(lang));
  }, [lang]);

  useEffect(() => {
    const handleSync = () => {
      setFrontendData(dataStore.getFrontendSettings(lang));
    };
    window.addEventListener('coaching-data-change', handleSync);
    window.addEventListener('storage', handleSync);
    window.addEventListener('coaching-language-change', handleSync);
    return () => {
      window.removeEventListener('coaching-data-change', handleSync);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('coaching-language-change', handleSync);
    };
  }, [lang]);

  const {
    notice = {},
    brand = {},
    hero = {},
    mentorHero = {},
    mentorSection = {},
    testimonials: customTestimonials,
    faq: customFaq,
    contact = {}
  } = frontendData || {};

  // Expanded Chapter Modal/Details
  const [selectedChapter, setSelectedChapter] = useState(null);

  // HSC ICT 6 Chapters Data (Bilingual)
  const chapters = [
    {
      numBn: '০১',
      numEn: '01',
      titleBn: 'তথ্য ও যোগাযোগ প্রযুক্তি: বিশ্ব ও বাংলাদেশ প্রেক্ষিত',
      titleEn: 'Global & Bangladesh Perspective',
      icon: Globe,
      color: '#38bdf8',
      bgGrad: 'rgba(56, 189, 248, 0.15)',
      cqMarksBn: 'বোর্ডে ১০-১৫ মার্কস নিশ্চিত',
      cqMarksEn: '10-15 Marks in Board Exam',
      topicsBn: [
        'ভার্চুয়াল রিয়েলিটি (VR) ও অগমেন্টেড রিয়েলিটি (AR)',
        'কৃত্রিম বুদ্ধিমত্তা (AI) ও রোবটিক্স প্রযুক্তি',
        'ক্রায়োসার্জারি ও চিকিৎসা ক্ষেত্রে ICT প্রয়োগ',
        'বায়োমেট্রিক্স, বায়োইনফরমেটিক্স ও জেনেটিক ইঞ্জিনিয়ারিং',
        'ন্যানোটেকনোলজি ও সাইবার ক্রাইম / তথ্যপ্রযুক্তি নিরাপত্তা'
      ],
      topicsEn: [
        'Virtual Reality (VR) & Augmented Reality (AR)',
        'Artificial Intelligence (AI) & Robotics Technology',
        'Cryosurgery & ICT Applications in Healthcare',
        'Biometrics, Bioinformatics & Genetic Engineering',
        'Nanotechnology & Cyber Security / Cyber Crime'
      ],
      practicalBn: 'আধুনিক টেকনোলজি ভিডিও ডেমো ও প্রজেক্টর ভিজ্যুয়ালাইজেশন',
      practicalEn: 'Modern Technology Video Demos & Projector Visualization',
      tipsBn: 'বোর্ড পরীক্ষায় অনুধাবনমূলক ও প্রয়োগমূলক প্রশ্নে বাস্তব প্রয়োগভিত্তিক ব্যাখ্যা প্রয়োজন।',
      tipsEn: 'Analytical and application-based board questions require real-world practical explanations.'
    },
    {
      numBn: '০২',
      numEn: '02',
      titleBn: 'কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং',
      titleEn: 'Communication Systems & Networking',
      icon: Cpu,
      color: '#a855f7',
      bgGrad: 'rgba(168, 85, 247, 0.15)',
      cqMarksBn: '১টি পূর্ণাঙ্গ CQ প্রশ্ন আসবেই',
      cqMarksEn: '1 Full Board CQ Guaranteed',
      topicsBn: [
        'ডেটা ট্রান্সমিশন মেথড (সিনক্রোনাস, অ্যাসিনক্রোনাস, আইসোক্রোনাস)',
        'ডেটা ট্রান্সমিশন মোড (সিমপ্লেক্স, হাফ-ডুপ্লেক্স, ফুল-ডুপ্লেক্স)',
        'কমিউনিকেশন মাধ্যম (টুইস্টেড পেয়ার, কো-অ্যাক্সিয়াল ও ফাইবার অপটিক)',
        'ওয়্যারলেস মিডিয়া (WiFi, WiMAX, Bluetooth, মাইক্রোওয়েভ)',
        'নেটওয়ার্ক টপোলজি (স্টার, বাস, রিং, ট্রি, মেশ, হাইব্রিড) ও ক্লাউড কম্পিউটিং'
      ],
      topicsEn: [
        'Data Transmission Methods (Sync, Async, Isochronous)',
        'Data Transmission Modes (Simplex, Half-Duplex, Full-Duplex)',
        'Communication Media (Twisted Pair, Coaxial & Fiber Optic)',
        'Wireless Media (WiFi, WiMAX, Bluetooth, Microwave)',
        'Network Topologies (Star, Bus, Ring, Tree, Mesh) & Cloud Computing'
      ],
      practicalBn: 'ল্যান কেবল, রাউটার ও নেটওয়ার্ক টপোলজি প্র্যাকটিক্যাল ল্যাব ডেমো',
      practicalEn: 'LAN Cables, Routers & Network Topology Practical Lab Demo',
      tipsBn: 'টপোলজি থেকে চিত্রভিত্তিক সৃজনশীল প্রশ্ন প্রতি বছর সব বোর্ডে কমন থাকে।',
      tipsEn: 'Diagram-based questions on network topologies are common in board exams every year.'
    },
    {
      numBn: '০৩',
      numEn: '03',
      titleBn: 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস',
      titleEn: 'Number Systems & Digital Logic Gates',
      icon: Binary,
      color: '#f59e0b',
      bgGrad: 'rgba(245, 158, 11, 0.15)',
      cqMarksBn: '২টি CQ (২০ মার্কস) সম্ভাব্য',
      cqMarksEn: '2 Full CQs (20 Marks) Expected',
      topicsBn: [
        'পজিশনাল সংখ্যা পদ্ধতি রূপান্তর (বাইনারি, অক্টাল, ডেসিমাল, হেক্সাডেসিমাল)',
        'চিহ্নযুক্ত সংখ্যা ও ২-এর পরিপূরক (2\'s Complement) যোগ-বিয়োগ',
        'মৌলিক লজিক গেইট (AND, OR, NOT) ও সার্বজনীন গেইট (NAND, NOR)',
        'বিশেষ গেইট (XOR, XNOR) ও বুলিয়ান অ্যালজেবরা সরলীকরণ',
        'এনকোডার, ডিকোডার, হাফ এডার ও ফুল এডার সার্কিট ডিজাইন'
      ],
      topicsEn: [
        'Positional Number Conversions (Binary, Octal, Decimal, Hex)',
        'Signed Numbers & 2\'s Complement Arithmetic',
        'Basic Logic Gates (AND, OR, NOT) & Universal Gates (NAND, NOR)',
        'Special Gates (XOR, XNOR) & Boolean Algebra Simplification',
        'Encoders, Decoders, Half Adder & Full Adder Circuit Design'
      ],
      practicalBn: 'লজিক সার্কিট ড্রয়িং ও লাইভ টুথ-টেবিল ভেরিফিকেশন',
      practicalEn: 'Logic Circuit Drawing & Live Truth-Table Verification',
      tipsBn: 'সংখ্যা পদ্ধতির শর্টকাট টেকনিক ও লজিক গেইটের সত্যক সারণী শতভাগ আয়ত্ত করানো হয়।',
      tipsEn: 'Number conversion shortcut techniques and truth tables are thoroughly practiced.'
    },
    {
      numBn: '০৪',
      numEn: '04',
      titleBn: 'ওয়েব ডিজাইন পরিচিতি এবং HTML',
      titleEn: 'Web Design & HTML5 Structure',
      icon: Code,
      color: '#10b981',
      bgGrad: 'rgba(16, 185, 129, 0.15)',
      cqMarksBn: '১টি পূর্ণাঙ্গ CQ (১০ মার্কস)',
      cqMarksEn: '1 Full Board CQ (10 Marks)',
      topicsBn: [
        'ওয়েবপেজের ধারণা, ডোমেন নেম, ওয়েব হোস্টিং ও ওয়েবসাইট কাঠামো',
        'HTML বেসিক কাঠামো, ট্যাগ, অ্যাট্রিবিউট ও এলিমেন্ট',
        'টেবিল ডিজাইন (<table>, <tr>, <td>, colspan, rowspan)',
        'হাইপারলিংক (<a> ট্যাগ), ইমেজ ইনসার্ট (<img>) ও অর্ডার্ড/আন-অর্ডার্ড লিস্ট',
        'ফর্ম উপাদান (ইনপুট, রেডিও, চেকবক্স, সাবমিট বাটন)'
      ],
      topicsEn: [
        'Web Concepts, Domain Names, Web Hosting & Website Structure',
        'HTML Structure, Tags, Attributes & Elements',
        'Table Design (<table>, <tr>, <td>, colspan, rowspan)',
        'Hyperlinks (<a> tag), Images (<img>) & Ordered/Unordered Lists',
        'HTML Form Elements (input, radio, checkbox, submit button)'
      ],
      practicalBn: 'কম্পিউটার ল্যাবে প্রতিটি শিক্ষার্থীর নিজস্ব এইচটিএমএল পেজ তৈরি',
      practicalEn: 'Each student codes and builds their own HTML webpage in computer lab',
      tipsBn: 'বোর্ড পরীক্ষায় সাধারণত টেবিল কোডিং অথবা লিস্ট/ইমেজ সংযোগের প্রশ্ন আসে।',
      tipsEn: 'Board exams almost always test Table coding or List/Image linking.'
    },
    {
      numBn: '০৫',
      numEn: '05',
      titleBn: 'প্রোগ্রামিং ভাষা (C Programming)',
      titleEn: 'Programming Languages & C Language',
      icon: Terminal,
      color: '#ec4899',
      bgGrad: 'rgba(236, 72, 153, 0.15)',
      cqMarksBn: '১টি পূর্ণাঙ্গ CQ (১০ মার্কস)',
      cqMarksEn: '1 Full Board CQ (10 Marks)',
      topicsBn: [
        'প্রোগ্রামিং ভাষার স্তর, অনুবাদক প্রোগ্রাম (কম্পাইলার, ইন্টারপ্রেটার)',
        'অ্যালগরিদম ও ফ্লোচার্ট (ধারাবাহিকতা, সিদ্ধান্ত ও লুপ)',
        'সি ভাষার ডেটা টাইপ, চলক, ধ্রুবক ও ইনপুট/আউটপুট (printf, scanf)',
        'কন্ডিশনাল স্টেটমেন্ট (if-else, switch-case) ও লিপ ইয়ার লজিক',
        'লুপ কন্ট্রোল (for, while, do-while), অ্যারে (Array) ও ফাংশন'
      ],
      topicsEn: [
        'Programming Paradigms & Translators (Compiler, Interpreter)',
        'Algorithms & Flowcharts (Sequential, Decision & Loop)',
        'C Data Types, Variables, Constants & I/O (printf, scanf)',
        'Conditional Statements (if-else, switch-case) & Leap Year Logic',
        'Loop Control (for, while, do-while), Arrays & Functions'
      ],
      practicalBn: 'ল্যাপটপে Code::Blocks / GCC দিয়ে লাইভ সি কোড কম্পাইলেশন ও রান',
      practicalEn: 'Live C Code Compilation & Execution with Code::Blocks / GCC on Laptops',
      tipsBn: 'প্রোগ্রামিং মুখস্ত করা অসম্ভব; ক্লাসে লজিক বিল্ড-আপের মাধ্যমে কোড তৈরি শেখানো হয়।',
      tipsEn: 'Programming cannot be memorized; code generation is taught via logic building.'
    },
    {
      numBn: '০৬',
      numEn: '06',
      titleBn: 'ডেটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)',
      titleEn: 'Database Management Systems & SQL',
      icon: Database,
      color: '#6366f1',
      bgGrad: 'rgba(99, 102, 241, 0.15)',
      cqMarksBn: '১টি পূর্ণাঙ্গ CQ প্রশ্ন',
      cqMarksEn: '1 Full Board CQ Guaranteed',
      topicsBn: [
        'ডেটাবেজ কনসেপ্ট, ফিল্ড, রেকর্ড, টেবিল ও ফাইল রিলেশন',
        'প্রাইমারি কি (Primary Key), কম্পোজিট কি ও ফরেন কি',
        'ডেটাবেজ রিলেশনশিপ (1:1, 1:Many, Many:Many)',
        'SQL কোয়েরি কমান্ড (SELECT, WHERE, ORDER BY, UPDATE, DELETE)',
        'ডেটা সিকিউরিটি, এনক্রিপশন ও ইনডেক্সিং এর গুরুত্ব'
      ],
      topicsEn: [
        'Database Concepts, Fields, Records, Tables & File Relationships',
        'Primary Key, Composite Key & Foreign Key',
        'Database Relationships (1:1, 1:Many, Many:Many)',
        'SQL Query Commands (SELECT, WHERE, ORDER BY, UPDATE, DELETE)',
        'Data Security, Encryption & Indexing Importance'
      ],
      practicalBn: 'প্র্যাকটিক্যাল SQL কুয়েরি ও রিলেশনাল ডেটা টেবিল প্র্যাকটিস',
      practicalEn: 'Hands-on SQL Queries & Relational Data Table Practice in Lab',
      tipsBn: 'SQL কুয়েরি লেখার নিয়ম এবং ডেটাবেজ রিলেশনের চিত্র আঁকা শিখলে পুরো নম্বর পাওয়া যায়।',
      tipsEn: 'Full marks are guaranteed by mastering SQL syntax and drawing relationship diagrams.'
    }
  ];

  // Active Batches to Display (Bilingual)
  const defaultBatches = isEn ? [
    {
      id: 'hsc-2026',
      title: 'HSC 2026 Regular Batch',
      tagline: 'Complete syllabus from basics to board A+ preparation',
      days: 'Sat, Mon, Wed',
      time: '8:00 AM & 4:00 PM (2 slots)',
      seatsLeft: '4 seats left',
      status: 'Admission Open',
      featured: true
    },
    {
      id: 'hsc-2025',
      title: 'HSC 2025 Revision & Test Paper Solve',
      tagline: 'Past board CQ-MCQ & special suggestions',
      days: 'Sun, Tue, Thu',
      time: '9:00 AM & 5:00 PM (2 slots)',
      seatsLeft: '3 seats left',
      status: 'Limited Seats',
      featured: false
    },
    {
      id: 'hsc-2027',
      title: 'HSC 2027 Foundation Course',
      tagline: 'Make ICT simple and enjoyable from the start',
      days: 'Sat, Mon, Wed',
      time: '10:00 AM',
      seatsLeft: '8 seats left',
      status: 'Admission Open',
      featured: false
    }
  ] : [
    {
      id: 'hsc-2026',
      title: 'HSC 2026 রেগুলার ব্যাচ',
      tagline: 'সম্পূর্ণ সিলেবাস বেসিক থেকে বোর্ড A+ প্রস্তুতি',
      days: 'শনি, সোম, বুধ',
      time: 'সকাল ৮:০০ ও বিকাল ৪:০০ (২টি স্লট)',
      seatsLeft: '৪টি আসন খালি',
      status: 'ভর্তি চলছে',
      featured: true
    },
    {
      id: 'hsc-2025',
      title: 'HSC 2025 রিভিশন ও টেস্ট পেপার সলভ',
      tagline: 'বিগত বছরের বোর্ড CQ-MCQ ও বিশেষ সাজেশন',
      days: 'রবি, মঙ্গল, বৃহস্পতি',
      time: 'সকাল ৯:০০ ও বিকাল ৫:০০ (২টি স্লট)',
      seatsLeft: '৩টি আসন খালি',
      status: 'সীমিত আসন',
      featured: false
    },
    {
      id: 'hsc-2027',
      title: 'HSC 2027 ফাউন্ডেশন কোর্স',
      tagline: 'আইসিটি শুরু থেকেই সহজ ও আনন্দময় করার ব্যাচ',
      days: 'শনি, সোম, বুধ',
      time: 'সকাল ১০:০০ টা',
      seatsLeft: '৮টি আসন খালি',
      status: 'ভর্তি চলছে',
      featured: false
    }
  ];

  const currentBatches = batches.length > 0 ? batches.map((b, i) => ({
    id: b.id || `batch-${i}`,
    title: b.name,
    tagline: isEn ? 'HSC ICT Special Academic Care' : 'HSC ICT স্পেশাল একাডেমিক কেয়ার',
    days: i % 2 === 0 ? (isEn ? 'Sat, Mon, Wed' : 'শনি, সোম, বুধ') : (isEn ? 'Sun, Tue, Thu' : 'রবি, মঙ্গল, বৃহস্পতি'),
    time: i === 0 ? (isEn ? '8:00 AM & 4:00 PM' : 'সকাল ৮:০০ ও বিকাল ৪:০০') : (isEn ? '9:00 AM & 5:00 PM' : 'সকাল ৯:০০ ও বিকাল ৫:০০'),
    seatsLeft: isEn ? 'Limited Seats' : 'সীমিত আসন',
    status: isEn ? 'Admission Open' : 'ভর্তি চলছে',
    featured: i === 0
  })) : defaultBatches;

  // Student Testimonials (Dynamic with fallback)
  const testimonials = (customTestimonials && customTestimonials.length > 0)
    ? customTestimonials
    : (isEn ? [
        {
          name: 'Tamim Iqbal',
          college: 'Kushtia Govt. College',
          score: 'ICT: 98/100 (A+)',
          text: 'Everyone warned me chapters 3 and 5 were difficult to memorize. But after practicing C coding and digital logic gates on laptops with Maruf Sir, all fears vanished. I scored 98 in the board exams!'
        },
        {
          name: 'Sumaiya Farhana',
          college: 'Kushtia Govt. Women College',
          score: 'ICT: 96/100 (A+)',
          text: 'The student portal is incredible! I could track my attendance and weekly exam scores right from my phone. Whenever I had difficulties, Sir provided 1-on-1 support.'
        },
        {
          name: 'Ariful Islam',
          college: 'Kushtia Islamia College',
          score: 'ICT: 95/100 (A+)',
          text: 'Hands-on practice with HTML tables in Chapter 4 and SQL queries in Chapter 6 made all the difference. Solving 10 years of past board questions meant zero surprises in the final exam.'
        }
      ] : [
        {
          name: 'তামিম ইকবাল',
          college: 'কুষ্টিয়া সরকারি কলেজ',
          score: 'ICT: ৯৮/১০০ (A+)',
          text: 'ICT-এর ৩য় ও ৫ম অধ্যায় নিয়ে সবাই বলত মুখস্ত করা কঠিন। মারুফ স্যারের ক্লাসে ল্যাপটপে সি কোডিং এবং ডিজিটাল লজিক গেইট প্র্যাকটিক্যালি দেখার পর ভয় একদম কেটে যায়। ফাইনাল পরীক্ষায় ৯৮ পেয়েছি!'
        },
        {
          name: 'সুমাইয়া ফারহানা',
          college: 'কুষ্টিয়া সরকারি মহিলা কলেজ',
          score: 'ICT: ৯৬/১০০ (A+)',
          text: 'স্যারের কোচিংয়ের স্টুডেন্ট পোর্টালটা দারুণ! প্রতি ক্লাসের হাজিরা আর সাপ্তাহিক টেস্টের মার্কশীট মোবাইল দিয়েই দেখতে পেয়েছি। কোনো টপিক বুঝতে সমস্যা হলে স্যার আলাদা সময়ে বুঝিয়ে দিয়েছেন।'
        },
        {
          name: 'আরিফুল ইসলাম',
          college: 'কুষ্টিয়া ইসলামিয়া কলেজ',
          score: 'ICT: ৯৫/১০০ (A+)',
          text: 'অধ্যায় ৪-এর HTML টেবিল আর অধ্যায় ৬-এর SQL কুয়েরি ক্লাসেই সম্পূর্ণ প্র্যাকটিস করানো হয়েছিল। বিগত ১০ বছরের বোর্ড প্রশ্ন সলভ করায় পরীক্ষার হলে সব প্রশ্ন হুবহু কমন পেয়েছি।'
        }
      ]);

  return (
    <div className="landing-page">
      {/* Background Ambient Lighting */}
      <div className="landing-ambient-glow-1"></div>
      <div className="landing-ambient-glow-2"></div>
      <div className="landing-ambient-glow-3"></div>

      {/* STICKY HEADER SECTION (Top Announcement Bar + Navigation Bar) */}
      <header className="landing-header-sticky">
        {/* 1. TOP NOTICE BAR */}
        {notice.enabled !== false && (
          <div className="top-announcement-bar">
            <div className="top-announcement-content">
              <span className="announcement-badge">{notice.badge || (isEn ? 'Special Announcement' : 'অফার ও আপডেট')}</span>
              <span>{notice.text || (isEn ? '📢 Limited seats available for HSC 2026 & 2025 batches! Hands-on classroom lab support included.' : '📢 HSC 2026 ও 2025 ব্যাচে সীমিত আসনে নতুন ভর্তি চলছে! সরাসরি ক্লাসরুমে ল্যাব সাপোর্ট।')}</span>
              <span className="announcement-link" onClick={onGoToEnroll}>
                {notice.btnText || (isEn ? 'Online Admission' : 'অনলাইন ভর্তি আবেদন')} <ArrowRight size={14} />
              </span>
            </div>
          </div>
        )}

        {/* 2. NAVIGATION BAR */}
        <nav className="landing-nav">
          <div className="nav-container">
            {/* Logo & Branding */}
            <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="nav-logo-box">
                <img src={brand.logoUrl || "/logo.png"} alt="Maruf's ICT Care Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              </div>
              <div>
                <div className="nav-brand-title">
                  {brand.titlePrefix || "Maruf's"} <span>{brand.titleHighlight || "ICT Care"}</span>
                </div>
                <div className="nav-brand-sub">{brand.tagline || (isEn ? "Do Not Memorize ICT, Let Us Learn Practically" : "ICT মুখস্ত নয়, এসো শিখি")}</div>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <ul className="nav-links-desktop">
              <li><a href="#hero" className="nav-link-item">{isEn ? 'Home' : 'হোম'}</a></li>
              <li><a href="#courses" className="nav-link-item">{isEn ? 'Courses' : 'কোর্স'}</a></li>
              <li><a href="#batches" className="nav-link-item">{isEn ? 'Batches' : 'ব্যাচ'}</a></li>
              <li><a href="#success" className="nav-link-item">{isEn ? 'Success' : 'সাফল্য'}</a></li>
              <li><a href="#mentor" className="nav-link-item">{isEn ? 'Instructor' : 'শিক্ষক'}</a></li>
              <li><a href="#contact" className="nav-link-item">{isEn ? 'Contact' : 'যোগাযোগ'}</a></li>
            </ul>

            {/* Header Action Buttons & Language Switcher */}
            <div className="nav-actions">
              {/* Language Switcher [EN | BN] */}
              <div className="landing-lang-toggle">
                <button 
                  type="button" 
                  className={`lang-pill-btn ${lang === 'EN' ? 'active' : ''}`}
                  onClick={() => setLang('EN')}
                  title="Switch to English"
                >
                  EN
                </button>
                <button 
                  type="button" 
                  className={`lang-pill-btn ${lang === 'BN' ? 'active' : ''}`}
                  onClick={() => setLang('BN')}
                  title="বাংলায় পরিবর্তন করুন"
                >
                  BN
                </button>
              </div>

              {/* If Admin is Logged In */}
              {isAdminLoggedIn && (
                <button 
                  type="button" 
                  onClick={onGoToDashboard} 
                  className="btn-nav-admin"
                  style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', borderColor: '#38bdf8' }}
                  title={isEn ? "Go to Admin Dashboard" : "এডমিন ড্যাশবোর্ডে প্রবেশ করুন"}
                >
                  <ShieldCheck size={16} /> {isEn ? 'Admin Dashboard' : 'এডমিন ড্যাশবোর্ড'}
                </button>
              )}

              {/* If Student is Logged In */}
              {isStudentLoggedIn && (
                <button 
                  type="button" 
                  onClick={onGoToStudentDashboard} 
                  className="btn-nav-student"
                  title={isEn ? "Go to My Dashboard" : "আমার স্টুডেন্ট ড্যাশবোর্ড"}
                >
                  <GraduationCap size={16} /> {isEn ? 'My Dashboard' : 'আমার ড্যাশবোর্ড'}
                </button>
              )}

              {/* Single Unified Login Button */}
              {(!isAdminLoggedIn && !isStudentLoggedIn) && (
                <button 
                  type="button" 
                  onClick={handleOpenLogin} 
                  className="btn-nav-login"
                  id="btn-login-nav"
                  title={isEn ? "Log in" : "লগইন করুন"}
                >
                  <Lock size={15} strokeWidth={2.5} /> {isEn ? 'Login' : 'লগইন'}
                </button>
              )}

              {/* Mobile Hamburger Button */}
              <button 
                type="button" 
                className="mobile-menu-toggle" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="mobile-nav-drawer">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <div className="landing-lang-toggle">
                  <button 
                    type="button" 
                    className={`lang-pill-btn ${lang === 'EN' ? 'active' : ''}`}
                    onClick={() => { setLang('EN'); setMobileMenuOpen(false); }}
                  >
                    English (EN)
                  </button>
                  <button 
                    type="button" 
                    className={`lang-pill-btn ${lang === 'BN' ? 'active' : ''}`}
                    onClick={() => { setLang('BN'); setMobileMenuOpen(false); }}
                  >
                    বাংলা (BN)
                  </button>
                </div>
              </div>

              <a href="#hero" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{isEn ? 'Home' : 'হোম'}</a>
              <a href="#courses" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{isEn ? 'Courses' : 'কোর্স'}</a>
              <a href="#batches" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{isEn ? 'Batches' : 'ব্যাচ'}</a>
              <a href="#success" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{isEn ? 'Success' : 'সাফল্য'}</a>
              <a href="#mentor" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{isEn ? 'Instructor' : 'শিক্ষক'}</a>
              <a href="#contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{isEn ? 'Contact' : 'যোগাযোগ'}</a>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.75rem' }}>
                {isAdminLoggedIn && (
                  <button 
                    type="button" 
                    onClick={() => { setMobileMenuOpen(false); onGoToDashboard(); }} 
                    className="btn-nav-admin"
                    style={{ justifyContent: 'center' }}
                  >
                    <ShieldCheck size={16} /> {isEn ? 'Admin Dashboard' : 'এডমিন ড্যাশবোর্ড'}
                  </button>
                )}

                {isStudentLoggedIn && (
                  <button 
                    type="button" 
                    onClick={() => { setMobileMenuOpen(false); onGoToStudentDashboard(); }} 
                    className="btn-nav-student"
                    style={{ justifyContent: 'center' }}
                  >
                    <GraduationCap size={18} /> {isEn ? 'My Dashboard' : 'আমার ড্যাশবোর্ড'}
                  </button>
                )}

                {(!isAdminLoggedIn && !isStudentLoggedIn) && (
                  <button 
                    type="button" 
                    onClick={() => { setMobileMenuOpen(false); handleOpenLogin(); }} 
                    className="btn-nav-login"
                    style={{ justifyContent: 'center' }}
                  >
                    <Lock size={16} strokeWidth={2.5} /> {isEn ? 'Login' : 'লগইন'}
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* 3. HERO SECTION */}
      <section id="hero" className="hero-section">
        <div className="lp-container">
          <div className="hero-grid">
            {/* Left Hero Content */}
            <div>
              <div className="hero-pill-badge">
                <Sparkles size={14} /> {hero.pillBadge || (isEn ? "Kushtia's Premier HSC ICT Learning Center" : "কুষ্টিয়ার সেরা HSC ICT লার্নিং সেন্টার")}
              </div>

              <h1 className="hero-title">
                {hero.titleLine1 || (isEn ? 'To Secure an A+ in HSC ICT' : 'HSC ICT-তে A+ নিশ্চিত করতে')} <br />
                <span className="hero-title-highlight">{hero.titleHighlight || (isEn ? 'Learn with Practical Tech, Not Rote Learning' : 'মুখস্ত নয়, এসো প্রযুক্তির সাথে শিখি')}</span>
              </h1>

              <p className="hero-subtitle">
                {hero.subtitle || (isEn 
                  ? 'Information and Communication Technology is not a subject to memorize! Master C Programming, HTML Tables, Logic Gates, and SQL Database with interactive laptop lab sessions to achieve a full 100/100 on your board exams.'
                  : 'তথ্য ও যোগাযোগ প্রযুক্তি মুখস্ত করার বিষয় নয়! সি প্রোগ্রামিং, এইচটিএমএল টেবিল, লজিক গেইট এবং ডেটাবেজ ম্যানেজমেন্ট প্রজেক্টর ও ল্যাপটপে হাতে-কলমে প্র্যাকটিক্যাল ল্যাবে আয়ত্ত করে বোর্ড পরীক্ষায় পূর্ণাঙ্গ ১০০ নম্বর অর্জন করো।')}
              </p>

              {/* Subject Chapter Highlights Row */}
              <div className="hero-badges-row">
                <span className="hero-badge-tag"><Binary size={15} color="#f59e0b" /> {hero.tags?.[0] || (isEn ? 'Number Systems & Logic Gates' : 'সংখ্যা পদ্ধতি ও লজিক গেইট')}</span>
                <span className="hero-badge-tag"><Code size={15} color="#10b981" /> {hero.tags?.[1] || (isEn ? 'HTML5 Web Design' : 'HTML5 ওয়েব ডিজাইন')}</span>
                <span className="hero-badge-tag"><Terminal size={15} color="#ec4899" /> {hero.tags?.[2] || (isEn ? 'C Programming Lab' : 'সি প্রোগ্রামিং ল্যাব')}</span>
                <span className="hero-badge-tag"><Database size={15} color="#6366f1" /> {hero.tags?.[3] || (isEn ? 'SQL Database' : 'SQL ডেটাবেজ')}</span>
              </div>

              {/* Primary Action Buttons */}
              <div className="hero-cta-group">
                <button 
                  type="button" 
                  onClick={handleOpenLogin} 
                  className="btn-hero-primary"
                  id="btn-hero-login"
                >
                  <Lock size={19} strokeWidth={2.5} />
                  {hero.primaryBtnText || (isEn ? 'Login Now' : 'লগইন করুন')}
                  <ArrowRight size={18} />
                </button>

                <button 
                  type="button" 
                  onClick={onGoToEnroll} 
                  className="btn-hero-enroll"
                  id="btn-hero-enroll"
                >
                  <Sparkles size={18} />
                  {hero.enrollBtnText || (isEn ? 'Online Admission Form' : 'অনলাইন ভর্তি আবেদন')}
                </button>
              </div>

              {/* Hero Stats with Live Counting Animation */}
              <div className="hero-stats-row">
                <div className="stat-item">
                  <h3>
                    <AnimatedCounter end={hero.stat1?.number ?? 98} suffix={hero.stat1?.suffix || '%+'} duration={1800} isEn={isEn} />
                  </h3>
                  <p>{hero.stat1?.label || (isEn ? 'A+ Pass Rate in Board Exams' : 'বোর্ড পরীক্ষায় A+ পাশের হার')}</p>
                </div>
                <div className="stat-item">
                  <h3>
                    <AnimatedCounter end={hero.stat2?.number ?? 1200} suffix={hero.stat2?.suffix || '+'} duration={1800} isEn={isEn} />
                  </h3>
                  <p>{hero.stat2?.label || (isEn ? 'Successful Students' : 'সফল ও সন্তুষ্ট শিক্ষার্থী')}</p>
                </div>
                <div className="stat-item">
                  <h3>
                    <AnimatedCounter end={hero.stat3?.number ?? 100} suffix={hero.stat3?.suffix || '%'} duration={1800} isEn={isEn} />
                  </h3>
                  <p>{hero.stat3?.label || (isEn ? 'Practical Lab Support' : 'প্র্যাকটিক্যাল ল্যাব সাপোর্ট')}</p>
                </div>
              </div>
            </div>

            {/* Right Hero: Open Floating Circle Showcase with Glowing Ring (No Card Wrapper) */}
            <div className="hero-portrait-col">
              <div className="hero-circle-showcase">
                {/* Atmospheric Glow Halo */}
                <div className="hero-circle-ambient-halo"></div>

                {/* Natural Image Presentation (No Circle Frame, No Card Box) */}
                <div className="hero-natural-img-box">
                  <img 
                    src={mentorHero.image || "/m2.png"} 
                    alt={`${mentorHero.name || (isEn ? 'Maruf Hossain' : 'মারুফ হোসেন')} - HSC ICT Mentor`} 
                    className="hero-mentor-natural-img"
                    loading="eager"
                  />
                </div>

                {/* Floating Badge 1: Top-Right Verified Lead Instructor */}
                <div className="hero-float-badge hero-float-top-right">
                  <div className="float-badge-icon badge-accent-blue">
                    <Award size={18} />
                  </div>
                  <div>
                    <div className="float-badge-title">{mentorHero.badge1Title || (isEn ? 'Maruf Hossain' : 'মারুফ হোসেন')}</div>
                    <div className="float-badge-sub">{mentorHero.badge1Sub || (isEn ? 'Lead Instructor & Founder' : 'প্রধান শিক্ষক ও প্রতিষ্ঠাতা')}</div>
                  </div>
                </div>

                {/* Floating Badge 2: Top-Left Experience & Specialist */}
                <div className="hero-float-badge hero-float-top-left">
                  <div className="float-badge-icon badge-accent-green">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="float-badge-title">{mentorHero.badge2Title || (isEn ? 'HSC ICT Specialist' : 'HSC ICT স্পেশালিস্ট')}</div>
                    <div className="float-badge-sub">{mentorHero.badge2Sub || (isEn ? '10+ Years Teaching' : '১০+ বছর সফল পাঠদান')}</div>
                  </div>
                </div>

                {/* Floating Badge 3: Bottom-Left 1200+ A+ Students (Shifted to Side) */}
                <div className="hero-float-badge hero-float-bottom-left">
                  <div className="float-badge-icon badge-accent-amber">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <div className="float-badge-title">{mentorHero.badge3Title || (isEn ? '1,200+ Students A+' : '১,২০০+ শিক্ষার্থী A+')}</div>
                    <div className="float-badge-rating">
                      <span>★★★★★</span> <small>{mentorHero.badge3Sub || (isEn ? '5.0 Star Rating' : '৫.০ রেটিং')}</small>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 4: Bottom-Right Live Lab Pulse (Shifted to Side) */}
                <div className="hero-float-badge hero-float-bottom-right">
                  <span className="pulse-indicator"></span>
                  <div>
                    <div className="float-badge-title" style={{ color: '#34d399' }}>{mentorHero.badge4Title || (isEn ? 'Hands-on Lab Classes' : 'সরাসরি ল্যাব ক্লাস')}</div>
                    <div className="float-badge-sub">{mentorHero.badge4Sub || (isEn ? 'Laptops & Projectors Practice' : 'ল্যাপটপ ও প্রজেক্টরে প্র্যাকটিস')}</div>
                  </div>
                </div>

                {/* Open Mentor Credentials (Directly on Page Background, No Boxy Card) */}
                <div className="hero-mentor-credentials">
                  <div className="mentor-cred-name-row">
                    <span className="mentor-cred-name">{mentorHero.name || (isEn ? 'Maruf Hossain' : 'মারুফ হোসেন')}</span>
                    <span className="mentor-verified-badge" title={isEn ? "Certified ICT Mentor" : "সার্টিফাইড ICT শিক্ষক"}>
                      <CheckCircle2 size={18} color="#38bdf8" />
                    </span>
                  </div>
                  <div className="mentor-cred-role">
                    {mentorHero.role || 'AI Engineer | Blockchain Developer | Quantum Expert'}
                  </div>
                  <div className="mentor-cred-chips">
                    {(mentorHero.chips && mentorHero.chips.length > 0 ? mentorHero.chips : [
                      '🤖 Artificial Intelligence',
                      '⛓️ Blockchain & Web3',
                      '⚛️ Quantum Computing',
                      '🧠 Deep Learning & LLMs'
                    ]).map((chip, chipIdx) => (
                      <span key={chipIdx} className="mentor-chip">{chip}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COURSES / SYLLABUS SECTION (HSC ICT Chapters 1 - 6) */}
      <section id="courses" className="curriculum-section">
        <div id="syllabus" style={{ position: 'relative', top: '-80px', visibility: 'hidden' }}></div>
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-section-pill">
              <BookOpen size={14} /> {isEn ? 'Complete Board Curriculum' : 'পূর্ণাঙ্গ বোর্ড কারিকুলাম'}
            </div>
            <h2 className="lp-section-title">
              {isEn ? 'HSC ICT Complete Syllabus (Chapters 1 - 6)' : 'HSC ICT সম্পূর্ণ পাঠ্যসূচি (অধ্যায় ১ - ৬)'}
            </h2>
            <p className="lp-section-subtitle">
              {isEn 
                ? 'Complex concepts in each chapter are made intuitive with animations, hands-on lab sessions, and 10 years of board question analysis.'
                : 'প্রতিটি অধ্যায়ের জটিল টপিকগুলোকে সহজবোধ্য অ্যানিমেশন, ল্যাব প্র্যাকটিস এবং বিগত ১০ বছরের বোর্ড প্রশ্ন বিশ্লেষণের মাধ্যমে পূর্ণাঙ্গ প্রস্তুত করা হয়।'}
            </p>
          </div>

          <div className="chapters-grid">
            {chapters.map((ch, idx) => {
              const IconComp = ch.icon;
              const chNum = isEn ? ch.numEn : ch.numBn;
              const chTitle = isEn ? ch.titleEn : ch.titleBn;
              const chSub = isEn ? ch.titleBn : ch.titleEn;
              const chTopics = isEn ? ch.topicsEn : ch.topicsBn;
              const chCqMarks = isEn ? ch.cqMarksEn : ch.cqMarksBn;

              return (
                <div key={idx} className="chapter-card">
                  <div className="chapter-card-top">
                    <span className="chapter-num-badge">{isEn ? `Chapter ${chNum}` : `অধ্যায় ${chNum}`}</span>
                    <div className="chapter-icon-box" style={{ background: ch.bgGrad, color: ch.color }}>
                      <IconComp size={22} />
                    </div>
                  </div>

                  <h3 className="chapter-title">{chTitle}</h3>
                  <div className="chapter-eng">{chSub}</div>

                  <ul className="chapter-topics-list">
                    {chTopics.map((t, tIdx) => (
                      <li key={tIdx} className="chapter-topic-item">
                        <span className="chapter-topic-bullet">▸</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="chapter-card-footer">
                    <span className="chapter-cq-badge">{chCqMarks}</span>
                    <button 
                      type="button"
                      onClick={() => setSelectedChapter(ch)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#38bdf8',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      {isEn ? 'View Details' : 'বিস্তারিত দেখুন'} <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chapter Details Modal */}
      {selectedChapter && (
        <div 
          className="chapter-modal-backdrop"
          onClick={() => setSelectedChapter(null)}
        >
          <div 
            className="chapter-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              onClick={() => setSelectedChapter(null)}
              className="chapter-modal-close-btn"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingRight: '2rem' }}>
              <div 
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: selectedChapter.bgGrad,
                  color: selectedChapter.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <selectedChapter.icon size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: selectedChapter.color, fontWeight: 700 }}>
                  {isEn ? `Chapter ${selectedChapter.numEn} Special Guidelines` : `অধ্যায় ${selectedChapter.numBn} স্পেশাল গাইডলাইন`}
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 800, lineHeight: 1.3 }}>
                  {isEn ? selectedChapter.titleEn : selectedChapter.titleBn}
                </h3>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem', background: '#090f1d', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#38bdf8', marginBottom: '0.4rem', fontWeight: 700 }}>
                {isEn ? '🔬 Classroom Practical Lab Advantage:' : '🔬 ক্লাসরুম প্র্যাকটিক্যাল সুবিধা:'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {isEn ? selectedChapter.practicalEn : selectedChapter.practicalBn}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#34d399', marginBottom: '0.4rem', fontWeight: 700 }}>
                {isEn ? '💡 Board Exam Strategy & Tips:' : '💡 বোর্ড পরীক্ষার কৌশল ও টিপস:'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                {isEn ? selectedChapter.tipsEn : selectedChapter.tipsBn}
              </p>
            </div>

            <div className="chapter-modal-actions">
              <button 
                type="button" 
                onClick={() => { setSelectedChapter(null); onGoToEnroll(); }}
                className="btn-batch-enroll"
              >
                {isEn ? 'Apply for Admission' : 'ভর্তি আবেদন করুন'}
              </button>
              <button 
                type="button" 
                onClick={() => setSelectedChapter(null)}
                className="btn-modal-close-alt"
              >
                {isEn ? 'Close' : 'বন্ধ করুন'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. WHY MARUF'S ICT CARE SECTION */}
      <section id="features" className="why-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-section-pill">
              <Award size={14} /> {isEn ? 'Why We Are Unique' : 'কেন আমরা অদ্বিতীয়'}
            </div>
            <h2 className="lp-section-title">
              {isEn ? "Why is Maruf's ICT Care the Top Choice for Students?" : "কেন Maruf's ICT Care শিক্ষার্থীদের সেরা পছন্দ?"}
            </h2>
            <p className="lp-section-subtitle">
              {isEn 
                ? 'Moving beyond conventional rote learning to deliver a modern, tech-enabled academic environment.'
                : 'গতানুগতিক ধারার বাইরে গিয়ে আধুনিক তথ্যপ্রযুক্তির সহায়তায় শিক্ষার্থীদের জন্য সম্পূর্ণ ইউনিক একাডেমিক পরিবেশ।'}
            </p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                <Laptop size={26} />
              </div>
              <h3 className="pillar-title">{isEn ? 'Hands-on Lab Practice' : 'হাতে-কলমে ল্যাব প্র্যাকটিস'}</h3>
              <p className="pillar-desc">
                {isEn 
                  ? 'C Programming and HTML are never taught solely on paper. Students compile and run live code on multimedia projectors and laptops.'
                  : 'সি প্রোগ্রামিং ও এইচটিএমএল কেবল খাতায় লিখে শেখানো হয় না। মাল্টিমিডিয়া প্রজেক্টর ও ল্যাপটপে সরাসরি কোড কম্পাইল ও রান করিয়ে শেখানো হয়।'}
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                <BookOpen size={26} />
              </div>
              <h3 className="pillar-title">{isEn ? 'Colorful Hand Notes & Question Bank' : 'কালারফুল হ্যান্ডনোট ও প্রশ্নব্যাংক'}</h3>
              <p className="pillar-desc">
                {isEn 
                  ? 'Exclusive illustrated lecture sheets and type-wise suggestions based on analysis of 10 years of board exam questions.'
                  : 'প্রতিটি অধ্যায়ের জন্য এক্সক্লুসিভ রঙিন শিট ও বিগত ১০ বছরের বোর্ড প্রশ্ন এনালাইসিস করে প্রস্তুতকৃত টাইপভিত্তিক সাজেশন ও মডেল টেস্ট।'}
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
                <GraduationCap size={26} />
              </div>
              <h3 className="pillar-title">{isEn ? 'Modern Student Portal' : 'আধুনিক স্টুডেন্ট পোর্টাল'}</h3>
              <p className="pillar-desc">
                {isEn 
                  ? 'Students can log in anytime using their mobile number to monitor attendance history, test scores, and fee records.'
                  : 'শিক্ষার্থীরা যেকোনো সময় নিজের মোবাইল নম্বর দিয়ে পোর্টালে লগইন করে হাজিরা হিস্ট্রি, মডেল টেস্টের রেজাল্ট ও ফি স্ট্যাটাস দেখতে পারে।'}
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                <Send size={26} />
              </div>
              <h3 className="pillar-title">{isEn ? 'Automated SMS Updates for Guardians' : 'অভিভাবকদের অটো SMS আপডেট'}</h3>
              <p className="pillar-desc">
                {isEn 
                  ? 'Instant automated SMS alerts inform parents regarding attendance status and model test examination results.'
                  : 'শিক্ষার্থী ক্লাসে উপস্থিত বা অনুপস্থিত থাকলে এবং পরীক্ষার ফলাফল প্রকাশিত হওয়ার সাথে সাথে স্বয়ংক্রিয় SMS পৌঁছায় অভিভাবকের ফোনে।'}
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
                <FileCheck size={26} />
              </div>
              <h3 className="pillar-title">{isEn ? 'Chapter-wise Regular Model Tests' : 'অধ্যায়ভিত্তিক রেগুলার মডেল টেস্ট'}</h3>
              <p className="pillar-desc">
                {isEn 
                  ? 'OMR-based 25-mark MCQ and 50-mark creative written exams simulate actual board conditions to eliminate exam anxiety.'
                  : 'বোর্ড স্ট্যান্ডার্ড ওএমআর পদ্ধতিতে ২৫ নম্বরের MCQ এবং ৫০ নম্বরের সৃজনশীল লিখিত পরীক্ষা গ্রহণের মাধ্যমে চূড়ান্ত ভীতি দূর করা হয়।'}
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap" style={{ background: 'rgba(20, 184, 166, 0.15)', color: '#14b8a6' }}>
                <Lightbulb size={26} />
              </div>
              <h3 className="pillar-title">{isEn ? 'Free Special Care for Weak Students' : 'দুর্বলদের জন্য ফ্রি স্পেশাল কেয়ার'}</h3>
              <p className="pillar-desc">
                {isEn 
                  ? 'Dedicated 1-on-1 doubt clearing and extra backup sessions at no additional fee for students needing extra help.'
                  : 'যেসব শিক্ষার্থী কোনো বিষয়ে পিছিয়ে থাকে, তাদের জন্য আলাদা শিডিউলে বিনা খরচে ডাউট ক্লিয়ারিং ও বিশেষ এক্সট্রা ক্লাসের ব্যবস্থা রয়েছে।'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STUDENT PORTAL SPOTLIGHT SECTION */}
      <section className="portal-spotlight-section">
        <div className="lp-container">
          <div className="portal-spotlight-card">
            <div>
              <div className="hero-pill-badge" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                <Sparkles size={14} /> {isEn ? '24/7 Digital Learning Dashboard' : '২৪/৭ ডিজিটাল লার্নিং ড্যাশবোর্ড'}
              </div>

              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, marginBottom: '1.25rem' }}>
                {isEn ? (
                  <>Dedicated Online <br /><span style={{ color: '#38bdf8' }}>Student Portal</span></>
                ) : (
                  <>শিক্ষার্থীদের জন্য নিজস্ব <br /><span style={{ color: '#38bdf8' }}>অনলাইন স্টুডেন্ট পোর্টাল</span></>
                )}
              </h2>

              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                {isEn 
                  ? 'Our students can log into their personalized dashboard anytime from mobile or PC with just their registered mobile number to monitor academic progress.'
                  : 'আমাদের শিক্ষার্থীরা যেকোনো সময় মোবাইল বা কম্পিউটার থেকে শুধুমাত্র নিবন্ধিত মোবাইল নম্বর দিয়ে এক ক্লিকে নিজের ড্যাশবোর্ডে প্রবেশ করে পড়ালেখার অগ্রগতি মনিটর করতে পারে।'}
              </p>

              <div className="portal-feature-item">
                <div className="portal-feature-icon">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="portal-feature-title">{isEn ? 'Real-Time Attendance Rate' : 'রিয়েল-টাইম হাজিরা শতকরা হার'}</h4>
                  <p className="portal-feature-desc">{isEn ? 'Accurate calculation of monthly present and absent days with interactive calendar view.' : 'প্রতি মাসের উপস্থিত ও অনুপস্থিত দিনের সঠিক ক্যালকুলেশন ও ক্যালেন্ডার ভিউ।'}</p>
                </div>
              </div>

              <div className="portal-feature-item">
                <div className="portal-feature-icon">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="portal-feature-title">{isEn ? 'Model Test Results & Report Cards' : 'মডেল টেস্টের ফলাফল ও মার্কশীট'}</h4>
                  <p className="portal-feature-desc">{isEn ? 'Instant access to download and print report cards with both CQ and MCQ scores.' : 'CQ এবং MCQ নম্বরসহ প্রতিটি পরীক্ষার রিপোর্ট কার্ড ডাউনলোড ও প্রিন্ট সুবিধা।'}</p>
                </div>
              </div>

              <div className="portal-feature-item">
                <div className="portal-feature-icon">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 className="portal-feature-title">{isEn ? 'Payment Receipts & Fee History' : 'পেমেন্ট রিসিট ও ফি রেকর্ড'}</h4>
                  <p className="portal-feature-desc">{isEn ? 'Instant visibility of paid fees, outstanding dues, and official digital money receipts.' : 'পরিশোধিত ফি, বকেয়া এবং অফিসিয়াল মানি রিসিট তাৎক্ষণিক দেখার সুযোগ।'}</p>
                </div>
              </div>

              <div style={{ marginTop: '2.25rem' }}>
                <button 
                  type="button" 
                  onClick={handleOpenLogin}
                  className="btn-hero-primary"
                  id="btn-spotlight-login"
                >
                  <Lock size={20} strokeWidth={2.5} />
                  {isEn ? 'Log in to Portal' : 'পোর্টালে লগইন করুন'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Portal Live Mockup Card */}
            <div className="portal-mockup-wrap">
              <div className="portal-mockup-header">
                <div className="mockup-user-info">
                  <div className="mockup-user-avatar">
                    {isEn ? 'M' : 'মা'}
                  </div>
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>{isEn ? "Maruf's Student Portal" : "মারুফ'স স্টুডেন্ট পোর্টাল"}</div>
                    <div style={{ color: '#38bdf8', fontSize: '0.75rem' }}>{isEn ? 'HSC 2026 Batch • Kushtia' : 'HSC 2026 ব্যাচ • কুষ্টিয়া'}</div>
                  </div>
                </div>
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 700 }}>
                  {isEn ? 'Active Student' : 'সক্রিয় শিক্ষার্থী'}
                </span>
              </div>

              <div className="mockup-stats-grid">
                <div className="mockup-stat-box">
                  <div className="mockup-stat-label">{isEn ? 'Attendance Rate' : 'হাজিরা পার্সেন্টেজ'}</div>
                  <div className="mockup-stat-value" style={{ color: '#10b981' }}>{isEn ? '94% (Regular)' : '৯৪% (নিয়মিত)'}</div>
                </div>
                <div className="mockup-stat-box">
                  <div className="mockup-stat-label">{isEn ? 'Latest Model Test' : 'সর্বশেষ মডেল টেস্ট'}</div>
                  <div className="mockup-stat-value" style={{ color: '#38bdf8' }}>{isEn ? '96/100 (A+)' : '৯৬/১০০ (A+)'}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{isEn ? 'Chapter Progress' : 'অধ্যায়ভিত্তিক প্রস্তুতি অগ্রগতি'}</span>
                  <span style={{ color: '#38bdf8' }}>{isEn ? '85% Complete' : '৮৫% সম্পন্ন'}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #0284c7, #10b981)' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                  <span>{isEn ? 'Chapters 1-4 Revision Done' : 'অধ্যায় ১-৪ রিভিশন শেষ'}</span>
                  <span>{isEn ? 'Chapter 5 Coding Active' : 'অধ্যায় ৫ কোডিং চলছে'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CURRENT BATCHES & SCHEDULE SECTION */}
      <section id="batches" className="batches-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-section-pill">
              <Clock size={14} /> {isEn ? 'Limited Seats Available' : 'আসন সংখ্যা সীমিত'}
            </div>
            <h2 className="lp-section-title">
              {isEn ? 'Current Batches & Schedule' : 'চলমান ব্যাচ ও সময়সূচি'}
            </h2>
            <p className="lp-section-subtitle">
              {isEn 
                ? 'Classes are conducted with 20-25 students per batch to ensure dedicated individual attention.'
                : 'প্রতি ব্যাচে সর্বোচ্চ ২০-২৫ জন শিক্ষার্থী নিয়ে ক্লাস পরিচালিত হয়, যাতে প্রতিটি ছাত্র-ছাত্রীর প্রতি আলাদা মনোযোগ নিশ্চিত করা যায়।'}
            </p>
          </div>

          <div className="batches-grid">
            {currentBatches.map((batch, bIdx) => (
              <div key={bIdx} className={`batch-card ${batch.featured ? 'featured' : ''}`}>
                {batch.featured && (
                  <span className="batch-featured-tag">{isEn ? 'Most Popular' : 'সর্বাধিক চাহিদাসম্পন্ন'}</span>
                )}

                <div className="batch-header">
                  <h3 className="batch-title">{batch.title}</h3>
                  <p className="batch-subtitle">{batch.tagline}</p>
                </div>

                <ul className="batch-info-list">
                  <li className="batch-info-item">
                    <Clock size={18} className="batch-info-icon" />
                    <span><strong>{isEn ? 'Class Days:' : 'ক্লাসের দিন:'}</strong> {batch.days}</span>
                  </li>
                  <li className="batch-info-item">
                    <Laptop size={18} className="batch-info-icon" />
                    <span><strong>{isEn ? 'Time:' : 'সময়:'}</strong> {batch.time}</span>
                  </li>
                  <li className="batch-info-item">
                    <Users size={18} className="batch-info-icon" />
                    <span><strong>{isEn ? 'Seat Status:' : 'আসন স্ট্যাটাস:'}</strong> <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{batch.seatsLeft}</span></span>
                  </li>
                  <li className="batch-info-item">
                    <Award size={18} className="batch-info-icon" />
                    <span><strong>{isEn ? 'Coverage:' : 'কভারেজ:'}</strong> {isEn ? 'Chapters 1-6 + Practical Lab' : 'অধ্যায় ১-৬ + প্র্যাকটিক্যাল ল্যাব'}</span>
                  </li>
                </ul>

                <button 
                  type="button" 
                  onClick={() => onGoToEnroll(batch.title)}
                  className="btn-batch-enroll"
                >
                  <Sparkles size={16} /> {isEn ? 'Apply for Admission in This Batch' : 'এই ব্যাচে ভর্তি আবেদন করুন'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. STUDENT SUCCESS & TESTIMONIALS */}
      <section id="success" className="success-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-section-pill">
              <Award size={14} /> {isEn ? 'Success & Trust' : 'সাফল্য ও বিশ্বাস'}
            </div>
            <h2 className="lp-section-title">
              {isEn ? 'Success Stories from Our Top Students' : 'কৃতী শিক্ষার্থীদের মুখে সাফল্যের গল্প'}
            </h2>
            <p className="lp-section-subtitle">
              {isEn 
                ? 'Experiences shared by students from Kushtia Govt. College, Women College, and Islamia College.'
                : 'কুষ্টিয়া সরকারি কলেজ, মহিলা কলেজ ও ইসলামিয়া কলেজসহ শীর্ষ প্রতিষ্ঠানের শিক্ষার্থীদের অভিজ্ঞতা।'}
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testi, tIdx) => (
              <div key={tIdx} className="testimonial-card">
                <p className="testi-quote">"{testi.text}"</p>
                <div className="testi-user">
                  <div className="testi-avatar">
                    {testi.name ? testi.name.charAt(0) : 'S'}
                  </div>
                  <div>
                    <div className="testi-name">{testi.name}</div>
                    <div className="testi-college">{testi.college}</div>
                  </div>
                  <div className="testi-badge">{testi.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. MENTOR PROFILE SECTION */}
      <section id="mentor" className="mentor-section">
        <div className="lp-container">
          <div className="mentor-card">
            {/* Left Mentor Showcase Column with Grand Arch Portrait Showcase */}
            <div className="mentor-photo-wrap">
              <div className="mentor-natural-showcase-box">
                {/* Atmospheric Glow */}
                <div className="mentor-natural-ambient-glow"></div>

                <div className="mentor-natural-img-wrapper">
                  <img 
                    src={mentorHero.image || "/m2.png"} 
                    alt={`${mentorHero.name || (isEn ? 'Maruf Hossain' : 'মারুফ হোসেন')} - HSC ICT Mentor`} 
                    className="mentor-natural-img"
                    loading="lazy"
                  />
                </div>

                {/* Floating Badge 1: Top-Left Experience */}
                <div className="mentor-float-badge mentor-float-top-left">
                  <Sparkles size={16} color="#34d399" />
                  <span>{mentorHero.badge2Sub || (isEn ? '10+ Years Experience' : '১০+ বছর অভিজ্ঞতা')}</span>
                </div>

                {/* Floating Badge 2: Bottom-Right A+ Rating */}
                <div className="mentor-float-badge mentor-float-bottom-right">
                  <Award size={16} color="#38bdf8" />
                  <span>{mentorHero.badge3Title || (isEn ? '1,200+ Successful Students' : '১,২০০+ সফল শিক্ষার্থী')}</span>
                </div>
              </div>

              {/* Mentor Identification and Highlights */}
              <div className="mentor-info-block">
                <div className="mentor-name-row">
                  <h3 className="mentor-name">{mentorHero.name || (isEn ? 'Maruf Hossain' : 'মারুফ হোসেন')}</h3>
                  <span className="mentor-verified-badge" title={isEn ? "Certified Lead ICT Mentor" : "সার্টিফাইড লিড ICT মেন্টর"}>
                    <CheckCircle2 size={18} />
                  </span>
                </div>
                <div className="mentor-designation">{mentorHero.role || 'AI Engineer | Blockchain Developer | Quantum Expert'}</div>
                <div className="mentor-skill-pills">
                  {(mentorHero.chips && mentorHero.chips.length > 0 ? mentorHero.chips : [
                    '🤖 Artificial Intelligence',
                    '⛓️ Blockchain & Web3',
                    '⚛️ Quantum Computing',
                    '🧠 Deep Learning & LLMs'
                  ]).map((chip, chipIdx) => (
                    <span key={chipIdx} className="mentor-pill-item">{chip}</span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="hero-pill-badge" style={{ marginBottom: '1rem' }}>
                <Lightbulb size={14} /> {mentorSection.pill || (isEn ? '"Do Not Memorize ICT, Learn Practically"' : '"ICT মুখস্ত নয়, এসো শিখি"')}
              </div>

              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', lineHeight: 1.3 }}>
                {mentorSection.title || (isEn ? 'In the Age of Technology, Rote Learning Has No Place' : 'প্রযুক্তির যুগে মুখস্ত বিদ্যার কোনো স্থান নেই')}
              </h2>

              <p className="mentor-bio">
                {mentorSection.bio || (isEn 
                  ? '"HSC ICT is the most modern and essential subject for future careers. Yet without proper guidance, many students struggle by attempting to memorize C code or logic gates. In our classroom, every concept comes alive on laptop screens and projectors, empowering every student to achieve an A+ with genuine confidence."'
                  : '"এইচএসসি পরীক্ষার সবচেয়ে আধুনিক ও গুরুত্বপূর্ণ বিষয় হচ্ছে তথ্য ও যোগাযোগ প্রযুক্তি (ICT)। কিন্তু অনেকেই সঠিক গাইডলাইনের অভাবে সি প্রোগ্রামিং কিংবা লজিক গেইট মুখস্ত করার চেষ্টা করে হতাশ হয়। আমাদের ক্লাসরুমে প্রতিটি টপিক ল্যাপটপ এবং মাল্টিমিডিয়া স্ক্রিনে জীবন্ত করে তোলা হয়, যাতে প্রতিটি শিক্ষার্থী আত্মবিশ্বাসের সাথে A+ অর্জন করতে পারে।"')}
              </p>

              <ul className="mentor-bullet-list">
                {(mentorSection.bullets && mentorSection.bullets.length > 0 ? mentorSection.bullets : (isEn ? [
                  '10+ years experienced ICT mentor & software engineering professional',
                  'Intuitive logic-building and practical programming methodologies',
                  '24/7 personalized academic mentorship and doubt resolution'
                ] : [
                  '১০+ বছরের অভিজ্ঞ ICT শিক্ষক ও সফটওয়্যার প্রফেশনাল',
                  'সহজ ভাষায় লজিক বিল্ড-আপ ও প্রোগ্রামিং প্রশিক্ষণ কৌশল',
                  'যেকোনো পরামর্শ বা পড়ালেখা সংক্রান্ত প্রয়োজনে সার্বক্ষণিক মেন্টরিং'
                ])).map((bullet, bulletIdx) => (
                  <li key={bulletIdx} className="mentor-bullet-item">
                    <CheckCircle2 size={18} color="#10b981" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <a 
                  href={`tel:${mentorSection.phone || '01723619524'}`} 
                  className="btn-hero-primary"
                  style={{ textDecoration: 'none' }}
                >
                  <Phone size={18} /> {isEn ? 'Call Instructor Directly' : 'সরাসরি স্যারের সাথে কথা বলুন'}
                </a>
                <a 
                  href={`https://wa.me/${mentorSection.whatsapp || '8801723619524'}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-hero-enroll"
                  style={{ textDecoration: 'none' }}
                >
                  <MessageCircle size={18} /> {isEn ? 'WhatsApp Message' : 'হোয়াটসঅ্যাপ মেসেজ'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="faq-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-section-pill">
              <Lightbulb size={14} /> {isEn ? 'Common Inquiries' : 'সাধারণ জিজ্ঞাসা'}
            </div>
            <h2 className="lp-section-title">{isEn ? 'Frequently Asked Questions (FAQ)' : 'সচরাচর জিজ্ঞাসিত প্রশ্নসমূহ'}</h2>
            <p className="lp-section-subtitle">{isEn ? 'Quick answers to common questions for students and parents.' : 'শিক্ষার্থী ও অভিভাবকদের সাধারণ প্রশ্নের উত্তর এক নজরে।'}</p>
          </div>

          <div className="faq-grid">
            {(customFaq && customFaq.length > 0 ? customFaq : (isEn ? [
              {
                question: 'I have no prior computer or coding experience. Can I succeed?',
                answer: 'Absolutely! Our curriculum starts from ground zero. Algorithms, flowcharts, and C programming are taught with simple real-life examples on live laptop displays so anyone can grasp them easily.'
              },
              {
                question: 'How do I log in to the Student Portal?',
                answer: 'No complicated ID or password needed. Simply click the "Login" button above and enter the mobile number registered during your admission for 1-second instant access.'
              },
              {
                question: 'What if I miss a scheduled class?',
                answer: 'If you miss a class due to illness or exam conflicts, you can easily attend a free backup session or join another batch by consulting the instructor.'
              },
              {
                question: 'How do I apply for admission?',
                answer: 'You can submit the "Online Admission" form on this website or visit our physical campus at Kushtia Govt. College Gate directly.'
              }
            ] : [
              {
                question: 'আমার আগে কোনো কোডিং বা কম্পিউটার অভিজ্ঞতা নেই, আমি কি পারব?',
                answer: 'অবশ্যই! আমাদের কোর্সটি একদম জিরো লেভেল থেকে শুরু হয়। অ্যালগরিদম, ফ্লোচার্ট ও সি প্রোগ্রামিং এত সহজ উদাহরণ দিয়ে ক্লাসে ল্যাপটপে দেখানো হয় যে কোনো পূর্ব অভিজ্ঞতা ছাড়াই যে কেউ সহজেই বুঝতে পারে।'
              },
              {
                question: 'স্টুডেন্ট পোর্টালে লগইন করার নিয়ম কী?',
                answer: 'কোনো জটিল আইডি বা পাসওয়ার্ডের ঝামেলা নেই। ভর্তি হওয়ার সময় যে মোবাইল নম্বর দিয়েছেন, সেই নম্বরটি দিয়েই উপরের "লগইন" বাটনে ক্লিক করে এক সেকেন্ডে লগইন করা যায়।'
              },
              {
                question: 'কোনো ক্লাস মিস হয়ে গেলে কীভাবে কভার করব?',
                answer: 'অসুস্থতা বা পরীক্ষার কারণে কোনো ক্লাস মিস হলে আমাদের স্যারের সাথে কথা বলে ব্যাকআপ ক্লাসে বা অন্য ব্যাচের সাথে ক্লাসটি ফ্রিতে কভার করে নেওয়া যায়।'
              },
              {
                question: 'ভর্তি হতে চাইলে কীভাবে আবেদন করব?',
                answer: 'আমাদের ওয়েবসাইটে "অনলাইন ভর্তি আবেদন" ফর্মে নাম ও ফোন নম্বর দিয়ে আবেদন করতে পারেন, অথবা কুষ্টিয়া সরকারি কলেজ গেটের ক্যাম্পাসে সরাসরি এসে ভর্তি হতে পারেন।'
              }
            ])).map((faqItem, fIdx) => (
              <div key={faqItem.id || fIdx} className="faq-card">
                <h4 className="faq-q">
                  <span style={{ color: '#38bdf8' }}>Q.</span> {faqItem.question}
                </h4>
                <p className="faq-a">
                  {faqItem.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FINAL HIGH-CONVERSION CTA BANNER */}
      <section className="cta-banner-section">
        <div className="lp-container">
          <div className="cta-banner-card">
            <h2 className="cta-banner-title">
              {isEn 
                ? 'No More Fear in HSC ICT, Join the Best Preparation Now!' 
                : 'HSC ICT-তে আর কোনো ভয় নয়, এখনই যুক্ত হও সেরা প্রস্তুতিতে!'}
            </h2>
            <p className="cta-banner-sub">
              {isEn 
                ? 'Secure your seat in our limited batches. Experience live projector and laptop lab sessions to stay ahead.' 
                : 'সীমিত আসনের প্রতিটি ব্যাচে তোমার স্থান নিশ্চিত করো। প্রজেক্টর ও কম্পিউটার ল্যাবে সরাসরি ক্লাস করার সুযোগ নিয়ে নিজেকে এগিয়ে রাখো।'}
            </p>

            <div className="cta-banner-actions">
              <button 
                type="button" 
                onClick={onGoToEnroll}
                className="btn-cta-student"
              >
                <Sparkles size={18} color="#0284c7" />
                {isEn ? 'Apply for Online Admission' : 'অনলাইন ভর্তি আবেদন করুন'}
              </button>

              <button 
                type="button" 
                onClick={handleOpenLogin}
                className="btn-hero-enroll"
                style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', borderColor: '#ffffff' }}
              >
                <Lock size={18} />
                {isEn ? 'Login' : 'লগইন করুন'}
              </button>

              <a 
                href={`tel:${contact.phoneRaw || mentorSection.phone || '01723619524'}`} 
                className="btn-cta-call"
              >
                <Phone size={18} /> {isEn ? `Hotline: ${contact.phoneRaw || mentorSection.phone || '01723619524'}` : `হটলাইন: ${contact.phoneRaw || mentorSection.phone || '01723619524'}`}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer id="contact" className="landing-footer">
        <div className="lp-container">
          <div className="footer-grid">
            {/* Col 1: Brand Info */}
            <div>
              <div className="nav-brand" style={{ marginBottom: '1rem' }}>
                <div className="nav-logo-box">
                  <img src={brand.logoUrl || "/logo.png"} alt="Maruf's ICT Care Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                </div>
                <div>
                  <div className="nav-brand-title">
                    {brand.titlePrefix || "Maruf's"} <span>{brand.titleHighlight || "ICT Care"}</span>
                  </div>
                  <div className="nav-brand-sub">{brand.tagline || (isEn ? "Do Not Memorize ICT, Let Us Learn Practically" : "ICT মুখস্ত নয়, এসো শিখি")}</div>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isEn 
                  ? 'Comprehensive theoretical and hands-on lab learning center for HSC Information & Communication Technology (ICT). Kushtia Govt. College Gate, Kushtia.' 
                  : 'এইচএসসি তথ্য ও যোগাযোগ প্রযুক্তি (ICT) বিষয়ের পূর্ণাঙ্গ তাত্ত্বিক ও ব্যবহারিক ল্যাব শিক্ষা কেন্দ্র। কুষ্টিয়া সরকারি কলেজ গেট, কুষ্টিয়া।'}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a 
                  href={`https://wa.me/${contact.whatsapp || '8801723619524'}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  <MessageCircle size={14} /> {isEn ? 'WhatsApp Support' : 'হোয়াটসঅ্যাপ সাপোর্ট'}
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="footer-col-title">{isEn ? 'Quick Links' : 'দ্রুত লিংক'}</h4>
              <ul className="footer-links-list">
                <li><a href="#hero" className="footer-link-item">{isEn ? 'Home Page' : 'হোম পেজ'}</a></li>
                <li><a href="#syllabus" className="footer-link-item">{isEn ? 'HSC ICT Syllabus' : 'HSC ICT সিলেবাস'}</a></li>
                <li><a href="#batches" className="footer-link-item">{isEn ? 'Active Batches & Schedule' : 'চলমান ব্যাচ ও শিডিউল'}</a></li>
                <li><a href="#features" className="footer-link-item">{isEn ? 'Why We Are Unique' : 'কেন আমরা সেরা'}</a></li>
                <li><a href="#mentor" className="footer-link-item">{isEn ? 'Instructor Profile' : 'শিক্ষক পরিচিতি'}</a></li>
              </ul>
            </div>

            {/* Col 3: Portals */}
            <div>
              <h4 className="footer-col-title">{isEn ? 'Portals & Services' : 'পোর্টাল ও সার্ভিসেস'}</h4>
              <ul className="footer-links-list">
                <li>
                  <span className="footer-link-item" onClick={handleOpenLogin} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Lock size={14} /> {isEn ? 'Portal Login' : 'পোর্টাল লগইন'}
                  </span>
                </li>
                <li>
                  <span className="footer-link-item" onClick={onGoToEnroll} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={14} /> {isEn ? 'Online Admission Form' : 'সরাসরি ভর্তি আবেদন'}
                  </span>
                </li>
                {isAdminLoggedIn && (
                  <li>
                    <span className="footer-link-item" onClick={onGoToDashboard} style={{ color: '#38bdf8', fontWeight: 600 }}>
                      ⚡ {isEn ? 'Admin Control Panel' : 'এডমিন কন্ট্রোল প্যানেল'}
                    </span>
                  </li>
                )}
                {isStudentLoggedIn && (
                  <li>
                    <span className="footer-link-item" onClick={onGoToStudentDashboard} style={{ color: '#38bdf8', fontWeight: 600 }}>
                      🎓 {isEn ? 'Student Control Panel' : 'শিক্ষার্থী কন্ট্রোল প্যানেল'}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Col 4: Contact & Location */}
            <div>
              <h4 className="footer-col-title">{isEn ? 'Contact & Location' : 'যোগাযোগ ও ঠিকানা'}</h4>
              <div className="footer-contact-item">
                <MapPin size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{contact.address || (isEn ? 'Kushtia Govt. College Gate, Kushtia, Bangladesh' : 'কুষ্টিয়া সরকারি কলেজ গেট, কুষ্টিয়া, বাংলাদেশ')}</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{contact.phone || '+৮৮০ ১৭২৩-৬১৯৫২৪'}</span>
              </div>
              <div className="footer-contact-item">
                <Clock size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{contact.hours || (isEn ? '7:00 AM - 8:00 PM (Open Daily)' : 'সকাল ৭:০০ - রাত ৮:০০ (প্রতিদিন খোলা)')}</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <div>
              {contact.copyright || (isEn ? "© 2026 Maruf's ICT Care. All rights reserved." : "© 2026 Maruf's ICT Care. সর্বস্বত্ব সংরক্ষিত।")}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
              {contact.footerTagline || (isEn ? 'Designed for HSC ICT Students • Do Not Memorize ICT, Learn Practically' : 'Designed for HSC ICT Students • ICT মুখস্ত নয়, এসো শিখি')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
