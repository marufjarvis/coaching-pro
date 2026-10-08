import React, { useState, useEffect } from 'react';
import { CalendarCheck, FileText, CheckCircle2, UserX, Clock, UserMinus, Copy, X } from 'lucide-react';
import { dataStore } from './dataStore';
import './attendance.css';

function Attendance() {
  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [allStudents, setAllStudents] = useState(() => dataStore.getStudents());
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [selectedBatch, setSelectedBatch] = useState(batches.length > 0 ? batches[0].name : '');
  const [attendanceData, setAttendanceData] = useState({});
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

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
    setSaveSuccessMsg(`Attendance for ${selectedBatch} on ${date} saved successfully!`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
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
            <CalendarCheck size={14} /> DAILY ATTENDANCE REGISTER
          </div>
          <h1>হাজিরা</h1>
          <p className="subtitle">Mark present, absent, late, or leave for a date and batch.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setIsReportOpen(true)}>
            <FileText size={16} /> View report
          </button>
          <button className="btn-primary" onClick={handleSaveAttendance}>সেভ</button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '10px 16px', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {saveSuccessMsg}
        </div>
      )}

      <div className="setup-card">
        <h3>Set up your register</h3>
        <p>Choose a date and batch to begin recording attendance.</p>
        <div className="setup-filters">
          <div className="form-group">
            <label>তারিখ (Date)</label>
            <input 
              type="date" 
              className="form-control" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>ব্যাচ (Batch)</label>
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
          <div className="status-header"><CheckCircle2 size={16} /> Present</div>
          <div className="status-value">{counts.Present}</div>
        </div>
        <div className="summary-card status-card absent">
          <div className="status-header"><UserX size={16} /> Absent</div>
          <div className="status-value">{counts.Absent}</div>
        </div>
        <div className="summary-card status-card late">
          <div className="status-header"><Clock size={16} /> Late</div>
          <div className="status-value">{counts.Late}</div>
        </div>
        <div className="summary-card status-card leave">
          <div className="status-header"><UserMinus size={16} /> Leave</div>
          <div className="status-value">{counts.Leave}</div>
        </div>
      </div>

      <div className="balances-section">
        <div className="balances-header" style={{ alignItems: 'flex-end' }}>
          <div>
            <h2>{selectedBatch}</h2>
            <p>{batchStudents.length} students enrolled in this batch • {date}</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => markAll('Present')}>
              Mark all present
            </button>
            <button className="btn-secondary" onClick={() => markAll('Absent')}>
              Mark all absent
            </button>
          </div>
        </div>

        {batchStudents.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table attendance-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>নাম</th>
                  <th>STUDENT ID</th>
                  <th>PHONE</th>
                  <th>হাজিরা স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                {batchStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td><strong>{student.name}</strong></td>
                    <td>{student.id}</td>
                    <td>{student.phone || '—'}</td>
                    <td>
                      <div className="status-buttons">
                        <button 
                          className={`status-btn ${attendanceData[student.id] === 'Present' ? 'active-present' : ''}`}
                          onClick={() => handleStatusChange(student.id, 'Present')}
                        >
                          <CheckCircle2 size={14} /> Present
                        </button>
                        <button 
                          className={`status-btn ${attendanceData[student.id] === 'Absent' ? 'active-absent' : ''}`}
                          onClick={() => handleStatusChange(student.id, 'Absent')}
                        >
                          <UserX size={14} /> Absent
                        </button>
                        <button 
                          className={`status-btn ${attendanceData[student.id] === 'Late' ? 'active-late' : ''}`}
                          onClick={() => handleStatusChange(student.id, 'Late')}
                        >
                          <Clock size={14} /> Late
                        </button>
                        <button 
                          className={`status-btn ${attendanceData[student.id] === 'Leave' ? 'active-leave' : ''}`}
                          onClick={() => handleStatusChange(student.id, 'Leave')}
                        >
                          <UserMinus size={14} /> Leave
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
            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No students enrolled in batch <strong>{selectedBatch}</strong> yet.</p>
            <p style={{ fontSize: '0.9rem' }}>Go to Students tab and assign students to this batch to take attendance.</p>
          </div>
        )}
      </div>

      {isReportOpen && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <div>
                <h2>Attendance Register Summary</h2>
                <p>{date} • {selectedBatch} • {batchStudents.length} student{batchStudents.length !== 1 ? 's' : ''}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsReportOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="summary-cards attendance-kpis mb-2">
                <div className="summary-card status-card present small">
                  <div className="status-header"><CheckCircle2 size={14} /> PRESENT</div>
                  <div className="status-value">{counts.Present}</div>
                </div>
                <div className="summary-card status-card absent small">
                  <div className="status-header"><UserX size={14} /> ABSENT</div>
                  <div className="status-value">{counts.Absent}</div>
                </div>
                <div className="summary-card status-card late small">
                  <div className="status-header"><Clock size={14} /> LATE</div>
                  <div className="status-value">{counts.Late}</div>
                </div>
                <div className="summary-card status-card leave small">
                  <div className="status-header"><UserMinus size={14} /> LEAVE</div>
                  <div className="status-value">{counts.Leave}</div>
                </div>
              </div>

              <table className="data-table mt-2">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>NAME</th>
                    <th>ID & BATCH</th>
                    <th>PHONE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {batchStudents.map((student, index) => {
                    const status = attendanceData[student.id] || 'Present';
                    return (
                      <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td><strong>{student.name}</strong></td>
                        <td>{student.id} • {student.batch}</td>
                        <td>{student.phone || student.guardianPhone || '—'}</td>
                        <td>
                          <span className={`status-badge ${status === 'Present' ? 'badge-present' : status === 'Absent' ? 'badge-absent' : status === 'Late' ? 'badge-late' : 'badge-leave'}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setIsReportOpen(false)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
