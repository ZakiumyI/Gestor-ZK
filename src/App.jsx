import React, { useState, useMemo } from 'react';
import { 
  Share2, 
  Trash2, 
  CheckCircle2, 
  X, 
  Zap, 
  Activity
} from 'lucide-react';
import { useProyectos } from './hooks/useProyectos';
import { exportDatabase } from './database/export';

// Componentes
import Dashboard from './components/Dashboard';
import Docencia from './components/Docencia';
import Navigation from './components/Navigation';
import NuevaTareaModal from './components/NuevaTareaModal';
import NuevoProyectoModal from './components/NuevoProyectoModal';
import Historial from './components/Historial';
import Resumen from './components/Resumen';

function App() {
  const { 
    proyectos, 
    tiposProyecto, 
    analogias, 
    categoriasDocencia, 
    historial, 
    loading, 
    stats,
    agregarProyecto, 
    completarProyecto, 
    eliminarProyecto, 
    reactivarProyecto, 
    eliminarProyectoDefinitivo, 
    editarProyecto,
    agregarTarea, 
    completarTarea, 
    eliminarTarea, 
    reactivarTarea, 
    editarTarea,
    agregarAnalogia, 
    eliminarAnalogia, 
    agregarCategoriaDocencia, 
    eliminarCategoriaDocencia,
    agregarTipoProyecto,
    eliminarTipoProyecto 
  } = useProyectos();

  const [proyectoEditando, setProyectoEditando] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTareaModalOpen, setIsTareaModalOpen] = useState(false);
  const [isProyectoModalOpen, setIsProyectoModalOpen] = useState(false);

  // --- ALGORITMO DE CARGA COGNITIVA 60/40 (V3) ---
  const nivelEnergia = useMemo(() => {
    if (!proyectos || proyectos.length === 0) return 0;
    
    const ahora = new Date();
    let cargaAcumulada = 0;

    // Helper para factor de tiempo (Decaimiento logarítmico)
    const getFactorTiempo = (fechaStr) => {
      if (!fechaStr) return 0.1; // 1 año plazo por defecto
      const deadline = new Date(fechaStr);
      const diffDias = (deadline - ahora) / (1000 * 60 * 60 * 24);
      
      if (diffDias < 0) return 1.3;  // Penalización crítica por retraso
      if (diffDias <= 3) return 1.0; // Máxima presión (3 días)
      if (diffDias <= 14) return 0.6; // Presión media (2 semanas)
      if (diffDias <= 30) return 0.3; // Presión baja (Mes)
      return 0.15;                   // Largo plazo
    };

    proyectos.forEach(p => {
      // 1. NIVEL PROYECTO (40%) - Contexto
      const tipoInfo = tiposProyecto.find(t => t.id === p.tipo_id) || { nivel_estres: 2 };
      const factorProj = getFactorTiempo(p.deadline);
      const cargaContexto = (tipoInfo.nivel_estres * 15 + p.urgencia * 5) * factorProj;

      // 2. NIVEL TAREAS (60%) - Ejecución
      const tareasPendientes = p.tareas?.filter(t => t.estado !== 'Completada') || [];
      const cargaEjecucion = tareasPendientes.reduce((acc, t) => {
        const factorTarea = getFactorTiempo(t.fecha_objetivo);
        return acc + (t.urgencia || 3) * 12 * factorTarea;
      }, 0);

      // Si hay muchas tareas, el promedio evita que el estrés explote exponencialmente
      const pesoTareas = tareasPendientes.length > 0 
        ? (cargaEjecucion / tareasPendientes.length) * Math.log10(tareasPendientes.length + 9) 
        : 0;

      cargaAcumulada += (cargaContexto * 0.40) + (pesoTareas * 0.60);
    });

    const TECHO_SATURACION = 750; // Ajustado para un perfil de alto rendimiento (UBB/ISW/Grubb)
    return Math.min(100, Math.round((cargaAcumulada / TECHO_SATURACION) * 100));
  }, [proyectos, tiposProyecto]);

  // --- MANEJADORES ---
  const crearNuevoProyecto = async (datos) => {
    try {
      await agregarProyecto(datos.nombre, datos.tipo_id, datos.deadline, datos.urgencia);
      setIsProyectoModalOpen(false);
    } catch (error) { console.error("Error al crear proyecto:", error); }
  };

  const guardarCambiosProyecto = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await editarProyecto(proyectoEditando.id, {
        nombre: proyectoEditando.nombre,
        tipo_id: parseInt(formData.get('tipo_id')),
        deadline: formData.get('deadline'),
        urgencia: parseInt(formData.get('urgencia')),
        estado_reentrada: formData.get('estado_reentrada'),
        esperando_a: formData.get('esperando_a')
      });
      setProyectoEditando(null);
    } catch (error) { console.error("Error al sincronizar:", error); }
  };

  const manejarCompletarTarea = async (id) => {
    await completarTarea(id);
    if (proyectoEditando) {
      setProyectoEditando(prev => ({
        ...prev,
        tareas: prev.tareas?.map(t => t.id === id ? {...t, estado: 'Completada'} : t) || []
      }));
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-mono text-[10px] tracking-[0.2em] uppercase italic gap-4">
      <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 animate-pulse" />
      </div>
      Syncing_Cortex_V3...
    </div>
  );

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      
      {/* HEADER */}
      <header className="p-6 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md z-20 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
            ZAKIUMY OS
          </h1>
          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-1">
            {activeTab === 'dashboard' && 'Core_Processing // Proyectos Activos'}
            {activeTab === 'docencia' && 'Docencia // C++ & Robótica'}
            {activeTab === 'historial' && 'Archive // Log de Operaciones'}
            {activeTab === 'config' && 'System_Monitor // Energía'}
          </p>
        </div>
        <button onClick={exportDatabase} className="p-3 bg-slate-800/50 rounded-full text-blue-400 border border-slate-700 hover:bg-blue-600 hover:text-white transition-all">
          <Share2 size={18} />
        </button>
      </header>

      {/* CONTENIDO DINÁMICO */}
      <main className="flex-1 overflow-y-auto p-4 pb-48 custom-scrollbar">
        {activeTab === 'dashboard' && (
          <Dashboard 
            proyectos={proyectos} 
            tiposProyecto={tiposProyecto}
            onProyectoClick={setProyectoEditando} 
            onNuevoProyecto={() => setIsProyectoModalOpen(true)} 
            onCompletarTarea={manejarCompletarTarea} 
          />
        )}
        
        {activeTab === 'docencia' && (
          <Docencia 
            analogias={analogias}
            categoriasDocencia={categoriasDocencia}
            onAgregar={agregarAnalogia} 
            onBorrar={eliminarAnalogia}
            onAgregarCat={agregarCategoriaDocencia}
            onBorrarCat={eliminarCategoriaDocencia}
          />
        )}

        {activeTab === 'historial' && (
          <Historial 
            historial={historial} 
            onReactivarProyecto={reactivarProyecto} 
            onReactivarTarea={reactivarTarea} 
            onEliminarProyectoDefinitivo={eliminarProyectoDefinitivo} 
          />
        )}

        {activeTab === 'config' && (
          <div className="max-w-4xl mx-auto space-y-6 pt-4">
              <div className="flex flex-col gap-1 mb-4">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                  <Activity size={20} className="text-blue-500" /> Rendimiento Cognitivo
                </h2>
                <p className="text-xs text-slate-500 font-mono italic">Algoritmo 60/40 Ponderado por Deadline</p>
              </div>

              {/* STRESS METER */}
              <div className="bg-slate-900/60 p-7 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap size={150} className={nivelEnergia > 75 ? "text-orange-500" : "text-blue-500"} />
                </div>
                
                <div className="flex justify-between items-end mb-6 relative z-10">
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Carga Operativa (Estrés)</p>
                    <h3 className="text-5xl font-black text-white tracking-tighter italic">
                      {nivelEnergia}%
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Status</p>
                    <p className={`text-xs font-bold uppercase ${nivelEnergia > 80 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                      {nivelEnergia > 80 ? 'CRITICAL_OVERLOAD' : 'NOMINAL_STATE'}
                    </p>
                  </div>
                </div>
                
                <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5 relative z-10">
                  <div 
                    className={`h-full transition-all duration-[1500ms] ease-out rounded-full ${
                      nivelEnergia > 80 ? 'bg-gradient-to-r from-red-600 to-orange-600' : 
                      nivelEnergia > 45 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 
                      'bg-gradient-to-r from-emerald-500 to-teal-500'
                    }`}
                    style={{ width: `${nivelEnergia}%` }}
                  />
                </div>
              </div>

              <Resumen stats={stats} />

              {/* CRUD DE TIPOS */}
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem]">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Configuración de Hilos (40% Peso)</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {tiposProyecto.map(t => (
                     <div key={t.id} className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                       <div>
                         <p className="text-xs font-bold text-white">{t.nombre}</p>
                         <p className="text-[9px] text-slate-500 uppercase tracking-tighter font-mono">BASE_STRESS: {t.nivel_estres}</p>
                       </div>
                       <button onClick={() => eliminarTipoProyecto(t.id)} className="text-slate-600 hover:text-red-500 transition-colors">
                         <Trash2 size={16} />
                       </button>
                     </div>
                   ))}
                   <button 
                     onClick={() => {
                       const n = prompt("Nombre (ej: Freelance, UBB):");
                       const e = prompt("Nivel estrés (1-5):");
                       if(n && e) agregarTipoProyecto(n, parseInt(e));
                     }}
                     className="p-4 border border-dashed border-slate-700 rounded-2xl text-slate-500 text-xs font-bold hover:bg-slate-800 transition-all"
                   >
                     + Expandir Hilos
                   </button>
                 </div>
              </div>
          </div>
        )}
      </main>

      {/* NAVEGACIÓN */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onPlusClick={() => setIsTareaModalOpen(true)} 
      />

      {/* MODALES */}
      <NuevaTareaModal 
        isOpen={isTareaModalOpen} 
        onClose={() => setIsTareaModalOpen(false)} 
        proyectos={proyectos} 
        onGuardar={async (tarea) => {
          await agregarTarea(tarea.proyecto_id, tarea.descripcion, tarea.fecha_objetivo);
          setIsTareaModalOpen(false);
        }} 
      />
      
      <NuevoProyectoModal 
        isOpen={isProyectoModalOpen} 
        tiposProyecto={tiposProyecto}
        onClose={() => setIsProyectoModalOpen(false)} 
        onGuardar={crearNuevoProyecto} 
      />

      {/* MODAL EDITAR PROYECTO */}
      {proyectoEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-slate-900 w-full max-w-2xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/50">
              <div>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Protocolo_Reentrada</span>
                <h2 className="text-xl font-bold text-white tracking-tight">{proyectoEditando.nombre}</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { completarProyecto(proyectoEditando.id); setProyectoEditando(null); }} className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><CheckCircle2 size={20} /></button>
                <button onClick={() => { eliminarProyecto(proyectoEditando.id); setProyectoEditando(null); }} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20} /></button>
                <button onClick={() => setProyectoEditando(null)} className="p-2.5 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
              </div>
            </div>

            <div className="overflow-y-auto p-6 custom-scrollbar">
              <form onSubmit={guardarCambiosProyecto} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-orange-400 uppercase tracking-widest ml-2">Contexto de Re-reentrada</label>
                    <textarea 
                      name="estado_reentrada" 
                      defaultValue={proyectoEditando.estado_reentrada} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 mt-2 text-sm text-slate-300 h-32 resize-none focus:border-orange-500 outline-none transition-all font-mono" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest ml-2">Bloqueadores / Esperando</label>
                    <textarea 
                      name="esperando_a" 
                      defaultValue={proyectoEditando.esperando_a} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 mt-2 text-sm text-slate-300 h-32 resize-none focus:border-emerald-500 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-6 bg-slate-950/40 p-6 rounded-[2rem] border border-slate-800 shadow-lg">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-2 font-bold uppercase">Categoría de Hilo</label>
                    <select name="tipo_id" defaultValue={proyectoEditando.tipo_id} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none">
                      {tiposProyecto.map(t => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-2 font-bold uppercase">Deadline del Proyecto</label>
                    <input type="date" name="deadline" defaultValue={proyectoEditando.deadline} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-blue-400 font-mono outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-2 font-bold uppercase ml-1">Prioridad Estratégica (1-5)</label>
                    <input type="range" min="1" max="5" name="urgencia" defaultValue={proyectoEditando.urgencia} className="w-full h-1.5 bg-slate-800 rounded-lg accent-blue-500 cursor-pointer" />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 text-[10px] tracking-[0.2em] uppercase">
                    Sync_Configuration
                  </button>
                </div>

                <div className="col-span-full border-t border-slate-800 pt-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Hilos de Tareas Activas (60% Peso)</label>
                  <div className="space-y-3">
                    {proyectoEditando.tareas?.filter(t => t.estado !== 'Completada').map(t => (
                        <div key={t.id} className="flex items-center justify-between bg-slate-950/60 p-4 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all">
                          <input 
                            type="text" 
                            defaultValue={t.descripcion}
                            onBlur={(e) => editarTarea(t.id, e.target.value, t.fecha_objetivo)}
                            className="bg-transparent border-none text-xs text-slate-200 flex-1 outline-none font-medium"
                          />
                          <button type="button" onClick={() => manejarCompletarTarea(t.id)} className="text-slate-600 hover:text-emerald-500 transition-colors ml-4"><CheckCircle2 size={18} /></button>
                        </div>
                    ))}
                    {(!proyectoEditando.tareas || proyectoEditando.tareas.filter(t => t.estado !== 'Completada').length === 0) && (
                      <p className="text-[10px] text-slate-600 font-mono italic text-center py-4">No_Active_Tasks_In_Thread</p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;