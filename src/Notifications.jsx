import React from 'react';
import { Bell, AlertCircle, ArrowRight } from 'lucide-react';
import './notifications.css';

function Notifications({ setActiveTab }) {
  // Mock notifications based on Due Inbox
  const dueNotifications = [
    {
      id: 1,
      studentName: 'Karim Islam',
      batch: 'Sat-6:45am',
      amount: '500',
      date: '2 hours ago',
      type: 'monthly'
    },
    {
      id: 2,
      studentName: 'Jamal Uddin',
      batch: 'Sun-8:00am',
      amount: '1500',
      date: '5 hours ago',
      type: 'course'
    },
    {
      id: 3,
      studentName: 'Ayesha Siddiqua',
      batch: 'Mon-4:00pm',
      amount: '500',
      date: '1 day ago',
      type: 'monthly'
    }
  ];

  return (
    <div className="notifications-container">
      <div className="page-header">
        <div>
          <div className="fee-followup-tag">
            <Bell size={14} /> UPDATES & ALERTS
          </div>
          <h1>Notifications</h1>
          <p className="subtitle">Stay updated on due payments and important activities.</p>
        </div>
      </div>

      <div className="notifications-list">
        {dueNotifications.map((notif) => (
          <div key={notif.id} className="notification-card">
            <div className="notif-icon">
              <AlertCircle size={24} color="#ef4444" />
            </div>
            <div className="notif-content">
              <h4>Payment Due Alert</h4>
              <p>
                <strong>{notif.studentName}</strong> ({notif.batch}) has an outstanding due of <strong>৳ {notif.amount}</strong> for their {notif.type} fee.
              </p>
              <span className="notif-time">{notif.date}</span>
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

        {dueNotifications.length === 0 && (
          <div className="empty-state-box">
            <Bell size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <p>You're all caught up! No new notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
