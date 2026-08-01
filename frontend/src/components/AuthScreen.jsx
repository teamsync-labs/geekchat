import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn, Mail, Lock } from 'lucide-react';

function AuthScreen({ onLogin, onGoHome }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4" data-testid="auth-screen">
      <div className="w-full max-w-sm">
        <button 
          onClick={onGoHome} 
          className="text-white/30 hover:text-white/60 flex items-center gap-2 mb-4"
          data-testid="auth-back-btn"
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>
        <div className="bg-[#162035] rounded-3xl p-8 border border-[#2A4A7A]/20">
          <div className="text-center mb-6">
            <h1 className="text-xl font-light text-white/90">Вход в GeekChat</h1>
            <p className="text-sm text-white/25">Войдите с аккаунтом</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/30 text-xs mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A1628] border border-[#2A4A7A]/20 rounded-xl pl-10 pr-4 py-3 text-white/80 placeholder:text-white/10 focus:border-[#2A4A7A]/50 outline-none"
                  placeholder="eve.holt@reqres.in"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-white/30 text-xs mb-1.5">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A1628] border border-[#2A4A7A]/20 rounded-xl pl-10 pr-4 py-3 text-white/80 placeholder:text-white/10 focus:border-[#2A4A7A]/50 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#2A4A7A] hover:bg-[#3A5A8A] text-white rounded-xl h-12"
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
          <p className="mt-4 text-center text-[10px] text-white/15">Демо: eve.holt@reqres.in / любой пароль</p>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
