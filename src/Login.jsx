import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Smartphone, ArrowLeft, AlertCircle, ShieldCheck, GraduationCap, Phone } from 'lucide-react';
import { api } from './api';
import { dataStore } from './dataStore';

function Login({ onLogin, onStudentLogin, onBackToHome, initialTab = 'student' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'student' | 'admin'

  // Student form state
  const [phone, setPhone] = useState('');
  
  // Admin form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanPhone = phone.trim();

    try {
      // 1. Authenticate against MySQL Database via Laravel REST API (/api/student-login)
      const res = await api.studentLogin({ phone: cleanPhone });
      if (res && res.success && res.student) {
        if (onStudentLogin) onStudentLogin(res.student);
      } else {
        setError(res?.message || 'এই মোবাইল নম্বরে কোনো শিক্ষার্থী খুঁজে পাওয়া যায়নি!');
      }
    } catch (err) {
      // 2. Offline / Server fallback: verify from local dataStore students
      const allStudents = dataStore.getStudents();
      const matchedStudent = allStudents.find(s => 
        (s.phone && s.phone.replace(/[\s-]/g, '') === cleanPhone.replace(/[\s-]/g, '')) ||
        (s.guardianPhone && s.guardianPhone.replace(/[\s-]/g, '') === cleanPhone.replace(/[\s-]/g, ''))
      );

      if (matchedStudent) {
        if (onStudentLogin) onStudentLogin(matchedStudent);
      } else {
        setError(err.message || 'এই মোবাইল নম্বরে কোনো শিক্ষার্থী খুঁজে পাওয়া যায়নি! ভর্তি ফর্মে দেওয়া মোবাইল নম্বর প্রদান করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Authenticate against MySQL Database via Laravel REST API (/api/login)
      const res = await api.login({ email: email.trim(), password });
      if (res && res.success && res.user) {
        if (onLogin) onLogin(res.user);
      } else {
        setError(res?.message || 'ভুল ইমেইল অথবা পাসওয়ার্ড! সঠিক এডমিন বা ম্যানেজার তথ্য দিন।');
      }
    } catch (err) {
      // 2. Offline / Server fallback: verify default seeded credentials if offline
      const cleanEmail = email.trim().toLowerCase();
      if (
        (cleanEmail === 'marufjarvis@gmail.com' && password === '12345678') ||
        (cleanEmail === 'manager@gmail.com' && password === '12345678')
      ) {
        const fallbackUser = cleanEmail === 'marufjarvis@gmail.com'
          ? { id: 1, name: 'Maruf Hossain (Admin)', email: cleanEmail, role: 'admin' }
          : { id: 2, name: 'Center Manager', email: cleanEmail, role: 'manager' };
        if (onLogin) onLogin(fallbackUser);
      } else {
        setError(err.message || 'ভুল ইমেইল অথবা পাসওয়ার্ড! এডমিন বা ম্যানেজারের সঠিক তথ্য দিন।');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div 
          className="logo-container" 
          onClick={() => { if (onBackToHome) onBackToHome(); else window.location.hash = '#/'; }} 
          style={{ cursor: 'pointer' }} 
          title="মূল ওয়েবসাইটে যান"
        >
          <div className="logo-icon">
            <img src="/logo.png" alt="Maruf's ICT Care Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </div>
          <span className="logo-text">Maruf's ICT Care</span>
        </div>

        <div>
          <button 
            type="button" 
            onClick={() => { if (onBackToHome) onBackToHome(); else window.location.hash = '#/'; }} 
            className="back-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: '#64748b' }}
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            মূল ওয়েবসাইট
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="login-card">
          <div className="card-header">
            <div className="card-logo">
              <img src="/logo.png" alt="Maruf's ICT Care Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            </div>
            <div>
              <div className="card-brand-name">Maruf's ICT Care</div>
              <div className="card-subtitle">ICT মুখস্ত নয়, এসো শিখি</div>
            </div>
          </div>

          {/* Unified Role Tab Switcher */}
          <div className="auth-tab-container">
            <button
              type="button"
              className={`auth-tab-pill ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => { setActiveTab('student'); setError(null); }}
              id="tab-btn-student"
            >
              <GraduationCap size={16} /> শিক্ষার্থী লগইন
            </button>
            <button
              type="button"
              className={`auth-tab-pill ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => { setActiveTab('admin'); setError(null); }}
              id="tab-btn-admin"
            >
              <ShieldCheck size={16} /> শিক্ষক ও এডমিন
            </button>
          </div>

          {/* Card Title & Badges */}
          {activeTab === 'student' ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span className="welcome-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                  👨‍🎓 শিক্ষার্থী পোর্টাল (Student Portal)
                </span>
              </div>
              <h1 className="login-title">শিক্ষার্থী লগইন</h1>
              <p className="login-desc">আপনার ক্লাস রুটিন, ফি, হাজিরা ও পরীক্ষার ফলাফল দেখতে লগইন করুন।</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span className="welcome-badge">
                  <ShieldCheck size={13} style={{ marginRight: '4px', display: 'inline', verticalAlign: 'middle' }} />
                  এডমিন ও শিক্ষক পোর্টাল
                </span>
              </div>
              <h1 className="login-title">এডমিন লগইন</h1>
              <p className="login-desc">শিক্ষার্থী, ফি, হাজিরা ও পরীক্ষার তথ্য ব্যবস্থাপনা করতে লগইন করুন।</p>
            </div>
          )}

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              marginTop: '0.5rem',
              lineHeight: 1.4
            }}>
              <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Tab 1: Student Phone Login */}
          {activeTab === 'student' && (
            <form onSubmit={handleStudentSubmit}>
              <div className="form-group">
                <label className="form-label">নিবন্ধিত মোবাইল নম্বর</label>
                <div className="input-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="যেমন: 01723619524" 
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setError(null); }}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-btn" 
                disabled={loading}
                style={{ opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1.25rem' }}
              >
                {loading ? 'যাচাই করা হচ্ছে...' : 'শিক্ষার্থী ড্যাশবোর্ডে প্রবেশ করুন'} {!loading && <ArrowRight size={18} strokeWidth={2.5} />}
              </button>
            </form>
          )}

          {/* Tab 2: Admin / Teacher Login */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit}>
              <div className="form-group">
                <label className="form-label">ইমেইল</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="marufjarvis@gmail.com" 
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">পাসওয়ার্ড</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-input" 
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    required
                  />
                  <button 
                    type="button" 
                    className="input-icon-right"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-btn" 
                disabled={loading}
                style={{ opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem' }}
              >
                {loading ? 'যাচাই করা হচ্ছে...' : 'এডমিন প্যানেলে প্রবেশ করুন'} {!loading && <ArrowRight size={18} strokeWidth={2.5} />}
              </button>
            </form>
          )}

          <div className="card-footer">
            <a href="#" className="download-app">
              <Smartphone size={18} strokeWidth={2.5} />
              অ্যান্ড্রয়েড অ্যাপ ডাউনলোড করুন
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
