import React, { useState, useEffect } from 'react';
import { CalendarCheck, FileText, CheckCircle2, UserX, Clock, UserMinus, Copy, Check, X } from 'lucide-react';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './attendance.css';

function Attendance({ lang: propLang }) {
  const { t, lang } = useTranslation(propLang);
  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [allStudents, setAllStudents] = useState(() => dataStore.getStudents());
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [selectedBatch, setSelectedBatch] = useState(batches.length > 0 ? batches[0].name : '');
  const [attendanceData, setAttendanceData] = useState({});
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [copiedPhoneKey, setCopiedPhoneKey] = useState(null);
  const [copyToast, setCopyToast] = useState('');

  useEffect(() => {
    const handleSync = () => {
      setBatches(dataStore.getBatches());
      setAllStudents(dataStore.getStudents());
    };
    window.addEventListener('coaching-data-change', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('coaching-data-change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Update selected batch if empty
  useEffect(() => {
    if (!selectedBatch && batches.length > 0) {
      setSelectedBatch(batches[0].name);
    }
  }, [batches, selectedBatch]);

  // Students in selected batch
  const batchStudents = allStudents.filter(s => s.batch === selectedBatch);

  // Load existing attendance for date + batch
  useEffect(() => {
    if (!selectedBatch) return;
    const existing = dataStore.getAttendanceForDateAndBatch(date, selectedBatch);
    if (existing && Object.keys(existing).length > 0) {
      setAttendanceData(existing);
    } else {
      // Default to Present for all active students in batch if not recorded yet
      const initial = {};
      batchStudents.forEach(s => {
        initial[s.id] = 'Present';
      });
      setAttendanceData(initial);
    }
    setSaveSuccessMsg('');
  }, [date, selectedBatch, allStudents]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAll = (status) => {
    const updated = {};
    batchStudents.forEach(s => {
      updated[s.id] = status;
    });
    setAttendanceData(updated);
  };

  const handleSaveAttendance = () => {
    if (!selectedBatch) return;
    dataStore.saveAttendanceForDateAndBatch(date, selectedBatch, attendanceData);
    setSaveSuccessMsg(t.attendanceSavedSuccess);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleCopyPhone = (number, key, label) => {
    if (!number || number === '—') return;
    navigator.clipboard.writeText(number);
    setCopiedPhoneKey(key);
    setCopyToast(`${number} (${label}) ${lang === 'EN' ? 'copied!' : 'কপি হয়েছে!'}`);
    setTimeout(() => setCopiedPhoneKey(null), 2000);
    setTimeout(() => setCopyToast(''), 3000);
  };

  const counts = {
    Present: 0,
    Absent: 0,
    Late: 0,
    Leave: 0
  };

  batchStudents.forEach(student => {
    const st = attendanceData[student.id];
    if (st && counts[st] !== undefined) {
      counts[st]++;
    }
  });

  return (
    <div className="attendance-container">
      <div className="page-header">
        <div>
          <div className="fee-followup-tag">
            <CalendarCheck size={14} /> {t.dailyAttendanceTag}
          </div>
          <h1>{t.attendanceTitle}</h1>
          <p className="subtitle">{t.attendanceSubtitle}</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setIsReportOpen(true)}>
            <FileText size={16} /> {t.viewReportBtn}
          </button>
          <button className="btn-primary" onClick={handleSaveAttendance}>{t.saveAttendanceBtn}</button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '10px 16px', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {saveSuccessMsg}
        </div>
      )}

      <div className="setup-card">
        <h3>{t.setupRegisterTitle}</h3>
        <p>{t.setupRegisterSubtitle}</p>
        <div className="setup-filters">
          <div className="form-group">
            <label>{t.dateInputLabel}</label>
            <input 
              type="date" 
              className="form-control" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>{t.batchInputLabel}</label>
            <select 
              className="form-control" 
              value={selectedBatch} 
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              {batches.map(b => (
                <option key={b.id || b.name} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="summary-cards attendance-kpis">
        <div className="summary-card status-card present">
          <div className="status-header"><CheckCircle2 size={16} /> {t.present}</div>
          <div className="status-value">{counts.Present}</div>
        </div>
        <div className="summary-card status-card absent">
          <div className="status-header"><UserX size={16} /> {t.absent}</div>
          <div className="status-value">{counts.Absent}</div>
        </div>
        <div className="summary-card status-card late">
          <div className="status-header"><Clock size={16} /> {t.late}</div>
          <div className="status-value">{counts.Late}</div>
        </div>
        <div className="summary-card status-card leave">
          <div className="status-header"><UserMinus size={16} /> {t.leave}</div>
          <div className="status-value">{counts.Leave}</div>
        </div>
      </div>

      <div className="balances-section">
        <div className="balances-header" style={{ alignItems: 'flex-end' }}>
          <div>
            <h2>{selectedBatch}</h2>
            <p>{batchStudents.length} {t.enrolledInBatch} • {date}</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => markAll('Present')}>
              {t.markAllPresent}
            </button>
            <button className="btn-secondary" onClick={() => markAll('Absent')}>
              {t.markAllAbsent}
            </button>
          </div>
        </div>

        {batchStudents.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table attendance-table">
              <thead>
                <tr>
                  <th>{t.thSerial}</th>
                  <th>{t.thStudentName}</th>
                  <th>{t.thStudentId}</th>
                  <th>{t.thStudentPhone}</th>
                  <th>{t.thAttendanceStatus}</th>
                </tr>
              </thead>
              <tbody>
                {batchStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td><strong>{student.name}</strong></td>
                    <td>{student.id}</td>
                    <td>
                      {student.phone ? (
                        <div className="copy-phone-cell">
                          <span className="phone-number-text">{student.phone}</span>
                          <button
                            type="button"
                            className={`btn-copy-phone ${copiedPhoneKey === student.id ? 'copied' : ''}`}
                            onClick={() => handleCopyPhone(student.phone, student.id, lang === 'EN' ? 'Phone' : 'মোবাইল')}
                            title={copiedPhoneKey === student.id ? (lang === 'EN' ? 'Copied!' : 'কপি হয়েছে!') : (lang === 'EN' ? 'Click to copy' : 'কপি করতে ক্লিক করুন')}
                          >
                            {copiedPhoneKey === student.id ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <div className="status-buttons">
                        <button 
                          className={`status-btn ${attendanceData[student.id] === 'Present' ? 'active-present' : ''}`}
                          onClick={() => handleStatusChange(student.id, 'Present')}
                        >
                          <CheckCircle2 size={14} /> {t.present}
                        </button>
                        <button 
                          className={`status-btn ${attendanceData[student.id] === 'Absent' ? 'active-absent' : ''}`}
                          onClick={() => handleStatusChange(student.id, 'Absent')}
                        >
                          <UserX size={14} /> {t.absent}
                        </button>
                        <button 
                          className={`status-btn ${attendanceData[student.id] === 'Late' ? 'active-late' : ''}`}
                          onClick={() => handleStatusChange(student.id, 'Late')}
                        >
                          <Clock size={14} /> {t.late}
                        </button>
                        <button 
                          className={`status-btn ${attendanceData[student.id] === 'Leave' ? 'active-leave' : ''}`}
                          onClick={() => handleStatusChange(student.id, 'Leave')}
                        >
                          <UserMinus size={14} /> {t.leave}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{t.noStudentsInBatchMsg}</p>
            <p style={{ fontSize: '0.9rem' }}>{t.noStudentsInBatchSub}</p>
          </div>
        )}
      </div>

      {isReportOpen && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <div>
                <h2>{t.attendanceSummaryTitle}</h2>
                <p>{date} • {selectedBatch} • {batchStudents.length} {batchStudents.length === 1 ? t.studentSingle : t.studentPlural}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsReportOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              {copyToast && (
                <div className="copy-toast-badge">
                  <Check size={14} color="#166534" />
                  <span>{copyToast}</span>
                </div>
              )}

              <div className="summary-cards attendance-kpis mb-2">
                <div className="summary-card status-card present small">
                  <div className="status-header"><CheckCircle2 size={14} /> {t.present.toUpperCase()}</div>
                  <div className="status-value">{counts.Present}</div>
                </div>
                <div className="summary-card status-card absent small">
                  <div className="status-header"><UserX size={14} /> {t.absent.toUpperCase()}</div>
                  <div className="status-value">{counts.Absent}</div>
                </div>
                <div className="summary-card status-card late small">
                  <div className="status-header"><Clock size={14} /> {t.late.toUpperCase()}</div>
                  <div className="status-value">{counts.Late}</div>
                </div>
                <div className="summary-card status-card leave small">
                  <div className="status-header"><UserMinus size={14} /> {t.leave.toUpperCase()}</div>
                  <div className="status-value">{counts.Leave}</div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="data-table mt-2">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>{t.thSerial}</th>
                      <th>{t.thStudentName}</th>
                      <th>{t.thStudentId} & {t.thBatch}</th>
                      <th>{t.thStudentPhone}</th>
                      <th>{t.thGuardianPhone}</th>
                      <th>{t.thStatus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchStudents.map((student, index) => {
                      const status = attendanceData[student.id] || 'Present';
                      const studentPhoneKey = `${student.id}-stu`;
                      const guardianPhoneKey = `${student.id}-guard`;
                      return (
                        <tr key={student.id}>
                          <td>{index + 1}</td>
                          <td><strong>{student.name}</strong></td>
                          <td>
                            <span style={{ fontWeight: 600 }}>{student.id}</span>
                            <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem' }}>{student.batch}</span>
                          </td>
                          <td>
                            {student.phone ? (
                              <div className="copy-phone-cell">
                                <span className="phone-number-text">{student.phone}</span>
                                <button
                                  type="button"
                                  className={`btn-copy-phone ${copiedPhoneKey === studentPhoneKey ? 'copied' : ''}`}
                                  onClick={() => handleCopyPhone(student.phone, studentPhoneKey, lang === 'EN' ? 'Student' : 'শিক্ষার্থী')}
                                  title={copiedPhoneKey === studentPhoneKey ? (lang === 'EN' ? 'Copied!' : 'কপি হয়েছে!') : (lang === 'EN' ? 'Click to copy student phone' : 'শিক্ষার্থীর মোবাইল নম্বর কপি করুন')}
                                >
                                  {copiedPhoneKey === studentPhoneKey ? (
                                    <Check size={14} color="#16a34a" />
                                  ) : (
                                    <Copy size={14} />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td>
                            {student.guardianPhone ? (
                              <div className="copy-phone-cell">
                                <span className="phone-number-text">{student.guardianPhone}</span>
                                <button
                                  type="button"
                                  className={`btn-copy-phone ${copiedPhoneKey === guardianPhoneKey ? 'copied' : ''}`}
                                  onClick={() => handleCopyPhone(student.guardianPhone, guardianPhoneKey, lang === 'EN' ? 'Guardian' : 'অভিভাবক')}
                                  title={copiedPhoneKey === guardianPhoneKey ? (lang === 'EN' ? 'Copied!' : 'কপি হয়েছে!') : (lang === 'EN' ? 'Click to copy guardian phone' : 'অভিভাবকের মোবাইল নম্বর কপি করুন')}
                                >
                                  {copiedPhoneKey === guardianPhoneKey ? (
                                    <Check size={14} color="#16a34a" />
                                  ) : (
                                    <Copy size={14} />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td>
                            <span className={`status-badge ${status === 'Present' ? 'badge-present' : status === 'Absent' ? 'badge-absent' : status === 'Late' ? 'badge-late' : 'badge-leave'}`}>
                              {status === 'Present' ? t.present : status === 'Absent' ? t.absent : status === 'Late' ? t.late : t.leave}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setIsReportOpen(false)}>{t.done}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
