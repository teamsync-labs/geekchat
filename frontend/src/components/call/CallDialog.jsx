import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';

export const CallDialog = ({ isOpen, onClose, onCall, isConnecting }) => {
  const [remoteId, setRemoteId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (remoteId.trim()) {
      onCall(remoteId.trim());
      setRemoteId('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#162035] rounded-3xl border border-[#2A4A7A]/20 p-8 max-w-md w-full shadow-2xl shadow-black/50 animate-scale-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-light text-[#E8EDF5]">📞 Новый звонок</h3>
          <button
            onClick={onClose}
            className="text-[#8A9BB5] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <p className="text-sm text-[#8A9BB5] mb-4">
            Введите ID собеседника, чтобы начать звонок.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#6A7A95] block mb-1.5">ID собеседника</label>
              <Input
                type="text"
                value={remoteId}
                onChange={(e) => setRemoteId(e.target.value)}
                placeholder="Введите Peer ID..."
                className="bg-[#0A1628] border-[#2A4A7A] text-[#E8EDF5] placeholder:text-[#6A7A95] focus:border-[#3A5A8A]"
                autoFocus
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={onClose}
                variant="ghost"
                className="flex-1 bg-[#1A2D4A] hover:bg-[#2A4A7A] text-[#8A9BB5] hover:text-[#E8EDF5] rounded-xl py-3"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={!remoteId.trim() || isConnecting}
                className="flex-1 bg-gradient-to-r from-[#2A4A7A] to-[#3A5A8A] hover:from-[#3A5A8A] hover:to-[#4A6A9A] text-white rounded-xl py-3 shadow-lg shadow-[#2A4A7A]/20 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? '⏳ Соединение...' : '📞 Позвонить'}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-[#2A4A7A]/10">
          <p className="text-xs text-[#6A7A95]">
            Ваш ID: <span className="font-mono text-[#8AB4F8]">{myId || 'Загрузка...'}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
