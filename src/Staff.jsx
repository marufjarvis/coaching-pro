import React, { useState } from 'react';
import { UserPlus, Shield, X, Edit3, Trash2 } from 'lucide-react';
import './staff.css';

function Staff() {
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Maruf Hossain', phone: '01700000001', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Sakib Ahmed', phone: '01800000002', role: 'Manager', status: 'Active' }
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', phone: '', role: 'Manager' });

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.phone) return;
    const newEntry = {
      id: Date.now(),
      name: newStaff.name,
      phone: newStaff.phone,
      role: newStaff.role,
      status: 'Active'
    };
    setStaffList([newEntry, ...staffList]);
    setIsAddModalOpen(false);
    setNewStaff({ name: '', phone: '', role: 'Manager' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      setStaffList(staffList.filter(s => s.id !== id));
    }
  };

  return (
    <div className="staff-container">
      <div className="page-header">
        <div>
          <div className="fee-followup-tag">
            <Shield size={14} /> USER MANAGEMENT
          </div>
          <h1>Staff & Roles</h1>
          <p className="subtitle">Manage admin and manager access for your workspace.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <UserPlus size={16} style={{ marginRight: '4px' }} /> Add Staff
          </button>
        </div>
      </div>

      <div className="balances-section">
        <div className="balances-header">
          <div>
            <h2>Staff Directory</h2>
            <p>{staffList.length} active team members</p>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>MOBILE NUMBER</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id}>
                <td><strong>{staff.name}</strong></td>
                <td>{staff.phone}</td>
                <td>
                  <span className={`role-badge ${staff.role.toLowerCase()}`}>
                    {staff.role}
                  </span>
                </td>
                <td>
                  <span className="status-badge active"><span className="status-dot"></span>{staff.status}</span>
                </td>
                <td>
                  <button className="btn-icon"><Edit3 size={16} /></button>
                  <button className="btn-icon text-danger" onClick={() => handleDelete(staff.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2>Add Staff Member</h2>
                <p>Assign admin or manager roles.</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. John Doe"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. 017..."
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select 
                    className="form-control"
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
              </div>
              <div className="role-description">
                {newStaff.role === 'Admin' ? (
                  <p className="text-muted"><Shield size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}/> <strong>Admin:</strong> Has full access to delete data, view reports, and manage all settings.</p>
                ) : (
                  <p className="text-muted"><UserPlus size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}/> <strong>Manager:</strong> Can add students, collect payments, and manage daily operations.</p>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddStaff}>Add Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staff;
