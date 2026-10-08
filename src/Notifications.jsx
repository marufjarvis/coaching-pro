import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, UserCheck, ArrowRight } from 'lucide-react';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './notifications.css';

function Notifications({ setActiveTab, lang: propLang }) {
  const { t, lang } = useTranslation(propLang);
  const [students, setStudents] = useState(() => dataStore.getStudents());
  const [pendingAdmissions, setPendingAdmissions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pendingAdmissions') || '[]');
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const handleSync = () => {
      setStudents(dataStore.getStudents());
      try {
        setPendingAdmissions(JSON.parse(localStorage.getItem('pendingAdmissions') || '[]'));
      } catch (e) {}
    };
    window.addEventListener('coaching-data-change', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('coaching-data-change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Compute live due notifications
  const dueStudents = students
    .filter(s => s.status === 'Active')
    .map(s => ({ ...s, ...dataStore.calculateDue(s) }))
    .filter(s => s.isDue);

  return (
    <div className="notifications-container">
      <div className="page-header">
        <div>
          <div className="fee-followup-tag">
            <Bell size={14} /> {lang === 'EN' ? 'UPDATES & ALERTS' : 'আপডেট ও সতর্কতা'}
          </div>
          <h1>{t.notifications}</h1>
          <p className="subtitle">{lang === 'EN' ? 'Stay updated on due payments and pending online admissions.' : 'বকেয়া পেমেন্ট এবং অনলাইন ভর্তি আবেদনের সর্বশেষ তথ্য।'}</p>
        </div>
      </div>

      <div className="notifications-list">
        {/* Pending Admissions Alert */}
        {pendingAdmissions.map((admission) => (
          <div key={admission.id} className="notification-card" style={{ borderLeft: '4px solid #0284c7' }}>
            <div className="notif-icon">
              <UserCheck size={24} color="#0284c7" />
            </div>
            <div className="notif-content">
              <h4>{lang === 'EN' ? 'New Online Admission Application' : 'নতুন অনলাইন ভর্তি আবেদন'}</h4>
              <p>
                <strong>{admission.name}</strong> ({admission.phone}) {lang === 'EN' ? 'submitted an admission form for batch' : 'ভর্তি আবেদন করেছেন ব্যাচ'} <strong>{admission.preferredBatch}</strong>.
              </p>
              <span className="notif-time">{admission.date || (lang === 'EN' ? 'Recent application' : 'সাম্প্রতিক আবেদন')}</span>
            </div>
            <div className="notif-action">
              <button 
                className="btn-secondary" 
                onClick={() => setActiveTab('online-admission')}
              >
                {lang === 'EN' ? 'Review Application' : 'আবেদন পর্যালোচনা'} <ArrowRight size={16} style={{ marginLeft: '4px' }} />
              </button>
            </div>
          </div>
        ))}

        {/* Payment Due Alerts */}
        {dueStudents.map((notif) => (
          <div key={notif.id} className="notification-card">
            <div className="notif-icon">
              <AlertCircle size={24} color="#ef4444" />
            </div>
            <div className="notif-content">
              <h4>{lang === 'EN' ? 'Payment Due Alert' : 'বকেয়া ফি সতর্কতা'}</h4>
              <p>
                <strong>{notif.name}</strong> ({notif.batch}) {lang === 'EN' ? 'has an outstanding due of' : 'এর বকেয়া রয়েছে'} <strong>৳ {notif.dueAmount.toLocaleString()}</strong> ({notif.feeType === 'monthly' ? t.badgeMonthly : t.badgeCourse}).
              </p>
              <span className="notif-time">{lang === 'EN' ? 'Due for collection' : 'আদায়যোগ্য বকেয়া'}</span>
            </div>
            <div className="notif-action">
              <button 
                className="btn-secondary" 
                onClick={() => setActiveTab('due-inbox')}
              >
                {t.reviewDues} <ArrowRight size={16} style={{ marginLeft: '4px' }} />
              </button>
            </div>
          </div>
        ))}

        {dueStudents.length === 0 && pendingAdmissions.length === 0 && (
          <div className="empty-state-box">
            <Bell size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <p>{lang === 'EN' ? "You're all caught up! No active alerts or pending items." : "সবকিছু হালনাগাদ রয়েছে! বর্তমানে কোনো বকেয়া বা অপেক্ষমাণ আবেদন নেই।"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
