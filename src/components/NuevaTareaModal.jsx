import React from 'react';
import { X, ClipboardList, Calendar, Layers } from 'lucide-react';

const NuevaTareaModal = ({ isOpen, onClose, proyectos, onGuardar }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const nuevaTarea = {
      proyecto_id: parseInt(formData.get('proyecto_id')),
      descripcion: formData.get('descripcion'),
      fecha_objetivo: formData.get('fecha_objetivo'),
      urgencia: parseInt(formData.get('urgencia')) || 1
    };

    onGuardar(nuevaTarea);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-md rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-white">Nueva Tarea</h2>
            <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mt-1">
              Asignar paso táctico
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Selección de Proyecto */}
          <div>
            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">
              <Layers size={12} /> Proyecto Destino
            </label>
            <select 
              required
              name="proyecto_id"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 outline-none focus:border-blue-500 appearance-none"
            >
              <option value="">Seleccionar proyecto...</option>
              {proyectos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">
              <ClipboardList size={12} /> ¿Qué hay que hacer?
            </label>
            <input 
              required
              name="descripcion"
              type="text"
              placeholder="Ej: Terminar controlador de inventario"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          {/* Fecha Objetivo (Punto 1) */}
          <div>
            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">
              <Calendar size={12} /> Fecha Objetivo
            </label>
            <input 
              name="fecha_objetivo"
              type="date"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 outline-none focus:border-emerald-500 color-scheme-dark"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 mt-2"
          >
            AÑADIR TAREA
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevaTareaModal;