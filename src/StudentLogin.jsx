// src/StudentLogin.jsx
// Dedicated Student Portal Login Screen for Coaching Pro

import React, { useState } from 'react';
import { User, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';
import { api } from './api';
import { dataStore } from './dataStore';

function StudentLogin({ onStudentLogin, onSwitchToAdmin }) {
  const [loginId, setLoginId] = useState('STU-66115');
  const [password, setPassword] = useState('01723619524');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Authenticate against MySQL Database via Laravel REST API
      const res = await api.studentLogin({ loginId: loginId.trim(), password: password.trim() });
      if (res && res.success && res.student) {
        onStudentLogin(res.student);
      } else {
        setError(res?.message || 'ভুল শিক্ষার্থী আইডি অথবা পাসওয়ার্ড!');
      }
    } catch (err) {
      // 2. Offline / Server fallback: verify from local dataStore students
      const cleanId = loginId.trim();
      const cleanPass = password.trim();
      const allStudents = dataStore.getStudents();
      const matchedStudent = allStudents.find(s => 
        s.id.toLowerCase() === cleanId.toLowerCase() || 
        (s.phone && s.phone === cleanId) ||
        (s.guardianPhone && s.guardianPhone === cleanId)
      );

      if (matchedStudent) {
        // Verify password against phone, student ID, guardian phone, or 12345678
        const isMatch = (
          cleanPass === '12345678' ||
          cleanPass === matchedStudent.phone ||
          cleanPass === matchedStudent.guardianPhone ||
          cleanPass === matchedStudent.id ||
          (matchedStudent.phone && matchedStudent.phone.endsWith(cleanPass))
        );

        if (isMatch) {
          onStudentLogin(matchedStudent);
        } else {
          setError('পাসওয়ার্ড অথবা মোবাইল নম্বর সঠিক নয়! ভর্তি ফর্মে দেওয়া মোবাইল নম্বর বা 12345678 দিয়ে চেষ্টা করুন।');
        }
      } else {
        setError(err.message || 'শিক্ষার্থী আইডি অথবা মোবাইল নম্বর পাওয়া যায়নি!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">
            <img src="/logo.png" alt="Maruf's ICT Care Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </div>
          <span className="logo-text">Maruf's ICT Care</span>
        </div>
        <button 
          type="button" 
          onClick={onSwitchToAdmin} 
          className="back-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <ShieldCheck size={16} strokeWidth={2.5} />
          এডমিন পোর্টাল
        </button>
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

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span className="welcome-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                <Sparkles size={13} style={{ marginRight: '4px', display: 'inline', verticalAlign: 'middle' }} />
                শিক্ষার্থী পোর্টাল (Student Portal)
              </span>
            </div>
            <h1 className="login-title">শিক্ষার্থী লগইন</h1>
            <p className="login-desc">আপনার ক্লাস রুটিন, ফি, হাজিরা ও পরীক্ষার ফলাফল দেখতে লগইন করুন।</p>
          </div>

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
              lineHeight: 1.4
            }}>
              <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">শিক্ষার্থী আইডি অথবা মোবাইল নম্বর</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="যেমন: STU-66115 বা 01723619524" 
                  value={loginId}
                  onChange={(e) => { setLoginId(e.target.value); setError(null); }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">পাসওয়ার্ড অথবা নিবন্ধিত মোবাইল নম্বর</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-input" 
                  placeholder="মোবাইল নম্বর অথবা 12345678"
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
              style={{ opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'যাচাই করা হচ্ছে...' : 'শিক্ষার্থী ড্যাশবোর্ডে প্রবেশ করুন'} {!loading && <ArrowRight size={18} strokeWidth={2.5} />}
            </button>
          </form>

          {/* Switch to Admin Login */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={onSwitchToAdmin}
              style={{
                background: 'none',
                border: 'none',
                color: '#0284c7',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck size={16} /> এডমিন বা ম্যানেজার হিসেবে লগইন করুন
            </button>
          </div>

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

export default StudentLogin;
