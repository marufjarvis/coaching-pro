// src/StudentDashboard.jsx
// Dedicated Student Dashboard for Coaching Pro (Maruf's ICT Care)

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  CalendarCheck, 
  CreditCard, 
  FileText, 
  User, 
  Phone, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Printer, 
  LogOut, 
  BookOpen, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Calendar,
  Wallet,
  Globe
} from 'lucide-react';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './student-dashboard.css';

function StudentDashboard({ student: initialStudent, onLogout, lang: propLang }) {
  const { t, lang, setLang } = useTranslation(propLang);
  const [activeTab, setActiveTab] = useState('overview');

  // Load student details from store or prop
  const [student, setStudent] = useState(() => {
    const fresh = dataStore.getStudents().find(s => s.id === initialStudent?.id);
    return fresh || initialStudent;
  });

  const [payments, setPayments] = useState(() => {
    return dataStore.getPayments().filter(p => p.studentId === student?.id || p.studentName === student?.name);
  });

  const [attendanceStats, setAttendanceStats] = useState(() => {
    return dataStore.getStudentAttendanceStats(student?.id);
  });

  const [allAttendance, setAllAttendance] = useState(() => dataStore.getAttendance());
  const [exams, setExams] = useState(() => dataStore.getExams());
  const [settings, setSettings] = useState(() => dataStore.getSettings());

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const handleSync = () => {
      const fresh = dataStore.getStudents().find(s => s.id === student?.id);
      if (fresh) setStudent(fresh);
      setPayments(dataStore.getPayments().filter(p => p.studentId === student?.id || p.studentName === student?.name));
      setAttendanceStats(dataStore.getStudentAttendanceStats(student?.id));
      setAllAttendance(dataStore.getAttendance());
      setExams(dataStore.getExams());
      setSettings(dataStore.getSettings());
    };

    window.addEventListener('coaching-data-change', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('coaching-data-change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [student?.id]);

  if (!student) return null;

  // Financial calculations
  const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalFee = Number(student.feeAmount) || 0;
  const totalDue = Math.max(0, totalFee - totalPaid);

  // Attendance Records for this student
  const studentAttendanceList = [];
  Object.entries(allAttendance).forEach(([date, batchMap]) => {
    if (batchMap && batchMap[student.id]) {
      studentAttendanceList.push({
        date,
        status: batchMap[student.id]
      });
    }
  });
  // Sort by date descending
  studentAttendanceList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Exam Marks for this student
  const studentExamRecords = [];
  exams.forEach(exam => {
    if (exam.marks && exam.marks[student.id] !== undefined) {
      const mark = Number(exam.marks[student.id]);
      const passMark = Number(exam.passMarks) || 20;
      const totalMarks = Number(exam.totalMarks) || 50;
      const percentage = Math.round((mark / totalMarks) * 100);
      studentExamRecords.push({
        id: exam.id,
        name: exam.name,
        subject: exam.subject,
        date: exam.date,
        totalMarks,
        passMarks: passMark,
        obtained: mark,
        percentage,
        isPassed: mark >= passMark
      });
    }
  });

  return (
    <div className="student-dash-container">
      {/* Top Header */}
      <header className="student-dash-header">
        <div className="student-dash-brand">
          <div className="student-dash-logo">
            <img src="/logo.png" alt="Maruf's ICT Care Logo" />
          </div>
          <div>
            <div className="student-dash-brand-name">Maruf's ICT Care</div>
            <div className="student-dash-brand-tagline">ICT মুখস্ত নয়, এসো শিখি</div>
          </div>
        </div>

        <div className="student-dash-header-actions">
          <button 
            type="button" 
            onClick={() => { window.location.hash = '#/'; }}
            style={{
              background: 'rgba(2, 132, 199, 0.1)',
              border: '1px solid rgba(2, 132, 199, 0.3)',
              color: '#0284c7',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="কোচিং এর মূল ওয়েবসাইট দেখুন"
          >
            <Globe size={15} /> <span>মূল ওয়েবসাইট</span>
          </button>

          <div className="student-dash-user-badge">
            <div className="student-dash-user-avatar">
              {student.name ? student.name.substring(0, 2).toUpperCase() : 'ST'}
            </div>
            <span>{student.name}</span>
          </div>

          <button 
            type="button" 
            className="btn-student-logout"
            onClick={() => {
              if (window.confirm('আপনি কি শিক্ষার্থী পোর্টাল থেকে লগআউট করতে চান?')) {
                if (onLogout) onLogout();
              }
            }}
            title="Log out"
          >
            <LogOut size={16} />
            <span>লগআউট</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="student-dash-main">
        {/* Hero Card */}
        <div className="student-hero-card">
          <div className="student-hero-content">
            <div className="student-hero-badge">
              <Sparkles size={14} />
              <span>শিক্ষার্থী পোর্টাল (Student Portal)</span>
            </div>
            <h1 className="student-hero-title">
              {lang === 'EN' ? `Welcome, ${student.name}!` : `স্বাগতম, ${student.name}!`}
            </h1>
            <p className="student-hero-subtitle">
              মারুফ'স আইসিটি কেয়ার — আপনার সকল ক্লাস হাজিরা, পরীক্ষার ফলাফল ও ফি হিস্ট্রি এক নজরে।
            </p>

            <div className="student-hero-pills">
              <span className="hero-pill">আইডি: <strong>{student.id}</strong></span>
              <span className="hero-pill">ব্যাচ: <strong>{student.batch}</strong></span>
              <span className="hero-pill">পদ্ধতি: <strong>{student.feeType === 'course' ? 'কোর্স সিস্টেম' : 'মাসিক ফি'}</strong></span>
              <span className="hero-pill">
                ভর্তি: <strong>{student.admissionDate || '০৮/১০/২০২৬'}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Quick KPI Overview Cards */}
        <div className="student-kpi-grid">
          {/* 1. Attendance Rate */}
          <div className="student-kpi-card" onClick={() => setActiveTab('attendance')} style={{ cursor: 'pointer' }}>
            <div className="kpi-icon-wrap kpi-icon-blue">
              <CalendarCheck size={26} />
            </div>
            <div className="kpi-details">
              <span className="kpi-label">হাজিরা হার</span>
              <span className="kpi-value">{attendanceStats.percentage}%</span>
              <span className="kpi-subtext">
                {attendanceStats.present} উপস্থিত / {attendanceStats.total} ক্লাস
              </span>
            </div>
          </div>

          {/* 2. Fee & Due Status */}
          <div className="student-kpi-card" onClick={() => setActiveTab('payments')} style={{ cursor: 'pointer' }}>
            <div className={`kpi-icon-wrap ${totalDue > 0 ? 'kpi-icon-amber' : 'kpi-icon-green'}`}>
              <Wallet size={26} />
            </div>
            <div className="kpi-details">
              <span className="kpi-label">পেমেন্ট অবস্থা</span>
              <span className="kpi-value" style={{ color: totalDue > 0 ? '#d97706' : '#16a34a' }}>
                {totalDue > 0 ? `৳ ${totalDue.toLocaleString()} বকেয়া` : 'পরিশোধিত (Clear)'}
              </span>
              <span className="kpi-subtext">পরিশোধ: ৳ {totalPaid.toLocaleString()}</span>
            </div>
          </div>

          {/* 3. Exam Count */}
          <div className="student-kpi-card" onClick={() => setActiveTab('exams')} style={{ cursor: 'pointer' }}>
            <div className="kpi-icon-wrap kpi-icon-purple">
              <FileText size={26} />
            </div>
            <div className="kpi-details">
              <span className="kpi-label">পরীক্ষার রেকর্ড</span>
              <span className="kpi-value">{studentExamRecords.length} টি</span>
              <span className="kpi-subtext">ICT অধ্যায়ভিত্তিক টেস্ট</span>
            </div>
          </div>

          {/* 4. Batch Routine */}
          <div className="student-kpi-card" onClick={() => setActiveTab('profile')} style={{ cursor: 'pointer' }}>
            <div className="kpi-icon-wrap kpi-icon-green">
              <Clock size={26} />
            </div>
            <div className="kpi-details">
              <span className="kpi-label">ব্যাচের সময়</span>
              <span className="kpi-value" style={{ fontSize: '1.15rem' }}>{student.batch}</span>
              <span className="kpi-subtext">নির্ধারিত সময়সূচী</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="student-tab-bar">
          <button 
            type="button" 
            className={`student-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={16} />
            <span>সারসংক্ষেপ (Overview)</span>
          </button>

          <button 
            type="button" 
            className={`student-tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <CalendarCheck size={16} />
            <span>হাজিরা রিপোর্ট ({attendanceStats.total})</span>
          </button>

          <button 
            type="button" 
            className={`student-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <CreditCard size={16} />
            <span>ফি ও রসিদ ({payments.length})</span>
          </button>

          <button 
            type="button" 
            className={`student-tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveTab('exams')}
          >
            <FileText size={16} />
            <span>পরীক্ষার ফলাফল ({studentExamRecords.length})</span>
          </button>

          <button 
            type="button" 
            className={`student-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} />
            <span>আমার তথ্য</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* Quick Fee Alert if Due */}
            {totalDue > 0 && (
              <div style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={28} color="#d97706" />
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', color: '#92400e', fontSize: '1rem', fontWeight: 700 }}>
                      বকেয়া ফি অনুস্মারক (Fee Due Reminder)
                    </h4>
                    <p style={{ margin: 0, color: '#b45309', fontSize: '0.88rem' }}>
                      আপনার চলতি বকেয়া ফি <strong>৳ {totalDue.toLocaleString()}</strong> টাকা। অনুগ্রহ করে দ্রুত পরিশোধ করুন।
                    </p>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-print-receipt"
                  onClick={() => setActiveTab('payments')}
                >
                  ফি বিবরণ দেখুন <ChevronRight size={14} />
                </button>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {/* Recent Attendance Preview */}
              <div className="student-section-card">
                <div className="section-header-wrap">
                  <h3><CalendarCheck size={18} color="#0284c7" /> সাম্প্রতিক হাজিরা</h3>
                  <button type="button" className="btn-print-receipt" onClick={() => setActiveTab('attendance')}>
                    সকল হাজিরা <ChevronRight size={14} />
                  </button>
                </div>
                {studentAttendanceList.length > 0 ? (
                  <div className="student-table-responsive">
                    <table className="student-custom-table">
                      <thead>
                        <tr>
                          <th>তারিখ</th>
                          <th>স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentAttendanceList.slice(0, 5).map((att, idx) => (
                          <tr key={idx}>
                            <td>{att.date}</td>
                            <td>
                              <span className={`badge-status ${
                                att.status === 'Present' ? 'badge-present' :
                                att.status === 'Late' ? 'badge-late' : 'badge-absent'
                              }`}>
                                {att.status === 'Present' ? 'উপস্থিত' : att.status === 'Late' ? 'বিলম্বিত' : 'অনুপস্থিত'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
                    এখনও কোনো হাজিরার রেকর্ড নেই।
                  </p>
                )}
              </div>

              {/* Recent Payments Preview */}
              <div className="student-section-card">
                <div className="section-header-wrap">
                  <h3><CreditCard size={18} color="#16a34a" /> সাম্প্রতিক পেমেন্ট রসিদ</h3>
                  <button type="button" className="btn-print-receipt" onClick={() => setActiveTab('payments')}>
                    সকল রসিদ <ChevronRight size={14} />
                  </button>
                </div>
                {payments.length > 0 ? (
                  <div className="student-table-responsive">
                    <table className="student-custom-table">
                      <thead>
                        <tr>
                          <th>রসিদ নং</th>
                          <th>তারিখ</th>
                          <th>টাকা</th>
                          <th>মাধ্যম</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.slice(0, 5).map((p) => (
                          <tr key={p.id}>
                            <td><strong>{p.id}</strong></td>
                            <td>{p.date}</td>
                            <td style={{ fontWeight: 700, color: '#16a34a' }}>৳ {p.amount.toLocaleString()}</td>
                            <td>{p.method}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
                    এখনও কোনো পেমেন্টের রেকর্ড নেই।
                  </p>
                )}
              </div>
            </div>

            {/* Helpline Section */}
            <div className="student-helpline-card">
              <div className="helpline-text">
                <h4>কোচিং হেল্পলাইন ও অফিস সহায়তা</h4>
                <p>যেকোনো জিজ্ঞাসা বা সহায়তার জন্য মারুফ স্যারের সাথে সরাসরি যোগাযোগ করুন।</p>
              </div>
              <a href="tel:01723619524" className="btn-call-coach">
                <Phone size={16} />
                কল করুন: 01723619524
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE HISTORY */}
        {activeTab === 'attendance' && (
          <div className="student-section-card">
            <div className="section-header-wrap">
              <h3><CalendarCheck size={20} color="#0284c7" /> পূর্ণাঙ্গ হাজিরা বিবরণী</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="badge-status badge-present">মোট উপস্থিতি: {attendanceStats.present}</span>
                <span className="badge-status badge-absent">অনুপস্থিত: {attendanceStats.absent}</span>
              </div>
            </div>

            {studentAttendanceList.length > 0 ? (
              <div className="student-table-responsive">
                <table className="student-custom-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>তারিখ (Date)</th>
                      <th>হাজিরার স্ট্যাটাস</th>
                      <th>ব্যাচ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentAttendanceList.map((att, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td><strong>{att.date}</strong></td>
                        <td>
                          <span className={`badge-status ${
                            att.status === 'Present' ? 'badge-present' :
                            att.status === 'Late' ? 'badge-late' : 'badge-absent'
                          }`}>
                            {att.status === 'Present' && <CheckCircle2 size={13} style={{ marginRight: '3px' }} />}
                            {att.status === 'Absent' && <XCircle size={13} style={{ marginRight: '3px' }} />}
                            {att.status === 'Present' ? 'উপস্থিত (Present)' : att.status === 'Late' ? 'বিলম্বিত (Late)' : 'অনুপস্থিত (Absent)'}
                          </span>
                        </td>
                        <td>{student.batch}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ textAlign: 'center', padding: '2rem 0', color: '#64748b' }}>
                এখনও কোনো হাজিরার রেকর্ড নথিভুক্ত হয়নি।
              </p>
            )}
          </div>
        )}

        {/* TAB 3: PAYMENTS & RECEIPTS */}
        {activeTab === 'payments' && (
          <div>
            {/* Fee summary strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>মোট নির্ধারিত ফি</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  ৳ {totalFee.toLocaleString()}
                </div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>মোট পরিশোধিত টাকা</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
                  ৳ {totalPaid.toLocaleString()}
                </div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: totalDue > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>অবশিষ্ট বকেয়া ফি</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: totalDue > 0 ? '#dc2626' : '#16a34a', marginTop: '4px' }}>
                  ৳ {totalDue.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="student-section-card">
              <div className="section-header-wrap">
                <h3><CreditCard size={20} color="#16a34a" /> পেমেন্ট ও মানি রিসিট হিস্ট্রি</h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>সর্বমোট লেনদেন: {payments.length} টি</span>
              </div>

              {payments.length > 0 ? (
                <div className="student-table-responsive">
                  <table className="student-custom-table">
                    <thead>
                      <tr>
                        <th>রসিদ নং (Receipt)</th>
                        <th>তারিখ ও সময়</th>
                        <th>পরিমাণ (Amount)</th>
                        <th>মাধ্যম</th>
                        <th>বিবরণ (Note)</th>
                        <th>অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id}>
                          <td><strong>{p.id}</strong></td>
                          <td>{p.date} {p.time ? `• ${p.time}` : ''}</td>
                          <td style={{ fontWeight: 700, color: '#16a34a' }}>৳ {p.amount.toLocaleString()}</td>
                          <td>
                            <span style={{
                              background: '#f1f5f9',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.82rem',
                              fontWeight: 600
                            }}>
                              {p.method}
                            </span>
                          </td>
                          <td>{p.note || 'কোচিং ফি'}</td>
                          <td>
                            <button
                              type="button"
                              className="btn-print-receipt"
                              onClick={() => setSelectedReceipt(p)}
                            >
                              <Printer size={13} />
                              রসিদ প্রিন্ট
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ textAlign: 'center', padding: '2rem 0', color: '#64748b' }}>
                  এখনও কোনো পেমেন্টের রেকর্ড নেই।
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: EXAMS & RESULTS */}
        {activeTab === 'exams' && (
          <div className="student-section-card">
            <div className="section-header-wrap">
              <h3><FileText size={20} color="#9333ea" /> পরীক্ষার ফলাফল ও মার্কশীট</h3>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>অংশগ্রহণকৃত পরীক্ষা: {studentExamRecords.length} টি</span>
            </div>

            {studentExamRecords.length > 0 ? (
              <div className="student-table-responsive">
                <table className="student-custom-table">
                  <thead>
                    <tr>
                      <th>পরীক্ষার নাম</th>
                      <th>বিষয়</th>
                      <th>তারিখ</th>
                      <th>পূর্ণমান</th>
                      <th>প্রাপ্ত নম্বর</th>
                      <th>শতাংশ (%)</th>
                      <th>ফলাফল</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentExamRecords.map((rec) => (
                      <tr key={rec.id}>
                        <td><strong>{rec.name}</strong></td>
                        <td>{rec.subject}</td>
                        <td>{rec.date}</td>
                        <td>{rec.totalMarks}</td>
                        <td style={{ fontWeight: 800, fontSize: '1rem', color: '#0284c7' }}>
                          {rec.obtained}
                        </td>
                        <td>{rec.percentage}%</td>
                        <td>
                          <span className={`badge-status ${rec.isPassed ? 'badge-present' : 'badge-absent'}`}>
                            {rec.isPassed ? 'উত্তীর্ণ (Pass)' : 'পুনঃপরীক্ষা (Fail)'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ textAlign: 'center', padding: '2rem 0', color: '#64748b' }}>
                এখনও কোনো পরীক্ষার ফলাফল প্রকাশিত হয়নি।
              </p>
            )}
          </div>
        )}

        {/* TAB 5: MY PROFILE */}
        {activeTab === 'profile' && (
          <div className="student-section-card">
            <div className="section-header-wrap">
              <h3><User size={20} color="#0284c7" /> শিক্ষার্থীর ব্যক্তিগত তথ্য বিবরণী</h3>
              <span className="badge-status badge-present">সক্রিয় শিক্ষার্থী (Active)</span>
            </div>

            <div className="student-profile-info-grid">
              <div className="profile-info-row">
                <span className="profile-info-label">শিক্ষার্থীর পুরো নাম:</span>
                <span className="profile-info-val">{student.name}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">শিক্ষার্থী আইডি:</span>
                <span className="profile-info-val">{student.id}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">ব্যাচ:</span>
                <span className="profile-info-val">{student.batch}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">মোবাইল নম্বর:</span>
                <span className="profile-info-val">{student.phone || '—'}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">অভিভাবকের মোবাইল নম্বর:</span>
                <span className="profile-info-val">{student.guardianPhone || '—'}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">ফি প্রদানের ধরন:</span>
                <span className="profile-info-val">{student.feeType === 'course' ? 'এককালীন/কোর্স ফি' : 'মাসিক বেতন'}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">ভর্তির তারিখ:</span>
                <span className="profile-info-val">{student.admissionDate || '০৮/১০/২০২৬'}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">কোচিং সেন্টারের নাম:</span>
                <span className="profile-info-val">Maruf's ICT Care</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PRINT RECEIPT MODAL */}
      {selectedReceipt && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '480px',
            padding: '1.75rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <div style={{ textAlign: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem' }}>Maruf's ICT Care</h2>
              <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>অফিসিয়াল পেমেন্ট মানি রিসিট</p>
              <span style={{ display: 'inline-block', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginTop: '6px' }}>
                পেমেন্ট সম্পন্ন (PAID)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>রসিদ নং:</span>
                <strong>{selectedReceipt.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>শিক্ষার্থীর নাম:</span>
                <strong>{student.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>শিক্ষার্থী আইডি:</span>
                <strong>{student.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>ব্যাচ:</span>
                <strong>{student.batch}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>তারিখ ও সময়:</span>
                <span>{selectedReceipt.date} {selectedReceipt.time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>পেমেন্ট মাধ্যম:</span>
                <strong>{selectedReceipt.method}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                <span style={{ color: '#64748b' }}>বিবরণ:</span>
                <span>{selectedReceipt.note || 'কোচিং ফি'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '1.1rem' }}>
                <span style={{ fontWeight: 700 }}>আদায়কৃত টাকা:</span>
                <strong style={{ color: '#16a34a' }}>৳ {selectedReceipt.amount.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-print-receipt"
                onClick={() => setSelectedReceipt(null)}
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                className="btn-print-receipt"
                style={{ background: '#0284c7', color: '#ffffff', borderColor: '#0284c7' }}
                onClick={() => window.print()}
              >
                <Printer size={14} />
                প্রিন্ট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
