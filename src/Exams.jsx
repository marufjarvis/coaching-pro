import React, { useState, useEffect } from 'react';
import { FileText, Plus, X, Trash2, ListChecks, Printer, CheckCircle2 } from 'lucide-react';
import { dataStore } from './dataStore';
import './exams.css';

function Exams() {
  const [exams, setExams] = useState(() => dataStore.getExams());
  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [allStudents, setAllStudents] = useState(() => dataStore.getStudents());

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExam, setNewExam] = useState({
    name: '',
    batch: 'All Batches',
    subject: 'ICT',
    date: new Date().toISOString().substring(0, 10),
    totalMarks: '50',
    passMarks: '40'
  });
  
  const [selectedExamForMarks, setSelectedExamForMarks] = useState(null);
  const [marksState, setMarksState] = useState({});
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    const handleSync = () => {
      setExams(dataStore.getExams());
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

  const handleAddExam = () => {
    if (!newExam.name.trim() || !newExam.subject.trim()) {
      alert("Please enter Exam Name and Subject.");
      return;
    }

    dataStore.addExam(newExam);
    setIsAddModalOpen(false);
    setNewExam({
      name: '',
      batch: 'All Batches',
      subject: 'ICT',
      date: new Date().toISOString().substring(0, 10),
      totalMarks: '50',
      passMarks: '40'
    });
  };

  const handleDeleteExam = (examId) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      const updated = exams.filter(e => e.id !== examId);
      dataStore.saveExams(updated);
    }
  };

  const handleOpenMarksModal = (exam) => {
    setSelectedExamForMarks(exam);
    setMarksState(exam.marks || {});
  };

  const handleMarkChange = (studentId, val) => {
    setMarksState(prev => ({
      ...prev,
      [studentId]: val
    }));
  };

  const handleSaveMarks = () => {
    if (!selectedExamForMarks) return;
    dataStore.saveExamMarks(selectedExamForMarks.id, marksState);
    setSuccessToast(`Marks saved for ${selectedExamForMarks.name}!`);
    setTimeout(() => setSuccessToast(''), 3000);
    setSelectedExamForMarks(null);
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
          <p className="subtitle">Create exams, enter marks, and track student assessments.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> নতুন পরীক্ষা
          </button>
        </div>
      </div>

      {successToast && (
        <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '10px 16px', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {successToast}
        </div>
      )}

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
            <p>Open an assessment to enter marks and evaluate student performance.</p>
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
                <th>ENTRIES</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {exams.map(exam => {
                const markCount = exam.marks ? Object.keys(exam.marks).length : 0;
                return (
                  <tr key={exam.id}>
                    <td>{exam.date}</td>
                    <td><strong>{exam.name}</strong></td>
                    <td>
                      {exam.batch} <br />
                      <span className="text-muted">{exam.subject}</span>
                    </td>
                    <td>{exam.passMarks} / {exam.totalMarks}</td>
                    <td>
                      <span className="badge-gray">{markCount} marked</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-icon" onClick={() => handleOpenMarksModal(exam)} title="Enter Marks">
                        <ListChecks size={18} color="#0284c7" />
                      </button>
                      <button className="btn-icon text-danger" onClick={() => handleDeleteExam(exam.id)} title="Delete Exam">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
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

      {/* Add Exam Modal */}
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
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>পরীক্ষার নাম (Exam Name) <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Chapter 2 Quiz"
                  value={newExam.name}
                  onChange={(e) => setNewExam({...newExam, name: e.target.value})}
                  autoFocus
                />
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>ব্যাচ (Batch)</label>
                  <select 
                    className="form-control"
                    value={newExam.batch}
                    onChange={(e) => setNewExam({...newExam, batch: e.target.value})}
                  >
                    <option value="All Batches">All Batches (সবার জন্য)</option>
                    {batches.map(b => (
                      <option key={b.id || b.name} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group half">
                  <label>বিষয় (Subject)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. ICT"
                    value={newExam.subject}
                    onChange={(e) => setNewExam({...newExam, subject: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>তারিখ (Date)</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={newExam.date}
                    onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                  />
                </div>
                <div className="form-group half">
                  <label>মোট নম্বর (Total Marks)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={newExam.totalMarks}
                    onChange={(e) => setNewExam({...newExam, totalMarks: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>পাস নম্বর (Pass Marks)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={newExam.passMarks}
                  onChange={(e) => setNewExam({...newExam, passMarks: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleAddExam}>সেভ</button>
            </div>
          </div>
        </div>
      )}

      {/* Enter Marks Modal */}
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
              {allStudents
                .filter(s => selectedExamForMarks.batch === 'All Batches' || s.batch === selectedExamForMarks.batch)
                .length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>NAME</th>
                      <th>STUDENT ID</th>
                      <th>BATCH</th>
                      <th style={{ width: '160px' }}>MARKS OBTAINED</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allStudents
                      .filter(s => selectedExamForMarks.batch === 'All Batches' || s.batch === selectedExamForMarks.batch)
                      .map((student, index) => {
                        const score = marksState[student.id] !== undefined ? marksState[student.id] : '';
                        const isPassed = score !== '' && Number(score) >= Number(selectedExamForMarks.passMarks);
                        const isFailed = score !== '' && Number(score) < Number(selectedExamForMarks.passMarks);
                        
                        return (
                          <tr key={student.id}>
                            <td>{index + 1}</td>
                            <td><strong>{student.name}</strong></td>
                            <td>{student.id}</td>
                            <td>{student.batch}</td>
                            <td>
                              <input 
                                type="number" 
                                className="form-control" 
                                placeholder="Marks"
                                value={score}
                                onChange={(e) => handleMarkChange(student.id, e.target.value)}
                              />
                            </td>
                            <td>
                              {isPassed && <span className="status-badge badge-present">Passed</span>}
                              {isFailed && <span className="status-badge badge-absent">Failed</span>}
                              {score === '' && <span className="text-muted">-</span>}
                            </td>
                          </tr>
                        );
                    })}
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No students enrolled in batch {selectedExamForMarks.batch}.
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedExamForMarks(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveMarks}>Save Marks</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Exams;
