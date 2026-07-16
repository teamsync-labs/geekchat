import React, { useRef, useEffect } from 'react';
import { usePeer } from '../hooks/usePeer';

export const VideoChat = () => {
  const { myId, remoteStream, callPeer } = usePeer();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleCall = () => {
    const remoteId = prompt('Введите ID собеседника:');
    if (remoteId) {
      callPeer(remoteId);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
      <div className="bg-[#162035] rounded-3xl border border-[#2A4A7A]/20 p-8 max-w-4xl w-full shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-light text-[#E8EDF5]">
            Мой ID: <span className="font-mono text-[#8AB4F8]">{myId || 'Загрузка...'}</span>
          </h3>
          <button
            onClick={handleCall}
            className="bg-gradient-to-r from-[#2A4A7A] to-[#3A5A8A] hover:from-[#3A5A8A] hover:to-[#4A6A9A] text-white rounded-2xl px-6 py-3 text-sm font-light shadow-xl shadow-[#2A4A7A]/20 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            📞 Позвонить
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#0A1628] rounded-2xl overflow-hidden border border-[#2A4A7A]/20">
            <div className="p-2 bg-[#1A2D4A]/50">
              <h4 className="text-xs text-[#8A9BB5] font-light">📹 Вы</h4>
            </div>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full aspect-video object-cover"
            />
          </div>
          <div className="bg-[#0A1628] rounded-2xl overflow-hidden border border-[#2A4A7A]/20">
            <div className="p-2 bg-[#1A2D4A]/50">
              <h4 className="text-xs text-[#8A9BB5] font-light">👤 Собеседник</h4>
            </div>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full aspect-video object-cover bg-[#0A1628]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
