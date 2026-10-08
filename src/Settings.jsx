import React, { useState, useEffect } from 'react';
import { Building, Shield, Image as ImageIcon, Globe, Upload, CheckCircle2 } from 'lucide-react';
import { dataStore } from './dataStore';
import './settings.css';

function Settings() {
  const [settings, setSettings] = useState(() => dataStore.getSettings());
  const [profileForm, setProfileForm] = useState({
    coachingName: settings.coachingName || "Maruf's ICT Care",
    phone: settings.phone || "01723619524",
    address: settings.address || "Kushtia Govt. College Gate, Kushtia",
    tagline: settings.tagline || "Don't Memorise, Come To Learn"
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [selectedLang, setSelectedLang] = useState(() => localStorage.getItem('coachingLanguage') || 'BN');

  useEffect(() => {
    const handleSync = () => {
      const s = dataStore.getSettings();
      setSettings(s);
    };
    window.addEventListener('coaching-data-change', handleSync);
    return () => window.removeEventListener('coaching-data-change', handleSync);
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.coachingName.trim()) {
      alert("Coaching name is required.");
      return;
    }
    dataStore.saveSettings(profileForm);
    showToast("Coaching profile updated successfully!");
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    dataStore.saveSettings({ adminPassword: newPassword });
    setCurrentPassword('');
    setNewPassword('');
    showToast("Password updated successfully!");
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dataStore.saveSettings({ logoUrl: reader.result });
        showToast("Branding logo updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectLang = (lang) => {
    setSelectedLang(lang);
    localStorage.setItem('coachingLanguage', lang);
    showToast(`Language set to ${lang === 'BN' ? 'বাংলা' : 'English'}`);
  };

  return (
    <div className="settings-container">
      {toastMsg && (
        <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '10px 16px', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

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
            <form onSubmit={handleSaveProfile} className="settings-card-body">
              <div className="form-group">
                <label>কোচিংয়ের নাম (Coaching Name)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={profileForm.coachingName}
                  onChange={(e) => setProfileForm({ ...profileForm, coachingName: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>ফোন (Phone)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group half">
                  <label>ঠিকানা (Address)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>স্লোগান / ট্যাগলাইন (Tagline)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                />
              </div>
              <div className="mt-3">
                <button type="submit" className="btn-primary">Save profile</button>
              </div>
            </form>
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
            <form onSubmit={handleUpdatePassword} className="settings-card-body">
              <div className="form-row">
                <div className="form-group half">
                  <label>CURRENT PASSWORD</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="form-group half">
                  <label>নতুন পাসওয়ার্ড</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary">Update password</button>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Minimum 6 characters</span>
              </div>
            </form>
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
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo" style={{ maxHeight: '60px', objectFit: 'contain' }} />
                  ) : (
                    <div className="mock-logo">
                      <span className="mock-logo-text">{settings.coachingName}</span>
                      <span className="mock-logo-sub">{settings.tagline}</span>
                    </div>
                  )}
                </div>
                <label className="upload-box" style={{ cursor: 'pointer' }}>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                  <Upload size={24} color="#64748b" style={{ marginBottom: '0.5rem' }} />
                  <strong>Upload logo</strong>
                  <p>PNG, JPG or WebP - click to select file</p>
                </label>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon-box"><Globe size={20} /></div>
              <div>
                <h3>ভাষা (Workspace Language)</h3>
                <p>Choose the language for the CoachingPro workspace.</p>
              </div>
            </div>
            <div className="settings-card-body">
              <div className="language-options">
                <div 
                  className={`lang-box ${selectedLang === 'EN' ? 'active' : ''}`}
                  onClick={() => handleSelectLang('EN')}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>English</strong>
                  <span>English</span>
                </div>
                <div 
                  className={`lang-box ${selectedLang === 'BN' ? 'active' : ''}`}
                  onClick={() => handleSelectLang('BN')}
                  style={{ cursor: 'pointer' }}
                >
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
