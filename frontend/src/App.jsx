import React, { useState } from 'react';
import './index.css';
import AuthScreen from './components/AuthScreen';
import ResearchCall from './components/ResearchCall';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    console.log('✅ Пользователь вошёл:', userData);
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return <ResearchCall />;
}

export default App;
