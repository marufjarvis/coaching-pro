import React, { useState, useEffect } from 'react';
import { Building, Shield, Image as ImageIcon, Globe, Upload, CheckCircle2, Database, Download } from 'lucide-react';
import { dataStore } from './dataStore';
import { api } from './api';
import { useTranslation } from './translations';
import './settings.css';

function Settings({ lang: propLang }) {
  const { t, lang, setLang } = useTranslation(propLang);
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
    showToast(t.profileUpdatedToast);
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
    showToast(t.passwordUpdatedToast);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dataStore.saveSettings({ logoUrl: reader.result });
        showToast(t.logoUpdatedToast);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectLang = (newLang) => {
    setLang(newLang);
    dataStore.setLanguage(newLang);
    showToast(t.languageSetToast.replace('{lang}', newLang === 'BN' ? 'বাংলা' : 'English'));
  };

  const [isBackupLoading, setIsBackupLoading] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);

  const handleDownloadBackup = async () => {
    setIsBackupLoading(true);
    try {
      const data = await api.exportDatabase();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CoachingPro_Backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(lang === 'BN' ? 'ব্যাকআপ ডাউনলোড সফল হয়েছে' : 'Backup downloaded successfully');
    } catch (e) {
      alert(lang === 'BN' ? 'ব্যাকআপ ডাউনলোড ব্যর্থ হয়েছে' : 'Failed to download backup');
    }
    setIsBackupLoading(false);
  };

  const handleUploadBackup = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!window.confirm(lang === 'BN' ? 'আপনি কি নিশ্চিত? পূর্বের সকল ডাটা মুছে যাবে!' : 'Are you sure? This will wipe all existing data!')) {
      e.target.value = '';
      return;
    }

    setIsUploadLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await api.importDatabase(data);
      alert(lang === 'BN' ? 'ডাটাবেজ সফলভাবে রিস্টোর হয়েছে! পেজটি রিলোড করা হচ্ছে...' : 'Database restored successfully! Reloading...');
      window.location.reload();
    } catch (e) {
      alert((lang === 'BN' ? 'ডাটাবেজ আপলোডে সমস্যা হয়েছে: ' : 'Failed to upload database: ') + e.message);
      setIsUploadLoading(false);
    }
    e.target.value = '';
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
                <h3>{t.coachingProfileTitle}</h3>
                <p>{t.coachingProfileDesc}</p>
              </div>
            </div>
            <form onSubmit={handleSaveProfile} className="settings-card-body">
              <div className="form-group">
                <label>{t.coachingNameInputLabel}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={profileForm.coachingName}
                  onChange={(e) => setProfileForm({ ...profileForm, coachingName: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>{t.phoneInputLabel}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group half">
                  <label>{t.addressInputLabel}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>{t.taglineInputLabel}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                />
              </div>
              <div className="mt-3">
                <button type="submit" className="btn-primary">{t.saveProfileBtn}</button>
              </div>
            </form>
          </div>

          {/* Account Security */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon-box"><Shield size={20} /></div>
              <div>
                <h3>{t.accountSecurityTitle}</h3>
                <p>{t.accountSecurityDesc}</p>
              </div>
            </div>
            <form onSubmit={handleUpdatePassword} className="settings-card-body">
              <div className="form-row">
                <div className="form-group half">
                  <label>{t.currentPasswordLabel}</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="form-group half">
                  <label>{t.newPasswordLabel}</label>
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
                <button type="submit" className="btn-primary">{t.updatePasswordBtn}</button>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>{t.minCharactersDesc}</span>
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
                <h3>{t.brandingLogoTitle}</h3>
                <p>{t.brandingLogoDesc}</p>
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
                  <strong>{t.uploadLogoTitle}</strong>
                  <p>{t.uploadLogoDesc}</p>
                </label>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon-box"><Globe size={20} /></div>
              <div>
                <h3>{t.workspaceLanguageTitle}</h3>
                <p>{t.workspaceLanguageDesc}</p>
              </div>
            </div>
            <div className="settings-card-body">
              <div className="language-options">
                <div 
                  className={`lang-box ${lang === 'EN' ? 'active' : ''}`}
                  onClick={() => handleSelectLang('EN')}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>English</strong>
                  <span>{lang === 'EN' ? `(${t.active})` : 'English'}</span>
                </div>
                <div 
                  className={`lang-box ${lang === 'BN' ? 'active' : ''}`}
                  onClick={() => handleSelectLang('BN')}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>বাংলা</strong>
                  <span>{lang === 'BN' ? `(${t.active})` : 'Bangla'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Database Backup & Restore */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon-box"><Database size={20} /></div>
              <div>
                <h3>{lang === 'BN' ? 'ডাটাবেজ (Database)' : 'Database Management'}</h3>
                <p>{lang === 'BN' ? 'আপনার ওয়েবসাইটের সম্পূর্ণ ডাটাবেজ ব্যাকআপ নিন এবং নতুন হোস্টিংয়ে আপলোড করুন।' : 'Download a complete backup or restore from an existing backup.'}</p>
              </div>
            </div>
            <div className="settings-card-body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn-outline" 
                onClick={handleDownloadBackup}
                disabled={isBackupLoading}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}
              >
                <Download size={18} />
                {isBackupLoading ? (lang === 'BN' ? 'ডাউনলোড হচ্ছে...' : 'Downloading...') : (lang === 'BN' ? 'ব্যাকআপ ডাউনলোড' : 'Download Backup')}
              </button>
              
              <label 
                className="btn-primary" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center', cursor: 'pointer', margin: 0, opacity: isUploadLoading ? 0.7 : 1 }}
              >
                <Upload size={18} />
                {isUploadLoading ? (lang === 'BN' ? 'আপলোড হচ্ছে...' : 'Uploading...') : (lang === 'BN' ? 'ডেটাবেজ আপলোড' : 'Upload Database')}
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleUploadBackup} 
                  style={{ display: 'none' }} 
                  disabled={isUploadLoading}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
