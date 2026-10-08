import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, Users, Link, CalendarCheck, FileText, UserPlus, 
  CreditCard, Inbox, Receipt, BarChart3, Bell, Settings as SettingsIcon, Crown, 
  Search, LogOut, Download, Calendar, ArrowRight, Wallet, UserCheck, AlertCircle, X, CheckCircle2, Smartphone, Menu, Printer
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

  const [lang, setLang] = useState(() => localStorage.getItem('coachingLanguage') || 'BN');
  const [headerSearch, setHeaderSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      setStats(dataStore.getStats());
      setBatches(dataStore.getBatches());
      setStudents(dataStore.getStudents());
      setPayments(dataStore.getPayments());
      setSettings(dataStore.getSettings());
      setLang(localStorage.getItem('coachingLanguage') || 'BN');
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
    localStorage.setItem('coachingLanguage', selected);
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
    ).map(b => ({ type: 'batch', title: b.name, subtitle: `Batch • ৳ ${b.monthlyFee}/mo`, targetTab: 'batches' })),
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
            <div className="sidebar-subtitle">WORKSPACE</div>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-label">OVERVIEW</div>
            <a href="#" className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); setIsSidebarOpen(false); }}>
              <LayoutDashboard size={20} /> Dashboard
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-label">ACADEMIC</div>
            <a href="#" className={`nav-item ${activeTab === 'batches' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('batches'); setIsSidebarOpen(false); }}>
              <BookOpen size={20} /> Batches
            </a>
            <a href="#" className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('students'); setIsSidebarOpen(false); }}>
              <Users size={20} /> Students
            </a>
            <a href="#" className={`nav-item ${activeTab === 'online-admission' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('online-admission'); setIsSidebarOpen(false); }}>
              <UserCheck size={20} /> Online Admission
            </a>
            <a href="#" className={`nav-item ${activeTab === 'enrollment' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('enrollment'); setIsSidebarOpen(false); }}>
              <Link size={20} /> Enrollment Links
            </a>
            <a href="#" className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('attendance'); setIsSidebarOpen(false); }}>
              <CalendarCheck size={20} /> Attendance
            </a>
            <a href="#" className={`nav-item ${activeTab === 'exams' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('exams'); setIsSidebarOpen(false); }}>
              <FileText size={20} /> Exams
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-label">COLLECTIONS</div>
            <a href="#" className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('payments'); setIsSidebarOpen(false); }}>
              <CreditCard size={20} /> Payments
            </a>
            <a href="#" className={`nav-item ${activeTab === 'due-inbox' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('due-inbox'); setIsSidebarOpen(false); }}>
              <Inbox size={20} /> Due Inbox
            </a>
            <a href="#" className={`nav-item ${activeTab === 'expenses' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('expenses'); setIsSidebarOpen(false); }}>
              <Receipt size={20} /> Expenses
            </a>
            <a href="#" className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('reports'); setIsSidebarOpen(false); }}>
              <BarChart3 size={20} /> Reports
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-label">ACCOUNT</div>
            <a href="#" className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('notifications'); setIsSidebarOpen(false); }}>
              <Bell size={20} /> Notifications
              {stats.dueCount > 0 && (
                <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>
                  {stats.dueCount}
                </span>
              )}
            </a>
            <a href="#" className={`nav-item ${activeTab === 'staff' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('staff'); setIsSidebarOpen(false); }}>
              <UserPlus size={20} /> Staff
            </a>
            <a href="#" className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('settings'); setIsSidebarOpen(false); }}>
              <SettingsIcon size={20} /> Settings
            </a>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="profile-widget">
            <div className="profile-avatar">MH</div>
            <div className="profile-info">
              <div className="profile-name">Maruf Hossain</div>
              <div className="profile-role">Coaching Admin</div>
            </div>
            <button 
              className="logout-btn" 
              onClick={() => {
                if (window.confirm("Are you sure you want to log out?")) {
                  if (onLogout) onLogout();
                }
              }}
              title="Logout"
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
              <span>Coaching Admin • {activeTab.toUpperCase()}</span>
            </div>
          </div>
          
          <div className="header-search" style={{ position: 'relative' }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search students, batches, payments..." 
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
            <div className="lang-toggle">
              <span className={`lang ${lang === 'EN' ? 'active' : ''}`} onClick={() => handleLangToggle('EN')}>EN</span>
              <span className={`lang ${lang === 'BN' ? 'active' : ''}`} onClick={() => handleLangToggle('BN')}>BN</span>
            </div>
            <button className="icon-btn" onClick={() => setActiveTab('notifications')} title="Notifications" style={{ position: 'relative' }}>
              <Bell size={20} />
              {stats.dueCount > 0 && (
                <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
              )}
            </button>
            <div className="profile-circle" title="Admin Account">MH</div>
          </div>
        </header>

        {/* Scrollable Area */}
        {activeTab === 'dashboard' ? (
          <div className="dashboard-content">
          <div className="page-header">
            <div>
              <div className="page-subtitle"><LayoutDashboard size={14} /> YOUR DAILY OVERVIEW</div>
              <h1 className="page-title">Coaching overview</h1>
              <p className="page-desc">Today's snapshot of students, collections and attendance.</p>
            </div>
            <div className="header-actions">
              <button className="btn-outline">
                October 2026 <Calendar size={16} />
              </button>
              <button className="btn-outline" onClick={() => window.print()}>
                <Printer size={16} /> Print Overview
              </button>
            </div>
          </div>

          <div className="kpi-grid">
            <div className="kpi-card" onClick={() => setActiveTab('students')} style={{ cursor: 'pointer' }}>
              <div className="kpi-label">Active students</div>
              <div className="kpi-value">{stats.activeStudentsCount}</div>
              <div className="kpi-trend positive">Enrolled & registered</div>
              <Users className="kpi-bg-icon" size={80} />
            </div>
            <div className="kpi-card" onClick={() => setActiveTab('payments')} style={{ cursor: 'pointer' }}>
              <div className="kpi-label">Collected this month</div>
              <div className="kpi-value">৳ {stats.totalCollected.toLocaleString()}</div>
              <div className="kpi-trend positive">Total received revenue</div>
              <Wallet className="kpi-bg-icon" size={80} />
            </div>
            <div className="kpi-card" onClick={() => setActiveTab('due-inbox')} style={{ cursor: 'pointer' }}>
              <div className="kpi-label">Outstanding dues</div>
              <div className="kpi-value">৳ {stats.totalDues.toLocaleString()}</div>
              <div className={`kpi-trend ${stats.dueCount > 0 ? 'warning' : 'neutral'}`}>{stats.dueCount} students due</div>
              <AlertCircle className="kpi-bg-icon" size={80} />
            </div>
            <div className="kpi-card" onClick={() => setActiveTab('attendance')} style={{ cursor: 'pointer' }}>
              <div className="kpi-label">Attendance avg</div>
              <div className="kpi-value">{stats.attendanceAvg}</div>
              <div className="kpi-trend neutral">Across active batches</div>
              <CalendarCheck className="kpi-bg-icon" size={80} />
            </div>
          </div>

          <div className="action-row">
            <button className="btn-action" onClick={() => setActiveTab('payments')}><Wallet size={16} /> Collect fees</button>
            <button className="btn-action" onClick={() => setActiveTab('students')}><UserPlus size={16} /> Add student</button>
            <button className="btn-action" onClick={() => setActiveTab('attendance')}><CalendarCheck size={16} /> Attendance</button>
            <button className="btn-action" onClick={() => setActiveTab('exams')}><FileText size={16} /> Exams</button>
            <button className="btn-action" onClick={() => setActiveTab('online-admission')}><UserCheck size={16} /> Online admission</button>
          </div>

          {isGuideVisible && (
            <div className="guide-banner">
              <div className="guide-header">
                <div className="guide-icon-wrapper">
                  <Crown size={20} className="guide-icon" />
                </div>
                <div>
                  <div className="guide-subtitle">সহজ গাইড</div>
                  <div className="guide-title">পাঁচ ধাপে কোচিং চালান</div>
                </div>
                <button className="btn-close" onClick={handleDismissGuide}><X size={18} /> লুকান</button>
              </div>
              
              <div className="guide-steps">
                <div className="step active" onClick={() => setActiveTab('batches')} style={{ cursor: 'pointer' }}>
                  <div className="step-circle"><BookOpen size={20} /></div>
                  <div className="step-num">01</div>
                  <div className="step-text">ব্যাচ</div>
                </div>
                <div className="step" onClick={() => setActiveTab('students')} style={{ cursor: 'pointer' }}>
                  <div className="step-circle"><UserCheck size={20} /></div>
                  <div className="step-num">02</div>
                  <div className="step-text">শিক্ষার্থী</div>
                </div>
                <div className="step" onClick={() => setActiveTab('attendance')} style={{ cursor: 'pointer' }}>
                  <div className="step-circle"><CalendarCheck size={20} /></div>
                  <div className="step-num">03</div>
                  <div className="step-text">হাজিরা</div>
                </div>
                <div className="step" onClick={() => setActiveTab('payments')} style={{ cursor: 'pointer' }}>
                  <div className="step-circle"><CreditCard size={20} /></div>
                  <div className="step-num">04</div>
                  <div className="step-text">ফি আদায়</div>
                </div>
                <div className="step" onClick={() => setActiveTab('reports')} style={{ cursor: 'pointer' }}>
                  <div className="step-circle"><FileText size={20} /></div>
                  <div className="step-num">05</div>
                  <div className="step-text">রিপোর্ট</div>
                </div>
              </div>

              <div className="guide-footer">
                <div className="guide-desc">
                  Batches <ArrowRight size={14} /> Add batch <ArrowRight size={14} /> ফি সেট <ArrowRight size={14} /> নতুন ব্যাচ যোগ করুন।
                </div>
                <button className="btn-primary" onClick={() => setActiveTab('batches')}>Batches খুলুন <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          <div className="dashboard-grid">
            <div className="chart-card large">
              <div className="card-top">
                <div>
                  <h3 className="card-title">Collection overview</h3>
                  <p className="card-subtitle">Collected vs billed - October 2026</p>
                </div>
                <button className="link-action" onClick={() => setActiveTab('reports')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  Financial report →
                </button>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ flex: 1, background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>COLLECTED REVENUE</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>৳ {stats.totalCollected.toLocaleString()}</div>
                </div>
                <div style={{ flex: 1, background: '#fef2f2', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#991b1b' }}>OUTSTANDING DUES</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>৳ {stats.totalDues.toLocaleString()}</div>
                </div>
                <div style={{ flex: 1, background: '#eff6ff', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#1e40af' }}>NET BALANCE (PROFIT)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stats.netProfit >= 0 ? '#2563eb' : '#dc2626' }}>৳ {stats.netProfit.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <div className="card-top">
                <h3 className="card-title">Batches overview</h3>
                <span className="card-date">{batches.length} active</span>
              </div>
              <div className="batch-list">
                {displayBatches.map(b => {
                  const enrolled = students.filter(s => s.batch === b.name).length;
                  return (
                    <div key={b.id || b.name} className="batch-item">
                      <div>
                        <div className="batch-name">{b.name}</div>
                        <div className="batch-info">{enrolled} students • ৳ {b.monthlyFee || 500}/mo</div>
                      </div>
                      <button 
                        className="link-action" 
                        onClick={() => setActiveTab('attendance')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Attendance
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="chart-card large">
              <div className="card-top">
                <h3 className="card-title">Recent payments</h3>
                <button 
                  className="link-action" 
                  onClick={() => setActiveTab('payments')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  View all →
                </button>
              </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>STUDENT</th>
                    <th>BATCH</th>
                    <th>AMOUNT</th>
                    <th>METHOD</th>
                    <th>DATE</th>
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
                      <td colSpan="5" className="empty-state">No payments this month yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </div>

            <div className="chart-card">
              <div className="card-top">
                <h3 className="card-title">Needs attention <span className="badge">{stats.dueCount}</span></h3>
              </div>
              <div className="task-list">
                <div className="task-item">
                  <div className="task-icon warning"><Wallet size={16} /></div>
                  <div className="task-text">{stats.dueCount} unpaid students</div>
                  <a href="#" className="task-link" onClick={(e) => { e.preventDefault(); setActiveTab('due-inbox'); }}>
                    Due inbox <ArrowRight size={14} />
                  </a>
                </div>
                <div className="task-item">
                  <div className="task-icon primary"><CalendarCheck size={16} /></div>
                  <div className="task-text">Mark today's attendance</div>
                  <a href="#" className="task-link" onClick={(e) => { e.preventDefault(); setActiveTab('attendance'); }}>
                    Attendance <ArrowRight size={14} />
                  </a>
                </div>
                <div className="task-item">
                  <div className="task-icon warning-outline"><BookOpen size={16} /></div>
                  <div className="task-text">{batches.length} batches active</div>
                  <a href="#" className="task-link" onClick={(e) => { e.preventDefault(); setActiveTab('batches'); }}>
                    Batches <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          </div>
        ) : (
          <div className="page-content">
            {activeTab === 'batches' ? (
              <Batches />
            ) : activeTab === 'students' ? (
              <Students setActiveTab={setActiveTab} />
            ) : activeTab === 'online-admission' ? (
              <OnlineAdmission />
            ) : activeTab === 'enrollment' ? (
              <EnrollmentLinks />
            ) : activeTab === 'payments' ? (
              <Payments setActiveTab={setActiveTab} />
            ) : activeTab === 'due-inbox' ? (
              <DueInbox />
            ) : activeTab === 'expenses' ? (
              <Expenses />
            ) : activeTab === 'attendance' ? (
              <Attendance />
            ) : activeTab === 'exams' ? (
              <Exams />
            ) : activeTab === 'reports' ? (
              <Reports />
            ) : activeTab === 'notifications' ? (
              <Notifications setActiveTab={setActiveTab} />
            ) : activeTab === 'staff' ? (
              <Staff />
            ) : activeTab === 'settings' ? (
              <Settings />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
