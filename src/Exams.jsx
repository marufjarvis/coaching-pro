import React, { useState, useEffect } from 'react';
import { FileText, Plus, X, Trash2, ListChecks, Printer, CheckCircle2 } from 'lucide-react';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './exams.css';

function Exams({ lang: propLang }) {
  const { t } = useTranslation(propLang);
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
    if (window.confirm(t.deleteExamConfirm)) {
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
    setSuccessToast(t.marksSavedSuccess);
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
            <FileText size={14} /> {t.assessmentTag}
          </div>
          <h1>{t.examsTitle}</h1>
          <p className="subtitle">{t.examsSubtitle}</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> {t.newExamBtn}
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
            <div className="summary-label">{t.totalExamsStat}</div>
            <div className="summary-value">{exams.length}</div>
            <div className="summary-date">{t.examsTitle}</div>
          </div>
          <FileText size={48} className="bg-icon" />
        </div>
        <div className="summary-card count">
          <div>
            <div className="summary-label">{t.batchesCoveredStat}</div>
            <div className="summary-value">{uniqueBatches}</div>
            <div className="summary-date">{t.batches}</div>
          </div>
        </div>
        <div className="summary-card count">
          <div>
            <div className="summary-label">{t.activeSubjectsStat}</div>
            <div className="summary-value">{uniqueSubjects}</div>
            <div className="summary-date">{t.thSubject}</div>
          </div>
        </div>
      </div>

      <div className="balances-section">
        <div className="balances-header">
          <div>
            <h2>{t.allExamsSectionTitle}</h2>
            <p>{t.allExamsSectionDesc}</p>
          </div>
        </div>

        {exams.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.thDate}</th>
                <th>{t.examNameInputLabel}</th>
                <th>{t.thBatch} & {t.thSubject}</th>
                <th>{t.totalMarksInputLabel}</th>
                <th>{t.marksColumn}</th>
                <th style={{ textAlign: 'right' }}>{t.thActions}</th>
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
                      <span className="badge-gray">{markCount} {t.done}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-icon" onClick={() => handleOpenMarksModal(exam)} title={t.enterMarksBtn}>
                        <ListChecks size={18} color="#0284c7" />
                      </button>
                      <button className="btn-icon text-danger" onClick={() => handleDeleteExam(exam.id)} title={t.delete}>
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
            <p>{t.allExamsSectionDesc}</p>
          </div>
        )}
      </div>

      {/* Add Exam Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2>{t.createExamModalTitle}</h2>
                <p>{t.createExamModalDesc}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{t.examNameInputLabel} <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder={t.examNamePlaceholder}
                  value={newExam.name}
                  onChange={(e) => setNewExam({...newExam, name: e.target.value})}
                  autoFocus
                />
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>{t.batchSelectLabel}</label>
                  <select 
                    className="form-control"
                    value={newExam.batch}
                    onChange={(e) => setNewExam({...newExam, batch: e.target.value})}
                  >
                    <option value="All Batches">{t.allBatchesFilter}</option>
                    {batches.map(b => (
                      <option key={b.id || b.name} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group half">
                  <label>{t.subjectInputLabel}</label>
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
                  <label>{t.dateInputLabelExam}</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={newExam.date}
                    onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                  />
                </div>
                <div className="form-group half">
                  <label>{t.totalMarksInputLabel}</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={newExam.totalMarks}
                    onChange={(e) => setNewExam({...newExam, totalMarks: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t.passMarksInputLabel}</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={newExam.passMarks}
                  onChange={(e) => setNewExam({...newExam, passMarks: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>{t.cancel}</button>
              <button className="btn-save" onClick={handleAddExam}>{t.save}</button>
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
                <h2>{selectedExamForMarks.name} - {t.enterMarksModalTitle}</h2>
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
                      <th>{t.thSerial}</th>
                      <th>{t.thStudentName}</th>
                      <th>{t.thStudentId}</th>
                      <th>{t.thBatch}</th>
                      <th style={{ width: '160px' }}>{t.marksColumn}</th>
                      <th>{t.statusColumn}</th>
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
                                placeholder={t.marksColumn}
                                value={score}
                                onChange={(e) => handleMarkChange(student.id, e.target.value)}
                              />
                            </td>
                            <td>
                              {isPassed && <span className="status-badge badge-present">{t.passed}</span>}
                              {isFailed && <span className="status-badge badge-absent">{t.failed}</span>}
                              {score === '' && <span className="text-muted">-</span>}
                            </td>
                          </tr>
                        );
                    })}
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  {t.noStudentsInBatchMsg}
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedExamForMarks(null)}>{t.cancel}</button>
              <button className="btn-primary" onClick={handleSaveMarks}>{t.save}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Exams;
