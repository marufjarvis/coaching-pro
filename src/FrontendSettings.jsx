// src/FrontendSettings.jsx
// Complete Frontend CMS Manager for Coaching Pro
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
  FileText
} from 'lucide-react';
import { dataStore } from './dataStore';
import './frontend-settings.css';

function FrontendSettings({ lang = 'BN' }) {
  const [settings, setSettings] = useState(() => dataStore.getFrontendSettings());
  const [activeSubTab, setActiveSubTab] = useState('hero');
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
    triggerToast(lang === 'EN' ? 'Landing page updated successfully!' : 'ল্যান্ডিং পেজ সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  // Reset to original defaults
  const handleReset = () => {
    const confirmText = lang === 'EN' 
      ? 'Are you sure you want to restore the default landing page content? Any customized text will be replaced.'
      : 'আপনি কি নিশ্চিত যে ল্যান্ডিং পেজের সকল ডিফল্ট লেখা পুনরুদ্ধার করতে চান? পূর্বের পরিবর্তনগুলো মুছে যাবে।';
    
    if (window.confirm(confirmText)) {
      const def = dataStore.resetFrontendSettings();
      setSettings(def);
      setIsSaved(true);
      triggerToast(lang === 'EN' ? 'Restored default settings!' : 'ডিফল্ট তথ্য সফলভাবে পুনরুদ্ধার করা হয়েছে!');
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
        alert(lang === 'EN' ? 'Image size must be under 2MB.' : 'ছবির সাইজ সর্বোচ্চ ২ মেগাবাইট (2MB) হতে পারবে।');
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
      name: 'নতুন শিক্ষার্থীর নাম',
      college: 'কলেজের নাম',
      score: 'ICT: ৯৫/১০০ (A+)',
      text: 'এখানে শিক্ষার্থীর অভিজ্ঞতা ও রিভিউ লিখুন।'
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
    if (window.confirm(lang === 'EN' ? 'Delete this review?' : 'এই রিভিউটি মুছে ফেলতে চান?')) {
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
      question: 'নতুন সাধারণ প্রশ্ন?',
      answer: 'এখানে প্রশ্নের বিস্তারিত উত্তর লিখুন।'
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
    if (window.confirm(lang === 'EN' ? 'Delete this FAQ item?' : 'এই প্রশ্নটি মুছে ফেলতে চান?')) {
      setIsSaved(false);
      setSettings(prev => {
        const list = [...(prev.faq || [])];
        list.splice(index, 1);
        return { ...prev, faq: list };
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
              Frontend ল্যান্ডিং পেজ ডাইনামিক CMS
              <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: 700 }}>
                Live Sync
              </span>
              {!isSaved && (
                <span style={{ fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: 700 }}>
                  সংরক্ষণ বাকি
                </span>
              )}
            </h2>
            <p className="frontend-header-subtitle">
              ওয়েবসাইটের টেক্সট, অফার ব্যানার, শিক্ষক পরিচিতি, পরিসংখ্যান ও রিভিউ সরাসরি এখান থেকে নিয়ন্ত্রণ করুন।
            </p>
          </div>
        </div>

        <div className="frontend-header-actions">
          <a 
            href="#/" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-cms-preview"
            title="লাইভ ওয়েবসাইট নতুন ট্যাবে দেখুন"
          >
            <Eye size={16} />
            <span>ওয়েবসাইট দেখুন</span>
            <ExternalLink size={13} />
          </a>

          <button 
            type="button" 
            className="btn-cms-reset" 
            onClick={handleReset}
            title="সব ডিফল্ট লেখায় রিসেট করুন"
          >
            <RotateCcw size={15} />
            <span>রিসেট</span>
          </button>

          <button 
            type="button" 
            className="btn-cms-save" 
            onClick={handleSave}
            title="সকল পরিবর্তন সংরক্ষণ করুন"
          >
            <Save size={16} />
            <span>সংরক্ষণ করুন</span>
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
          <span>টপ নোটিস বার</span>
        </button>

        <button 
          type="button"
          className={`cms-tab-btn ${activeSubTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('hero')}
        >
          <Sparkles size={16} />
          <span>হিরো সেকশন ও স্ট্যাটস</span>
        </button>

        <button 
          type="button"
          className={`cms-tab-btn ${activeSubTab === 'mentor' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('mentor')}
        >
          <Award size={16} />
          <span>শিক্ষক পরিচিতি ও ব্যাজ</span>
        </button>

        <button 
          type="button"
          className={`cms-tab-btn ${activeSubTab === 'testimonials' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('testimonials')}
        >
          <Users size={16} />
          <span>সাফল্যের গল্প ({settings.testimonials?.length || 0})</span>
        </button>

        <button 
          type="button"
          className={`cms-tab-btn ${activeSubTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('faq')}
        >
          <HelpCircle size={16} />
          <span>FAQ ও প্রশ্নসমূহ ({settings.faq?.length || 0})</span>
        </button>

        <button 
          type="button"
          className={`cms-tab-btn ${activeSubTab === 'footer' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('footer')}
        >
          <MapPin size={16} />
          <span>যোগাযোগ ও ফুটার</span>
        </button>
      </div>

      {/* 4. Tab Contents */}

      {/* TAB 1: TOP NOTICE BAR */}
      {activeSubTab === 'notice' && (
        <div className="cms-card">
          <h3 className="cms-section-title">
            <Bell size={20} color="#0284c7" /> শীর্ষ নোটিস ও এনাউন্সমেন্ট বার
          </h3>
          <p className="cms-section-subtitle">
            ওয়েবসাইটের একদম উপরে যে নোটিস বার প্রদর্শিত হয় তার টেক্সট ও লিংক কনফিগার করুন।
          </p>

          <div className="cms-field-group">
            <label className="cms-switch-wrap">
              <input 
                type="checkbox" 
                className="cms-switch-input" 
                checked={settings.notice?.enabled !== false} 
                onChange={(e) => updateField('notice', 'enabled', e.target.checked)} 
              />
              <span style={{ fontWeight: 600 }}>নোটিস বার ওয়েবসাইটে চালু রাখুন</span>
            </label>
          </div>

          <div className="cms-grid-2">
            <div className="cms-field-group">
              <label>নোটিস ব্যাজ টেক্সট (যেমন: অফার ও আপডেট):</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.notice?.badge || ''} 
                onChange={(e) => updateField('notice', 'badge', e.target.value)} 
                placeholder="অফার ও আপডেট"
              />
            </div>

            <div className="cms-field-group">
              <label>অ্যাকশন বাটন লেবেল (যেমন: অনলাইন ভর্তি আবেদন):</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.notice?.btnText || ''} 
                onChange={(e) => updateField('notice', 'btnText', e.target.value)} 
                placeholder="অনলাইন ভর্তি আবেদন"
              />
            </div>
          </div>

          <div className="cms-field-group">
            <label>মূল নোটিস বার্তা:</label>
            <textarea 
              className="cms-textarea" 
              value={settings.notice?.text || ''} 
              onChange={(e) => updateField('notice', 'text', e.target.value)} 
              placeholder="📢 HSC 2026 ও 2025 ব্যাচে সীমিত আসনে নতুন ভর্তি চলছে! সরাসরি ক্লাসরুমে ল্যাব সাপোর্ট।"
            />
          </div>
        </div>
      )}

      {/* TAB 2: HERO SECTION & ANIMATED STATS */}
      {activeSubTab === 'hero' && (
        <div className="cms-card">
          <h3 className="cms-section-title">
            <Sparkles size={20} color="#0284c7" /> হিরো সেকশন ও লাইভ অ্যানিমেটেড পরিসংখ্যান
          </h3>
          <p className="cms-section-subtitle">
            ওয়েবসাইটের মূল ব্যানার হেডার, স্লোগান, ব্যাজ ও ৩টি অ্যানিমেটেড কাউন্টারের মান পরিবর্তন করুন।
          </p>

          <div className="cms-field-group">
            <label>টপ পিল ব্যাজ (Pill Badge):</label>
            <input 
              type="text" 
              className="cms-input" 
              value={settings.hero?.pillBadge || ''} 
              onChange={(e) => updateField('hero', 'pillBadge', e.target.value)} 
              placeholder="কুষ্টিয়ার সেরা HSC ICT লার্নিং সেন্টার"
            />
          </div>

          <div className="cms-grid-2">
            <div className="cms-field-group">
              <label>প্রধান শিরোনাম (লাইন ১):</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.hero?.titleLine1 || ''} 
                onChange={(e) => updateField('hero', 'titleLine1', e.target.value)} 
                placeholder="HSC ICT-তে A+ নিশ্চিত করতে"
              />
            </div>

            <div className="cms-field-group">
              <label>হাইলাইটেড অংশ (লাইন ২):</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.hero?.titleHighlight || ''} 
                onChange={(e) => updateField('hero', 'titleHighlight', e.target.value)} 
                placeholder="মুখস্ত নয়, এসো প্রযুক্তির সাথে শিখি"
              />
            </div>
          </div>

          <div className="cms-field-group">
            <label>হিরো সাবটাইটেল (বিস্তারিত বিবরণ):</label>
            <textarea 
              className="cms-textarea" 
              value={settings.hero?.subtitle || ''} 
              onChange={(e) => updateField('hero', 'subtitle', e.target.value)} 
              placeholder="তথ্য ও যোগাযোগ প্রযুক্তি মুখস্ত করার বিষয় নয়!..."
            />
          </div>

          {/* 4 Chapter Tag highlights */}
          <div className="cms-subbox">
            <div className="cms-subbox-title">
              <Code size={16} /> হিরো ট্যাগ ব্যাজসমূহ (৪টি বিষয়ভিত্তিক হাইলাইট)
            </div>
            <div className="cms-grid-4">
              {[0, 1, 2, 3].map((tagIdx) => (
                <div key={tagIdx} className="cms-field-group" style={{ marginBottom: 0 }}>
                  <label>ট্যাগ {tagIdx + 1}:</label>
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
              <label>লগইন বাটন টেক্সট:</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.hero?.primaryBtnText || 'লগইন করুন'} 
                onChange={(e) => updateField('hero', 'primaryBtnText', e.target.value)} 
              />
            </div>
            <div className="cms-field-group">
              <label>ভর্তি বাটন টেক্সট:</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.hero?.enrollBtnText || 'অনলাইন ভর্তি আবেদন'} 
                onChange={(e) => updateField('hero', 'enrollBtnText', e.target.value)} 
              />
            </div>
          </div>

          {/* Animated Counters */}
          <div className="cms-subbox" style={{ marginTop: '1.25rem' }}>
            <div className="cms-subbox-title">
              <TrendingUp size={16} /> ৩টি লাইভ অ্যানিমেটেড কাউন্টার স্ট্যাটস
            </div>

            <div className="cms-grid-3">
              {/* Stat 1 */}
              <div style={{ background: 'rgba(56, 189, 248, 0.05)', padding: '0.9rem', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#0284c7', fontSize: '0.85rem' }}>কাউন্টার ১</h5>
                <div className="cms-field-group">
                  <label>টার্গেট নম্বর:</label>
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
                  <label>সাফিক্স (চিহ্ন):</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={settings.hero?.stat1?.suffix || '%+'} 
                    onChange={(e) => updateField('hero', 'stat1', { ...settings.hero?.stat1, suffix: e.target.value })} 
                  />
                </div>
                <div className="cms-field-group" style={{ marginBottom: 0 }}>
                  <label>লেবেল:</label>
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
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#10b981', fontSize: '0.85rem' }}>কাউন্টার ২</h5>
                <div className="cms-field-group">
                  <label>টার্গেট নম্বর:</label>
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
                  <label>সাফিক্স (চিহ্ন):</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={settings.hero?.stat2?.suffix || '+'} 
                    onChange={(e) => updateField('hero', 'stat2', { ...settings.hero?.stat2, suffix: e.target.value })} 
                  />
                </div>
                <div className="cms-field-group" style={{ marginBottom: 0 }}>
                  <label>লেবেল:</label>
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
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#a855f7', fontSize: '0.85rem' }}>কাউন্টার ৩</h5>
                <div className="cms-field-group">
                  <label>টার্গেট নম্বর:</label>
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
                  <label>সাফিক্স (চিহ্ন):</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={settings.hero?.stat3?.suffix || '%'} 
                    onChange={(e) => updateField('hero', 'stat3', { ...settings.hero?.stat3, suffix: e.target.value })} 
                  />
                </div>
                <div className="cms-field-group" style={{ marginBottom: 0 }}>
                  <label>লেবেল:</label>
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

      {/* TAB 3: MENTOR PROFILE & FLOATING BADGES */}
      {activeSubTab === 'mentor' && (
        <div className="cms-card">
          <h3 className="cms-section-title">
            <Award size={20} color="#0284c7" /> শিক্ষক পরিচিতি, ছবি ও ফ্লোটিং ব্যাজসমূহ
          </h3>
          <p className="cms-section-subtitle">
            হিরো সেকশনের শিক্ষকের ছবি, চারপাশের ৪টি ফ্লোটিং ব্যাজ এবং বিস্তারিত শিক্ষক পরিচিতি নিয়ন্ত্রণ করুন।
          </p>

          <div className="cms-grid-2">
            <div className="cms-field-group">
              <label>শিক্ষকের নাম:</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.mentorHero?.name || 'মারুফ হোসেন'} 
                onChange={(e) => updateField('mentorHero', 'name', e.target.value)} 
              />
            </div>

            <div className="cms-field-group">
              <label>পদবি ও প্রফেশনাল ভূমিকা (Role):</label>
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
              <Image size={16} /> শিক্ষকের ছবি (Mentor Image)
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
                  <label>ছবির পাথ বা URL (যেমন: /m2.png):</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={settings.mentorHero?.image || '/m2.png'} 
                    onChange={(e) => updateField('mentorHero', 'image', e.target.value)} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    📁 কম্পিউটার থেকে নতুন ছবি সিলেক্ট করুন
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
              <Sparkles size={16} /> ছবির চারপাশের ৪টি ফ্লোটিং ব্যাজ
            </div>

            <div className="cms-grid-2">
              {/* Badge 1 */}
              <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>ব্যাজ ১ (উপরে ডানে):</span>
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.3rem' }}
                  value={settings.mentorHero?.badge1Title || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge1Title', e.target.value)} 
                  placeholder="শিরোনাম"
                />
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.4rem' }}
                  value={settings.mentorHero?.badge1Sub || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge1Sub', e.target.value)} 
                  placeholder="সাবটেক্সট"
                />
              </div>

              {/* Badge 2 */}
              <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>ব্যাজ ২ (উপরে বামে):</span>
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.3rem' }}
                  value={settings.mentorHero?.badge2Title || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge2Title', e.target.value)} 
                  placeholder="শিরোনাম"
                />
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.4rem' }}
                  value={settings.mentorHero?.badge2Sub || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge2Sub', e.target.value)} 
                  placeholder="সাবটেক্সট"
                />
              </div>

              {/* Badge 3 */}
              <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}>ব্যাজ ৩ (নিচে বামে):</span>
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.3rem' }}
                  value={settings.mentorHero?.badge3Title || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge3Title', e.target.value)} 
                  placeholder="শিরোনাম"
                />
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.4rem' }}
                  value={settings.mentorHero?.badge3Sub || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge3Sub', e.target.value)} 
                  placeholder="সাবটেক্সট"
                />
              </div>

              {/* Badge 4 */}
              <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#ec4899', fontWeight: 700 }}>ব্যাজ ৪ (নিচে ডানে):</span>
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.3rem' }}
                  value={settings.mentorHero?.badge4Title || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge4Title', e.target.value)} 
                  placeholder="শিরোনাম"
                />
                <input 
                  type="text" 
                  className="cms-input" 
                  style={{ marginTop: '0.4rem' }}
                  value={settings.mentorHero?.badge4Sub || ''} 
                  onChange={(e) => updateField('mentorHero', 'badge4Sub', e.target.value)} 
                  placeholder="সাবটেক্সট"
                />
              </div>
            </div>
          </div>

          {/* Teacher Detailed Bio & Section */}
          <div className="cms-subbox" style={{ marginTop: '1.25rem' }}>
            <div className="cms-subbox-title">
              <FileText size={16} /> শিক্ষক পরিচিতি মূল সেকশন
            </div>

            <div className="cms-grid-2">
              <div className="cms-field-group">
                <label>সেকশন পিল ব্যাজ:</label>
                <input 
                  type="text" 
                  className="cms-input" 
                  value={settings.mentorSection?.pill || ''} 
                  onChange={(e) => updateField('mentorSection', 'pill', e.target.value)} 
                  placeholder='"ICT মুখস্ত নয়, এসো শিখি"'
                />
              </div>

              <div className="cms-field-group">
                <label>সেকশন শিরোনাম:</label>
                <input 
                  type="text" 
                  className="cms-input" 
                  value={settings.mentorSection?.title || ''} 
                  onChange={(e) => updateField('mentorSection', 'title', e.target.value)} 
                  placeholder="প্রযুক্তির যুগে মুখস্ত বিদ্যার কোনো স্থান নেই"
                />
              </div>
            </div>

            <div className="cms-field-group">
              <label>শিক্ষকের উক্তি / বক্তব্য:</label>
              <textarea 
                className="cms-textarea" 
                value={settings.mentorSection?.bio || ''} 
                onChange={(e) => updateField('mentorSection', 'bio', e.target.value)} 
              />
            </div>

            {/* 3 Bullets */}
            <div style={{ marginTop: '0.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
                ৩টি মূল ফোকাস পয়েন্ট:
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
                    placeholder={`পয়েন্ট ${bIdx + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="cms-grid-2" style={{ marginTop: '0.75rem' }}>
              <div className="cms-field-group">
                <label>কল করার মোবাইল নম্বর:</label>
                <input 
                  type="text" 
                  className="cms-input" 
                  value={settings.mentorSection?.phone || '01723619524'} 
                  onChange={(e) => updateField('mentorSection', 'phone', e.target.value)} 
                />
              </div>

              <div className="cms-field-group">
                <label>হোয়াটসঅ্যাপ নম্বর (কান্ট্রি কোড সহ):</label>
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
                <Users size={20} color="#0284c7" /> কৃতী শিক্ষার্থীদের রিভিউ ও সাফল্য
              </h3>
              <p className="cms-section-subtitle" style={{ marginBottom: 0 }}>
                ওয়েবসাইটে প্রদর্শিত ছাত্র-ছাত্রীদের রিভিউ পরিচালনা করুন।
              </p>
            </div>

            <button 
              type="button" 
              className="cms-add-btn" 
              style={{ width: 'auto', margin: 0, padding: '0.5rem 1rem' }}
              onClick={handleAddTestimonial}
            >
              <Plus size={16} /> নতুন রিভিউ যোগ করুন
            </button>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            {(settings.testimonials || []).map((tItem, index) => (
              <div key={tItem.id || index} className="cms-item-card">
                <div className="cms-item-header">
                  <span className="cms-item-badge">রিভিউ #{index + 1}</span>
                  <button 
                    type="button" 
                    className="cms-delete-btn" 
                    onClick={() => handleDeleteTestimonial(index)}
                  >
                    <Trash2 size={13} /> মুছে ফেলুন
                  </button>
                </div>

                <div className="cms-grid-3">
                  <div className="cms-field-group">
                    <label>শিক্ষার্থীর নাম:</label>
                    <input 
                      type="text" 
                      className="cms-input" 
                      value={tItem.name || ''} 
                      onChange={(e) => handleUpdateTestimonial(index, 'name', e.target.value)} 
                    />
                  </div>

                  <div className="cms-field-group">
                    <label>কলেজ / প্রতিষ্ঠান:</label>
                    <input 
                      type="text" 
                      className="cms-input" 
                      value={tItem.college || ''} 
                      onChange={(e) => handleUpdateTestimonial(index, 'college', e.target.value)} 
                    />
                  </div>

                  <div className="cms-field-group">
                    <label>ফলাফল / ব্যাজ (যেমন: ICT: ৯৮/১০০):</label>
                    <input 
                      type="text" 
                      className="cms-input" 
                      value={tItem.score || ''} 
                      onChange={(e) => handleUpdateTestimonial(index, 'score', e.target.value)} 
                    />
                  </div>
                </div>

                <div className="cms-field-group" style={{ marginBottom: 0 }}>
                  <label>রিভিউ / প্রশংসাপত্র:</label>
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
              <Plus size={16} /> আরও রিভিউ যোগ করুন
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
                <HelpCircle size={20} color="#0284c7" /> সচরাচর জিজ্ঞাসিত প্রশ্নসমূহ (FAQ)
              </h3>
              <p className="cms-section-subtitle" style={{ marginBottom: 0 }}>
                শিক্ষার্থী ও অভিভাবকদের সাধারণ জিজ্ঞাসা ও উত্তরসমূহ সম্পাদনা করুন।
              </p>
            </div>

            <button 
              type="button" 
              className="cms-add-btn" 
              style={{ width: 'auto', margin: 0, padding: '0.5rem 1rem' }}
              onClick={handleAddFaq}
            >
              <Plus size={16} /> নতুন প্রশ্ন যোগ করুন
            </button>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            {(settings.faq || []).map((faqItem, index) => (
              <div key={faqItem.id || index} className="cms-item-card">
                <div className="cms-item-header">
                  <span className="cms-item-badge">প্রশ্ন #{index + 1}</span>
                  <button 
                    type="button" 
                    className="cms-delete-btn" 
                    onClick={() => handleDeleteFaq(index)}
                  >
                    <Trash2 size={13} /> মুছে ফেলুন
                  </button>
                </div>

                <div className="cms-field-group">
                  <label>প্রশ্ন:</label>
                  <input 
                    type="text" 
                    className="cms-input" 
                    value={faqItem.question || ''} 
                    onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)} 
                  />
                </div>

                <div className="cms-field-group" style={{ marginBottom: 0 }}>
                  <label>উত্তর:</label>
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
              <Plus size={16} /> আরও প্রশ্ন যোগ করুন
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: CONTACT & FOOTER */}
      {activeSubTab === 'footer' && (
        <div className="cms-card">
          <h3 className="cms-section-title">
            <MapPin size={20} color="#0284c7" /> যোগাযোগ, ঠিকানা ও ফুটার সেটিংস
          </h3>
          <p className="cms-section-subtitle">
            ফুটার সেকশনের যোগাযোগের ঠিকানা, হটলাইন নম্বর, সময় ও কপিরাইট লেখা আপডেট করুন।
          </p>

          <div className="cms-grid-2">
            <div className="cms-field-group">
              <label>ক্যাম্পাস / সেন্টারের ঠিকানা:</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.contact?.address || ''} 
                onChange={(e) => updateField('contact', 'address', e.target.value)} 
                placeholder="কুষ্টিয়া সরকারি কলেজ গেট, কুষ্টিয়া, বাংলাদেশ"
              />
            </div>

            <div className="cms-field-group">
              <label>হটলাইন নম্বর (প্রদর্শনযোগ্য):</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.contact?.phone || ''} 
                onChange={(e) => updateField('contact', 'phone', e.target.value)} 
                placeholder="+৮৮০ ১৭২৩-৬১৯৫২৪"
              />
            </div>
          </div>

          <div className="cms-grid-2">
            <div className="cms-field-group">
              <label>হোয়াটসঅ্যাপ সংযোগ নম্বর:</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.contact?.whatsapp || ''} 
                onChange={(e) => updateField('contact', 'whatsapp', e.target.value)} 
                placeholder="8801723619524"
              />
            </div>

            <div className="cms-field-group">
              <label>খোলা থাকার সময়সূচি:</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.contact?.hours || ''} 
                onChange={(e) => updateField('contact', 'hours', e.target.value)} 
                placeholder="সকাল ৭:০০ - রাত ৮:০০ (প্রতিদিন খোলা)"
              />
            </div>
          </div>

          <div className="cms-grid-2">
            <div className="cms-field-group">
              <label>কপিরাইট টেক্সট:</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.contact?.copyright || ''} 
                onChange={(e) => updateField('contact', 'copyright', e.target.value)} 
                placeholder="© 2026 Maruf's ICT Care. সর্বস্বত্ব সংরক্ষিত।"
              />
            </div>

            <div className="cms-field-group">
              <label>ফুটার বটম স্লোগান:</label>
              <input 
                type="text" 
                className="cms-input" 
                value={settings.contact?.footerTagline || ''} 
                onChange={(e) => updateField('contact', 'footerTagline', e.target.value)} 
                placeholder="Designed for HSC ICT Students • ICT মুখস্ত নয়, এসো শিখি"
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. Bottom Sticky Save Bar */}
      <div className="cms-sticky-save-bar">
        <div className="cms-sticky-text">
          <CheckCircle2 size={18} color="#34d399" />
          <span>সকল সেকশনের পরিবর্তন এক ক্লিকেই সেভ করুন।</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            type="button" 
            className="btn-cms-reset"
            onClick={handleReset}
          >
            <RotateCcw size={15} /> ডিফল্ট করুন
          </button>

          <button 
            type="button" 
            className="btn-cms-save"
            onClick={handleSave}
          >
            <Save size={16} /> পরিবর্তন সংরক্ষণ করুন
          </button>
        </div>
      </div>
    </div>
  );
}

export default FrontendSettings;
