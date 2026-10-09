import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Copy, ExternalLink, Trash2, Plus, Check } from 'lucide-react';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './enrollment.css';

function EnrollmentLinks({ lang: propLang }) {
  const { t } = useTranslation(propLang);
  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [links, setLinks] = useState(() => dataStore.getEnrollmentLinks());

  const [selectedBatch, setSelectedBatch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const handleSync = () => {
      setBatches(dataStore.getBatches());
      setLinks(dataStore.getEnrollmentLinks());
    };
    window.addEventListener('coaching-data-change', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('coaching-data-change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleCreateLink = () => {
    if (!selectedBatch) return;
    dataStore.createEnrollmentLink(selectedBatch);
    setLinks(dataStore.getEnrollmentLinks());
    setSelectedBatch('');
  };

  const handleCopy = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id) => {
    dataStore.deleteEnrollmentLink(id);
    setLinks(dataStore.getEnrollmentLinks());
  };

  return (
    <div className="enrollment-page">
      <div className="page-header">
        <div>
          <div className="page-subtitle"><LinkIcon size={16} /> {t.enrollmentLinksTag}</div>
          <h1 className="page-title">{t.enrollmentLinksTitle}</h1>
          <p className="page-desc">{t.enrollmentLinksSubtitle}</p>
        </div>
      </div>

      <div className="create-link-card">
        <label className="create-link-label">{t.selectBatchCardLabel}</label>
        <div className="create-link-controls">
          <select 
            className="create-link-select" 
            value={selectedBatch} 
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="">{t.selectBatchPrompt}</option>
            {batches.map(b => (
              <option key={b.id || b.name} value={b.name}>{b.name}</option>
            ))}
          </select>

          <button 
            className="create-link-btn" 
            onClick={handleCreateLink}
            disabled={!selectedBatch}
          >
            <Plus size={16} /> {t.createLinkBtn}
          </button>
        </div>
      </div>

      <div className="links-table-container">
        <table className="links-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>{t.thBatch}</th>
              <th style={{ width: '55%' }}>{t.thLink}</th>
              <th style={{ width: '20%', textAlign: 'right' }}>{t.thActions}</th>
            </tr>
          </thead>
          <tbody>
            {links.length > 0 ? (
              links.map((link) => (
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
                        className="btn-icon" 
                        onClick={() => handleCopy(link.id, link.url)}
                        title={copiedId === link.id ? t.copiedLinkBtn : t.copyLinkBtn}
                      >
                        {copiedId === link.id ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
                      </button>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn-icon"
                        title={t.openLinkBtn}
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button 
                        className="btn-icon btn-danger-icon" 
                        onClick={() => handleDelete(link.id)}
                        title={t.delete}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  {t.noEnrollmentLinks}
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
