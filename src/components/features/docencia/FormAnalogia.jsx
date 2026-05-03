import React, { useState, useEffect } from 'react';
import { X, PlusCircle, AlertCircle } from 'lucide-react';

const FormAnalogia = ({ categorias = [], onAgregar, onClose }) => {
  const [nuevo, setNuevo] = useState({ 
    titulo: '', 
    contenido: '', 
    categoria_id: null 
  });

  // Efecto para asignar la primera categoría automáticamente cuando carguen
  useEffect(() => {
    if (categorias.length > 0 && !nuevo.categoria_id) {
      setNuevo(prev => ({ ...prev, categoria_id: categorias[0].id }));
    }
  }, [categorias]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nuevo.titulo.trim() || !nuevo.contenido.trim()) {
      alert("Por favor, completa el concepto y la analogía.");
      return;
    }

    if (!nuevo.categoria_id) {
      alert("Debes seleccionar o crear una categoría primero.");
      return;
    }

    onAgregar(nuevo.titulo, nuevo.contenido, nuevo.categoria_id);
    onClose(); 
  };

  return (
    <div className="mb-8 bg-slate-900 border-2 border-emerald-500/30 p-6 rounded-[2rem] space-y-4 shadow-2xl animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
          <PlusCircle size={16} /> Recurso Didáctico
        </h3>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="space-y-3">
        <input 
          placeholder="Concepto (ej: Punteros, Props, Middlewares)"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:border-emerald-500 outline-none transition-all"
          value={nuevo.titulo}
          onChange={e => setNuevo({...nuevo, titulo: e.target.value})}
        />
        
        <textarea 
          placeholder="Escribe la analogía para tus alumnos..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white h-32 resize-none focus:border-emerald-500 outline-none transition-all"
          value={nuevo.contenido}
          onChange={e => setNuevo({...nuevo, contenido: e.target.value})}
        />

        <div className="space-y-2">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Seleccionar Categoría</p>
          
          {categorias.length === 0 ? (
            <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-[10px] font-bold uppercase italic">
              <AlertCircle size={14} /> Necesitas crear una categoría arriba primero
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categorias.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setNuevo({...nuevo, categoria_id: cat.id})}
                  className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition-all ${
                    nuevo.categoria_id === cat.id 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-900/20' 
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={categorias.length === 0}
        className={`w-full font-black py-4 rounded-xl transition-all uppercase text-[10px] tracking-widest shadow-lg ${
          categorias.length === 0 
            ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
        }`}
      >
        Subir al Cerebro Docente
      </button>
    </div>
  );
};

export default FormAnalogia;