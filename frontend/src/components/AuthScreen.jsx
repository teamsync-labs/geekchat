import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn, Mail, Lock, Sparkles, Eye, EyeOff } from 'lucide-react';

function AuthScreen({ onLogin, onGoHome }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-premium flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        <button 
          onClick={onGoHome} 
          className="group text-white/30 hover:text-white/60 flex items-center gap-2 mb-4 transition-all duration-300 hover:gap-3"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm">Назад</span>
        </button>
        
        <div className="glass-premium rounded-3xl p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 bg-[#2A4A7A]/20 rounded-full flex items-center justify-center border border-[#2A4A7A]/30">
              <LogIn className="w-6 h-6 text-[#8AB4F8]" />
            </div>
            <h1 className="text-2xl font-light text-white/90">Добро пожаловать</h1>
            <p className="text-sm text-white/25 mt-1">Войдите в аккаунт</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/30 text-xs mb-1.5">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 transition-colors group-focus-within:text-[#8AB4F8]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A1628] border border-[#2A4A7A]/20 rounded-xl pl-10 pr-4 py-3 text-white/80 placeholder:text-white/10 focus:border-[#2A4A7A]/50 focus:ring-2 focus:ring-[#2A4A7A]/10 outline-none transition-all duration-300"
                  placeholder="eve.holt@reqres.in"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white/30 text-xs mb-1.5">Пароль</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 transition-colors group-focus-within:text-[#8AB4F8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A1628] border border-[#2A4A7A]/20 rounded-xl pl-10 pr-12 py-3 text-white/80 placeholder:text-white/10 focus:border-[#2A4A7A]/50 focus:ring-2 focus:ring-[#2A4A7A]/10 outline-none transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="btn-premium w-full bg-gradient-to-r from-[#2A4A7A] to-[#3A5A8A] hover:from-[#3A5A8A] hover:to-[#4A6A9A] text-white rounded-xl h-12 shadow-xl shadow-[#2A4A7A]/20 hover:shadow-[#2A4A7A]/40"
            >
              <span className="shine"></span>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Вход...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4 transition-transform group-hover:scale-110" />
                  Войти
                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
                </span>
              )}
            </Button>
          </form>
          
          <p className="mt-4 text-center text-[10px] text-white/15">
            🔒 Демо: eve.holt@reqres.in / любой пароль
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
