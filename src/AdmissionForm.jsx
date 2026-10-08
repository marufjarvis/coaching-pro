import React, { useState } from 'react';
import './admission.css';

function AdmissionForm({ batch }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guardianPhone: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const isFormValid = formData.name.trim() !== '' && formData.phone.trim() !== '' && formData.guardianPhone.trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    const appData = {
      id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      guardianPhone: formData.guardianPhone.trim(),
      preferredBatch: batch,
      batch: batch,
      date: new Date().toLocaleDateString('en-GB')
    };

    // Save to pendingAdmissions for Online Admission review
    const pendingAdmissions = JSON.parse(localStorage.getItem('pendingAdmissions') || '[]');
    pendingAdmissions.unshift(appData);
    localStorage.setItem('pendingAdmissions', JSON.stringify(pendingAdmissions));

    // Also sync to pendingStudents
    const pendingStudents = JSON.parse(localStorage.getItem('pendingStudents') || '[]');
    pendingStudents.unshift(appData);
    localStorage.setItem('pendingStudents', JSON.stringify(pendingStudents));

    window.dispatchEvent(new Event('storage'));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="admission-wrapper">
        <div className="admission-card success-card">
          <h2>ধন্যবাদ!</h2>
          <p>আপনার ভর্তির আবেদন সফলভাবে জমা হয়েছে।</p>
          <p>খুব শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admission-wrapper">
      <div className="admission-card">
        <div className="admission-tag">Student admissions</div>
        <h1 className="admission-title">শিক্ষার্থী ভর্তি</h1>
        <p className="admission-subtitle">Maruf's ICT Care &middot; {batch}</p>
        
        <div className="admission-divider"></div>
        
        <form onSubmit={handleSubmit} className="admission-form">
          <div className="form-group">
            <label>নাম</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>ফোন</label>
            <input 
              type="tel" 
              placeholder="01XXXXXXXXX" 
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>GUARDIAN PHONE</label>
            <input 
              type="tel" 
              required
              value={formData.guardianPhone}
              onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
            />
          </div>
          
          <button type="submit" className="btn-submit" disabled={!isFormValid}>
            ভর্তি জমা দিন
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdmissionForm;
