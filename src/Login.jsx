import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Smartphone, ArrowLeft } from 'lucide-react';

function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);

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
            <span className="welcome-badge">আবারও স্বাগতম</span>
            <h1 className="login-title">লগইন করুন</h1>
            <p className="login-desc">শিক্ষার্থী, ফি, হাজিরা ও পরীক্ষার তথ্য দেখতে লগইন করুন।</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="form-group">
              <label className="form-label">ইমেইল</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="marufjarvis@gmail.com" 
                  defaultValue="marufjarvis@gmail.com"
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
                  defaultValue="12345678"
                />
                <button 
                  type="button" 
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              লগইন করুন <ArrowRight size={18} strokeWidth={2.5} />
            </button>

            <div className="form-footer">
              <a href="#" className="forgot-pwd">পাসওয়ার্ড ভুলে গেছেন?</a>
              <a href="#" className="create-account">
                অ্যাকাউন্ট খুলুন <ArrowRight size={16} strokeWidth={2.5} />
              </a>
            </div>
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
