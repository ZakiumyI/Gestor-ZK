import React from 'react';
import { CalendarDays } from 'lucide-react';

// Agregamos default value [] para que nunca sea undefined
const DeadlineList = ({ deadlines = [] }) => {
  const isOverdue = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  return (
    <div className="bg-slate-900/60 border border-blue-500/20 p-6 rounded-[2rem]">
      <div className="flex items-center gap-2 mb-4 text-blue-400">
        <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <CalendarDays size={18} /> Cronograma de Vencimientos
        </h3>
      </div>
      <div className="space-y-3">
        {/* Ahora deadlines siempre será al menos un array vacío */}
        {deadlines && deadlines.length > 0 ? (
          deadlines.map((p) => (
            <div key={p.id} className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-200">{p.nombre}</span>
              <span className={`text-[10px] font-mono px-2 py-1 rounded ${
                isOverdue(p.deadline) ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/10 text-blue-400'
              }`}>
                {p.deadline || "Sin fecha"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center py-4 text-slate-600 text-xs italic">No hay fechas programadas.</p>
        )}
      </div>
    </div>
  );
};

export default DeadlineList;