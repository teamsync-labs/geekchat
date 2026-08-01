import React, { useState } from 'react';
import './index.css';
import HomeScreen from './components/HomeScreen';
import AuthScreen from './components/AuthScreen';
import ResearchCall from './components/ResearchCall';

function App() {
  const [screen, setScreen] = useState('home');

  const handleLogin = () => setScreen('auth');
  const handleAuthSuccess = () => setScreen('call');
  const handleGoHome = () => setScreen('home');
  const handleCreateMeeting = () => setScreen('auth');

  if (screen === 'home') {
    return <HomeScreen onCreateMeeting={handleCreateMeeting} onLogin={handleLogin} />;
  }
  if (screen === 'auth') {
    return <AuthScreen onLogin={handleAuthSuccess} onGoHome={handleGoHome} />;
  }
  if (screen === 'call') {
    return <ResearchCall onGoHome={handleGoHome} />;
  }
  return null;
}

export default App;
