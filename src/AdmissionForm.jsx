// src/AdmissionForm.jsx
// Public Admission Form for HSC ICT Coaching

import React, { useState, useEffect } from 'react';
import './admission.css';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { dataStore } from './dataStore';

function AdmissionForm({ batch: initialBatch }) {
  const availableBatches = dataStore.getBatches();
  const rawBatchOptions = availableBatches.length > 0 
    ? availableBatches.map(b => b.name)
    : ['HSC 2026 রেগুলার ব্যাচ', 'HSC 2025 রিভিশন ও টেস্ট পেপার সলভ', 'HSC 2027 ফাউন্ডেশন কোর্স'];
  const batchOptions = (initialBatch && !rawBatchOptions.includes(initialBatch))
    ? [initialBatch, ...rawBatchOptions]
    : rawBatchOptions;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guardianPhone: '',
    selectedBatch: initialBatch || ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (initialBatch) {
      setFormData(prev => ({ ...prev, selectedBatch: initialBatch }));
    }
  }, [initialBatch]);

  const isFormValid = 
    formData.name.trim() !== '' && 
    formData.phone.trim() !== '' && 
    formData.guardianPhone.trim() !== '' &&
    (Boolean(initialBatch) || Boolean(formData.selectedBatch));

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalBatch = initialBatch || formData.selectedBatch || 'HSC 2026';
    const appData = {
      id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      guardianPhone: formData.guardianPhone.trim(),
      college: '',
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
          Maruf's ICT Care &middot; {initialBatch ? initialBatch : 'নতুন শিক্ষাবর্ষ'}
        </p>
        
        {initialBatch && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: '600',
            marginTop: '0.5rem'
          }}>
            <CheckCircle2 size={15} color="#10b981" />
            <span>নির্বাচিত ব্যাচ: <strong>{initialBatch}</strong></span>
          </div>
        )}
        
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

          {!initialBatch && (
            <div className="form-group">
              <label>পছন্দের ব্যাচ *</label>
              <select
                value={formData.selectedBatch}
                onChange={(e) => setFormData({...formData, selectedBatch: e.target.value})}
                required
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
                <option value="">-- আপনার পছন্দের ব্যাচ নির্বাচন করুন --</option>
                {batchOptions.map((bName, i) => (
                  <option key={i} value={bName}>{bName}</option>
                ))}
              </select>
            </div>
          )}
          
          <button type="submit" className="btn-submit" disabled={!isFormValid}>
            ভর্তি আবেদন সম্পন্ন করুন
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdmissionForm;
