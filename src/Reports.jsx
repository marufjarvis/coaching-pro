import React, { useState, useEffect } from 'react';
import { BarChart2, Receipt, Ban, Wallet, ClipboardCheck, Users, FileQuestion, ChevronRight, X, Printer, Calendar, CalendarDays, Check, Copy, ArrowLeft, Search } from 'lucide-react';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './reports.css';

function Reports({ lang: propLang, currentUser }) {
  const { t } = useTranslation(propLang);
  const [activeReport, setActiveReport] = useState(null);
  const [payments, setPayments] = useState(() => dataStore.getPayments());
  const [students, setStudents] = useState(() => dataStore.getStudents());
  const [expenses, setExpenses] = useState(() => dataStore.getExpenses());
  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [exams, setExams] = useState(() => dataStore.getExams());
  const [attendance, setAttendance] = useState(() => dataStore.getAttendance());

  const [selectedBatch, setSelectedBatch] = useState(batches.length > 0 ? batches[0].name : '');
  const [selectedExamId, setSelectedExamId] = useState(exams.length > 0 ? exams[0].id : '');

  // Attendance Dual Mode (Date-wise & Monthly) States
  const [attendanceMode, setAttendanceMode] = useState('monthly'); // default to 'monthly' or 'dateWise'
  const [attendanceDate, setAttendanceDate] = useState(() => {
    // Look for latest recorded attendance date or default to today
    const allAtt = dataStore.getAttendance();
    const keys = Object.keys(allAtt);
    if (keys.length > 0) {
      const dates = keys.map(k => k.split('_')[0]).sort().reverse();
      if (dates[0]) return dates[0];
    }
    return new Date().toISOString().substring(0, 10);
  });
  const [attendanceMonth, setAttendanceMonth] = useState(() => new Date().toISOString().substring(0, 7));
  const [copiedPhoneKey, setCopiedPhoneKey] = useState(null);
  const [attendanceCopyToast, setAttendanceCopyToast] = useState(null);

  const handleCopyPhone = (number, key, label) => {
    if (!number) return;
    navigator.clipboard.writeText(number);
    setCopiedPhoneKey(key);
    setAttendanceCopyToast(`${label} ${propLang === 'EN' ? 'phone copied!' : 'মোবাইল নম্বর কপি হয়েছে!'}`);
    setTimeout(() => {
      setCopiedPhoneKey(null);
      setAttendanceCopyToast(null);
    }, 2000);
  };

  useEffect(() => {
    const handleSync = () => {
      setPayments(dataStore.getPayments());
      setStudents(dataStore.getStudents());
      setExpenses(dataStore.getExpenses());
      setBatches(dataStore.getBatches());
      setExams(dataStore.getExams());
      setAttendance(dataStore.getAttendance());
    };
    window.addEventListener('coaching-data-change', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('coaching-data-change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const totalCollected = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalExpenseAmount = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const netProfit = totalCollected - totalExpenseAmount;

  const dueStudents = students
    .map(s => ({ ...s, ...dataStore.calculateDue(s) }))
    .filter(s => s.isDue);
  const totalDues = dueStudents.reduce((sum, s) => sum + s.dueAmount, 0);

  const handlePrint = () => {
    window.print();
  };

  // Dedicated Full-Page Attendance Report (Matches Screenshots 1 & 2)
  if (activeReport === 'Attendance') {
    const currentBatch = selectedBatch || (batches.length > 0 ? batches[0].name : '');
    const filteredStudents = students.filter(s => {
      if (!currentBatch || currentBatch === 'All Batches') return true;
      return s.batch === currentBatch;
    });

    const getStatusForDay = (dayDateStr, studentId) => {
      const key1 = `${dayDateStr}_${currentBatch}`;
      if (attendance[key1] && attendance[key1][studentId]) return attendance[key1][studentId];
      const [y, m, d] = dayDateStr.split('-');
      const key2 = `${d}/${m}/${y}_${currentBatch}`;
      if (attendance[key2] && attendance[key2][studentId]) return attendance[key2][studentId];
      return null;
    };

    // Date-wise lookup:
    let datePresent = 0, dateAbsent = 0;
    filteredStudents.forEach(s => {
      const st = getStatusForDay(attendanceDate, s.id);
      if (st === 'Present' || st === 'Late') datePresent++;
      else if (st === 'Absent') dateAbsent++;
    });

    // Monthly calculations:
    const [yearStr, monthStr] = (attendanceMonth || new Date().toISOString().substring(0, 7)).split('-');
    const yearNum = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10);
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNamesBn = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const monthDisplayName = propLang === 'BN' 
      ? `${monthNamesBn[monthNum - 1]} ${yearNum}`
      : `${monthNamesEn[monthNum - 1]} ${yearNum}`;

    return (
      <div className="reports-container attendance-report-page">
        {/* Back Link to All Reports */}
        <button
          type="button"
          className="btn-back-reports"
          onClick={() => setActiveReport(null)}
        >
          <ArrowLeft size={16} />
          <span>{t.allReports || 'All reports'}</span>
        </button>

        {/* Page Header */}
        <div className="att-page-header-row">
          <div>
            <div className="att-insights-badge">
              <BarChart2 size={13} />
              <span>{t.insightsAndReports || 'INSIGHTS & REPORTS'}</span>
            </div>
            <h1>{t.attendanceReportCardTitle || 'Attendance Report'}</h1>
            <p>{t.attendanceReportSubtitle || 'Daily roll-call or monthly day grid by batch'}</p>
          </div>
          <button 
            type="button" 
            className="btn-print-pdf"
            onClick={handlePrint}
          >
            <Printer size={16} />
            <span>{t.printPdfBtn || 'Print / PDF'}</span>
          </button>
        </div>

        <div className="att-page-divider"></div>

        {/* Filter Card (Matches Screenshots 1 & 2) */}
        <div className="att-filter-card">
          {/* Segmented Button: Daily | Monthly */}
          <div className="att-toggle-group">
            <button
              type="button"
              className={`toggle-btn ${attendanceMode === 'dateWise' ? 'active' : ''}`}
              onClick={() => setAttendanceMode('dateWise')}
            >
              {t.daily || 'Daily'}
            </button>
            <button
              type="button"
              className={`toggle-btn ${attendanceMode === 'monthly' ? 'active' : ''}`}
              onClick={() => setAttendanceMode('monthly')}
            >
              {t.monthly || 'Monthly'}
            </button>
          </div>

          {/* Date Picker (Daily) or Month Picker (Monthly) */}
          {attendanceMode === 'dateWise' ? (
            <div className="att-filter-item">
              <label>{t.dateLabel || 'Date'}</label>
              <input
                type="date"
                className="form-control"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
              />
            </div>
          ) : (
            <div className="att-filter-item">
              <label>{t.monthLabel || 'Month'}</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                <select 
                  className="form-control"
                  style={{ padding: '0.35rem 0.5rem', width: '50%' }}
                  value={attendanceMonth.split('-')[1]}
                  onChange={(e) => setAttendanceMonth(`${attendanceMonth.split('-')[0]}-${e.target.value}`)}
                >
                  <option value="01">{propLang === 'EN' ? 'January' : 'জানুয়ারি'}</option>
                  <option value="02">{propLang === 'EN' ? 'February' : 'ফেব্রুয়ারি'}</option>
                  <option value="03">{propLang === 'EN' ? 'March' : 'মার্চ'}</option>
                  <option value="04">{propLang === 'EN' ? 'April' : 'এপ্রিল'}</option>
                  <option value="05">{propLang === 'EN' ? 'May' : 'মে'}</option>
                  <option value="06">{propLang === 'EN' ? 'June' : 'জুন'}</option>
                  <option value="07">{propLang === 'EN' ? 'July' : 'জুলাই'}</option>
                  <option value="08">{propLang === 'EN' ? 'August' : 'আগস্ট'}</option>
                  <option value="09">{propLang === 'EN' ? 'September' : 'সেপ্টেম্বর'}</option>
                  <option value="10">{propLang === 'EN' ? 'October' : 'অক্টোবর'}</option>
                  <option value="11">{propLang === 'EN' ? 'November' : 'নভেম্বর'}</option>
                  <option value="12">{propLang === 'EN' ? 'December' : 'ডিসেম্বর'}</option>
                </select>
                <select 
                  className="form-control"
                  style={{ padding: '0.35rem 0.5rem', width: '50%' }}
                  value={attendanceMonth.split('-')[0]}
                  onChange={(e) => setAttendanceMonth(`${e.target.value}-${attendanceMonth.split('-')[1]}`)}
                >
                  {Array.from({length: 10}, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Batch Select */}
          <div className="att-filter-item">
            <label>{t.batchSelectLabel || 'Batch'}</label>
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

          {/* Generate Button */}
          <button
            type="button"
            className="btn-generate-submit"
            onClick={() => {
              setAttendance(dataStore.getAttendance());
            }}
          >
            <Search size={16} />
            <span>{t.generateBtn || 'Generate'}</span>
          </button>
        </div>

        {/* MONTHLY VIEW (Screenshot 1) */}
        {attendanceMode === 'monthly' && (
          <div className="monthly-report-card">
            <div className="monthly-report-card-header">
              <h3>{t.attendanceReportCardTitle || 'Attendance Report'} — {monthDisplayName}</h3>
              <p>{filteredStudents.length} {propLang === 'BN' ? 'জন শিক্ষার্থী' : 'student(s)'} · {selectedBatch}</p>
            </div>

            <div className="table-responsive">
              <table className="monthly-grid-table">
                <thead>
                  <tr>
                    <th className="th-student">{t.student || 'Student'}</th>
                    {dayNumbers.map(d => (
                      <th key={d} className="th-day">{d}</th>
                    ))}
                    <th className="th-total">{t.total || 'Total'}</th>
                    <th className="th-pct">%</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => {
                      let presentCount = 0;
                      let classDaysCount = 0;
                      const dayCells = dayNumbers.map(d => {
                        const dayPadded = String(d).padStart(2, '0');
                        const dayDateStr = `${yearStr}-${String(monthNum).padStart(2, '0')}-${dayPadded}`;
                        const status = getStatusForDay(dayDateStr, student.id);

                        if (status) classDaysCount++;
                        if (status === 'Present' || status === 'Late') presentCount++;

                        return (
                          <td key={d}>
                            {status === 'Absent' ? (
                              <span className="cell-a">A</span>
                            ) : status === 'Present' ? (
                              <span className="cell-p">P</span>
                            ) : status === 'Late' ? (
                              <span className="cell-l">L</span>
                            ) : status === 'Leave' ? (
                              <span className="cell-v">V</span>
                            ) : (
                              <span className="cell-empty">—</span>
                            )}
                          </td>
                        );
                      });

                      const pct = classDaysCount > 0 ? Math.round((presentCount / classDaysCount) * 100) : 0;

                      return (
                        <tr key={student.id}>
                          <td className="td-student">
                            <strong>{student.name}</strong>
                          </td>
                          {dayCells}
                          <td className="th-total">
                            <strong>{presentCount}</strong>
                          </td>
                          <td className="th-pct">
                            <strong style={{ color: pct > 0 ? '#16a34a' : '#dc2626' }}>
                              {pct}%
                            </strong>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={daysInMonth + 3} style={{ padding: '2.5rem', color: '#64748b' }}>
                        {t.noStudentsInBatchMsg || 'No students found in this batch'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DAILY VIEW (Screenshot 2) */}
        {attendanceMode === 'dateWise' && (
          <div>
            {/* KPI Banner */}
            <div className="daily-summary-banner">
              <span><strong>Students:</strong> {filteredStudents.length}</span>
              <span className="txt-present"><strong>Present:</strong> {datePresent}</span>
              <span className="txt-absent"><strong>Absent:</strong> {dateAbsent}</span>
            </div>

            {/* Daily Table */}
            <div className="table-responsive">
              <table className="daily-records-table">
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>{propLang === 'BN' ? 'আইডি' : 'ID'}</th>
                    <th>{propLang === 'BN' ? 'শিক্ষার্থীর নাম' : 'NAME'}</th>
                    <th>{propLang === 'BN' ? 'ব্যাচ' : 'BATCH'}</th>
                    <th>{propLang === 'BN' ? 'স্ট্যাটাস' : 'STATUS'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => {
                      const status = getStatusForDay(attendanceDate, student.id);
                      return (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td className="cell-name">
                            <strong>{student.name}</strong>
                            {student.phone && <div className="sub-phone">{student.phone}</div>}
                          </td>
                          <td>{student.batch}</td>
                          <td>
                            {status === 'Present' ? (
                              <span className="status-badge badge-present">{propLang === 'BN' ? 'উপস্থিত' : 'Present'}</span>
                            ) : status === 'Absent' ? (
                              <span className="status-badge badge-absent">{propLang === 'BN' ? 'অনুপস্থিত' : 'Absent'}</span>
                            ) : status === 'Late' ? (
                              <span className="status-badge badge-late">{propLang === 'BN' ? 'দেরি' : 'Late'}</span>
                            ) : status === 'Leave' ? (
                              <span className="status-badge badge-leave">{propLang === 'BN' ? 'ছুটি' : 'Leave'}</span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                        {t.noStudentsInBatchMsg || (propLang === 'BN' ? 'এই ব্যাচে কোনো শিক্ষার্থী পাওয়া যায়নি' : 'No students found in this batch')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  const renderReportModalContent = () => {
    switch (activeReport) {
      case 'Collection':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{t.totalTransactions}</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{payments.length}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{t.totalCollections}</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>৳ {totalCollected.toLocaleString()}</div>
              </div>
            </div>
            <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.thDate}</th>
                  <th>{t.thReceipt}</th>
                  <th>{t.thStudent}</th>
                  <th>{t.thBatch}</th>
                  <th>{t.thMethod}</th>
                  <th style={{ textAlign: 'right' }}>{t.thAmount}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td>{p.date}</td>
                    <td><strong>{p.id}</strong></td>
                    <td>{p.studentName}</td>
                    <td>{p.batch || '—'}</td>
                    <td>{p.method}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>৳ {Number(p.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        );

      case 'Due':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: '#fef2f2', padding: '12px 16px', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#991b1b' }}>{t.dueStudentsCountTitle}</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#991b1b' }}>{dueStudents.length}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: '#991b1b' }}>{t.outstandingDues}</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626' }}>৳ {totalDues.toLocaleString()}</div>
              </div>
            </div>
            <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.thStudentId}</th>
                  <th>{t.thStudentName}</th>
                  <th>{t.thBatch}</th>
                  <th>{t.thPhone}</th>
                  <th>{t.thFeeType}</th>
                  <th style={{ textAlign: 'right' }}>{t.dueLabel}</th>
                </tr>
              </thead>
              <tbody>
                {dueStudents.length > 0 ? (
                  dueStudents.map(s => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.batch}</td>
                      <td>{s.phone || '—'}</td>
                      <td>{s.feeType === 'monthly' ? t.badgeMonthly : t.badgeCourse}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>৳ {s.dueAmount.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>{t.allDuesClearDesc}</td></tr>
                )}
              </tbody>
            </table>
            </div>
          </div>
        );

      case 'Expense':
        return (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#166534' }}>{t.monthlyRevenue}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16a34a' }}>৳ {totalCollected.toLocaleString()}</div>
              </div>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#991b1b' }}>{t.monthlyExpenses}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ef4444' }}>৳ {totalExpenseAmount.toLocaleString()}</div>
              </div>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#1e40af' }}>{t.netProfit}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: netProfit >= 0 ? '#2563eb' : '#dc2626' }}>
                  ৳ {netProfit.toLocaleString()}
                </div>
              </div>
            </div>
            <h4 style={{ margin: '0 0 10px 0' }}>{t.expenseLedgerSectionTitle}</h4>
            <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.thDate}</th>
                  <th>{t.expenseDescriptionLabel}</th>
                  <th>{t.expenseCategoryInputLabel}</th>
                  <th style={{ textAlign: 'right' }}>{t.thAmount}</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(e => (
                  <tr key={e.id}>
                    <td>{e.date}</td>
                    <td><strong>{e.title}</strong></td>
                    <td><span className="badge-gray">{e.category}</span></td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#dc2626' }}>৳ {Number(e.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        );

      case 'Attendance': {
        const currentBatchStudents = students.filter(s => s.batch === selectedBatch);
        const dateKey = `${attendanceDate}_${selectedBatch}`;
        const dateRecords = attendance[dateKey] || {};

        // Date-wise counts
        let datePresent = 0, dateAbsent = 0, dateLate = 0, dateLeave = 0;
        currentBatchStudents.forEach(s => {
          const st = dateRecords[s.id];
          if (st === 'Present') datePresent++;
          else if (st === 'Absent') dateAbsent++;
          else if (st === 'Late') dateLate++;
          else if (st === 'Leave') dateLeave++;
        });

        // Monthly calculations
        const monthPrefix = `${attendanceMonth}-`;
        const monthRecordedDates = Array.from(new Set(
          Object.keys(attendance)
            .filter(k => k.startsWith(monthPrefix) && k.endsWith(`_${selectedBatch}`))
            .map(k => k.split('_')[0])
        )).sort();

        const totalMonthClasses = monthRecordedDates.length;

        const monthlyStats = currentBatchStudents.map(student => {
          let present = 0, absent = 0, late = 0, leave = 0;
          monthRecordedDates.forEach(d => {
            const rec = attendance[`${d}_${selectedBatch}`] || {};
            const st = rec[student.id];
            if (st === 'Present') present++;
            else if (st === 'Absent') absent++;
            else if (st === 'Late') late++;
            else if (st === 'Leave') leave++;
          });
          const attended = present + late;
          const percentage = totalMonthClasses > 0 ? Math.round((attended / totalMonthClasses) * 100) : 0;
          return { student, present, absent, late, leave, percentage, totalClasses: totalMonthClasses };
        });

        const totalPresentAll = monthlyStats.reduce((sum, s) => sum + s.present, 0);
        const totalPossibleClasses = currentBatchStudents.length * totalMonthClasses;
        const monthAvgPercentage = totalPossibleClasses > 0 ? Math.round((totalPresentAll / totalPossibleClasses) * 100) + '%' : '—';

        return (
          <div className="attendance-report-view">
            {attendanceCopyToast && (
              <div className="copy-toast-badge" style={{ marginBottom: '0.5rem' }}>
                <Check size={14} />
                <span>{attendanceCopyToast}</span>
              </div>
            )}

            {/* Mode Selector & Filters Header */}
            <div className="att-report-mode-bar">
              <div className="attendance-view-toggle">
                <button
                  type="button"
                  className={`toggle-tab-btn ${attendanceMode === 'dateWise' ? 'active' : ''}`}
                  onClick={() => setAttendanceMode('dateWise')}
                >
                  <Calendar size={15} />
                  <span>{t.dateWiseAttendance || 'Date-wise'}</span>
                </button>
                <button
                  type="button"
                  className={`toggle-tab-btn ${attendanceMode === 'monthly' ? 'active' : ''}`}
                  onClick={() => setAttendanceMode('monthly')}
                >
                  <CalendarDays size={15} />
                  <span>{t.monthlyAttendance || 'Monthly'}</span>
                </button>
              </div>

              {/* Filters */}
              <div className="att-filter-row">
                <div className="form-group" style={{ margin: 0, minWidth: '180px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                    {t.batchSelectLabel}
                  </label>
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

                {attendanceMode === 'dateWise' ? (
                  <div className="form-group" style={{ margin: 0, minWidth: '160px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                      {t.selectDateLabel || 'Select Date'}
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="form-group" style={{ margin: 0, minWidth: '160px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                      {t.selectMonthLabel || 'Select Month'}
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                      <select 
                        className="form-control"
                        style={{ padding: '0.35rem 0.5rem', width: '50%' }}
                        value={attendanceMonth.split('-')[1]}
                        onChange={(e) => setAttendanceMonth(`${attendanceMonth.split('-')[0]}-${e.target.value}`)}
                      >
                        <option value="01">{propLang === 'EN' ? 'January' : 'জানুয়ারি'}</option>
                        <option value="02">{propLang === 'EN' ? 'February' : 'ফেব্রুয়ারি'}</option>
                        <option value="03">{propLang === 'EN' ? 'March' : 'মার্চ'}</option>
                        <option value="04">{propLang === 'EN' ? 'April' : 'এপ্রিল'}</option>
                        <option value="05">{propLang === 'EN' ? 'May' : 'মে'}</option>
                        <option value="06">{propLang === 'EN' ? 'June' : 'জুন'}</option>
                        <option value="07">{propLang === 'EN' ? 'July' : 'জুলাই'}</option>
                        <option value="08">{propLang === 'EN' ? 'August' : 'আগস্ট'}</option>
                        <option value="09">{propLang === 'EN' ? 'September' : 'সেপ্টেম্বর'}</option>
                        <option value="10">{propLang === 'EN' ? 'October' : 'অক্টোবর'}</option>
                        <option value="11">{propLang === 'EN' ? 'November' : 'নভেম্বর'}</option>
                        <option value="12">{propLang === 'EN' ? 'December' : 'ডিসেম্বর'}</option>
                      </select>
                      <select 
                        className="form-control"
                        style={{ padding: '0.35rem 0.5rem', width: '50%' }}
                        value={attendanceMonth.split('-')[0]}
                        onChange={(e) => setAttendanceMonth(`${e.target.value}-${attendanceMonth.split('-')[1]}`)}
                      >
                        {Array.from({length: 10}, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DATE-WISE ATTENDANCE VIEW */}
            {attendanceMode === 'dateWise' && (
              <div>
                <div className="att-kpis-mini-grid" style={{ marginBottom: '1rem' }}>
                  <div className="att-kpi-pill kpi-total">
                    <span className="kpi-label">{t.enrolledStudents || 'Total'}</span>
                    <span className="kpi-num">{currentBatchStudents.length}</span>
                  </div>
                  <div className="att-kpi-pill kpi-present">
                    <span className="kpi-label">{t.present}</span>
                    <span className="kpi-num">{datePresent}</span>
                  </div>
                  <div className="att-kpi-pill kpi-absent">
                    <span className="kpi-label">{t.absent}</span>
                    <span className="kpi-num">{dateAbsent}</span>
                  </div>
                  <div className="att-kpi-pill kpi-late">
                    <span className="kpi-label">{t.late} / {t.leave}</span>
                    <span className="kpi-num">{dateLate + dateLeave}</span>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>{t.thSerial}</th>
                        <th>{t.thStudentName}</th>
                        <th>{t.thStudentId}</th>
                        <th>{t.thStudentPhone}</th>
                        <th>{t.thGuardianPhone}</th>
                        <th>{t.thStatus}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBatchStudents.length > 0 ? (
                        currentBatchStudents.map((student, index) => {
                          const status = dateRecords[student.id];
                          const studentPhoneKey = `rep-dw-${student.id}-stu`;
                          const guardianPhoneKey = `rep-dw-${student.id}-guard`;
                          return (
                            <tr key={student.id}>
                              <td>{index + 1}</td>
                              <td><strong>{student.name}</strong></td>
                              <td><span className="text-muted" style={{ fontWeight: 600 }}>{student.id}</span></td>
                              <td>
                                {student.phone ? (
                                  <div className="copy-phone-cell">
                                    <span className="phone-number-text">{student.phone}</span>
                                    <button
                                      type="button"
                                      className={`btn-copy-phone ${copiedPhoneKey === studentPhoneKey ? 'copied' : ''}`}
                                      onClick={() => handleCopyPhone(student.phone, studentPhoneKey, propLang === 'EN' ? 'Student' : 'শিক্ষার্থী')}
                                      title={copiedPhoneKey === studentPhoneKey ? (propLang === 'EN' ? 'Copied!' : 'কপি হয়েছে!') : (propLang === 'EN' ? 'Click to copy student phone' : 'শিক্ষার্থীর মোবাইল নম্বর কপি করুন')}
                                    >
                                      {copiedPhoneKey === studentPhoneKey ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
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
                                      onClick={() => handleCopyPhone(student.guardianPhone, guardianPhoneKey, propLang === 'EN' ? 'Guardian' : 'অভিভাবক')}
                                      title={copiedPhoneKey === guardianPhoneKey ? (propLang === 'EN' ? 'Copied!' : 'কপি হয়েছে!') : (propLang === 'EN' ? 'Click to copy guardian phone' : 'অভিভাবকের মোবাইল নম্বর কপি করুন')}
                                    >
                                      {copiedPhoneKey === guardianPhoneKey ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-muted">—</span>
                                )}
                              </td>
                              <td>
                                {status ? (
                                  <span className={`status-badge ${status === 'Present' ? 'badge-present' : status === 'Absent' ? 'badge-absent' : status === 'Late' ? 'badge-late' : 'badge-leave'}`}>
                                    {status === 'Present' ? t.present : status === 'Absent' ? t.absent : status === 'Late' ? t.late : t.leave}
                                  </span>
                                ) : (
                                  <span className="badge-gray" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                    {propLang === 'EN' ? 'Not recorded' : 'হাজিরা নেওয়া হয়নি'}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>{t.noStudentsInBatchMsg}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MONTHLY ATTENDANCE VIEW */}
            {attendanceMode === 'monthly' && (
              <div>
                <div className="att-kpis-mini-grid" style={{ marginBottom: '1rem' }}>
                  <div className="att-kpi-pill kpi-total">
                    <span className="kpi-label">{t.enrolledStudents || 'Total Students'}</span>
                    <span className="kpi-num">{currentBatchStudents.length}</span>
                  </div>
                  <div className="att-kpi-pill kpi-classes">
                    <span className="kpi-label">{t.classDaysHeld || 'Classes Held'}</span>
                    <span className="kpi-num">{totalMonthClasses}</span>
                  </div>
                  <div className="att-kpi-pill kpi-rate">
                    <span className="kpi-label">{t.attendanceRateLabel || 'Batch Avg Rate'}</span>
                    <span className="kpi-num">{monthAvgPercentage}</span>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>{t.thSerial}</th>
                        <th>{t.thStudentName}</th>
                        <th>{t.thStudentId}</th>
                        <th>{t.thStudentPhone}</th>
                        <th>{t.thGuardianPhone}</th>
                        <th style={{ textAlign: 'center' }}>{t.presentDaysLabel || 'Present'}</th>
                        <th style={{ textAlign: 'center' }}>{t.absentDaysLabel || 'Absent'}</th>
                        <th style={{ textAlign: 'center' }}>{t.lateDaysLabel || 'Late'}/{t.leaveDaysLabel || 'Leave'}</th>
                        <th style={{ textAlign: 'center' }}>{t.classDaysHeld || 'Classes'}</th>
                        <th style={{ textAlign: 'right' }}>{t.attendanceRateLabel || 'Rate %'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyStats.length > 0 ? (
                        monthlyStats.map((item, index) => {
                          const student = item.student;
                          const studentPhoneKey = `rep-m-${student.id}-stu`;
                          const guardianPhoneKey = `rep-m-${student.id}-guard`;
                          return (
                            <tr key={student.id}>
                              <td>{index + 1}</td>
                              <td><strong>{student.name}</strong></td>
                              <td><span className="text-muted" style={{ fontWeight: 600 }}>{student.id}</span></td>
                              <td>
                                {student.phone ? (
                                  <div className="copy-phone-cell">
                                    <span className="phone-number-text">{student.phone}</span>
                                    <button
                                      type="button"
                                      className={`btn-copy-phone ${copiedPhoneKey === studentPhoneKey ? 'copied' : ''}`}
                                      onClick={() => handleCopyPhone(student.phone, studentPhoneKey, propLang === 'EN' ? 'Student' : 'শিক্ষার্থী')}
                                      title={copiedPhoneKey === studentPhoneKey ? (propLang === 'EN' ? 'Copied!' : 'কপি হয়েছে!') : (propLang === 'EN' ? 'Click to copy student phone' : 'শিক্ষার্থীর মোবাইল নম্বর কপি করুন')}
                                    >
                                      {copiedPhoneKey === studentPhoneKey ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
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
                                      onClick={() => handleCopyPhone(student.guardianPhone, guardianPhoneKey, propLang === 'EN' ? 'Guardian' : 'অভিভাবক')}
                                      title={copiedPhoneKey === guardianPhoneKey ? (propLang === 'EN' ? 'Copied!' : 'কপি হয়েছে!') : (propLang === 'EN' ? 'Click to copy guardian phone' : 'অভিভাবকের মোবাইল নম্বর কপি করুন')}
                                    >
                                      {copiedPhoneKey === guardianPhoneKey ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-muted">—</span>
                                )}
                              </td>
                              <td style={{ textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>
                                {item.present}
                              </td>
                              <td style={{ textAlign: 'center', color: '#dc2626', fontWeight: 700 }}>
                                {item.absent}
                              </td>
                              <td style={{ textAlign: 'center', color: '#d97706', fontWeight: 600 }}>
                                {item.late + item.leave}
                              </td>
                              <td style={{ textAlign: 'center', fontWeight: 600 }}>
                                {item.totalClasses}
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <span className={`status-badge ${item.percentage >= 80 ? 'badge-present' : item.percentage >= 60 ? 'badge-late' : 'badge-absent'}`} style={{ fontWeight: 700 }}>
                                  {item.percentage}%
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr><td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>{t.noStudentsInBatchMsg}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'StudentList':
        return (
          <div>
            <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.thId}</th>
                  <th>{t.thStudentName}</th>
                  <th>{t.thBatch}</th>
                  <th>{t.thPhone}</th>
                  <th>{t.guardianPhoneLabel}</th>
                  <th>{t.thFeeType}</th>
                  <th>{t.thStatus}</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.id}</strong></td>
                    <td>{s.name}</td>
                    <td>{s.batch}</td>
                    <td>{s.phone || '—'}</td>
                    <td>{s.guardianPhone || '—'}</td>
                    <td>৳ {s.feeAmount}</td>
                    <td>
                      <span className={`status-badge ${(s.status || 'Active').toLowerCase()}`}>
                        {s.status === 'Active' ? t.active : s.status === 'Inactive' ? t.inactive : s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        );

      case 'Exam':
        const selectedExam = exams.find(e => e.id === selectedExamId) || exams[0];
        return (
          <div>
            <div className="form-group" style={{ maxWidth: '300px', marginBottom: '1rem' }}>
              <label>{t.examsTitle}</label>
              <select className="form-control" value={selectedExamId} onChange={(e) => setSelectedExamId(e.target.value)}>
                {exams.map(e => <option key={e.id} value={e.id}>{e.name} ({e.subject})</option>)}
              </select>
            </div>
            {selectedExam && (
              <>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px' }}>
                  <div><strong>{t.thBatch}:</strong> {selectedExam.batch}</div>
                  <div><strong>{t.thSubject}:</strong> {selectedExam.subject}</div>
                  <div><strong>{t.totalMarksInputLabel}:</strong> {selectedExam.totalMarks}</div>
                  <div><strong>{t.passMarksInputLabel}:</strong> {selectedExam.passMarks}</div>
                </div>
                <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.thId}</th>
                      <th>{t.thStudentName}</th>
                      <th>{t.marksColumn}</th>
                      <th>{t.statusColumn}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => {
                      const marks = selectedExam.marks ? selectedExam.marks[student.id] : undefined;
                      const isPassed = marks !== undefined && Number(marks) >= Number(selectedExam.passMarks);
                      return (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td><strong>{student.name}</strong></td>
                          <td>{marks !== undefined ? marks : '—'}</td>
                          <td>
                            {marks === undefined ? (
                              <span className="text-muted">{t.notGraded}</span>
                            ) : isPassed ? (
                              <span className="status-badge badge-present">{t.passed}</span>
                            ) : (
                              <span className="status-badge badge-absent">{t.failed}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              </>
            )}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="reports-container">
      <div className="page-header">
        <div>
          <div className="fee-followup-tag">
            <BarChart2 size={14} /> {t.reportsTag}
          </div>
          <h1>{t.reportsTitle}</h1>
          <p className="subtitle">{t.reportsSubtitle}</p>
        </div>
      </div>

      <div className="reports-section">
        <h3 className="reports-section-title">{t.financialPerformanceHeading}</h3>
        <p className="reports-section-subtitle">{t.financialPerformanceSubheading}</p>
        
        <div className="reports-grid">
          {/* Collection Report */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#3b82f6', backgroundColor: '#eff6ff' }}>
              <Receipt size={24} />
            </div>
            <h3>{t.collectionReportCardTitle}</h3>
            <p>{t.collectionReportCardDesc} (৳ {totalCollected.toLocaleString()})</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Collection')}>
              {t.openReportBtn} <ChevronRight size={16} />
            </button>
            <div className="report-watermark">
              <Receipt size={120} strokeWidth={1} />
            </div>
          </div>

          {/* Due Report */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#ef4444', backgroundColor: '#fef2f2' }}>
              <Ban size={24} />
            </div>
            <h3>{t.dueReportCardTitle}</h3>
            <p>{t.dueReportCardDesc} (৳ {totalDues.toLocaleString()})</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Due')}>
              {t.openReportBtn} <ChevronRight size={16} />
            </button>
            <div className="report-watermark">
              <Ban size={120} strokeWidth={1} />
            </div>
          </div>

          {/* Expense & Profit */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#0f766e', backgroundColor: '#f0fdfa' }}>
              <Wallet size={24} />
            </div>
            <h3>{t.expenseProfitCardTitle}</h3>
            <p>{t.expenseProfitCardDesc} (৳ {netProfit.toLocaleString()})</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Expense')}>
              {t.openReportBtn} <ChevronRight size={16} />
            </button>
            <div className="report-watermark">
              <Wallet size={120} strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>

      <div className="reports-section" style={{ marginTop: '3rem' }}>
        <h3 className="reports-section-title">{t.academicRecordsHeading}</h3>
        <p className="reports-section-subtitle">{t.academicRecordsSubheading}</p>
        
        <div className="reports-grid">
          {/* Attendance Report */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#10b981', backgroundColor: '#ecfdf5' }}>
              <ClipboardCheck size={24} />
            </div>
            <h3>{t.attendanceReportCardTitle}</h3>
            <p>{t.attendanceReportCardDesc}</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Attendance')}>
              {t.openReportBtn} <ChevronRight size={16} />
            </button>
            <div className="report-watermark">
              <ClipboardCheck size={120} strokeWidth={1} />
            </div>
          </div>

          {/* Student List Report */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#d97706', backgroundColor: '#fffbeb' }}>
              <Users size={24} />
            </div>
            <h3>{t.studentRosterCardTitle}</h3>
            <p>{t.studentRosterCardDesc}</p>
            <button className="btn-open-report" onClick={() => setActiveReport('StudentList')}>
              {t.openReportBtn} <ChevronRight size={16} />
            </button>
            <div className="report-watermark">
              <Users size={120} strokeWidth={1} />
            </div>
          </div>

          {/* Exam Mark Sheet */}
          <div className="report-card">
            <div className="report-icon-wrapper" style={{ color: '#6366f1', backgroundColor: '#eef2ff' }}>
              <FileQuestion size={24} />
            </div>
            <h3>{t.examMarkSheetCardTitle}</h3>
            <p>{t.examMarkSheetCardDesc}</p>
            <button className="btn-open-report" onClick={() => setActiveReport('Exam')}>
              {t.openReportBtn} <ChevronRight size={16} />
            </button>
            <div className="report-watermark">
              <FileQuestion size={120} strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>

      {activeReport && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <div>
                <h2>{activeReport} {t.reportsTitle}</h2>
                <p>{t.liveReportSubtitle}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setActiveReport(null)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ minHeight: '300px' }}>
              {renderReportModalContent()}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setActiveReport(null)}>{t.close}</button>
              <button className="btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Printer size={16} /> {t.printReportBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
