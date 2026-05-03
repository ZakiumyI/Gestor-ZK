import React from 'react';
import { ChevronRight, Layers } from 'lucide-react';
import TareaRow from './TareaRow';

const ProyectoCard = ({ proyecto, tipo, onClick, onCompletarTarea }) => {
  // Verificación inicial por si el proyecto no ha cargado
  if (!proyecto) return null;

  const themes = {
    high: { border: 'border-l-red-500', text: 'text-red-400', dot: 'bg-red-500', shadow: 'shadow-red-900/20' },
    mid: { border: 'border-l-amber-500', text: 'text-amber-400', dot: 'bg-amber-500', shadow: 'shadow-amber-900/20' },
    low: { border: 'border-l-blue-500', text: 'text-blue-400', dot: 'bg-blue-500', shadow: 'shadow-blue-900/20' }
  };

  const theme = proyecto.urgencia >= 4 ? themes.high : proyecto.urgencia === 3 ? themes.mid : themes.low;
  
  // Blindaje con optional chaining y fallback a array vacío
  const tareasPendientes = proyecto.tareas?.filter(t => t.estado !== 'Completada') || [];

  return (
    <div className={`bg-slate-900/40 border border-slate-800/50 border-l-4 ${theme.border} rounded-r-3xl ${theme.shadow} overflow-hidden transition-all hover:bg-slate-900/60 shadow-lg`}>
      <div className="p-5 flex justify-between items-start cursor-pointer group" onClick={() => onClick(proyecto)}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${theme.dot} ${proyecto.urgencia >= 4 ? 'animate-pulse' : ''}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${theme.text}`}>Prioridad Lvl {proyecto.urgencia}</span>
          </div>
          <h3 className="font-bold text-xl text-white tracking-tight group-hover:text-blue-400 transition-colors">{proyecto.nombre}</h3>
          <div className="flex gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 text-[9px] text-slate-400 font-bold border border-slate-700/50">
              <Layers size={10} className="text-blue-500" /> {tipo?.nombre || proyecto.categoria || 'Sin categoría'}
            </span>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-700 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
      </div>

      <div className="px-5 pb-5 space-y-2.5">
        {tareasPendientes.slice(0, 3).map(t => (
          <TareaRow key={t.id} tarea={t} onCompletar={onCompletarTarea} />
        ))}
        {tareasPendientes.length > 3 && (
          <p className="text-[9px] text-slate-600 text-center font-bold uppercase tracking-widest pt-2">+ {tareasPendientes.length - 3} tareas ocultas</p>
        )}
      </div>
    </div>
  );
};

export default ProyectoCard;