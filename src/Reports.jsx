import React, { useState, useEffect } from 'react';
import { BarChart2, Receipt, Ban, Wallet, ClipboardCheck, Users, FileQuestion, ChevronRight, X, Printer } from 'lucide-react';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './reports.css';

function Reports({ lang: propLang }) {
  const { t } = useTranslation(propLang);
  const [activeReport, setActiveReport] = useState(null);
  const [payments, setPayments] = useState(() => dataStore.getPayments());
  const [students, setStudents] = useState(() => dataStore.getStudents());
  const [expenses, setExpenses] = useState(() => dataStore.getExpenses());
  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [exams, setExams] = useState(() => dataStore.getExams());

  const [selectedBatch, setSelectedBatch] = useState(batches.length > 0 ? batches[0].name : '');
  const [selectedExamId, setSelectedExamId] = useState(exams.length > 0 ? exams[0].id : '');

  useEffect(() => {
    const handleSync = () => {
      setPayments(dataStore.getPayments());
      setStudents(dataStore.getStudents());
      setExpenses(dataStore.getExpenses());
      setBatches(dataStore.getBatches());
      setExams(dataStore.getExams());
    };
    window.addEventListener('coaching-data-change', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('coaching-data-change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const totalCollected = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalExpenseAmount = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const netProfit = totalCollected - totalExpenseAmount;

  const dueStudents = students
    .map(s => ({ ...s, ...dataStore.calculateDue(s) }))
    .filter(s => s.isDue);
  const totalDues = dueStudents.reduce((sum, s) => sum + s.dueAmount, 0);

  const handlePrint = () => {
    window.print();
  };

  const renderReportModalContent = () => {
    switch (activeReport) {
      case 'Collection':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{t.totalTransactions}</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{payments.length}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{t.totalCollections}</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>৳ {totalCollected.toLocaleString()}</div>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.thDate}</th>
                  <th>{t.thReceipt}</th>
                  <th>{t.thStudent}</th>
                  <th>{t.thBatch}</th>
                  <th>{t.thMethod}</th>
                  <th style={{ textAlign: 'right' }}>{t.thAmount}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td>{p.date}</td>
                    <td><strong>{p.id}</strong></td>
                    <td>{p.studentName}</td>
                    <td>{p.batch || '—'}</td>
                    <td>{p.method}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>৳ {Number(p.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Due':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: '#fef2f2', padding: '12px 16px', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#991b1b' }}>{t.dueStudentsCountTitle}</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#991b1b' }}>{dueStudents.length}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: '#991b1b' }}>{t.outstandingDues}</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626' }}>৳ {totalDues.toLocaleString()}</div>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.thStudentId}</th>
                  <th>{t.thStudentName}</th>
                  <th>{t.thBatch}</th>
                  <th>{t.thPhone}</th>
                  <th>{t.thFeeType}</th>
                  <th style={{ textAlign: 'right' }}>{t.dueLabel}</th>
                </tr>
              </thead>
              <tbody>
                {dueStudents.length > 0 ? (
                  dueStudents.map(s => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.batch}</td>
                      <td>{s.phone || '—'}</td>
                      <td>{s.feeType === 'monthly' ? t.badgeMonthly : t.badgeCourse}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>৳ {s.dueAmount.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>{t.allDuesClearDesc}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case 'Expense':
        return (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#166534' }}>{t.monthlyRevenue}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16a34a' }}>৳ {totalCollected.toLocaleString()}</div>
              </div>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#991b1b' }}>{t.monthlyExpenses}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ef4444' }}>৳ {totalExpenseAmount.toLocaleString()}</div>
              </div>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#1e40af' }}>{t.netProfit}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: netProfit >= 0 ? '#2563eb' : '#dc2626' }}>
                  ৳ {netProfit.toLocaleString()}
                </div>
              </div>
            </div>
            <h4 style={{ margin: '0 0 10px 0' }}>{t.expenseLedgerSectionTitle}</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.thDate}</th>
                  <th>{t.expenseDescriptionLabel}</th>
                  <th>{t.expenseCategoryInputLabel}</th>
                  <th style={{ textAlign: 'right' }}>{t.thAmount}</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(e => (
                  <tr key={e.id}>
                    <td>{e.date}</td>
                    <td><strong>{e.title}</strong></td>
                    <td><span className="badge-gray">{e.category}</span></td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#dc2626' }}>৳ {Number(e.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Attendance':
        const currentBatchStudents = students.filter(s => s.batch === selectedBatch);
        return (
          <div>
            <div className="form-group" style={{ maxWidth: '250px', marginBottom: '1rem' }}>
              <label>{t.batchSelectLabel}</label>
              <select className="form-control" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
                {batches.map(b => <option key={b.id || b.name} value={b.name}>{b.name}</option>)}
              </select>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.thId}</th>
                  <th>{t.thStudentName}</th>
                  <th>{t.present}</th>
                  <th>{t.absent}</th>
                  <th>{t.attendance} %</th>
                </tr>
              </thead>
              <tbody>
                {currentBatchStudents.length > 0 ? (
                  currentBatchStudents.map(student => {
                    const stats = dataStore.getStudentAttendanceStats(student.id);
                    return (
                      <tr key={student.id}>
                        <td>{student.id}</td>
                        <td><strong>{student.name}</strong></td>
                        <td style={{ color: '#16a34a', fontWeight: 600 }}>{stats.present}</td>
                        <td style={{ color: '#dc2626', fontWeight: 600 }}>{stats.absent}</td>
                        <td>
                          <span className="badge-gray" style={{ fontWeight: 700 }}>
                            {stats.percentage}%
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>{t.noStudentsInBatchMsg}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case 'StudentList':
        return (
          <div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.thId}</th>
                  <th>{t.thStudentName}</th>
                  <th>{t.thBatch}</th>
                  <th>{t.thPhone}</th>
                  <th>{t.guardianPhoneLabel}</th>
                  <th>{t.thFeeType}</th>
                  <th>{t.thStatus}</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.id}</strong></td>
                    <td>{s.name}</td>
                    <td>{s.batch}</td>
                    <td>{s.phone || '—'}</td>
                    <td>{s.guardianPhone || '—'}</td>
                    <td>৳ {s.feeAmount}</td>
                    <td>
                      <span className={`status-badge ${(s.status || 'Active').toLowerCase()}`}>
                        {s.status === 'Active' ? t.active : s.status === 'Inactive' ? t.inactive : s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Exam':
        const selectedExam = exams.find(e => e.id === selectedExamId) || exams[0];
        return (
          <div>
            <div className="form-group" style={{ maxWidth: '300px', marginBottom: '1rem' }}>
              <label>{t.examsTitle}</label>
              <select className="form-control" value={selectedExamId} onChange={(e) => setSelectedExamId(e.target.value)}>
                {exams.map(e => <option key={e.id} value={e.id}>{e.name} ({e.subject})</option>)}
              </select>
            </div>
            {selectedExam && (
              <>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px' }}>
                  <div><strong>{t.thBatch}:</strong> {selectedExam.batch}</div>
                  <div><strong>{t.thSubject}:</strong> {selectedExam.subject}</div>
                  <div><strong>{t.totalMarksInputLabel}:</strong> {selectedExam.totalMarks}</div>
                  <div><strong>{t.passMarksInputLabel}:</strong> {selectedExam.passMarks}</div>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.thId}</th>
                      <th>{t.thStudentName}</th>
                      <th>{t.marksColumn}</th>
                      <th>{t.statusColumn}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => {
                      const marks = selectedExam.marks ? selectedExam.marks[student.id] : undefined;
                      const isPassed = marks !== undefined && Number(marks) >= Number(selectedExam.passMarks);
                      return (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td><strong>{student.name}</strong></td>
                          <td>{marks !== undefined ? marks : '—'}</td>
                          <td>
                            {marks === undefined ? (
                              <span className="text-muted">{t.notGraded}</span>
                            ) : isPassed ? (
                              <span className="status-badge badge-present">{t.passed}</span>
                            ) : (
                              <span className="status-badge badge-absent">{t.failed}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="reports-container">
      <div className="page-header">
        <div>
          <div className="fee-followup-tag">
            <BarChart2 size={14} /> {t.reportsTag}
          </div>
          <h1>{t.reportsTitle}</h1>
          <p className="subtitle">{t.reportsSubtitle}</p>
        </div>
      </div>

      <div className="reports-section">
        <h3 className="reports-section-title">{t.financialPerformanceHeading}</h3>
        <p className="reports-section-subtitle">{t.financialPerformanceSubheading}</p>
        
        <div className="reports-grid">
          {/* Collection Report */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#3b82f6', backgroundColor: '#eff6ff' }}>
              <Receipt size={24} />
            </div>
            <h3>{t.collectionReportCardTitle}</h3>
            <p>{t.collectionReportCardDesc} (৳ {totalCollected.toLocaleString()})</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Collection')}>
              {t.openReportBtn} <ChevronRight size={16} />
            </button>
            <div className="report-watermark">
              <Receipt size={120} strokeWidth={1} />
            </div>
          </div>

          {/* Due Report */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#ef4444', backgroundColor: '#fef2f2' }}>
              <Ban size={24} />
            </div>
            <h3>{t.dueReportCardTitle}</h3>
            <p>{t.dueReportCardDesc} (৳ {totalDues.toLocaleString()})</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Due')}>
              {t.openReportBtn} <ChevronRight size={16} />
            </button>
            <div className="report-watermark">
              <Ban size={120} strokeWidth={1} />
            </div>
          </div>

          {/* Expense & Profit */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#0f766e', backgroundColor: '#f0fdfa' }}>
              <Wallet size={24} />
            </div>
            <h3>{t.expenseProfitCardTitle}</h3>
            <p>{t.expenseProfitCardDesc} (৳ {netProfit.toLocaleString()})</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Expense')}>
              {t.openReportBtn} <ChevronRight size={16} />
            </button>
            <div className="report-watermark">
              <Wallet size={120} strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>

      <div className="reports-section" style={{ marginTop: '3rem' }}>
        <h3 className="reports-section-title">{t.academicRecordsHeading}</h3>
        <p className="reports-section-subtitle">{t.academicRecordsSubheading}</p>
        
        <div className="reports-grid">
          {/* Attendance Report */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#10b981', backgroundColor: '#ecfdf5' }}>
              <ClipboardCheck size={24} />
            </div>
            <h3>{t.attendanceReportCardTitle}</h3>
            <p>{t.attendanceReportCardDesc}</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Attendance')}>
              {t.openReportBtn} <ChevronRight size={16} />
            </button>
            <div className="report-watermark">
              <ClipboardCheck size={120} strokeWidth={1} />
            </div>
          </div>

          {/* Student List Report */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#d97706', backgroundColor: '#fffbeb' }}>
              <Users size={24} />
            </div>
            <h3>{t.studentRosterCardTitle}</h3>
            <p>{t.studentRosterCardDesc}</p>
            <button className="btn-open-report" onClick={() => setActiveReport('StudentList')}>
              {t.openReportBtn} <ChevronRight size={16} />
            </button>
            <div className="report-watermark">
              <Users size={120} strokeWidth={1} />
            </div>
          </div>

          {/* Exam Mark Sheet */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#6366f1', backgroundColor: '#eef2ff' }}>
              <FileQuestion size={24} />
            </div>
            <h3>{t.examMarkSheetCardTitle}</h3>
            <p>{t.examMarkSheetCardDesc}</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Exam')}>
              {t.openReportBtn} <ChevronRight size={16} />
            </button>
            <div className="report-watermark">
              <FileQuestion size={120} strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>

      {activeReport && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <div>
                <h2>{activeReport} {t.reportsTitle}</h2>
                <p>{t.liveReportSubtitle}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setActiveReport(null)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ minHeight: '300px' }}>
              {renderReportModalContent()}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setActiveReport(null)}>{t.close}</button>
              <button className="btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Printer size={16} /> {t.printReportBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
