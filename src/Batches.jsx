import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Layers, Users, MoreVertical, X, Pencil, Trash2 } from 'lucide-react';
import { dataStore } from './dataStore';
import './batches.css';

function Batches() {
  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [students, setStudents] = useState(() => dataStore.getStudents());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBatchName, setNewBatchName] = useState('');

  const [openDropdown, setOpenDropdown] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [editBatchName, setEditBatchName] = useState('');

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
    if (!newBatchName.trim()) return;
    dataStore.addBatch(newBatchName.trim());
    setNewBatchName('');
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
    setEditingBatch(batch);
    setEditBatchName(batch.name);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingBatch || !editBatchName.trim()) return;
    dataStore.updateBatch(editingBatch.id || editingBatch.name, editBatchName.trim());
    setIsEditModalOpen(false);
    setEditingBatch(null);
    setEditBatchName('');
  };

  // Calculations
  const totalStudents = students.length;
  const activeBatchesCount = batches.filter(b => students.some(s => s.batch === b.name)).length;

  return (
    <div className="batches-page">
      <div className="page-header">
        <div>
          <div className="page-subtitle"><BookOpen size={16} /> ACADEMIC ORGANIZATION</div>
          <h1 className="page-title">ব্যাচ</h1>
          <p className="page-desc">Organize your academic batches for enrollment.</p>
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
          <div className="stat-icon-wrapper green"><Layers size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">ACTIVE BATCHES</div>
            <div className="stat-value">{activeBatchesCount}</div>
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
                <div className="batch-card-top" style={{ position: 'relative' }}>
                  <h3 className="batch-name">{batch.name}</h3>
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
                <p>Create an academic batch.</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>BATCH NAME</label>
                <div className="input-with-focus">
                  <input 
                    type="text" 
                    placeholder="e.g. Sat-4pm or Sun-11am" 
                    autoFocus 
                    value={newBatchName}
                    onChange={(e) => setNewBatchName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddBatch()}
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
                <p>Rename your academic batch.</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>BATCH NAME</label>
                <div className="input-with-focus">
                  <input 
                    type="text" 
                    value={editBatchName}
                    onChange={(e) => setEditBatchName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    autoFocus
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
