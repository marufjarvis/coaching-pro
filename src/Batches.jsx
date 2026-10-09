import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Layers, Users, MoreVertical, X, Pencil, Trash2, Clock } from 'lucide-react';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './batches.css';

const defaultBatchState = {
  name: '',
  days: 'শনি, সোম, বুধ',
  time: 'সকাল ৮:০০ ও বিকাল ৪:০০ (২টি স্লট)',
  seatLimit: 50,
  tagline: 'সম্পূর্ণ সিলেবাস বেসিক থেকে বোর্ড A+ প্রস্তুতি',
  status: 'ভর্তি চলছে'
};

function Batches({ lang: propLang }) {
  const { t } = useTranslation(propLang);
  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [students, setStudents] = useState(() => dataStore.getStudents());
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBatchForm, setNewBatchForm] = useState(defaultBatchState);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [editBatchForm, setEditBatchForm] = useState(defaultBatchState);

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
    if (!newBatchForm.name.trim()) return;
    dataStore.addBatch({
      name: newBatchForm.name.trim(),
      days: newBatchForm.days.trim() || 'শনি, সোম, বুধ',
      time: newBatchForm.time.trim() || 'সকাল ১০:০০ টা',
      seatLimit: Number(newBatchForm.seatLimit) || 50,
      tagline: newBatchForm.tagline.trim() || 'সম্পূর্ণ সিলেবাস বেসিক থেকে বোর্ড A+ প্রস্তুতি',
      status: newBatchForm.status || 'ভর্তি চলছে'
    });
    setNewBatchForm(defaultBatchState);
    setIsAddModalOpen(false);
  };

  const handleDeleteBatch = (batch) => {
    const enrolledCount = students.filter(s => s.batch === batch.name || s.preferredBatch === batch.name).length;
    const msg = enrolledCount > 0 
      ? t.confirmDeleteBatchWithStudents.replace('{count}', enrolledCount).replace('{name}', batch.name)
      : t.confirmDeleteBatch.replace('{name}', batch.name);
    if (window.confirm(msg)) {
      dataStore.deleteBatch(batch.id || batch.name);
    }
  };

  const handleEditClick = (batch) => {
    setEditingBatch(batch);
    setEditBatchForm({
      name: batch.name || '',
      days: batch.days || 'শনি, সোম, বুধ',
      time: batch.time || 'সকাল ১০:০০ টা',
      seatLimit: Number(batch.seatLimit) || 50,
      tagline: batch.tagline || 'সম্পূর্ণ সিলেবাস বেসিক থেকে বোর্ড A+ প্রস্তুতি',
      status: batch.status || 'ভর্তি চলছে'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingBatch || !editBatchForm.name.trim()) return;
    dataStore.updateBatch(editingBatch.id || editingBatch.name, {
      name: editBatchForm.name.trim(),
      days: editBatchForm.days.trim() || 'শনি, সোম, বুধ',
      time: editBatchForm.time.trim() || 'সকাল ১০:০০ টা',
      seatLimit: Number(editBatchForm.seatLimit) || 50,
      tagline: editBatchForm.tagline.trim() || 'সম্পূর্ণ সিলেবাস বেসিক থেকে বোর্ড A+ প্রস্তুতি',
      status: editBatchForm.status || 'ভর্তি চলছে'
    });
    setIsEditModalOpen(false);
    setEditingBatch(null);
  };

  // Calculations
  const totalStudents = students.length;
  const activeBatchesCount = batches.filter(b => students.some(s => s.batch === b.name || s.preferredBatch === b.name)).length;

  return (
    <div className="batches-page">
      <div className="page-header">
        <div>
          <div className="page-subtitle"><BookOpen size={16} /> {t.academicOrganization}</div>
          <h1 className="page-title">{t.batchesTitle}</h1>
          <p className="page-desc">{t.batchesSubtitle}</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} /> {t.addBatch}
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue"><Layers size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">{t.statBatches}</div>
            <div className="stat-value">{batches.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper blue"><Users size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">{t.statTotalStudents}</div>
            <div className="stat-value">{totalStudents}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green"><Layers size={20} /></div>
          <div className="stat-info">
            <div className="stat-label">{t.statActiveBatches}</div>
            <div className="stat-value">{activeBatchesCount}</div>
          </div>
        </div>
      </div>

      <div className="batches-list-container">
        <div className="batches-header-main">
          <h2 className="section-title">{t.allBatchesCount} ({batches.length})</h2>
        </div>
        
        <div className="batches-grid-large">
          {batches.map((batch, idx) => {
            const studentCount = students.filter(s => s.batch === batch.name || s.preferredBatch === batch.name).length;
            const seatLimit = Number(batch.seatLimit) || 50;
            const pct = Math.min(100, Math.round((studentCount / seatLimit) * 100));

            return (
              <div key={batch.id || idx} className="batch-card-large">
                <div className="batch-card-top" style={{ position: 'relative' }}>
                  <div style={{ flex: 1, paddingRight: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <h3 className="batch-name">{batch.name}</h3>
                      <span className={`batch-status-badge ${batch.status === 'ব্যাচ পূর্ণ' ? 'full' : (batch.status === 'সীমিত আসন' ? 'warning' : 'open')}`}>
                        {batch.status || 'ভর্তি চলছে'}
                      </span>
                    </div>
                    {batch.tagline && <p className="batch-card-tagline">{batch.tagline}</p>}
                  </div>
                  <button className="btn-more" onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}>
                    <MoreVertical size={16} />
                  </button>
                  {openDropdown === idx && (
                    <div className="batch-dropdown">
                      <button className="dropdown-item" onClick={() => { handleEditClick(batch); setOpenDropdown(null); }}>
                        <Pencil size={14} /> {t.edit}
                      </button>
                      <button className="dropdown-item text-danger" onClick={() => { handleDeleteBatch(batch); setOpenDropdown(null); }}>
                        <Trash2 size={14} /> {t.delete}
                      </button>
                    </div>
                  )}
                </div>

                <div className="batch-card-schedule">
                  <div className="batch-schedule-item">
                    <Clock size={14} />
                    <span>{batch.days || 'শনি, সোম, বুধ'} • {batch.time || 'সকাল ১০:০০ টা'}</span>
                  </div>
                </div>

                <div className="batch-card-bottom">
                  <div className={`batch-student-stat ${studentCount > 0 ? 'has-students' : ''}`}>
                    <Users size={16} />
                    <span><strong>{studentCount}</strong> / {seatLimit} {studentCount === 1 ? t.studentSingle : t.studentPlural}</span>
                  </div>
                  <div className="batch-capacity-track" title={`${pct}% পূর্ণ`}>
                    <div className="batch-capacity-bar" style={{ width: `${pct}%` }} />
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
                <h2>{t.newBatchModalTitle}</h2>
                <p>{t.newBatchModalSubtitle}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{t.batchNameLabel} *</label>
                <div className="input-with-focus">
                  <input 
                    type="text" 
                    placeholder={t.batchNamePlaceholder} 
                    autoFocus 
                    value={newBatchForm.name}
                    onChange={(e) => setNewBatchForm({ ...newBatchForm, name: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddBatch()}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label>{t.batchDaysLabel}</label>
                  <div className="input-with-focus">
                    <input 
                      type="text" 
                      placeholder={t.batchDaysPlaceholder} 
                      value={newBatchForm.days}
                      onChange={(e) => setNewBatchForm({ ...newBatchForm, days: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.batchTimeLabel}</label>
                  <div className="input-with-focus">
                    <input 
                      type="text" 
                      placeholder={t.batchTimePlaceholder} 
                      value={newBatchForm.time}
                      onChange={(e) => setNewBatchForm({ ...newBatchForm, time: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label>{t.batchSeatLimitLabel}</label>
                  <div className="input-with-focus">
                    <input 
                      type="number" 
                      min="1"
                      max="200"
                      placeholder={t.batchSeatLimitPlaceholder} 
                      value={newBatchForm.seatLimit}
                      onChange={(e) => setNewBatchForm({ ...newBatchForm, seatLimit: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.batchStatusLabel}</label>
                  <div className="input-with-focus">
                    <select 
                      className="form-select-batch"
                      value={newBatchForm.status}
                      onChange={(e) => setNewBatchForm({ ...newBatchForm, status: e.target.value })}
                    >
                      <option value="ভর্তি চলছে">{t.batchStatusOpen || "ভর্তি চলছে"}</option>
                      <option value="সীমিত আসন">{t.batchStatusLimited || "সীমিত আসন"}</option>
                      <option value="ব্যাচ পূর্ণ">{t.batchStatusFull || "ব্যাচ পূর্ণ"}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>{t.batchTaglineLabel}</label>
                <div className="input-with-focus">
                  <input 
                    type="text" 
                    placeholder={t.batchTaglinePlaceholder} 
                    value={newBatchForm.tagline}
                    onChange={(e) => setNewBatchForm({ ...newBatchForm, tagline: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>{t.cancel}</button>
              <button className="btn-save" onClick={handleAddBatch}>{t.save}</button>
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
                <h2>{t.editBatchModalTitle}</h2>
                <p>{t.editBatchModalSubtitle}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{t.batchNameLabel} *</label>
                <div className="input-with-focus">
                  <input 
                    type="text" 
                    value={editBatchForm.name}
                    onChange={(e) => setEditBatchForm({ ...editBatchForm, name: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    autoFocus
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label>{t.batchDaysLabel}</label>
                  <div className="input-with-focus">
                    <input 
                      type="text" 
                      placeholder={t.batchDaysPlaceholder}
                      value={editBatchForm.days}
                      onChange={(e) => setEditBatchForm({ ...editBatchForm, days: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.batchTimeLabel}</label>
                  <div className="input-with-focus">
                    <input 
                      type="text" 
                      placeholder={t.batchTimePlaceholder}
                      value={editBatchForm.time}
                      onChange={(e) => setEditBatchForm({ ...editBatchForm, time: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label>{t.batchSeatLimitLabel}</label>
                  <div className="input-with-focus">
                    <input 
                      type="number" 
                      min="1"
                      max="200"
                      placeholder={t.batchSeatLimitPlaceholder}
                      value={editBatchForm.seatLimit}
                      onChange={(e) => setEditBatchForm({ ...editBatchForm, seatLimit: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.batchStatusLabel}</label>
                  <div className="input-with-focus">
                    <select 
                      className="form-select-batch"
                      value={editBatchForm.status}
                      onChange={(e) => setEditBatchForm({ ...editBatchForm, status: e.target.value })}
                    >
                      <option value="ভর্তি চলছে">{t.batchStatusOpen || "ভর্তি চলছে"}</option>
                      <option value="সীমিত আসন">{t.batchStatusLimited || "সীমিত আসন"}</option>
                      <option value="ব্যাচ পূর্ণ">{t.batchStatusFull || "ব্যাচ পূর্ণ"}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>{t.batchTaglineLabel}</label>
                <div className="input-with-focus">
                  <input 
                    type="text" 
                    placeholder={t.batchTaglinePlaceholder}
                    value={editBatchForm.tagline}
                    onChange={(e) => setEditBatchForm({ ...editBatchForm, tagline: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>{t.cancel}</button>
              <button className="btn-save" onClick={handleSaveEdit}>{t.save}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Batches;
