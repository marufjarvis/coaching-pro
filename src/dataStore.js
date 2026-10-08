// src/dataStore.js
// Centralized reactive data store for Coaching Pro

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

// Initial Seed Batches
const DEFAULT_BATCHES = [
  { id: 'BAT-01', name: 'Sat-6:45am', schedule: 'Sat, Mon, Wed (6:45 AM)', monthlyFee: 500, courseFee: 4000 },
  { id: 'BAT-02', name: 'Sat-7:45am', schedule: 'Sat, Mon, Wed (7:45 AM)', monthlyFee: 500, courseFee: 4000 },
  { id: 'BAT-03', name: 'Sat-9am', schedule: 'Sat, Mon, Wed (9:00 AM)', monthlyFee: 500, courseFee: 4000 },
  { id: 'BAT-04', name: 'Sat-10am', schedule: 'Sat, Mon, Wed (10:00 AM)', monthlyFee: 500, courseFee: 4000 },
  { id: 'BAT-05', name: 'Sat-2pm', schedule: 'Sat, Mon, Wed (2:00 PM)', monthlyFee: 500, courseFee: 4000 },
  { id: 'BAT-06', name: 'Sat-3pm', schedule: 'Sat, Mon, Wed (3:00 PM)', monthlyFee: 500, courseFee: 4000 },
  { id: 'BAT-07', name: 'Sat-4pm', schedule: 'Sat, Mon, Wed (4:00 PM)', monthlyFee: 500, courseFee: 4000 },
  { id: 'BAT-08', name: 'Sat-5pm', schedule: 'Sat, Mon, Wed (5:00 PM)', monthlyFee: 500, courseFee: 4000 },
  { id: 'BAT-09', name: 'Sun-6:45am', schedule: 'Sun, Tue, Thu (6:45 AM)', monthlyFee: 500, courseFee: 4000 },
  { id: 'BAT-10', name: 'Sun-8am', schedule: 'Sun, Tue, Thu (8:00 AM)', monthlyFee: 500, courseFee: 4000 },
  { id: 'BAT-11', name: 'Sun-9am', schedule: 'Sun, Tue, Thu (9:00 AM)', monthlyFee: 500, courseFee: 4000 },
  { id: 'BAT-12', name: 'Sun-10am', schedule: 'Sun, Tue, Thu (10:00 AM)', monthlyFee: 500, courseFee: 4000 },
];

// Initial Seed Students
const DEFAULT_STUDENTS = [
  {
    id: 'STU-66115',
    name: 'Maruf Hossain',
    initials: 'MH',
    batch: 'Sat-6:45am',
    status: 'Active',
    phone: '01723619524',
    guardianPhone: '01586232012',
    feeType: 'monthly',
    feeAmount: 500,
    admissionFee: 200,
    discount: 0,
    installments: 1,
    paidAmount: 500,
    billingDate: '1st of every month',
    admissionDate: '01/10/2026'
  },
  {
    id: 'STU-45213',
    name: 'Rakib Hasan',
    initials: 'RH',
    batch: 'Sat-6:45am',
    status: 'Active',
    phone: '01534343434',
    guardianPhone: '01711122233',
    feeType: 'course',
    feeAmount: 4000,
    discount: 0,
    installments: 2,
    paidAmount: 2000,
    nextInstallmentDate: '01/11/2026',
    admissionDate: '05/10/2026'
  },
  {
    id: 'STU-10293',
    name: 'Ayesha Siddiqua',
    initials: 'AS',
    batch: 'Sun-8am',
    status: 'Active',
    phone: '01912345678',
    guardianPhone: '01811223344',
    feeType: 'monthly',
    feeAmount: 500,
    admissionFee: 200,
    discount: 0,
    installments: 1,
    paidAmount: 0,
    billingDate: '1st of every month',
    admissionDate: '15/09/2026'
  }
];

// Initial Seed Payments
const DEFAULT_PAYMENTS = [
  {
    id: 'TXN-1001',
    studentId: 'STU-66115',
    studentName: 'Maruf Hossain',
    batch: 'Sat-6:45am',
    amount: 500,
    feeType: 'monthly',
    method: 'bKash',
    collectedBy: 'Admin',
    date: '08/10/2026',
    time: '10:30 AM',
    note: 'October Monthly Fee'
  },
  {
    id: 'TXN-1002',
    studentId: 'STU-45213',
    studentName: 'Rakib Hasan',
    batch: 'Sat-6:45am',
    amount: 2000,
    feeType: 'course',
    method: 'Cash',
    collectedBy: 'Admin',
    date: '05/10/2026',
    time: '11:45 AM',
    note: '1st Installment Admission Fee'
  }
];

