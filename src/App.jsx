// src/App.jsx
// Main Application Component with Smart Hash-Based Routing
// Routes:
//  - '' | '#/' | '#/home' -> High-Converting HSC ICT Landing Page
//  - '#/student-login'   -> Student Phone-Only Login
//  - '#/admin-login'     -> Admin / Teacher Login
//  - '#/student'         -> Student Portal Dashboard
//  - '#/admin'           -> Full Coaching Admin Dashboard
//  - '#/enroll'          -> Online Admission Form

import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import Login from './Login';
import StudentLogin from './StudentLogin';
import Dashboard from './Dashboard';
import StudentDashboard from './StudentDashboard';
import AdmissionForm from './AdmissionForm';
import { dataStore } from './dataStore';
import './index.css';

function App() {
  // Admin / Manager Login State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('coachingLoggedIn') === 'true';
  });

  // Student Login State
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(() => {
    return localStorage.getItem('coachingStudentLoggedIn') === 'true';
  });

  const [currentStudent, setCurrentStudent] = useState(() => {
    try {
      const s = localStorage.getItem('coachingCurrentStudent');
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  });

  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#/');
  const [batches, setBatches] = useState(() => dataStore.getBatches());

  // Listen to hash changes and reactive dataStore updates
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };

    const handleDataChange = () => {
      setBatches(dataStore.getBatches());
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('coaching-data-change', handleDataChange);
    window.addEventListener('storage', handleDataChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('coaching-data-change', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
    };
  }, []);

  // --- AUTH HANDLERS ---
  const handleLogin = (user) => {
    localStorage.setItem('coachingLoggedIn', 'true');
    if (user) {
      localStorage.setItem('coachingUser', JSON.stringify(user));
    }
    setIsLoggedIn(true);
    window.location.hash = '#/admin';
  };

  const handleLogout = () => {
    localStorage.setItem('coachingLoggedIn', 'false');
    localStorage.removeItem('coachingUser');
    setIsLoggedIn(false);
    window.location.hash = '#/';
  };

  const handleStudentLogin = (studentData) => {
    localStorage.setItem('coachingStudentLoggedIn', 'true');
    if (studentData) {
      localStorage.setItem('coachingCurrentStudent', JSON.stringify(studentData));
      setCurrentStudent(studentData);
    }
    setIsStudentLoggedIn(true);
    window.location.hash = '#/student';
  };

  const handleStudentLogout = () => {
    localStorage.setItem('coachingStudentLoggedIn', 'false');
    localStorage.removeItem('coachingCurrentStudent');
    setIsStudentLoggedIn(false);
    setCurrentStudent(null);
    window.location.hash = '#/';
  };

  // --- NAVIGATION HELPER SHORTCUTS ---
  const navigateTo = (hash) => {
    window.location.hash = hash;
  };

  // --- ROUTING LOGIC ---

  // 1. Online Admission Form (#/enroll or #/enroll/<batchName>)
  if (currentHash.startsWith('#/enroll')) {
    const rawBatch = currentHash.replace('#/enroll/', '').replace('#/enroll', '');
    const batchName = rawBatch ? decodeURIComponent(rawBatch) : '';
    return <AdmissionForm batch={batchName} />;
  }

  // 2. Admin Dashboard Route (#/admin or #/dashboard)
  if (currentHash === '#/admin' || currentHash === '#/dashboard') {
    if (isLoggedIn) {
      return <Dashboard onLogout={handleLogout} />;
    }
    // If not logged in as admin, show unified login with admin tab
    return (
      <Login 
        onLogin={handleLogin} 
        onStudentLogin={handleStudentLogin}
        onBackToHome={() => navigateTo('#/')}
        initialTab="admin"
      />
    );
  }

  // 3. Admin Login Route (#/admin-login)
  if (currentHash === '#/admin-login') {
    if (isLoggedIn) {
      return <Dashboard onLogout={handleLogout} />;
    }
    return (
      <Login 
        onLogin={handleLogin} 
        onStudentLogin={handleStudentLogin}
        onBackToHome={() => navigateTo('#/')}
        initialTab="admin"
      />
    );
  }

  // 4. Student Dashboard Route (#/student or #/student-dashboard)
  if (currentHash === '#/student' || currentHash === '#/student-dashboard') {
    if (isStudentLoggedIn && currentStudent) {
      return <StudentDashboard onLogout={handleStudentLogout} student={currentStudent} />;
    }
    // If not logged in as student, redirect to login with student tab
    return (
      <Login 
        onLogin={handleLogin} 
        onStudentLogin={handleStudentLogin}
        onBackToHome={() => navigateTo('#/')}
        initialTab="student"
      />
    );
  }

  // 5. Unified Login & Student Login Route (#/login or #/student-login)
  if (currentHash === '#/login' || currentHash === '#/student-login') {
    if (isStudentLoggedIn && currentStudent) {
      return <StudentDashboard onLogout={handleStudentLogout} student={currentStudent} />;
    }
    if (isLoggedIn) {
      return <Dashboard onLogout={handleLogout} />;
    }
    return (
      <Login 
        onLogin={handleLogin} 
        onStudentLogin={handleStudentLogin}
        onBackToHome={() => navigateTo('#/')}
        initialTab="student"
      />
    );
  }

  // 6. Default / Root Route (Landing Page for Students & Visitors)
  return (
    <LandingPage 
      onGoToLogin={() => navigateTo('#/login')}
      onGoToStudentLogin={() => navigateTo('#/login')}
      onGoToAdminLogin={() => navigateTo('#/admin-login')}
      onGoToEnroll={(preferredBatch) => {
        if (preferredBatch && typeof preferredBatch === 'string') {
          navigateTo(`#/enroll/${encodeURIComponent(preferredBatch)}`);
        } else {
          navigateTo('#/enroll');
        }
      }}
      onGoToDashboard={() => navigateTo('#/admin')}
      onGoToStudentDashboard={() => navigateTo('#/student')}
      isAdminLoggedIn={isLoggedIn}
      isStudentLoggedIn={isStudentLoggedIn}
      batches={batches}
    />
  );
}

export default App;
