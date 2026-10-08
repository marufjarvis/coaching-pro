import React, { useState, useEffect } from 'react';
import { Users, Link, Plus, Search, ChevronLeft, ChevronRight, X, Edit, Trash2 } from 'lucide-react';
import StudentProfile from './StudentProfile';
import { dataStore } from './dataStore';
import './students.css';

function Students({ setActiveTab: setParentTab }) {
  const [activeTab, setActiveTab] = useState('All students');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [feeType, setFeeType] = useState('monthly');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('All batches');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All status');

  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [students, setStudents] = useState(() => dataStore.getStudents());
  const [pendingStudents, setPendingStudents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pendingAdmissions') || '[]');
    } catch (e) {
      return [];
    }
  });

  const [studentForm, setStudentForm] = useState({
    idNumber: '',
    name: '',
    phone: '',
    guardianPhone: '',
    batch: '',
    feeAmount: '500',
    admissionFee: '200',
    discount: '0',
    installments: '1',
    status: 'Active'
  });

  useEffect(() => {
    const handleSync = () => {
      setBatches(dataStore.getBatches());
      setStudents(dataStore.getStudents());
      try {
        setPendingStudents(JSON.parse(localStorage.getItem('pendingAdmissions') || '[]'));
      } catch (e) {}
    };
    window.addEventListener('coaching-data-change', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('coaching-data-change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    const randId = `STU-${Math.floor(10000 + Math.random() * 90000)}`;
    setStudentForm({
      idNumber: randId,
      name: '',
      phone: '',
      guardianPhone: '',
      batch: batches.length > 0 ? batches[0].name : '',
      feeAmount: '500',
      admissionFee: '200',
      discount: '0',
      installments: '1',
      status: 'Active'
    });
    setFeeType('monthly');
    setIsAddModalOpen(true);
  };

  const openEditModal = (stu) => {
    setIsEditMode(true);
    setStudentForm({
      idNumber: stu.id,
      name: stu.name,
      phone: stu.phone || '',
      guardianPhone: stu.guardianPhone || '',
      batch: stu.batch || '',
      feeAmount: stu.feeAmount || '500',
      admissionFee: stu.admissionFee || '0',
      discount: stu.discount || '0',
      installments: stu.installments || '1',
      status: stu.status || 'Active'
    });
    setFeeType(stu.feeType || 'monthly');
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = () => {
    if (!studentForm.idNumber.trim() || !studentForm.name.trim()) {
      alert("Student ID and Name are required.");
      return;
    }

    if (isEditMode) {
      dataStore.updateStudent(studentForm.idNumber, {
        name: studentForm.name.trim(),
        phone: studentForm.phone.trim(),
        guardianPhone: studentForm.guardianPhone.trim(),
        batch: studentForm.batch || 'Unassigned',
        feeType: feeType,
        feeAmount: Number(studentForm.feeAmount) || 0,
        admissionFee: Number(studentForm.admissionFee) || 0,
        discount: Number(studentForm.discount) || 0,
        installments: Number(studentForm.installments) || 1,
        status: studentForm.status
      });
      if (selectedStudent && selectedStudent.id === studentForm.idNumber) {
        setSelectedStudent({
          ...selectedStudent,
          name: studentForm.name.trim(),
          phone: studentForm.phone.trim(),
          guardianPhone: studentForm.guardianPhone.trim(),
          batch: studentForm.batch || 'Unassigned',
          feeType: feeType,
          feeAmount: Number(studentForm.feeAmount) || 0,
          status: studentForm.status
        });
      }
    } else {
      dataStore.addStudent({
        id: studentForm.idNumber.trim(),
        name: studentForm.name.trim(),
        phone: studentForm.phone.trim(),
        guardianPhone: studentForm.guardianPhone.trim(),
        batch: studentForm.batch || (batches.length > 0 ? batches[0].name : 'Unassigned'),
        feeType: feeType,
        feeAmount: Number(studentForm.feeAmount) || 0,
        admissionFee: Number(studentForm.admissionFee) || 0,
        discount: Number(studentForm.discount) || 0,
        installments: Number(studentForm.installments) || 1,
        status: studentForm.status || 'Active'
      });

      // If it was a pending admission being approved
      if (studentForm.isPending) {
        const updated = pendingStudents.filter(p => p.id !== studentForm.pendingId);
        localStorage.setItem('pendingAdmissions', JSON.stringify(updated));
        setPendingStudents(updated);
      }
    }

    setIsAddModalOpen(false);
  };

  // Filter students
  const filteredStudents = (activeTab === 'Pending Approvals' ? pendingStudents : students).filter(student => {
    // Search query
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      student.name.toLowerCase().includes(q) || 
      student.id.toLowerCase().includes(q) || 
      (student.phone && student.phone.includes(q));

    // Tab filter
    let matchesTab = true;
    if (activeTab === 'Active') matchesTab = student.status === 'Active';
    else if (activeTab === 'Inactive') matchesTab = student.status === 'Inactive';

    // Batch filter
    const matchesBatch = selectedBatchFilter === 'All batches' || 
      student.batch === selectedBatchFilter || 
      student.preferredBatch === selectedBatchFilter;

    // Status filter
    const matchesStatus = selectedStatusFilter === 'All status' || 
      student.status === selectedStatusFilter;

    return matchesSearch && matchesTab && matchesBatch && matchesStatus;
  });

  const courseStudentsCount = students.filter(s => s.feeType === 'course').length;
  const monthlyStudentsCount = students.filter(s => s.feeType === 'monthly').length;

  return (
    <>
      {selectedStudent ? (
        <StudentProfile 
          student={selectedStudent} 
          onBack={() => setSelectedStudent(null)}
          onEdit={() => openEditModal(selectedStudent)}
        />
      ) : (
        <div className="students-page">
          <div className="page-header">
            <div>
              <div className="page-subtitle"><Users size={16} /> STUDENT DIRECTORY</div>
              <h1 className="page-title">শিক্ষার্থী</h1>
              <p className="page-desc">Manage students, batches, and enrollments.</p>
            </div>
            <div className="header-actions">
              {setParentTab && (
                <button className="btn-secondary" onClick={() => setParentTab('enrollment')}>
                  <Link size={16} /> Enrollment links
                </button>
              )}
              <button className="btn-primary" onClick={openAddModal}>
                <Plus size={18} /> Add student
              </button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-label">কোর্স সিস্টেম</div>
                <div className="stat-value blue-text">{courseStudentsCount}</div>
                <div className="stat-desc">Course based students</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-label">বেতন সিস্টেম</div>
                <div className="stat-value">{monthlyStudentsCount}</div>
                <div className="stat-desc">Monthly fee students</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-label">মোট শিক্ষার্থী</div>
                <div className="stat-value">{students.length}</div>
                <div className="stat-desc">Total active & registered</div>
              </div>
            </div>
          </div>

          <div className="directory-section">
            <h2 className="section-title">Student directory</h2>
            <p className="section-desc">Search by name or ID, then filter by batch or status.</p>

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
                  <input 
                    type="text" 
                    placeholder="Search by name, ID or phone..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  className="filter-select"
                  value={selectedBatchFilter}
                  onChange={(e) => setSelectedBatchFilter(e.target.value)}
                >
                  <option value="All batches">All batches</option>
                  {batches.map(b => (
                    <option key={b.id || b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <select 
                  className="filter-select"
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                >
                  <option value="All status">All status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="table-responsive">
                <table className="student-table">
                  <thead>
                    <tr>
                      <th>STUDENT NAME</th>
                      <th>STUDENT ID</th>
                      <th>BATCH</th>
                      <th>PHONE</th>
                      <th>STATUS</th>
                      <th style={{ textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, idx) => (
                        <tr key={student.id || idx}>
                          <td>
                            <div className="student-name-cell">
                              <div className="student-avatar">{student.initials || student.name.substring(0,2).toUpperCase()}</div>
                              <div>
                                <span className="student-name">{student.name}</span>
                                {student.feeType && (
                                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>
                                    {student.feeType === 'monthly' ? `৳ ${student.feeAmount}/mo` : `৳ ${student.feeAmount} (Course)`}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td><strong>{student.id}</strong></td>
                          <td>{student.batch || student.preferredBatch || 'Unassigned'}</td>
                          <td>{student.phone || '—'}</td>
                          <td>
                            {activeTab === 'Pending Approvals' ? (
                              <span className="status-badge" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                                <span className="status-dot" style={{ backgroundColor: '#d97706' }}></span>
                                Pending
                              </span>
                            ) : (
                              <span className={`status-badge ${(student.status || 'Active').toLowerCase()}`}>
                                <span className="status-dot"></span>
                                {student.status || 'Active'}
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {activeTab === 'Pending Approvals' ? (
                              <button 
                                className="btn-primary" 
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                onClick={() => {
                                  setIsEditMode(false);
                                  setStudentForm({
                                    idNumber: `STU-${Math.floor(10000 + Math.random() * 90000)}`,
                                    name: student.name,
                                    phone: student.phone || '',
                                    guardianPhone: student.guardianPhone || '',
                                    batch: student.preferredBatch || (batches.length > 0 ? batches[0].name : ''),
                                    feeAmount: '500',
                                    admissionFee: '200',
                                    discount: '0',
                                    installments: '1',
                                    status: 'Active',
                                    isPending: true,
                                    pendingId: student.id
                                  });
                                  setIsAddModalOpen(true);
                                }}
                              >
                                Approve
                              </button>
                            ) : (
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <button className="btn-secondary" onClick={() => setSelectedStudent(student)}>
                                  Profile
                                </button>
                                <button className="btn-icon" onClick={() => openEditModal(student)} title="Edit">
                                  <Edit size={15} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                          No students found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="table-pagination">
                <span>Showing {filteredStudents.length} of {students.length} students</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content student-modal">
            <div className="modal-header">
              <div>
                <h2>{isEditMode ? 'শিক্ষার্থী তথ্য আপডেট' : 'শিক্ষার্থী যোগ'}</h2>
                <p>Configure student personal details and billing fee structure.</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>STUDENT ID <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. STU-101" 
                  value={studentForm.idNumber} 
                  onChange={(e) => setStudentForm({...studentForm, idNumber: e.target.value})} 
                  disabled={isEditMode}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>নাম (Student Name) <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Full Name" 
                    value={studentForm.name} 
                    onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} 
                  />
                </div>
                <div className="form-group half">
                  <label>ফোন নম্বর (Mobile)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="01XXXXXXXXX" 
                    value={studentForm.phone} 
                    onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})} 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>GUARDIAN PHONE</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="01XXXXXXXXX" 
                    value={studentForm.guardianPhone} 
                    onChange={(e) => setStudentForm({...studentForm, guardianPhone: e.target.value})} 
                  />
                </div>
                <div className="form-group half">
                  <label>ব্যাচ (Batch)</label>
                  <select 
                    className="form-control" 
                    value={studentForm.batch} 
                    onChange={(e) => setStudentForm({...studentForm, batch: e.target.value})}
                  >
                    <option value="">Select Batch</option>
                    {batches.map(b => (
                      <option key={b.id || b.name} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {isEditMode && (
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>STATUS</label>
                  <select 
                    className="form-control" 
                    value={studentForm.status} 
                    onChange={(e) => setStudentForm({...studentForm, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              )}

              <div className="billing-section">
                <div className="billing-title">BILLING SETTINGS</div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label>FEE TYPE</label>
                    <select 
                      className="form-control"
                      value={feeType}
                      onChange={(e) => setFeeType(e.target.value)}
                    >
                      <option value="monthly">Monthly fee (মাসিক বেতন)</option>
                      <option value="course">Course fee (কোর্স ফি)</option>
                    </select>
                  </div>
                  
                  <div className="form-group half">
                    <label>{feeType === 'monthly' ? 'MONTHLY FEE (৳)' : 'TOTAL COURSE FEE (৳)'}</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="e.g. 500" 
                      value={studentForm.feeAmount} 
                      onChange={(e) => setStudentForm({...studentForm, feeAmount: e.target.value})} 
                    />
                  </div>
                </div>

                {feeType === 'monthly' ? (
                  <div className="form-row">
                    <div className="form-group half">
                      <label>ADMISSION FEE (৳)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="e.g. 200" 
                        value={studentForm.admissionFee} 
                        onChange={(e) => setStudentForm({...studentForm, admissionFee: e.target.value})} 
                      />
                    </div>
                    <div className="form-group half">
                      <label>DISCOUNT (৳)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="0" 
                        value={studentForm.discount} 
                        onChange={(e) => setStudentForm({...studentForm, discount: e.target.value})} 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="form-row">
                    <div className="form-group half">
                      <label>INSTALLMENTS (কিস্তি সংখ্যা)</label>
                      <input 
                        type="number" 
                        className="form-control"
                        placeholder="2" 
                        value={studentForm.installments} 
                        onChange={(e) => setStudentForm({...studentForm, installments: e.target.value})} 
                      />
                    </div>
                    <div className="form-group half">
                      <label>DISCOUNT (৳)</label>
                      <input 
                        type="number" 
                        className="form-control"
                        placeholder="0" 
                        value={studentForm.discount} 
                        onChange={(e) => setStudentForm({...studentForm, discount: e.target.value})} 
                      />
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
