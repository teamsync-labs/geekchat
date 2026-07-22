import React, { useState } from 'react';
import './index.css';
import HomeScreen from './components/HomeScreen';
import AuthScreen from './components/AuthScreen';
import ResearchCall from './components/ResearchCall';

function App() {
  const [screen, setScreen] = useState('home');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setScreen('call');
  };

  const handleGoHome = () => {
    setScreen('home');
  };

  const handleCreateMeeting = () => {
    setScreen('auth');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen onCreateMeeting={handleCreateMeeting} onLogin={() => setScreen('auth')} />;
      case 'auth':
        return <AuthScreen onLogin={handleLogin} onGoHome={handleGoHome} />;
      case 'call':
        return <ResearchCall onGoHome={handleGoHome} user={user} />;
      default:
        return <HomeScreen onCreateMeeting={handleCreateMeeting} onLogin={() => setScreen('auth')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {renderScreen()}
    </div>
  );
}

export default App;
