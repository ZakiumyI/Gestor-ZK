import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const GestionCategorias = ({ categorias = [], onAgregar, onBorrar }) => {
  const [nombre, setNombre] = useState("");

  const manejarAgregar = () => {
    // Validación: Evitar strings vacíos o solo espacios
    if (!nombre.trim()) return;
    
    // Ejecutar la función que viene del hook
    onAgregar(nombre.trim());
    
    // Limpiar el input
    setNombre("");
  };

  return (
    <div className="mb-8 p-6 bg-slate-900/50 border-2 border-blue-500/30 rounded-[2rem] animate-in slide-in-from-top duration-300">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
        <Plus size={12} /> Gestionar Módulos de Docencia
      </h3>

      {/* Listado de Categorías Existentes */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(categorias || []).length === 0 ? (
          <p className="text-[10px] text-slate-600 italic uppercase">No hay categorías definidas.</p>
        ) : (
          categorias.map(cat => (
            <div 
              key={cat.id} 
              className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg group hover:border-slate-600 transition-colors"
            >
              <span className="text-[10px] text-slate-300 uppercase font-bold tracking-tight">
                {cat.nombre}
              </span>
              <button 
                onClick={() => onBorrar(cat.id)} 
                className="text-slate-600 hover:text-red-400 transition-colors"
                title="Eliminar categoría"
              >
                <X size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Input de Nueva Categoría */}
      <div className="flex gap-2">
        <input 
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && manejarAgregar()}
          placeholder="Ej: Programación C++, Astrofísica..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500 transition-all"
        />
        <button 
          onClick={manejarAgregar}
          disabled={!nombre.trim()}
          className={`px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            nombre.trim() 
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          Añadir
        </button>
      </div>
    </div>
  );
};

export default GestionCategorias;