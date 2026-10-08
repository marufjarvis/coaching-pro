import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import AdmissionForm from './AdmissionForm';
import { useEffect } from 'react';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
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

  return isLoggedIn ? <Dashboard /> : <Login onLogin={() => setIsLoggedIn(true)} />;
}

export default App;
