import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Clock, Users, CheckCircle, Circle,
  Play, Pause, SkipForward, SkipBack,
  ArrowLeft, Share2, Settings, Plus,
} from 'lucide-react';
import { usePeer } from '../hooks/usePeer';
import { VideoTile } from './call/VideoTile';
import { CallControls } from './call/CallControls';
import { CallDialog } from './call/CallDialog';

function ResearchCall() {
  // ===== СОСТОЯНИЯ =====
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isRecording] = useState(true);
  const [activeTab, setActiveTab] = useState('guide');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [callTime, setCallTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  
  // ===== PEERJS ХУК =====
  const { 
    myId, 
    remoteStream, 
    localStream, 
    isCallActive, 
    isConnecting,
    callPeer,
    endCall 
  } = usePeer();

  // ===== ТАЙМЕР =====
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // ===== ФОРМАТ ТАЙМЕРА =====
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ===== ОБРАБОТЧИКИ =====
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleSpeaker = () => setIsSpeakerOn(!isSpeakerOn);
  const togglePause = () => setIsPaused(!isPaused);
  
  const handleEndCall = () => {
    setShowEndConfirm(true);
  };

  const confirmEndCall = () => {
    setShowEndConfirm(false);
    endCall();
    setCallTime(0);
  };

  const cancelEndCall = () => {
    setShowEndConfirm(false);
  };

  const handleCall = (remoteId) => {
    callPeer(remoteId);
    setShowCallDialog(false);
  };

  // ===== ДАННЫЕ =====
  const questions = [
    "1. Tell me about a time you used our product.",
    "2. What were you trying to achieve?",
    "3. What worked well?",
    "4. What didn't work so well?",
    "5. How does this compare to other solutions?",
  ];

  return (
    <div className="min-h-screen bg-[#0A1628] flex overflow-hidden relative">
      
      {/* ===== ФОН ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#2A4A7A]/5 via-[#8AB4F8]/5 to-[#2A4A7A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#3A5A8A]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-[#4A6A9A]/5 rounded-full blur-3xl" />
      </div>

      {/* ===== ОСНОВНАЯ ОБЛАСТЬ ===== */}
      <div className="flex-1 flex flex-col p-8 relative z-10">
        
        {/* ===== ХЕДЕР ===== */}
        <div className="flex items-center justify-between mb-8 animate-slide-down">
          <div className="flex items-center gap-6">
            <Button variant="ghost" className="text-[#6A7A95] hover:text-white hover:bg-[#2A4A7A]/20 rounded-2xl w-12 h-12 p-0 transition-all duration-300 hover:scale-105 active:scale-95">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-light tracking-wide text-white/90">
                  02 ACTIVE CALL + RESEARCH WORKSPACE
                </h1>
                <Badge className="bg-[#2A4A7A]/20 text-[#8AB4F8] border border-[#2A4A7A]/30 rounded-xl px-3 py-1 text-[10px] font-light">
                  🔒 Encrypted
                </Badge>
                {isCallActive && (
                  <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
                    ● Live
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm mt-1">
                <span className="text-white/70 font-light">Interview – Alex Kim</span>
                <span className="w-px h-4 bg-[#2A4A7A]/30"></span>
                <span className="font-mono text-[#8AB4F8] font-light tracking-wider">{formatTime(callTime)}</span>
                {isRecording && (
                  <span className="flex items-center gap-2 text-red-400 text-xs font-light">
                    <span className="w-2 h-2 bg-red-500 rounded-full shadow-lg shadow-red-500/30 animate-pulse"></span>
                    Recording
                  </span>
                )}
                <span className="text-white/30 text-xs font-mono">ID: {myId || '...'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-[#6A7A95] hover:text-white hover:bg-[#2A4A7A]/20 rounded-2xl w-12 h-12 p-0 transition-all duration-300 hover:scale-105 active:scale-95">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className="text-[#6A7A95] hover:text-white hover:bg-[#2A4A7A]/20 rounded-2xl w-12 h-12 p-0 transition-all duration-300 hover:scale-105 active:scale-95">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* ===== ВИДЕО-ОБЛАСТЬ ===== */}
        <div className="flex-1 bg-gradient-to-br from-[#162035] to-[#1A2D4A] rounded-3xl relative overflow-hidden shadow-2xl shadow-black/50 border border-[#2A4A7A]/10">
          
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxwYXRoIGQ9Ik0gMCAwIEwgMCA2MCBMIDYwIDYwIEwgNjAgMCBaIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoNDIsNzQsMTIyLDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-30"></div>

          {/* ===== ВИДЕО СОБЕСЕДНИКА ===== */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <VideoTile
              stream={remoteStream}
              name="Alex Kim"
              isVideoOff={isVideoOff}
              isMuted={isMuted}
              className="w-full h-full"
              avatarFallback="AK"
            />
          </div>

          {/* ===== МИНИ-ОКНО СВОЕГО ВИДЕО ===== */}
          <div className="absolute bottom-6 right-6 w-52 h-36 bg-[#1A2D4A] rounded-2xl border border-[#2A4A7A]/20 overflow-hidden shadow-2xl shadow-black/50 backdrop-blur-sm transition-all duration-300 hover:scale-105">
            <VideoTile
              stream={localStream}
              name="You"
              isLocal={true}
              isVideoOff={isVideoOff}
              isMuted={isMuted}
              className="w-full h-full"
              avatarFallback="YO"
            />
          </div>

          {/* ===== КНОПКИ УПРАВЛЕНИЯ ===== */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700">
            <CallControls
              isMuted={isMuted}
              onToggleMute={toggleMute}
              isVideoOff={isVideoOff}
              onToggleVideo={toggleVideo}
              isSpeakerOn={isSpeakerOn}
              onToggleSpeaker={toggleSpeaker}
              onEndCall={handleEndCall}
              isConnecting={isConnecting}
              isCallActive={isCallActive}
            />
          </div>

          {/* ===== КНОПКА ВЫЗОВА ===== */}
          {!isCallActive && !isConnecting && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <Button
                onClick={() => setShowCallDialog(true)}
                className="bg-gradient-to-r from-[#2A4A7A] to-[#3A5A8A] hover:from-[#3A5A8A] hover:to-[#4A6A9A] text-white rounded-2xl px-8 py-4 text-lg font-light shadow-2xl shadow-[#2A4A7A]/30 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                📞 Позвонить собеседнику
              </Button>
            </div>
          )}

          {isConnecting && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#2A4A7A] border-t-[#8AB4F8] rounded-full animate-spin-slow mx-auto mb-3" />
                <p className="text-white/60 font-light">Соединение...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== ПРАВАЯ ПАНЕЛЬ ===== */}
      <div className="w-[400px] bg-[#162035] border-l border-[#2A4A7A]/10 flex flex-col backdrop-blur-sm relative z-10">
        
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
                    ? 'bg-gradient-to-r from-[#2A4A7A] to-[#3A5A8A] text-white/90 shadow-lg shadow-[#2A4A7A]/20 scale-105' 
                    : 'text-white/30 hover:text-white/70 hover:bg-white/5 hover:scale-105'
                  }
                `}
              >
                <tab.icon className={`w-4 h-4 mx-auto mb-1 transition-all duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`} />
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
                        ? 'bg-gradient-to-r from-[#2A4A7A]/20 to-[#8AB4F8]/5 border border-[#2A4A7A]/30 shadow-lg shadow-[#2A4A7A]/5 scale-105'
                        : 'hover:bg-white/5 border border-transparent hover:scale-102'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {index === currentQuestion ? (
                        <CheckCircle className="w-4 h-4 text-[#8AB4F8] flex-shrink-0 mt-0.5 animate-pulse" />
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

              <Button className="w-full mt-5 bg-white/5 hover:bg-white/10 text-white/60 rounded-2xl py-3 text-sm font-light border border-white/5 transition-all duration-300 hover:scale-105 active:scale-95">
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
                <span className="w-2 h-2 bg-red-500 rounded-full shadow-lg shadow-red-500/20 animate-pulse"></span>
                Recording
              </span>
              <span className="text-xs text-white/15 font-mono">{formatTime(callTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" className="w-9 h-9 p-0 text-white/20 hover:text-white/50 hover:bg-white/5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-90">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={togglePause}
                className="w-9 h-9 p-0 text-white/20 hover:text-white/50 hover:bg-white/5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-90"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" className="w-9 h-9 p-0 text-white/20 hover:text-white/50 hover:bg-white/5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-90">
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== МОДАЛКА ПОДТВЕРЖДЕНИЯ ===== */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#162035] rounded-3xl border border-[#2A4A7A]/20 p-8 max-w-sm w-full shadow-2xl shadow-black/50 animate-scale-up">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 animate-pulse">
                <PhoneOff className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-light text-white/90 mb-1">Завершить звонок?</h3>
              <p className="text-sm font-light text-white/20 mb-6">
                Вы уверены, что хотите завершить звонок?
              </p>
              <div className="flex gap-3">
                <Button onClick={cancelEndCall} className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 rounded-2xl py-3 text-sm font-light border border-white/5 transition-all duration-300 hover:scale-105 active:scale-95">
                  Отмена
                </Button>
                <Button onClick={confirmEndCall} className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl py-3 text-sm font-light shadow-xl shadow-red-500/20 transition-all duration-300 hover:scale-105 active:scale-95">
                  Завершить
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== ДИАЛОГ ВЫЗОВА ===== */}
      <CallDialog
        isOpen={showCallDialog}
        onClose={() => setShowCallDialog(false)}
        onCall={handleCall}
        isConnecting={isConnecting}
        myId={myId}
      />
    </div>
  );
}

export default ResearchCall;
