import React, { useState, useEffect } from 'react';
import Login from './Login';
import StudentLogin from './StudentLogin';
import Dashboard from './Dashboard';
import StudentDashboard from './StudentDashboard';
import AdmissionForm from './AdmissionForm';
import './index.css';

function App() {
  // Admin / Manager Login State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('coachingLoggedIn') !== 'false';
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

  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [authPortal, setAuthPortal] = useState(() => {
    return window.location.hash.includes('student') ? 'student' : 'admin';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentHash(hash);
      if (hash.includes('student')) {
        setAuthPortal('student');
      } else if (hash.includes('admin') || hash === '' || hash === '#/') {
        setAuthPortal('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 1. Online Admission Public Form
  if (currentHash.startsWith('#/enroll/')) {
    const batchName = decodeURIComponent(currentHash.replace('#/enroll/', ''));
    return <AdmissionForm batch={batchName} />;
  }

  // 2. Admin & Manager Handlers
  const handleLogin = (user) => {
    localStorage.setItem('coachingLoggedIn', 'true');
    if (user) {
      localStorage.setItem('coachingUser', JSON.stringify(user));
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.setItem('coachingLoggedIn', 'false');
    localStorage.removeItem('coachingUser');
    setIsLoggedIn(false);
  };

  // 3. Student Handlers
  const handleStudentLogin = (studentData) => {
    localStorage.setItem('coachingStudentLoggedIn', 'true');
    if (studentData) {
      localStorage.setItem('coachingCurrentStudent', JSON.stringify(studentData));
      setCurrentStudent(studentData);
    }
    setIsStudentLoggedIn(true);
  };

  const handleStudentLogout = () => {
    localStorage.setItem('coachingStudentLoggedIn', 'false');
    localStorage.removeItem('coachingCurrentStudent');
    setIsStudentLoggedIn(false);
    setCurrentStudent(null);
  };

  // 4. Render Active Session
  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  if (isStudentLoggedIn) {
    return <StudentDashboard onLogout={handleStudentLogout} student={currentStudent} />;
  }

  // 5. Render Logged-Out Portal (Student vs Admin/Manager)
  if (authPortal === 'student') {
    return (
      <StudentLogin 
        onStudentLogin={handleStudentLogin} 
        onSwitchToAdmin={() => {
          setAuthPortal('admin');
          window.location.hash = '#/admin-login';
        }} 
      />
    );
  }

  return (
    <Login 
      onLogin={handleLogin} 
      onSwitchToStudent={() => {
        setAuthPortal('student');
        window.location.hash = '#/student-login';
      }} 
    />
  );
}

export default App;
