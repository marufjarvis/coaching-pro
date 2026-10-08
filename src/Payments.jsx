import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Filter, Plus, FileText, Search, ChevronLeft, ChevronRight, Inbox, Wallet, X, Printer, CheckCircle2 } from 'lucide-react';
import { dataStore } from './dataStore';
import './payments.css';

function Payments({ setActiveTab }) {
  const [payments, setPayments] = useState(() => dataStore.getPayments());
  const [students, setStudents] = useState(() => dataStore.getStudents());
  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [settings, setSettings] = useState(() => dataStore.getSettings());

  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState(null);

  const [selectedBatch, setSelectedBatch] = useState(batches.length > 0 ? batches[0].name : '');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [collectedBy, setCollectedBy] = useState('Admin');
  const [paymentNote, setPaymentNote] = useState('');

  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [selectedFeeType, setSelectedFeeType] = useState('All types');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleSync = () => {
      setPayments(dataStore.getPayments());
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

  // Update selected batch if empty
  useEffect(() => {
    if (!selectedBatch && batches.length > 0) {
      setSelectedBatch(batches[0].name);
    }
  }, [batches, selectedBatch]);

  // Students belonging to selected batch
  const filteredBatchStudents = students.filter(s => s.batch === selectedBatch);
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  useEffect(() => {
    // Reset student when batch changes
    setSelectedStudentId('');
    setPaymentAmount('');
  }, [selectedBatch]);

  useEffect(() => {
    // Auto-fill suggested amount when student is selected
    if (selectedStudent) {
      const due = Math.max(0, (Number(selectedStudent.feeAmount) || 0) - (Number(selectedStudent.paidAmount) || 0));
      setPaymentAmount(due > 0 ? due.toString() : (selectedStudent.feeAmount || '500'));
      setPaymentNote(selectedStudent.feeType === 'monthly' ? 'Monthly Tuition Fee' : 'Course Fee Installment');
    } else {
      setPaymentAmount('');
    }
  }, [selectedStudentId]);

  const handleRecordPayment = () => {
    if (!selectedStudent || !paymentAmount) return;

    const newTxn = dataStore.recordPayment({
      studentId: selectedStudent.id,
      amount: paymentAmount,
      method: paymentMethod,
      collectedBy: collectedBy,
      note: paymentNote
    });

    if (newTxn) {
      setIsCollectModalOpen(false);
      setSelectedStudentId('');
      setPaymentAmount('');
      setViewingReceipt(newTxn);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // Filter payments
  const filteredPayments = payments.filter(p => {
    const matchesFee = selectedFeeType === 'All types' || 
      (p.feeType && p.feeType.toLowerCase() === selectedFeeType.toLowerCase());
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      p.studentName.toLowerCase().includes(q) || 
      p.id.toLowerCase().includes(q) || 
      p.studentId.toLowerCase().includes(q);
    return matchesFee && matchesSearch;
  });

  // KPI Calculations
  const today = new Date().toLocaleDateString('en-GB');
  const todaysCollection = payments
    .filter(p => p.date === today)
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const thisMonthsCollection = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const lastPayment = payments.length > 0 ? payments[0] : null;

  return (
    <div className="payments-page">
      <div className="page-header">
        <div>
          <div className="page-subtitle"><CreditCard size={16} /> COLLECTION DESK</div>
          <h1 className="page-title">পেমেন্ট</h1>
          <p className="page-desc">Collect student fees, review transactions, and issue receipts.</p>
        </div>
        <div className="header-actions">
          {setActiveTab && (
            <button className="btn-secondary" onClick={() => setActiveTab('due-inbox')}>
              <Inbox size={18} /> Due inbox
            </button>
          )}
          <button className="btn-primary" onClick={() => setIsCollectModalOpen(true)}>
            <Wallet size={18} /> Collect fee
          </button>
        </div>
      </div>

      <div className="filter-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label>Search payment</label>
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by student name, ID or receipt #..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-input" 
            />
          </div>
        </div>
        <div className="form-group" style={{ width: '180px' }}>
          <label>Fee type</label>
          <select 
            className="filter-select"
            value={selectedFeeType}
            onChange={(e) => setSelectedFeeType(e.target.value)}
          >
            <option value="All types">All types</option>
            <option value="monthly">Monthly fee</option>
            <option value="course">Course fee</option>
          </select>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card highlight">
          <div className="kpi-label">আজকের কালেকশন</div>
          <div className="kpi-value">৳ {todaysCollection.toLocaleString()}</div>
          <div className="kpi-desc">Today's collection ({today})</div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-label">এই মাসের কালেকশন</div>
          <div className="kpi-value">৳ {thisMonthsCollection.toLocaleString()}</div>
          <div className="kpi-desc">{selectedMonth}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">সর্বমোট ট্রানজেকশন</div>
          <div className="kpi-value">{payments.length}</div>
          <div className="kpi-desc">Recorded payments</div>
        </div>
      </div>

      <div className="ledger-section">
        <div className="ledger-header">
          <h2 className="section-title">
            Transaction ledger <span className="count-badge">{filteredPayments.length}</span>
          </h2>
          <p className="section-desc">Review payments or click to view and print official receipt.</p>
        </div>

        <div className="table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>TRANSACTION ID</th>
                <th>STUDENT</th>
                <th>BATCH</th>
                <th>FEE TYPE</th>
                <th>METHOD</th>
                <th>COLLECTED BY</th>
                <th>DATE & TIME</th>
                <th style={{ textAlign: 'right' }}>AMOUNT</th>
                <th style={{ textAlign: 'center' }}>RECEIPT</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map(payment => (
                  <tr key={payment.id}>
                    <td className="tx-id"><strong>{payment.id}</strong></td>
                    <td>
                      <div className="student-info-cell">
                        <span className="student-name">{payment.studentName}</span>
                        <span className="student-id">{payment.studentId}</span>
                      </div>
                    </td>
                    <td>{payment.batch || '—'}</td>
                    <td>
                      <span className={`fee-type-badge ${(payment.feeType || 'monthly').toLowerCase()}`}>
                        {payment.feeType === 'monthly' ? 'বেতন' : 'কোর্স'}
                      </span>
                    </td>
                    <td><span className="status-badge active">{payment.method}</span></td>
                    <td>
                      <span className="role-badge admin" style={{fontSize: '0.7rem'}}>
                        {payment.collectedBy || 'Admin'}
                      </span>
                    </td>
                    <td>
                      <div className="date-time-cell">
                        <span className="date">{payment.date}</span>
                        <span className="time">{payment.time}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '700', color: '#16a34a' }}>
                      ৳ {Number(payment.amount).toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn-icon" 
                        title="View Money Receipt"
                        onClick={() => setViewingReceipt(payment)}
                      >
                        <FileText size={18} color="#0284c7" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="empty-state">
                    <div className="empty-icon"><CreditCard size={24} /></div>
                    <p>No payments recorded yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {isCollectModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2>Collect Fee (ফি আদায়)</h2>
                <p>Select student, specify amount and payment method.</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsCollectModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>BATCH</label>
                <select 
                  className="form-control"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                  {batches.map(b => (
                    <option key={b.id || b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>STUDENT <span className="text-danger">*</span></label>
                <select 
                  className="form-control"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  <option value="">Select a student in this batch...</option>
                  {filteredBatchStudents.map(s => {
                    const due = Math.max(0, (Number(s.feeAmount) || 0) - (Number(s.paidAmount) || 0));
                    return (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.id}) — Due: ৳ {due}
                      </option>
                    );
                  })}
                </select>
              </div>

              {selectedStudent && (
                <>
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', color: '#166534' }}>
                    <strong>Fee Model:</strong> {selectedStudent.feeType === 'monthly' ? 'Monthly' : 'Course'} | <strong>Total Fee:</strong> ৳ {selectedStudent.feeAmount} | <strong>Paid:</strong> ৳ {selectedStudent.paidAmount} | <strong>Due:</strong> ৳ {Math.max(0, (Number(selectedStudent.feeAmount) || 0) - (Number(selectedStudent.paidAmount) || 0))}
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>AMOUNT (৳) <span className="text-danger">*</span></label>
                      <input 
                        type="number" 
                        className="form-control"
                        placeholder="e.g. 500"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="form-group half">
                      <label>PAYMENT METHOD</label>
                      <select 
                        className="form-control"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="Cash">Cash (নগদ)</option>
                        <option value="bKash">bKash</option>
                        <option value="Nagad">Nagad</option>
                        <option value="Rocket">Rocket</option>
                        <option value="Bank">Bank Transfer</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>NOTE / DESCRIPTION</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. October 2026 tuition fee"
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>COLLECTED BY</label>
                    <select 
                      className="form-control"
                      value={collectedBy}
                      onChange={(e) => setCollectedBy(e.target.value)}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsCollectModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleRecordPayment} disabled={!selectedStudent || !paymentAmount}>
                Confirm & Issue Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Money Receipt Modal */}
      {viewingReceipt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px', padding: '24px' }}>
            <div className="receipt-print-area" style={{ border: '2px dashed #cbd5e1', padding: '20px', borderRadius: '12px', background: '#fafafa' }}>
              <div style={{ textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.25rem', margin: '0 0 4px 0', color: '#0f172a' }}>{settings.coachingName}</h2>
                <p style={{ margin: '0', fontSize: '0.8rem', color: '#64748b' }}>{settings.address}</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Phone: {settings.phone}</p>
                <div style={{ display: 'inline-block', background: '#e0f2fe', color: '#0369a1', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, marginTop: '8px' }}>
                  MONEY RECEIPT (ফি পরিশোধের রসিদ)
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                <div><strong>Receipt No:</strong> {viewingReceipt.id}</div>
                <div style={{ textAlign: 'right' }}><strong>Date:</strong> {viewingReceipt.date}</div>
                <div><strong>Student Name:</strong> {viewingReceipt.studentName}</div>
                <div style={{ textAlign: 'right' }}><strong>Student ID:</strong> {viewingReceipt.studentId}</div>
                <div><strong>Batch:</strong> {viewingReceipt.batch || '—'}</div>
                <div style={{ textAlign: 'right' }}><strong>Fee Type:</strong> {viewingReceipt.feeType === 'monthly' ? 'Monthly' : 'Course'}</div>
                <div><strong>Payment Method:</strong> {viewingReceipt.method}</div>
                <div style={{ textAlign: 'right' }}><strong>Collected By:</strong> {viewingReceipt.collectedBy}</div>
              </div>

              <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#475569' }}>Paid Description:</span>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewingReceipt.note || 'Coaching tuition fee'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>PAID AMOUNT</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>৳ {Number(viewingReceipt.amount).toLocaleString()}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '24px', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b' }}>
                <div>Thank you for learning with us!</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '100px', borderBottom: '1px solid #94a3b8', marginBottom: '4px' }}></div>
                  Authorized Signature
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button className="btn-secondary" onClick={() => setViewingReceipt(null)}>Close</button>
              <button className="btn-primary" onClick={handlePrintReceipt}>
                <Printer size={16} /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;
