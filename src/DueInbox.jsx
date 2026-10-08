import React, { useState, useEffect } from 'react';
import { Search, Calendar, AlertCircle, ArrowRight } from 'lucide-react';
import './due-inbox.css';

function DueInbox() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dummy data matching the scenario
  const [students, setStudents] = useState([
    { id: 'STU-66115', name: 'Maruf Hossain', phone: '01723619524', batch: 'Sat-6:45am', feeType: 'Monthly', feeAmount: 500, paidAmount: 500, admissionDate: '2026-10-01' },
    { id: 'STU-45213', name: 'Rakib Hasan', phone: '01534343434', batch: 'Sat-6:45am', feeType: 'Course', totalCourseFee: 4000, paidAmount: 2000, admissionDate: '2026-10-05' },
    { id: 'STU-10293', name: 'Ayesha Siddiqua', phone: '01912345678', batch: 'Sun-8am', feeType: 'Monthly', feeAmount: 500, paidAmount: 0, admissionDate: '2026-09-15' },
    { id: 'STU-33012', name: 'Karim Ahmed', phone: '01811223344', batch: 'Sun-8am', feeType: 'Course', totalCourseFee: 6000, paidAmount: 0, admissionDate: '2026-09-01' }
  ]);

  const calculateDueStatus = (student) => {
    const today = new Date('2026-10-08'); // Mocking today's date for consistent testing
    const admissionDate = new Date(student.admissionDate);
    
    let isDue = false;
    let dueAmount = 0;
    let dueDateStr = '';

    if (student.feeType === 'Monthly') {
      // Monthly: Allowed up to 10 days after admission day every month.
      // Example: admission 15th, due date is 25th of the current month.
      // For simplicity, we just check if they have paid this month. If paidAmount < feeAmount in dummy, they are due.
      dueAmount = student.feeAmount - student.paidAmount;
      
      const dueDay = admissionDate.getDate() + 10;
      let targetDate = new Date(today.getFullYear(), today.getMonth(), dueDay);
      
      if (dueAmount > 0) {
        isDue = true;
      }
      
      dueDateStr = `${targetDate.getDate()} ${targetDate.toLocaleString('default', { month: 'short' })}, ${targetDate.getFullYear()}`;

    } else if (student.feeType === 'Course') {
      // Course: Next installment is 1 month after admission
      // For dummy, if paidAmount < totalCourseFee and today is past next installment date
      const nextInstallmentDate = new Date(admissionDate);
      nextInstallmentDate.setMonth(nextInstallmentDate.getMonth() + 1);
      
      const remainingDue = student.totalCourseFee - student.paidAmount;
      
      if (remainingDue > 0 && today > nextInstallmentDate) {
        isDue = true;
        dueAmount = remainingDue;
      } else if (remainingDue > 0 && student.paidAmount === 0) {
          // just to show some due for the demo
          isDue = true;
          dueAmount = remainingDue;
      }
      
      dueDateStr = `${nextInstallmentDate.getDate()} ${nextInstallmentDate.toLocaleString('default', { month: 'short' })}, ${nextInstallmentDate.getFullYear()}`;
    }

    return { isDue, dueAmount, dueDateStr };
  };

  const dueStudents = students.map(s => {
    const status = calculateDueStatus(s);
    return { ...s, ...status };
  }).filter(s => s.isDue && (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.includes(searchTerm)));

  const totalOutstanding = dueStudents.reduce((sum, s) => sum + s.dueAmount, 0);

  return (
    <div className="due-inbox-container">
      <div className="page-header">
        <div>
          <div className="fee-followup-tag">
            <AlertCircle size={14} /> FEE FOLLOW-UP
          </div>
          <h1>Due inbox</h1>
          <p className="subtitle">Collect outstanding fees — month view or cumulative arrears</p>
        </div>
        <button className="btn-primary">Collect fee</button>
      </div>

      <div className="filter-card">
        <div className="filter-group">
          <label>Balance view</label>
          <select className="form-control">
            <option>This month</option>
            <option>All time</option>
          </select>
        </div>
        <div className="filter-group flex-2">
          <label>Find a student</label>
          <div className="search-input-wrapper">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search name / ID / phone" 
              className="form-control with-icon"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="filter-group">
          <label>Due month</label>
          <div className="date-input-wrapper">
            <input type="text" className="form-control" value="October 2026" readOnly />
            <Calendar className="calendar-icon" size={16} />
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card outstanding">
          <div>
            <div className="summary-label">Outstanding this month</div>
            <div className="summary-value">৳ {totalOutstanding.toLocaleString()}</div>
            <div className="summary-date">October 2026</div>
          </div>
          <AlertCircle size={48} className="bg-icon" />
        </div>
        <div className="summary-card count">
          <div>
            <div className="summary-label">Students shown</div>
            <div className="summary-value">{dueStudents.length}</div>
            <div className="summary-date">In the current balance view</div>
          </div>
        </div>
      </div>

      <div className="balances-section">
        <div className="balances-header">
          <div>
            <h2>Outstanding balances</h2>
            <p>Open a student profile, send a reminder, or collect a fee.</p>
          </div>
          <button className="btn-secondary">Refresh</button>
        </div>

        {dueStudents.length > 0 ? (
          <div className="due-list">
            {dueStudents.map(student => (
              <div key={student.id} className="due-item">
                <div className="due-student-info">
                  <div className="avatar">{student.name.substring(0, 2).toUpperCase()}</div>
                  <div>
                    <div className="student-name">{student.name}</div>
                    <div className="student-meta">{student.id} • {student.feeType} • {student.phone}</div>
                  </div>
                </div>
                <div className="due-details">
                  <div className="due-amount">৳ {student.dueAmount.toLocaleString()}</div>
                  <div className="due-date">Due by: {student.dueDateStr}</div>
                </div>
                <div className="due-actions">
                  <button className="btn-collect">Collect</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-box">
            <div className="empty-icon-circle">
              <span className="zero-icon">∅</span>
            </div>
            <p>No dues for this month — all clear</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DueInbox;
