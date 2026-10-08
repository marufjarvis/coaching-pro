import React, { useState } from 'react';
import { UserCheck, CheckCircle2, XCircle, Search, X } from 'lucide-react';
import './online-admission.css';

function OnlineAdmission() {
  const [pendingAdmissions, setPendingAdmissions] = useState(() => {
    const saved = localStorage.getItem('pendingAdmissions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Remove legacy dummy school field if present in cache
          return parsed.map(({ school, ...rest }) => rest);
        }
      } catch (e) {}
    }
    return [
      {
        id: 'APP-1001',
        name: 'Nayeem Hasan',
        phone: '01711112222',
        guardianPhone: '01711998877',
        preferredBatch: 'Sat-6:45am',
        date: '10/10/2026'
      },
      {
        id: 'APP-1002',
        name: 'Fatima Akter',
        phone: '01822223333',
        guardianPhone: '01822554433',
        preferredBatch: 'Sun-8am',
        date: '11/10/2026'
      }
    ];
  });

  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [editForm, setEditForm] = useState({
    idNumber: '',
    name: '',
    phone: '',
    guardianPhone: '',
    batch: '',
    feeType: 'monthly',
    feeAmount: '',
    admissionFee: '',
    discount: '0',
    installments: '3'
  });

  React.useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('pendingAdmissions');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setPendingAdmissions(parsed.map(({ school, ...rest }) => rest));
          }
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredAdmissions = pendingAdmissions.filter(app => {
    const matchesBatch = selectedBatchFilter === 'All' || app.preferredBatch === selectedBatchFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
                          app.name.toLowerCase().includes(q) || 
                          app.phone.includes(q) ||
                          (app.guardianPhone && app.guardianPhone.includes(q)) ||
                          (app.id && app.id.toLowerCase().includes(q));
    return matchesBatch && matchesSearch;
  });

  const handleOpenApproveModal = (app) => {
    setSelectedApp(app);
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    setEditForm({
      idNumber: `STU-${randomNum}`,
      name: app.name || '',
      phone: app.phone || '',
      guardianPhone: app.guardianPhone || '',
      batch: app.preferredBatch || '',
      feeType: 'monthly',
      feeAmount: '',
      admissionFee: '',
      discount: '0',
      installments: '3'
    });
  };

  const handleApprove = () => {
    if (!editForm.idNumber.trim() || !editForm.name.trim()) {
      alert("Student ID and Name are required.");
      return;
    }
    if (!editForm.feeAmount) {
      alert("Fee amount is required.");
      return;
    }
    
    // Save student to coachingStudents in localStorage
    let currentStudents = [];
    const saved = localStorage.getItem('coachingStudents');
    if (saved) {
      try { currentStudents = JSON.parse(saved); } catch (e) {}
    } else {
      currentStudents = [
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
    }

    const initials = editForm.name.trim().substring(0, 2).toUpperCase() || 'ST';
    const newStudentObj = {
      id: editForm.idNumber.trim(),
      name: editForm.name.trim(),
      initials: initials,
      batch: editForm.batch || 'Unassigned',
      status: 'Active',
      phone: editForm.phone.trim(),
      guardianPhone: editForm.guardianPhone.trim(),
      feeType: editForm.feeType,
      feeAmount: editForm.feeAmount,
      admissionFee: editForm.feeType === 'monthly' ? editForm.admissionFee : null,
      discount: editForm.discount,
      installments: editForm.feeType === 'course' ? editForm.installments : null,
      paidAmount: 0,
      billingDate: editForm.feeType === 'monthly' ? '1st of every month' : null,
      nextInstallmentDate: editForm.feeType === 'course' ? '01/11/2026' : null,
      admissionDate: new Date().toLocaleDateString('en-GB')
    };

    const updatedStudents = [...currentStudents, newStudentObj];
    localStorage.setItem('coachingStudents', JSON.stringify(updatedStudents));

    // Remove from pending admissions list
    const updatedPending = pendingAdmissions.filter(app => app.id !== selectedApp.id);
    setPendingAdmissions(updatedPending);
    localStorage.setItem('pendingAdmissions', JSON.stringify(updatedPending));

    // Dispatch event to sync other components
    window.dispatchEvent(new Event('storage'));

    setSelectedApp(null);
  };

  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to reject this admission?")) {
      const updated = pendingAdmissions.filter(app => app.id !== id);
      setPendingAdmissions(updated);
      localStorage.setItem('pendingAdmissions', JSON.stringify(updated));
    }
  };

  return (
    <div className="online-admission-container">
      <div className="page-header">
        <div>
          <div className="fee-followup-tag" style={{ color: '#f59e0b', backgroundColor: '#fef3c7' }}>
            <UserCheck size={14} /> PENDING REVIEW
          </div>
          <h1 className="page-title">Online Admission</h1>
          <p className="page-desc">Review and approve student registrations from enrollment links.</p>
        </div>
      </div>

      <div className="balances-section">
        <div className="balances-header">
          <div>
            <h2>Pending Applications</h2>
            <p>{pendingAdmissions.length} students waiting for approval</p>
          </div>

          <div className="admission-header-actions">
            <div className="filter-select-wrapper">
              <select 
                className="admission-filter-select"
                value={selectedBatchFilter}
                onChange={(e) => setSelectedBatchFilter(e.target.value)}
              >
                <option value="All">All Batches</option>
                <option value="Sat-6:45am">Sat-6:45am</option>
                <option value="Sun-8am">Sun-8am</option>
                <option value="Mon-4:00pm">Mon-4:00pm</option>
              </select>
            </div>

            <div className="admission-search-box">
              <Search size={18} className="admission-search-icon" />
              <input 
                type="text" 
                placeholder="Search applications..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="admission-search-clear"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>APPLICATION ID</th>
                <th>STUDENT INFO</th>
                <th>PREFERRED BATCH</th>
                <th>SUBMISSION DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmissions.length > 0 ? (
                filteredAdmissions.map((app) => (
                  <tr key={app.id}>
                    <td><strong>{app.id}</strong></td>
                    <td>
                      <strong>{app.name}</strong><br/>
                      <span className="text-muted">{app.phone}{app.guardianPhone ? ` • Guardian: ${app.guardianPhone}` : ''}</span>
                    </td>
                    <td>{app.preferredBatch}</td>
                    <td>{app.date}</td>
                    <td>
                      <button 
                        className="btn-primary" 
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem', marginRight: '0.5rem' }}
                        onClick={() => handleOpenApproveModal(app)}
                      >
                        <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> Approve
                      </button>
                      <button 
                        className="btn-cancel" 
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
                        onClick={() => handleReject(app.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    <UserCheck size={24} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
                    <p>No pending applications at the moment.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApp && (
        <div className="modal-overlay">
          <div className="modal-content student-modal">
            <div className="modal-header">
              <div>
                <h2>শিক্ষার্থী যোগ</h2>
                <p>Create a profile with monthly or course/installment billing.</p>
              </div>
              <button className="btn-close-modal" onClick={() => setSelectedApp(null)}>
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
                  value={editForm.idNumber} 
                  onChange={(e) => setEditForm({...editForm, idNumber: e.target.value})} 
                  required
                />
                <small className="text-muted" style={{display: 'block', marginTop: '4px'}}>
                  Required. This will be the student's unique verification ID.
                </small>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>নাম</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Student full name" 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                  />
                </div>
                <div className="form-group half">
                  <label>ফোন</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="01XXXXXXXXX" 
                    value={editForm.phone} 
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})} 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>GUARDIAN PHONE</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Optional" 
                    value={editForm.guardianPhone} 
                    onChange={(e) => setEditForm({...editForm, guardianPhone: e.target.value})} 
                  />
                </div>
                <div className="form-group half">
                  <label>ব্যাচ</label>
                  <select 
                    className="filter-select full-width" 
                    value={editForm.batch} 
                    onChange={(e) => setEditForm({...editForm, batch: e.target.value})}
                  >
                    <option value="">Optional</option>
                    <option value="Sat-6:45am">Sat-6:45am</option>
                    <option value="Sat-7:45am">Sat-7:45am</option>
                    <option value="Sat-9am">Sat-9am</option>
                    <option value="Sat-10am">Sat-10am</option>
                    <option value="Sat-2pm">Sat-2pm</option>
                    <option value="Sat-3pm">Sat-3pm</option>
                    <option value="Sat-4pm">Sat-4pm</option>
                    <option value="Sat-5pm">Sat-5pm</option>
                    <option value="Sun-6:45am">Sun-6:45am</option>
                    <option value="Sun-8am">Sun-8am</option>
                    <option value="Sun-9am">Sun-9am</option>
                    <option value="Sun-10am">Sun-10am</option>
                    <option value="Mon-4:00pm">Mon-4:00pm</option>
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
                      value={editForm.feeType}
                      onChange={(e) => setEditForm({...editForm, feeType: e.target.value})}
                    >
                      <option value="monthly">Monthly fee</option>
                      <option value="course">Course fee (installments)</option>
                    </select>
                  </div>
                  
                  {editForm.feeType === 'monthly' ? (
                    <div className="form-group half">
                      <label>MONTHLY FEE</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="৳" 
                        value={editForm.feeAmount} 
                        onChange={(e) => setEditForm({...editForm, feeAmount: e.target.value})} 
                      />
                    </div>
                  ) : (
                    <div className="form-group half">
                      <label>TOTAL COURSE FEE (৳)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. 12000" 
                        value={editForm.feeAmount} 
                        onChange={(e) => setEditForm({...editForm, feeAmount: e.target.value})} 
                      />
                    </div>
                  )}
                </div>

                {editForm.feeType === 'monthly' ? (
                  <div className="form-row">
                    <div className="form-group half">
                      <label>ADMISSION FEE (1ST MONTH)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. 500" 
                        value={editForm.admissionFee} 
                        onChange={(e) => setEditForm({...editForm, admissionFee: e.target.value})} 
                      />
                    </div>
                    <div className="form-group half">
                      <label>DISCOUNT</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="0" 
                        value={editForm.discount} 
                        onChange={(e) => setEditForm({...editForm, discount: e.target.value})} 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="form-row">
                    <div className="form-group half">
                      <label>INSTALLMENTS</label>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="3" 
                        value={editForm.installments} 
                        onChange={(e) => setEditForm({...editForm, installments: e.target.value})} 
                      />
                    </div>
                    <div className="form-group half">
                      <label>DISCOUNT</label>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="0" 
                        value={editForm.discount} 
                        onChange={(e) => setEditForm({...editForm, discount: e.target.value})} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setSelectedApp(null)}>Cancel</button>
              <button className="btn-save" onClick={handleApprove}>সেভ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnlineAdmission;
