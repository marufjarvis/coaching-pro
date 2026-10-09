// src/FrontendSettings.jsx
// Complete Bilingual (EN/BN) Frontend CMS Manager for Coaching Pro
// Allows administrators to dynamically customize all text, stats, banners, teacher bio, reviews & FAQs

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Sparkles, 
  Save, 
  RotateCcw, 
  ExternalLink, 
  CheckCircle2, 
  Bell, 
  Award, 
  Users, 
  HelpCircle, 
  MapPin, 
  Plus, 
  Trash2, 
  Eye, 
  Image, 
  Code,
  TrendingUp,
  FileText,
  BookOpen
} from 'lucide-react';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './frontend-settings.css';

function FrontendSettings({ lang: propLang = 'BN' }) {
  const { lang, setLang } = useTranslation(propLang);
  const isEn = lang === 'EN';

  const [settings, setSettings] = useState(() => dataStore.getFrontendSettings());
  const [activeSubTab, setActiveSubTab] = useState('notice');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaved, setIsSaved] = useState(true);

  // Sync if updated from elsewhere
  useEffect(() => {
    const handleSync = () => {
      setSettings(dataStore.getFrontendSettings());
    };
    window.addEventListener('coaching-data-change', handleSync);
    return () => window.removeEventListener('coaching-data-change', handleSync);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Save changes
  const handleSave = () => {
    dataStore.saveFrontendSettings(settings);
    setIsSaved(true);
    triggerToast(isEn ? 'Landing page settings saved successfully!' : 'ল্যান্ডিং পেজ সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  // Reset to original defaults
  const handleReset = () => {
    const confirmText = isEn 
      ? 'Are you sure you want to restore the default landing page content? Any customized text will be replaced.'
      : 'আপনি কি নিশ্চিত যে ল্যান্ডিং পেজের সকল ডিফল্ট লেখা পুনরুদ্ধার করতে চান? পূর্বের পরিবর্তনগুলো মুছে যাবে।';
    
    if (window.confirm(confirmText)) {
      const def = dataStore.resetFrontendSettings();
      setSettings(def);
      setIsSaved(true);
      triggerToast(isEn ? 'Restored default settings!' : 'ডিফল্ট তথ্য সফলভাবে পুনরুদ্ধার করা হয়েছে!');
    }
  };

  // Helper updater for deep fields
  const updateField = (section, field, value) => {
    setIsSaved(false);
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Image Upload helper
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(isEn ? 'Image size must be under 2MB.' : 'ছবির সাইজ সর্বোচ্চ ২ মেগাবাইট (2MB) হতে পারবে।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('mentorHero', 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Testimonials management
  const handleAddTestimonial = () => {
    setIsSaved(false);
    const newTestimonial = {
      id: Date.now(),
      name: isEn ? 'New Student Name' : 'নতুন শিক্ষার্থীর নাম',
      college: isEn ? 'College / School Name' : 'কলেজ বা স্কুলের নাম',
      score: isEn ? 'ICT: 98/100 (A+)' : 'ICT: ৯৮/১০০ (A+)',
      text: isEn 
        ? 'Practical lab sessions and real code examples made mastering ICT easy and enjoyable!' 
        : 'প্র্যাকটিক্যাল ল্যাব ক্লাস ও নিয়মিত মডেল টেস্টের মাধ্যমে ICT পড়া অনেক সহজ ও আনন্দদায়ক হয়েছে!'
    };
    setSettings(prev => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), newTestimonial]
    }));
  };

  const handleUpdateTestimonial = (index, key, value) => {
    setIsSaved(false);
    setSettings(prev => {
      const list = [...(prev.testimonials || [])];
      list[index] = { ...list[index], [key]: value };
      return { ...prev, testimonials: list };
    });
  };

  const handleDeleteTestimonial = (index) => {
    if (window.confirm(isEn ? 'Delete this review?' : 'এই রিভিউটি মুছে ফেলতে চান?')) {
      setIsSaved(false);
      setSettings(prev => {
        const list = [...(prev.testimonials || [])];
        list.splice(index, 1);
        return { ...prev, testimonials: list };
      });
    }
  };

  // FAQ management
  const handleAddFaq = () => {
    setIsSaved(false);
    const newFaq = {
      id: Date.now(),
      question: isEn ? 'New common question?' : 'নতুন সাধারণ প্রশ্ন?',
      answer: isEn ? 'Write detailed answer here.' : 'এখানে প্রশ্নের বিস্তারিত উত্তর লিখুন।'
    };
    setSettings(prev => ({
      ...prev,
      faq: [...(prev.faq || []), newFaq]
    }));
  };

  const handleUpdateFaq = (index, key, value) => {
    setIsSaved(false);
    setSettings(prev => {
      const list = [...(prev.faq || [])];
      list[index] = { ...list[index], [key]: value };
      return { ...prev, faq: list };
    });
  };

  const handleDeleteFaq = (index) => {
    if (window.confirm(isEn ? 'Delete this FAQ item?' : 'এই প্রশ্নটি মুছে ফেলতে চান?')) {
      setIsSaved(false);
      setSettings(prev => {
        const list = [...(prev.faq || [])];
        list.splice(index, 1);
        return { ...prev, faq: list };
      });
    }
  };

  // Curriculum & Chapters management
  const handleAddChapter = () => {
    setIsSaved(false);
    const chaptersList = settings.curriculum?.chapters || [];
    const nextIdx = chaptersList.length + 1;
    const newCh = {
      id: `ch-${Date.now()}`,
      num: nextIdx < 10 ? `০${nextIdx}` : `${nextIdx}`,
      title: isEn ? `Chapter ${nextIdx} Title` : `অধ্যায় ${nextIdx} শিরোনাম`,
      subtitle: isEn ? `Chapter ${nextIdx} Subtitle` : `সাবটাইটেল বা ইংরেজি শিরোনাম`,
      iconName: 'BookOpen',
      color: '#38bdf8',
      bgGrad: 'rgba(56, 189, 248, 0.15)',
      cqMarks: isEn ? '1 Full Board CQ' : '১টি পূর্ণাঙ্গ CQ প্রশ্ন',
      topics: [
        isEn ? 'Key Topic 1' : 'গুরুত্বপূর্ণ বিষয় ১',
        isEn ? 'Key Topic 2' : 'গুরুত্বপূর্ণ বিষয় ২',
        isEn ? 'Key Topic 3' : 'গুরুত্বপূর্ণ বিষয় ৩'
      ],
      practical: isEn ? 'Classroom lab practice highlights' : 'ল্যাব প্র্যাকটিস ও অ্যানিমেশন সাপোর্ট',
      tips: isEn ? 'Board exam preparation strategy & tips' : 'বোর্ড পরীক্ষার টিপস ও স্ট্র্যাটেজি'
    };
    setSettings(prev => ({
      ...prev,
      curriculum: {
        ...prev.curriculum,
        chapters: [...(prev.curriculum?.chapters || []), newCh]
      }
    }));
  };

  const handleUpdateChapter = (index, key, value) => {
    setIsSaved(false);
    setSettings(prev => {
      const list = [...(prev.curriculum?.chapters || [])];
      list[index] = { ...list[index], [key]: value };
      return {
        ...prev,
        curriculum: {
          ...prev.curriculum,
          chapters: list
        }
      };
    });
  };

  const handleDeleteChapter = (index) => {
    if (window.confirm(isEn ? 'Delete this chapter?' : 'এই অধ্যায়টি মুছে ফেলতে চান?')) {
      setIsSaved(false);
      setSettings(prev => {
        const list = [...(prev.curriculum?.chapters || [])];
        list.splice(index, 1);
        return {
          ...prev,
          curriculum: {
            ...prev.curriculum,
            chapters: list
          }
        };
      });
    }
  };

  return (
    <div className="frontend-cms-wrapper">
      {/* 1. Header Banner */}
      <div className="frontend-header">
        <div className="frontend-header-info">
          <div className="frontend-header-icon">
            <Globe size={24} />
          </div>
          <div>
            <h2 className="frontend-header-title">
              {isEn ? 'Frontend Landing Page Dynamic CMS' : 'Frontend ল্যান্ডিং পেজ ডাইনামিক CMS'}
              <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: 700 }}>
                Live Sync
              </span>
              {!isSaved && (
                <span style={{ fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: 700 }}>
                  {isEn ? 'Unsaved Changes' : 'সংরক্ষণ বাকি'}
                </span>
              )}
            </h2>
            <p className="frontend-header-subtitle">
              {isEn 
                ? 'Manage website text, announcement banners, instructor bio, live statistics, and reviews in real time.'
                : 'ওয়েবসাইটের টেক্সট, অফার ব্যানার, শিক্ষক পরিচিতি, পরিসংখ্যান ও রিভিউ সরাসরি এখান থেকে নিয়ন্ত্রণ করুন।'}
            </p>
          </div>
        </div>

        <div className="frontend-header-actions">
          <a 
            href="#/" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-cms-preview"
            title={isEn ? 'View live website in a new tab' : 'লাইভ ওয়েবসাইট নতুন ট্যাবে দেখুন'}
          >
            <Eye size={16} />
            <span>{isEn ? 'View Website' : 'ওয়েবসাইট দেখুন'}</span>
            <ExternalLink size={13} />
          </a>

          <button 
            type="button" 
            className="btn-cms-reset" 
            onClick={handleReset}
            title={isEn ? 'Reset to default texts' : 'সব ডিফল্ট লেখায় রিসেট করুন'}
          >
            <RotateCcw size={15} />
            <span>{isEn ? 'Reset' : 'রিসেট'}</span>
          </button>

          <button 
            type="button" 
            className="btn-cms-save" 
            onClick={handleSave}
            title={isEn ? 'Save all modifications' : 'সকল পরিবর্তন সংরক্ষণ করুন'}
          >
            <Save size={16} />
            <span>{isEn ? 'Save Changes' : 'সংরক্ষণ করুন'}</span>
          </button>
        </div>
      </div>

      {/* 2. Success Feedback Toast */}
      {showToast && (
        <div className="cms-toast">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. Sub-Tabs Navigation */}
      <div className="cms-tabs-nav">
        <button 
          type="button"
          className={`cms-tab-btn ${activeSubTab === 'notice' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('notice')}
        >
          <Bell size={16} />
          <span>{isEn ? 'Top Notice Bar' : 'টপ নোটিস বার'}</span>
        </button>

        <button 
          type="button"
          className={`cms-tab-btn ${activeSubTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('hero')}
        >
          <Sparkles size={16} />
          <span>{isEn ? 'Hero Section & Stats' : 'হিরো সেকশন ও স্ট্যাটস'}</span>
        </button>

        <button 
          type="button"
          className={`cms-tab-btn ${activeSubTab === 'curriculum' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('curriculum')}
        >
          <BookOpen size={16} />
          <span>{isEn ? `Syllabus (${settings.curriculum?.chapters?.length || 6})` : `পাঠ্যসূচি ও অধ্যায়সমূহ (${settings.curriculum?.chapters?.length || 6})`}</span>
        </button>

        <button 
          type="button"
          className={`cms-tab-btn ${activeSubTab === 'mentor' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('mentor')}
        >
          <Award size={16} />
          <span>{isEn ? 'Instructor & Badges' : 'শিক্ষক পরিচিতি ও ব্যাজ'}</span>
        </button>

        <button 
          type="button"
          className={`cms-tab-btn ${activeSubTab === 'testimonials' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('testimonials')}
        >
          <Users size={16} />
          <span>{isEn ? `Success Stories (${settings.testimonials?.length || 0})` : `সাফল্যের গল্প (${settings.testimonials?.length || 0})`}</span>
        </button>

        <button 
          type="button"
          className={`cms-tab-btn ${activeSubTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('faq')}
        >
          <HelpCircle size={16} />
          <span>{isEn ? `FAQ & Questions (${settings.faq?.length || 0})` : `FAQ ও প্রশ্নসমূহ (${settings.faq?.length || 0})`}</span>
        </button>

        <button 
          type="button"
          className={`cms-tab-btn ${activeSubTab === 'footer' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('footer')}
        >
          <MapPin size={16} />
          <span>{isEn ? 'Contact & Footer' : 'যোগাযোগ ও ফুটার'}</span>
        </button>
      </div>

      {/* 4. Tab Contents */}

      {/* TAB 1: TOP NOTICE BAR */}
      {activeSubTab === 'notice' && (
        <div className="cms-card">
          <h3 className="cms-section-title">
            <Bell size={20} color="#0284c7" /> {isEn ? 'Top Notice & Announcement Bar' : 'শীর্ষ নোটিস ও এনাউন্সমেন্ট বার'}
          </h3>
          <p className="cms-section-subtitle">
            {isEn 
              ? 'Configure the text, badge, and action link for the banner displayed at the very top of the website.'
              : 'ওয়েবসাইটের একদম উপরে যে নোটিস বার প্রদর্শিত হয় তার টেক্সট ও লিংক কনফিগার করুন।'}
          </p>

          <div className="cms-field-group">
            <label className="cms-switch-wrap">
              <input 
                type="checkbox" 
                className="cms-switch-input" 
                checked={settings.notice?.enabled !== false} 
                onChange={(e) => updateField('notice', 'enabled', e.target.checked)} 
              />
              <span style={{ fontWeight: 600 }}>{isEn ? 'Keep notice bar active on website' : 'নোটিস বার ওয়েবসাইটে চালু রাখুন'}</span>
            </label>
          </div>

          <div className="cms-grid-2">
            <div className="cms-field-group">
              <label>{isEn ? 'Notice Badge Text (e.g., Special Announcement):' : 'নোটিস ব্যাজ টেক্সট (যেমন: অফার ও আপডেট):'}</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.notice?.badge || ''} 
                onChange={(e) => updateField('notice', 'badge', e.target.value)} 
                placeholder={isEn ? 'Special Announcement' : 'অফার ও আপডেট'}
              />
            </div>

            <div className="cms-field-group">
              <label>{isEn ? 'Action Button Label (e.g., Online Admission):' : 'অ্যাকশন বাটন লেবেল (যেমন: অনলাইন ভর্তি আবেদন):'}</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.notice?.btnText || ''} 
                onChange={(e) => updateField('notice', 'btnText', e.target.value)} 
                placeholder={isEn ? 'Online Admission' : 'অনলাইন ভর্তি আবেদন'}
              />
            </div>
          </div>

          <div className="cms-field-group">
            <label>{isEn ? 'Main Notice Message:' : 'মূল নোটিস বার্তা:'}</label>
            <textarea 
              className="cms-textarea" 
              value={settings.notice?.text || ''} 
              onChange={(e) => updateField('notice', 'text', e.target.value)} 
              placeholder={isEn 
                ? '📢 Limited seats available for HSC 2026 & 2025 batches! Hands-on classroom lab support included.' 
                : '📢 HSC 2026 ও 2025 ব্যাচে সীমিত আসনে নতুন ভর্তি চলছে! সরাসরি ক্লাসরুমে ল্যাব সাপোর্ট।'}
            />
          </div>
        </div>
      )}

      {/* TAB 2: HERO SECTION & ANIMATED STATS */}
      {activeSubTab === 'hero' && (
        <div className="cms-card">
          <h3 className="cms-section-title">
            <Sparkles size={20} color="#0284c7" /> {isEn ? 'Hero Section & Live Animated Stats' : 'হিরো সেকশন ও লাইভ অ্যানিমেটেড পরিসংখ্যান'}
          </h3>
          <p className="cms-section-subtitle">
            {isEn 
              ? 'Customize the main hero title, slogans, badge, tags, and 3 animated counter targets.'
              : 'ওয়েবসাইটের মূল ব্যানার হেডার, স্লোগান, ব্যাজ ও ৩টি অ্যানিমেটেড কাউন্টারের মান পরিবর্তন করুন।'}
          </p>

          <div className="cms-field-group">
            <label>{isEn ? 'Top Pill Badge:' : 'টপ পিল ব্যাজ (Pill Badge):'}</label>
            <input 
              type="text" 
              className="cms-input" 
              value={settings.hero?.pillBadge || ''} 
              onChange={(e) => updateField('hero', 'pillBadge', e.target.value)} 
              placeholder={isEn ? "Kushtia's Premier HSC ICT Learning Center" : "কুষ্টিয়ার সেরা HSC ICT লার্নিং সেন্টার"}
            />
          </div>

          <div className="cms-grid-2">
            <div className="cms-field-group">
              <label>{isEn ? 'Main Headline (Line 1):' : 'প্রধান শিরোনাম (লাইন ১):'}</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.hero?.titleLine1 || ''} 
                onChange={(e) => updateField('hero', 'titleLine1', e.target.value)} 
                placeholder={isEn ? 'To Secure an A+ in HSC ICT' : 'HSC ICT-তে A+ নিশ্চিত করতে'}
              />
            </div>

            <div className="cms-field-group">
              <label>{isEn ? 'Highlighted Text (Line 2):' : 'হাইলাইটেড অংশ (লাইন ২):'}</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.hero?.titleHighlight || ''} 
                onChange={(e) => updateField('hero', 'titleHighlight', e.target.value)} 
                placeholder={isEn ? 'Learn with Practical Tech, Not Rote Learning' : 'মুখস্ত নয়, এসো প্রযুক্তির সাথে শিখি'}
              />
            </div>
          </div>

          <div className="cms-field-group">
            <label>{isEn ? 'Hero Subtitle (Detailed Description):' : 'হিরো সাবটাইটেল (বিস্তারিত বিবরণ):'}</label>
            <textarea 
              className="cms-textarea" 
              value={settings.hero?.subtitle || ''} 
              onChange={(e) => updateField('hero', 'subtitle', e.target.value)} 
              placeholder={isEn 
                ? 'Information and Communication Technology is not a subject to memorize!...' 
                : 'তথ্য ও যোগাযোগ প্রযুক্তি মুখস্ত করার বিষয় নয়!...'}
            />
          </div>

          {/* 4 Chapter Tag highlights */}
          <div className="cms-subbox">
            <div className="cms-subbox-title">
              <Code size={16} /> {isEn ? 'Hero Topic Tags (4 Curriculum Highlights)' : 'হিরো ট্যাগ ব্যাজসমূহ (৪টি বিষয়ভিত্তিক হাইলাইট)'}
            </div>
            <div className="cms-grid-4">
              {[0, 1, 2, 3].map((tagIdx) => (
                <div key={tagIdx} className="cms-field-group" style={{ marginBottom: 0 }}>
                  <label>{isEn ? `Tag ${tagIdx + 1}:` : `ট্যাগ ${tagIdx + 1}:`}</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={settings.hero?.tags?.[tagIdx] || ''} 
                    onChange={(e) => {
                      const newTags = [...(settings.hero?.tags || [])];
                      newTags[tagIdx] = e.target.value;
                      updateField('hero', 'tags', newTags);
                    }} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="cms-grid-2">
            <div className="cms-field-group">
              <label>{isEn ? 'Login Button Text:' : 'লগইন বাটন টেক্সট:'}</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.hero?.primaryBtnText ?? ''} 
                onChange={(e) => updateField('hero', 'primaryBtnText', e.target.value)} 
                placeholder={isEn ? 'Login' : 'লগইন করুন'}
              />
            </div>
            <div className="cms-field-group">
              <label>{isEn ? 'Admission Button Text:' : 'ভর্তি বাটন টেক্সট:'}</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.hero?.enrollBtnText ?? ''} 
                onChange={(e) => updateField('hero', 'enrollBtnText', e.target.value)} 
                placeholder={isEn ? 'Online Admission Form' : 'অনলাইন ভর্তি আবেদন'}
              />
            </div>
          </div>

          {/* Animated Counters */}
          <div className="cms-subbox" style={{ marginTop: '1.25rem' }}>
            <div className="cms-subbox-title">
              <TrendingUp size={16} /> {isEn ? '3 Live Animated Counter Stats' : '৩টি লাইভ অ্যানিমেটেড কাউন্টার স্ট্যাটস'}
            </div>

            <div className="cms-grid-3">
              {/* Stat 1 */}
              <div style={{ background: 'rgba(56, 189, 248, 0.05)', padding: '0.9rem', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#0284c7', fontSize: '0.85rem' }}>{isEn ? 'Counter 1' : 'কাউন্টার ১'}</h5>
                <div className="cms-field-group">
                  <label>{isEn ? 'Target Number:' : 'টার্গেট নম্বর:'}</label>
                  <input 
                    type="number" 
                    className="cms-input" 
                    value={settings.hero?.stat1?.number || 98} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      updateField('hero', 'stat1', { ...settings.hero?.stat1, number: val });
                    }} 
                  />
                </div>
                <div className="cms-field-group">
                  <label>{isEn ? 'Suffix (Symbol):' : 'সাফিক্স (চিহ্ন):'}</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={settings.hero?.stat1?.suffix || '%+'} 
                    onChange={(e) => updateField('hero', 'stat1', { ...settings.hero?.stat1, suffix: e.target.value })} 
                  />
                </div>
                <div className="cms-field-group" style={{ marginBottom: 0 }}>
                  <label>{isEn ? 'Label:' : 'লেবেল:'}</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={settings.hero?.stat1?.label || ''} 
                    onChange={(e) => updateField('hero', 'stat1', { ...settings.hero?.stat1, label: e.target.value })} 
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '0.9rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#10b981', fontSize: '0.85rem' }}>{isEn ? 'Counter 2' : 'কাউন্টার ২'}</h5>
                <div className="cms-field-group">
                  <label>{isEn ? 'Target Number:' : 'টার্গেট নম্বর:'}</label>
                  <input 
                    type="number" 
                    className="cms-input" 
                    value={settings.hero?.stat2?.number || 1200} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      updateField('hero', 'stat2', { ...settings.hero?.stat2, number: val });
                    }} 
                  />
                </div>
                <div className="cms-field-group">
                  <label>{isEn ? 'Suffix (Symbol):' : 'সাফিক্স (চিহ্ন):'}</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={settings.hero?.stat2?.suffix || '+'} 
                    onChange={(e) => updateField('hero', 'stat2', { ...settings.hero?.stat2, suffix: e.target.value })} 
                  />
                </div>
                <div className="cms-field-group" style={{ marginBottom: 0 }}>
                  <label>{isEn ? 'Label:' : 'লেবেল:'}</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={settings.hero?.stat2?.label || ''} 
                    onChange={(e) => updateField('hero', 'stat2', { ...settings.hero?.stat2, label: e.target.value })} 
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div style={{ background: 'rgba(168, 85, 247, 0.05)', padding: '0.9rem', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.15)' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#a855f7', fontSize: '0.85rem' }}>{isEn ? 'Counter 3' : 'কাউন্টার ৩'}</h5>
                <div className="cms-field-group">
                  <label>{isEn ? 'Target Number:' : 'টার্গেট নম্বর:'}</label>
                  <input 
                    type="number" 
                    className="cms-input" 
                    value={settings.hero?.stat3?.number || 100} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      updateField('hero', 'stat3', { ...settings.hero?.stat3, number: val });
                    }} 
                  />
                </div>
                <div className="cms-field-group">
                  <label>{isEn ? 'Suffix (Symbol):' : 'সাফিক্স (চিহ্ন):'}</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={settings.hero?.stat3?.suffix || '%'} 
                    onChange={(e) => updateField('hero', 'stat3', { ...settings.hero?.stat3, suffix: e.target.value })} 
                  />
                </div>
                <div className="cms-field-group" style={{ marginBottom: 0 }}>
                  <label>{isEn ? 'Label:' : 'লেবেল:'}</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={settings.hero?.stat3?.label || ''} 
                    onChange={(e) => updateField('hero', 'stat3', { ...settings.hero?.stat3, label: e.target.value })} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CURRICULUM & CHAPTERS */}
      {activeSubTab === 'curriculum' && (
        <div className="cms-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 className="cms-section-title">
                <BookOpen size={20} color="#0284c7" /> {isEn ? 'HSC ICT Curriculum & Chapters (1 - 6)' : 'HSC ICT সম্পূর্ণ পাঠ্যসূচি ও অধ্যায়সমূহ'}
              </h3>
              <p className="cms-section-subtitle" style={{ marginBottom: 0 }}>
                {isEn 
                  ? 'Customize chapter titles, subheadings, board CQ marks, topics, and practical guidelines.' 
                  : 'বোর্ড সিলেবাসের অধ্যায়ের নাম, সাবটাইটেল, CQ মার্কস, গুরুত্বপূর্ণ বিষয় ও ল্যাব সুবিধা নিয়ন্ত্রণ করুন।'}
              </p>
            </div>

            <button 
              type="button" 
              className="cms-add-btn" 
              style={{ width: 'auto', margin: 0, padding: '0.5rem 1rem' }}
              onClick={handleAddChapter}
            >
              <Plus size={16} /> {isEn ? 'Add Chapter' : 'নতুন অধ্যায় যোগ করুন'}
            </button>
          </div>

          {/* Section Header Settings */}
          <div className="cms-subbox" style={{ marginTop: '1rem' }}>
            <div className="cms-subbox-title">
              <FileText size={16} /> {isEn ? 'Section Header & Subtitle' : 'সেকশন শিরোনাম ও সাবটাইটেল'}
            </div>
            <div className="cms-grid-2">
              <div className="cms-field-group">
                <label>{isEn ? 'Section Pill Badge:' : 'সেকশন পিল ব্যাজ:'}</label>
                <input 
                  type="text" 
                  className="cms-input" 
                  value={settings.curriculum?.badge ?? ''} 
                  onChange={(e) => updateField('curriculum', 'badge', e.target.value)} 
                  placeholder={isEn ? 'Complete Board Curriculum' : 'পূর্ণাঙ্গ বোর্ড কারিকুলাম'}
                />
              </div>

              <div className="cms-field-group">
                <label>{isEn ? 'Section Title:' : 'সেকশন প্রধান শিরোনাম:'}</label>
                <input 
                  type="text" 
                  className="cms-input" 
                  value={settings.curriculum?.title ?? ''} 
                  onChange={(e) => updateField('curriculum', 'title', e.target.value)} 
                  placeholder={isEn ? 'HSC ICT Complete Syllabus (Chapters 1 - 6)' : 'HSC ICT সম্পূর্ণ পাঠ্যসূচি (অধ্যায় ১ - ৬)'}
                />
              </div>
            </div>

            <div className="cms-field-group" style={{ marginBottom: 0 }}>
              <label>{isEn ? 'Section Subtitle Description:' : 'সেকশন সাবটাইটেল বিবরণ:'}</label>
              <textarea 
                className="cms-textarea" 
                rows={2}
                value={settings.curriculum?.subtitle ?? ''} 
                onChange={(e) => updateField('curriculum', 'subtitle', e.target.value)} 
                placeholder={isEn 
                  ? 'Complex concepts in each chapter are thoroughly prepared through intuitive and comprehensive analysis.' 
                  : 'প্রতিটি অধ্যায়ের জটিল টপিকগুলোকে সহজবোধ্য বিশ্লেষণের মাধ্যমে পূর্ণাঙ্গ প্রস্তুত করা হয়।'}
              />
            </div>
          </div>

          {/* Chapters Cards List */}
          <div style={{ marginTop: '1.25rem' }}>
            {(settings.curriculum?.chapters || []).map((chItem, index) => (
              <div key={chItem.id || index} className="cms-item-card">
                <div className="cms-item-header">
                  <span className="cms-item-badge">
                    {isEn ? `Chapter ${chItem.num || index + 1}` : `অধ্যায় ${chItem.num || index + 1}`}: {chItem.title}
                  </span>
                  <button 
                    type="button" 
                    className="cms-delete-btn" 
                    onClick={() => handleDeleteChapter(index)}
                  >
                    <Trash2 size={13} /> {isEn ? 'Delete' : 'মুছে ফেলুন'}
                  </button>
                </div>

                <div className="cms-grid-3">
                  <div className="cms-field-group">
                    <label>{isEn ? 'Chapter Number (e.g., 01 or ০১):' : 'অধ্যায় নম্বর (যেমন: ০১):'}</label>
                    <input 
                      type="text" 
                      className="cms-input" 
                      value={chItem.num || ''} 
                      onChange={(e) => handleUpdateChapter(index, 'num', e.target.value)} 
                    />
                  </div>

                  <div className="cms-field-group">
                    <label>{isEn ? 'Board Exam CQ Marks Badge:' : 'বোর্ড CQ মার্কস ব্যাজ:'}</label>
                    <input 
                      type="text" 
                      className="cms-input" 
                      value={chItem.cqMarks || ''} 
                      onChange={(e) => handleUpdateChapter(index, 'cqMarks', e.target.value)} 
                      placeholder={isEn ? '1 Full Board CQ Guaranteed' : '১টি পূর্ণাঙ্গ CQ প্রশ্ন'}
                    />
                  </div>

                  <div className="cms-field-group">
                    <label>{isEn ? 'Icon Style:' : 'আইকন:'}</label>
                    <select
                      className="cms-input"
                      value={chItem.iconName || 'BookOpen'}
                      onChange={(e) => handleUpdateChapter(index, 'iconName', e.target.value)}
                    >
                      <option value="Globe">Globe (বিশ্ব ও প্রেক্ষিত)</option>
                      <option value="Cpu">Cpu / Chip (নেটওয়ার্কিং)</option>
                      <option value="Binary">Binary (সংখ্যা পদ্ধতি ও গেইট)</option>
                      <option value="Code">Code (HTML ও ওয়েব)</option>
                      <option value="Terminal">Terminal (Python / প্রোগ্রামিং)</option>
                      <option value="Database">Database (ডেটাবেজ ও SQL)</option>
                      <option value="BookOpen">BookOpen (বই/সিলেবাস)</option>
                    </select>
                  </div>
                </div>

                <div className="cms-grid-2">
                  <div className="cms-field-group">
                    <label>{isEn ? 'Chapter Title (Main):' : 'অধ্যায়ের মূল নাম:'}</label>
                    <input 
                      type="text" 
                      className="cms-input" 
                      value={chItem.title || ''} 
                      onChange={(e) => handleUpdateChapter(index, 'title', e.target.value)} 
                    />
                  </div>

                  <div className="cms-field-group">
                    <label>{isEn ? 'English / Sub-Title:' : 'ইংরেজি / সাব-টাইটেল:'}</label>
                    <input 
                      type="text" 
                      className="cms-input" 
                      value={chItem.subtitle || ''} 
                      onChange={(e) => handleUpdateChapter(index, 'subtitle', e.target.value)} 
                    />
                  </div>
                </div>

                <div className="cms-field-group">
                  <label>
                    {isEn ? 'Curriculum Key Topics (Enter one topic per line):' : 'গুরুত্বপূর্ণ টপিকসমূহ (প্রতি লাইনে একটি করে টপিক লিখুন):'}
                  </label>
                  <textarea 
                    className="cms-textarea" 
                    rows={4}
                    value={(chItem.topics || []).join('\n')} 
                    onChange={(e) => {
                      const newTopics = e.target.value.split('\n');
                      handleUpdateChapter(index, 'topics', newTopics);
                    }} 
                    placeholder={isEn ? "Topic 1\nTopic 2\nTopic 3" : "টপিক ১\nটপিক ২\nটপিক ৩"}
                  />
                </div>

                <div className="cms-grid-2">
                  <div className="cms-field-group">
                    <label>{isEn ? 'Classroom Practical Advantage:' : 'ক্লাসরুম প্র্যাকটিক্যাল সুবিধা:'}</label>
                    <input 
                      type="text" 
                      className="cms-input" 
                      value={chItem.practical || ''} 
                      onChange={(e) => handleUpdateChapter(index, 'practical', e.target.value)} 
                      placeholder={isEn ? 'Hands-on practical advantages' : 'ল্যাপটপ ও প্রজেক্টরে সরাসরি প্র্যাকটিস'}
                    />
                  </div>

                  <div className="cms-field-group">
                    <label>{isEn ? 'Board Exam Strategy & Tips:' : 'বোর্ড পরীক্ষার কৌশল ও টিপস:'}</label>
                    <input 
                      type="text" 
                      className="cms-input" 
                      value={chItem.tips || ''} 
                      onChange={(e) => handleUpdateChapter(index, 'tips', e.target.value)} 
                      placeholder={isEn ? 'Board exam strategy and tips' : 'পরীক্ষার বিশেষ কৌশল ও পূর্ণাঙ্গ প্রস্তুতি'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MENTOR PROFILE & FLOATING BADGES */}
      {activeSubTab === 'mentor' && (
        <div className="cms-card">
          <h3 className="cms-section-title">
            <Award size={20} color="#0284c7" /> {isEn ? 'Instructor Profile, Photo & Floating Badges' : 'শিক্ষক পরিচিতি, ছবি ও ফ্লোটিং ব্যাজসমূহ'}
          </h3>
          <p className="cms-section-subtitle">
            {isEn 
              ? 'Manage the hero instructor image, 4 surrounding floating badges, and detailed profile.'
              : 'হিরো সেকশনের শিক্ষকের ছবি, চারপাশের ৪টি ফ্লোটিং ব্যাজ এবং বিস্তারিত শিক্ষক পরিচিতি নিয়ন্ত্রণ করুন।'}
          </p>

          <div className="cms-grid-2">
            <div className="cms-field-group">
              <label>{isEn ? 'Instructor Name:' : 'শিক্ষকের নাম:'}</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.mentorHero?.name || ''} 
                onChange={(e) => updateField('mentorHero', 'name', e.target.value)} 
                placeholder={isEn ? 'Maruf Hossain' : 'মারুফ হোসেন'}
              />
            </div>

            <div className="cms-field-group">
              <label>{isEn ? 'Designation & Professional Role:' : 'পদবি ও প্রফেশনাল ভূমিকা (Role):'}</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.mentorHero?.role || ''} 
                onChange={(e) => updateField('mentorHero', 'role', e.target.value)} 
                placeholder="AI Engineer | Blockchain Developer | Quantum Expert"
              />
            </div>
          </div>

          {/* Mentor Photo URL and Upload */}
          <div className="cms-subbox">
            <div className="cms-subbox-title">
              <Image size={16} /> {isEn ? 'Instructor Photo (Mentor Image)' : 'শিক্ষকের ছবি (Mentor Image)'}
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: '85px', height: '85px', borderRadius: '14px', background: '#090f1d', border: '2px solid rgba(56, 189, 248, 0.4)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img 
                  src={settings.mentorHero?.image || '/m2.png'} 
                  alt="Mentor" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '240px' }}>
                <div className="cms-field-group">
                  <label>{isEn ? 'Image Path or URL (e.g., /m2.png):' : 'ছবির পাথ বা URL (যেমন: /m2.png):'}</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={settings.mentorHero?.image || '/m2.png'} 
                    onChange={(e) => updateField('mentorHero', 'image', e.target.value)} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    {isEn ? '📁 Choose new image from computer' : '📁 কম্পিউটার থেকে নতুন ছবি সিলেক্ট করুন'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Floating Badges */}
          <div className="cms-subbox">
            <div className="cms-subbox-title">
              <Sparkles size={16} /> {isEn ? '4 Floating Badges Around Instructor Photo' : 'ছবির চারপাশের ৪টি ফ্লোটিং ব্যাজ'}
            </div>

            <div className="cms-grid-2">
              {/* Badge 1 */}
              <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>{isEn ? 'Badge 1 (Top Right):' : 'ব্যাজ ১ (উপরে ডানে):'}</span>
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.3rem' }}
                  value={settings.mentorHero?.badge1Title || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge1Title', e.target.value)} 
                  placeholder={isEn ? 'Title' : 'শিরোনাম'}
                />
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.4rem' }}
                  value={settings.mentorHero?.badge1Sub || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge1Sub', e.target.value)} 
                  placeholder={isEn ? 'Subtext' : 'সাবটেক্সট'}
                />
              </div>

              {/* Badge 2 */}
              <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>{isEn ? 'Badge 2 (Top Left):' : 'ব্যাজ ২ (উপরে বামে):'}</span>
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.3rem' }}
                  value={settings.mentorHero?.badge2Title || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge2Title', e.target.value)} 
                  placeholder={isEn ? 'Title' : 'শিরোনাম'}
                />
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.4rem' }}
                  value={settings.mentorHero?.badge2Sub || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge2Sub', e.target.value)} 
                  placeholder={isEn ? 'Subtext' : 'সাবটেক্সট'}
                />
              </div>

              {/* Badge 3 */}
              <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}>{isEn ? 'Badge 3 (Bottom Left):' : 'ব্যাজ ৩ (নিচে বামে):'}</span>
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.3rem' }}
                  value={settings.mentorHero?.badge3Title || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge3Title', e.target.value)} 
                  placeholder={isEn ? 'Title' : 'শিরোনাম'}
                />
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.4rem' }}
                  value={settings.mentorHero?.badge3Sub || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge3Sub', e.target.value)} 
                  placeholder={isEn ? 'Subtext' : 'সাবটেক্সট'}
                />
              </div>

              {/* Badge 4 */}
              <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#ec4899', fontWeight: 700 }}>{isEn ? 'Badge 4 (Bottom Right):' : 'ব্যাজ ৪ (নিচে ডানে):'}</span>
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.3rem' }}
                  value={settings.mentorHero?.badge4Title || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge4Title', e.target.value)} 
                  placeholder={isEn ? 'Title' : 'শিরোনাম'}
                />
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.4rem' }}
                  value={settings.mentorHero?.badge4Sub || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge4Sub', e.target.value)} 
                  placeholder={isEn ? 'Subtext' : 'সাবটেক্সট'}
                />
              </div>
            </div>
          </div>

          {/* Teacher Detailed Bio & Section */}
          <div className="cms-subbox" style={{ marginTop: '1.25rem' }}>
            <div className="cms-subbox-title">
              <FileText size={16} /> {isEn ? 'Main Instructor Profile Section' : 'শিক্ষক পরিচিতি মূল সেকশন'}
            </div>

            <div className="cms-grid-2">
              <div className="cms-field-group">
                <label>{isEn ? 'Section Pill Badge:' : 'সেকশন পিল ব্যাজ:'}</label>
                <input 
                  type="text" 
                  className="cms-input" 
                  value={settings.mentorSection?.pill || ''} 
                  onChange={(e) => updateField('mentorSection', 'pill', e.target.value)} 
                  placeholder={isEn ? '"Do Not Memorize ICT, Learn Practically"' : '"ICT মুখস্ত নয়, এসো শিখি"'}
                />
              </div>

              <div className="cms-field-group">
                <label>{isEn ? 'Section Headline:' : 'সেকশন শিরোনাম:'}</label>
                <input 
                  type="text" 
                  className="cms-input" 
                  value={settings.mentorSection?.title || ''} 
                  onChange={(e) => updateField('mentorSection', 'title', e.target.value)} 
                  placeholder={isEn ? 'In the Age of Technology, Rote Learning Has No Place' : 'প্রযুক্তির যুগে মুখস্ত বিদ্যার কোনো স্থান নেই'}
                />
              </div>
            </div>

            <div className="cms-field-group">
              <label>{isEn ? 'Instructor Message / Bio Quote:' : 'শিক্ষকের উক্তি / বক্তব্য:'}</label>
              <textarea 
                className="cms-textarea" 
                value={settings.mentorSection?.bio || ''} 
                onChange={(e) => updateField('mentorSection', 'bio', e.target.value)} 
              />
            </div>

            {/* 3 Bullets */}
            <div style={{ marginTop: '0.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
                {isEn ? '3 Key Focus Highlights:' : '৩টি মূল ফোকাস পয়েন্ট:'}
              </label>
              {[0, 1, 2].map((bIdx) => (
                <div key={bIdx} style={{ marginBottom: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={settings.mentorSection?.bullets?.[bIdx] || ''} 
                    onChange={(e) => {
                      const list = [...(settings.mentorSection?.bullets || [])];
                      list[bIdx] = e.target.value;
                      updateField('mentorSection', 'bullets', list);
                    }} 
                    placeholder={isEn ? `Highlight Point ${bIdx + 1}` : `পয়েন্ট ${bIdx + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="cms-grid-2" style={{ marginTop: '0.75rem' }}>
              <div className="cms-field-group">
                <label>{isEn ? 'Hotline Phone Number:' : 'কল করার মোবাইল নম্বর:'}</label>
                <input 
                  type="text" 
                  className="cms-input" 
                  value={settings.mentorSection?.phone || '01723619524'} 
                  onChange={(e) => updateField('mentorSection', 'phone', e.target.value)} 
                />
              </div>

              <div className="cms-field-group">
                <label>{isEn ? 'WhatsApp Number (with country code):' : 'হোয়াটসঅ্যাপ নম্বর (কান্ট্রি কোড সহ):'}</label>
                <input 
                  type="text" 
                  className="cms-input" 
                  value={settings.mentorSection?.whatsapp || '8801723619524'} 
                  onChange={(e) => updateField('mentorSection', 'whatsapp', e.target.value)} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TESTIMONIALS */}
      {activeSubTab === 'testimonials' && (
        <div className="cms-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 className="cms-section-title">
                <Users size={20} color="#0284c7" /> {isEn ? 'Student Reviews & Success Stories' : 'কৃতী শিক্ষার্থীদের রিভিউ ও সাফল্য'}
              </h3>
              <p className="cms-section-subtitle" style={{ marginBottom: 0 }}>
                {isEn ? 'Manage student testimonials and board exam success stories.' : 'ওয়েবসাইটে প্রদর্শিত ছাত্র-ছাত্রীদের রিভিউ পরিচালনা করুন।'}
              </p>
            </div>

            <button 
              type="button" 
              className="cms-add-btn" 
              style={{ width: 'auto', margin: 0, padding: '0.5rem 1rem' }}
              onClick={handleAddTestimonial}
            >
              <Plus size={16} /> {isEn ? 'Add New Review' : 'নতুন রিভিউ যোগ করুন'}
            </button>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            {(settings.testimonials || []).map((tItem, index) => (
              <div key={tItem.id || index} className="cms-item-card">
                <div className="cms-item-header">
                  <span className="cms-item-badge">{isEn ? `Review #${index + 1}` : `রিভিউ #${index + 1}`}</span>
                  <button 
                    type="button" 
                    className="cms-delete-btn" 
                    onClick={() => handleDeleteTestimonial(index)}
                  >
                    <Trash2 size={13} /> {isEn ? 'Delete' : 'মুছে ফেলুন'}
                  </button>
                </div>

                <div className="cms-grid-3">
                  <div className="cms-field-group">
                    <label>{isEn ? 'Student Name:' : 'শিক্ষার্থীর নাম:'}</label>
                    <input 
                      type="text" 
                      className="cms-input" 
                      value={tItem.name || ''} 
                      onChange={(e) => handleUpdateTestimonial(index, 'name', e.target.value)} 
                    />
                  </div>

                  <div className="cms-field-group">
                    <label>{isEn ? 'College / Institute:' : 'কলেজ / প্রতিষ্ঠান:'}</label>
                    <input 
                      type="text" 
                      className="cms-input" 
                      value={tItem.college || ''} 
                      onChange={(e) => handleUpdateTestimonial(index, 'college', e.target.value)} 
                    />
                  </div>

                  <div className="cms-field-group">
                    <label>{isEn ? 'Result / Badge (e.g., ICT: 98/100):' : 'ফলাফল / ব্যাজ (যেমন: ICT: ৯৮/১০০):'}</label>
                    <input 
                      type="text" 
                      className="cms-input" 
                      value={tItem.score || ''} 
                      onChange={(e) => handleUpdateTestimonial(index, 'score', e.target.value)} 
                    />
                  </div>
                </div>

                <div className="cms-field-group" style={{ marginBottom: 0 }}>
                  <label>{isEn ? 'Review / Testimonial Text:' : 'রিভিউ / প্রশংসাপত্র:'}</label>
                  <textarea 
                    className="cms-textarea" 
                    style={{ minHeight: '65px' }}
                    value={tItem.text || ''} 
                    onChange={(e) => handleUpdateTestimonial(index, 'text', e.target.value)} 
                  />
                </div>
              </div>
            ))}

            <button 
              type="button" 
              className="cms-add-btn" 
              onClick={handleAddTestimonial}
            >
              <Plus size={16} /> {isEn ? 'Add More Reviews' : 'আরও রিভিউ যোগ করুন'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: FAQ */}
      {activeSubTab === 'faq' && (
        <div className="cms-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 className="cms-section-title">
                <HelpCircle size={20} color="#0284c7" /> {isEn ? 'Frequently Asked Questions (FAQ)' : 'সচরাচর জিজ্ঞাসিত প্রশ্নসমূহ (FAQ)'}
              </h3>
              <p className="cms-section-subtitle" style={{ marginBottom: 0 }}>
                {isEn ? 'Edit common questions and answers for students and parents.' : 'শিক্ষার্থী ও অভিভাবকদের সাধারণ জিজ্ঞাসা ও উত্তরসমূহ সম্পাদনা করুন।'}
              </p>
            </div>

            <button 
              type="button" 
              className="cms-add-btn" 
              style={{ width: 'auto', margin: 0, padding: '0.5rem 1rem' }}
              onClick={handleAddFaq}
            >
              <Plus size={16} /> {isEn ? 'Add New Question' : 'নতুন প্রশ্ন যোগ করুন'}
            </button>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            {(settings.faq || []).map((faqItem, index) => (
              <div key={faqItem.id || index} className="cms-item-card">
                <div className="cms-item-header">
                  <span className="cms-item-badge">{isEn ? `Question #${index + 1}` : `প্রশ্ন #${index + 1}`}</span>
                  <button 
                    type="button" 
                    className="cms-delete-btn" 
                    onClick={() => handleDeleteFaq(index)}
                  >
                    <Trash2 size={13} /> {isEn ? 'Delete' : 'মুছে ফেলুন'}
                  </button>
                </div>

                <div className="cms-field-group">
                  <label>{isEn ? 'Question:' : 'প্রশ্ন:'}</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={faqItem.question || ''} 
                    onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)} 
                  />
                </div>

                <div className="cms-field-group" style={{ marginBottom: 0 }}>
                  <label>{isEn ? 'Answer:' : 'উত্তর:'}</label>
                  <textarea 
                    className="cms-textarea" 
                    style={{ minHeight: '65px' }}
                    value={faqItem.answer || ''} 
                    onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)} 
                  />
                </div>
              </div>
            ))}

            <button 
              type="button" 
              className="cms-add-btn" 
              onClick={handleAddFaq}
            >
              <Plus size={16} /> {isEn ? 'Add More Questions' : 'আরও প্রশ্ন যোগ করুন'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: CONTACT & FOOTER */}
      {activeSubTab === 'footer' && (
        <div className="cms-card">
          <h3 className="cms-section-title">
            <MapPin size={20} color="#0284c7" /> {isEn ? 'Contact, Location & Footer Settings' : 'যোগাযোগ, ঠিকানা ও ফুটার সেটিংস'}
          </h3>
          <p className="cms-section-subtitle">
            {isEn ? 'Update physical address, hotline numbers, operating hours, and footer copy.' : 'ফুটার সেকশনের যোগাযোগের ঠিকানা, হটলাইন নম্বর, সময় ও কপিরাইট লেখা আপডেট করুন।'}
          </p>

          <div className="cms-grid-2">
            <div className="cms-field-group">
              <label>{isEn ? 'Campus / Center Address:' : 'ক্যাম্পাস / সেন্টারের ঠিকানা:'}</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.contact?.address || ''} 
                onChange={(e) => updateField('contact', 'address', e.target.value)} 
                placeholder={isEn ? 'Kushtia Govt. College Gate, Kushtia, Bangladesh' : 'কুষ্টিয়া সরকারি কলেজ গেট, কুষ্টিয়া, বাংলাদেশ'}
              />
            </div>

            <div className="cms-field-group">
              <label>{isEn ? 'Hotline Phone (Display):' : 'হটলাইন নম্বর (প্রদর্শনযোগ্য):'}</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.contact?.phone || ''} 
                onChange={(e) => updateField('contact', 'phone', e.target.value)} 
                placeholder={isEn ? '+880 1723-619524' : '+৮৮০ ১৭২৩-৬১৯৫২৪'}
              />
            </div>
          </div>

          <div className="cms-grid-2">
            <div className="cms-field-group">
              <label>{isEn ? 'WhatsApp Phone Number:' : 'হোয়াটসঅ্যাপ সংযোগ নম্বর:'}</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.contact?.whatsapp || ''} 
                onChange={(e) => updateField('contact', 'whatsapp', e.target.value)} 
                placeholder="8801723619524"
              />
            </div>

            <div className="cms-field-group">
              <label>{isEn ? 'Opening Hours:' : 'খোলা থাকার সময়সূচি:'}</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.contact?.hours || ''} 
                onChange={(e) => updateField('contact', 'hours', e.target.value)} 
                placeholder={isEn ? '7:00 AM - 8:00 PM (Open Daily)' : 'সকাল ৭:০০ - রাত ৮:০০ (প্রতিদিন খোলা)'}
              />
            </div>
          </div>

          <div className="cms-grid-2">
            <div className="cms-field-group">
              <label>{isEn ? 'Copyright Text:' : 'কপিরাইট টেক্সট:'}</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.contact?.copyright || ''} 
                onChange={(e) => updateField('contact', 'copyright', e.target.value)} 
                placeholder={isEn ? "© 2026 Maruf's ICT Care. All rights reserved." : "© 2026 Maruf's ICT Care. সর্বস্বত্ব সংরক্ষিত।"}
              />
            </div>

            <div className="cms-field-group">
              <label>{isEn ? 'Footer Bottom Tagline:' : 'ফুটার বটম স্লোগান:'}</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.contact?.footerTagline || ''} 
                onChange={(e) => updateField('contact', 'footerTagline', e.target.value)} 
                placeholder={isEn ? 'Designed for HSC ICT Students • Do Not Memorize ICT, Learn Practically' : 'Designed for HSC ICT Students • ICT মুখস্ত নয়, এসো শিখি'}
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. Bottom Sticky Save Bar */}
      <div className="cms-sticky-save-bar">
        <div className="cms-sticky-text">
          <CheckCircle2 size={18} color="#34d399" />
          <span>{isEn ? 'Save all section updates with a single click.' : 'সকল সেকশনের পরিবর্তন এক ক্লিকেই সেভ করুন।'}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            type="button" 
            className="btn-cms-reset"
            onClick={handleReset}
          >
            <RotateCcw size={15} /> {isEn ? 'Reset Defaults' : 'ডিফল্ট করুন'}
          </button>

          <button 
            type="button" 
            className="btn-cms-save"
            onClick={handleSave}
          >
            <Save size={16} /> {isEn ? 'Save Changes' : 'পরিবর্তন সংরক্ষণ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FrontendSettings;
