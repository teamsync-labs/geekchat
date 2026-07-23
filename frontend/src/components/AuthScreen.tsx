import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn, Mail, Lock, Check, Eye, EyeOff } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (userData: { email: string; name: string }) => void;
  onGoHome: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onGoHome }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({ email, name: 'Илья' });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-[#0A1628] overflow-hidden">
      
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#2A4A7A]/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#3A5A8A]/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#4A6A9A]/5 rounded-full blur-3xl animate-spin-slow" />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col justify-center animate-fade-up">
        
        {/* Назад */}
        <button 
          onClick={onGoHome}
          className="group text-white/30 hover:text-white/60 flex items-center gap-2 mb-4 transition-all duration-300 flex-shrink-0 hover:gap-3"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="text-sm">Назад</span>
        </button>

        {/* Карточка */}
        <div className="bg-[#162035]/80 backdrop-blur-xl rounded-3xl p-8 border border-[#2A4A7A]/20 shadow-2xl shadow-[#0A1628]/50 transition-all duration-300 hover:shadow-[#2A4A7A]/10">
          
          <div className="text-center mb-6">
            <h1 className="text-xl font-light text-white/90 tracking-tight">Вход в GeekChat</h1>
            <p className="text-sm text-white/25 font-light mt-0.5">Войдите с аккаунтом</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/30 text-xs font-light mb-1.5">Почта или email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15 transition-all duration-300 group-hover:scale-110" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A1628] border border-[#2A4A7A]/20 rounded-xl pl-12 pr-4 py-3 text-white/85 placeholder:text-white/10 focus:outline-none focus:border-[#2A4A7A]/50 focus:ring-2 focus:ring-[#2A4A7A]/20 transition-all duration-300 text-sm hover:border-[#2A4A7A]/40"
                  placeholder="eve.holt@reqres.in"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/30 text-xs font-light mb-1.5">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15 transition-all duration-300 group-hover:scale-110" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A1628] border border-[#2A4A7A]/20 rounded-xl pl-12 pr-12 py-3 text-white/85 placeholder:text-white/10 focus:outline-none focus:border-[#2A4A7A]/50 focus:ring-2 focus:ring-[#2A4A7A]/20 transition-all duration-300 text-sm hover:border-[#2A4A7A]/40"
                  placeholder="пароль"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/30 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded-md border border-[#2A4A7A]/30 flex items-center justify-center transition-all duration-300 hover:border-[#2A4A7A]/50 flex-shrink-0 hover:scale-110"
                style={{
                  background: rememberMe ? '#2A4A7A' : 'transparent'
                }}
              >
                {rememberMe && <Check className="w-3 h-3 text-white transition-all duration-300 animate-check" />}
              </button>
              <span className="text-xs text-white/20 transition-all duration-300 hover:text-white/40">Запомнить меня</span>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="group w-full h-12 bg-gradient-to-r from-[#2A4A7A] to-[#3A5A8A] hover:from-[#3A5A8A] hover:to-[#4A6A9A] text-white rounded-xl shadow-xl shadow-[#2A4A7A]/20 transition-all duration-300 hover:shadow-[#2A4A7A]/40 hover:scale-[1.02] active:scale-[0.97] text-sm font-light mt-2 relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700" />
              {loading ? (
                <span className="flex items-center gap-2 relative z-10">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Вход...
                </span>
              ) : (
                <span className="flex items-center gap-2 relative z-10">
                  <LogIn className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  Войти
                </span>
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-[10px] text-white/15 transition-all duration-300 hover:text-white/30">
            Демо: eve.holt@reqres.in / любой пароль
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
