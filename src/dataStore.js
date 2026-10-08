// src/dataStore.js
// Centralized reactive data store for Coaching Pro
// Seamlessly backed by Laravel REST API + MySQL database with offline fallback

import { api } from './api';

const STORAGE_KEYS = {
  BATCHES: 'coachingBatches',
  STUDENTS: 'coachingStudents',
  PAYMENTS: 'coachingPayments',
  ATTENDANCE: 'coachingAttendance',
  EXAMS: 'coachingExams',
  EXPENSES: 'coachingExpenses',
  STAFF: 'coachingStaff',
  SETTINGS: 'coachingSettings',
  PENDING_ADMISSIONS: 'pendingAdmissions',
  LANGUAGE: 'coachingLanguage',
  DISMISSED_GUIDE: 'coachingDismissedGuide'
};

// Dispatch Custom Event for Reactive State
const notifyChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('coaching-data-change'));
    window.dispatchEvent(new Event('storage'));
  }
};

export const dataStore = {
  // --- BACKEND SYNCHRONIZATION ---
  async syncWithBackend() {
    try {
      const [
        batches,
        students,
        payments,
        attendance,
        exams,
        expenses,
        staff,
        settings,
        onlineAdmissions
      ] = await Promise.all([
        api.getBatches().catch(() => null),
        api.getStudents().catch(() => null),
        api.getPayments().catch(() => null),
        api.getAttendance().catch(() => null),
        api.getExams().catch(() => null),
        api.getExpenses().catch(() => null),
        api.getStaff().catch(() => null),
        api.getSettings().catch(() => null),
        api.getOnlineAdmissions().catch(() => null),
      ]);

      if (batches && Array.isArray(batches)) {
        localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
      }
      if (students && Array.isArray(students)) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      }
      if (payments && Array.isArray(payments)) {
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
      }
      if (attendance && typeof attendance === 'object') {
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
      }
      if (exams && Array.isArray(exams)) {
        localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
      }
      if (expenses && Array.isArray(expenses)) {
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
      }
      if (staff && Array.isArray(staff)) {
        localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
      }
      if (settings && typeof settings === 'object') {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      }
      if (onlineAdmissions && Array.isArray(onlineAdmissions)) {
        localStorage.setItem(STORAGE_KEYS.PENDING_ADMISSIONS, JSON.stringify(onlineAdmissions));
        localStorage.setItem('pendingStudents', JSON.stringify(onlineAdmissions));
      }

      notifyChange();
      console.log('[DataStore] Successfully synced with Laravel backend (MySQL)');
      return true;
    } catch (err) {
      console.warn('[DataStore] Backend sync failed, using offline cache:', err.message);
      return false;
    }
  },

  // --- BATCHES ---
  getBatches() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BATCHES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(b => ({
            id: b.id || `BAT-${Math.random().toString().slice(2, 6)}`,
            name: typeof b === 'string' ? b.trim() : (b.name ? b.name.trim() : '')
          }));
        }
      }
    } catch (e) {}
    return [];
  },

  saveBatches(batches) {
    const cleaned = batches.map(b => ({
      id: b.id,
      name: b.name.trim()
    }));
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(cleaned));
    notifyChange();
  },

  addBatch(batchInput) {
    const batches = this.getBatches();
    const batchName = typeof batchInput === 'string' 
      ? batchInput.trim() 
      : (batchInput && batchInput.name ? batchInput.name.trim() : '');
    if (!batchName) return null;

    const newBatch = {
      id: `BAT-${Date.now().toString().slice(-4)}`,
      name: batchName
    };
    const updated = [...batches, newBatch];
    this.saveBatches(updated);

    // Sync to Laravel API in background
    api.createBatch(batchName)
      .then(res => {
        if (res && res.id) {
          const fresh = this.getBatches().map(b => b.name === batchName ? { ...b, id: res.id } : b);
          localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(fresh));
          notifyChange();
        }
      })
      .catch(e => console.error('[API Batch Error]', e));

    return newBatch;
  },

  updateBatch(id, updatedData) {
    const batches = this.getBatches();
    const newName = typeof updatedData === 'string' 
      ? updatedData.trim() 
      : (updatedData && updatedData.name ? updatedData.name.trim() : '');
    const updated = batches.map(b => (b.id === id || b.name === id ? { ...b, name: newName || b.name } : b));
    this.saveBatches(updated);

    api.updateBatch(id, newName).catch(e => console.error('[API Batch Update Error]', e));
  },

  deleteBatch(id) {
    const batches = this.getBatches();
    const updated = batches.filter(b => b.id !== id && b.name !== id);
    this.saveBatches(updated);

    api.deleteBatch(id).catch(e => console.error('[API Batch Delete Error]', e));
  },

  // --- STUDENTS ---
  getStudents() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  },

  saveStudents(students) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    notifyChange();
  },

  addStudent(student) {
    const students = this.getStudents();
    const initials = student.name ? student.name.trim().substring(0, 2).toUpperCase() : 'ST';
    const newStudent = {
      id: student.id || `STU-${Math.floor(10000 + Math.random() * 90000)}`,
      name: student.name.trim(),
      initials,
      batch: student.batch || 'Unassigned',
      status: student.status || 'Active',
      phone: student.phone || '',
      guardianPhone: student.guardianPhone || '',
      feeType: student.feeType || 'monthly',
      feeAmount: Number(student.feeAmount) || 0,
      admissionFee: Number(student.admissionFee) || 0,
      discount: Number(student.discount) || 0,
      installments: Number(student.installments) || 1,
      paidAmount: Number(student.paidAmount) || 0,
      billingDate: student.feeType === 'monthly' ? '1st of every month' : null,
      nextInstallmentDate: student.feeType === 'course' ? student.nextInstallmentDate || '01/11/2026' : null,
      admissionDate: student.admissionDate || new Date().toLocaleDateString('en-GB')
    };
    const updated = [newStudent, ...students];
    this.saveStudents(updated);

    // Sync to Laravel API
    api.createStudent({
      id: newStudent.id,
      name: newStudent.name,
      phone: newStudent.phone,
      guardianPhone: newStudent.guardianPhone,
      batch: newStudent.batch,
      feeType: newStudent.feeType,
      feeAmount: newStudent.feeAmount,
      admissionFee: newStudent.admissionFee,
      discount: newStudent.discount,
      installments: newStudent.installments,
      paidAmount: newStudent.paidAmount,
      status: newStudent.status,
      admissionDate: newStudent.admissionDate
    }).catch(e => console.error('[API Add Student Error]', e));

    return newStudent;
  },

  updateStudent(id, updatedData) {
    const students = this.getStudents();
    const updated = students.map(s => {
      if (s.id === id) {
        const initials = updatedData.name ? updatedData.name.trim().substring(0, 2).toUpperCase() : s.initials;
        return { ...s, ...updatedData, initials };
      }
      return s;
    });
    this.saveStudents(updated);

    api.updateStudent(id, updatedData).catch(e => console.error('[API Update Student Error]', e));
  },

  deleteStudent(id) {
    const students = this.getStudents();
    const updated = students.filter(s => s.id !== id);
    this.saveStudents(updated);

    api.deleteStudent(id).catch(e => console.error('[API Delete Student Error]', e));
  },

  // --- PAYMENTS ---
  getPayments() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  },

  savePayments(payments) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    notifyChange();
  },

  recordPayment({ studentId, amount, method, collectedBy, note, date, time }) {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    const numericAmount = Number(amount) || 0;
    if (numericAmount <= 0) return null;

    const payments = this.getPayments();
    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: student.id,
      studentName: student.name,
      batch: student.batch,
      amount: numericAmount,
      feeType: student.feeType,
      method: method || 'Cash',
      collectedBy: collectedBy || 'Admin',
      date: date || new Date().toLocaleDateString('en-GB'),
      time: time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      note: note || `${student.feeType === 'monthly' ? 'Monthly Fee' : 'Course Fee Installment'}`
    };

    // Update student paid amount in students list
    const updatedStudents = students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          paidAmount: (Number(s.paidAmount) || 0) + numericAmount
        };
      }
      return s;
    });

    this.saveStudents(updatedStudents);

    const updatedPayments = [newTxn, ...payments];
    this.savePayments(updatedPayments);

    // Sync to Laravel API
    api.createPayment({
      id: newTxn.id,
      studentId: student.id,
      studentName: student.name,
      batch: student.batch,
      amount: numericAmount,
      method: newTxn.method,
      collectedBy: newTxn.collectedBy,
      date: newTxn.date,
      time: newTxn.time,
      note: newTxn.note
    }).catch(e => console.error('[API Record Payment Error]', e));

    return newTxn;
  },

  // --- ATTENDANCE ---
  getAttendance() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {};
  },

  getAttendanceForDateAndBatch(date, batch) {
    const all = this.getAttendance();
    const key = `${date}_${batch}`;
    return all[key] || {};
  },

  saveAttendanceForDateAndBatch(date, batch, records) {
    const all = this.getAttendance();
    const key = `${date}_${batch}`;
    all[key] = records;
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(all));
    notifyChange();

    // Sync to Laravel API
    api.saveAttendance(date, batch, records).catch(e => console.error('[API Save Attendance Error]', e));
  },

  getStudentAttendanceStats(studentId) {
    const all = this.getAttendance();
    let present = 0, absent = 0, late = 0, leave = 0, total = 0;
    Object.values(all).forEach(batchRecord => {
      if (batchRecord[studentId]) {
        total++;
        const status = batchRecord[studentId];
        if (status === 'Present') present++;
        else if (status === 'Absent') absent++;
        else if (status === 'Late') late++;
        else if (status === 'Leave') leave++;
      }
    });
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { present, absent, late, leave, total, percentage };
  },

  // --- EXAMS ---
  getExams() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXAMS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  },

  saveExams(exams) {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
    notifyChange();
  },

  addExam(exam) {
    const exams = this.getExams();
    const newExam = {
      id: `EXM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: exam.name.trim(),
      batch: exam.batch || 'All Batches',
      subject: exam.subject.trim(),
      date: exam.date || new Date().toISOString().substring(0, 10),
      totalMarks: Number(exam.totalMarks) || 50,
      passMarks: Number(exam.passMarks) || 40,
      marks: {}
    };
    const updated = [newExam, ...exams];
    this.saveExams(updated);

    api.createExam({
      name: newExam.name,
      batch: newExam.batch,
      subject: newExam.subject,
      date: newExam.date,
      totalMarks: newExam.totalMarks,
      passMarks: newExam.passMarks
    }).then(res => {
      if (res && res.id) {
        const fresh = this.getExams().map(e => e.id === newExam.id ? { ...e, id: res.id, db_id: res.db_id } : e);
        this.saveExams(fresh);
      }
    }).catch(e => console.error('[API Create Exam Error]', e));

    return newExam;
  },

  saveExamMarks(examId, marks) {
    const exams = this.getExams();
    const updated = exams.map(e => e.id === examId ? { ...e, marks: { ...e.marks, ...marks } } : e);
    this.saveExams(updated);

    api.saveExamMarks(examId, marks).catch(e => console.error('[API Save Exam Marks Error]', e));
  },

  deleteExam(id) {
    const exams = this.getExams();
    const updated = exams.filter(e => e.id !== id);
    this.saveExams(updated);

    api.deleteExam(id).catch(e => console.error('[API Delete Exam Error]', e));
  },

  // --- EXPENSES ---
  getExpenses() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  },

  saveExpenses(expenses) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    notifyChange();
  },

  addExpense(expense) {
    const expenses = this.getExpenses();
    const newExp = {
      id: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: expense.title.trim(),
      amount: Number(expense.amount) || 0,
      category: expense.category || 'General',
      date: expense.date || new Date().toISOString().substring(0, 10)
    };
    const updated = [newExp, ...expenses];
    this.saveExpenses(updated);

    api.createExpense({
      title: newExp.title,
      amount: newExp.amount,
      category: newExp.category,
      date: newExp.date
    }).then(res => {
      if (res && res.id) {
        const fresh = this.getExpenses().map(ex => ex.id === newExp.id ? { ...ex, id: res.id } : ex);
        this.saveExpenses(fresh);
      }
    }).catch(e => console.error('[API Create Expense Error]', e));

    return newExp;
  },

  deleteExpense(id) {
    const expenses = this.getExpenses();
    const updated = expenses.filter(e => e.id !== id);
    this.saveExpenses(updated);

    api.deleteExpense(id).catch(e => console.error('[API Delete Expense Error]', e));
  },

  // --- STAFF ---
  getStaff() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STAFF);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  },

  saveStaff(staff) {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
    notifyChange();
  },

  addStaff(member) {
    const staff = this.getStaff();
    const newMember = {
      id: Date.now(),
      name: member.name.trim(),
      phone: member.phone.trim(),
      role: member.role || 'Manager',
      status: 'Active'
    };
    const updated = [newMember, ...staff];
    this.saveStaff(updated);

    api.createStaff({
      name: newMember.name,
      phone: newMember.phone,
      role: newMember.role,
      status: newMember.status
    }).catch(e => console.error('[API Add Staff Error]', e));

    return newMember;
  },

  deleteStaff(id) {
    const staff = this.getStaff();
    const updated = staff.filter(s => s.id !== id);
    this.saveStaff(updated);

    api.deleteStaff(id).catch(e => console.error('[API Delete Staff Error]', e));
  },

  // --- SETTINGS ---
  getSettings() {
    const defaultSettings = {
      coachingName: "Maruf's ICT Care",
      phone: '01723619524',
      address: 'Kushtia Govt. College Gate, Kushtia',
      tagline: "Don't Memorise, Come To Learn",
      currency: '৳',
      adminPassword: 'admin'
    };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        if (typeof parsed === 'object') return { ...defaultSettings, ...parsed };
      }
    } catch (e) {}
    return defaultSettings;
  },

  saveSettings(settings) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    notifyChange();

    api.updateSettings(updated).catch(e => console.error('[API Save Settings Error]', e));
    return updated;
  },

  // --- ONLINE ADMISSIONS ---
  getPendingAdmissions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PENDING_ADMISSIONS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  },

  savePendingAdmissions(admissions) {
    localStorage.setItem(STORAGE_KEYS.PENDING_ADMISSIONS, JSON.stringify(admissions));
    localStorage.setItem('pendingStudents', JSON.stringify(admissions));
    notifyChange();
  },

  addPendingAdmission(appData) {
    const current = this.getPendingAdmissions();
    const updated = [appData, ...current];
    this.savePendingAdmissions(updated);

    api.createOnlineAdmission(appData).catch(e => console.error('[API Online Admission Error]', e));
  },

  deletePendingAdmission(id) {
    const current = this.getPendingAdmissions();
    const updated = current.filter(a => a.id !== id);
    this.savePendingAdmissions(updated);

    api.deleteOnlineAdmission(id).catch(e => console.error('[API Delete Admission Error]', e));
  },

  // --- LANGUAGE MANAGEMENT ---
  getLanguage() {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'BN';
  },

  setLanguage(lang) {
    const selected = (lang === 'EN') ? 'EN' : 'BN';
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, selected);
    notifyChange();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('coaching-language-change', { detail: selected }));
    }
    return selected;
  },

  // --- CALCULATIONS & STATS ---
  calculateDue(student) {
    const totalFee = Number(student.feeAmount) || 0;
    const paid = Number(student.paidAmount) || 0;
    const dueAmount = Math.max(0, totalFee - paid);
    const isDue = dueAmount > 0;
    return { dueAmount, isDue };
  },

  getStats() {
    const students = this.getStudents();
    const payments = this.getPayments();
    const batches = this.getBatches();
    const expenses = this.getExpenses();
    const attendance = this.getAttendance();

    const activeStudents = students.filter(s => s.status === 'Active');
    
    // Collected this month
    const totalCollected = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // Total Due
    let totalDues = 0;
    let dueCount = 0;
    activeStudents.forEach(s => {
      const { dueAmount, isDue } = this.calculateDue(s);
      if (isDue) {
        totalDues += dueAmount;
        dueCount++;
      }
    });

    // Attendance Avg calculation
    let totalAttRecords = 0;
    let presentCount = 0;
    Object.values(attendance).forEach(record => {
      Object.values(record).forEach(status => {
        totalAttRecords++;
        if (status === 'Present' || status === 'Late') presentCount++;
      });
    });
    const attendanceAvg = totalAttRecords > 0 ? Math.round((presentCount / totalAttRecords) * 100) + '%' : '92%';

    // Total Expenses
    const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

    return {
      activeStudentsCount: activeStudents.length,
      totalCollected,
      totalDues,
      dueCount,
      attendanceAvg,
      totalBatches: batches.length,
      totalExpenses,
      netProfit: totalCollected - totalExpenses
    };
  }
};

// Automatically sync with Laravel backend when loaded in browser
if (typeof window !== 'undefined') {
  dataStore.syncWithBackend();

  // Re-sync on tab refocus to get any updates made elsewhere
  window.addEventListener('focus', () => {
    dataStore.syncWithBackend();
  });
}
