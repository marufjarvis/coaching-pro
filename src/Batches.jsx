import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Layers, Users, Wallet, MoreVertical, X, Pencil, Trash2, Clock } from 'lucide-react';
import { dataStore } from './dataStore';
import './batches.css';

function Batches() {
  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [students, setStudents] = useState(() => dataStore.getStudents());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBatch, setNewBatch] = useState({ name: '', monthlyFee: '500', schedule: '' });

  const [openDropdown, setOpenDropdown] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);

  useEffect(() => {
    const handleSync = () => {
      setBatches(dataStore.getBatches());
      setStudents(dataStore.getStudents());
    };
    window.addEventListener('coaching-data-change', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('coaching-data-change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleAddBatch = () => {
    if (!newBatch.name.trim()) return;
    dataStore.addBatch({
      name: newBatch.name.trim(),
      monthlyFee: newBatch.monthlyFee || 500,
      schedule: newBatch.schedule.trim() || 'Regular Schedule'
    });
    setNewBatch({ name: '', monthlyFee: '500', schedule: '' });
    setIsAddModalOpen(false);
  };

  const handleDeleteBatch = (batch) => {
    const enrolledCount = students.filter(s => s.batch === batch.name).length;
    const msg = enrolledCount > 0 
      ? `This batch has ${enrolledCount} active students. Are you sure you want to delete ${batch.name}?`
      : `Are you sure you want to delete ${batch.name}?`;
    if (window.confirm(msg)) {
      dataStore.deleteBatch(batch.id || batch.name);
    }
  };

  const handleEditClick = (batch) => {
    setEditingBatch({ ...batch });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingBatch || !editingBatch.name.trim()) return;
    dataStore.updateBatch(editingBatch.id || editingBatch.name, {
      name: editingBatch.name.trim(),
      monthlyFee: Number(editingBatch.monthlyFee) || 500,
      schedule: editingBatch.schedule
    });
    setIsEditModalOpen(false);
    setEditingBatch(null);
  };

  // Calculations
  const totalStudents = students.length;
  const avgMonthlyFee = batches.length > 0 
    ? Math.round(batches.reduce((sum, b) => sum + (Number(b.monthlyFee) || 500), 0) / batches.length)
    : 500;

  return (
    <div className="batches-page">
      <div className="page-header">
        <div>
          <div className="page-subtitle"><BookOpen size={16} /> ACADEMIC ORGANIZATION</div>
          <h1 className="page-title">ব্যাচ</h1>
          <p className="page-desc">Organize your academic batches and monthly fees for enrollment.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} /> Add Batch
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue"><Layers size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">BATCHES</div>
            <div className="stat-value">{batches.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper blue"><Users size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">TOTAL STUDENTS</div>
            <div className="stat-value">{totalStudents}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green"><Wallet size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">AVG. MONTHLY FEE</div>
            <div className="stat-value">৳ {avgMonthlyFee}</div>
          </div>
        </div>
      </div>

      <div className="batches-list-container">
        <div className="batches-header-main">
          <h2 className="section-title">All Batches ({batches.length})</h2>
        </div>
        
        <div className="batches-grid-large">
          {batches.map((batch, idx) => {
            const studentCount = students.filter(s => s.batch === batch.name).length;
            return (
              <div key={batch.id || idx} className="batch-card-large">
                <div className="batch-card-top" style={{position: 'relative'}}>
                  <div>
                    <h3 className="batch-name">{batch.name}</h3>
                    {batch.schedule && (
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Clock size={12} /> {batch.schedule}
                      </span>
                    )}
                  </div>
                  <button className="btn-more" onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}>
                    <MoreVertical size={16} />
                  </button>
                  {openDropdown === idx && (
                    <div className="batch-dropdown">
                      <button className="dropdown-item" onClick={() => { handleEditClick(batch); setOpenDropdown(null); }}>
                        <Pencil size={14} /> Edit
                      </button>
                      <button className="dropdown-item text-danger" onClick={() => { handleDeleteBatch(batch); setOpenDropdown(null); }}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="batch-card-bottom">
                  <div className={`batch-student-stat ${studentCount > 0 ? 'has-students' : ''}`}>
                    <Users size={16} />
                    <span><strong>{studentCount}</strong> {studentCount === 1 ? 'Student' : 'Students'}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0284c7' }}>
                    ৳ {batch.monthlyFee || 500}/mo
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Batch Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2>Add Batch</h2>
                <p>Create an academic batch with schedule and fee.</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>BATCH NAME</label>
                <div className="input-with-focus">
                  <input 
                    type="text" 
                    placeholder="e.g. Sat-4pm or Sun-11am" 
                    autoFocus 
                    value={newBatch.name}
                    onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>SCHEDULE / TIME</label>
                <div className="input-with-focus">
                  <input 
                    type="text" 
                    placeholder="e.g. Sat, Mon, Wed (4:00 PM)" 
                    value={newBatch.schedule}
                    onChange={(e) => setNewBatch({ ...newBatch, schedule: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>MONTHLY FEE (৳)</label>
                <div className="input-with-focus">
                  <input 
                    type="number" 
                    placeholder="500" 
                    value={newBatch.monthlyFee}
                    onChange={(e) => setNewBatch({ ...newBatch, monthlyFee: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleAddBatch}>সেভ</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Batch Modal */}
      {isEditModalOpen && editingBatch && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2>Edit Batch</h2>
                <p>Update batch name, schedule or fee.</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>BATCH NAME</label>
                <div className="input-with-focus">
                  <input 
                    type="text" 
                    value={editingBatch.name}
                    onChange={(e) => setEditingBatch({ ...editingBatch, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>SCHEDULE / TIME</label>
                <div className="input-with-focus">
                  <input 
                    type="text" 
                    value={editingBatch.schedule || ''}
                    onChange={(e) => setEditingBatch({ ...editingBatch, schedule: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>MONTHLY FEE (৳)</label>
                <div className="input-with-focus">
                  <input 
                    type="number" 
                    value={editingBatch.monthlyFee || ''}
                    onChange={(e) => setEditingBatch({ ...editingBatch, monthlyFee: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSaveEdit}>সেভ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Batches;
