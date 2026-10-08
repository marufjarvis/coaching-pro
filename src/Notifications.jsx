import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, UserCheck, ArrowRight } from 'lucide-react';
import { dataStore } from './dataStore';
import './notifications.css';

function Notifications({ setActiveTab }) {
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
            <Bell size={14} /> UPDATES & ALERTS
          </div>
          <h1>Notifications</h1>
          <p className="subtitle">Stay updated on due payments and pending online admissions.</p>
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
              <h4>New Online Admission Application</h4>
              <p>
                <strong>{admission.name}</strong> ({admission.phone}) submitted an admission form for batch <strong>{admission.preferredBatch}</strong>.
              </p>
              <span className="notif-time">{admission.date || 'Recent application'}</span>
            </div>
            <div className="notif-action">
              <button 
                className="btn-secondary" 
                onClick={() => setActiveTab('online-admission')}
              >
                Review Application <ArrowRight size={16} style={{ marginLeft: '4px' }} />
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
              <h4>Payment Due Alert</h4>
              <p>
                <strong>{notif.name}</strong> ({notif.batch}) has an outstanding due of <strong>৳ {notif.dueAmount.toLocaleString()}</strong> for their {notif.feeType} fee.
              </p>
              <span className="notif-time">Due for collection</span>
            </div>
            <div className="notif-action">
              <button 
                className="btn-secondary" 
                onClick={() => setActiveTab('due-inbox')}
              >
                View in Due Inbox <ArrowRight size={16} style={{ marginLeft: '4px' }} />
              </button>
            </div>
          </div>
        ))}

        {dueStudents.length === 0 && pendingAdmissions.length === 0 && (
          <div className="empty-state-box">
            <Bell size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <p>You're all caught up! No active alerts or pending items.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
