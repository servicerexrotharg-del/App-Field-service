import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('fservice');
  const [password, setPassword] = useState('3286');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      if (username.trim() === 'fservice' && password.trim() === '3286') {
        onLoginSuccess();
      } else {
        setErrorMsg('Usuario o contraseña incorrectos. Verifique los datos.');
        setIsSubmitting(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl z-10 flex flex-col space-y-6">
        
        {/* Animated Emblem / Video Loop Header */}
        <div className="relative w-full aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 rounded-xl overflow-hidden border border-slate-700/60 shadow-inner flex flex-col items-center justify-center p-0 group">
          {/* Background Video Player */}
          <video
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            className="absolute inset-0 w-full h-full object-cover scale-[1.18] rounded-xl z-10"
            onCanPlay={(e) => {
              (e.target as HTMLElement).style.opacity = '1';
            }}
            onError={(e) => {
              // Hide video element on error so fallback emblem shows smoothly
              (e.target as HTMLElement).style.display = 'none';
            }}
            style={{ opacity: 1, transition: 'opacity 0.5s ease-in-out' }}
          >
            <source src="/Video presentacion.MP4" type="video/mp4" />
            <source src="/Video%20presentacion.MP4" type="video/mp4" />
            <source src="/Video presentacion.mp4" type="video/mp4" />
            <source src="/video_presentacion.mp4" type="video/mp4" />
            <source src="/video de presentacion.mp4" type="video/mp4" />
            <source src="/Video_presentacion.mp4" type="video/mp4" />
            <source src="/video_presentacion.webm" type="video/webm" />
            <source src="/assets/video_presentacion.mp4" type="video/mp4" />
          </video>

          {/* Emblem Fallback / Watermark Badge */}
          <div className="relative z-0 flex flex-col items-center text-center space-y-1 p-4 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-cyan-300 p-0.5 shadow-lg shadow-cyan-500/20 mb-1">
              <div className="w-full h-full bg-slate-950/90 rounded-full flex flex-col items-center justify-center border border-cyan-400/40">
                <span className="text-[10px] font-black tracking-wider text-cyan-400 uppercase">REXROTH</span>
                <span className="text-[8px] font-extrabold text-white tracking-widest uppercase">SERVICE</span>
              </div>
            </div>
            <div className="text-xs font-black tracking-widest text-cyan-400 uppercase">REXROTH SERVICE</div>
            <div className="text-[10px] text-slate-400 tracking-wider">THE ORIGINAL</div>
          </div>
        </div>

        {/* Welcome Phrase */}
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-slate-100">
            Bienvenido al “formulario interactivo de Field service”
          </h2>
          <p className="text-xs text-slate-400">
            Ingrese sus credenciales para acceder a la gestión de asistencia técnica
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="fservice"
              required
              className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              required
              className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-lg text-xs text-rose-300 font-medium">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg text-sm transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Verificando...' : 'Ingresar al Sistema'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 text-center">
          <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3 text-cyan-500" />
            <span>Bosch Rexroth Field Service System • Formulario FR82155-4</span>
          </p>
        </div>
      </div>
    </div>
  );
};
