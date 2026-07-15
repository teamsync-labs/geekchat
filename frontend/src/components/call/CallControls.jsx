import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  Volume2, VolumeX 
} from 'lucide-react';

export const CallControls = ({
  isMuted,
  onToggleMute,
  isVideoOff,
  onToggleVideo,
  isSpeakerOn,
  onToggleSpeaker,
  onEndCall,
  isConnecting = false,
  isCallActive = false,
}) => {
  return (
    <div className="flex items-center gap-3 p-2 bg-[#0A1628]/60 backdrop-blur-2xl rounded-2xl border border-[#2A4A7A]/20 shadow-2xl shadow-black/50">
      <Button
        onClick={onToggleMute}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${
          isMuted 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/30' 
            : 'bg-[#2A4A7A] text-white shadow-xl shadow-[#2A4A7A]/30'
        }`}
      >
        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        {!isMuted && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full shadow-lg shadow-green-500/30 animate-pulse" />
        )}
      </Button>

      <Button
        onClick={onToggleVideo}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${
          isVideoOff 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/30' 
            : 'bg-[#2A4A7A] text-white shadow-xl shadow-[#2A4A7A]/30'
        }`}
      >
        {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        {!isVideoOff && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full shadow-lg shadow-green-500/30 animate-pulse" />
        )}
      </Button>

      <Button
        onClick={onToggleSpeaker}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${
          isSpeakerOn 
            ? 'bg-[#3A5A8A] text-white shadow-xl shadow-[#3A5A8A]/30' 
            : 'bg-[#1A2D4A]/40 text-[#8A9BB5] hover:text-white border border-[#2A4A7A]/20'
        }`}
      >
        {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </Button>

      <div className="w-px h-10 bg-[#2A4A7A]/20" />

      <Button
        onClick={onEndCall}
        disabled={!isCallActive && !isConnecting}
        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/30 hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PhoneOff className="w-5 h-5" />
      </Button>
    </div>
  );
};
