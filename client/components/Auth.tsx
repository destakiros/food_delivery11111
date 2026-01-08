
import React, { useState, useEffect } from 'react';

interface AuthProps {
  mode: 'login' | 'register';
  setMode: (mode: 'login' | 'register') => void;
  onLogin: (email: string, pass: string) => void;
  onRegister: (name: string, email: string, phone: string, pass: string) => void;
  onBack?: () => void;
  loginError?: string;
}

const Auth: React.FC<AuthProps> = ({ mode, setMode, onLogin, onRegister, onBack, loginError }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (loginError) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loginError]);

  const validatePassword = (pass: string) => {
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const isLongEnough = pass.length >= 8;
    return {
      isValid: hasUpper && hasLower && hasNumber && isLongEnough,
      checks: { length: isLongEnough, upper: hasUpper, lower: hasLower, number: hasNumber }
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'register') {
      const { isValid } = validatePassword(formData.password);
      if (!isValid) {
        alert("🛑 Security Breach: Password must be 8+ characters, include Upper, Lower, and a Number.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("🛑 Registry Conflict: Pass-keys do not match.");
        return;
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      if (mode === 'login') {
        onLogin(formData.email, formData.password);
      } else {
        onRegister(formData.name, formData.email, formData.phone, formData.password);
      }
      setIsSubmitting(false);
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStrength = () => {
    const pass = formData.password;
    if (pass.length === 0) return 0;
    const { checks } = validatePassword(pass);
    const score = (checks.length ? 25 : 0) + (checks.upper ? 25 : 0) + (checks.lower ? 25 : 0) + (checks.number ? 25 : 0);
    return score;
  };

  const strength = getStrength();
  const passDetails = validatePassword(formData.password).checks;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-gray-50 dark:bg-zinc-950">
      <div className="login-bg-animation"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ino-red/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-ino-yellow/5 blur-[120px] rounded-full"></div>
      
      <div className={`relative z-10 w-full max-w-md transition-all duration-500 ${isShaking ? 'animate-shake' : ''}`}>
        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl p-10 md:p-14 rounded-[56px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white dark:border-white/5">
          
          <div className="text-center mb-12">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-[28px] mb-8 border-2 transition-all duration-500 ${loginError ? 'bg-ino-red text-white border-ino-red animate-pulse shadow-lg shadow-red-500/20' : 'bg-ino-red/5 dark:bg-ino-red/10 border-ino-red/10 text-ino-red'}`}>
              <i className={`ph-bold ${loginError ? 'ph-warning-octagon' : mode === 'login' ? 'ph-fingerprint' : 'ph-user-plus'} text-4xl`}></i>
            </div>
            <h2 className="text-4xl font-black text-gray-950 dark:text-white uppercase tracking-tighter leading-none mb-3 italic">
              {mode === 'login' ? 'TERMINAL SIGN-IN' : 'ENLIST OPERATIVE'}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-ino-red animate-ping"></span>
              <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
                STATION NODE: ALPHA-ONE
              </p>
            </div>
          </div>

          {loginError && (
            <div className="mb-10 p-6 bg-red-50 dark:bg-red-950/20 border-l-4 border-ino-red rounded-2xl flex items-center gap-5 animate-fade-in shadow-sm">
              <div className="shrink-0 w-10 h-10 bg-ino-red rounded-xl flex items-center justify-center text-white">
                <i className="ph-fill ph-shield-warning text-xl"></i>
              </div>
              <div className="flex-grow">
                <p className="text-[10px] font-black uppercase text-ino-red tracking-widest mb-1 italic">Protocol Breach Detected</p>
                <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase leading-tight">{loginError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-ino-red">Operative Full Identity</label>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800/50 p-5 rounded-[22px] border border-gray-100 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-ino-red focus-within:bg-white dark:focus-within:bg-zinc-800 transition-all shadow-inner">
                  <i className="ph-bold ph-identification-card text-gray-400"></i>
                  <input 
                    required
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-transparent border-none outline-none w-full text-sm font-black text-black dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 caret-ino-red uppercase italic"
                    placeholder="e.g. ABEL WASIHUN"
                  />
                </div>
              </div>
            )}

            <div className="group space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-ino-red">Command Channel (Email)</label>
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800/50 p-5 rounded-[22px] border border-gray-100 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-ino-red focus-within:bg-white dark:focus-within:bg-zinc-800 transition-all shadow-inner">
                <i className="ph-bold ph-envelope-simple text-gray-400"></i>
                <input 
                  required
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent border-none outline-none w-full text-sm font-black text-black dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 caret-ino-red uppercase italic"
                  placeholder="ID@STATION.COM"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-ino-red">Relay Link (Phone)</label>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800/50 p-5 rounded-[22px] border border-gray-100 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-ino-red focus-within:bg-white dark:focus-within:bg-zinc-800 transition-all shadow-inner">
                  <i className="ph-bold ph-phone-call text-gray-400"></i>
                  <input 
                    required
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-transparent border-none outline-none w-full text-sm font-black text-black dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 caret-ino-red"
                    placeholder="0911-000-000"
                  />
                </div>
              </div>
            )}

            <div className="group space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest transition-colors group-focus-within:text-ino-red">Authentication Pass-Key</label>
                {mode === 'login' && (
                  <button type="button" className="text-[8px] font-black text-gray-300 hover:text-ino-red uppercase tracking-widest transition">Forgot?</button>
                )}
              </div>
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800/50 p-5 rounded-[22px] border border-gray-100 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-ino-red focus-within:bg-white dark:focus-within:bg-zinc-800 transition-all shadow-inner relative">
                <i className="ph-bold ph-lock-key text-gray-400"></i>
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-transparent border-none outline-none w-full text-sm font-black text-black dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 caret-ino-red"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-ino-red transition p-1"
                >
                  <i className={`ph-bold ${showPassword ? 'ph-eye-closed' : 'ph-eye'}`}></i>
                </button>
              </div>
              
              {mode === 'register' && formData.password.length > 0 && (
                <div className="px-2 pt-2 space-y-3">
                   <div className="h-1.5 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-500 ${strength < 50 ? 'bg-ino-red' : strength < 100 ? 'bg-ino-yellow' : 'bg-emerald-500'}`} style={{ width: `${strength}%` }}></div>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <span className={`text-[7px] font-black uppercase tracking-tighter flex items-center gap-1 ${passDetails.length ? 'text-emerald-500' : 'text-gray-400'}`}>
                        <i className={`ph-fill ph-${passDetails.length ? 'check-circle' : 'circle'}`}></i> 8+ Chars
                      </span>
                      <span className={`text-[7px] font-black uppercase tracking-tighter flex items-center gap-1 ${passDetails.upper ? 'text-emerald-500' : 'text-gray-400'}`}>
                        <i className={`ph-fill ph-${passDetails.upper ? 'check-circle' : 'circle'}`}></i> Uppercase
                      </span>
                      <span className={`text-[7px] font-black uppercase tracking-tighter flex items-center gap-1 ${passDetails.lower ? 'text-emerald-500' : 'text-gray-400'}`}>
                        <i className={`ph-fill ph-${passDetails.lower ? 'check-circle' : 'circle'}`}></i> Lowercase
                      </span>
                      <span className={`text-[7px] font-black uppercase tracking-tighter flex items-center gap-1 ${passDetails.number ? 'text-emerald-500' : 'text-gray-400'}`}>
                        <i className={`ph-fill ph-${passDetails.number ? 'check-circle' : 'circle'}`}></i> Number
                      </span>
                   </div>
                   <p className="text-[8px] font-black uppercase text-gray-400 mt-1 tracking-widest text-right">Integrity Level: {strength}%</p>
                </div>
              )}
            </div>

            {mode === 'register' && (
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-ino-red">Verify Pass-Key</label>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800/50 p-5 rounded-[22px] border border-gray-100 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-ino-red focus-within:bg-white dark:focus-within:bg-zinc-800 transition-all shadow-inner">
                  <i className="ph-bold ph-shield-check text-gray-400"></i>
                  <input 
                    required
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-transparent border-none outline-none w-full text-sm font-black text-black dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 caret-ino-red"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 bg-ino-red text-white py-6 rounded-[24px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-red-500/40 hover:bg-red-700 transition transform hover:-translate-y-1 active:translate-y-0 active:scale-95 flex items-center justify-center gap-3 group overflow-hidden relative"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <span className="relative z-10">{mode === 'login' ? 'Authorize Session' : 'Commit Registry'}</span>
                  <i className="ph-bold ph-arrow-right group-hover:translate-x-2 transition-transform relative z-10"></i>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-gray-100 dark:border-white/5 text-center">
            <p className="text-gray-400 dark:text-gray-500 text-[11px] font-bold">
              {mode === 'login' ? "UNREGISTERED OPERATIVE?" : "ACCESS ALREADY GRANTED?"}
              <button 
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' }); }}
                className="ml-2 text-ino-red hover:text-black dark:hover:text-white transition-all font-black uppercase tracking-widest border-b-2 border-ino-red/0 hover:border-ino-red pb-1"
              >
                {mode === 'login' ? 'ENLIST NOW' : 'SIGN-IN'}
              </button>
            </p>
          </div>
          
          <button 
            onClick={onBack}
            className="w-full mt-8 text-gray-300 dark:text-gray-600 hover:text-ino-red text-[9px] font-black uppercase tracking-[0.5em] transition duration-500 italic"
          >
            ← RETREAT TO LOGISTICS HUB
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-center w-full pointer-events-none">
        <p className="text-[9px] font-black text-gray-300 dark:text-zinc-800 uppercase tracking-[0.8em] italic">
          DEVEL. ADMAS UNIVERSITY • CS-DEP
        </p>
      </div>
    </div>
  );
};

export default Auth;
