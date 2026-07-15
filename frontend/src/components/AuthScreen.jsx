import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, Lock, User, Eye, EyeOff, 
  ArrowRight, AlertCircle, CheckCircle,
  Shield, Globe, Zap, Crown
} from 'lucide-react';

function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  const [particles, setParticles] = useState([]);

  // ===== ГЕНЕРАЦИЯ ЧАСТИЦ =====
  useEffect(() => {
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  // ===== АНИМАЦИЯ ЧАСТИЦ =====
  useEffect(() => {
    let frameId;
    const animateParticles = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speedX + 100) % 100,
        y: (p.y + p.speedY + 100) % 100,
      })));
      frameId = requestAnimationFrame(animateParticles);
    };
    animateParticles();
    return () => cancelAnimationFrame(frameId);
  }, []);

  // ===== ОЦЕНКА ПАРОЛЯ =====
  const checkPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    const strengthMap = {
      0: { label: 'Очень слабый', color: 'bg-red-500', text: 'text-red-400' },
      1: { label: 'Слабый', color: 'bg-orange-500', text: 'text-orange-400' },
      2: { label: 'Средний', color: 'bg-yellow-500', text: 'text-yellow-400' },
      3: { label: 'Хороший', color: 'bg-blue-500', text: 'text-blue-400' },
      4: { label: 'Сильный', color: 'bg-green-500', text: 'text-green-400' },
      5: { label: 'Очень сильный', color: 'bg-emerald-500', text: 'text-emerald-400' },
    };

    const normalizedScore = Math.min(score, 5);
    return {
      score: normalizedScore,
      label: strengthMap[normalizedScore].label,
      color: strengthMap[normalizedScore].color,
      text: strengthMap[normalizedScore].text,
    };
  };

  // ===== ОБНОВЛЕНИЕ ПАРОЛЯ =====
  useEffect(() => {
    if (password.length > 0) {
      setPasswordStrength(checkPasswordStrength(password));
    } else {
      setPasswordStrength({ score: 0, label: '', color: '' });
    }
  }, [password]);

  // ===== ОБРАБОТКА ОТПРАВКИ =====
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !email.includes('@')) {
      setError('Введите корректный email');
      return;
    }
    if (!password.trim()) {
      setError('Введите пароль');
      return;
    }
    if (!isLogin && !name.trim()) {
      setError('Введите имя');
      return;
    }
    if (!isLogin && passwordStrength.score < 2) {
      setError('Пароль слишком слабый. Используйте минимум 8 символов, буквы и цифры');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      if (onLogin) {
        onLogin({ 
          name: isLogin ? email.split('@')[0] : name, 
          email: email 
        });
      }
      
      setTimeout(() => setIsSuccess(false), 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* ===== ЧАСТИЦЫ ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
      </div>

      {/* ===== ФОНОВЫЕ ЭФФЕКТЫ ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#2A4A7A]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#3A5A8A]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4A6A9A]/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* ===== КАРТОЧКА ===== */}
      <div className="relative z-10 w-full max-w-md animate-scale-up">
        <div className="bg-[#162035]/95 backdrop-blur-xl rounded-[32px] border border-[#2A4A7A]/30 p-8 shadow-2xl shadow-black/50">
          
          {/* ===== ЗАГОЛОВОК ===== */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2A4A7A] to-[#8AB4F8] rounded-full blur-2xl opacity-30 animate-pulse" />
              <div className="relative w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#2A4A7A] to-[#3A5A8A] rounded-[20px] flex items-center justify-center shadow-xl shadow-[#2A4A7A]/20">
                <span className="text-3xl">💬</span>
              </div>
            </div>
            <h1 className="text-2xl font-light bg-gradient-to-r from-[#E8EDF5] to-[#8AB4F8] bg-clip-text text-transparent">
              GeekChat
            </h1>
            <p className="text-sm text-[#8A9BB5] mt-1">
              {isLogin ? 'Добро пожаловать!' : 'Создайте аккаунт'}
            </p>
          </div>

          {/* ===== ФОРМА ===== */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <div>
                <label className="text-xs text-[#6A7A95] block mb-1.5">Имя</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A7A95]" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя..."
                    className="bg-[#0A1628] border-[#2A4A7A] text-[#E8EDF5] placeholder:text-[#6A7A95] focus:border-[#3A5A8A] pl-10 w-full rounded-[16px] transition-all duration-300 focus:scale-[1.02]"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-[#6A7A95] block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A7A95]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-[#0A1628] border-[#2A4A7A] text-[#E8EDF5] placeholder:text-[#6A7A95] focus:border-[#3A5A8A] pl-10 w-full rounded-[16px] transition-all duration-300 focus:scale-[1.02]"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#6A7A95] block mb-1.5">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A7A95]" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#0A1628] border-[#2A4A7A] text-[#E8EDF5] placeholder:text-[#6A7A95] focus:border-[#3A5A8A] pl-10 pr-10 w-full rounded-[16px] transition-all duration-300 focus:scale-[1.02]"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A7A95] hover:text-[#E8EDF5] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* ===== СИСТЕМА ОЦЕНКИ ПАРОЛЯ ===== */}
              {password.length > 0 && (
                <div className="mt-3 space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#1A2D4A] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} rounded-full transition-all duration-500`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-light ${passwordStrength.text}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  
                  {/* ===== ПОДСКАЗКИ ===== */}
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-[#6A7A95]">
                    <div className={`flex items-center gap-1 ${password.length >= 8 ? 'text-green-400' : ''}`}>
                      <span className="text-[8px]">{password.length >= 8 ? '✅' : '⬜'}</span>
                      Минимум 8 символов
                    </div>
                    <div className={`flex items-center gap-1 ${/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-400' : ''}`}>
                      <span className="text-[8px]">{/[a-z]/.test(password) && /[A-Z]/.test(password) ? '✅' : '⬜'}</span>
                      Заглавные и строчные
                    </div>
                    <div className={`flex items-center gap-1 ${/\d/.test(password) ? 'text-green-400' : ''}`}>
                      <span className="text-[8px]">{/\d/.test(password) ? '✅' : '⬜'}</span>
                      Цифры
                    </div>
                    <div className={`flex items-center gap-1 ${/[^a-zA-Z0-9]/.test(password) ? 'text-green-400' : ''}`}>
                      <span className="text-[8px]">{/[^a-zA-Z0-9]/.test(password) ? '✅' : '⬜'}</span>
                      Спецсимволы
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-[16px] p-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            )}

            {isSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-[16px] p-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <p className="text-sm text-green-400">
                    {isLogin ? 'Вход выполнен!' : 'Регистрация успешна!'}
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || isSuccess}
              className="group w-full bg-gradient-to-r from-[#2A4A7A] to-[#3A5A8A] hover:from-[#3A5A8A] hover:to-[#4A6A9A] text-white rounded-[20px] py-6 text-base font-light shadow-xl shadow-[#2A4A7A]/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
              <span className="relative flex items-center gap-2">
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isLogin ? 'Вход...' : 'Регистрация...'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Войти' : 'Создать аккаунт'}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </Button>
          </form>

          {/* ===== ПЕРЕКЛЮЧЕНИЕ ===== */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#6A7A95]">
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setPassword('');
                  setName('');
                  setPasswordStrength({ score: 0, label: '', color: '' });
                }}
                className="ml-2 text-[#8AB4F8] hover:text-[#8AB4F8]/80 transition-colors font-light hover:underline"
              >
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </div>

          {/* ===== СТАТУСНАЯ СТРОКА ===== */}
          <div className="mt-6 pt-4 border-t border-[#2A4A7A]/10">
            <div className="flex justify-center gap-4 text-[10px] text-[#6A7A95]">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Безопасно
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                AES-256
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                24/7
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
