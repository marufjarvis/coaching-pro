import React, { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, Users, Link, CalendarCheck, FileText, UserPlus, 
  CreditCard, Inbox, Receipt, BarChart3, Bell, Settings as SettingsIcon, LifeBuoy, Crown, 
  UsersRound, Search, LogOut, Download, Calendar, ArrowRight, Wallet, UserCheck, AlertCircle, X, ChevronRight, CheckCircle2, Smartphone, Menu
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
import './dashboard.css';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

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
            <div className="sidebar-brand">Maruf's ICT Care</div>
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
            <a href="#" className={`nav-item ${activeTab === 'batches' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('batches'); setIsSidebarOpen(false); }}><BookOpen size={20} /> Batches</a>
            <a href="#" className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('students'); setIsSidebarOpen(false); }}><Users size={20} /> Students</a>
            <a href="#" className={`nav-item ${activeTab === 'online-admission' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('online-admission'); setIsSidebarOpen(false); }}><UserCheck size={20} /> Online Admission</a>
            <a href="#" className={`nav-item ${activeTab === 'enrollment' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('enrollment'); setIsSidebarOpen(false); }}><Link size={20} /> Enrollment Links</a>
            <a href="#" className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('attendance'); setIsSidebarOpen(false); }}><CalendarCheck size={20} /> Attendance</a>
            <a href="#" className={`nav-item ${activeTab === 'exams' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('exams'); setIsSidebarOpen(false); }}><FileText size={20} /> Exams</a>
          </div>

          <div className="nav-section">
            <div className="nav-label">COLLECTIONS</div>
            <a href="#" className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('payments'); setIsSidebarOpen(false); }}><CreditCard size={20} /> Payments</a>
            <a href="#" className={`nav-item ${activeTab === 'due-inbox' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('due-inbox'); setIsSidebarOpen(false); }}><Inbox size={20} /> Due Inbox</a>
            <a href="#" className={`nav-item ${activeTab === 'expenses' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('expenses'); setIsSidebarOpen(false); }}><Receipt size={20} /> Expenses</a>
            <a href="#" className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('reports'); setIsSidebarOpen(false); }}><BarChart3 size={20} /> Reports</a>
          </div>

          <div className="nav-section">
            <div className="nav-label">ACCOUNT</div>
            <a href="#" className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('notifications'); setIsSidebarOpen(false); }}>
              <Bell size={20} /> Notifications
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
            <button className="logout-btn"><LogOut size={18} /></button>
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
              <strong>Maruf's ICT Care</strong>
              <span>Coaching Admin • Dashboard</span>
            </div>
          </div>
          
          <div className="header-search">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search students, payments..." />
          </div>

          <div className="header-right">
            <div className="lang-toggle">
              <span className="lang active">EN</span>
              <span className="lang">BN</span>
            </div>
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="profile-circle">MH</div>
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
              <button className="btn-outline">
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">Active students</div>
              <div className="kpi-value">1</div>
              <div className="kpi-trend positive">+1 this month</div>
              <Users className="kpi-bg-icon" size={80} />
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Collected this month</div>
              <div className="kpi-value">৳ 0</div>
              <div className="kpi-trend neutral">0% of billed</div>
              <Wallet className="kpi-bg-icon" size={80} />
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Outstanding dues</div>
              <div className="kpi-value">৳ 0</div>
              <div className="kpi-trend warning">0 students</div>
              <AlertCircle className="kpi-bg-icon" size={80} />
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Attendance avg</div>
              <div className="kpi-value">—</div>
              <div className="kpi-trend neutral">Last 30 days</div>
              <CalendarCheck className="kpi-bg-icon" size={80} />
            </div>
          </div>

          <div className="action-row">
            <button className="btn-action"><Wallet size={16} /> Collect fees</button>
            <button className="btn-action"><UserPlus size={16} /> Add student</button>
            <button className="btn-action"><CalendarCheck size={16} /> Attendance</button>
            <button className="btn-action"><FileText size={16} /> Exams</button>
            <button className="btn-action"><Smartphone size={16} /> Download app</button>
          </div>

          <div className="guide-banner">
            <div className="guide-header">
              <div className="guide-icon-wrapper">
                <Crown size={20} className="guide-icon" />
              </div>
              <div>
                <div className="guide-subtitle">সহজ গাইড</div>
                <div className="guide-title">পাঁচ ধাপে কোচিং চালান</div>
              </div>
              <button className="btn-close"><X size={18} /> লুকান</button>
            </div>
            
            <div className="guide-steps">
              <div className="step active">
                <div className="step-circle"><BookOpen size={20} /></div>
                <div className="step-num">01</div>
                <div className="step-text">ব্যাচ</div>
              </div>
              <div className="step">
                <div className="step-circle"><UserCheck size={20} /></div>
                <div className="step-num">02</div>
                <div className="step-text">শিক্ষার্থী</div>
              </div>
              <div className="step">
                <div className="step-circle"><CalendarCheck size={20} /></div>
                <div className="step-num">03</div>
                <div className="step-text">হাজিরা</div>
              </div>
              <div className="step">
                <div className="step-circle"><CreditCard size={20} /></div>
                <div className="step-num">04</div>
                <div className="step-text">ফি আদায়</div>
              </div>
              <div className="step">
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

          <div className="dashboard-grid">
            <div className="chart-card large">
              <div className="card-top">
                <div>
                  <h3 className="card-title">Collection overview</h3>
                  <p className="card-subtitle">Collected vs billed - 6 months</p>
                </div>
              </div>
              <div className="chart-placeholder">
                <div className="chart-y-axis">
                  <span>0K</span>
                  <span>0K</span>
                  <span>0K</span>
                  <span>0K</span>
                  <span>0K</span>
                </div>
                <div className="chart-area">
                  <div className="chart-lines">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                  </div>
                  <div className="chart-x-axis">
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                  </div>
                </div>
              </div>
              <div className="chart-legend">
                <span className="legend-item"><span className="dot billed"></span> Billed</span>
                <span className="legend-item"><span className="dot collected"></span> Collected</span>
              </div>
            </div>

            <div className="chart-card">
              <div className="card-top">
                <h3 className="card-title">Today's batches</h3>
                <span className="card-date">08 Oct</span>
              </div>
              <div className="batch-list">
                <div className="batch-item">
                  <div>
                    <div className="batch-name">HSC • Sat-6:45am</div>
                    <div className="batch-info">1 students • ৳ 0</div>
                  </div>
                  <a href="#" className="link-action">Attendance</a>
                </div>
                <div className="batch-item">
                  <div>
                    <div className="batch-name">HSC • Sat-7:45am</div>
                    <div className="batch-info">0 students • ৳ 0</div>
                  </div>
                  <a href="#" className="link-action">Attendance</a>
                </div>
                <div className="batch-item">
                  <div>
                    <div className="batch-name">HSC • Sat-9am</div>
                    <div className="batch-info">0 students • ৳ 0</div>
                  </div>
                  <a href="#" className="link-action">Attendance</a>
                </div>
              </div>
            </div>

            <div className="chart-card large">
              <div className="card-top">
                <h3 className="card-title">Recent payments</h3>
                <a href="#" className="link-action">View all</a>
              </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>STUDENT</th>
                    <th>BATCH</th>
                    <th>AMOUNT</th>
                    <th>METHOD</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="5" className="empty-state">No payments this month yet</td>
                  </tr>
                </tbody>
              </table>
            </div>
            </div>

            <div className="chart-card">
              <div className="card-top">
                <h3 className="card-title">Needs attention <span className="badge">1</span></h3>
              </div>
              <div className="task-list">
                <div className="task-item">
                  <div className="task-icon warning"><Wallet size={16} /></div>
                  <div className="task-text">0 unpaid students</div>
                  <a href="#" className="task-link" onClick={(e) => { e.preventDefault(); setActiveTab('due-inbox'); }}>Due inbox <ArrowRight size={14} /></a>
                </div>
                <div className="task-item">
                  <div className="task-icon primary"><CalendarCheck size={16} /></div>
                  <div className="task-text">Mark today's attendance</div>
                  <a href="#" className="task-link">Attendance <ArrowRight size={14} /></a>
                </div>
                <div className="task-item">
                  <div className="task-icon warning-outline"><AlertCircle size={16} /></div>
                  <div className="task-text">0 batches active</div>
                  <a href="#" className="task-link">Batches <ArrowRight size={14} /></a>
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
              <Students />
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
