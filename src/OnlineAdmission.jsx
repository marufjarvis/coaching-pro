import React, { useState, useEffect } from 'react';
import { UserCheck, CheckCircle2, XCircle, Search, X } from 'lucide-react';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './online-admission.css';

function OnlineAdmission({ lang: propLang }) {
  const { t } = useTranslation(propLang);
  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [pendingAdmissions, setPendingAdmissions] = useState(() => {
    const saved = localStorage.getItem('pendingAdmissions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
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

  useEffect(() => {
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
    const nextId = dataStore.getNextStudentId();
    setEditForm({
      idNumber: nextId,
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
    
    // Add student to dataStore
    dataStore.addStudent({
      id: editForm.idNumber.trim(),
      name: editForm.name.trim(),
      batch: editForm.batch || (batches.length > 0 ? batches[0].name : 'Unassigned'),
      status: 'Active',
      phone: editForm.phone.trim(),
      guardianPhone: editForm.guardianPhone.trim(),
      feeType: editForm.feeType,
      feeAmount: Number(editForm.feeAmount) || 0,
      admissionFee: editForm.feeType === 'monthly' ? (Number(editForm.admissionFee) || 0) : null,
      discount: Number(editForm.discount) || 0,
      installments: editForm.feeType === 'course' ? (Number(editForm.installments) || 1) : null,
      paidAmount: 0
    });

    // Remove from pending admissions list & sync with MySQL
    dataStore.deletePendingAdmission(selectedApp.id);
    const updatedPending = pendingAdmissions.filter(app => app.id !== selectedApp.id);
    setPendingAdmissions(updatedPending);

    setSelectedApp(null);
  };

  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to reject this admission?")) {
      dataStore.deletePendingAdmission(id);
      const updated = pendingAdmissions.filter(app => app.id !== id);
      setPendingAdmissions(updated);
    }
  };

  return (
    <div className="online-admission-container">
      <div className="page-header">
        <div>
          <div className="fee-followup-tag" style={{ color: '#f59e0b', backgroundColor: '#fef3c7' }}>
            <UserCheck size={14} /> {t.onlineAdmissionTag}
          </div>
          <h1 className="page-title">{t.onlineAdmissionTitle}</h1>
          <p className="page-desc">{t.onlineAdmissionSubtitle}</p>
        </div>
      </div>

      <div className="balances-section">
        <div className="balances-header">
          <div>
            <h2>{t.pendingApplicationsTitle}</h2>
            <p>{pendingAdmissions.length} {t.studentsDueNotice}</p>
          </div>

          <div className="admission-header-actions">
            <div className="filter-select-wrapper">
              <select 
                className="admission-filter-select"
                value={selectedBatchFilter}
                onChange={(e) => setSelectedBatchFilter(e.target.value)}
              >
                <option value="All">{t.allBatchesFilter}</option>
                {batches.map(b => (
                  <option key={b.id || b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="admission-search-box">
              <Search size={18} className="admission-search-icon" />
              <input 
                type="text" 
                placeholder={t.searchStudentsPlaceholder} 
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
                <th>{t.thId}</th>
                <th>{t.thStudentName}</th>
                <th>{t.preferredBatchLabel}</th>
                <th>{t.applicationDateLabel}</th>
                <th>{t.thActions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmissions.length > 0 ? (
                filteredAdmissions.map((app) => (
                  <tr key={app.id}>
                    <td><strong>{app.id}</strong></td>
                    <td>
                      <strong>{app.name}</strong><br/>
                      <span className="text-muted">{app.phone}{app.guardianPhone ? ` • ${t.guardianPhoneLabel}: ${app.guardianPhone}` : ''}</span>
                    </td>
                    <td>{app.preferredBatch}</td>
                    <td>{app.date}</td>
                    <td>
                      <button 
                        className="btn-primary" 
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem', marginRight: '0.5rem' }}
                        onClick={() => handleOpenApproveModal(app)}
                      >
                        <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> {t.btnApprove}
                      </button>
                      <button 
                        className="btn-cancel" 
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
                        onClick={() => handleReject(app.id)}
                      >
                        {t.btnRejectApplication}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    <UserCheck size={24} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
                    <p>{t.noPendingApplications}</p>
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
                <h2>{t.approveAdmissionModalTitle}</h2>
                <p>{t.approveAdmissionModalDesc}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setSelectedApp(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>{t.studentIdLabel} <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder={t.studentIdPlaceholder} 
                  value={editForm.idNumber} 
                  onChange={(e) => setEditForm({...editForm, idNumber: e.target.value})} 
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>{t.studentNameLabel}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder={t.studentNamePlaceholder} 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                  />
                </div>
                <div className="form-group half">
                  <label>{t.phoneMobileLabel}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder={t.phonePlaceholder} 
                    value={editForm.phone} 
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})} 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>{t.guardianPhoneLabel}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder={t.phonePlaceholder} 
                    value={editForm.guardianPhone} 
                    onChange={(e) => setEditForm({...editForm, guardianPhone: e.target.value})} 
                  />
                </div>
                <div className="form-group half">
                  <label>{t.batchSelectLabel}</label>
                  <select 
                    className="filter-select full-width" 
                    value={editForm.batch} 
                    onChange={(e) => setEditForm({...editForm, batch: e.target.value})}
                  >
                    <option value="">{t.selectBatchPlaceholder}</option>
                    {batches.map(b => (
                      <option key={b.id || b.name} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="billing-section" style={{ marginTop: '1.5rem' }}>
                <div className="billing-title">{t.billingSettingsTitle}</div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label>{t.billingFeeTypeLabel}</label>
                    <select 
                      className="filter-select full-width"
                      value={editForm.feeType}
                      onChange={(e) => setEditForm({...editForm, feeType: e.target.value})}
                    >
                      <option value="monthly">{t.monthlyFeeOptionText}</option>
                      <option value="course">{t.courseFeeOptionText}</option>
                    </select>
                  </div>
                  
                  <div className="form-group half">
                    <label>{editForm.feeType === 'monthly' ? t.monthlyFeeLabel : t.totalCourseFeeLabel} <span className="text-danger">*</span></label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="e.g. 500" 
                      value={editForm.feeAmount} 
                      onChange={(e) => setEditForm({...editForm, feeAmount: e.target.value})} 
                      required
                    />
                  </div>
                </div>

                {editForm.feeType === 'monthly' ? (
                  <div className="form-row">
                    <div className="form-group half">
                      <label>{t.admissionFeeLabel}</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="e.g. 200" 
                        value={editForm.admissionFee} 
                        onChange={(e) => setEditForm({...editForm, admissionFee: e.target.value})} 
                      />
                    </div>
                    <div className="form-group half">
                      <label>{t.discountLabel}</label>
                      <input 
                        type="number" 
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
                      <label>{t.installmentsLabel}</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="3" 
                        value={editForm.installments} 
                        onChange={(e) => setEditForm({...editForm, installments: e.target.value})} 
                      />
                    </div>
                    <div className="form-group half">
                      <label>{t.discountLabel}</label>
                      <input 
                        type="number" 
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
              <button className="btn-cancel" onClick={() => setSelectedApp(null)}>{t.cancel}</button>
              <button className="btn-primary" onClick={handleApprove}>{t.btnApproveAndEnroll}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnlineAdmission;
