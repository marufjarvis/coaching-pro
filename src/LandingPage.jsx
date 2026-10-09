// src/LandingPage.jsx
// High-Converting, Eye-Catching HSC ICT Coaching Landing Page for Maruf's ICT Care
// Designed to mesmerize students and provide seamless navigation to Student & Admin Portals

import React, { useState, useMemo } from 'react';
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
  Play, 
  Lightbulb, 
  Binary, 
  MessageCircle, 
  Menu, 
  X, 
  ExternalLink,
  ChevronRight,
  Laptop,
  Layers,
  FileCheck,
  Send,
  Lock
} from 'lucide-react';
import './landing-page.css';

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
  const [activeTab, setActiveTab] = useState('c_program'); // 'c_program' | 'html' | 'logic_gate' | 'number_converter'
  
  // Interactive Simulator States
  const [codeRunOutput, setCodeRunOutput] = useState(false);
  const [gateA, setGateA] = useState(true);
  const [gateB, setGateB] = useState(false);
  const [gateType, setGateType] = useState('AND'); // 'AND' | 'OR' | 'XOR'
  
  // Interactive Number Converter State
  const [decInput, setDecInput] = useState('25');
  
  // Expanded Chapter Modal/Details
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Calculate Logic Gate Output
  const gateOutput = useMemo(() => {
    if (gateType === 'AND') return gateA && gateB;
    if (gateType === 'OR') return gateA || gateB;
    if (gateType === 'XOR') return (gateA && !gateB) || (!gateA && gateB);
    return false;
  }, [gateA, gateB, gateType]);

  // Calculate Number System Conversions
  const convertedNums = useMemo(() => {
    const val = parseInt(decInput, 10);
    if (isNaN(val) || val < 0) {
      return { bin: '০', oct: '০', hex: '০' };
    }
    return {
      bin: val.toString(2),
      oct: val.toString(8),
      hex: val.toString(16).toUpperCase()
    };
  }, [decInput]);

  // HSC ICT 6 Chapters Data
  const chapters = [
    {
      num: '০১',
      titleBn: 'তথ্য ও যোগাযোগ প্রযুক্তি: বিশ্ব ও বাংলাদেশ প্রেক্ষিত',
      titleEn: 'Global & Bangladesh Perspective',
      icon: Globe,
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
      num: '০২',
      titleBn: 'কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং',
      titleEn: 'Communication & Computer Networking',
      icon: Cpu,
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
      num: '০৩',
      titleBn: 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস',
      titleEn: 'Number Systems & Digital Logic Gates',
      icon: Binary,
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
      num: '০৪',
      titleBn: 'ওয়েব ডিজাইন পরিচিতি এবং HTML',
      titleEn: 'Web Design & HTML5 Structure',
      icon: Code,
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
      num: '০৫',
      titleBn: 'প্রোগ্রামিং ভাষা (C Programming)',
      titleEn: 'Programming Languages & C Language',
      icon: Terminal,
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
      num: '০৬',
      titleBn: 'ডেটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)',
      titleEn: 'Database Management Systems & SQL',
      icon: Database,
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
  ];

  // Active Batches to Display
  const defaultBatches = [
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
    tagline: 'HSC ICT স্পেশাল একাডেমিক কেয়ার',
    days: i % 2 === 0 ? 'শনি, সোম, বুধ' : 'রবি, মঙ্গল, বৃহস্পতি',
    time: i === 0 ? 'সকাল ৮:০০ ও বিকাল ৪:০০' : 'সকাল ৯:০০ ও বিকাল ৫:০০',
    seatsLeft: 'সীমিত আসন',
    status: 'ভর্তি চলছে',
    featured: i === 0
  })) : defaultBatches;

  // Student Testimonials
  const testimonials = [
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
  ];

  return (
    <div className="landing-page">
      {/* Background Ambient Lighting */}
      <div className="landing-ambient-glow-1"></div>
      <div className="landing-ambient-glow-2"></div>
      <div className="landing-ambient-glow-3"></div>

      {/* STICKY HEADER SECTION (Top Announcement Bar + Navigation Bar) */}
      <header className="landing-header-sticky">
        {/* 1. TOP NOTICE BAR */}
        <div className="top-announcement-bar">
          <div className="top-announcement-content">
            <span className="announcement-badge">অফার ও আপডেট</span>
            <span>📢 HSC 2026 ও 2025 ব্যাচে সীমিত আসনে নতুন ভর্তি চলছে! সরাসরি ক্লাসরুমে ল্যাব সাপোর্ট।</span>
            <span className="announcement-link" onClick={onGoToEnroll}>
              অনলাইন ভর্তি আবেদন <ArrowRight size={14} />
            </span>
          </div>
        </div>

        {/* 2. NAVIGATION BAR */}
        <nav className="landing-nav">
          <div className="nav-container">
            {/* Logo & Branding */}
            <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="nav-logo-box">
                <img src="/logo.png" alt="Maruf's ICT Care Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              </div>
              <div>
                <div className="nav-brand-title">
                  Maruf's <span>ICT Care</span>
                </div>
                <div className="nav-brand-sub">ICT মুখস্ত নয়, এসো শিখি</div>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <ul className="nav-links-desktop">
              <li><a href="#hero" className="nav-link-item">হোম</a></li>
              <li><a href="#courses" className="nav-link-item">কোর্স</a></li>
              <li><a href="#batches" className="nav-link-item">ব্যাচ</a></li>
              <li><a href="#success" className="nav-link-item">সাফল্য</a></li>
              <li><a href="#mentor" className="nav-link-item">শিক্ষক</a></li>
              <li><a href="#contact" className="nav-link-item">যোগাযোগ</a></li>
            </ul>

            {/* Header Action Buttons - Only Login Button */}
            <div className="nav-actions">
              {/* If Admin is Logged In */}
              {isAdminLoggedIn && (
                <button 
                  type="button" 
                  onClick={onGoToDashboard} 
                  className="btn-nav-admin"
                  style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', borderColor: '#38bdf8' }}
                  title="এডমিন ড্যাশবোর্ডে প্রবেশ করুন"
                >
                  <ShieldCheck size={16} /> এডমিন ড্যাশবোর্ড
                </button>
              )}

              {/* If Student is Logged In */}
              {isStudentLoggedIn && (
                <button 
                  type="button" 
                  onClick={onGoToStudentDashboard} 
                  className="btn-nav-student"
                  title="আমার স্টুডেন্ট ড্যাশবোর্ড"
                >
                  <GraduationCap size={16} /> আমার ড্যাশবোর্ড
                </button>
              )}

              {/* Single Unified Login Button */}
              {(!isAdminLoggedIn && !isStudentLoggedIn) && (
                <button 
                  type="button" 
                  onClick={handleOpenLogin} 
                  className="btn-nav-login"
                  id="btn-login-nav"
                  title="লগইন করুন"
                >
                  <Lock size={15} strokeWidth={2.5} /> লগইন
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
              <a href="#hero" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>হোম</a>
              <a href="#courses" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>কোর্স</a>
              <a href="#batches" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>ব্যাচ</a>
              <a href="#success" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>সাফল্য</a>
              <a href="#mentor" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>শিক্ষক</a>
              <a href="#contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>যোগাযোগ</a>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.75rem' }}>
                {isAdminLoggedIn && (
                  <button 
                    type="button" 
                    onClick={() => { setMobileMenuOpen(false); onGoToDashboard(); }} 
                    className="btn-nav-admin"
                    style={{ justifyContent: 'center' }}
                  >
                    <ShieldCheck size={16} /> এডমিন ড্যাশবোর্ড
                  </button>
                )}

                {isStudentLoggedIn && (
                  <button 
                    type="button" 
                    onClick={() => { setMobileMenuOpen(false); onGoToStudentDashboard(); }} 
                    className="btn-nav-student"
                    style={{ justifyContent: 'center' }}
                  >
                    <GraduationCap size={18} /> আমার ড্যাশবোর্ড
                  </button>
                )}

                {(!isAdminLoggedIn && !isStudentLoggedIn) && (
                  <button 
                    type="button" 
                    onClick={() => { setMobileMenuOpen(false); handleOpenLogin(); }} 
                    className="btn-nav-login"
                    style={{ justifyContent: 'center' }}
                  >
                    <Lock size={16} strokeWidth={2.5} /> লগইন
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
                <Sparkles size={14} /> কুষ্টিয়ার সেরা HSC ICT লার্নিং সেন্টার
              </div>

              <h1 className="hero-title">
                HSC ICT-তে A+ নিশ্চিত করতে <br />
                <span className="hero-title-highlight">মুখস্ত নয়, এসো প্রযুক্তির সাথে শিখি</span>
              </h1>

              <p className="hero-subtitle">
                তথ্য ও যোগাযোগ প্রযুক্তি মুখস্ত করার বিষয় নয়! সি প্রোগ্রামিং, এইচটিএমএল টেবিল, লজিক গেইট এবং ডেটাবেজ ম্যানেজমেন্ট প্রজেক্টর ও ল্যাপটপে হাতে-কলমে প্র্যাকটিক্যাল ল্যাবে আয়ত্ত করে বোর্ড পরীক্ষায় পূর্ণাঙ্গ ১০০ নম্বর অর্জন করো।
              </p>

              {/* Subject Chapter Highlights Row */}
              <div className="hero-badges-row">
                <span className="hero-badge-tag"><Binary size={15} color="#f59e0b" /> সংখ্যা পদ্ধতি ও লজিক গেইট</span>
                <span className="hero-badge-tag"><Code size={15} color="#10b981" /> HTML5 ওয়েব ডিজাইন</span>
                <span className="hero-badge-tag"><Terminal size={15} color="#ec4899" /> সি প্রোগ্রামিং ল্যাব</span>
                <span className="hero-badge-tag"><Database size={15} color="#6366f1" /> SQL ডেটাবেজ</span>
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
                  লগইন করুন
                  <ArrowRight size={18} />
                </button>

                <button 
                  type="button" 
                  onClick={onGoToEnroll} 
                  className="btn-hero-enroll"
                  id="btn-hero-enroll"
                >
                  <Sparkles size={18} />
                  অনলাইন ভর্তি আবেদন
                </button>
              </div>

              {/* Hero Stats */}
              <div className="hero-stats-row">
                <div className="stat-item">
                  <h3>৯৮%+</h3>
                  <p>বোর্ড পরীক্ষায় A+ পাশের হার</p>
                </div>
                <div className="stat-item">
                  <h3>১,২০০+</h3>
                  <p>সফল ও সন্তুষ্ট শিক্ষার্থী</p>
                </div>
                <div className="stat-item">
                  <h3>১০০%</h3>
                  <p>প্র্যাকটিক্যাল ল্যাব সাপোর্ট</p>
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
                    src="/m2.png" 
                    alt="মারুফ হোসেন - HSC ICT মেন্টর" 
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
                    <div className="float-badge-title">মারুফ হোসেন</div>
                    <div className="float-badge-sub">প্রধান শিক্ষক ও প্রতিষ্ঠাতা</div>
                  </div>
                </div>

                {/* Floating Badge 2: Top-Left Experience & Specialist */}
                <div className="hero-float-badge hero-float-top-left">
                  <div className="float-badge-icon badge-accent-green">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="float-badge-title">HSC ICT স্পেশালিস্ট</div>
                    <div className="float-badge-sub">১০+ বছর সফল পাঠদান</div>
                  </div>
                </div>

                {/* Floating Badge 3: Bottom-Left 1200+ A+ Students (Shifted to Side) */}
                <div className="hero-float-badge hero-float-bottom-left">
                  <div className="float-badge-icon badge-accent-amber">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <div className="float-badge-title">১,২০০+ শিক্ষার্থী A+</div>
                    <div className="float-badge-rating">
                      <span>★★★★★</span> <small>৫.০ রেটিং</small>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 4: Bottom-Right Live Lab Pulse (Shifted to Side) */}
                <div className="hero-float-badge hero-float-bottom-right">
                  <span className="pulse-indicator"></span>
                  <div>
                    <div className="float-badge-title" style={{ color: '#34d399' }}>সরাসরি ল্যাব ক্লাস</div>
                    <div className="float-badge-sub">ল্যাপটপ ও প্রজেক্টরে প্র্যাকটিস</div>
                  </div>
                </div>

                {/* Open Mentor Credentials (Directly on Page Background, No Boxy Card) */}
                <div className="hero-mentor-credentials">
                  <div className="mentor-cred-name-row">
                    <span className="mentor-cred-name">মারুফ হোসেন</span>
                    <span className="mentor-verified-badge" title="সার্টিফাইড ICT শিক্ষক">
                      <CheckCircle2 size={18} color="#38bdf8" />
                    </span>
                  </div>
                  <div className="mentor-cred-role">
                    AI Engineer | Blockchain Developer | Quantum Expert
                  </div>
                  <div className="mentor-cred-chips">
                    <span className="mentor-chip chip-ai">🤖 Artificial Intelligence</span>
                    <span className="mentor-chip chip-blockchain">⛓️ Blockchain & Web3</span>
                    <span className="mentor-chip chip-quantum">⚛️ Quantum Computing</span>
                    <span className="mentor-chip chip-ml">🧠 Deep Learning & LLMs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COURSES / SYLLABUS SECTION (HSC ICT অধ্যায় ১ - ৬) */}
      <section id="courses" className="curriculum-section">
        <div id="syllabus" style={{ position: 'relative', top: '-80px', visibility: 'hidden' }}></div>
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-section-pill">
              <BookOpen size={14} /> পূর্ণাঙ্গ বোর্ড কারিকুলাম
            </div>
            <h2 className="lp-section-title">
              HSC ICT সম্পূর্ণ পাঠ্যসূচি (অধ্যায় ১ - ৬)
            </h2>
            <p className="lp-section-subtitle">
              প্রতিটি অধ্যায়ের জটিল টপিকগুলোকে সহজবোধ্য অ্যানিমেশন, ল্যাব প্র্যাকটিস এবং বিগত ১০ বছরের বোর্ড প্রশ্ন বিশ্লেষণের মাধ্যমে পূর্ণাঙ্গ প্রস্তুত করা হয়।
            </p>
          </div>

          <div className="chapters-grid">
            {chapters.map((ch, idx) => {
              const IconComp = ch.icon;
              return (
                <div key={idx} className="chapter-card">
                  <div className="chapter-card-top">
                    <span className="chapter-num-badge">অধ্যায় {ch.num}</span>
                    <div className="chapter-icon-box" style={{ background: ch.bgGrad, color: ch.color }}>
                      <IconComp size={22} />
                    </div>
                  </div>

                  <h3 className="chapter-title">{ch.titleBn}</h3>
                  <div className="chapter-eng">{ch.titleEn}</div>

                  <ul className="chapter-topics-list">
                    {ch.topics.map((t, tIdx) => (
                      <li key={tIdx} className="chapter-topic-item">
                        <span className="chapter-topic-bullet">▸</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="chapter-card-footer">
                    <span className="chapter-cq-badge">{ch.cqMarks}</span>
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
                      বিস্তারিত দেখুন <ChevronRight size={14} />
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
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setSelectedChapter(null)}
        >
          <div 
            style={{
              background: '#0f172a',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              onClick={() => setSelectedChapter(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div 
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: selectedChapter.bgGrad,
                  color: selectedChapter.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <selectedChapter.icon size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: selectedChapter.color, fontWeight: 700 }}>
                  অধ্যায় {selectedChapter.num} স্পেশাল গাইডলাইন
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 800 }}>{selectedChapter.titleBn}</h3>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem', background: '#090f1d', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#38bdf8', marginBottom: '0.4rem', fontWeight: 700 }}>🔬 ক্লাসরুম প্র্যাকটিক্যাল সুবিধা:</h4>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{selectedChapter.practical}</p>
            </div>

            <div style={{ marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#34d399', marginBottom: '0.4rem', fontWeight: 700 }}>💡 বোর্ড পরীক্ষার কৌশল ও টিপস:</h4>
              <p style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{selectedChapter.tips}</p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                type="button" 
                onClick={() => { setSelectedChapter(null); onGoToEnroll(); }}
                className="btn-batch-enroll"
              >
                ভর্তি আবেদন করুন
              </button>
              <button 
                type="button" 
                onClick={() => setSelectedChapter(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  borderRadius: '10px',
                  padding: '0.8rem 1.25rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE LIVE LAB SIMULATOR SECTION */}
      <section id="lab-demo" className="interactive-lab-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-section-pill">
              <Terminal size={14} /> ইন্টারঅ্যাক্টিভ লাইভ ল্যাব
            </div>
            <h2 className="lp-section-title">
              ক্লাসরুমের মতো লাইভ ল্যাব সিমুলেটর
            </h2>
            <p className="lp-section-subtitle">
              তথ্য ও যোগাযোগ প্রযুক্তি প্র্যাকটিক্যাল ল্যাবে হাতে-কলমে শেখার বিষয়। নিজেই কোড রান করো, লজিক গেইট সুইচ অন-অফ করো ও সংখ্যা পদ্ধতির ম্যাজিক রূপান্তর পরীক্ষা করো।
            </p>
          </div>

          <div className="lab-demo-wrapper">
            <div className="hero-terminal-card lab-card-full">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>

                <div className="terminal-tabs">
                  <button 
                    type="button" 
                    onClick={() => { setActiveTab('c_program'); setCodeRunOutput(false); }}
                    className={`terminal-tab-btn ${activeTab === 'c_program' ? 'active' : ''}`}
                  >
                    <Terminal size={13} /> C প্রোগ্রামিং
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('logic_gate')}
                    className={`terminal-tab-btn ${activeTab === 'logic_gate' ? 'active' : ''}`}
                  >
                    <Cpu size={13} /> লজিক গেইট
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('number_converter')}
                    className={`terminal-tab-btn ${activeTab === 'number_converter' ? 'active' : ''}`}
                  >
                    <Binary size={13} /> সংখ্যা পদ্ধতি
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('html')}
                    className={`terminal-tab-btn ${activeTab === 'html' ? 'active' : ''}`}
                  >
                    <Code size={13} /> HTML5 ওয়েব
                  </button>
                </div>
              </div>

              <div className="terminal-body">
                {/* Tab 1: C Programming Interactive Simulator */}
                {activeTab === 'c_program' && (
                  <div>
                    <div className="code-box">
                      <span className="code-comment">// HSC ICT অধ্যায় ৫: লিপ ইয়ার নির্ণয় প্রোগ্রাম</span><br />
                      <span className="code-keyword">#include</span> &lt;stdio.h&gt;<br />
                      <span className="code-keyword">int</span> <span className="code-fn">main</span>() &#123;<br />
                      &nbsp;&nbsp;<span className="code-keyword">int</span> year = <span className="code-num">2026</span>;<br />
                      &nbsp;&nbsp;<span className="code-keyword">if</span> ((year % <span className="code-num">4</span> == <span className="code-num">0</span> &amp;&amp; year % <span className="code-num">100</span> != <span className="code-num">0</span>) || (year % <span className="code-num">400</span> == <span className="code-num">0</span>)) &#123;<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-fn">printf</span>(<span className="code-string">"ICT Care: %d is a Leap Year!\n"</span>, year);<br />
                      &nbsp;&nbsp;&#125; <span className="code-keyword">else</span> &#123;<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-fn">printf</span>(<span className="code-string">"ICT Care: %d is Not a Leap Year.\n"</span>, year);<br />
                      &nbsp;&nbsp;&#125;<br />
                      &nbsp;&nbsp;<span className="code-keyword">return</span> <span className="code-num">0</span>;<br />
                      &#125;
                    </div>

                    <div className="code-run-bar">
                      <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>ল্যাপটপ কোড এডিটর সিমুলেশন</span>
                      <button 
                        type="button" 
                        onClick={() => setCodeRunOutput(true)} 
                        className="btn-code-run"
                      >
                        <Play size={14} /> কোড রান করুন
                      </button>
                    </div>

                    {codeRunOutput ? (
                      <div className="terminal-output">
                        &gt; gcc leap_year.c -o main &amp;&amp; ./main<br />
                        <span style={{ color: '#38bdf8' }}>[Compiler Success 0.04s]</span><br />
                        ICT Care: 2026 is Not a Leap Year. (পরবর্তী লিপ ইয়ার: ২০২৮)
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '0.5rem' }}>
                        "কোড রান করুন" বাটনে ক্লিক করে আউটপুট পরীক্ষা করো
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Logic Gate Lab Simulator */}
                {activeTab === 'logic_gate' && (
                  <div className="gate-lab-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>HSC ICT অধ্যায় ৩: ডিজিটাল লজিক গেইট</span>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {['AND', 'OR', 'XOR'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setGateType(type)}
                            style={{
                              background: gateType === type ? '#0284c7' : 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: '#ffffff',
                              borderRadius: '6px',
                              padding: '0.2rem 0.5rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {type} গেইট
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="gate-controls">
                      {/* Switch A */}
                      <button 
                        type="button" 
                        onClick={() => setGateA(!gateA)} 
                        className={`gate-switch-btn ${gateA ? 'on' : ''}`}
                      >
                        <span>ইনপুট A</span>
                        <span style={{ fontSize: '1.25rem' }}>{gateA ? '1 (HIGH)' : '0 (LOW)'}</span>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>সুইচ ক্লিক করুন</span>
                      </button>

                      <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.2rem' }}>
                        {gateType}
                      </div>

                      {/* Switch B */}
                      <button 
                        type="button" 
                        onClick={() => setGateB(!gateB)} 
                        className={`gate-switch-btn ${gateB ? 'on' : ''}`}
                      >
                        <span>ইনপুট B</span>
                        <span style={{ fontSize: '1.25rem' }}>{gateB ? '1 (HIGH)' : '0 (LOW)'}</span>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>সুইচ ক্লিক করুন</span>
                      </button>

                      {/* Output Bulb */}
                      <div className="gate-bulb-display">
                        <div className={`gate-bulb ${gateOutput ? 'glowing' : ''}`}>
                          <Lightbulb size={24} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: gateOutput ? '#facc15' : '#94a3b8' }}>
                          আউটপুট: {gateOutput ? '1 (বাতি জ্বলছে)' : '0 (বন্ধ)'}
                        </span>
                      </div>
                    </div>

                    <div style={{ background: '#080c16', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.06)' }}>
                      💡 <strong>সত্যক সারণী সূত্র ({gateType}):</strong>{' '}
                      {gateType === 'AND' && 'উভয় ইনপুট ১ হলেই কেবল আউটপুট ১ হবে।'}
                      {gateType === 'OR' && 'যেকোনো একটি ইনপুট ১ হলেই আউটপুট ১ হবে।'}
                      {gateType === 'XOR' && 'উভয় ইনপুটের মান অসমান হলে আউটপুট ১ হবে।'}
                    </div>
                  </div>
                )}

                {/* Tab 3: Interactive Number Converter */}
                {activeTab === 'number_converter' && (
                  <div className="num-converter-box">
                    <div className="num-converter-input-wrap">
                      <label>HSC ICT অধ্যায় ৩: ডেসিমাল সংখ্যা লিখুন (সংখ্যা পদ্ধতি জাদু)</label>
                      <input 
                        type="number" 
                        value={decInput} 
                        onChange={(e) => setDecInput(e.target.value)} 
                        className="num-converter-input"
                        placeholder="যেকোনো সংখ্যা লিখুন..."
                      />
                    </div>

                    <div className="num-converter-results">
                      <div className="num-res-card">
                        <div className="label">বাইনারি (ভিত্তি ২)</div>
                        <div className="val">{convertedNums.bin}₂</div>
                      </div>
                      <div className="num-res-card">
                        <div className="label">অক্টাল (ভিত্তি ৮)</div>
                        <div className="val">{convertedNums.oct}₈</div>
                      </div>
                      <div className="num-res-card">
                        <div className="label">হেক্সাডেসিমাল (ভিত্তি ১৬)</div>
                        <div className="val">{convertedNums.hex}₁₆</div>
                      </div>
                    </div>

                    <div style={{ background: '#080c16', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)' }}>
                      ✨ <strong>ম্যাজিক ট্রিক:</strong> বোর্ডে ২-এর পরিপূরক ও সংখ্যা পদ্ধতির জটিল রূপান্তরগুলো ক্লাসে ক্যালকুলেটর শর্টকাট ও হ্যান্ড ক্যালকুলেশনে সহজ নিয়মে শেখানো হয়।
                    </div>
                  </div>
                )}

                {/* Tab 4: HTML5 Web Preview */}
                {activeTab === 'html' && (
                  <div>
                    <div className="code-box">
                      <span className="code-keyword">&lt;table</span> <span className="code-fn">border</span>=<span className="code-string">"1"</span> <span className="code-fn">style</span>=<span className="code-string">"width:100%"</span>&gt;<br />
                      &nbsp;&nbsp;&lt;tr&gt;<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&lt;th&gt;রোল&lt;/th&gt;&lt;th&gt;নাম&lt;/th&gt;&lt;th&gt;ICT গ্রেড&lt;/th&gt;<br />
                      &nbsp;&nbsp;&lt;/tr&gt;<br />
                      &nbsp;&nbsp;&lt;tr&gt;<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&lt;td&gt;১০১&lt;/td&gt;&lt;td&gt;মারুফ হোসেন&lt;/td&gt;&lt;td <span className="code-fn">style</span>=<span className="code-string">"color:lime"</span>&gt;A+&lt;/td&gt;<br />
                      &nbsp;&nbsp;&lt;/tr&gt;<br />
                      <span className="code-keyword">&lt;/table&gt;</span>
                    </div>

                    <div style={{ background: '#090f1d', border: '1px solid #1e293b', padding: '0.85rem', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem' }}>ব্রাউজার রেন্ডার প্রিভিউ:</div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.85rem', color: '#ffffff' }}>
                        <thead>
                          <tr style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
                            <th style={{ padding: '6px' }}>রোল</th>
                            <th style={{ padding: '6px' }}>নাম</th>
                            <th style={{ padding: '6px' }}>ICT গ্রেড</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '6px' }}>১০১</td>
                            <td style={{ padding: '6px' }}>মারুফ হোসেন</td>
                            <td style={{ padding: '6px', color: '#34d399', fontWeight: 'bold' }}>A+</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY MARUF'S ICT CARE SECTION */}
      <section id="features" className="why-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-section-pill">
              <Award size={14} /> কেন আমরা অদ্বিতীয়
            </div>
            <h2 className="lp-section-title">
              কেন Maruf's ICT Care শিক্ষার্থীদের সেরা পছন্দ?
            </h2>
            <p className="lp-section-subtitle">
              গতানুগতিক ধারার বাইরে গিয়ে আধুনিক তথ্যপ্রযুক্তির সহায়তায় শিক্ষার্থীদের জন্য সম্পূর্ণ ইউনিক একাডেমিক পরিবেশ।
            </p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                <Laptop size={26} />
              </div>
              <h3 className="pillar-title">হাতে-কলমে ল্যাব প্র্যাকটিস</h3>
              <p className="pillar-desc">
                সি প্রোগ্রামিং ও এইচটিএমএল কেবল খাতায় লিখে শেখানো হয় না। মাল্টিমিডিয়া প্রজেক্টর ও ল্যাপটপে সরাসরি কোড কম্পাইল ও রান করিয়ে শেখানো হয়।
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                <BookOpen size={26} />
              </div>
              <h3 className="pillar-title">কালারফুল হ্যান্ডনোট ও প্রশ্নব্যাংক</h3>
              <p className="pillar-desc">
                প্রতিটি অধ্যায়ের জন্য এক্সক্লুসিভ রঙিন শিট ও বিগত ১০ বছরের বোর্ড প্রশ্ন এনালাইসিস করে প্রস্তুতকৃত টাইপভিত্তিক সাজেশন ও মডেল টেস্ট।
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
                <GraduationCap size={26} />
              </div>
              <h3 className="pillar-title">আধুনিক স্টুডেন্ট পোর্টাল</h3>
              <p className="pillar-desc">
                শিক্ষার্থীরা যেকোনো সময় নিজের মোবাইল নম্বর দিয়ে পোর্টালে লগইন করে হাজিরা হিস্ট্রি, মডেল টেস্টের রেজাল্ট ও ফি স্ট্যাটাস দেখতে পারে।
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                <Send size={26} />
              </div>
              <h3 className="pillar-title">অভিভাবকদের অটো SMS আপডেট</h3>
              <p className="pillar-desc">
                শিক্ষার্থী ক্লাসে উপস্থিত বা অনুপস্থিত থাকলে এবং পরীক্ষার ফলাফল প্রকাশিত হওয়ার সাথে সাথে স্বয়ংক্রিয় SMS পৌঁছায় অভিভাবকের ফোনে।
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
                <FileCheck size={26} />
              </div>
              <h3 className="pillar-title">অধ্যায়ভিত্তিক রেগুলার মডেল টেস্ট</h3>
              <p className="pillar-desc">
                বোর্ড স্ট্যান্ডার্ড ওএমআর পদ্ধতিতে ২৫ নম্বরের MCQ এবং ৫০ নম্বরের সৃজনশীল লিখিত পরীক্ষা গ্রহণের মাধ্যমে চূড়ান্ত ভীতি দূর করা হয়।
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap" style={{ background: 'rgba(20, 184, 166, 0.15)', color: '#14b8a6' }}>
                <Lightbulb size={26} />
              </div>
              <h3 className="pillar-title">দুর্বলদের জন্য ফ্রি স্পেশাল কেয়ার</h3>
              <p className="pillar-desc">
                যেসব শিক্ষার্থী কোনো বিষয়ে পিছিয়ে থাকে, তাদের জন্য আলাদা শিডিউলে বিনা খরচে ডাউট ক্লিয়ারিং ও বিশেষ এক্সট্রা ক্লাসের ব্যবস্থা রয়েছে।
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
                <Sparkles size={14} /> ২৪/৭ ডিজিটাল লার্নিং ড্যাশবোর্ড
              </div>

              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, marginBottom: '1.25rem' }}>
                শিক্ষার্থীদের জন্য নিজস্ব <br />
                <span style={{ color: '#38bdf8' }}>অনলাইন স্টুডেন্ট পোর্টাল</span>
              </h2>

              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                আমাদের শিক্ষার্থীরা যেকোনো সময় মোবাইল বা কম্পিউটার থেকে শুধুমাত্র নিবন্ধিত মোবাইল নম্বর দিয়ে এক ক্লিকে নিজের ড্যাশবোর্ডে প্রবেশ করে পড়ালেখার অগ্রগতি মনিটর করতে পারে।
              </p>

              <div className="portal-feature-item">
                <div className="portal-feature-icon">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="portal-feature-title">রিয়েল-টাইম হাজিরা শতকরা হার</h4>
                  <p className="portal-feature-desc">প্রতি মাসের উপস্থিত ও অনুপস্থিত দিনের সঠিক ক্যালকুলেশন ও ক্যালেন্ডার ভিউ।</p>
                </div>
              </div>

              <div className="portal-feature-item">
                <div className="portal-feature-icon">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="portal-feature-title">মডেল টেস্টের ফলাফল ও মার্কশীট</h4>
                  <p className="portal-feature-desc">CQ এবং MCQ নম্বরসহ প্রতিটি পরীক্ষার রিপোর্ট কার্ড ডাউনলোড ও প্রিন্ট সুবিধা।</p>
                </div>
              </div>

              <div className="portal-feature-item">
                <div className="portal-feature-icon">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 className="portal-feature-title">পেমেন্ট রিসিট ও ফি রেকর্ড</h4>
                  <p className="portal-feature-desc">পরিশোধিত ফি, বকেয়া এবং অফিসিয়াল মানি রিসিট তাৎক্ষণিক দেখার সুযোগ।</p>
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
                  পোর্টালে লগইন করুন
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Portal Live Mockup Card */}
            <div className="portal-mockup-wrap">
              <div className="portal-mockup-header">
                <div className="mockup-user-info">
                  <div className="mockup-user-avatar">
                    মা
                  </div>
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>মারুফ'স স্টুডেন্ট পোর্টাল</div>
                    <div style={{ color: '#38bdf8', fontSize: '0.75rem' }}>HSC 2026 ব্যাচ • কুষ্টিয়া</div>
                  </div>
                </div>
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 700 }}>
                  সক্রিয় শিক্ষার্থী
                </span>
              </div>

              <div className="mockup-stats-grid">
                <div className="mockup-stat-box">
                  <div className="mockup-stat-label">হাজিরা পার্সেন্টেজ</div>
                  <div className="mockup-stat-value" style={{ color: '#10b981' }}>৯৪% (নিয়মিত)</div>
                </div>
                <div className="mockup-stat-box">
                  <div className="mockup-stat-label">সর্বশেষ মডেল টেস্ট</div>
                  <div className="mockup-stat-value" style={{ color: '#38bdf8' }}>৯৬/১০০ (A+)</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>অধ্যায়ভিত্তিক প্রস্তুতি অগ্রগতি</span>
                  <span style={{ color: '#38bdf8' }}>৮৫% সম্পন্ন</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #0284c7, #10b981)' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                  <span>অধ্যায় ১-৪ রিভিশন শেষ</span>
                  <span>অধ্যায় ৫ কোডিং চলছে</span>
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
              <Clock size={14} /> আসন সংখ্যা সীমিত
            </div>
            <h2 className="lp-section-title">
              চলমান ব্যাচ ও সময়সূচি
            </h2>
            <p className="lp-section-subtitle">
              প্রতি ব্যাচে সর্বোচ্চ ২০-২৫ জন শিক্ষার্থী নিয়ে ক্লাস পরিচালিত হয়, যাতে প্রতিটি ছাত্র-ছাত্রীর প্রতি আলাদা মনোযোগ নিশ্চিত করা যায়।
            </p>
          </div>

          <div className="batches-grid">
            {currentBatches.map((batch, bIdx) => (
              <div key={bIdx} className={`batch-card ${batch.featured ? 'featured' : ''}`}>
                {batch.featured && (
                  <span className="batch-featured-tag">সর্বাধিক চাহিদাসম্পন্ন</span>
                )}

                <div className="batch-header">
                  <h3 className="batch-title">{batch.title}</h3>
                  <p className="batch-subtitle">{batch.tagline}</p>
                </div>

                <ul className="batch-info-list">
                  <li className="batch-info-item">
                    <Clock size={18} className="batch-info-icon" />
                    <span><strong>ক্লাসের দিন:</strong> {batch.days}</span>
                  </li>
                  <li className="batch-info-item">
                    <Laptop size={18} className="batch-info-icon" />
                    <span><strong>সময়:</strong> {batch.time}</span>
                  </li>
                  <li className="batch-info-item">
                    <Users size={18} className="batch-info-icon" />
                    <span><strong>আসন স্ট্যাটাস:</strong> <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{batch.seatsLeft}</span></span>
                  </li>
                  <li className="batch-info-item">
                    <Award size={18} className="batch-info-icon" />
                    <span><strong>কভারেজ:</strong> অধ্যায় ১-৬ + প্র্যাকটিক্যাল ল্যাব</span>
                  </li>
                </ul>

                <button 
                  type="button" 
                  onClick={() => onGoToEnroll(batch.title)}
                  className="btn-batch-enroll"
                >
                  <Sparkles size={16} /> এই ব্যাচে ভর্তি আবেদন করুন
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
              <Award size={14} /> সাফল্য ও বিশ্বাস
            </div>
            <h2 className="lp-section-title">
              কৃতী শিক্ষার্থীদের মুখে সাফল্যের গল্প
            </h2>
            <p className="lp-section-subtitle">
              কুষ্টিয়া সরকারি কলেজ, মহিলা কলেজ ও ইসলামিয়া কলেজসহ শীর্ষ প্রতিষ্ঠানের শিক্ষার্থীদের অভিজ্ঞতা।
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testi, tIdx) => (
              <div key={tIdx} className="testimonial-card">
                <p className="testi-quote">"{testi.text}"</p>
                <div className="testi-user">
                  <div className="testi-avatar">
                    {testi.name.charAt(0)}
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
                    src="/m2.png" 
                    alt="মারুফ হোসেন - প্রধান প্রশিক্ষক ও মেন্টর" 
                    className="mentor-natural-img"
                    loading="lazy"
                  />
                </div>

                {/* Floating Badge 1: Top-Left Experience */}
                <div className="mentor-float-badge mentor-float-top-left">
                  <Sparkles size={16} color="#34d399" />
                  <span>১০+ বছর অভিজ্ঞতা</span>
                </div>

                {/* Floating Badge 2: Bottom-Right A+ Rating */}
                <div className="mentor-float-badge mentor-float-bottom-right">
                  <Award size={16} color="#38bdf8" />
                  <span>১,২০০+ সফল শিক্ষার্থী</span>
                </div>
              </div>

              {/* Mentor Identification and Highlights */}
              <div className="mentor-info-block">
                <div className="mentor-name-row">
                  <h3 className="mentor-name">মারুফ হোসেন</h3>
                  <span className="mentor-verified-badge" title="সার্টিফাইড লিড ICT মেন্টর">
                    <CheckCircle2 size={18} />
                  </span>
                </div>
                <div className="mentor-designation">AI Engineer | Blockchain Developer | Quantum Expert</div>
                <div className="mentor-skill-pills">
                  <span className="mentor-pill-item">🤖 Artificial Intelligence</span>
                  <span className="mentor-pill-item">⛓️ Blockchain & Web3</span>
                  <span className="mentor-pill-item">⚛️ Quantum Computing</span>
                  <span className="mentor-pill-item">🧠 Deep Learning & LLMs</span>
                </div>
              </div>
            </div>

            <div>
              <div className="hero-pill-badge" style={{ marginBottom: '1rem' }}>
                <Lightbulb size={14} /> "ICT মুখস্ত নয়, এসো শিখি"
              </div>

              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', lineHeight: 1.3 }}>
                প্রযুক্তির যুগে মুখস্ত বিদ্যার কোনো স্থান নেই
              </h2>

              <p className="mentor-bio">
                "এইচএসসি পরীক্ষার সবচেয়ে আধুনিক ও গুরুত্বপূর্ণ বিষয় হচ্ছে তথ্য ও যোগাযোগ প্রযুক্তি (ICT)। কিন্তু অনেকেই সঠিক গাইডলাইনের অভাবে সি প্রোগ্রামিং কিংবা লজিক গেইট মুখস্ত করার চেষ্টা করে হতাশ হয়। আমাদের ক্লাসরুমে প্রতিটি টপিক ল্যাপটপ এবং মাল্টিমিডিয়া স্ক্রিনে জীবন্ত করে তোলা হয়, যাতে প্রতিটি শিক্ষার্থী আত্মবিশ্বাসের সাথে A+ অর্জন করতে পারে।"
              </p>

              <ul className="mentor-bullet-list">
                <li className="mentor-bullet-item">
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>১০+ বছরের অভিজ্ঞ ICT শিক্ষক ও সফটওয়্যার প্রফেশনাল</span>
                </li>
                <li className="mentor-bullet-item">
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>সহজ ভাষায় লজিক বিল্ড-আপ ও প্রোগ্রামিং প্রশিক্ষণ কৌশল</span>
                </li>
                <li className="mentor-bullet-item">
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>যেকোনো পরামর্শ বা পড়ালেখা সংক্রান্ত প্রয়োজনে সার্বক্ষণিক মেন্টরিং</span>
                </li>
              </ul>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <a 
                  href="tel:01723619524" 
                  className="btn-hero-primary"
                  style={{ textDecoration: 'none' }}
                >
                  <Phone size={18} /> সরাসরি স্যারের সাথে কথা বলুন
                </a>
                <a 
                  href="https://wa.me/8801723619524" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-hero-enroll"
                  style={{ textDecoration: 'none' }}
                >
                  <MessageCircle size={18} /> হোয়াটসঅ্যাপ মেসেজ
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
              <Lightbulb size={14} /> সাধারণ জিজ্ঞাসা
            </div>
            <h2 className="lp-section-title">সচরাচর জিজ্ঞাসিত প্রশ্নসমূহ</h2>
            <p className="lp-section-subtitle">শিক্ষার্থী ও অভিভাবকদের সাধারণ প্রশ্নের উত্তর এক নজরে।</p>
          </div>

          <div className="faq-grid">
            <div className="faq-card">
              <h4 className="faq-q">
                <span style={{ color: '#38bdf8' }}>Q.</span> আমার আগে কোনো কোডিং বা কম্পিউটার অভিজ্ঞতা নেই, আমি কি পারব?
              </h4>
              <p className="faq-a">
                অবশ্যই! আমাদের কোর্সটি একদম জিরো লেভেল থেকে শুরু হয়। অ্যালগরিদম, ফ্লোচার্ট ও সি প্রোগ্রামিং এত সহজ উদাহরণ দিয়ে ক্লাসে ল্যাপটপে দেখানো হয় যে কোনো পূর্ব অভিজ্ঞতা ছাড়াই যে কেউ সহজেই বুঝতে পারে।
              </p>
            </div>

            <div className="faq-card">
              <h4 className="faq-q">
                <span style={{ color: '#38bdf8' }}>Q.</span> স্টুডেন্ট পোর্টালে লগইন করার নিয়ম কী?
              </h4>
              <p className="faq-a">
                কোনো জটিল আইডি বা পাসওয়ার্ডের ঝামেলা নেই। ভর্তি হওয়ার সময় যে মোবাইল নম্বর দিয়েছেন, সেই নম্বরটি দিয়েই উপরের "শিক্ষার্থী পোর্টাল" বাটনে ক্লিক করে এক সেকেন্ডে লগইন করা যায়।
              </p>
            </div>

            <div className="faq-card">
              <h4 className="faq-q">
                <span style={{ color: '#38bdf8' }}>Q.</span> কোনো ক্লাস মিস হয়ে গেলে কীভাবে কভার করব?
              </h4>
              <p className="faq-a">
                অসুস্থতা বা পরীক্ষার কারণে কোনো ক্লাস মিস হলে আমাদের স্যারের সাথে কথা বলে ব্যাকআপ ক্লাসে বা অন্য ব্যাচের সাথে ক্লাসটি ফ্রিতে কভার করে নেওয়া যায়।
              </p>
            </div>

            <div className="faq-card">
              <h4 className="faq-q">
                <span style={{ color: '#38bdf8' }}>Q.</span> ভর্তি হতে চাইলে কীভাবে আবেদন করব?
              </h4>
              <p className="faq-a">
                আমাদের ওয়েবসাইটে "অনলাইন ভর্তি আবেদন" ফর্মে নাম ও ফোন নম্বর দিয়ে আবেদন করতে পারেন, অথবা কুষ্টিয়া সরকারি কলেজ গেটের ক্যাম্পাসে সরাসরি এসে ভর্তি হতে পারেন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FINAL HIGH-CONVERSION CTA BANNER */}
      <section className="cta-banner-section">
        <div className="lp-container">
          <div className="cta-banner-card">
            <h2 className="cta-banner-title">
              HSC ICT-তে আর কোনো ভয় নয়, এখনই যুক্ত হও সেরা প্রস্তুতিতে!
            </h2>
            <p className="cta-banner-sub">
              সীমিত আসনের প্রতিটি ব্যাচে তোমার স্থান নিশ্চিত করো। প্রজেক্টর ও কম্পিউটার ল্যাবে সরাসরি ক্লাস করার সুযোগ নিয়ে নিজেকে এগিয়ে রাখো।
            </p>

            <div className="cta-banner-actions">
              <button 
                type="button" 
                onClick={onGoToEnroll}
                className="btn-cta-student"
              >
                <Sparkles size={18} color="#0284c7" />
                অনলাইন ভর্তি আবেদন করুন
              </button>

              <button 
                type="button" 
                onClick={handleOpenLogin}
                className="btn-hero-enroll"
                style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', borderColor: '#ffffff' }}
              >
                <Lock size={18} />
                লগইন করুন
              </button>

              <a 
                href="tel:01723619524" 
                className="btn-cta-call"
              >
                <Phone size={18} /> হটলাইন: 01723619524
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
                  <img src="/logo.png" alt="Maruf's ICT Care Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                </div>
                <div>
                  <div className="nav-brand-title">
                    Maruf's <span>ICT</span> Care
                  </div>
                  <div className="nav-brand-sub">ICT মুখস্ত নয়, এসো শিখি</div>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                এইচএসসি তথ্য ও যোগাযোগ প্রযুক্তি (ICT) বিষয়ের পূর্ণাঙ্গ তাত্ত্বিক ও ব্যবহারিক ল্যাব শিক্ষা কেন্দ্র। কুষ্টিয়া সরকারি কলেজ গেট, কুষ্টিয়া।
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a 
                  href="https://wa.me/8801723619524" 
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
                  <MessageCircle size={14} /> হোয়াটসঅ্যাপ সাপোর্ট
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="footer-col-title">দ্রুত লিংক</h4>
              <ul className="footer-links-list">
                <li><a href="#hero" className="footer-link-item">হোম পেজ</a></li>
                <li><a href="#syllabus" className="footer-link-item">HSC ICT সিলেবাস</a></li>
                <li><a href="#batches" className="footer-link-item">চলমান ব্যাচ ও শিডিউল</a></li>
                <li><a href="#features" className="footer-link-item">কেন আমরা সেরা</a></li>
                <li><a href="#mentor" className="footer-link-item">শিক্ষক পরিচিতি</a></li>
              </ul>
            </div>

            {/* Col 3: Portals */}
            <div>
              <h4 className="footer-col-title">পোর্টাল ও সার্ভিসেস</h4>
              <ul className="footer-links-list">
                <li>
                  <span className="footer-link-item" onClick={handleOpenLogin} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Lock size={14} /> পোর্টাল লগইন
                  </span>
                </li>
                <li>
                  <span className="footer-link-item" onClick={onGoToEnroll} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={14} /> সরাসরি ভর্তি আবেদন
                  </span>
                </li>
                {isAdminLoggedIn && (
                  <li>
                    <span className="footer-link-item" onClick={onGoToDashboard} style={{ color: '#38bdf8', fontWeight: 600 }}>
                      ⚡ এডমিন কন্ট্রোল প্যানেল
                    </span>
                  </li>
                )}
                {isStudentLoggedIn && (
                  <li>
                    <span className="footer-link-item" onClick={onGoToStudentDashboard} style={{ color: '#38bdf8', fontWeight: 600 }}>
                      🎓 শিক্ষার্থী কন্ট্রোল প্যানেল
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Col 4: Contact & Location */}
            <div>
              <h4 className="footer-col-title">যোগাযোগ ও ঠিকানা</h4>
              <div className="footer-contact-item">
                <MapPin size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>কুষ্টিয়া সরকারি কলেজ গেট, কুষ্টিয়া, বাংলাদেশ</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>+৮৮০ ১৭২৩-৬১৯৫২৪</span>
              </div>
              <div className="footer-contact-item">
                <Clock size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>সকাল ৭:০০ - রাত ৮:০০ (প্রতিদিন খোলা)</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <div>
              © 2026 Maruf's ICT Care. সর্বস্বত্ব সংরক্ষিত।
            </div>
            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
              Designed for HSC ICT Students • ICT মুখস্ত নয়, এসো শিখি
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
