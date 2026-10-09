// src/api.js
// Client for Laravel REST API backend (Coaching Pro)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`[API Error: ${endpoint}]`, error.message);
    throw error;
  }
}

export const api = {
  // --- AUTHENTICATION ---
  async login({ email, password }) {
    return request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  // --- BATCHES ---
  async getBatches() {
    return request('/batches');
  },
  async createBatch(name) {
    return request('/batches', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  },
  async updateBatch(id, name) {
    return request(`/batches/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ name })
    });
  },
  async deleteBatch(id) {
    return request(`/batches/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // --- STUDENTS ---
  async getStudents() {
    return request('/students');
  },
  async getStudent(id) {
    return request(`/students/${encodeURIComponent(id)}`);
  },
  async createStudent(student) {
    return request('/students', {
      method: 'POST',
      body: JSON.stringify(student)
    });
  },
  async updateStudent(id, student) {
    return request(`/students/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(student)
    });
  },
  async deleteStudent(id) {
    return request(`/students/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // --- PAYMENTS ---
  async getPayments() {
    return request('/payments');
  },
  async createPayment(payment) {
    return request('/payments', {
      method: 'POST',
      body: JSON.stringify(payment)
    });
  },
  async deletePayment(id) {
    return request(`/payments/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // --- ATTENDANCE ---
  async getAttendance() {
    return request('/attendances');
  },
  async saveAttendance(date, batch, records) {
    return request('/attendances', {
      method: 'POST',
      body: JSON.stringify({ date, batch, records })
    });
  },

  // --- EXAMS ---
  async getExams() {
    return request('/exams');
  },
  async createExam(exam) {
    return request('/exams', {
      method: 'POST',
      body: JSON.stringify(exam)
    });
  },
  async saveExamMarks(examId, marks) {
    return request(`/exams/${encodeURIComponent(examId)}/marks`, {
      method: 'POST',
      body: JSON.stringify({ marks })
    });
  },
  async deleteExam(id) {
    return request(`/exams/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // --- EXPENSES ---
  async getExpenses() {
    return request('/expenses');
  },
  async createExpense(expense) {
    return request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense)
    });
  },
  async deleteExpense(id) {
    return request(`/expenses/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // --- STAFF ---
  async getStaff() {
    return request('/staff');
  },
  async createStaff(member) {
    return request('/staff', {
      method: 'POST',
      body: JSON.stringify(member)
    });
  },
  async deleteStaff(id) {
    return request(`/staff/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // --- SETTINGS ---
  async getSettings() {
    return request('/settings');
  },
  async updateSettings(settings) {
    return request('/settings', {
      method: 'POST',
      body: JSON.stringify(settings)
    });
  },

  // --- ONLINE ADMISSIONS ---
  async getOnlineAdmissions() {
    return request('/online-admissions');
  },
  async createOnlineAdmission(admission) {
    return request('/online-admissions', {
      method: 'POST',
      body: JSON.stringify(admission)
    });
  },
  async approveOnlineAdmission(id, studentData) {
    return request(`/online-admissions/${encodeURIComponent(id)}/approve`, {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  },
  async deleteOnlineAdmission(id) {
    return request(`/online-admissions/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // --- ENROLLMENT LINKS ---
  async getEnrollmentLinks() {
    return request('/enrollment-links');
  },
  async saveEnrollmentLink(batch, url) {
    return request('/enrollment-links', {
      method: 'POST',
      body: JSON.stringify({ batch, url })
    });
  },
  async deleteEnrollmentLink(id) {
    return request(`/enrollment-links/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // --- DASHBOARD ---
  async getDashboardStats() {
    return request('/dashboard-stats');
  }
};
