import React from 'react';
import { Lightbulb, Trash2 } from 'lucide-react';

const AnalogiaCard = ({ analogia, onBorrar }) => {
  // BLINDAJE: Si no hay objeto analogia, evitamos el crash
  if (!analogia) return null;

  return (
    <div className="group bg-slate-900/60 border border-slate-800/50 p-6 rounded-[2rem] hover:border-emerald-500/30 transition-all shadow-lg animate-in fade-in duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-yellow-500/10 rounded-lg">
              <Lightbulb size={16} className="text-yellow-400" />
            </div>
            {/* Fallback para el título */}
            <h3 className="font-bold text-lg text-slate-100 italic">
              {analogia.titulo || "Concepto sin título"}
            </h3>
          </div>
          <span className="inline-block px-2 py-0.5 bg-slate-800 rounded text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
            {analogia.categoria_nombre || 'General'}
          </span>
        </div>
        
        <button 
          onClick={() => {
            if(window.confirm("¿Eliminar este recurso didáctico?")) {
              onBorrar(analogia.id);
            }
          }} 
          className="p-2 text-slate-700 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Eliminar analogía"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Fallback para el contenido */}
      <p className="text-sm text-slate-300 leading-relaxed italic pl-4 border-l-2 border-emerald-500/20">
        "{analogia.contenido || "Sin descripción disponible."}"
      </p>
    </div>
  );
};

export default AnalogiaCard;