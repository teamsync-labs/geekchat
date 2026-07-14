import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Mail, Lock, User, Eye, EyeOff, 
  ArrowRight, Sparkles, Zap, Crown,
  CheckCircle, AlertCircle, Shield,
  Fingerprint, Key, Globe
} from 'lucide-react';

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [particles, setParticles] = useState([]);

  // ===== ГЕНЕРАЦИЯ ЧАСТИЦ =====
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  const FloatingLabel = ({ icon: Icon, label, type, value, onChange, placeholder }) => {
    const isFocused = focusedField === label;
    const hasValue = value.length > 0;

    return (
      <div className="relative group">
        <div className={`
          absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#2A4A7A] to-[#8AB4F8] 
          opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm
        `} />
        <div className="relative bg-[#0A1628]/60 backdrop-blur-sm rounded-xl border border-[#2A4A7A]/30 group-focus-within:border-[#8AB4F8]/50 transition-all duration-300">
          <Icon className={`
            absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 
            transition-all duration-300
            ${isFocused || hasValue ? 'text-[#8AB4F8]' : 'text-white/20'}
          `} />
          <input
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocusedField(label)}
            onBlur={() => setFocusedField(null)}
            placeholder={placeholder}
            className="w-full bg-transparent text-white/90 placeholder:text-white/20 pl-12 pr-4 py-4 rounded-xl outline-none transition-all duration-300"
          />
          <label className={`
            absolute left-12 -top-2.5 px-2 text-[10px] font-light 
            transition-all duration-300 bg-[#0A1628]/80 rounded-full
            ${isFocused || hasValue ? 'text-[#8AB4F8] opacity-100 -translate-y-0' : 'text-white/20 opacity-0 translate-y-2'}
          `}>
            {label}
          </label>
        </div>
      </div>
    );
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#2A4A7A]/10 via-[#8AB4F8]/10 to-[#2A4A7A]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#3A5A8A]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-[#4A6A9A]/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* ===== ОСНОВНАЯ КАРТОЧКА ===== */}
      <div className="w-full max-w-md relative z-10 animate-scale-up">
        <div className="relative bg-gradient-to-br from-[#162035]/95 to-[#1A2D4A]/95 backdrop-blur-xl rounded-3xl border border-[#2A4A7A]/30 p-8 shadow-2xl shadow-black/50 overflow-hidden">
          
          {/* ===== СТЕКЛЯННЫЙ БЛЕСК ===== */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#8AB4F8]/5 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#2A4A7A]/5 rounded-full blur-2xl animate-pulse delay-1000" />

          {/* ===== ЛОГОТИП ===== */}
          <div className="text-center mb-8 animate-slide-down">
            <div className="inline-block relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2A4A7A] to-[#8AB4F8] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
              <div className="absolute inset-0 rounded-full border border-[#2A4A7A]/20 animate-spin-slow" />
              <Avatar className="w-20 h-20 mx-auto border-2 border-[#2A4A7A]/30 shadow-xl shadow-[#2A4A7A]/10 transition-transform duration-500 group-hover:scale-110">
                <AvatarFallback className="bg-gradient-to-br from-[#2A4A7A] to-[#3A5A8A] text-white/90 text-3xl font-light">
                  G
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-3xl font-light bg-gradient-to-r from-[#E8EDF5] via-[#8AB4F8] to-[#E8EDF5] bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer mt-4">
              GeekChat
            </h1>
            <p className="text-sm text-white/30 font-light mt-1 animate-fade-up delay-100">
              {isLogin ? 'Добро пожаловать обратно!' : 'Присоединяйтесь к сообществу'}
            </p>
          </div>

          {/* ===== ФОРМА ===== */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <div className="animate-fade-up delay-100">
                <FloatingLabel
                  icon={User}
                  label="Имя"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введите ваше имя"
                />
              </div>
            )}

            <div className="animate-fade-up delay-150">
              <FloatingLabel
                icon={Mail}
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите ваш email"
              />
            </div>

            <div className="animate-fade-up delay-200">
              <div className="relative group">
                <div className={`
                  absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#2A4A7A] to-[#8AB4F8] 
                  opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm
                `} />
                <div className="relative bg-[#0A1628]/60 backdrop-blur-sm rounded-xl border border-[#2A4A7A]/30 group-focus-within:border-[#8AB4F8]/50 transition-all duration-300">
                  <Lock className={`
                    absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 
                    transition-all duration-300
                    ${focusedField === 'Пароль' || password.length > 0 ? 'text-[#8AB4F8]' : 'text-white/20'}
                  `} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('Пароль')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Введите пароль"
                    className="w-full bg-transparent text-white/90 placeholder:text-white/20 pl-12 pr-12 py-4 rounded-xl outline-none transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <label className={`
                    absolute left-12 -top-2.5 px-2 text-[10px] font-light 
                    transition-all duration-300 bg-[#0A1628]/80 rounded-full
                    ${focusedField === 'Пароль' || password.length > 0 ? 'text-[#8AB4F8] opacity-100 -translate-y-0' : 'text-white/20 opacity-0 translate-y-2'}
                  `}>
                    Пароль
                  </label>
                </div>
              </div>
            </div>

            {/* ===== ИНДИКАТОР НАДЁЖНОСТИ ПАРОЛЯ ===== */}
            {password.length > 0 && (
              <div className="animate-fade-up">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-[#2A4A7A]/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(password.length * 10, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/20 font-light">
                    {password.length < 4 ? 'Слабый' : password.length < 8 ? 'Средний' : 'Надёжный'}
                  </span>
                </div>
              </div>
            )}

            {/* ===== ОШИБКА ===== */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* ===== УСПЕХ ===== */}
            {isSuccess && (
              <div className="flex items-center gap-2 text-green-400 text-xs animate-fade-in">
                <CheckCircle className="w-4 h-4" />
                <span>Успешно! Перенаправление...</span>
              </div>
            )}

            {/* ===== КНОПКА ===== */}
            <Button
              type="submit"
              disabled={isLoading}
              className="relative w-full bg-gradient-to-r from-[#2A4A7A] via-[#3A5A8A] to-[#4A6A9A] hover:from-[#3A5A8A] hover:via-[#4A6A9A] hover:to-[#5A7AAA] text-white rounded-xl py-6 text-sm font-light shadow-xl shadow-[#2A4A7A]/20 transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden animate-fade-up delay-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
              {isLoading ? (
                <span className="relative flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Загрузка...
                </span>
              ) : (
                <span className="relative flex items-center gap-2">
                  {isLogin ? 'Войти' : 'Создать аккаунт'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* ===== ПЕРЕКЛЮЧЕНИЕ ===== */}
          <div className="mt-6 text-center animate-fade-up delay-400">
            <p className="text-sm text-white/20 font-light">
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
              <button
                onClick={toggleMode}
                className="ml-2 text-[#8AB4F8] hover:text-[#8AB4F8]/80 transition-colors hover:underline relative group"
              >
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
                <span className="absolute -bottom-0.5 left-0 w-full h-px bg-[#8AB4F8]/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </button>
            </p>
          </div>

          {/* ===== СТАТУСНАЯ СТРОКА ===== */}
          <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-white/10 font-light animate-fade-up delay-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Secure
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Fingerprint className="w-3 h-3" />
              Encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Global
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
