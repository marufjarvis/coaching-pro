import React, { useState } from 'react';
import { BarChart2, Receipt, Ban, Wallet, ClipboardCheck, Users, FileQuestion, ChevronRight, X, Download } from 'lucide-react';
import './reports.css';

function Reports() {
  const [activeReport, setActiveReport] = useState(null);

  const renderReportModalContent = () => {
    switch (activeReport) {
      case 'Collection':
        return (
          <div>
            <div className="form-group" style={{ maxWidth: '200px', marginBottom: '1rem' }}>
              <label>Month</label>
              <input type="month" className="form-control" defaultValue="2026-10" />
            </div>
            <table className="data-table">
              <thead><tr><th>DATE</th><th>STUDENT</th><th>FEE TYPE</th><th>METHOD</th><th>AMOUNT</th></tr></thead>
              <tbody>
                <tr><td>12/10/2026</td><td>Maruf Hossain</td><td>Monthly</td><td>bKash</td><td>৳ 500</td></tr>
                <tr><td>15/10/2026</td><td>Rakib Hasan</td><td>Course</td><td>Cash</td><td>৳ 2000</td></tr>
              </tbody>
            </table>
          </div>
        );
      case 'Due':
        return (
          <div>
            <div className="form-group" style={{ maxWidth: '200px', marginBottom: '1rem' }}>
              <label>Month</label>
              <input type="month" className="form-control" defaultValue="2026-10" />
            </div>
            <table className="data-table">
              <thead><tr><th>STUDENT</th><th>BATCH</th><th>FEE TYPE</th><th>DUE AMOUNT</th></tr></thead>
              <tbody>
                <tr><td>Karim Islam</td><td>Sat-6:45am</td><td>Monthly</td><td><span className="text-danger">৳ 500</span></td></tr>
                <tr><td>Jamal Uddin</td><td>Sun-8:00am</td><td>Course</td><td><span className="text-danger">৳ 1500</span></td></tr>
              </tbody>
            </table>
          </div>
        );
      case 'Expense':
        return (
          <div>
             <div className="form-group" style={{ maxWidth: '200px', marginBottom: '1rem' }}>
              <label>Month</label>
              <input type="month" className="form-control" defaultValue="2026-10" />
            </div>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
              <div><p className="text-muted" style={{margin:0}}>Total Revenue</p><h3 style={{margin:0}}>৳ 2500</h3></div>
              <div><p className="text-muted" style={{margin:0}}>Total Expenses</p><h3 style={{margin:0, color: '#ef4444'}}>৳ 800</h3></div>
              <div><p className="text-muted" style={{margin:0}}>Net Profit</p><h3 style={{margin:0, color: '#10b981'}}>৳ 1700</h3></div>
            </div>
          </div>
        );
      case 'Attendance':
        return (
          <div>
            <div className="form-row" style={{ marginBottom: '1rem' }}>
              <div className="form-group"><label>Batch</label><select className="form-control"><option>Sat-6:45am</option></select></div>
              <div className="form-group"><label>Month</label><input type="month" className="form-control" defaultValue="2026-10" /></div>
            </div>
            <table className="data-table">
              <thead><tr><th>STUDENT</th><th>TOTAL DAYS</th><th>PRESENT</th><th>ABSENT</th></tr></thead>
              <tbody>
                <tr><td>Maruf Hossain</td><td>10</td><td>9</td><td>1</td></tr>
                <tr><td>Rakib Hasan</td><td>10</td><td>10</td><td>0</td></tr>
              </tbody>
            </table>
          </div>
        );
      case 'StudentList':
        return (
          <div>
            <div className="form-group" style={{ maxWidth: '200px', marginBottom: '1rem' }}>
              <label>Batch</label><select className="form-control"><option>All Batches</option><option>Sat-6:45am</option></select>
            </div>
            <table className="data-table">
              <thead><tr><th>ID</th><th>NAME</th><th>BATCH</th><th>STATUS</th></tr></thead>
              <tbody>
                <tr><td>STU-66115</td><td>Maruf Hossain</td><td>Sat-6:45am</td><td><span className="status-badge active"><span className="status-dot"></span>Active</span></td></tr>
                <tr><td>STU-45213</td><td>Rakib Hasan</td><td>Sat-6:45am</td><td><span className="status-badge active"><span className="status-dot"></span>Active</span></td></tr>
              </tbody>
            </table>
          </div>
        );
      case 'Exam':
        return (
          <div>
            <div className="form-group" style={{ maxWidth: '300px', marginBottom: '1rem' }}>
              <label>Select Exam</label><select className="form-control"><option>Monthly Test 1 (Sat-6:45am)</option></select>
            </div>
            <p>Mock PDF marksheet generation view...</p>
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
          <p className="subtitle">Analyze performance across fees, attendance and academics</p>
        </div>
      </div>

      <div className="reports-section">
        <h3 className="reports-section-title">Financial performance</h3>
        <p className="reports-section-subtitle">Collections, outstanding fees, and the cost of running your center.</p>
        
        <div className="reports-grid">
          {/* Collection Report */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#3b82f6', backgroundColor: '#eff6ff' }}>
              <Receipt size={24} />
            </div>
            <h3>Collection Report</h3>
            <p>Monthly fee collections by student, fee type and payment method</p>
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
            <p>Students with outstanding monthly fees for the selected month</p>
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
            <p>Revenue vs expenses with net profit for any month</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Expense')}>Open report <ChevronRight size={16} /></button>
            <div className="report-watermark">
              <Wallet size={120} strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>

      <div className="reports-section" style={{ marginTop: '3rem' }}>
        <h3 className="reports-section-title">Academic & team records</h3>
        <p className="reports-section-subtitle">Attendance, student rosters, exam results, and teacher salary sheets.</p>
        
        <div className="reports-grid">
          {/* Attendance Report */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#10b981', backgroundColor: '#ecfdf5' }}>
              <ClipboardCheck size={24} />
            </div>
            <h3>Attendance Report</h3>
            <p>Daily or monthly present/absent grid with batch filters</p>
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
            <h3>Student List Report</h3>
            <p>Batch-wise student roster with ID and status</p>
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
            <p>Generate and print branded mark sheets from exams</p>
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
                <p>Detailed view and exports</p>
              </div>
              <button className="btn-close-modal" onClick={() => setActiveReport(null)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ minHeight: '300px' }}>
              {renderReportModalContent()}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setActiveReport(null)}>Close</button>
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={16} /> Export (CSV/PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
