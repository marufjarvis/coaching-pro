import React, { useState, useEffect } from 'react';
import { Users, Link, Plus, Search, ChevronLeft, ChevronRight, User, X } from 'lucide-react';
import StudentProfile from './StudentProfile';
import './students.css';

function Students() {
  const [activeTab, setActiveTab] = useState('All students');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feeType, setFeeType] = useState('monthly');
  const [pendingStudents, setPendingStudents] = useState(() => {
    return JSON.parse(localStorage.getItem('pendingStudents') || '[]');
  });
  const [newStudent, setNewStudent] = useState({
    idNumber: '', name: '', phone: '', guardianPhone: '', batch: '', feeAmount: '', admissionFee: '', discount: '', installments: ''
  });
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('coachingStudents');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { 
        id: 'STU-66115', name: 'Maruf Hossain', initials: 'MA', batch: 'Sat-6:45am', status: 'Active', 
        phone: '01723619524', guardianPhone: '01586232012', feeType: 'monthly', feeAmount: '500', paidAmount: '0',
        billingDate: '1st of every month', admissionDate: '01/10/2026'
      },
      { 
        id: 'STU-45213', name: 'Rakib Hasan', initials: 'RA', batch: 'Sat-6:45am', status: 'Active', 
        phone: '01534343434', guardianPhone: '01711122233', feeType: 'course', feeAmount: '4000', installments: '2', paidAmount: '0',
        nextInstallmentDate: '01/11/2026', admissionDate: '05/10/2026'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('coachingStudents', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem('coachingStudents');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setStudents(parsed);
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  const handleSaveStudent = () => {
    if (newStudent.name.trim() === '' || !newStudent.idNumber.trim()) {
      alert("Student ID and Name are required.");
      return;
    }
    
    const initials = newStudent.name.substring(0, 2).toUpperCase();
    const newId = newStudent.idNumber;
    
    const studentObj = {
      id: newId,
      name: newStudent.name,
      initials: initials,
      batch: newStudent.batch || 'Unassigned',
      status: 'Active',
      phone: newStudent.phone,
      guardianPhone: newStudent.guardianPhone,
      feeType: feeType,
      feeAmount: newStudent.feeAmount,
      admissionFee: feeType === 'monthly' ? newStudent.admissionFee : null,
      discount: newStudent.discount,
      installments: newStudent.installments,
      paidAmount: 0,
      billingDate: feeType === 'monthly' ? '1st of every month' : null,
      nextInstallmentDate: feeType === 'course' ? '01/11/2026' : null,
      admissionDate: new Date().toLocaleDateString('en-GB')
    };
    
    setStudents([...students, studentObj]);
    
    // If it was a pending student being approved, remove from pending list
    if (newStudent.isPending) {
      const updatedPending = pendingStudents.filter(p => p.id !== newStudent.id);
      setPendingStudents(updatedPending);
      localStorage.setItem('pendingStudents', JSON.stringify(updatedPending));
    }

    setIsAddModalOpen(false);
    setNewStudent({ name: '', phone: '', guardianPhone: '', batch: '', feeAmount: '', discount: '', installments: '' });
  };

  return (
    <>
      {selectedStudent ? (
        <StudentProfile 
          student={selectedStudent} 
          onBack={() => setSelectedStudent(null)}
          onEdit={() => {
            setNewStudent({...selectedStudent});
            setFeeType(selectedStudent.feeType || 'monthly');
            setIsAddModalOpen(true);
          }}
        />
      ) : (
        <div className="students-page">
          <div className="page-header">
        <div>
          <div className="page-subtitle"><Users size={16} /> STUDENT DIRECTORY</div>
          <h1 className="page-title">শিক্ষার্থী</h1>
          <p className="page-desc">Manage students and enrollments.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary"><Link size={16} /> Enrollment links</button>
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}><Plus size={18} /> Add student</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">কোর্স সিস্টেম</div>
            <div className="stat-value blue-text">0</div>
            <div className="stat-desc">Course based students</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">বেতন সিস্টেম</div>
            <div className="stat-value">1</div>
            <div className="stat-desc">Monthly fee students</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">মোট শিক্ষার্থী</div>
            <div className="stat-value">1</div>
            <div className="stat-desc">Total students</div>
          </div>
        </div>
      </div>

      <div className="directory-section">
        <h2 className="section-title">Student directory</h2>
        <p className="section-desc">Search by name or ID, then narrow down by batch.</p>

        <div className="tabs-container">
          {['All students', 'Active', 'Inactive', 'Pending Approvals'].map(tab => (
            <button 
              key={tab} 
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === 'Pending Approvals' && pendingStudents.length > 0 && (
                <span style={{ background: '#ef4444', color: 'white', borderRadius: '10px', padding: '2px 6px', fontSize: '10px', marginLeft: '6px' }}>
                  {pendingStudents.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="table-container">
          <div className="table-filters">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search by name or ID..." />
            </div>
            <select className="filter-select">
              <option>All batches</option>
              <option>Sat-6:45am</option>
              <option>Sun-8am</option>
            </select>
            <select className="filter-select">
              <option>All status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="student-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>STUDENT NAME</th>
                  <th>STUDENT ID</th>
                  <th>BATCH</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'Pending Approvals' ? pendingStudents : students).map((student, idx) => (
                  <tr key={idx}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div className="student-name-cell">
                        <div className="student-avatar">{student.initials || student.name.substring(0,2).toUpperCase()}</div>
                        <span className="student-name">{student.name}</span>
                      </div>
                    </td>
                    <td>{student.id}</td>
                    <td>{student.batch}</td>
                    <td>
                      {activeTab === 'Pending Approvals' ? (
                        <span className="status-badge" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                          <span className="status-dot" style={{ backgroundColor: '#d97706' }}></span>
                          Pending
                        </span>
                      ) : (
                        <span className={`status-badge ${student.status.toLowerCase()}`}>
                          <span className="status-dot"></span>
                          {student.status}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {activeTab === 'Pending Approvals' ? (
                        <button 
                          className="btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => {
                            setNewStudent({ ...student, isPending: true });
                            setIsAddModalOpen(true);
                          }}
                        >
                          Approve
                        </button>
                      ) : (
                        <button className="btn-secondary" onClick={() => setSelectedStudent(student)}>Profile</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-pagination">
            <span>Showing 1-1 of 1 student</span>
            <div className="pagination-controls">
              <button className="btn-page"><ChevronLeft size={16} /></button>
              <button className="btn-page active">1</button>
              <button className="btn-page"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
        </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content student-modal">
            <div className="modal-header">
              <div>
                <h2>শিক্ষার্থী যোগ</h2>
                <p>Create a profile with monthly or course/installment billing.</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>STUDENT ID <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. STU-101" 
                  value={newStudent.idNumber} 
                  onChange={(e) => setNewStudent({...newStudent, idNumber: e.target.value})} 
                  required
                />
                <small className="text-muted" style={{display: 'block', marginTop: '4px'}}>Required. This will be the student's unique verification ID.</small>
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>নাম</label>
                  <input type="text" className="form-control" placeholder="Student full name" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} />
                </div>
                <div className="form-group half">
                  <label>ফোন</label>
                  <input type="text" className="form-control" placeholder="01XXXXXXXXX" value={newStudent.phone} onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>GUARDIAN PHONE</label>
                  <input type="text" className="form-control" placeholder="Optional" value={newStudent.guardianPhone} onChange={(e) => setNewStudent({...newStudent, guardianPhone: e.target.value})} />
                </div>
                <div className="form-group half">
                  <label>ব্যাচ</label>
                  <select className="filter-select full-width" value={newStudent.batch} onChange={(e) => setNewStudent({...newStudent, batch: e.target.value})}>
                    <option value="">Optional</option>
                    <option value="Sat-6:45am">Sat-6:45am</option>
                    <option value="Sun-8am">Sun-8am</option>
                  </select>
                </div>
              </div>

              <div className="billing-section">
                <div className="billing-title">BILLING</div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label>FEE TYPE</label>
                    <select 
                      className="filter-select full-width"
                      value={feeType}
                      onChange={(e) => setFeeType(e.target.value)}
                    >
                      <option value="monthly">Monthly fee</option>
                      <option value="course">Course fee (installments)</option>
                    </select>
                  </div>
                  
                  {feeType === 'monthly' ? (
                    <div className="form-group half">
                      <label>MONTHLY FEE</label>
                      <input type="text" className="form-control" placeholder="৳" value={newStudent.feeAmount} onChange={(e) => setNewStudent({...newStudent, feeAmount: e.target.value})} />
                    </div>
                  ) : (
                    <div className="form-group half">
                      <label>TOTAL COURSE FEE (৳)</label>
                      <input type="text" className="form-control" placeholder="e.g. 12000" value={newStudent.feeAmount} onChange={(e) => setNewStudent({...newStudent, feeAmount: e.target.value})} />
                    </div>
                  )}
                </div>

                {feeType === 'monthly' ? (
                  <div className="form-row">
                    <div className="form-group half">
                      <label>ADMISSION FEE (1st Month)</label>
                      <input type="text" className="form-control" placeholder="e.g. 500" value={newStudent.admissionFee} onChange={(e) => setNewStudent({...newStudent, admissionFee: e.target.value})} />
                    </div>
                    <div className="form-group half">
                      <label>DISCOUNT</label>
                      <input type="text" className="form-control" placeholder="0" value={newStudent.discount} onChange={(e) => setNewStudent({...newStudent, discount: e.target.value})} />
                    </div>
                  </div>
                ) : (
                  <div className="form-row">
                    <div className="form-group half">
                      <label>INSTALLMENTS</label>
                      <input type="text" placeholder="3" value={newStudent.installments} onChange={(e) => setNewStudent({...newStudent, installments: e.target.value})} />
                    </div>
                    <div className="form-group half">
                      <label>DISCOUNT</label>
                      <input type="text" placeholder="0" value={newStudent.discount} onChange={(e) => setNewStudent({...newStudent, discount: e.target.value})} />
                    </div>
                  </div>
                )}

              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSaveStudent}>সেভ</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default Students;
