import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertCircle, 
  UserCheck, 
  ArrowRight, 
  Clock, 
  Calendar, 
  Check, 
  Copy, 
  Phone, 
  DollarSign, 
  CheckCircle2, 
  Sparkles,
  X,
  CreditCard,
  User
} from 'lucide-react';
import { dataStore } from './dataStore';
import { useTranslation } from './translations';
import './notifications.css';

function Notifications({ setActiveTab, lang: propLang }) {
  const { t, lang } = useTranslation(propLang);
  const [notifData, setNotifData] = useState(() => dataStore.getNotifications());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedKey, setCopiedKey] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Quick Collect Payment Modal State
  const [collectingStudent, setCollectingStudent] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Cash');

  useEffect(() => {
    const handleSync = () => {
      setNotifData(dataStore.getNotifications());
    };
    window.addEventListener('coaching-data-change', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('coaching-data-change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopy = (text, key, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`${label} ${lang === 'EN' ? 'copied to clipboard!' : 'কপি হয়েছে!'}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenQuickCollect = (studentItem) => {
    const fullStudent = studentItem.studentObj || dataStore.getStudents().find(s => s.id === studentItem.studentId);
    if (!fullStudent) return;
    setCollectingStudent(fullStudent);
    setPayAmount(String(studentItem.installmentAmount || studentItem.dueAmount || ''));
    setPayMethod('Cash');
  };

  const handleConfirmQuickCollect = (e) => {
    e.preventDefault();
    if (!collectingStudent || !payAmount) return;
    dataStore.recordPayment({
      studentId: collectingStudent.id,
      amount: Number(payAmount),
      method: payMethod,
      collectedBy: 'Admin',
      note: collectingStudent.feeType === 'course' ? 'Course Fee Installment' : 'Monthly Fee'
    });
    showToast(lang === 'EN' ? 'Payment recorded successfully!' : 'পেমেন্ট সফলভাবে সংরক্ষিত হয়েছে!');
    setCollectingStudent(null);
    setPayAmount('');
  };

  // Filter items based on selectedCategory
  const displayedItems = (() => {
    if (selectedCategory === 'admission') return notifData.onlineAdmissions;
    if (selectedCategory === 'course') return notifData.courseDues;
    if (selectedCategory === 'monthly') return notifData.monthlyDues;
    return notifData.all;
  })();

  return (
    <div className="notifications-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="notif-toast">
          <CheckCircle2 size={16} color="#16a34a" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="fee-followup-tag">
            <Bell size={14} /> {lang === 'EN' ? 'UPDATES & ALERTS' : 'আপডেট ও নোটিফিকেশন সেন্টার'}
          </div>
          <h1>{t.notifications}</h1>
          <p className="subtitle">
            {lang === 'EN' 
              ? 'Real-time alerts for online admissions, 1-month course installments, and monthly tuition dues.' 
              : 'অনলাইন ভর্তি আবেদন, কোর্স ফি ১ মাসের পরবর্তী কিস্তি এবং মাসিক বকেয়া বেতনের স্বয়ংক্রিয় নোটিফিকেশন।'}
          </p>
        </div>
      </div>

      {/* Filter Tabs with Counter Badges */}
      <div className="notif-category-bar">
        <button
          type="button"
          className={`notif-tab ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          <span>{lang === 'EN' ? 'All Alerts' : 'সব নোটিফিকেশন'}</span>
          <span className="notif-pill-count">{notifData.totalCount}</span>
        </button>

        <button
          type="button"
          className={`notif-tab tab-admission ${selectedCategory === 'admission' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('admission')}
        >
          <UserCheck size={14} />
          <span>{lang === 'EN' ? 'Online Admissions' : 'অনলাইন ভর্তি আবেদন'}</span>
          {notifData.admissionCount > 0 && (
            <span className="notif-pill-count pill-admission">{notifData.admissionCount}</span>
          )}
        </button>

        <button
          type="button"
          className={`notif-tab tab-course ${selectedCategory === 'course' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('course')}
        >
          <Clock size={14} />
          <span>{lang === 'EN' ? 'Course Installments (1-Mo)' : 'কোর্স পরবর্তী কিস্তি (১ মাস)'}</span>
          {notifData.courseCount > 0 && (
            <span className="notif-pill-count pill-course">{notifData.courseCount}</span>
          )}
        </button>

        <button
          type="button"
          className={`notif-tab tab-monthly ${selectedCategory === 'monthly' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('monthly')}
        >
          <AlertCircle size={14} />
          <span>{lang === 'EN' ? 'Monthly Dues' : 'মাসিক বকেয়া বেতন'}</span>
          {notifData.monthlyCount > 0 && (
            <span className="notif-pill-count pill-monthly">{notifData.monthlyCount}</span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {displayedItems.length > 0 ? (
          displayedItems.map((item) => {
            // 1. ONLINE ADMISSION CARD
            if (item.type === 'online_admission') {
              return (
                <div key={item.id} className="notification-card notif-card-admission">
                  <div className="notif-icon icon-admission">
                    <UserCheck size={24} />
                  </div>
                  <div className="notif-content">
                    <div className="notif-header-line">
                      <span className="notif-type-tag tag-admission">
                        {lang === 'EN' ? 'Online Admission' : 'অনলাইন ভর্তি আবেদন'}
                      </span>
                      <span className="notif-time">{item.date}</span>
                    </div>

                    <h4>{lang === 'EN' ? item.titleEn : item.titleBn}</h4>

                    <div className="notif-details-grid">
                      <div className="notif-detail-row">
                        <span className="detail-label">{lang === 'EN' ? 'Student Name:' : 'শিক্ষার্থীর নাম:'}</span>
                        <strong className="detail-value">{item.applicantName}</strong>
                      </div>
                      <div className="notif-detail-row">
                        <span className="detail-label">{lang === 'EN' ? 'Batch:' : 'আবেদিত ব্যাচ:'}</span>
                        <span className="badge-batch-pill">{item.batch}</span>
                      </div>
                      <div className="notif-detail-row">
                        <span className="detail-label">{lang === 'EN' ? 'Student Phone:' : 'শিক্ষার্থীর মোবাইল:'}</span>
                        <div className="phone-copy-wrap">
                          <a href={`tel:${item.phone}`} className="phone-link">{item.phone}</a>
                          <button
                            type="button"
                            className="btn-copy-mini"
                            title="Copy number"
                            onClick={() => handleCopy(item.phone, `stu-${item.id}`, 'শিক্ষার্থীর মোবাইল নম্বর')}
                          >
                            {copiedKey === `stu-${item.id}` ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                      {item.guardianPhone && (
                        <div className="notif-detail-row">
                          <span className="detail-label">{lang === 'EN' ? 'Guardian Phone:' : 'অভিভাবকের নম্বর:'}</span>
                          <div className="phone-copy-wrap">
                            <a href={`tel:${item.guardianPhone}`} className="phone-link">{item.guardianPhone}</a>
                            <button
                              type="button"
                              className="btn-copy-mini"
                              title="Copy guardian number"
                              onClick={() => handleCopy(item.guardianPhone, `g-${item.id}`, 'অভিভাবকের মোবাইল নম্বর')}
                            >
                              {copiedKey === `g-${item.id}` ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="notif-action-row">
                      <button 
                        type="button"
                        className="btn-notif-action btn-primary-action" 
                        onClick={() => setActiveTab('online-admission')}
                      >
                        {lang === 'EN' ? 'Review & Admit' : 'আবেদন দেখুন ও ভর্তি সম্পন্ন করুন'} 
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // 2. COURSE INSTALLMENT (1-MONTH PASSED) CARD
            if (item.type === 'course_installment') {
              return (
                <div key={item.id} className="notification-card notif-card-course">
                  <div className="notif-icon icon-course">
                    <Clock size={24} />
                  </div>
                  <div className="notif-content">
                    <div className="notif-header-line">
                      <span className="notif-type-tag tag-course">
                        {lang === 'EN' ? 'Course Installment Due (1-Month Passed)' : 'কোর্স ফি পরবর্তী কিস্তি (১ মাস পূর্ণ)'}
                      </span>
                      <span className="notif-time-passed">
                        {lang === 'EN' ? `${item.daysElapsed} days since payment` : `পূর্ববর্তী পেমেন্টের ${item.daysElapsed} দিন অতিক্রান্ত`}
                      </span>
                    </div>

                    <h4>
                      {lang === 'EN' ? item.titleEn : item.titleBn} — <strong>{item.studentName}</strong>
                    </h4>

                    <div className="notif-details-grid">
                      <div className="notif-detail-row">
                        <span className="detail-label">{lang === 'EN' ? 'Batch:' : 'ব্যাচ:'}</span>
                        <span className="badge-batch-pill">{item.batch}</span>
                      </div>
                      <div className="notif-detail-row">
                        <span className="detail-label">{lang === 'EN' ? 'Student Phone:' : 'মোবাইল নম্বর:'}</span>
                        <div className="phone-copy-wrap">
                          <a href={`tel:${item.phone}`} className="phone-link">{item.phone}</a>
                          <button
                            type="button"
                            className="btn-copy-mini"
                            title="Copy student number"
                            onClick={() => handleCopy(item.phone, `stu-${item.id}`, 'শিক্ষার্থীর মোবাইল নম্বর')}
                          >
                            {copiedKey === `stu-${item.id}` ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                      {item.guardianPhone && (
                        <div className="notif-detail-row">
                          <span className="detail-label">{lang === 'EN' ? 'Guardian Phone:' : 'অভিভাবকের নম্বর:'}</span>
                          <div className="phone-copy-wrap">
                            <a href={`tel:${item.guardianPhone}`} className="phone-link">{item.guardianPhone}</a>
                            <button
                              type="button"
                              className="btn-copy-mini"
                              title="Copy guardian number"
                              onClick={() => handleCopy(item.guardianPhone, `g-${item.id}`, 'অভিভাবকের মোবাইল নম্বর')}
                            >
                              {copiedKey === `g-${item.id}` ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="notif-detail-row">
                        <span className="detail-label">{lang === 'EN' ? 'Last Payment:' : 'পূর্ববর্তী পেমেন্ট:'}</span>
                        <span className="detail-value">{item.lastPaymentDate} {item.lastPaymentAmount ? `(৳ ${item.lastPaymentAmount.toLocaleString()})` : ''}</span>
                      </div>
                    </div>

                    {/* Financial Summary Strip */}
                    <div className="notif-kpi-strip strip-course">
                      <div className="kpi-strip-item">
                        <span className="kpi-strip-label">{lang === 'EN' ? 'Total Course Fee' : 'মোট কোর্স ফি'}</span>
                        <span className="kpi-strip-val">৳ {item.totalFee.toLocaleString()}</span>
                      </div>
                      <div className="kpi-strip-item">
                        <span className="kpi-strip-label">{lang === 'EN' ? 'Paid' : 'পরিশোধিত'}</span>
                        <span className="kpi-strip-val val-success">৳ {item.paidAmount.toLocaleString()}</span>
                      </div>
                      <div className="kpi-strip-item">
                        <span className="kpi-strip-label">{lang === 'EN' ? 'Total Due' : 'মোট বকেয়া'}</span>
                        <span className="kpi-strip-val val-due">৳ {item.dueAmount.toLocaleString()}</span>
                      </div>
                      <div className="kpi-strip-item highlight-box">
                        <span className="kpi-strip-label">{lang === 'EN' ? 'Next Installment' : 'পরবর্তী কিস্তি'}</span>
                        <span className="kpi-strip-val val-next">৳ {item.installmentAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="notif-action-row">
                      <button 
                        type="button"
                        className="btn-notif-action btn-primary-action btn-amber"
                        onClick={() => handleOpenQuickCollect(item)}
                      >
                        <CreditCard size={15} />
                        {lang === 'EN' ? 'Collect Installment' : 'কিস্তি গ্রহণ করুন'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // 3. MONTHLY TUITION DUE CARD
            if (item.type === 'monthly_due') {
              return (
                <div key={item.id} className="notification-card notif-card-monthly">
                  <div className="notif-icon icon-monthly">
                    <AlertCircle size={24} />
                  </div>
                  <div className="notif-content">
                    <div className="notif-header-line">
                      <span className="notif-type-tag tag-monthly">
                        {lang === 'EN' ? 'Monthly Tuition Due' : 'মাসিক বেতন বকেয়া'}
                      </span>
                      <span className="notif-badge-danger">
                        ৳ {item.dueAmount.toLocaleString()} {lang === 'EN' ? 'Due' : 'বকেয়া'}
                      </span>
                    </div>

                    <h4>
                      {lang === 'EN' ? item.titleEn : item.titleBn} — <strong>{item.studentName}</strong>
                    </h4>

                    <div className="notif-details-grid">
                      <div className="notif-detail-row">
                        <span className="detail-label">{lang === 'EN' ? 'Batch:' : 'ব্যাচ:'}</span>
                        <span className="badge-batch-pill">{item.batch}</span>
                      </div>
                      <div className="notif-detail-row">
                        <span className="detail-label">{lang === 'EN' ? 'Student Phone:' : 'মোবাইল নম্বর:'}</span>
                        <div className="phone-copy-wrap">
                          <a href={`tel:${item.phone}`} className="phone-link">{item.phone}</a>
                          <button
                            type="button"
                            className="btn-copy-mini"
                            title="Copy number"
                            onClick={() => handleCopy(item.phone, `stu-${item.id}`, 'শিক্ষার্থীর মোবাইল নম্বর')}
                          >
                            {copiedKey === `stu-${item.id}` ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                      {item.guardianPhone && (
                        <div className="notif-detail-row">
                          <span className="detail-label">{lang === 'EN' ? 'Guardian Phone:' : 'অভিভাবকের নম্বর:'}</span>
                          <div className="phone-copy-wrap">
                            <a href={`tel:${item.guardianPhone}`} className="phone-link">{item.guardianPhone}</a>
                            <button
                              type="button"
                              className="btn-copy-mini"
                              title="Copy guardian number"
                              onClick={() => handleCopy(item.guardianPhone, `g-${item.id}`, 'অভিভাবকের মোবাইল নম্বর')}
                            >
                              {copiedKey === `g-${item.id}` ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="notif-detail-row">
                        <span className="detail-label">{lang === 'EN' ? 'Monthly Fee:' : 'মাসিক ফি:'}</span>
                        <strong className="detail-value">৳ {item.monthlyFee.toLocaleString()}</strong>
                      </div>
                    </div>

                    <div className="notif-action-row">
                      <button 
                        type="button"
                        className="btn-notif-action btn-primary-action btn-danger-action"
                        onClick={() => handleOpenQuickCollect(item)}
                      >
                        <CreditCard size={15} />
                        {lang === 'EN' ? 'Collect Monthly Fee' : 'বেতন গ্রহণ করুন'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })
        ) : (
          <div className="empty-state-box">
            <Bell size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <h3>{lang === 'EN' ? 'All caught up!' : 'সবকিছু হালনাগাদ রয়েছে!'}</h3>
            <p>
              {lang === 'EN' 
                ? 'No pending online admission requests, 1-month course installments, or monthly dues right now.' 
                : 'বর্তমানে কোনো নতুন ভর্তি আবেদন, কোর্স ফি কিস্তি বকেয়া বা মাসিক বেতন বকেয়া নেই।'}
            </p>
          </div>
        )}
      </div>

      {/* QUICK PAYMENT COLLECTION MODAL */}
      {collectingStudent && (
        <div className="notif-modal-overlay">
          <div className="notif-modal-card">
            <div className="notif-modal-header">
              <div>
                <h3>{lang === 'EN' ? 'Collect Payment' : 'পেমেন্ট গ্রহণ'}</h3>
                <p>{collectingStudent.name} ({collectingStudent.batch})</p>
              </div>
              <button 
                type="button" 
                className="btn-close-modal" 
                onClick={() => setCollectingStudent(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmQuickCollect} className="notif-modal-form">
              <div className="form-group">
                <label>{lang === 'EN' ? 'Collection Amount (৳)' : 'আদায়কৃত টাকা (৳)'}</label>
                <input
                  type="number"
                  className="form-control"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="e.g. 2000"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>{lang === 'EN' ? 'Payment Method' : 'পেমেন্ট মাধ্যম'}</label>
                <select
                  className="form-control"
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                >
                  <option value="Cash">Cash (নগদ)</option>
                  <option value="bKash">bKash (বিকাশ)</option>
                  <option value="Nagad">Nagad (নগদ)</option>
                  <option value="Rocket">Rocket (রকেট)</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>

              <div className="notif-modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setCollectingStudent(null)}
                >
                  {lang === 'EN' ? 'Cancel' : 'বাতিল'}
                </button>
                <button
                  type="submit"
                  className="btn-confirm-collect"
                >
                  <Check size={16} />
                  <span>{lang === 'EN' ? 'Confirm Payment' : 'পেমেন্ট নিশ্চিত করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
