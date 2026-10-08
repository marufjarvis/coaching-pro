import React from 'react';
import { Building, Shield, Image as ImageIcon, Globe, Upload } from 'lucide-react';
import './settings.css';

function Settings() {
  return (
    <div className="settings-container">
      <div className="settings-grid">
        {/* Left Column */}
        <div className="settings-col">
          {/* Coaching Profile */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon-box"><Building size={20} /></div>
              <div>
                <h3>Coaching profile</h3>
                <p>Shown on receipts, reports, and guardian-facing documents.</p>
              </div>
            </div>
            <div className="settings-card-body">
              <div className="form-group">
                <label>কোচিংয়ের নাম</label>
                <input type="text" className="form-control" defaultValue="Maruf's ICT Care" />
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>ফোন</label>
                  <input type="text" className="form-control" defaultValue="01723619524" />
                </div>
                <div className="form-group half">
                  <label>ADDRESS</label>
                  <input type="text" className="form-control" defaultValue="Kushtia Govt. College Gate" />
                </div>
              </div>
              <div className="mt-3">
                <button className="btn-primary">Save profile</button>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon-box"><Shield size={20} /></div>
              <div>
                <h3>Account security</h3>
                <p>Update the password used to sign in to CoachingPro.</p>
              </div>
            </div>
            <div className="settings-card-body">
              <div className="form-row">
                <div className="form-group half">
                  <label>CURRENT PASSWORD</label>
                  <input type="password" className="form-control" />
                </div>
                <div className="form-group half">
                  <label>নতুন পাসওয়ার্ড</label>
                  <input type="password" className="form-control" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn-primary">Update password</button>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Minimum 6 characters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="settings-col">
          {/* Branding Logo */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon-box"><ImageIcon size={20} /></div>
              <div>
                <h3>Branding logo</h3>
                <p>Used on printed receipts, ledgers, and progress reports.</p>
              </div>
            </div>
            <div className="settings-card-body">
              <div className="logo-upload-container">
                <div className="current-logo">
                  <div className="mock-logo">
                    <span className="mock-logo-text">M@RUF'S ICT CARE</span>
                    <span className="mock-logo-sub">Don't Memorise, Come To Learn</span>
                  </div>
                </div>
                <div className="upload-box">
                  <Upload size={24} color="#64748b" style={{ marginBottom: '0.5rem' }} />
                  <strong>Upload logo</strong>
                  <p>PNG, JPG or WebP - max 3MB - auto-optimized under 200KB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon-box"><Globe size={20} /></div>
              <div>
                <h3>ভাষা</h3>
                <p>Choose the language for the CoachingPro workspace.</p>
              </div>
            </div>
            <div className="settings-card-body">
              <div className="language-options">
                <div className="lang-box">
                  <strong>English</strong>
                  <span>English</span>
                </div>
                <div className="lang-box active">
                  <strong>বাংলা</strong>
                  <span>Bangla</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
