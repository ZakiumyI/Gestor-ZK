import React from 'react';
import { X, Target, Calendar, Tag, AlertTriangle } from 'lucide-react';

const NuevoProyectoModal = ({ isOpen, onClose, onGuardar, tiposProyecto }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    onGuardar({
      nombre: formData.get('nombre'),
      // Cambiamos 'categoria' por 'tipo_id' para mantener la integridad referencial
      tipo_id: parseInt(formData.get('tipo_id')), 
      deadline: formData.get('deadline'),
      urgencia: parseInt(formData.get('urgencia')),
      completado: 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-md rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-white">Nuevo Proyecto</h2>
            <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-1">
              Sincronizar nuevo hilo de trabajo
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nombre */}
          <div>
            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">
              <Target size={12} /> Nombre del Proyecto
            </label>
            <input required name="nombre" type="text" placeholder="Ej: Traducción CUDA Superbox" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 outline-none focus:border-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo de Proyecto (Dinámico) */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">
                <Tag size={12} /> Hilo / Tipo
              </label>
              <select name="tipo_id" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 outline-none appearance-none">
                <option value="">Seleccionar...</option>
                {tiposProyecto.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre} (S:{tipo.nivel_estres})
                  </option>
                ))}
              </select>
            </div>

            {/* Urgencia */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">
                <AlertTriangle size={12} /> Urgencia (1-5)
              </label>
              <input name="urgencia" type="number" min="1" max="5" defaultValue="3" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 outline-none focus:border-orange-500" />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">
              <Calendar size={12} /> Deadline Final
            </label>
            <input name="deadline" type="date" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 outline-none focus:border-emerald-500 color-scheme-dark" />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 mt-2">
            INICIAR PROCESO
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevoProyectoModal;