import React from 'react';
import { LayoutDashboard, GraduationCap, Plus, History } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, onPlusClick }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-10 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-40 pointer-events-none">
      <div className="max-w-md mx-auto relative pointer-events-auto">
        
        {/* BOTÓN CENTRAL: NUEVA TAREA (Elevado) */}
        <div className="absolute left-1/2 -top-12 -translate-x-1/2">
          <button 
            onClick={onPlusClick}
            className="group relative flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] active:scale-90 transition-all duration-300 overflow-hidden"
          >
            {/* Efecto de brillo interior */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <Plus 
              size={32} 
              strokeWidth={2.5} 
              className="relative z-10 group-hover:rotate-90 transition-transform duration-300" 
            />
            
            {/* Anillo exterior animado */}
            <div className="absolute inset-0 border-4 border-blue-400/20 rounded-full animate-ping group-hover:animate-none" />
          </button>
        </div>

        {/* CONTENEDOR PRINCIPAL DEL NAV */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800/50 rounded-[2.5rem] p-2 flex items-center justify-around shadow-2xl">
          
          {/* DASHBOARD (Frentes) */}
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3 transition-all duration-300 ${
              activeTab === 'dashboard' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-blue-500/10' : ''}`}>
              <LayoutDashboard size={22} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.15em]">Frentes</span>
          </button>

          {/* DOCENCIA (Clases) */}
          <button 
            onClick={() => setActiveTab('docencia')}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3 transition-all duration-300 ${
              activeTab === 'docencia' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors ${activeTab === 'docencia' ? 'bg-emerald-500/10' : ''}`}>
              <GraduationCap size={22} strokeWidth={activeTab === 'docencia' ? 2.5 : 2} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.15em]">Clases</span>
          </button>

          {/* Espaciador para el botón central */}
          <div className="w-16" />

          {/* HISTORIAL (Log de éxitos) */}
          <button 
            onClick={() => setActiveTab('historial')}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3 transition-all duration-300 ${
              activeTab === 'historial' ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors ${activeTab === 'historial' ? 'bg-purple-500/10' : ''}`}>
              <History size={22} strokeWidth={activeTab === 'historial' ? 2.5 : 2} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.15em]">Hitos</span>
          </button>

          {/* SECCIÓN "YO" (Stats & Config) */}
          <button 
            onClick={() => setActiveTab('config')}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3 transition-all duration-300 ${
              activeTab === 'config' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors ${activeTab === 'config' ? 'bg-amber-500/10' : ''}`}>
              <div className={`w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold ${activeTab === 'config' ? 'bg-amber-400 text-slate-950' : ''}`}>
                JS
              </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.15em]">Yo</span>
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navigation;