import React from 'react';
import { Button } from "@/components/ui/button";
import { Video, LogIn, Sparkles } from 'lucide-react';

function HomeScreen({ onCreateMeeting, onLogin }) {
  return (
    <div className="min-h-screen bg-premium flex items-center justify-center p-4">
      <div className="text-center max-w-sm w-full mx-auto">
        <div className="relative w-20 h-20 mx-auto mb-5">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A4A7A] to-[#8AB4F8] rounded-full blur-2xl opacity-30 animate-pulse-ring"></div>
          <div className="relative w-full h-full bg-[#162035] rounded-full border border-[#2A4A7A]/30 flex items-center justify-center shadow-2xl shadow-[#2A4A7A]/20 animate-breathe">
            <span className="text-3xl animate-float">💬</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-light bg-gradient-to-r from-[#E8EDF5] via-[#8AB4F8] to-[#E8EDF5] bg-[length:200%_auto] text-transparent bg-clip-text mb-2 animate-shimmer">
          GeekChat
        </h1>
        
        <p className="text-white/30 text-sm mb-8">Better conversations. Deeper insights.</p>
        
        <div className="space-y-3">
          <Button 
            onClick={onCreateMeeting} 
            className="btn-premium w-full bg-gradient-to-r from-[#2A4A7A] to-[#3A5A8A] hover:from-[#3A5A8A] hover:to-[#4A6A9A] text-white rounded-2xl h-12 shadow-xl shadow-[#2A4A7A]/20 hover:shadow-[#2A4A7A]/40"
          >
            <span className="shine"></span>
            <Video className="w-4 h-4 mr-2" /> 
            Создать встречу
            <Sparkles className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
          </Button>
          
          <Button 
            onClick={onLogin} 
            variant="outline" 
            className="btn-premium w-full border-[#2A4A7A] text-white/70 hover:text-white hover:bg-[#2A4A7A]/20 rounded-2xl h-12"
          >
            <span className="shine"></span>
            <LogIn className="w-4 h-4 mr-2" /> 
            Войти
          </Button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-3 text-xs text-white/10">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500/50 rounded-full animate-pulse-ring"></span>
            Онлайн
          </span>
          <span className="w-px h-3 bg-[#2A4A7A]/30"></span>
          <span>v3.0.0</span>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
