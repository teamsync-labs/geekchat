import React, { useState } from 'react';
import './index.css';
import AuthScreen from './components/AuthScreen';
import ResearchCall from './components/ResearchCall';
import { VideoChat } from './components/VideoChat';

function App() {
  const [user, setUser] = useState(null);
  const [showTest, setShowTest] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    console.log('✅ Пользователь вошёл:', userData);
  };

  // ===== ДЛЯ ТЕСТА: показываем VideoChat =====
  // Раскомментируйте следующую строку, чтобы протестировать PeerJS
  // return <VideoChat />;

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return <ResearchCall />;
}

export default App;
