import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import AdmissionForm from './AdmissionForm';
import { useEffect } from 'react';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('coachingLoggedIn') !== 'false';
  });
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentHash.startsWith('#/enroll/')) {
    const batchName = decodeURIComponent(currentHash.replace('#/enroll/', ''));
    return <AdmissionForm batch={batchName} />;
  }

  const handleLogin = () => {
    localStorage.setItem('coachingLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.setItem('coachingLoggedIn', 'false');
    setIsLoggedIn(false);
  };

  return isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Login onLogin={handleLogin} />;
}

export default App;