// Initial Seed Expenses
const DEFAULT_EXPENSES = [
  { id: 'EXP-101', title: 'Classroom Electricity Bill', amount: 850, category: 'Utilities', date: '2026-10-02' },
  { id: 'EXP-102', title: 'Whiteboard Markers & Sheets', amount: 350, category: 'Materials', date: '2026-10-04' },
  { id: 'EXP-103', title: 'Internet Wi-Fi Monthly Bill', amount: 600, category: 'Utilities', date: '2026-10-06' }
];

// Initial Seed Staff
const DEFAULT_STAFF = [
  { id: 1, name: 'Maruf Hossain', phone: '01723619524', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Sakib Ahmed', phone: '01822334455', role: 'Manager', status: 'Active' }
];

// Initial Seed Settings
const DEFAULT_SETTINGS = {
  coachingName: "Maruf's ICT Care",
  phone: '01723619524',
  address: 'Kushtia Govt. College Gate, Kushtia',
  tagline: "Don't Memorise, Come To Learn",
  currency: '৳',
  adminPassword: 'admin'
};

// Dispatch Custom Event for Reactive State
const notifyChange = () => {
  window.dispatchEvent(new Event('coaching-data-change'));
};

export const dataStore = {
  // --- BATCHES ---
  getBatches() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BATCHES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(DEFAULT_BATCHES));
    return DEFAULT_BATCHES;
  },

  saveBatches(batches) {
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
    notifyChange();
  },

  addBatch(batch) {
    const batches = this.getBatches();
    const newBatch = {
      id: `BAT-${Date.now().toString().slice(-4)}`,
      name: batch.name.trim(),
      schedule: batch.schedule || 'Regular Batch',
      monthlyFee: Number(batch.monthlyFee) || 500,
      courseFee: Number(batch.courseFee) || 4000,
      createdAt: new Date().toISOString()
    };
    const updated = [...batches, newBatch];
    this.saveBatches(updated);
    return newBatch;
  },

  updateBatch(id, updatedData) {
    const batches = this.getBatches();
    const updated = batches.map(b => (b.id === id || b.name === id ? { ...b, ...updatedData } : b));
    this.saveBatches(updated);
  },

  deleteBatch(id) {
    const batches = this.getBatches();
    const updated = batches.filter(b => b.id !== id && b.name !== id);
    this.saveBatches(updated);
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
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    return DEFAULT_STUDENTS;
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
  },

  deleteStudent(id) {
    const students = this.getStudents();
    const updated = students.filter(s => s.id !== id);
    this.saveStudents(updated);
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
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(DEFAULT_PAYMENTS));
    return DEFAULT_PAYMENTS;
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
    const defaultExams = [
      {
        id: 'EXM-101',
        name: 'Chapter 1 MCQ & Written Test',
        batch: 'Sat-6:45am',
        subject: 'ICT',
        date: '2026-10-02',
        totalMarks: 50,
        passMarks: 40,
        marks: { 'STU-66115': 46, 'STU-45213': 42 }
      }
    ];
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(defaultExams));
    return defaultExams;
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
    return newExam;
  },

  saveExamMarks(examId, marks) {
    const exams = this.getExams();
    const updated = exams.map(e => e.id === examId ? { ...e, marks: { ...e.marks, ...marks } } : e);
    this.saveExams(updated);
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
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(DEFAULT_EXPENSES));
    return DEFAULT_EXPENSES;
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
    return newExp;
  },

  deleteExpense(id) {
    const expenses = this.getExpenses();
    const updated = expenses.filter(e => e.id !== id);
    this.saveExpenses(updated);
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
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(DEFAULT_STAFF));
    return DEFAULT_STAFF;
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
    return newMember;
  },

  deleteStaff(id) {
    const staff = this.getStaff();
    const updated = staff.filter(s => s.id !== id);
    this.saveStaff(updated);
  },

  // --- SETTINGS ---
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        if (typeof parsed === 'object') return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    notifyChange();
    return updated;
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
