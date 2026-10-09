// src/StudentLogin.jsx
// Dedicated Student Portal Login Screen for Coaching Pro
// Authentication via registered mobile number only

import React, { useState } from 'react';
import { Phone, ArrowRight, ArrowLeft, AlertCircle, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';
import { api } from './api';
import { dataStore } from './dataStore';

function StudentLogin({ onStudentLogin, onSwitchToAdmin, onBackToHome }) {
  const [phone, setPhone] = useState('01723619524');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanPhone = phone.trim();

    try {
      // 1. Authenticate against MySQL Database via Laravel REST API (/api/student-login)
      const res = await api.studentLogin({ phone: cleanPhone });
      if (res && res.success && res.student) {
        onStudentLogin(res.student);
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
        onStudentLogin(matchedStudent);
      } else {
        setError(err.message || 'এই মোবাইল নম্বরে কোনো শিক্ষার্থী খুঁজে পাওয়া যায়নি! ভর্তি ফর্মে দেওয়া মোবাইল নম্বর প্রদান করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="logo-container" onClick={() => { if (onBackToHome) onBackToHome(); else window.location.hash = '#/'; }} style={{ cursor: 'pointer' }} title="মূল ওয়েবসাইটে যান">
          <div className="logo-icon">
            <img src="/logo.png" alt="Maruf's ICT Care Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </div>
          <span className="logo-text">Maruf's ICT Care</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            type="button" 
            onClick={() => { if (onBackToHome) onBackToHome(); else window.location.hash = '#/'; }} 
            className="back-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: '#64748b' }}
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            মূল ওয়েবসাইট
          </button>
          <button 
            type="button" 
            onClick={onSwitchToAdmin} 
            className="back-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <ShieldCheck size={16} strokeWidth={2.5} />
            এডমিন পোর্টাল
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
