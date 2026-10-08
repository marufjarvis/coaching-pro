import React, { useState } from 'react';
import { BookOpen, Plus, Layers, Users, Wallet, MoreVertical, X, Pencil, Trash2 } from 'lucide-react';
import './batches.css';

function Batches() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBatchName, setNewBatchName] = useState('');

  const [batches, setBatches] = useState([
    { name: 'Sat-6:45am', students: 1 },
    { name: 'Sat-7:45am', students: 0 },
    { name: 'Sat-9am', students: 0 },
    { name: 'Sat-10am', students: 0 },
    { name: 'Sat-2pm', students: 0 },
    { name: 'Sat-3pm', students: 0 },
    { name: 'Sat-4pm', students: 0 },
    { name: 'Sat-5pm', students: 0 },
    { name: 'Sun-6:45am', students: 0 },
    { name: 'Sun-8am', students: 0 },
    { name: 'Sun-9am', students: 0 },
    { name: 'Sun-10am', students: 0 },
  ]);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBatchIdx, setEditingBatchIdx] = useState(null);
  const [editBatchName, setEditBatchName] = useState('');

  const handleAddBatch = () => {
    if (newBatchName.trim() === '') return;
    setBatches([...batches, { name: newBatchName, students: 0 }]);
    setNewBatchName('');
    setIsAddModalOpen(false);
  };

  const handleDeleteBatch = (idx) => {
    if(window.confirm('Are you sure you want to delete this batch?')) {
      const newBatches = [...batches];
      newBatches.splice(idx, 1);
      setBatches(newBatches);
    }
  };

  const handleEditClick = (idx, batch) => {
    setEditingBatchIdx(idx);
    setEditBatchName(batch.name);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editBatchName.trim() === '') return;
    const newBatches = [...batches];
    newBatches[editingBatchIdx].name = editBatchName;
    setBatches(newBatches);
    setIsEditModalOpen(false);
    setEditingBatchIdx(null);
    setEditBatchName('');
  };

  return (
    <div className="batches-page">
      <div className="page-header">
        <div>
          <div className="page-subtitle"><BookOpen size={16} /> ACADEMIC ORGANIZATION</div>
          <h1 className="page-title">ব্যাচ</h1>
          <p className="page-desc">Organize your academic batches and monthly fees for enrollment.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}><Plus size={18} /> Add Batch</button>
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
            <div className="stat-label">STUDENTS</div>
            <div className="stat-value">1</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green"><Wallet size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">AVG. MONTHLY FEE</div>
            <div className="stat-value">৳ 0</div>
          </div>
        </div>
      </div>

      <div className="batches-list-container">
        <div className="batches-header-main">
          <h2 className="section-title">All Batches ({batches.length})</h2>
        </div>
        
        <div className="batches-grid-large">
          {batches.map((batch, idx) => (
            <div key={idx} className="batch-card-large">
              <div className="batch-card-top" style={{position: 'relative'}}>
                <h3 className="batch-name">{batch.name}</h3>
                <button className="btn-more" onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}>
                  <MoreVertical size={16} />
                </button>
                {openDropdown === idx && (
                  <div className="batch-dropdown">
                    <button className="dropdown-item" onClick={() => { handleEditClick(idx, batch); setOpenDropdown(null); }}>
                      <Pencil size={14} /> Edit
                    </button>
                    <button className="dropdown-item text-danger" onClick={() => { handleDeleteBatch(idx); setOpenDropdown(null); }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
              <div className="batch-card-bottom">
                <div className={`batch-student-stat ${batch.students > 0 ? 'has-students' : ''}`}>
                  <Users size={16} />
                  <span><strong>{batch.students}</strong> {batch.students === 1 ? 'Student' : 'Students'}</span>
                </div>
              </div>
            </div>
          ))}
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
                    placeholder="e.g. Sat-4pm" 
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
      {isEditModalOpen && (
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
                    placeholder="e.g. Sat-4pm" 
                    autoFocus 
                    value={editBatchName}
                    onChange={(e) => setEditBatchName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
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
