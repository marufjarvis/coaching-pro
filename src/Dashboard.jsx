import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, Users, Link, CalendarCheck, FileText, UserPlus, 
  CreditCard, Inbox, Receipt, BarChart3, Bell, Settings as SettingsIcon, Crown, 
  Search, LogOut, Download, Calendar, ArrowRight, Wallet, UserCheck, AlertCircle, X, CheckCircle2, Smartphone, Menu, Printer, Globe
} from 'lucide-react';
import Batches from './Batches';
import Students from './Students';
import EnrollmentLinks from './EnrollmentLinks';
import Payments from './Payments';
import DueInbox from './DueInbox';
import Expenses from './Expenses';
import Attendance from './Attendance';
import Exams from './Exams';
import Reports from './Reports';
import Notifications from './Notifications';
import Staff from './Staff';
import Settings from './Settings';
import OnlineAdmission from './OnlineAdmission';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './dashboard.css';

function Dashboard({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(() => dataStore.getStats());
  const [batches, setBatches] = useState(() => dataStore.getBatches());
  const [students, setStudents] = useState(() => dataStore.getStudents());
  const [payments, setPayments] = useState(() => dataStore.getPayments());
  const [settings, setSettings] = useState(() => dataStore.getSettings());

  const [isGuideVisible, setIsGuideVisible] = useState(() => {
    return localStorage.getItem('coachingDismissedGuide') !== 'true';
  });

  const { t, lang, setLang } = useTranslation();
  const [headerSearch, setHeaderSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      setStats(dataStore.getStats());
      setBatches(dataStore.getBatches());
      setStudents(dataStore.getStudents());
      setPayments(dataStore.getPayments());
      setSettings(dataStore.getSettings());
    };
    window.addEventListener('coaching-data-change', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('coaching-data-change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleDismissGuide = () => {
    setIsGuideVisible(false);
    localStorage.setItem('coachingDismissedGuide', 'true');
  };

  const handleLangToggle = (selected) => {
    setLang(selected);
  };

  // Header quick search matches
  const searchResults = headerSearch.trim() === '' ? [] : [
    ...students.filter(s => 
      s.name.toLowerCase().includes(headerSearch.toLowerCase()) || 
      s.id.toLowerCase().includes(headerSearch.toLowerCase()) ||
      (s.phone && s.phone.includes(headerSearch))
    ).map(s => ({ type: 'student', title: s.name, subtitle: `${s.id} • ${s.batch}`, targetTab: 'students' })),
    ...batches.filter(b => 
      b.name.toLowerCase().includes(headerSearch.toLowerCase())
    ).map(b => ({ type: 'batch', title: b.name, subtitle: `Academic Batch`, targetTab: 'batches' })),
    ...payments.filter(p => 
      p.id.toLowerCase().includes(headerSearch.toLowerCase()) ||
      p.studentName.toLowerCase().includes(headerSearch.toLowerCase())
    ).map(p => ({ type: 'payment', title: `${p.studentName} (৳ ${p.amount})`, subtitle: `Receipt: ${p.id} • ${p.date}`, targetTab: 'payments' }))
  ].slice(0, 6);

  const recentPayments = payments.slice(0, 5);
  const displayBatches = batches.slice(0, 4);

  return (
    <div className="app-container">
      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/logo.png" alt="Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </div>
          <div>
            <div className="sidebar-brand">{settings.coachingName}</div>
            <div className="sidebar-subtitle">{t.workspace}</div>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-label">{t.overview}</div>
            <a href="#" className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); setIsSidebarOpen(false); }}>
              <LayoutDashboard size={20} /> {t.dashboard}
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-label">{t.academic}</div>
            <a href="#" className={`nav-item ${activeTab === 'batches' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('batches'); setIsSidebarOpen(false); }}>
              <BookOpen size={20} /> {t.batches}
            </a>
            <a href="#" className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('students'); setIsSidebarOpen(false); }}>
              <Users size={20} /> {t.students}
            </a>
            <a href="#" className={`nav-item ${activeTab === 'online-admission' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('online-admission'); setIsSidebarOpen(false); }}>
              <UserCheck size={20} /> {t.onlineAdmission}
            </a>
            <a href="#" className={`nav-item ${activeTab === 'enrollment' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('enrollment'); setIsSidebarOpen(false); }}>
              <Link size={20} /> {t.enrollmentLinks}
            </a>
            <a href="#" className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('attendance'); setIsSidebarOpen(false); }}>
              <CalendarCheck size={20} /> {t.attendance}
            </a>
            <a href="#" className={`nav-item ${activeTab === 'exams' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('exams'); setIsSidebarOpen(false); }}>
              <FileText size={20} /> {t.exams}
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-label">{t.collections}</div>
            <a href="#" className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('payments'); setIsSidebarOpen(false); }}>
              <CreditCard size={20} /> {t.payments}
            </a>
            <a href="#" className={`nav-item ${activeTab === 'due-inbox' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('due-inbox'); setIsSidebarOpen(false); }}>
              <Inbox size={20} /> {t.dueInbox}
            </a>
            <a href="#" className={`nav-item ${activeTab === 'expenses' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('expenses'); setIsSidebarOpen(false); }}>
              <Receipt size={20} /> {t.expenses}
            </a>
            <a href="#" className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('reports'); setIsSidebarOpen(false); }}>
              <BarChart3 size={20} /> {t.reports}
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-label">{t.account}</div>
            <a href="#" className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('notifications'); setIsSidebarOpen(false); }}>
              <Bell size={20} /> {t.notifications}
              {((stats.notificationCount !== undefined ? stats.notificationCount : stats.dueCount) > 0) && (
                <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', fontSize: '10px', padding: '2px 7px', borderRadius: '10px', fontWeight: '700' }}>
                  {stats.notificationCount !== undefined ? stats.notificationCount : stats.dueCount}
                </span>
              )}
            </a>
            <a href="#" className={`nav-item ${activeTab === 'staff' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('staff'); setIsSidebarOpen(false); }}>
              <UserPlus size={20} /> {t.staff}
            </a>
            <a href="#" className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('settings'); setIsSidebarOpen(false); }}>
              <SettingsIcon size={20} /> {t.settings}
            </a>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="profile-widget">
            <div className="profile-avatar">
              {(() => {
                try {
                  const u = JSON.parse(localStorage.getItem('coachingUser') || 'null');
                  if (u && u.role === 'manager') return 'CM';
                  return 'MH';
                } catch (e) { return 'MH'; }
              })()}
            </div>
            <div className="profile-info">
              <div className="profile-name">
                {(() => {
                  try {
                    const u = JSON.parse(localStorage.getItem('coachingUser') || 'null');
                    return u?.name || 'Maruf Hossain';
                  } catch (e) { return 'Maruf Hossain'; }
                })()}
              </div>
              <div className="profile-role">
                {(() => {
                  try {
                    const u = JSON.parse(localStorage.getItem('coachingUser') || 'null');
                    if (u && u.role === 'manager') return lang === 'EN' ? 'Manager' : 'ম্যানেজার';
                    return t.coachingAdmin;
                  } catch (e) { return t.coachingAdmin; }
                })()}
              </div>
            </div>
            <button 
              className="logout-btn" 
              onClick={() => {
                if (window.confirm(t.logoutConfirm)) {
                  if (onLogout) onLogout();
                }
              }}
              title={t.logout}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        {/* Header */}
        <header className="top-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="header-logo-circle">
              <img src="/logo.png" alt="Logo" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            </div>
            <div className="header-title">
              <strong>{settings.coachingName}</strong>
              <span>{t.coachingAdmin} • {(t[activeTab] || activeTab).toUpperCase()}</span>
            </div>
          </div>
          
          <div className="header-search" style={{ position: 'relative' }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder={t.searchHeaderPlaceholder} 
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            />
            {searchFocused && searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, marginTop: '6px', overflow: 'hidden' }}>
                {searchResults.map((res, i) => (
                  <div 
                    key={i} 
                    style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => {
                      setActiveTab(res.targetTab);
                      setHeaderSearch('');
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{res.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{res.subtitle}</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', textTransform: 'capitalize' }}>{res.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="header-right">
            <button 
              type="button"
              onClick={() => { window.location.hash = '#/'; }} 
              className="btn-outline"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '5px', borderColor: '#0284c7', color: '#0284c7', fontWeight: 600 }}
              title="কোচিং এর মূল ওয়েবসাইট দেখুন"
            >
              <Globe size={15} /> {lang === 'EN' ? 'View Website' : 'মূল ওয়েবসাইট'}
            </button>
            <div className="lang-toggle">
              <span className={`lang ${lang === 'EN' ? 'active' : ''}`} onClick={() => handleLangToggle('EN')}>EN</span>
              <span className={`lang ${lang === 'BN' ? 'active' : ''}`} onClick={() => handleLangToggle('BN')}>BN</span>
            </div>
            <button className="icon-btn" onClick={() => setActiveTab('notifications')} title={t.notifications} style={{ position: 'relative' }}>
              <Bell size={20} />
              {((stats.notificationCount !== undefined ? stats.notificationCount : stats.dueCount) > 0) && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-3px', 
                  right: '-3px', 
                  minWidth: '18px', 
                  height: '18px', 
                  borderRadius: '9px', 
                  background: '#ef4444', 
                  color: 'white', 
                  fontSize: '10px', 
                  fontWeight: '700', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '0 4px', 
                  border: '2px solid white' 
                }}>
                  {stats.notificationCount !== undefined ? stats.notificationCount : stats.dueCount}
                </span>
              )}
            </button>
            <div className="profile-circle" title="Admin Account" onClick={() => setActiveTab('settings')}>MH</div>
          </div>
        </header>

        {/* Scrollable Area */}
        {activeTab === 'dashboard' ? (
          <div className="dashboard-content">
          <div className="page-header">
            <div>
              <div className="page-subtitle"><LayoutDashboard size={14} /> {t.dailyOverview}</div>
              <h1 className="page-title">{t.dashboardTitle}</h1>
              <p className="page-desc">{t.dashboardSubtitle}</p>
            </div>
            <div className="header-actions">
              <button className="btn-outline">
                {lang === 'EN' ? 'October 2026' : 'অক্টোবর ২০২৬'} <Calendar size={16} />
              </button>
              <button className="btn-outline" onClick={() => window.print()}>
                <Printer size={16} /> {lang === 'EN' ? 'Print Overview' : 'প্রিন্ট ওভারভিউ'}
              </button>
            </div>
          </div>

          <div className="kpi-grid">
            <div className="kpi-card" onClick={() => setActiveTab('students')} style={{ cursor: 'pointer' }}>
              <div className="kpi-label">{t.activeStudents}</div>
              <div className="kpi-value">{stats.activeStudentsCount}</div>
              <div className="kpi-trend positive">{t.enrolledRegistered}</div>
              <Users className="kpi-bg-icon" size={80} />
            </div>
            <div className="kpi-card" onClick={() => setActiveTab('payments')} style={{ cursor: 'pointer' }}>
              <div className="kpi-label">{t.collectedThisMonth}</div>
              <div className="kpi-value">৳ {stats.totalCollected.toLocaleString()}</div>
              <div className="kpi-trend positive">{t.totalRevenueReceived}</div>
              <Wallet className="kpi-bg-icon" size={80} />
            </div>
            <div className="kpi-card" onClick={() => setActiveTab('due-inbox')} style={{ cursor: 'pointer' }}>
              <div className="kpi-label">{t.outstandingDues}</div>
              <div className="kpi-value">৳ {stats.totalDues.toLocaleString()}</div>
              <div className={`kpi-trend ${stats.dueCount > 0 ? 'warning' : 'neutral'}`}>{stats.dueCount} {t.studentsDue}</div>
              <AlertCircle className="kpi-bg-icon" size={80} />
            </div>
            <div className="kpi-card" onClick={() => setActiveTab('attendance')} style={{ cursor: 'pointer' }}>
              <div className="kpi-label">{t.attendanceAvg}</div>
              <div className="kpi-value">{stats.attendanceAvg}</div>
              <div className="kpi-trend neutral">{t.acrossActiveBatches}</div>
              <CalendarCheck className="kpi-bg-icon" size={80} />
            </div>
          </div>

          <div className="action-row">
            <button className="btn-action" onClick={() => setActiveTab('payments')}><Wallet size={16} /> {t.collectFees}</button>
            <button className="btn-action" onClick={() => setActiveTab('students')}><UserPlus size={16} /> {t.addStudent}</button>
            <button className="btn-action" onClick={() => setActiveTab('attendance')}><CalendarCheck size={16} /> {t.attendance}</button>
            <button className="btn-action" onClick={() => setActiveTab('exams')}><FileText size={16} /> {t.exams}</button>
            <button className="btn-action" onClick={() => setActiveTab('online-admission')}><UserCheck size={16} /> {t.onlineAdmission}</button>
          </div>

          {isGuideVisible && (
            <div className="guide-banner">
              <div className="guide-header">
                <div className="guide-icon-wrapper">
                  <Crown size={20} className="guide-icon" />
                </div>
                <div>
                  <div className="guide-subtitle">{t.quickGuide}</div>
                  <div className="guide-title">{t.guideTitle}</div>
                </div>
                <button className="btn-close" onClick={handleDismissGuide}><X size={18} /> {t.dismiss}</button>
              </div>
              
              <div className="guide-steps">
                <div className="step active" onClick={() => setActiveTab('batches')} style={{ cursor: 'pointer' }}>
                  <div className="step-circle"><BookOpen size={20} /></div>
                  <div className="step-num">01</div>
                  <div className="step-text">{t.stepBatches}</div>
                </div>
                <div className="step" onClick={() => setActiveTab('students')} style={{ cursor: 'pointer' }}>
                  <div className="step-circle"><UserCheck size={20} /></div>
                  <div className="step-num">02</div>
                  <div className="step-text">{t.stepStudents}</div>
                </div>
                <div className="step" onClick={() => setActiveTab('attendance')} style={{ cursor: 'pointer' }}>
                  <div className="step-circle"><CalendarCheck size={20} /></div>
                  <div className="step-num">03</div>
                  <div className="step-text">{t.stepAttendance}</div>
                </div>
                <div className="step" onClick={() => setActiveTab('payments')} style={{ cursor: 'pointer' }}>
                  <div className="step-circle"><CreditCard size={20} /></div>
                  <div className="step-num">04</div>
                  <div className="step-text">{t.stepFees}</div>
                </div>
                <div className="step" onClick={() => setActiveTab('reports')} style={{ cursor: 'pointer' }}>
                  <div className="step-circle"><FileText size={20} /></div>
                  <div className="step-num">05</div>
                  <div className="step-text">{t.stepReports}</div>
                </div>
              </div>

              <div className="guide-footer">
                <div className="guide-desc">
                  {t.guideDesc}
                </div>
                <button className="btn-primary" onClick={() => setActiveTab('batches')}>{t.openBatches} <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          <div className="dashboard-grid">
            <div className="chart-card large">
              <div className="card-top">
                <div>
                  <h3 className="card-title">{t.financialOverview}</h3>
                  <p className="card-subtitle">{t.incomeVsExpense}</p>
                </div>
                <button className="link-action" onClick={() => setActiveTab('reports')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  {t.reports} →
                </button>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ flex: 1, background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{t.totalCollections.toUpperCase()}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>৳ {stats.totalCollected.toLocaleString()}</div>
                </div>
                <div style={{ flex: 1, background: '#fef2f2', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#991b1b' }}>{t.outstandingDues.toUpperCase()}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>৳ {stats.totalDues.toLocaleString()}</div>
                </div>
                <div style={{ flex: 1, background: '#eff6ff', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#1e40af' }}>{t.netProfit.toUpperCase()}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stats.netProfit >= 0 ? '#2563eb' : '#dc2626' }}>৳ {stats.netProfit.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <div className="card-top">
                <h3 className="card-title">{t.batchesOverview}</h3>
                <span className="card-date">{batches.length} {t.activeBatchesCount}</span>
              </div>
              <div className="batch-list">
                {displayBatches.map(b => {
                  const enrolled = students.filter(s => s.batch === b.name).length;
                  return (
                    <div key={b.id || b.name} className="batch-item">
                      <div>
                        <div className="batch-name">{b.name}</div>
                        <div className="batch-info">{enrolled} {enrolled === 1 ? t.studentSingle : t.studentPlural}</div>
                      </div>
                      <button 
                        className="link-action" 
                        onClick={() => setActiveTab('attendance')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        {t.attendance}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="chart-card large">
              <div className="card-top">
                <h3 className="card-title">{t.recentPayments}</h3>
                <button 
                  className="link-action" 
                  onClick={() => setActiveTab('payments')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {t.viewAll}
                </button>
              </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.thStudent}</th>
                    <th>{t.thBatch}</th>
                    <th>{t.thAmount}</th>
                    <th>{t.thMethod}</th>
                    <th>{t.thDate}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.length > 0 ? (
                    recentPayments.map(p => (
                      <tr key={p.id}>
                        <td><strong>{p.studentName}</strong></td>
                        <td>{p.batch || '—'}</td>
                        <td style={{ fontWeight: 700, color: '#16a34a' }}>৳ {Number(p.amount).toLocaleString()}</td>
                        <td><span className="status-badge active">{p.method}</span></td>
                        <td>{p.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-state">{t.noPaymentsFound}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </div>

            <div className="chart-card">
              <div className="card-top">
                <h3 className="card-title">{t.thingsToDo} <span className="badge">{stats.dueCount}</span></h3>
              </div>
              <div className="task-list">
                <div className="task-item">
                  <div className="task-icon warning"><Wallet size={16} /></div>
                  <div className="task-text">{stats.dueCount} {t.studentsDueNotice}</div>
                  <a href="#" className="task-link" onClick={(e) => { e.preventDefault(); setActiveTab('due-inbox'); }}>
                    {t.reviewDues} <ArrowRight size={14} />
                  </a>
                </div>
                <div className="task-item">
                  <div className="task-icon primary"><CalendarCheck size={16} /></div>
                  <div className="task-text">{t.takeAttendanceFor}</div>
                  <a href="#" className="task-link" onClick={(e) => { e.preventDefault(); setActiveTab('attendance'); }}>
                    {t.attendance} <ArrowRight size={14} />
                  </a>
                </div>
                <div className="task-item">
                  <div className="task-icon warning-outline"><BookOpen size={16} /></div>
                  <div className="task-text">{batches.length} {t.batchesActiveCount}</div>
                  <a href="#" className="task-link" onClick={(e) => { e.preventDefault(); setActiveTab('batches'); }}>
                    {t.batches} <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          </div>
        ) : (
          <div className="page-content">
            {activeTab === 'batches' ? (
              <Batches lang={lang} />
            ) : activeTab === 'students' ? (
              <Students setActiveTab={setActiveTab} lang={lang} />
            ) : activeTab === 'online-admission' ? (
              <OnlineAdmission lang={lang} />
            ) : activeTab === 'enrollment' ? (
              <EnrollmentLinks lang={lang} />
            ) : activeTab === 'payments' ? (
              <Payments setActiveTab={setActiveTab} lang={lang} />
            ) : activeTab === 'due-inbox' ? (
              <DueInbox lang={lang} />
            ) : activeTab === 'expenses' ? (
              <Expenses lang={lang} />
            ) : activeTab === 'attendance' ? (
              <Attendance lang={lang} />
            ) : activeTab === 'exams' ? (
              <Exams lang={lang} />
            ) : activeTab === 'reports' ? (
              <Reports lang={lang} />
            ) : activeTab === 'notifications' ? (
              <Notifications setActiveTab={setActiveTab} lang={lang} />
            ) : activeTab === 'staff' ? (
              <Staff lang={lang} />
            ) : activeTab === 'settings' ? (
              <Settings lang={lang} />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
