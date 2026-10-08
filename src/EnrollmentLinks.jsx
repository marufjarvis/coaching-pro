import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Copy, ExternalLink, Trash2, Plus, Check } from 'lucide-react';
import { dataStore } from './dataStore';
import './enrollment.css';

function EnrollmentLinks() {
  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [links, setLinks] = useState(() => {
    try {
      const saved = localStorage.getItem('coachingEnrollmentLinks');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 1, batch: 'Sat-6:45am', url: `${window.location.origin}/#/enroll/Sat-6:45am` },
      { id: 2, batch: 'Sun-8am', url: `${window.location.origin}/#/enroll/Sun-8am` }
    ];
  });

  const [selectedBatch, setSelectedBatch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const handleSync = () => setBatches(dataStore.getBatches());
    window.addEventListener('coaching-data-change', handleSync);
    return () => window.removeEventListener('coaching-data-change', handleSync);
  }, []);

  const handleCreateLink = () => {
    if (!selectedBatch) return;
    
    const newLink = {
      id: Date.now(),
      batch: selectedBatch,
      url: `${window.location.origin}/#/enroll/${encodeURIComponent(selectedBatch)}`
    };
    
    const updated = [newLink, ...links];
    setLinks(updated);
    localStorage.setItem('coachingEnrollmentLinks', JSON.stringify(updated));
    setSelectedBatch('');
  };

  const handleCopy = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id) => {
    const updated = links.filter(link => link.id !== id);
    setLinks(updated);
    localStorage.setItem('coachingEnrollmentLinks', JSON.stringify(updated));
  };

  return (
    <div className="enrollment-page">
      <div className="page-header">
        <div>
          <div className="page-subtitle"><LinkIcon size={16} /> ADMISSIONS</div>
          <h1 className="page-title">Enrollment Links</h1>
          <p className="page-desc">Share a batch link so students can apply online.</p>
        </div>
      </div>

      <div className="create-link-card">
        <label className="create-link-label">SELECT BATCH</label>
        <div className="create-link-controls">
          <select 
            className="create-link-select" 
            value={selectedBatch} 
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="">Select a batch</option>
            {batches.map(b => (
              <option key={b.id || b.name} value={b.name}>{b.name}</option>
            ))}
          </select>

          <button 
            className="create-link-btn" 
            onClick={handleCreateLink}
            disabled={!selectedBatch}
          >
            <Plus size={16} /> Create link
          </button>
        </div>
      </div>

      <div className="links-table-container">
        <table className="links-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>BATCH</th>
              <th style={{ width: '55%' }}>LINK</th>
              <th style={{ width: '20%', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id}>
                <td style={{ fontWeight: '600' }}>{link.batch}</td>
                <td>
                  <a href={link.url} target="_blank" rel="noreferrer" className="link-url">
                    {link.url}
                  </a>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="link-actions">
                    <button 
                      className="link-action-btn copy-btn" 
                      onClick={() => handleCopy(link.id, link.url)}
                      title="Copy Link"
                    >
                      {copiedId === link.id ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                      {copiedId === link.id ? 'Copied' : 'Copy'}
                    </button>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="link-action-btn view-btn"
                      title="Open Link"
                    >
                      <ExternalLink size={14} /> View
                    </a>
                    <button 
                      className="link-action-btn delete-btn" 
                      onClick={() => handleDelete(link.id)}
                      title="Delete Link"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnrollmentLinks;
