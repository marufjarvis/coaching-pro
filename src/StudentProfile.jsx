import React, { useState } from 'react';
import { ArrowLeft, Wallet, DollarSign, Calendar, FileText, Phone, MessageSquare, Download, CreditCard, Edit, MoreVertical, Plus, CalendarDays, User, AlertCircle, Copy, Award } from 'lucide-react';
import './student-profile.css';

function StudentProfile({ student, onBack, onEdit }) {
  const [showDropdown, setShowDropdown] = useState(false);

  if (!student) return null;

  const handleCopy = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="student-profile-page">
      <button className="btn-back" onClick={onBack}>
        <ArrowLeft size={16} /> Back to students
      </button>

      {/* Header Card */}
      <div className="profile-header-card">
        <div className="profile-header-left">
          <div className="profile-avatar-large">{student.initials || 'ST'}</div>
          <div className="profile-info-top">
            <div className="profile-name-row">
              <h1>{student.name || 'Student Name'}</h1>
              <span className={`status-badge active`}>
                <span className="status-dot"></span>Active
              </span>
            </div>
            <div className="profile-badges">
              <span className="badge-gray">{student.id || 'STU-00000'}</span>
              <span className="badge-gray">{student.batch || 'Batch Name'}</span>
            </div>
          </div>
        </div>
        <div className="profile-header-right">
          <button className="btn-primary"><Wallet size={16} /> Collect fee</button>
          <button className="btn-secondary" onClick={onEdit}><Edit size={16} /> Edit profile</button>
          <div style={{ position: 'relative' }}>
            <button className="btn-icon-border" onClick={() => setShowDropdown(!showDropdown)}>
              <MoreVertical size={16} />
            </button>
            {showDropdown && (
              <div className="profile-actions-dropdown">
                <button className="dropdown-item" onClick={() => setShowDropdown(false)}>Mark inactive</button>
                <button className="dropdown-item" onClick={() => setShowDropdown(false)}>Open in payments</button>
                <button className="dropdown-item text-danger" onClick={() => {
                  if(window.confirm('Are you sure you want to delete this student?')) {
                    onBack();
                  }
                  setShowDropdown(false);
                }}>Delete student</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Batches Section */}
      <div className="profile-section-card">
        <div className="section-header-flex">
          <div>
            <h2 className="section-title">Enrolled Batch</h2>
            <p className="section-subtitle">Student's assigned batch and admission date.</p>
          </div>
        </div>
        <div className="enrolled-batch-card">
          <div className="batch-info-left">
            <div className="batch-title-row">
              <h3>{student.batch || 'Unassigned'}</h3>
            </div>
            <div className="batch-date-info" style={{ marginTop: '0.5rem' }}>Admitted on {student.admissionDate || 'N/A'}</div>
          </div>
          <div className="batch-info-right">
            <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}><Edit size={14} style={{ marginRight: '4px' }} /> Change batch</button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      {/* 4 KPI Cards */}
      {student.feeType === 'course' ? (
        <div className="profile-kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">COURSE FEE</span>
              <div className="kpi-icon blue"><Wallet size={18} /></div>
            </div>
            <div className="kpi-value">৳ {student.feeAmount || 0}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">TOTAL PAID</span>
              <div className="kpi-icon cyan"><DollarSign size={18} /></div>
            </div>
            <div className="kpi-value">৳ {student.paidAmount || 0}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">TOTAL DUE</span>
              <div className="kpi-icon yellow"><AlertCircle size={18} /></div>
            </div>
            <div className="kpi-value text-danger">৳ {Math.max(0, Number(student.feeAmount || 0) - Number(student.paidAmount || 0))}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">NEXT INSTALLMENT</span>
              <div className="kpi-icon green"><Calendar size={18} /></div>
            </div>
            <div className="kpi-value" style={{fontSize: '1.25rem'}}>{student.nextInstallmentDate || 'N/A'}</div>
          </div>
        </div>
      ) : (
        <div className="profile-kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">MONTHLY FEE</span>
              <div className="kpi-icon blue"><Wallet size={18} /></div>
            </div>
            <div className="kpi-value">৳ {student.feeAmount || 0}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">TOTAL PAID</span>
              <div className="kpi-icon cyan"><DollarSign size={18} /></div>
            </div>
            <div className="kpi-value">৳ {student.paidAmount || 0}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">BILLING DATE</span>
              <div className="kpi-icon yellow"><CalendarDays size={18} /></div>
            </div>
            <div className="kpi-value" style={{fontSize: '1.25rem'}}>{student.billingDate || 'N/A'}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">ATTENDANCE</span>
              <div className="kpi-icon green"><Calendar size={18} /></div>
            </div>
            <div className="kpi-value">0%</div>
            <div className="kpi-subtext">P 0 · A 0 · L 0</div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="profile-main-grid">
        {/* Left Column: Profile Info */}
        <div className="main-col-left">
          <div className="profile-section-card">
            <div className="section-header-flex">
              <h2 className="section-title flex-align"><User size={18} /> Profile information</h2>
            </div>
            
            <div className="info-list">
              <div className="info-row">
                <div className="info-label">Name</div>
                <div className="info-value">{student.name || '—'}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Student ID</div>
                <div className="info-value">{student.id || '—'}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Batch</div>
                <div className="info-value">{student.batch || '—'}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Mobile</div>
                <div className="info-value flex-align">
                  {student.phone || '—'} 
                  {student.phone && <button className="btn-small" style={{ marginLeft: '4px' }} onClick={() => handleCopy(student.phone)} title="Copy"><Copy size={14} /></button>}
                </div>
              </div>
              <div className="info-row">
                <div className="info-label">Guardian Phone</div>
                <div className="info-value flex-align">
                  {student.guardianPhone || '—'}
                  {student.guardianPhone && <button className="btn-small" style={{ marginLeft: '4px' }} onClick={() => handleCopy(student.guardianPhone)} title="Copy"><Copy size={14} /></button>}
                </div>
              </div>
              <div className="info-row">
                <div className="info-label">Admission date</div>
                <div className="info-value">{student.admissionDate || 'N/A'}</div>
              </div>
            </div>

            <div className="profile-actions-grid">
              <button className="btn-secondary outline"><Download size={16} /> Progress report</button>
              <button className="btn-secondary outline"><Download size={16} /> Payment ledger</button>
              <button className="btn-secondary outline full-width"><Download size={16} /> Fee statement (PDF / JPG)</button>
            </div>
          </div>
        </div>

        {/* Right Column: Exams & Payments */}
        <div className="main-col-right">
          <div className="profile-section-card min-h">
            <div className="section-header-flex">
              <h2 className="section-title flex-align"><Award size={18} /> Performance Overview</h2>
            </div>
            
            <div className="performance-kpi-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="kpi-card" style={{ background: '#f5f3ff', border: '1px solid #ede9fe' }}>
                <div className="kpi-header">
                  <span className="kpi-title" style={{ color: '#6d28d9' }}>OVERALL SCORE</span>
                </div>
                <div className="kpi-value" style={{ color: '#6d28d9' }}>88 / 100</div>
              </div>
              <div className="kpi-card" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                <div className="kpi-header">
                  <span className="kpi-title" style={{ color: '#92400e' }}>BATCH RANK</span>
                </div>
                <div className="kpi-value" style={{ color: '#b45309' }}>2nd <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>out of 45</span></div>
              </div>
            </div>

            <div className="section-header-flex" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
              <h2 className="section-title flex-align"><FileText size={18} /> Recent Exams</h2>
            </div>
            <table className="data-table" style={{ fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>EXAM</th>
                  <th>SCORE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>12/10/2026</td>
                  <td><strong>Monthly Test 1</strong><br/><span className="text-muted">ICT Chapter 1</span></td>
                  <td>45 / 50</td>
                  <td><span className="status-badge badge-present">Passed</span></td>
                </tr>
                <tr>
                  <td>25/10/2026</td>
                  <td><strong>Weekly Quiz</strong><br/><span className="text-muted">ICT Chapter 2</span></td>
                  <td>43 / 50</td>
                  <td><span className="status-badge badge-present">Passed</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="profile-section-card min-h">
            <div className="section-header-flex">
              <h2 className="section-title flex-align"><CreditCard size={18} /> Payment history</h2>
              <a href="#" className="text-link">View all payments →</a>
            </div>
            <div className="empty-state-full">
              <div className="empty-icon"><CreditCard size={24} /></div>
              <h3>No payments yet</h3>
              <p>Recorded payments will appear here.</p>
              <button className="btn-primary mt-3">Collect first payment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
