import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Mic, MicOff, Video, VideoOff, Phone, PhoneOff, 
  Volume2, VolumeX, Maximize2, Minimize2, 
  X, Check, AlertCircle, Clock
} from 'lucide-react';

function CallScreen() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCallActive, setIsCallActive] = useState(true);
  const [isConnecting, setIsConnecting] = useState(true);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState('excellent');
  
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isCallActive || isConnecting) return;
    timerRef.current = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isCallActive, isConnecting]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isCallActive) return;
    const qualities = ['excellent', 'good', 'fair'];
    const timer = setInterval(() => {
      setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
    }, 5000);
    return () => clearInterval(timer);
  }, [isCallActive]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    console.log('🔊 Микрофон:', !isMuted ? 'ВЫКЛЮЧЕН' : 'ВКЛЮЧЕН');
  };

  const toggleVideo = () => {
    setIsVideoOff(prev => !prev);
    console.log('📷 Камера:', !isVideoOff ? 'ВЫКЛЮЧЕНА' : 'ВКЛЮЧЕНА');
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(prev => !prev);
    console.log('🔊 Динамик:', !isSpeakerOn ? 'ГРОМКАЯ СВЯЗЬ' : 'ОБЫЧНЫЙ РЕЖИМ');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (!isCallActive) return;
    setShowEndConfirm(true);
  };

  const confirmEndCall = () => {
    setIsEnding(true);
    setTimeout(() => {
      setIsCallActive(false);
      setIsEnding(false);
      setShowEndConfirm(false);
      clearInterval(timerRef.current);
      setCallTime(0);
    }, 500);
  };

  const cancelEndCall = () => {
    setShowEndConfirm(false);
  };

  const ControlButton = ({ icon: Icon, label, onClick, isActive, color = 'blue' }) => {
    const [isPressed, setIsPressed] = useState(false);

    const colors = {
      blue: 'from-[#2A4A7A] to-[#3A5A8A] shadow-[#2A4A7A]/40',
      red: 'from-red-500 to-red-600 shadow-red-500/40',
      green: 'from-green-500 to-green-600 shadow-green-500/40',
    };

    const handleClick = (e) => {
      e.preventDefault();
      setIsPressed(true);
      onClick();
      setTimeout(() => setIsPressed(false), 200);
    };

    return (
      <button
        onClick={handleClick}
        className={`
          group relative flex flex-col items-center justify-center gap-1.5
          w-20 h-20 rounded-2xl transition-all duration-200
          ${isActive 
            ? `bg-gradient-to-br ${colors[color]} shadow-xl border border-white/10` 
            : 'bg-[#1A2D4A]/80 backdrop-blur-sm border border-[#2A4A7A]/30 hover:border-[#3A5A8A]/50'
          }
          ${isPressed ? 'scale-95' : 'hover:scale-105'}
          cursor-pointer select-none
        `}
      >
        <Icon className={`
          w-5 h-5 transition-all duration-200
          ${isActive ? 'text-white' : 'text-[#E8EDF5]'}
          ${isPressed ? 'scale-75' : ''}
        `} />
        <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-[#8A9BB5]'}`}>
          {label}
        </span>
        {isActive && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
        )}
      </button>
    );
  };

  if (!isCallActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#162035] to-[#1A2D4A] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-[#162035]/95 to-[#1A2D4A]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#2A4A7A]/30 p-8 text-center">
            <div className="text-6xl mb-4 animate-bounce">📞</div>
            <h2 className="text-2xl font-bold text-[#E8EDF5] mb-2">Звонок завершён</h2>
            <p className="text-[#8A9BB5] mb-2">Длительность: {formatTime(callTime)}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#2A4A7A] to-[#3A5A8A] hover:from-[#3A5A8A] hover:to-[#4A6A9A] text-white px-8 py-3 rounded-xl transition-all hover:scale-105"
            >
              Начать новый звонок
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#162035] to-[#1A2D4A] flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#2A4A7A]/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#3A5A8A]/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4A6A9A]/5 rounded-full blur-3xl animate-spin-slow" />
      </div>

      <div className={`relative w-full max-w-lg ${isEnding ? 'animate-call-end' : 'animate-call-start'}`}>
        <div className={`
          bg-gradient-to-br from-[#162035]/95 to-[#1A2D4A]/95 backdrop-blur-xl 
          rounded-3xl shadow-2xl border border-[#2A4A7A]/30 p-8 
          transform transition-all duration-500
          ${isEnding ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
          relative overflow-hidden
        `}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-full animate-shimmer" />

          <div className="relative z-10 text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-[#0A1628]/50 px-4 py-2 rounded-full border border-[#2A4A7A]/30 mb-3">
              <div className={`
                w-2.5 h-2.5 rounded-full transition-all duration-500
                ${isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 animate-pulse-slow'}
              `} />
              <span className="text-xs text-[#8A9BB5]">
                {isConnecting ? 'Устанавливается соединение...' : 'В сети'}
              </span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#E8EDF5] to-[#8AB4F8] bg-clip-text text-transparent">
              Анна
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Clock className="w-4 h-4 text-[#8A9BB5]" />
              <p className="text-2xl font-mono text-[#8AB4F8]">{formatTime(callTime)}</p>
            </div>
            {!isConnecting && (
              <div className="mt-1 flex items-center justify-center gap-1">
                <div className={`
                  w-1.5 h-1.5 rounded-full transition-all duration-300
                  ${connectionQuality === 'excellent' ? 'bg-green-500' : connectionQuality === 'good' ? 'bg-yellow-500' : 'bg-orange-500'}
                `} />
                <span className="text-xs text-[#6A7A95] capitalize">
                  {connectionQuality === 'excellent' ? 'Отличное качество' : connectionQuality === 'good' ? 'Хорошее качество' : 'Среднее качество'}
                </span>
              </div>
            )}
          </div>

          <div className="relative z-10 flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2A4A7A] to-[#8AB4F8] rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2A4A7A] to-[#8AB4F8] rounded-full blur-xl opacity-20 animate-pulse-slow" />
              <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-[#1A2D4A] to-[#2A4A7A] border-4 border-[#2A4A7A]/50 flex items-center justify-center overflow-hidden">
                <Avatar className="w-44 h-44 transform transition-transform duration-500 group-hover:scale-105">
                  <AvatarImage src="https://ui-avatars.com/api/?name=Анна&background=2A4A7A&color=fff&bold=true&size=200" />
                  <AvatarFallback className="bg-[#2A4A7A] text-[#E8EDF5] text-7xl font-light">
                    А
                  </AvatarFallback>
                </Avatar>
                {!isConnecting && (
                  <div className="absolute bottom-3 right-3">
                    <span className="flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-[#162035]"></span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-4 gap-3">
            <ControlButton
              icon={isMuted ? MicOff : Mic}
              label={isMuted ? 'Без звука' : 'Микрофон'}
              onClick={toggleMute}
              isActive={!isMuted}
              color="blue"
            />

            <ControlButton
              icon={isVideoOff ? VideoOff : Video}
              label={isVideoOff ? 'Камера выкл' : 'Камера'}
              onClick={toggleVideo}
              isActive={!isVideoOff}
              color="blue"
            />

            <ControlButton
              icon={isSpeakerOn ? Volume2 : VolumeX}
              label={isSpeakerOn ? 'Громкая' : 'Динамик'}
              onClick={toggleSpeaker}
              isActive={isSpeakerOn}
              color="blue"
            />

            <ControlButton
              icon={isFullscreen ? Minimize2 : Maximize2}
              label={isFullscreen ? 'Свернуть' : 'На весь'}
              onClick={toggleFullscreen}
              isActive={isFullscreen}
              color="blue"
            />
          </div>

          <div className="relative z-10 mt-8 flex justify-center">
            <Button
              onClick={handleEndCall}
              className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-12 py-6 rounded-2xl shadow-2xl shadow-red-500/40 hover:shadow-red-500/60 transition-all duration-300 flex items-center gap-3 transform hover:scale-105 active:scale-95"
            >
              <PhoneOff className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-semibold">Завершить звонок</span>
            </Button>
          </div>

          <div className="relative z-10 mt-6 flex justify-center gap-6 text-xs text-[#6A7A95]">
            <span>🔒 Безопасное соединение</span>
            <span>•</span>
            <span>📶 HD качество</span>
            <span>•</span>
            <span>⏱️ {formatTime(callTime)}</span>
          </div>
        </div>
      </div>

      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-br from-[#162035] to-[#1A2D4A] rounded-3xl shadow-2xl border border-[#2A4A7A]/30 p-8 max-w-sm w-full animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-[#E8EDF5] mb-2">Завершить звонок?</h3>
              <p className="text-[#8A9BB5] mb-6">
                Вы уверены, что хотите завершить звонок с Анной?
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={cancelEndCall}
                  className="flex-1 bg-[#1A2D4A] hover:bg-[#2A4A7A] text-[#E8EDF5] py-3 rounded-xl"
                >
                  <X className="w-4 h-4 mr-2" />
                  Отмена
                </Button>
                <Button
                  onClick={confirmEndCall}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl shadow-lg shadow-red-500/30"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Завершить
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CallScreen;
