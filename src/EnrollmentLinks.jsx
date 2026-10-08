import React, { useState } from 'react';
import { Link as LinkIcon, Copy, ExternalLink, Trash2, Plus } from 'lucide-react';
import './enrollment.css';

function EnrollmentLinks() {
  const [links, setLinks] = useState([
    { id: 1, batch: 'Sat-6:45am', url: `${window.location.origin}/#/enroll/Sat-6:45am` },
    { id: 2, batch: 'Sun-5pm', url: `${window.location.origin}/#/enroll/Sun-5pm` },
    { id: 3, batch: 'Sun-4pm', url: `${window.location.origin}/#/enroll/Sun-4pm` },
    { id: 4, batch: 'Sun-3pm', url: `${window.location.origin}/#/enroll/Sun-3pm` },
    { id: 5, batch: 'Sun-2pm', url: `${window.location.origin}/#/enroll/Sun-2pm` }
  ]);

  const [selectedBatch, setSelectedBatch] = useState('');

  const handleCreateLink = () => {
    if (!selectedBatch) return;
    
    const newLink = {
      id: Date.now(),
      batch: selectedBatch,
      url: `${window.location.origin}/#/enroll/${encodeURIComponent(selectedBatch)}`
    };
    
    setLinks([newLink, ...links]);
    setSelectedBatch('');
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
  };

  const handleDelete = (id) => {
    setLinks(links.filter(link => link.id !== id));
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
              <th style={{ width: '20%', textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id}>
                <td style={{ fontWeight: '500' }}>{link.batch}</td>
                <td>
                  <a href={link.url} target="_blank" rel="noreferrer" className="link-url">
                    {link.url}
                  </a>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="link-actions">
                    <button className="btn-icon" onClick={() => handleCopy(link.url)} title="Copy link">
                      <Copy size={16} />
                    </button>
                    <a href={link.url} target="_blank" rel="noreferrer" className="btn-icon" title="Open link">
                      <ExternalLink size={16} />
                    </a>
                    <button className="btn-icon btn-danger-icon" onClick={() => handleDelete(link.id)} title="Delete link">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  No enrollment links created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnrollmentLinks;
