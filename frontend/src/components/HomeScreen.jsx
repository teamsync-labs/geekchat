import React from 'react';
import { Button } from "@/components/ui/button";
import { Video, LogIn } from 'lucide-react';

function HomeScreen({ onCreateMeeting, onLogin }) {
  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4" data-testid="home-screen">
      <div className="text-center max-w-sm w-full">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#162035] rounded-full flex items-center justify-center border border-[#2A4A7A]/30">
          <span className="text-2xl">💬</span>
        </div>
        <h1 className="text-4xl font-light text-white/90 mb-2">GeekChat</h1>
        <p className="text-white/40 text-sm mb-8">Better conversations. Deeper insights.</p>
        <div className="space-y-3">
          <Button 
            onClick={onCreateMeeting} 
            className="w-full bg-[#2A4A7A] hover:bg-[#3A5A8A] text-white rounded-2xl h-12"
            data-testid="create-meeting-btn"
          >
            <Video className="w-4 h-4 mr-2" /> Создать встречу
          </Button>
          <Button 
            onClick={onLogin} 
            variant="outline" 
            className="w-full border-[#2A4A7A] text-white/70 hover:bg-[#2A4A7A]/20 rounded-2xl h-12"
            data-testid="login-btn"
          >
            <LogIn className="w-4 h-4 mr-2" /> Войти
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
