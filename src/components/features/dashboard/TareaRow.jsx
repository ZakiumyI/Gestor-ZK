import React from 'react';
import { Circle, Clock, Calendar } from 'lucide-react';

const TareaRow = ({ tarea, onCompletar }) => {
  const getStatus = (fecha) => {
    if (!fecha) return 'normal';
    const hoy = new Date();
    const deadline = new Date(fecha);
    const diff = Math.ceil((deadline - hoy) / (1000 * 60 * 60 * 24));
    return diff < 0 ? 'vencido' : diff <= 2 ? 'urgente' : 'normal';
  };

  const status = getStatus(tarea.fecha_objetivo);

  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/50 hover:border-slate-600 transition-all group/tarea">
      <div className="flex items-center gap-3">
        <button 
          onClick={(e) => { e.stopPropagation(); onCompletar(tarea.id); }}
          className="text-slate-700 hover:text-emerald-500 transition-all transform active:scale-75"
        >
          <Circle size={20} />
        </button>
        <span className={`text-sm font-medium ${status === 'vencido' ? 'text-red-300' : 'text-slate-300'}`}>
          {tarea.descripcion}
        </span>
      </div>

      {tarea.fecha_objetivo && (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black border ${
          status === 'vencido' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
          status === 'urgente' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
          'bg-slate-800 border-slate-700 text-slate-500'
        }`}>
          {status === 'vencido' ? <Clock size={10} /> : <Calendar size={10} />}
          {status === 'vencido' ? 'ATRASADO' : tarea.fecha_objetivo}
        </div>
      )}
    </div>
  );
};

export default TareaRow;