import React from 'react';
import { 
  Plus, 
  Circle, 
  Calendar,
  Clock,
  ChevronRight,
  Activity,
  Layers
} from 'lucide-react';

const Dashboard = ({ proyectos, tiposProyecto, onProyectoClick, onNuevoProyecto, onCompletarTarea }) => {
  
  const getDeadlineStatus = (fecha) => {
    if (!fecha) return 'normal';
    const hoy = new Date();
    const deadline = new Date(fecha);
    const diff = Math.ceil((deadline - hoy) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'vencido';
    if (diff <= 2) return 'urgente';
    return 'normal';
  };

  const getPriorityTheme = (level) => {
    if (level >= 4) return { border: 'border-l-red-500', text: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-500', shadow: 'shadow-red-900/20' };
    if (level === 3) return { border: 'border-l-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-500', shadow: 'shadow-amber-900/20' };
    return { border: 'border-l-blue-500', text: 'text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-500', shadow: 'shadow-blue-900/20' };
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32 px-4">
      
      <div className="flex items-center justify-between mb-8 pt-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
            PROYECTOS <Activity className="text-blue-500" size={24} />
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">ZAKIUMY_OS v2.1</p>
        </div>
        <button 
          onClick={onNuevoProyecto}
          className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-900/40 transition-all active:scale-90"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      <section className="space-y-6">
        {proyectos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-[2.5rem] bg-slate-900/20">
            <p className="text-slate-500 text-sm font-mono tracking-widest uppercase text-center px-10">
              IDLE_STATE: Sin Procesos Activos.<br/>Verifica la DB o crea uno nuevo.
            </p>
          </div>
        ) : (
          proyectos.map(p => {
            const theme = getPriorityTheme(p.urgencia);
            const tareasPendientes = p.tareas?.filter(t => t.estado !== 'Completada') || [];
            
            // LÓGICA DE RESCATE: Si no hay tipo_id, usa la columna categoria antigua
            const infoTipo = tiposProyecto.find(t => t.id === p.tipo_id) || 
                             { nombre: p.categoria || 'Sin Categoría' };

            return (
              <div 
                key={p.id} 
                className={`bg-slate-900/40 border border-slate-800/50 border-l-4 ${theme.border} rounded-r-3xl ${theme.shadow} overflow-hidden transition-all hover:bg-slate-900/60 shadow-lg`}
              >
                <div 
                  className="p-5 flex justify-between items-start cursor-pointer group"
                  onClick={() => onProyectoClick(p)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${theme.dot} ${p.urgencia >= 4 ? 'animate-pulse' : ''}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${theme.text}`}>
                        Prioridad Lvl {p.urgencia}
                      </span>
                    </div>
                    <h3 className="font-bold text-xl text-white tracking-tight group-hover:text-blue-400 transition-colors">{p.nombre}</h3>
                    
                    <div className="flex flex-wrap items-center gap-1.5">
                       <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 text-[9px] text-slate-400 font-bold uppercase tracking-tighter border border-slate-700/50">
                        <Layers size={10} className="text-blue-500" />
                        {infoTipo.nombre}
                      </span>
                      {p.esperando_a && (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-orange-500/10 text-[9px] text-orange-400 font-bold uppercase tracking-tighter border border-orange-500/20">
                          WAIT: {p.esperando_a}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-700 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                </div>

                <div className="px-5 pb-5 space-y-2.5">
                  {tareasPendientes.slice(0, 3).map(t => { // Mostrar solo las 3 primeras para no saturar
                    const status = getDeadlineStatus(t.fecha_objetivo);
                    return (
                      <div 
                        key={t.id} 
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/50 hover:border-slate-600 transition-all group/tarea"
                      >
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onCompletarTarea(t.id); }}
                            className="text-slate-700 hover:text-emerald-500 transition-all transform active:scale-75"
                          >
                            <Circle size={20} strokeWidth={2} />
                          </button>
                          <span className={`text-sm font-medium ${status === 'vencido' ? 'text-red-300' : 'text-slate-300'}`}>
                            {t.descripcion}
                          </span>
                        </div>

                        {t.fecha_objetivo && (
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black border ${
                            status === 'vencido' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                            status === 'urgente' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                            'bg-slate-800 border-slate-700 text-slate-500'
                          }`}>
                            {status === 'vencido' ? <Clock size={10} /> : <Calendar size={10} />}
                            {status === 'vencido' ? 'ATRASADO' : t.fecha_objetivo}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {tareasPendientes.length > 3 && (
                    <p className="text-[9px] text-slate-600 text-center font-bold uppercase tracking-widest pt-2">
                      + {tareasPendientes.length - 3} tareas ocultas
                    </p>
                  )}
                  
                  {tareasPendientes.length === 0 && (
                    <div className="py-4 bg-slate-950/20 rounded-2xl border border-dashed border-slate-800/50 flex items-center justify-center">
                      <p className="text-[10px] text-slate-600 font-mono italic">STACK_EMPTY: No hay tareas pendientes</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

export default Dashboard;