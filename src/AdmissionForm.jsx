// src/AdmissionForm.jsx
// Public Admission Form for HSC ICT Coaching

import React, { useState } from 'react';
import './admission.css';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { dataStore } from './dataStore';

function AdmissionForm({ batch: initialBatch }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guardianPhone: '',
    college: '',
    selectedBatch: initialBatch || 'HSC 2026 রেগুলার ব্যাচ'
  });
  const [submitted, setSubmitted] = useState(false);

  const availableBatches = dataStore.getBatches();
  const batchOptions = availableBatches.length > 0 
    ? availableBatches.map(b => b.name)
    : ['HSC 2026 রেগুলার ব্যাচ', 'HSC 2025 টেস্ট পেপার সলভ ব্যাচ', 'HSC 2027 ফাউন্ডেশন কোর্স'];

  const isFormValid = formData.name.trim() !== '' && formData.phone.trim() !== '' && formData.guardianPhone.trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalBatch = formData.selectedBatch || initialBatch || 'HSC 2026';
    const appData = {
      id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      guardianPhone: formData.guardianPhone.trim(),
      college: formData.college.trim(),
      preferredBatch: finalBatch,
      batch: finalBatch,
      date: new Date().toLocaleDateString('en-GB')
    };

    // Save to dataStore (syncs to MySQL & localStorage)
    dataStore.addPendingAdmission(appData);
    setSubmitted(true);
  };

  const handleBackToHome = () => {
    window.location.hash = '#/';
  };

  if (submitted) {
    return (
      <div className="admission-wrapper">
        <div className="admission-card success-card" style={{ textAlign: 'center' }}>
          <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 1rem' }} />
          <h2>ধন্যবাদ!</h2>
          <p style={{ fontSize: '1.1rem', marginTop: '0.5rem', color: '#0f172a' }}>
            আপনার ভর্তির আবেদন সফলভাবে জমা হয়েছে।
          </p>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            খুব শীঘ্রই কোচিং অফিস থেকে আপনার সাথে যোগাযোগ করা হবে।
          </p>

          <button 
            type="button" 
            onClick={handleBackToHome}
            style={{
              marginTop: '1.5rem',
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ← মূল ওয়েবসাইটে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admission-wrapper">
      <div className="admission-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div className="admission-tag">Student Admissions</div>
          <button 
            type="button" 
            onClick={handleBackToHome}
            style={{
              background: 'none',
              border: 'none',
              color: '#0284c7',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ArrowLeft size={14} /> মূল ওয়েবসাইট
          </button>
        </div>

        <h1 className="admission-title">HSC ICT অনলাইন ভর্তি</h1>
        <p className="admission-subtitle">
          Maruf's ICT Care &middot; {formData.selectedBatch || 'নতুন শিক্ষাবর্ষ'}
        </p>
        
        <div className="admission-divider"></div>
        
        <form onSubmit={handleSubmit} className="admission-form">
          <div className="form-group">
            <label>শিক্ষার্থীর পুরো নাম *</label>
            <input 
              type="text" 
              placeholder="যেমন: তানভীর আহমেদ"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>কলেজের নাম</label>
            <input 
              type="text" 
              placeholder="যেমন: কুষ্টিয়া সরকারি কলেজ"
              value={formData.college}
              onChange={(e) => setFormData({...formData, college: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>শিক্ষার্থীর মোবাইল নম্বর *</label>
            <input 
              type="tel" 
              placeholder="01XXXXXXXXX" 
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>অভিভাবকের মোবাইল নম্বর *</label>
            <input 
              type="tel" 
              placeholder="01XXXXXXXXX" 
              required
              value={formData.guardianPhone}
              onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>পছন্দের ব্যাচ</label>
            <select
              value={formData.selectedBatch}
              onChange={(e) => setFormData({...formData, selectedBatch: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                backgroundColor: '#ffffff'
              }}
            >
              {batchOptions.map((bName, i) => (
                <option key={i} value={bName}>{bName}</option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="btn-submit" disabled={!isFormValid}>
            ভর্তি আবেদন সম্পন্ন করুন
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdmissionForm;
