import React, { useState } from 'react';
import { FileText, Plus, X, Edit3, Trash2, ListChecks } from 'lucide-react';
import './exams.css';

const MOCK_STUDENTS = [
  { id: 'STU-66115', name: 'Maruf', batch: 'Sat-6:45am' },
  { id: 'STU-66116', name: 'Rahim', batch: 'Sat-6:45am' },
  { id: 'STU-66117', name: 'Karim', batch: 'Sat-6:45am' },
  { id: 'STU-66118', name: 'Jamal', batch: 'Sun-8:00am' },
  { id: 'STU-66119', name: 'Kamal', batch: 'Sun-8:00am' },
];

function Exams() {
  const [exams, setExams] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExam, setNewExam] = useState({
    name: '',
    batch: 'All Batches',
    subject: '',
    date: new Date().toISOString().substring(0, 10),
    totalMarks: '50',
    passMarks: '40'
  });
  
  const [selectedExamForMarks, setSelectedExamForMarks] = useState(null);
  const [examMarks, setExamMarks] = useState({});

  const handleAddExam = () => {
    if (!newExam.name || !newExam.subject) return;

    const examEntry = {
      id: `EXM-${Math.floor(Math.random() * 10000)}`,
      ...newExam
    };

    setExams([examEntry, ...exams]);
    setIsAddModalOpen(false);
    setNewExam({
      name: '',
      batch: 'All Batches',
      subject: '',
      date: new Date().toISOString().substring(0, 10),
      totalMarks: '50',
      passMarks: '40'
    });
  };

  const handleMarkChange = (studentId, marks) => {
    setExamMarks({
      ...examMarks,
      [`${selectedExamForMarks.id}_${studentId}`]: marks
    });
  };

  const uniqueBatches = new Set(exams.map(e => e.batch)).size;
  const uniqueSubjects = new Set(exams.map(e => e.subject)).size;

  return (
    <div className="exams-container">
      <div className="page-header">
        <div>
          <div className="fee-followup-tag">
            <FileText size={14} /> ASSESSMENT WORKSPACE
          </div>
          <h1>পরীক্ষা</h1>
          <p className="subtitle">Create exams, enter marks, and print marksheets.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Combined result</button>
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>যোগ</button>
        </div>
      </div>

      <div className="summary-cards exams-kpis">
        <div className="summary-card highlight-purple">
          <div>
            <div className="summary-label">Assessments</div>
            <div className="summary-value">{exams.length}</div>
            <div className="summary-date">In your exam register</div>
          </div>
          <FileText size={48} className="bg-icon" />
        </div>
        <div className="summary-card count">
          <div>
            <div className="summary-label">Batches assessed</div>
            <div className="summary-value">{uniqueBatches}</div>
            <div className="summary-date">Across recorded exams</div>
          </div>
        </div>
        <div className="summary-card count">
          <div>
            <div className="summary-label">Subjects</div>
            <div className="summary-value">{uniqueSubjects}</div>
            <div className="summary-date">Included in assessments</div>
          </div>
        </div>
      </div>

      <div className="balances-section">
        <div className="balances-header">
          <div>
            <h2>Exam register</h2>
            <p>Open an assessment to enter marks and prepare student results.</p>
          </div>
        </div>

        {exams.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>EXAM NAME</th>
                <th>BATCH & SUBJECT</th>
                <th>MARKS (PASS / TOTAL)</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {exams.map(exam => (
                <tr key={exam.id}>
                  <td>{exam.date}</td>
                  <td><strong>{exam.name}</strong></td>
                  <td>
                    {exam.batch} <br />
                    <span className="text-muted">{exam.subject}</span>
                  </td>
                  <td>{exam.passMarks} / {exam.totalMarks}</td>
                  <td>
                    <button className="btn-icon" onClick={() => setSelectedExamForMarks(exam)} title="Enter Marks"><ListChecks size={16} /></button>
                    <button className="btn-icon text-danger" title="Delete"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state-box">
            <div className="empty-icon-circle purple-icon">
              <span className="zero-icon">∅</span>
            </div>
            <p>No exams yet — create one to start entering marks.</p>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2>পরীক্ষা যোগ করুন</h2>
                <p>Create a new assessment register.</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>পরীক্ষার নাম (Exam Name)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Monthly Test 1"
                  value={newExam.name}
                  onChange={(e) => setNewExam({...newExam, name: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ব্যাচ (Batch)</label>
                  <select 
                    className="form-control"
                    value={newExam.batch}
                    onChange={(e) => setNewExam({...newExam, batch: e.target.value})}
                  >
                    <option value="All Batches">All Batches (সবার জন্য)</option>
                    <option value="Sat-6:45am">Sat-6:45am</option>
                    <option value="Sun-8:00am">Sun-8:00am</option>
                    <option value="Mon-4:00pm">Mon-4:00pm</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>বিষয় (Subject)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. ICT Chapter 1"
                    value={newExam.subject}
                    onChange={(e) => setNewExam({...newExam, subject: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>তারিখ (Date)</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={newExam.date}
                    onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>মোট নম্বর (Total Marks)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={newExam.totalMarks}
                    onChange={(e) => setNewExam({...newExam, totalMarks: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>পাস নম্বর (Pass Marks)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={newExam.passMarks}
                    onChange={(e) => setNewExam({...newExam, passMarks: e.target.value})}
                  />
                </div>
                <div className="form-group"></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleAddExam}>সেভ</button>
            </div>
          </div>
        </div>
      )}

      {selectedExamForMarks && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <div>
                <h2>{selectedExamForMarks.name} - নম্বর এন্ট্রি</h2>
                <p>{selectedExamForMarks.batch} • {selectedExamForMarks.subject} • Pass: {selectedExamForMarks.passMarks} / {selectedExamForMarks.totalMarks}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setSelectedExamForMarks(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>NAME</th>
                    <th>BATCH</th>
                    <th style={{ width: '150px' }}>MARKS OBTAINED</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STUDENTS
                    .filter(s => selectedExamForMarks.batch === 'All Batches' || s.batch === selectedExamForMarks.batch)
                    .map((student, index) => {
                      const marks = examMarks[`${selectedExamForMarks.id}_${student.id}`] || '';
                      const isPassed = marks !== '' && Number(marks) >= Number(selectedExamForMarks.passMarks);
                      const isFailed = marks !== '' && Number(marks) < Number(selectedExamForMarks.passMarks);
                      
                      return (
                        <tr key={student.id}>
                          <td>{index + 1}</td>
                          <td><strong>{student.name}</strong><br/><span className="text-muted">{student.id}</span></td>
                          <td>{student.batch}</td>
                          <td>
                            <input 
                              type="number" 
                              className="form-control" 
                              placeholder="Marks"
                              value={marks}
                              onChange={(e) => handleMarkChange(student.id, e.target.value)}
                            />
                          </td>
                          <td>
                            {isPassed && <span className="status-badge badge-present">Passed</span>}
                            {isFailed && <span className="status-badge badge-absent">Failed</span>}
                            {marks === '' && <span className="text-muted">-</span>}
                          </td>
                        </tr>
                      );
                  })}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setSelectedExamForMarks(null)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Exams;
