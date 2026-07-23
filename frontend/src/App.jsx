import React, { useState, useEffect } from 'react';
import './index.css';
import HomeScreen from './components/HomeScreen';
import AuthScreen from './components/AuthScreen';
import ResearchCall from './components/ResearchCall';

function App() {
  const [screen, setScreen] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateTo = (target) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen(target);
      setIsTransitioning(false);
    }, 400);
  };

  const handleLogin = () => navigateTo('call');
  const handleGoHome = () => navigateTo('home');
  const handleCreateMeeting = () => navigateTo('auth');

  if (isTransitioning) {
    return (
      <div className="min-h-screen bg-premium flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#2A4A7A] border-t-[#8AB4F8] rounded-full animate-spin"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A4A7A] to-[#8AB4F8] rounded-full blur-3xl opacity-20 animate-pulse-ring"></div>
          <div className="absolute -inset-4 bg-gradient-to-r from-[#2A4A7A] to-[#8AB4F8] rounded-full blur-3xl opacity-10 animate-pulse-ring delay-500"></div>
        </div>
      </div>
    );
  }

  if (screen === 'home') {
    return <HomeScreen onCreateMeeting={handleCreateMeeting} onLogin={handleLogin} />;
  }
  if (screen === 'auth') {
    return <AuthScreen onLogin={handleLogin} onGoHome={handleGoHome} />;
  }
  if (screen === 'call') {
    return <ResearchCall onGoHome={handleGoHome} />;
  }
  return null;
}

export default App;
