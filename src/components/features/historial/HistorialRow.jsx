import React from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';

const HistorialRow = ({ nombre, subtexto, onRestore, onDelete, isTask = false }) => (
  <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex justify-between items-center group animate-in fade-in duration-300">
    <div className="flex-1">
      <h4 className={`font-bold ${isTask ? 'text-sm text-slate-400' : 'text-slate-300'}`}>{nombre}</h4>
      {subtexto && <p className="text-[10px] text-slate-500 uppercase tracking-tight">{subtexto}</p>}
    </div>
    <div className="flex gap-2">
      <button 
        onClick={onRestore}
        title="Restaurar"
        className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
      >
        <RotateCcw size={16} />
      </button>
      {onDelete && (
        <button 
          onClick={() => { if(window.confirm("¿Confirmas la eliminación definitiva?")) onDelete(); }}
          title="Eliminar permanentemente"
          className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  </div>
);

export default HistorialRow;