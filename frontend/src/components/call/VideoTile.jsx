import React, { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const VideoTile = ({ 
  stream, 
  name, 
  isLocal = false, 
  isMuted = false, 
  isVideoOff = false,
  className = '',
  avatarFallback,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (isVideoOff || !stream) {
    return (
      <div className={`flex items-center justify-center bg-[#1A2D4A] rounded-2xl ${className}`}>
        <div className="text-center">
          <Avatar className="w-20 h-20 mx-auto mb-2 border-2 border-[#2A4A7A]/50">
            <AvatarImage src={`https://ui-avatars.com/api/?name=${name}&background=2A4A7A&color=fff&bold=true&size=200`} />
            <AvatarFallback className="bg-[#2A4A7A] text-[#E8EDF5] text-2xl">
              {avatarFallback || name?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-[#8A9BB5]">{name}</p>
          {isMuted && (
            <span className="text-xs text-red-400">🔇 Без звука</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#0A1628] rounded-2xl ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg">
        <span className="text-xs text-white/80">{name}</span>
        {isMuted && (
          <span className="ml-2 text-xs text-red-400">🔇</span>
        )}
      </div>
      {isLocal && (
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white/60">
          Вы
        </div>
      )}
    </div>
  );
};
