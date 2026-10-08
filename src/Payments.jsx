import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Filter, Plus, FileText, Search, ChevronLeft, ChevronRight, Inbox, Wallet, X } from 'lucide-react';
import './payments.css';

function Payments({ setActiveTab }) {
  const [payments, setPayments] = useState([
    {
      id: 'TXN-001',
      studentName: 'Maruf Hossain',
      studentId: 'STU-66115',
      amount: 500,
      feeType: 'Monthly',
      method: 'bKash',
      collectedBy: 'Manager',
      date: new Date().toLocaleDateString('en-GB'),
      time: '10:30 AM'
    },
    {
      id: 'TXN-002',
      studentName: 'Rakib Hasan',
      studentId: 'STU-45213',
      amount: 2000,
      feeType: 'Course',
      method: 'Cash',
      collectedBy: 'Admin',
      date: new Date().toLocaleDateString('en-GB'),
      time: '11:45 AM'
    }
  ]);

  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('Sat-6:45am');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [collectedBy, setCollectedBy] = useState('Admin');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().substring(0, 10)); // For Monthly fee month/date selection
  
  const studentsList = [
    { id: 'STU-66115', name: 'Maruf Hossain', batch: 'Sat-6:45am', feeType: 'Monthly', feeAmount: 500, paidAmount: 0 },
    { id: 'STU-45213', name: 'Rakib Hasan', batch: 'Sat-6:45am', feeType: 'Course', feeAmount: 2000, totalCourseFee: 4000, paidAmount: 0 },
    { id: 'STU-10293', name: 'Ayesha Siddiqua', batch: 'Sun-8am', feeType: 'Monthly', feeAmount: 500, paidAmount: 0 }
  ].map(student => {
    const totalPaid = payments
      .filter(p => p.studentId === student.id)
      .reduce((sum, p) => sum + p.amount, 0);
    return { ...student, paidAmount: totalPaid };
  });

  const filteredStudents = studentsList.filter(s => s.batch === selectedBatch);
  const selectedStudent = studentsList.find(s => s.id === selectedStudentId);

  useEffect(() => {
    // Reset student when batch changes
    setSelectedStudentId('');
  }, [selectedBatch]);

  useEffect(() => {
    // Reset amount when student selected
    setPaymentAmount('');
  }, [selectedStudentId]);

  const handleRecordPayment = () => {
    if (!selectedStudent || !paymentAmount) return;

    const newPayment = {
      id: `TXN-00${payments.length + 1}`,
      studentName: selectedStudent.name,
      studentId: selectedStudent.id,
      amount: parseInt(paymentAmount),
      feeType: selectedStudent.feeType,
      method: paymentMethod,
      collectedBy: collectedBy,
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setPayments([...payments, newPayment]);
    setIsCollectModalOpen(false);
    setSelectedStudentId('');
    setPaymentAmount('');
    setPaymentMethod('Cash');
    setCollectedBy('Admin');
  };

  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [selectedFeeType, setSelectedFeeType] = useState('All types');

  // Calculations for KPIs
  const today = new Date().toLocaleDateString('en-GB');
  
  const todaysCollection = payments
    .filter(p => p.date === today)
    .reduce((sum, p) => sum + p.amount, 0);

  const thisMonthsCollection = payments.reduce((sum, p) => sum + p.amount, 0); // Simplified for demo

  const lastPayment = payments.length > 0 ? payments[payments.length - 1] : null;

  return (
    <div className="payments-page">
      <div className="page-header">
        <div>
          <div className="page-subtitle"><CreditCard size={16} /> COLLECTION DESK</div>
          <h1 className="page-title">পেমেন্ট</h1>
          <p className="page-desc">Collect student fees, review transactions, and issue receipts.</p>
        </div>
        <div className="header-actions">
          {setActiveTab && <button className="btn-secondary" onClick={() => setActiveTab('due-inbox')}><Inbox size={18} /> Due inbox</button>}
          {!setActiveTab && <button className="btn-secondary"><Inbox size={18} /> Due inbox</button>}
          <button className="btn-primary" onClick={() => setIsCollectModalOpen(true)}><Wallet size={18} /> Collect fee</button>
        </div>
      </div>

      <div className="filter-card">
        <div className="form-group">
          <label>Collection month</label>
          <div className="input-with-icon">
            <input type="text" value={selectedMonth} readOnly className="filter-input" />
            <Calendar size={16} className="input-icon" />
          </div>
        </div>
        <div className="form-group">
          <label>Fee type</label>
          <select 
            className="filter-select"
            value={selectedFeeType}
            onChange={(e) => setSelectedFeeType(e.target.value)}
          >
            <option value="All types">All types</option>
            <option value="Monthly">Monthly fee</option>
            <option value="Course">Course fee</option>
          </select>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card highlight">
          <div className="kpi-label">আজকের কালেকশন</div>
          <div className="kpi-value">৳ {todaysCollection.toLocaleString()}</div>
          <div className="kpi-desc">Today's collection</div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-label">এই মাসের কালেকশন</div>
          <div className="kpi-value">৳ {thisMonthsCollection.toLocaleString()}</div>
          <div className="kpi-desc">{selectedMonth}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">শেষ পেমেন্ট টাইপ</div>
          <div className="kpi-value">{lastPayment ? (lastPayment.feeType === 'Monthly' ? 'বেতন সিস্টেম' : 'কোর্স সিস্টেম') : '—'}</div>
          <div className="kpi-desc">Last collected fee type</div>
        </div>
      </div>

      <div className="ledger-section">
        <div className="ledger-header">
          <h2 className="section-title">
            Transaction ledger <span className="count-badge">{payments.length}</span>
          </h2>
          <p className="section-desc">Review a payment or open its receipt.</p>
        </div>

        <div className="table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>TRANSACTION ID</th>
                <th>STUDENT</th>
                <th>FEE TYPE</th>
                <th>METHOD</th>
                <th>COLLECTED BY</th>
                <th>DATE & TIME</th>
                <th style={{ textAlign: 'right' }}>AMOUNT</th>
                <th style={{ textAlign: 'center' }}>RECEIPT</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                [...payments].reverse().map(payment => (
                  <tr key={payment.id}>
                    <td className="tx-id">{payment.id}</td>
                    <td>
                      <div className="student-info-cell">
                        <span className="student-name">{payment.studentName}</span>
                        <span className="student-id">{payment.studentId}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`fee-type-badge ${payment.feeType.toLowerCase()}`}>
                        {payment.feeType === 'Monthly' ? 'বেতন' : 'কোর্স'}
                      </span>
                    </td>
                    <td>{payment.method}</td>
                    <td>
                      {payment.collectedBy === 'Admin' ? (
                        <span className="role-badge admin" style={{fontSize: '0.65rem'}}>Admin</span>
                      ) : (
                        <span className="role-badge manager" style={{fontSize: '0.65rem'}}>Manager</span>
                      )}
                    </td>
                    <td>
                      <div className="date-time-cell">
                        <span className="date">{payment.date}</span>
                        <span className="time">{payment.time}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '700', color: '#111827' }}>
                      ৳ {payment.amount.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn-icon" title="View Receipt">
                        <FileText size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <div className="empty-icon"><CreditCard size={24} /></div>
                    <p>No payments for this month</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isCollectModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2>Collect fee</h2>
                <p>Record tuition for months or course installments.</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsCollectModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>BATCH</label>
                  <select 
                    className="form-control"
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                  >
                    <option value="Sat-6:45am">Sat-6:45am</option>
                    <option value="Sun-8am">Sun-8am</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>STUDENT</label>
                <select 
                  className="form-control"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  <option value="">Select a student...</option>
                  {filteredStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>

              {selectedStudent && (
                <>
                  {selectedStudent.feeType === 'Monthly' ? (
                    <div className="form-group">
                      <label>MONTH / DATE (For Monthly Fee)</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="course-fee-summary" style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '8px', marginBottom: '8px', fontSize: '0.85rem', color: '#166534', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>Total Course Fee:</strong> ৳ {selectedStudent.totalCourseFee}</span>
                        <span><strong>Paid:</strong> ৳ {selectedStudent.paidAmount}</span>
                        <span><strong>Due:</strong> ৳ {selectedStudent.totalCourseFee - selectedStudent.paidAmount}</span>
                      </div>
                      <div className="form-group">
                        <label>PAYMENT TYPE (Course Fee)</label>
                        <select className="form-control">
                          <option>Installment Payment</option>
                          <option>Full Payment</option>
                        </select>
                      </div>
                    </>
                  )}
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>AMOUNT</label>
                      <input 
                        type="number" 
                        className="form-control"
                        placeholder="0"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>PAYMENT METHOD</label>
                      <select 
                        className="form-control"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="Cash">Cash</option>
                        <option value="bKash">bKash</option>
                        <option value="Bank">Bank</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>COLLECTED BY (SIMULATION)</label>
                    <select 
                      className="form-control"
                      value={collectedBy}
                      onChange={(e) => setCollectedBy(e.target.value)}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                    </select>
                    <small className="text-muted" style={{display: 'block', marginTop: '4px'}}>
                      In final app, this is auto-set by logged-in user.
                    </small>
                  </div>
                </>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsCollectModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleRecordPayment} disabled={!selectedStudent || !paymentAmount}>Record payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;
