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

  return (
    <Modal 
      isOpen={!!proyecto} 
      onClose={onClose} 
      title={proyecto.nombre}
      subtitle="Protocolo_Reentrada"
    >
      {/* 
        Sobrescribimos el max-w-md del componente base mediante una clase externa 
        o simplemente ajustamos el contenido. 
        Nota: Para que este modal se vea bien, lo ideal sería que tu Modal.jsx 
        recibiera una prop 'maxWidth' opcional. 
      */}
      <div className="flex flex-col max-h-[80vh] w-full lg:min-w-[700px]">
        
        {/* Acciones Rápidas (Superior) */}
        <div className="px-6 py-4 bg-slate-950/30 border-b border-slate-800/50 flex gap-4">
          <button 
            onClick={() => onCompletar(proyecto.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-tighter"
          >
            <CheckCircle2 size={16} /> Finalizar Hilo
          </button>
          <button 
            onClick={() => onEliminar(proyecto.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-tighter"
          >
            <Trash2 size={16} /> Abortar
          </button>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar">
          <form onSubmit={onGuardar} className="space-y-6">
            
            {/* Grid de Configuración */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="group">
                  <label className="text-[9px] font-bold text-orange-400 uppercase tracking-[0.2em] ml-1">Contexto_Actual</label>
                  <textarea 
                    name="estado_reentrada" 
                    defaultValue={proyecto.estado_reentrada} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 mt-1 text-xs text-slate-300 h-28 resize-none focus:border-orange-500 outline-none transition-all font-mono" 
                    placeholder="Buffer de memoria..."
                  />
                </div>
                <div className="group">
                  <label className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.2em] ml-1">Pendiente_Externo</label>
                  <textarea 
                    name="esperando_a" 
                    defaultValue={proyecto.esperando_a} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 mt-1 text-xs text-slate-300 h-28 resize-none focus:border-emerald-500 outline-none transition-all" 
                    placeholder="Esperando respuesta de..."
                  />
                </div>
              </div>

              <div className="bg-slate-800/30 p-5 rounded-[2rem] border border-slate-800 space-y-4">
                <div>
                  <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Type_ID</label>
                  <select name="tipo_id" defaultValue={proyecto.tipo_id} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none">
                    {tiposProyecto.map(t => (
                      <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Target_Date</label>
                  <input type="date" name="deadline" defaultValue={proyecto.deadline} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-blue-400 font-mono outline-none" />
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Priority_Level</label>
                  <input type="range" min="1" max="5" name="urgencia" defaultValue={proyecto.urgencia} className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer mt-2" />
                </div>
              </div>
            </div>

            {/* Listado de Tareas secundarias */}
            <div className="pt-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">Sub_Process_Tasks</label>
              <div className="space-y-2">
                {proyecto.tareas?.filter(t => t.estado !== 'Completada').map(t => (
                  <div key={t.id} className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800 group hover:border-blue-500/30 transition-all">
                    <input 
                      type="text" 
                      defaultValue={t.descripcion}
                      onBlur={(e) => onEditarTarea(t.id, e.target.value, t.fecha_objetivo)}
                      className="bg-transparent border-none text-[11px] text-slate-300 flex-1 outline-none font-medium"
                    />
                    <button type="button" onClick={() => onCompletarTarea(t.id)} className="text-slate-600 hover:text-emerald-500 transition-colors">
                      <CheckCircle2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl text-[10px] tracking-[0.3em] uppercase transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]">
              Push_Update_to_Core
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EditarProyectoModal;