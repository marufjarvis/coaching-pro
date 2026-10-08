import React, { useState } from 'react';
import { CalendarCheck, FileText, CheckCircle2, UserX, Clock, UserMinus, Copy, X } from 'lucide-react';
import './attendance.css';

const MOCK_STUDENTS = [
  { id: 'STU-66115', name: 'Maruf', batch: 'Sat-6:45am', sPhone: '01723619524', gPhone: '01586232012' },
  { id: 'STU-66116', name: 'Rahim', batch: 'Sat-6:45am', sPhone: '01711223344', gPhone: '01811223344' },
  { id: 'STU-66117', name: 'Karim', batch: 'Sat-6:45am', sPhone: '01911223344', gPhone: '01611223344' },
];

function Attendance() {
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [selectedBatch, setSelectedBatch] = useState('Sat-6:45am');
  const [attendanceData, setAttendanceData] = useState({});
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData({
      ...attendanceData,
      [studentId]: status
    });
  };

  const markAllPresent = () => {
    const newAttendance = {};
    MOCK_STUDENTS.forEach(student => {
      newAttendance[student.id] = 'Present';
    });
    setAttendanceData(newAttendance);
  };

  const counts = {
    Present: 0,
    Absent: 0,
    Late: 0,
    Leave: 0
  };

  MOCK_STUDENTS.forEach(student => {
    if (attendanceData[student.id]) {
      counts[attendanceData[student.id]]++;
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
          <button className="btn-primary">সেভ</button>
        </div>
      </div>

      <div className="setup-card">
        <h3>Set up your register</h3>
        <p>Choose a date and batch to begin.</p>
        <div className="setup-filters">
          <div className="form-group">
            <label>তারিখ</label>
            <input 
              type="date" 
              className="form-control" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>ব্যাচ</label>
            <select className="form-control" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
              <option value="Sat-6:45am">Sat-6:45am</option>
              <option value="Sun-8:00am">Sun-8:00am</option>
              <option value="Mon-4:00pm">Mon-4:00pm</option>
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
            <p>{MOCK_STUDENTS.length} students in this register • {date}</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => setIsReportOpen(true)}>
              <FileText size={16} /> View report
            </button>
            <button className="btn-secondary" onClick={markAllPresent}>
              Mark all present
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table attendance-table">
            <thead>
              <tr>
                <th>#</th>
                <th>নাম</th>
                <th>BATCH</th>
                <th>স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_STUDENTS.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td><strong>{student.name}</strong></td>
                  <td>{student.batch}</td>
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
      </div>

      {isReportOpen && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <div>
                <h2>Attendance report</h2>
                <p>{date} • {selectedBatch} • {MOCK_STUDENTS.length} student{MOCK_STUDENTS.length !== 1 ? 's' : ''}</p>
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

              {counts.Absent === 0 ? (
                <div className="alert-box success">
                  All students present or on leave — no absent notifications needed.
                </div>
              ) : (
                <div className="alert-box warning">
                  {counts.Absent} student(s) absent. You can notify them below.
                </div>
              )}

              <table className="data-table mt-2">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>NAME</th>
                    <th>PHONES</th>
                    <th>STATUS</th>
                    <th>NOTIFY</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STUDENTS.map((student, index) => {
                    const status = attendanceData[student.id] || 'None';
                    let statusClass = '';
                    let statusLabel = '-';
                    if (status === 'Present') { statusClass = 'badge-present'; statusLabel = 'P'; }
                    if (status === 'Absent') { statusClass = 'badge-absent'; statusLabel = 'A'; }
                    if (status === 'Late') { statusClass = 'badge-late'; statusLabel = 'L'; }
                    if (status === 'Leave') { statusClass = 'badge-leave'; statusLabel = 'LV'; }

                    return (
                      <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{student.name}</strong><br/>
                          <span className="student-meta">{student.id} • {student.batch}</span>
                        </td>
                        <td>
                          <div className="phones-wrapper">
                            <span className="phone-badge">
                              <span className="phone-icon s-icon">S</span> {student.sPhone} <Copy size={12}/>
                            </span>
                            <span className="phone-badge">
                              <span className="phone-icon g-icon">G</span> {student.gPhone} <Copy size={12}/>
                            </span>
                          </div>
                        </td>
                        <td>
                          {status !== 'None' ? (
                            <span className={`status-badge ${statusClass}`}>
                              {status === 'Present' && <CheckCircle2 size={12} />} 
                              {status === 'Absent' && <UserX size={12} />} 
                              {status === 'Late' && <Clock size={12} />} 
                              {status === 'Leave' && <UserMinus size={12} />} 
                              {statusLabel}
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>-</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="phone-legend">
                <span className="phone-icon s-icon">S</span> Student phone &nbsp;
                <span className="phone-icon g-icon">G</span> Guardian phone
              </div>

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
