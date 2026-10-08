import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wallet, DollarSign, Calendar, FileText, Copy, Award, AlertCircle, Edit, Trash2, Printer, CheckCircle2, X } from 'lucide-react';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './student-profile.css';

function StudentProfile({ student, onBack, onEdit, lang: propLang }) {
  const { t } = useTranslation(propLang);
  const [payments, setPayments] = useState(() => {
    return dataStore.getPayments().filter(p => p.studentId === student.id);
  });
  const [attendanceStats, setAttendanceStats] = useState(() => {
    return dataStore.getStudentAttendanceStats(student.id);
  });
  const [exams, setExams] = useState(() => dataStore.getExams());
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('bKash');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const handleSync = () => {
      setPayments(dataStore.getPayments().filter(p => p.studentId === student.id));
      setAttendanceStats(dataStore.getStudentAttendanceStats(student.id));
      setExams(dataStore.getExams());
    };
    window.addEventListener('coaching-data-change', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('coaching-data-change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [student.id]);

  if (!student) return null;

  const handleCopy = (text, label) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopySuccess(`${label} copied!`);
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handleRecordPayment = () => {
    const num = Number(payAmount);
    if (!num || num <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    dataStore.recordPayment({
      studentId: student.id,
      amount: num,
      method: payMethod,
      collectedBy: 'Admin',
      note: `${student.feeType === 'monthly' ? (t.monthlyFee) : (t.courseFee)}`
    });

    setIsCollectModalOpen(false);
    setPayAmount('');
  };

  const handleDelete = () => {
    const confirmMsg = t.deleteStudentConfirm.replace('{name}', student.name);
    if (window.confirm(confirmMsg)) {
      dataStore.deleteStudent(student.id);
      onBack();
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  // Student calculations
  const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalFee = Number(student.feeAmount) || 0;
  const totalDue = Math.max(0, totalFee - totalPaid);

  // Filter exams that include this student
  const studentExams = exams.filter(e => e.marks && e.marks[student.id] !== undefined);
  const avgScore = studentExams.length > 0
    ? Math.round(studentExams.reduce((sum, e) => sum + Number(e.marks[student.id]), 0) / studentExams.length)
    : 0;

  return (
    <div className="student-profile-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={16} /> {t.backToStudents}
        </button>
        {copySuccess && (
          <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem' }}>
            {copySuccess}
          </span>
        )}
      </div>

      {/* Header Card */}
      <div className="profile-header-card">
        <div className="profile-header-left">
          <div className="profile-avatar-large">{student.initials || 'ST'}</div>
          <div className="profile-info-top">
            <div className="profile-name-row">
              <h1>{student.name}</h1>
              <span className={`status-badge ${student.status.toLowerCase()}`}>
                <span className="status-dot"></span>
                {student.status === 'Active' ? t.active : student.status === 'Inactive' ? t.inactive : student.status}
              </span>
            </div>
            <div className="profile-badges">
              <span className="badge-gray">{student.id}</span>
              <span className="badge-gray">{student.batch}</span>
            </div>
          </div>
        </div>
        <div className="profile-header-right">
          <button className="btn-primary" onClick={() => {
            setPayAmount(totalDue > 0 ? totalDue.toString() : '');
            setIsCollectModalOpen(true);
          }}>
            <Wallet size={16} /> {t.collectFees}
          </button>
          <button className="btn-secondary" onClick={onEdit}>
            <Edit size={16} /> {t.edit}
          </button>
          <button className="btn-secondary text-danger" onClick={handleDelete} title={t.delete}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="profile-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">{student.feeType === 'course' ? t.courseFee : t.monthlyFee}</span>
            <div className="kpi-icon blue"><Wallet size={18} /></div>
          </div>
          <div className="kpi-value">৳ {totalFee.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">{t.totalPaidLabel}</span>
            <div className="kpi-icon cyan"><DollarSign size={18} /></div>
          </div>
          <div className="kpi-value">৳ {totalPaid.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">{t.totalDueLabel}</span>
            <div className="kpi-icon yellow"><AlertCircle size={18} /></div>
          </div>
          <div className={`kpi-value ${totalDue > 0 ? 'text-danger' : ''}`}>৳ {totalDue.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">{t.attendance}</span>
            <div className="kpi-icon green"><Calendar size={18} /></div>
          </div>
          <div className="kpi-value">{attendanceStats.percentage}%</div>
          <div className="kpi-subtext">P {attendanceStats.present} · A {attendanceStats.absent} · L {attendanceStats.late}</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="profile-main-grid">
        {/* Left Column: Profile Info */}
        <div className="main-col-left">
          <div className="profile-section-card">
            <div className="section-header-flex">
              <h2 className="section-title">{t.studentDirectoryTitle}</h2>
            </div>
            
            <div className="info-list">
              <div className="info-row">
                <div className="info-label">{t.studentNameLabel}</div>
                <div className="info-value">{student.name}</div>
              </div>
              <div className="info-row">
                <div className="info-label">{t.studentIdLabel}</div>
                <div className="info-value">{student.id}</div>
              </div>
              <div className="info-row">
                <div className="info-label">{t.batchSelectLabel}</div>
                <div className="info-value">{student.batch}</div>
              </div>
              <div className="info-row">
                <div className="info-label">{t.phoneMobileLabel}</div>
                <div className="info-value flex-align">
                  {student.phone || '—'} 
                  {student.phone && (
                    <button className="btn-small" onClick={() => handleCopy(student.phone, 'Phone')} title="Copy phone">
                      <Copy size={14} />
                    </button>
                  )}
                </div>
              </div>
              <div className="info-row">
                <div className="info-label">{t.guardianPhoneLabel}</div>
                <div className="info-value flex-align">
                  {student.guardianPhone || '—'}
                  {student.guardianPhone && (
                    <button className="btn-small" onClick={() => handleCopy(student.guardianPhone, 'Guardian Phone')} title="Copy guardian phone">
                      <Copy size={14} />
                    </button>
                  )}
                </div>
              </div>
              <div className="info-row">
                <div className="info-label">{t.applicationDateLabel}</div>
                <div className="info-value">{student.admissionDate || 'N/A'}</div>
              </div>
              <div className="info-row">
                <div className="info-label">{t.billingFeeTypeLabel}</div>
                <div className="info-value" style={{ textTransform: 'capitalize' }}>
                  {student.feeType === 'monthly' ? t.badgeMonthly : t.badgeCourse}
                </div>
              </div>
            </div>

            <div className="profile-actions-grid" style={{ marginTop: '1.5rem' }}>
              <button className="btn-secondary outline full-width" onClick={handlePrintReport}>
                <Printer size={16} /> {t.printReportBtn}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Performance & Payment History */}
        <div className="main-col-right">
          <div className="profile-section-card min-h">
            <div className="section-header-flex">
              <h2 className="section-title flex-align"><Award size={18} /> {t.examResultsTitle}</h2>
            </div>
            
            <div className="performance-kpi-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="kpi-card" style={{ background: '#f5f3ff', border: '1px solid #ede9fe' }}>
                <div className="kpi-header">
                  <span className="kpi-title" style={{ color: '#6d28d9' }}>{t.avgExamScoreLabel}</span>
                </div>
                <div className="kpi-value" style={{ color: '#6d28d9' }}>{avgScore > 0 ? `${avgScore} / 50` : '—'}</div>
              </div>
              <div className="kpi-card" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                <div className="kpi-header">
                  <span className="kpi-title" style={{ color: '#92400e' }}>{t.totalExamsStat}</span>
                </div>
                <div className="kpi-value" style={{ color: '#b45309' }}>{studentExams.length}</div>
              </div>
            </div>

            {studentExams.length > 0 ? (
              <table className="data-table" style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
                <thead>
                  <tr>
                    <th>{t.thDate}</th>
                    <th>{t.examsTitle}</th>
                    <th>{t.marksColumn}</th>
                    <th>{t.statusColumn}</th>
                  </tr>
                </thead>
                <tbody>
                  {studentExams.map(ex => {
                    const score = Number(ex.marks[student.id]);
                    const isPassed = score >= Number(ex.passMarks || 40);
                    return (
                      <tr key={ex.id}>
                        <td>{ex.date}</td>
                        <td><strong>{ex.name}</strong><br/><span className="text-muted">{ex.subject}</span></td>
                        <td>{score} / {ex.totalMarks}</td>
                        <td>
                          <span className={`status-badge ${isPassed ? 'badge-present' : 'status-danger'}`}>
                            {isPassed ? t.passed : t.failed}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-muted" style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>{t.notGraded}</p>
            )}
          </div>

          <div className="profile-section-card min-h">
            <div className="section-header-flex">
              <h2 className="section-title flex-align"><Wallet size={18} /> {t.paymentHistoryTitle}</h2>
            </div>
            {payments.length > 0 ? (
              <table className="data-table" style={{ fontSize: '0.875rem' }}>
                <thead>
                  <tr>
                    <th>{t.thReceipt}</th>
                    <th>{t.thDate}</th>
                    <th>{t.thMethod}</th>
                    <th>{t.thFeeType}</th>
                    <th style={{ textAlign: 'right' }}>{t.thAmount}</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.id}</strong></td>
                      <td>{p.date}</td>
                      <td><span className="status-badge active">{p.method}</span></td>
                      <td>{p.note || (t.monthlyFee)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: '#16a34a' }}>৳ {Number(p.amount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state-full">
                <h3>{t.noPaymentsFound}</h3>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {isCollectModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2>{t.collectFeeModalTitle}: {student.name}</h2>
                <p>{student.batch} • {t.totalDueLabel}: ৳ {totalDue.toLocaleString()}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsCollectModalOpen(false)}>
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
                  placeholder="e.g. 500" 
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>{t.thMethod}</label>
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
              <button className="btn-cancel" onClick={() => setIsCollectModalOpen(false)}>{t.cancel}</button>
              <button className="btn-save" onClick={handleRecordPayment}>{t.confirm}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentProfile;
