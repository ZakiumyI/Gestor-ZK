import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Database, 
  PlusCircle, 
  AlertCircle, 
  ArrowRight, 
  Share2 
} from 'lucide-react';
import { useProyectos } from './hooks/useProyectos';
import { exportDatabase } from './database/export';

const getDiasRestantes = (deadline) => {
  if (!deadline) return null;
  const hoy = new Date();
  const meta = new Date(deadline);
  const diferencia = meta - hoy;
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};

function App() {
  const { proyectos, loading, refresh } = useProyectos();
  const [proyectoEditando, setProyectoEditando] = useState(null);

  // Filtrar prioridades críticas (Urgencia >= 4)
  const criticos = proyectos.filter(p => p.urgencia >= 4);

  const guardarReentrada = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const error = formData.get('error');
    const paso = formData.get('paso');

    if (!window.db) return;

    await window.db.run(
      "UPDATE proyectos SET estado_reentrada = ?, esperando_a = ? WHERE id = ?",
      [error, paso, proyectoEditando.id]
    );
    
    setProyectoEditando(null);
    refresh(); 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Cargando contextos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      {/* HEADER CON EXPORTACIÓN */}
      <header className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Cerebro Externo
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">
            Context Switcher
          </p>
        </div>
        <button 
          onClick={exportDatabase}
          className="p-3 bg-slate-800 rounded-full text-blue-400 active:bg-blue-600 active:text-white transition-all shadow-lg"
        >
          <Share2 size={20} />
        </button>
      </header>

      <main className="p-4">
        {/* FRENTES CRÍTICOS */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-red-500" size={18} />
            <h2 className="text-sm font-bold uppercase tracking-tight text-slate-400">Frentes Críticos</h2>
          </div>

          <div className="space-y-4">
            {criticos.map(p => {
              const dias = getDiasRestantes(p.deadline);
              const esCritico = dias !== null && dias <= 3;

              return (
                <div 
                  key={p.id} 
                  onClick={() => setProyectoEditando(p)}
                  className="bg-slate-900 border-l-4 border-red-500 p-4 rounded-r-xl shadow-xl active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg">{p.nombre}</h3>
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                      U{p.urgencia}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      esCritico ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {dias === null ? "SIN FECHA" : dias < 0 ? "VENCIDO" : `FALTAN ${dias} DÍAS`}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">{p.categoria}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <p className="text-[9px] text-orange-400 font-bold uppercase">Último Bloqueo</p>
                      <p className="text-xs text-slate-300 font-mono mt-1 line-clamp-2">
                        {p.estado_reentrada || "Sin registro."}
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <p className="text-[9px] text-emerald-400 font-bold uppercase">Siguiente Paso</p>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                        {p.esperando_a || "Definir tarea."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* LISTADO GENERAL */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Database className="text-blue-500" size={18} />
            <h2 className="text-sm font-bold uppercase tracking-tight text-slate-400">Todos los Proyectos</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {proyectos.map(p => (
              <div 
                key={p.id} 
                onClick={() => setProyectoEditando(p)}
                className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800 active:bg-slate-800 transition-colors"
              >
                <div>
                  <p className="text-sm font-bold">{p.nombre}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{p.categoria} • {p.deadline || 'S/D'}</p>
                </div>
                <ArrowRight size={16} className="text-slate-700" />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* NAV INFERIOR */}
      <nav className="fixed bottom-0 w-full bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 p-4 px-10 flex justify-between items-center z-30">
        <LayoutDashboard size={24} className="text-blue-400" />
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center -mt-12 shadow-2xl shadow-blue-500/40 border-4 border-slate-950 active:scale-90 transition-transform">
          <PlusCircle size={30} className="text-white" />
        </div>
        <BookOpen size={24} className="text-slate-500" />
      </nav>

      {/* MODAL DE REENTRADA */}
      {proyectoEditando && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-700 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">{proyectoEditando.nombre}</h2>
                <p className="text-xs text-slate-500 uppercase">Punto de Reentrada</p>
              </div>
              <button onClick={() => setProyectoEditando(null)} className="p-2 bg-slate-800 rounded-full text-slate-400">✕</button>
            </div>

            <form onSubmit={guardarReentrada} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em] ml-1">Último Bloqueo / Error</label>
                <textarea 
                  name="error"
                  defaultValue={proyectoEditando.estado_reentrada}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 mt-2 text-sm font-mono text-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none h-28 transition-all"
                  placeholder="Ej: Error de segmentación en el kernel CUDA..."
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] ml-1">Siguiente Paso Lógico</label>
                <textarea 
                  name="paso"
                  defaultValue={proyectoEditando.esperando_a}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 mt-2 text-sm text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none h-28 transition-all"
                  placeholder="Ej: Revisar la asignación de memoria..."
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/40 transition-all active:scale-95"
              >
                GUARDAR ESTADO
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;