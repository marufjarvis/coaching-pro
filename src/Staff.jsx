import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, X, Trash2 } from 'lucide-react';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './staff.css';

function Staff({ lang: propLang }) {
  const { t } = useTranslation(propLang);
  const [staffList, setStaffList] = useState(() => dataStore.getStaff());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', phone: '', role: 'Manager' });

  useEffect(() => {
    const handleSync = () => {
      setStaffList(dataStore.getStaff());
    };
    window.addEventListener('coaching-data-change', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('coaching-data-change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleAddStaff = () => {
    if (!newStaff.name.trim() || !newStaff.phone.trim()) {
      alert("Please enter Name and Mobile number.");
      return;
    }
    dataStore.addStaff(newStaff);
    setIsAddModalOpen(false);
    setNewStaff({ name: '', phone: '', role: 'Manager' });
  };

  const handleDelete = (id) => {
    if (window.confirm(t.confirmDeleteStaff)) {
      dataStore.deleteStaff(id);
    }
  };

  return (
    <div className="staff-container">
      <div className="page-header">
        <div>
          <div className="fee-followup-tag">
            <Shield size={14} /> {t.userManagementTag}
          </div>
          <h1>{t.staffTitle}</h1>
          <p className="subtitle">{t.staffSubtitle}</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <UserPlus size={16} style={{ marginRight: '4px' }} /> {t.addStaffBtn}
          </button>
        </div>
      </div>

      <div className="balances-section">
        <div className="balances-header">
          <div>
            <h2>{t.staffDirectorySectionTitle}</h2>
            <p>{staffList.length} {t.activeTeamMembers}</p>
          </div>
        </div>

        <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t.staffNameLabel}</th>
              <th>{t.mobileNumberLabel}</th>
              <th>{t.roleLabel}</th>
              <th>{t.thStatus}</th>
              <th style={{ textAlign: 'right' }}>{t.thActions}</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id}>
                <td><strong>{staff.name}</strong></td>
                <td>{staff.phone}</td>
                <td>
                  <span className={`role-badge ${staff.role.toLowerCase()}`}>
                    {staff.role === 'Admin' ? t.roleAdmin : staff.role === 'Teacher' ? t.roleTeacher : t.roleManager}
                  </span>
                </td>
                <td>
                  <span className="status-badge active"><span className="status-dot"></span>{t.active}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn-icon text-danger" onClick={() => handleDelete(staff.id)} title={t.delete}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2>{t.addStaffModalTitle}</h2>
                <p>{t.addStaffModalDesc}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{t.staffNameLabel} <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Shakil Ahmed"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                  autoFocus
                />
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>{t.mobileNumberLabel} <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="01XXXXXXXXX"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                  />
                </div>
                <div className="form-group half">
                  <label>{t.roleLabel}</label>
                  <select 
                    className="form-control"
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                  >
                    <option value="Admin">{t.roleAdmin}</option>
                    <option value="Manager">{t.roleManager}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>{t.cancel}</button>
              <button className="btn-primary" onClick={handleAddStaff}>{t.save}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staff;
