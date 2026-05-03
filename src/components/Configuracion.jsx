import React, { useState } from 'react';
import { Activity, Zap, Trash2, Calendar, Check } from 'lucide-react';
import Resumen from "./features/dashboard/Resumen"; 
import DeadlineList from "./features/dashboard/DeadlineList";
import Modal from "./ui/Modal";

const Configuracion = ({ nivelEnergia = 0, stats, tiposProyecto = [], onAgregarTipo, onEliminarTipo }) => {
  // Estados para la gestión del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoEstres, setNuevoEstres] = useState(3);

  const alEnviar = (e) => {
    e.preventDefault();
    if (nuevoNombre.trim()) {
      onAgregarTipo(nuevoNombre, nuevoEstres);
      setNuevoNombre('');
      setNuevoEstres(3);
      setIsModalOpen(false);
    }
  };

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
              {nivelEnergia > 80 ? 'SOBRECARGA' : 'ESTABLE'}
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

      {/* 2. CRONOGRAMA DE VENCIMIENTOS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Calendar size={16} className="text-purple-400" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cronograma de Deadlines</h3>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem]">
          <DeadlineList proyectos={stats?.proyectosActivos || []} />
        </div>
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
                <p className="text-[9px] text-slate-500 font-mono italic uppercase">Nivel de estrés: {t.nivel_estres}</p>
              </div>
              <button onClick={() => onEliminarTipo(t.id)} className="text-slate-600 hover:text-red-500 p-2 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-4 border border-dashed border-slate-700 rounded-2xl text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
          >
            + Agregar tipo de proyecto
          </button>
        </div>
      </div>

      {/* MODAL DE ENTRADA DE DATOS */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Hilo"
        subtitle="Definición de Arquitectura"
        size="sm"
      >
        <form onSubmit={alEnviar} className="p-6 space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Nombre del Tipo</label>
            <input 
              autoFocus
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Ej: Universidad, Freelance..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Carga de Estrés</label>
              <span className="text-xs font-mono text-blue-400">{nuevoEstres} / 5</span>
            </div>
            <input 
              type="range"
              min="1"
              max="5"
              step="1"
              value={nuevoEstres}
              onChange={(e) => setNuevoEstres(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <button 
            type="submit"
            disabled={!nuevoNombre.trim()}
            className={`w-full p-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              nuevoNombre.trim() 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Check size={14} /> Registrar en Sistema
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Configuracion;