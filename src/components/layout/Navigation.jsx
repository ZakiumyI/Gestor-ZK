import React from 'react';
import { LayoutDashboard, GraduationCap, Plus, History } from 'lucide-react';
import NavItem from './NavItem';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Frentes', icon: LayoutDashboard, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'docencia', label: 'Clases', icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'spacer', isSpacer: true },
  { id: 'historial', label: 'Hitos', icon: History, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'config', label: 'Yo', customIcon: 'JS', color: 'text-amber-400', bg: 'bg-amber-500/10' },
];

const Navigation = ({ activeTab, setActiveTab, onPlusClick }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-10 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-40 pointer-events-none">
      <div className="max-w-md mx-auto relative pointer-events-auto">
        
        {/* BOTÓN CENTRAL: NUEVA TAREA */}
        <div className="absolute left-1/2 -top-12 -translate-x-1/2">
          <button 
            onClick={onPlusClick}
            className="group relative flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] active:scale-90 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus size={32} strokeWidth={2.5} className="relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            <div className="absolute inset-0 border-4 border-blue-400/20 rounded-full animate-ping group-hover:animate-none" />
          </button>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800/50 rounded-[2.5rem] p-2 flex items-center justify-around shadow-2xl">
          {NAV_ITEMS.map((item, idx) => (
            item.isSpacer ? (
              <div key={`spacer-${idx}`} className="w-16" />
            ) : (
              <NavItem 
                key={item.id}
                {...item}
                icon={item.icon}
                activeTab={activeTab}
                colorClass={item.color}
                bgClass={item.bg}
                onClick={setActiveTab}
              />
            )
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;