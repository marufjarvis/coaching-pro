import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Smartphone, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';
import { api } from './api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('marufjarvis@gmail.com');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Authenticate against MySQL Database via Laravel REST API (/api/login)
      const res = await api.login({ email: email.trim(), password });
      if (res && res.success && res.user) {
        onLogin(res.user);
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
        onLogin(fallbackUser);
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
        <div className="logo-container">
          <div className="logo-icon">
            <img src="/logo.png" alt="Maruf's ICT Care Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </div>
          <span className="logo-text">Maruf's ICT Care</span>
        </div>
        <a href="#" className="back-link">
          <ArrowLeft size={16} strokeWidth={2.5} />
          মূল পাতায় ফিরুন
        </a>
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
              <span className="welcome-badge">
                <ShieldCheck size={13} style={{ marginRight: '4px', display: 'inline', verticalAlign: 'middle' }} />
                এডমিন ও ম্যানেজার পোর্টাল
              </span>
            </div>
            <h1 className="login-title">লগইন করুন</h1>
            <p className="login-desc">শিক্ষার্থী, ফি, হাজিরা ও পরীক্ষার তথ্য দেখতে লগইন করুন।</p>
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
              style={{ opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'} {!loading && <ArrowRight size={18} strokeWidth={2.5} />}
            </button>
          </form>

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
