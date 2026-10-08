import React, { useState, useEffect } from 'react';
import { BarChart2, Receipt, Ban, Wallet, ClipboardCheck, Users, FileQuestion, ChevronRight, X, Printer } from 'lucide-react';
import { dataStore } from './dataStore';
import './reports.css';

function Reports() {
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
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>TOTAL TRANSACTIONS</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{payments.length}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>TOTAL COLLECTED REVENUE</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>৳ {totalCollected.toLocaleString()}</div>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>RECEIPT #</th>
                  <th>STUDENT</th>
                  <th>BATCH</th>
                  <th>METHOD</th>
                  <th style={{ textAlign: 'right' }}>AMOUNT</th>
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
                <span style={{ fontSize: '0.85rem', color: '#991b1b' }}>DUE STUDENTS</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#991b1b' }}>{dueStudents.length}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: '#991b1b' }}>TOTAL OUTSTANDING DUES</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626' }}>৳ {totalDues.toLocaleString()}</div>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>STUDENT ID</th>
                  <th>STUDENT NAME</th>
                  <th>BATCH</th>
                  <th>PHONE</th>
                  <th>FEE TYPE</th>
                  <th style={{ textAlign: 'right' }}>DUE AMOUNT</th>
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
                      <td>{s.feeType}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>৳ {s.dueAmount.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No dues recorded.</td></tr>
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
                <div style={{ fontSize: '0.8rem', color: '#166534' }}>TOTAL REVENUE</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16a34a' }}>৳ {totalCollected.toLocaleString()}</div>
              </div>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#991b1b' }}>TOTAL EXPENSES</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ef4444' }}>৳ {totalExpenseAmount.toLocaleString()}</div>
              </div>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#1e40af' }}>NET PROFIT (নেট লাভ)</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: netProfit >= 0 ? '#2563eb' : '#dc2626' }}>
                  ৳ {netProfit.toLocaleString()}
                </div>
              </div>
            </div>
            <h4 style={{ margin: '0 0 10px 0' }}>Expense Breakdown</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>EXPENSE TITLE</th>
                  <th>CATEGORY</th>
                  <th style={{ textAlign: 'right' }}>AMOUNT</th>
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
              <label>Select Batch</label>
              <select className="form-control" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
                {batches.map(b => <option key={b.id || b.name} value={b.name}>{b.name}</option>)}
              </select>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>STUDENT NAME</th>
                  <th>TOTAL REGISTERED DAYS</th>
                  <th>PRESENT</th>
                  <th>ABSENT</th>
                  <th>ATTENDANCE %</th>
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
                        <td>{stats.total || '—'}</td>
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
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No students in this batch.</td></tr>
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
                  <th>ID</th>
                  <th>NAME</th>
                  <th>BATCH</th>
                  <th>MOBILE</th>
                  <th>GUARDIAN</th>
                  <th>FEE</th>
                  <th>STATUS</th>
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
                        {s.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'Exam':
        const activeExam = exams.find(e => e.id === selectedExamId) || exams[0];
        const examStudents = activeExam 
          ? students.filter(s => activeExam.batch === 'All Batches' || s.batch === activeExam.batch)
          : [];

        return (
          <div>
            <div className="form-group" style={{ maxWidth: '340px', marginBottom: '1rem' }}>
              <label>Select Assessment</label>
              <select className="form-control" value={selectedExamId} onChange={(e) => setSelectedExamId(e.target.value)}>
                {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.name} ({ex.subject})</option>)}
              </select>
            </div>
            {activeExam && (
              <>
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <strong>Subject:</strong> {activeExam.subject} | <strong>Date:</strong> {activeExam.date} | <strong>Pass Marks:</strong> {activeExam.passMarks} / {activeExam.totalMarks}
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>STUDENT ID</th>
                      <th>NAME</th>
                      <th>BATCH</th>
                      <th>MARKS</th>
                      <th>RESULT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examStudents.length > 0 ? (
                      examStudents.map(s => {
                        const marks = activeExam.marks && activeExam.marks[s.id] !== undefined ? activeExam.marks[s.id] : '—';
                        const isPassed = marks !== '—' && Number(marks) >= Number(activeExam.passMarks);
                        return (
                          <tr key={s.id}>
                            <td>{s.id}</td>
                            <td><strong>{s.name}</strong></td>
                            <td>{s.batch}</td>
                            <td style={{ fontWeight: 700 }}>{marks} / {activeExam.totalMarks}</td>
                            <td>
                              {marks === '—' ? (
                                <span className="text-muted">Not graded</span>
                              ) : isPassed ? (
                                <span className="status-badge badge-present">Passed</span>
                              ) : (
                                <span className="status-badge badge-absent">Failed</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No student records for this exam.</td></tr>
                    )}
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
            <BarChart2 size={14} /> INSIGHTS & REPORTS
          </div>
          <h1>রিপোর্ট</h1>
          <p className="subtitle">Analyze performance across fees, attendance, profit & loss, and exams.</p>
        </div>
      </div>

      <div className="reports-section">
        <h3 className="reports-section-title">Financial performance</h3>
        <p className="reports-section-subtitle">Collections, outstanding fees, and coaching operational expenses.</p>
        
        <div className="reports-grid">
          {/* Collection Report */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#3b82f6', backgroundColor: '#eff6ff' }}>
              <Receipt size={24} />
            </div>
            <h3>Collection Report</h3>
            <p>Fee collections by student, batch, fee type and method (Total: ৳ {totalCollected.toLocaleString()})</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Collection')}>Open report <ChevronRight size={16} /></button>
            <div className="report-watermark">
              <Receipt size={120} strokeWidth={1} />
            </div>
          </div>

          {/* Due Report */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#ef4444', backgroundColor: '#fef2f2' }}>
              <Ban size={24} />
            </div>
            <h3>Due Report</h3>
            <p>Students with outstanding fees (Total Dues: ৳ {totalDues.toLocaleString()})</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Due')}>Open report <ChevronRight size={16} /></button>
            <div className="report-watermark">
              <Ban size={120} strokeWidth={1} />
            </div>
          </div>

          {/* Expense & Profit */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#0f766e', backgroundColor: '#f0fdfa' }}>
              <Wallet size={24} />
            </div>
            <h3>Expense & Profit</h3>
            <p>Revenue vs expenses with net profit (Net Profit: ৳ {netProfit.toLocaleString()})</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Expense')}>Open report <ChevronRight size={16} /></button>
            <div className="report-watermark">
              <Wallet size={120} strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>

      <div className="reports-section" style={{ marginTop: '3rem' }}>
        <h3 className="reports-section-title">Academic records</h3>
        <p className="reports-section-subtitle">Attendance percentages, student rosters, and exam mark sheets.</p>
        
        <div className="reports-grid">
          {/* Attendance Report */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#10b981', backgroundColor: '#ecfdf5' }}>
              <ClipboardCheck size={24} />
            </div>
            <h3>Attendance Report</h3>
            <p>Student attendance rates and present/absent counts by batch</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Attendance')}>Open report <ChevronRight size={16} /></button>
            <div className="report-watermark">
              <ClipboardCheck size={120} strokeWidth={1} />
            </div>
          </div>

          {/* Student List Report */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#d97706', backgroundColor: '#fffbeb' }}>
              <Users size={24} />
            </div>
            <h3>Student Directory Roster</h3>
            <p>Comprehensive roster of all enrolled students with contact info</p>
            <button className="btn-open-report" onClick={() => setActiveReport('StudentList')}>Open report <ChevronRight size={16} /></button>
            <div className="report-watermark">
              <Users size={120} strokeWidth={1} />
            </div>
          </div>

          {/* Exam Mark Sheet */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#6366f1', backgroundColor: '#eef2ff' }}>
              <FileQuestion size={24} />
            </div>
            <h3>Exam Mark Sheet</h3>
            <p>Assessment mark sheets and pass/fail summary results</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Exam')}>Open report <ChevronRight size={16} /></button>
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
                <h2>{activeReport} Report</h2>
                <p>Live calculated report from Coaching Pro database</p>
              </div>
              <button className="btn-close-modal" onClick={() => setActiveReport(null)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ minHeight: '300px' }}>
              {renderReportModalContent()}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setActiveReport(null)}>Close</button>
              <button className="btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Printer size={16} /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
