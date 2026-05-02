import React from 'react';
import { BarChart3, Clock, Zap, BrainCircuit, CalendarDays } from 'lucide-react';

const Resumen = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-top duration-700">
      
      {/* CARD: CARGA TOTAL */}
      <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-[2rem] flex items-center gap-4">
        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
          <BarChart3 size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Carga Activa</p>
          <p className="text-xl font-bold text-white">{stats.totalProyectos} <span className="text-xs text-slate-500 font-normal">Proyectos</span></p>
        </div>
      </div>

      {/* CARD: MEMORIA SECUNDARIA */}
      <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-[2rem] flex items-center gap-4">
        <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-400">
          <BrainCircuit size={24} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Buffer Mental</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-white">{stats.ratioReentrada}%</p>
            <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${stats.ratioReentrada}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* CARD: PRODUCTIVIDAD */}
      <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-[2rem] flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
          <Zap size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sprints (7d)</p>
          <p className="text-xl font-bold text-white">{stats.completadasSemana} <span className="text-xs text-slate-500 font-normal">Hechas</span></p>
        </div>
      </div>

      {/* CARD: PRÓXIMO HITO */}
      <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-[2rem] flex items-center gap-4">
        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Urgencia Máxima</p>
          {stats.proximosVencimientos[0] ? (
            <p className="text-xs font-bold text-white truncate max-w-[120px]">
              {stats.proximosVencimientos[0].nombre}
            </p>
          ) : (
            <p className="text-xs text-slate-500">Sin deadlines</p>
          )}
        </div>
      </div>

      {/* LISTA DE VENCIMIENTOS CERCANOS (OCUPA 2 COLUMNAS) */}
      <div className="md:col-span-2 bg-slate-900/60 border border-blue-500/20 p-6 rounded-[2rem]">
        <div className="flex items-center gap-2 mb-4 text-blue-400">
          <CalendarDays size={18} />
          <h3 className="text-[10px] font-black uppercase tracking-widest">Cronograma de Vencimientos</h3>
        </div>
        <div className="space-y-3">
          {stats.proximosVencimientos.length > 0 ? (
            stats.proximosVencimientos.map(p => (
              <div key={p.id} className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-200">{p.nombre}</span>
                <span className={`text-[10px] font-mono px-2 py-1 rounded ${
                  new Date(p.deadline) < new Date() ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {p.deadline}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-slate-600 text-xs italic">No hay fechas programadas en el sistema.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resumen;