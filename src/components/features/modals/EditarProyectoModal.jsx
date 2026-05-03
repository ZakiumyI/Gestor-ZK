import React from 'react';
import { CheckCircle2, Trash2 } from 'lucide-react';
import Modal from '../../ui/Modal'; 

const EditarProyectoModal = ({ 
  proyecto, 
  tiposProyecto, 
  onClose, 
  onGuardar, 
  onCompletar, 
  onEliminar, 
  onEditarTarea,
  onCompletarTarea 
}) => {
  if (!proyecto) return null;

  // Manejador interno para procesar el formulario antes de enviarlo al hook
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Estructuramos el objeto con los nombres exactos que espera tu lógica de base de datos
    const datosActualizados = {
      id: proyecto.id,
      nombre: proyecto.nombre, // Mantenemos el nombre original
      estado_reentrada: formData.get('estado_reentrada'),
      esperando_a: formData.get('esperando_a'),
      tipo_id: parseInt(formData.get('tipo_id')),
      deadline: formData.get('deadline'),
      urgencia: parseInt(formData.get('urgencia'))
    };

    // Llamamos a la función onGuardar definida en App.js
    onGuardar(datosActualizados);
    onClose(); 
  };

  return (
    <Modal 
      isOpen={!!proyecto} 
      onClose={onClose} 
      title={proyecto.nombre}
      subtitle="Configuración de Hilo"
      size="lg" // Usamos el tamaño grande para el grid de edición
    >
      <div className="flex flex-col max-h-[85vh] w-full">
        
        {/* Acciones Rápidas */}
        <div className="px-6 py-4 bg-slate-950/30 border-b border-slate-800/50 flex gap-4 shrink-0">
          <button 
            type="button"
            onClick={() => { onCompletar(proyecto.id); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500/10 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-tighter"
          >
            <CheckCircle2 size={16} /> Finalizar Hilo
          </button>
          <button 
            type="button"
            onClick={() => { onEliminar(proyecto.id); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-tighter"
          >
            <Trash2 size={16} /> Eliminar
          </button>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna Izquierda: Estados de Memoria */}
              <div className="space-y-4">
                <div className="group">
                  <label className="text-[9px] font-bold text-orange-400 uppercase tracking-[0.2em] ml-1">Último objetivo alcanzado</label>
                  <textarea 
                    name="estado_reentrada" 
                    defaultValue={proyecto.estado_reentrada} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 mt-1 text-xs text-slate-300 h-32 resize-none focus:border-orange-500 outline-none transition-all font-mono" 
                    placeholder="Escribe el buffer de reentrada..."
                  />
                </div>
                <div className="group">
                  <label className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.2em] ml-1">Próximo pendiente crítico</label>
                  <textarea 
                    name="esperando_a" 
                    defaultValue={proyecto.esperando_a} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 mt-1 text-xs text-slate-300 h-32 resize-none focus:border-emerald-500 outline-none transition-all" 
                    placeholder="¿Qué bloquea este hilo?"
                  />
                </div>
              </div>

              {/* Columna Derecha: Metadatos */}
              <div className="bg-slate-800/20 p-6 rounded-[2.5rem] border border-slate-800/50 space-y-6 self-start">
                <div>
                  <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-2">Tipo de Proyecto</label>
                  <select 
                    name="tipo_id" 
                    defaultValue={proyecto.tipo_id} 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-blue-500 transition-all"
                  >
                    {tiposProyecto.map(t => (
                      <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-2">Deadline Objetivo</label>
                  <input 
                    type="date" 
                    name="deadline" 
                    defaultValue={proyecto.deadline} 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-blue-400 font-mono outline-none" 
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Nivel de Urgencia</label>
                    <span className="text-[10px] font-mono text-blue-500">Tier_{proyecto.urgencia}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    name="urgencia" 
                    defaultValue={proyecto.urgencia} 
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer" 
                  />
                </div>
              </div>
            </div>

            {/* Gestión de Tareas Hijas */}
            <div className="pt-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4">Tareas Vinculadas al Cortex</label>
              <div className="space-y-2">
                {proyecto.tareas?.filter(t => t.estado !== 'Completada').map(t => (
                  <div key={t.id} className="flex items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800 group hover:border-blue-500/30 transition-all">
                    <input 
                      type="text" 
                      defaultValue={t.descripcion}
                      onBlur={(e) => onEditarTarea(t.id, e.target.value, t.fecha_objetivo)}
                      className="bg-transparent border-none text-xs text-slate-300 flex-1 outline-none font-medium"
                    />
                    <button 
                      type="button" 
                      onClick={() => onCompletarTarea(t.id)} 
                      className="text-slate-600 hover:text-emerald-500 transition-colors"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  </div>
                ))}
                {(!proyecto.tareas || proyecto.tareas.filter(t => t.estado !== 'Completada').length === 0) && (
                  <p className="text-[10px] text-slate-600 italic text-center py-4">No hay tareas pendientes en este hilo.</p>
                )}
              </div>
            </div>

            {/* Footer de Acción */}
            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl text-[11px] tracking-[0.3em] uppercase transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]"
              >
                Sincronizar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EditarProyectoModal;