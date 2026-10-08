import React, { useState, useEffect } from 'react';
import { Search, Calendar, AlertCircle, ArrowRight, MessageSquare, Wallet, CheckCircle2, X, Copy } from 'lucide-react';
import { dataStore } from './dataStore';
import './due-inbox.css';

function DueInbox() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('All');
  const [students, setStudents] = useState(() => dataStore.getStudents());
  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [settings, setSettings] = useState(() => dataStore.getSettings());

  const [collectingStudent, setCollectingStudent] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('bKash');

  const [smsModalStudent, setSmsModalStudent] = useState(null);
  const [smsCopied, setSmsCopied] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      setStudents(dataStore.getStudents());
      setBatches(dataStore.getBatches());
      setSettings(dataStore.getSettings());
    };
    window.addEventListener('coaching-data-change', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('coaching-data-change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Compute dues dynamically for all active students
  const dueStudents = students
    .filter(s => s.status === 'Active')
    .map(student => {
      const { dueAmount, isDue } = dataStore.calculateDue(student);
      const dueDateStr = student.feeType === 'course' 
        ? (student.nextInstallmentDate || '01/11/2026') 
        : '10th of this month';
      return {
        ...student,
        dueAmount,
        isDue,
        dueDateStr
      };
    })
    .filter(s => s.isDue)
    .filter(s => {
      const matchesBatch = selectedBatchFilter === 'All' || s.batch === selectedBatchFilter;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q || 
        s.name.toLowerCase().includes(q) || 
        s.id.toLowerCase().includes(q) || 
        (s.phone && s.phone.includes(q));
      return matchesBatch && matchesSearch;
    });

  const totalOutstanding = dueStudents.reduce((sum, s) => sum + s.dueAmount, 0);

  const handleOpenCollect = (student) => {
    setCollectingStudent(student);
    setPayAmount(student.dueAmount.toString());
  };

  const handleConfirmCollect = () => {
    if (!collectingStudent || !payAmount) return;
    dataStore.recordPayment({
      studentId: collectingStudent.id,
      amount: Number(payAmount),
      method: payMethod,
      collectedBy: 'Admin',
      note: `${collectingStudent.feeType === 'monthly' ? 'Monthly Fee' : 'Course Fee'}`
    });
    setCollectingStudent(null);
    setPayAmount('');
  };

  const getSmsTemplate = (student) => {
    return `সম্মানিত অভিভাবক, ${settings.coachingName}-এ আপনার সন্তান ${student.name}-এর (${student.batch}) চলতি বকেয়া ফি ৳ ${student.dueAmount} টাকা। অনুগ্রহ করে দ্রুত পরিশোধ করুন। ধন্যবাদ।`;
  };

  const handleCopySms = (text) => {
    navigator.clipboard.writeText(text);
    setSmsCopied(true);
    setTimeout(() => setSmsCopied(false), 2000);
  };

  return (
    <div className="due-inbox-container">
      <div className="page-header">
        <div>
          <div className="fee-followup-tag">
            <AlertCircle size={14} /> FEE FOLLOW-UP
          </div>
          <h1>Due inbox</h1>
          <p className="subtitle">Collect outstanding fees and send reminders to guardians.</p>
        </div>
      </div>

      <div className="filter-card">
        <div className="filter-group">
          <label>Batch filter</label>
          <select 
            className="form-control"
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
          >
            <option value="All">All batches</option>
            {batches.map(b => (
              <option key={b.id || b.name} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group flex-2">
          <label>Find a student</label>
          <div className="search-input-wrapper">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search by name / ID / phone..." 
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
            <div className="summary-label">Due students</div>
            <div className="summary-value">{dueStudents.length}</div>
            <div className="summary-date">Need collection or reminder</div>
          </div>
        </div>
      </div>

      <div className="balances-section">
        <div className="balances-header">
          <div>
            <h2>Outstanding balances</h2>
            <p>Select a student to collect fee or send SMS reminder to guardian.</p>
          </div>
        </div>

        {dueStudents.length > 0 ? (
          <div className="due-list">
            {dueStudents.map(student => (
              <div key={student.id} className="due-item">
                <div className="due-student-info">
                  <div className="avatar">{student.initials || student.name.substring(0, 2).toUpperCase()}</div>
                  <div>
                    <div className="student-name">{student.name}</div>
                    <div className="student-meta">{student.id} • {student.batch} • {student.phone || 'No phone'}</div>
                  </div>
                </div>
                <div className="due-details">
                  <div className="due-amount text-danger">৳ {student.dueAmount.toLocaleString()}</div>
                  <div className="due-date">Due: {student.dueDateStr}</div>
                </div>
                <div className="due-actions" style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                    onClick={() => setSmsModalStudent(student)}
                    title="Send SMS Reminder"
                  >
                    <MessageSquare size={14} /> SMS
                  </button>
                  <button className="btn-collect" onClick={() => handleOpenCollect(student)}>
                    Collect
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-box">
            <div className="empty-icon-circle">
              <span className="zero-icon">✓</span>
            </div>
            <p>All fees are clear! No outstanding dues right now.</p>
          </div>
        )}
      </div>

      {/* Collect Fee Modal */}
      {collectingStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2>Collect Fee: {collectingStudent.name}</h2>
                <p>{collectingStudent.batch} • Total Due: ৳ {collectingStudent.dueAmount}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setCollectingStudent(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>AMOUNT (৳)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={payAmount} 
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="500" 
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>PAYMENT METHOD</label>
                <select className="form-control" value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                  <option value="Cash">Cash (নগদ)</option>
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setCollectingStudent(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleConfirmCollect}>Confirm Collection</button>
            </div>
          </div>
        </div>
      )}

      {/* SMS Reminder Modal */}
      {smsModalStudent && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div>
                <h2>SMS Reminder Preview</h2>
                <p>Send to guardian: {smsModalStudent.guardianPhone || smsModalStudent.phone || 'N/A'}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setSmsModalStudent(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '8px', fontSize: '0.9rem', lineHeight: '1.5', color: '#1e293b' }}>
                {getSmsTemplate(smsModalStudent)}
              </div>
              {smsCopied && (
                <div style={{ color: '#16a34a', fontSize: '0.85rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} /> SMS text copied to clipboard!
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSmsModalStudent(null)}>Close</button>
              <button 
                className="btn-primary" 
                onClick={() => handleCopySms(getSmsTemplate(smsModalStudent))}
              >
                <Copy size={16} /> Copy SMS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DueInbox;
