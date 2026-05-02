import React from 'react';
import { RotateCcw, CheckCircle, Trash2, Archive, XCircle } from 'lucide-react';

const Historial = ({ 
  historial, 
  onReactivarProyecto, 
  onReactivarTarea, 
  onEliminarProyectoDefinitivo 
}) => {

  const Row = ({ nombre, subtexto, onRestore, onDelete, isTask = false }) => (
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

  return (
    <div className="space-y-10 pb-32">
      {/* 1. PROYECTOS FINALIZADOS */}
      <section>
        <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <CheckCircle size={14} /> Proyectos Finalizados
        </h3>
        <div className="grid gap-3">
          {historial.proyectosCompletados?.length > 0 ? (
            historial.proyectosCompletados.map(p => (
              <Row key={p.id} nombre={p.nombre} subtexto={p.categoria} onRestore={() => onReactivarProyecto(p.id)} />
            ))
          ) : <p className="text-[10px] text-slate-600 italic">No hay proyectos terminados.</p>}
        </div>
      </section>

      {/* 2. TAREAS CUMPLIDAS (Log de éxito) */}
      <section>
        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Archive size={14} /> Log de Tareas Cumplidas
        </h3>
        <div className="grid gap-2">
          {historial.tareasCompletadas?.length > 0 ? (
            historial.tareasCompletadas.map(t => (
              <Row key={t.id} nombre={t.descripcion} isTask={true} onRestore={() => onReactivarTarea(t.id)} />
            ))
          ) : <p className="text-[10px] text-slate-600 italic">No hay tareas cumplidas recientemente.</p>}
        </div>
      </section>

      {/* 3. PAPELERA DE PROYECTOS (Soft Delete Proyectos) */}
      <section>
        <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Trash2 size={14} /> Papelera de Proyectos
        </h3>
        <div className="grid gap-3 opacity-80">
          {historial.proyectosEliminados?.length > 0 ? (
            historial.proyectosEliminados.map(p => (
              <Row 
                key={p.id} 
                nombre={p.nombre} 
                subtexto="Proyecto Descartado" 
                onRestore={() => onReactivarProyecto(p.id)} 
                onDelete={() => onEliminarProyectoDefinitivo(p.id)}
              />
            ))
          ) : <p className="text-[10px] text-slate-600 italic">Papelera de proyectos vacía.</p>}
        </div>
      </section>

      {/* 4. PAPELERA DE TAREAS (Soft Delete Tareas) - SECCIÓN NUEVA */}
      <section>
        <h3 className="text-[10px] font-black text-red-400/70 uppercase tracking-widest mb-4 flex items-center gap-2">
          <XCircle size={14} /> Tareas Eliminadas
        </h3>
        <div className="grid gap-2 opacity-70">
          {historial.tareasEliminadas?.length > 0 ? (
            historial.tareasEliminadas.map(t => (
              <Row 
                key={t.id} 
                nombre={t.descripcion} 
                isTask={true} 
                subtexto="Tarea Descartada"
                onRestore={() => onReactivarTarea(t.id)} 
              />
            ))
          ) : <p className="text-[10px] text-slate-600 italic">No hay tareas en la papelera.</p>}
        </div>
      </section>
    </div>
  );
};

export default Historial;