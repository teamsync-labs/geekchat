import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  Volume2, VolumeX, 
  FileText, Clock, Users, CheckCircle, Circle,
  Play, Pause, SkipForward, SkipBack,
  ArrowLeft, Share2, Settings, Plus,
  Home
} from 'lucide-react';

function ResearchCall({ onGoHome }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [activeTab, setActiveTab] = useState('guide');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [callTime, setCallTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn('⚠️ Нет доступа к камере/микрофону');
      }
    };
    getMedia();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOff;
      }
    }
  }, [isVideoOff, stream]);

  useEffect(() => {
    if (isPaused || isEnding || isCallEnded) return;
    const timer = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, isEnding, isCallEnded]);

  useEffect(() => {
    if (!isCallEnded) return;
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3 + 0.1,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setParticles(newParticles);

    const animateParticles = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speedX + 100) % 100,
        y: (p.y + p.speedY + 100) % 100,
      })));
      requestAnimationFrame(animateParticles);
    };
    const animationId = requestAnimationFrame(animateParticles);
    return () => cancelAnimationFrame(animationId);
  }, [isCallEnded]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleSpeaker = () => setIsSpeakerOn(!isSpeakerOn);
  const togglePause = () => setIsPaused(!isPaused);
  const handleEndCall = () => setShowEndConfirm(true);
  
  const confirmEndCall = () => {
    setIsEnding(true);
    setShowEndConfirm(false);
    setTimeout(() => {
      setIsCallEnded(true);
      setIsEnding(false);
      setIsRecording(false);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }, 800);
  };
  
  const cancelEndCall = () => setShowEndConfirm(false);

  const questions = [
    "1. Tell me about a time you used our product.",
    "2. What were you trying to achieve?",
    "3. What worked well?",
    "4. What didn't work so well?",
    "5. How does this compare to other solutions?",
  ];

  if (isCallEnded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A1628] relative overflow-hidden">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#8AB4F8]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              transition: 'all 0.1s linear',
            }}
          />
        ))}
        <div className="flex flex-col items-center max-w-sm w-full relative z-10">
          <div className="relative w-32 h-32 mb-5">
            <div className="absolute inset-[-12px] rounded-full border-2 border-[#2A4A7A]/20 animate-spin-slow"></div>
            <div className="absolute inset-[-20px] rounded-full border-2 border-[#8AB4F8]/10 animate-spin-slow delay-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#2A4A7A] to-[#8AB4F8] rounded-full blur-2xl opacity-25 animate-pulse-ring"></div>
            <div className="absolute inset-0 bg-[#1A2D4A] rounded-full border border-[#2A4A7A]/30 flex items-center justify-center shadow-2xl shadow-[#2A4A7A]/20">
              <span className="text-5xl">📞</span>
            </div>
          </div>
          <h2 className="text-2xl font-light text-white/90 mb-1">Звонок завершён</h2>
          <p className="text-[#8A9BB5] font-mono text-lg mb-1">{formatTime(callTime)}</p>
          <p className="text-[#6A7A95] text-sm font-light mb-6">Спасибо за отличный разговор!</p>
          <Button 
            onClick={onGoHome}
            className="bg-gradient-to-r from-[#2A4A7A] to-[#3A5A8A] hover:from-[#3A5A8A] hover:to-[#4A6A9A] text-white rounded-2xl px-8 py-3 text-sm font-light shadow-xl shadow-[#2A4A7A]/20 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4 mr-2" />
            На главную
          </Button>
        </div>
      </div>
    );
  }

  if (isEnding) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">📞</div>
          <p className="text-white/40 font-light">Завершение звонка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex overflow-hidden">
      
      <div className="flex-1 flex flex-col p-8">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <Button variant="ghost" className="text-[#6A7A95] hover:text-white hover:bg-[#2A4A7A]/20 rounded-2xl w-12 h-12 p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-light text-white/90">
                  02 ACTIVE CALL + RESEARCH WORKSPACE
                </h1>
                <Badge className="bg-[#2A4A7A]/20 text-[#8AB4F8] border border-[#2A4A7A]/30 rounded-xl px-3 py-1 text-[10px] font-light">
                  🔒 Encrypted
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-white/70 font-light">Interview – Alex Kim</span>
                <span className="w-px h-4 bg-[#2A4A7A]/30"></span>
                <span className="font-mono text-[#8AB4F8]">{formatTime(callTime)}</span>
                {isRecording && (
                  <span className="flex items-center gap-2 text-red-400 text-xs">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Recording
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={onGoHome}
              variant="ghost"
              className="text-[#6A7A95] hover:text-white hover:bg-[#2A4A7A]/20 rounded-2xl w-12 h-12 p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className="text-[#6A7A95] hover:text-white hover:bg-[#2A4A7A]/20 rounded-2xl w-12 h-12 p-0">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className="text-[#6A7A95] hover:text-white hover:bg-[#2A4A7A]/20 rounded-2xl w-12 h-12 p-0">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 bg-[#162035] rounded-3xl relative overflow-hidden shadow-2xl shadow-black/50 border border-[#2A4A7A]/10">
          
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
          />
          
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1A2D4A]">
              <div className="text-center">
                <VideoOff className="w-16 h-16 text-white/20 mx-auto mb-3" />
                <p className="text-white/30 font-light">Камера выключена</p>
              </div>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2A4A7A] to-[#8AB4F8] rounded-full blur-2xl opacity-20" />
                <Avatar className="w-32 h-32 mx-auto mb-3 border-2 border-[#2A4A7A]/30">
                  <AvatarFallback className="bg-[#2A4A7A] text-white/90 text-4xl font-light">
                    AK
                  </AvatarFallback>
                </Avatar>
              </div>
              <p className="text-white/90 font-light text-lg">Alex Kim</p>
              <p className="text-sm text-white/30 font-light">Participant</p>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 w-48 h-36 bg-[#1A2D4A] rounded-2xl border border-[#2A4A7A]/20 overflow-hidden shadow-2xl shadow-black/50">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Avatar className="w-14 h-14 mx-auto mb-1 border border-[#2A4A7A]/30">
                  <AvatarFallback className="bg-[#0A1628] text-white/60 text-xl font-light">
                    You
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs text-white/20 font-light">You</p>
              </div>
            </div>
            {isMuted && (
              <div className="absolute top-3 left-3">
                <MicOff className="w-3 h-3 text-red-400" />
              </div>
            )}
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-3 p-2 bg-[#0A1628]/60 backdrop-blur-2xl rounded-2xl border border-[#2A4A7A]/20 shadow-2xl shadow-black/50">
              <Button
                onClick={toggleMute}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${
                  isMuted 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-[#2A4A7A] text-white'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {!isMuted && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full shadow-lg shadow-green-500/30 animate-pulse" />
                )}
              </Button>

              <Button
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${
                  isVideoOff 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-[#2A4A7A] text-white'
                }`}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                {!isVideoOff && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full shadow-lg shadow-green-500/30 animate-pulse" />
                )}
              </Button>

              <Button
                onClick={toggleSpeaker}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${
                  isSpeakerOn 
                    ? 'bg-[#3A5A8A] text-white' 
                    : 'bg-[#1A2D4A]/40 text-[#8A9BB5] hover:text-white border border-[#2A4A7A]/20'
                }`}
              >
                {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>

              <div className="w-px h-10 bg-[#2A4A7A]/20"></div>

              <Button
                onClick={handleEndCall}
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/30"
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[400px] bg-[#162035] border-l border-[#2A4A7A]/10 flex flex-col">
        
        <div className="px-6 pt-6 pb-4 border-b border-[#2A4A7A]/10">
          <div className="flex gap-1 bg-[#0A1628]/40 p-1 rounded-2xl border border-[#2A4A7A]/10">
            {[
              { id: 'guide', icon: FileText, label: 'Guide' },
              { id: 'notes', icon: FileText, label: 'Notes' },
              { id: 'timeline', icon: Clock, label: 'Timeline' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 py-3 rounded-xl text-xs font-light transition-all duration-300
                  ${activeTab === tab.id 
                    ? 'bg-[#2A4A7A] text-white/90 shadow-lg shadow-[#2A4A7A]/20' 
                    : 'text-white/30 hover:text-white/70 hover:bg-white/5'
                  }
                `}
              >
                <tab.icon className="w-4 h-4 mx-auto mb-1" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          
          {activeTab === 'guide' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs font-light text-white/30 tracking-wider uppercase">Interview guide</h3>
                <span className="text-xs font-light text-white/15">4 / 10</span>
              </div>
              
              <div className="space-y-2">
                {questions.map((q, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`
                      p-4 rounded-2xl cursor-pointer transition-all duration-300
                      ${index === currentQuestion
                        ? 'bg-[#2A4A7A]/20 border border-[#2A4A7A]/30 shadow-lg shadow-[#2A4A7A]/5'
                        : 'hover:bg-white/5 border border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {index === currentQuestion ? (
                        <CheckCircle className="w-4 h-4 text-[#8AB4F8] flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-white/10 flex-shrink-0 mt-0.5" />
                      )}
                      <p className={`text-sm font-light ${index === currentQuestion ? 'text-white/90' : 'text-white/40'}`}>
                        {q}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-5 bg-white/5 hover:bg-white/10 text-white/60 rounded-2xl py-3 text-sm font-light border border-white/5">
                <Plus className="w-4 h-4 mr-2" />
                Add question
              </Button>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="text-center py-12">
              <FileText className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/20 font-light">Notes will appear here</p>
              <p className="text-sm text-white/5 font-light">Click to add a note</p>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="text-center py-12">
              <Clock className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/20 font-light">Timeline will appear here</p>
              <p className="text-sm text-white/5 font-light">Key moments from the interview</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#2A4A7A]/10 bg-[#0A1628]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-red-400 text-xs font-light">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Recording
              </span>
              <span className="text-xs text-white/15 font-mono">{formatTime(callTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" className="w-9 h-9 p-0 text-white/20 hover:text-white/50 hover:bg-white/5 rounded-xl">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={togglePause}
                className="w-9 h-9 p-0 text-white/20 hover:text-white/50 hover:bg-white/5 rounded-xl"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" className="w-9 h-9 p-0 text-white/20 hover:text-white/50 hover:bg-white/5 rounded-xl">
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#162035] rounded-3xl border border-[#2A4A7A]/20 p-8 max-w-sm w-full shadow-2xl shadow-black/50">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
                <PhoneOff className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-light text-white/90 mb-1">Завершить звонок?</h3>
              <p className="text-sm font-light text-white/20 mb-6">
                Вы уверены, что хотите завершить звонок?
              </p>
              <div className="flex gap-3">
                <Button onClick={cancelEndCall} className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 rounded-2xl py-3 text-sm font-light border border-white/5">
                  Отмена
                </Button>
                <Button onClick={confirmEndCall} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl py-3 text-sm font-light shadow-xl shadow-red-500/20">
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

export default ResearchCall;
