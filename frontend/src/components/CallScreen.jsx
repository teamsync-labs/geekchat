import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  Volume2, VolumeX, ArrowLeft 
} from 'lucide-react';

function CallScreen({ onGoHome }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.warn('Нет доступа к камере/микрофону'));
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#162035] rounded-3xl p-6 border border-[#2A4A7A]/30">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onGoHome} className="text-[#8A9BB5]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="text-[#E8EDF5] font-light">Звонок</span>
          <div className="w-10" />
        </div>

        <div className="bg-[#1A2D4A] rounded-2xl overflow-hidden aspect-video flex items-center justify-center mb-4">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1A2D4A]">
              <VideoOff className="w-16 h-16 text-white/20" />
            </div>
          )}
        </div>

        <div className="text-center mb-4">
          <p className="text-[#E8EDF5] font-light">Алексей</p>
          <p className="text-[#8A9BB5] text-sm font-mono">{formatTime(callTime)}</p>
        </div>

        <div className="flex justify-center gap-3">
          <Button onClick={() => setIsMuted(!isMuted)} className="w-14 h-14 rounded-2xl bg-[#1A2D4A]">
            {isMuted ? <MicOff className="w-5 h-5 text-red-400" /> : <Mic className="w-5 h-5 text-[#E8EDF5]" />}
          </Button>
          <Button onClick={() => setIsVideoOff(!isVideoOff)} className="w-14 h-14 rounded-2xl bg-[#1A2D4A]">
            {isVideoOff ? <VideoOff className="w-5 h-5 text-red-400" /> : <Video className="w-5 h-5 text-[#E8EDF5]" />}
          </Button>
          <Button onClick={() => setIsSpeakerOn(!isSpeakerOn)} className="w-14 h-14 rounded-2xl bg-[#1A2D4A]">
            {isSpeakerOn ? <Volume2 className="w-5 h-5 text-[#8AB4F8]" /> : <VolumeX className="w-5 h-5 text-[#E8EDF5]" />}
          </Button>
          <Button className="w-14 h-14 rounded-2xl bg-red-500 hover:bg-red-600">
            <PhoneOff className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CallScreen;
