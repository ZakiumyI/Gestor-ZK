import React from 'react';
import { Plus, Activity } from 'lucide-react';
import ProyectoCard from './ProyectoCard';

const Dashboard = ({ 
  proyectos = [], 
  tiposProyecto = [], 
  onProyectoClick, 
  onNuevoProyecto, 
  onCompletarTarea 
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32 px-4 max-w-5xl mx-auto">
      
      <header className="flex items-center justify-between mb-12 pt-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
            EJECUCIÓN <Activity className="text-blue-500" size={24} />
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold italic">
            ZAKIUMY_OS // PROCESS_MANAGER
          </p>
        </div>
        <button 
          onClick={onNuevoProyecto}
          className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-900/40 transition-all active:scale-95"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Cola de Proyectos
          </h2>
          <div className="h-[1px] flex-1 bg-slate-800/50" />
        </div>

        {proyectos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-[2.5rem] bg-slate-900/10">
            <p className="text-slate-600 text-xs font-mono tracking-[0.2em] uppercase text-center italic">
              IDLE_STATE: No se detectan procesos activos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proyectos.map(p => (
              <ProyectoCard 
                key={p.id}
                proyecto={p}
                tipo={tiposProyecto?.find(t => t.id === p.tipo_id)}
                onClick={onProyectoClick}
                onCompletarTarea={onCompletarTarea}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;