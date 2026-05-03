import React from 'react';
import { Activity, Zap, Trash2, Calendar } from 'lucide-react';
import Resumen from "./features/dashboard/Resumen"; 
import DeadlineList from "./features/dashboard/DeadlineList";

const Configuracion = ({ nivelEnergia = 0, stats, tiposProyecto = [], onAgregarTipo, onEliminarTipo }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 pb-20 px-4">
      {/* HEADER DE SECCIÓN */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
          <Activity size={20} className="text-blue-500" /> Diagnóstico del Sistema
        </h2>
        <p className="text-xs text-slate-500 font-mono italic">Análisis de carga y cronograma de hilos</p>
      </div>

      {/* 1. CARGA COGNITIVA (METER) */}
      <div className="bg-slate-900/60 p-7 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-end mb-6 relative z-10">
          <div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Carga Operativa</p>
            <h3 className="text-5xl font-black text-white tracking-tighter italic">{nivelEnergia}%</h3>
          </div>
          <div className="text-right">
            <p className={`text-xs font-bold uppercase ${nivelEnergia > 80 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
              {nivelEnergia > 80 ? 'OVERLOAD' : 'STABLE'}
            </p>
          </div>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div 
            className={`h-full transition-all duration-1000 rounded-full ${
              nivelEnergia > 80 ? 'bg-red-600' : nivelEnergia > 45 ? 'bg-blue-600' : 'bg-emerald-500'
            }`}
            style={{ width: `${nivelEnergia}%` }}
          />
        </div>
      </div>

      {/* 2. CRONOGRAMA DE VENCIMIENTOS (Movido aquí) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Calendar size={16} className="text-purple-400" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cronograma de Deadlines</h3>
        </div>
        <DeadlineList deadlines={stats?.proximosVencimientos || []} />
      </section>

      {/* 3. MÉTRICAS DE RESUMEN */}
      <Resumen stats={stats} />

      {/* 4. CONFIGURACIÓN DE TIPOS */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem]">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Arquitectura de Hilos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tiposProyecto?.map(t => (
            <div key={t.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
              <div>
                <p className="text-xs font-bold text-white">{t.nombre}</p>
                <p className="text-[9px] text-slate-500 font-mono italic uppercase">Stress_Weight: {t.nivel_estres}</p>
              </div>
              <button onClick={() => onEliminarTipo(t.id)} className="text-slate-600 hover:text-red-500 p-2">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button 
            onClick={onAgregarTipo}
            className="p-4 border border-dashed border-slate-700 rounded-2xl text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
          >
            + Add_Module_Type
          </button>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;