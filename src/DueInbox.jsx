import React, { useState, useEffect } from 'react';
import { Search, Calendar, AlertCircle, ArrowRight, Wallet, CheckCircle2, X } from 'lucide-react';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './due-inbox.css';

function DueInbox({ lang: propLang }) {
  const { t, lang } = useTranslation(propLang);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('All');
  const [students, setStudents] = useState(() => dataStore.getStudents());
  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [settings, setSettings] = useState(() => dataStore.getSettings());

  const [collectingStudent, setCollectingStudent] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('bKash');

  const currentMonthDate = new Date();
  const monthName = currentMonthDate.toLocaleString(lang === 'EN' ? 'en-US' : 'bn-BD', { month: 'long', year: 'numeric' });

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

  // Compute dues dynamically for ALL students (status Active or Inactive) with dues
  // attendanceSuspended students are Active but temporarily off roll-call; they must show here!
  const dueStudents = students
    .filter(s => s.status === 'Active' || s.status === 'Inactive')
    .map(student => {
      const { dueAmount, isDue } = dataStore.calculateDue(student);
      const dueDateStr = student.feeType === 'course' 
        ? (student.nextInstallmentDate || (lang === 'EN' ? 'Check Details' : 'বিস্তারিত দেখুন')) 
        : (lang === 'EN' ? '10th of this month' : 'চলতি মাসের ১০ তারিখ');
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
      note: `${collectingStudent.feeType === 'monthly' ? t.monthlyFee : t.courseFee}`
    });
    setCollectingStudent(null);
    setPayAmount('');
  };

  return (
    <div className="due-inbox-container">
      <div className="page-header">
        <div>
          <div className="fee-followup-tag">
            <AlertCircle size={14} /> {t.feeFollowupTag}
          </div>
          <h1>{t.dueInboxTitle}</h1>
          <p className="subtitle">{t.dueInboxSubtitle}</p>
        </div>
      </div>

      <div className="filter-card">
        <div className="filter-group">
          <label>{t.batchFilterLabel}</label>
          <select 
            className="form-control"
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
          >
            <option value="All">{t.allBatchesFilter}</option>
            {batches.map(b => (
              <option key={b.id || b.name} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group flex-2">
          <label>{t.findStudentLabel}</label>
          <div className="search-input-wrapper">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder={t.searchDuePlaceholder} 
              className="form-control with-icon"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="filter-group">
          <label>{t.dueMonthLabel}</label>
          <div className="date-input-wrapper">
            <input type="text" className="form-control" value={monthName} readOnly />
            <Calendar className="calendar-icon" size={16} />
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card outstanding">
          <div>
            <div className="summary-label">{t.outstandingThisMonth}</div>
            <div className="summary-value">৳ {totalOutstanding.toLocaleString()}</div>
            <div className="summary-date">{monthName}</div>
          </div>
          <AlertCircle size={48} className="bg-icon" />
        </div>
        <div className="summary-card count">
          <div>
            <div className="summary-label">{t.dueStudentsCountTitle}</div>
            <div className="summary-value">{dueStudents.length}</div>
            <div className="summary-date">{t.needCollectionOrReminder}</div>
          </div>
        </div>
      </div>

      <div className="balances-section">
        <div className="balances-header">
          <div>
            <h2>{t.outstandingBalancesTitle}</h2>
            <p>{t.outstandingBalancesSubtitle}</p>
          </div>
        </div>

        {dueStudents.length > 0 ? (
          <div className="due-list">
            {dueStudents.map(student => (
              <div key={student.id} className="due-item">
                <div className="due-student-info">
                  <div className="avatar">{student.initials || student.name.substring(0, 2).toUpperCase()}</div>
                  <div>
                    <div className="student-name" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {student.name}
                      {student.attendanceSuspended && (
                        <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                          {lang === 'EN' ? 'Attendance Suspended (Fee Due)' : 'হাজিরা সাময়িক বন্ধ (বকেয়া ফি)'}
                        </span>
                      )}
                      {student.status === 'Inactive' && (
                        <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                          {lang === 'EN' ? 'Inactive' : 'নিষ্ক্রিয়'}
                        </span>
                      )}
                    </div>
                    <div className="student-meta">{student.id} • {student.batch} • {student.phone || t.noPhone}</div>
                  </div>
                </div>
                <div className="due-details">
                  <div className="due-amount text-danger">৳ {student.dueAmount.toLocaleString()}</div>
                  <div className="due-date">{t.dueLabel}: {student.dueDateStr}</div>
                </div>
                <div className="due-actions">
                  <button className="btn-collect" onClick={() => handleOpenCollect(student)}>
                    {t.btnCollect}
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
            <p>{t.allDuesClearDesc}</p>
          </div>
        )}
      </div>

      {/* Collect Fee Modal */}
      {collectingStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2>{t.collectFeeDueTitle}: {collectingStudent.name}</h2>
                <p>{collectingStudent.batch} • {t.totalDueLabel}: ৳ {collectingStudent.dueAmount.toLocaleString()}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setCollectingStudent(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{t.amountToCollect} (৳)</label>
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
                <label>{t.paymentMethodPrompt}</label>
                <select className="form-control" value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                  <option value="Cash">Cash</option>
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setCollectingStudent(null)}>{t.cancel}</button>
              <button className="btn-primary" onClick={handleConfirmCollect}>{t.confirmCollectionBtn}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DueInbox;
