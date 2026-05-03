import React, { useState, useMemo } from 'react';
import { Share2, Plus } from 'lucide-react';
import { useProyectos } from './hooks/useProyectos';
import { exportDatabase } from "./database/export";
import { calculateCognitiveLoad } from './utils/statsLogic';

// Layout & Features
import Dashboard from './components/features/dashboard/Dashboard';
import Docencia from './components/features/docencia/Docencia';
import Navigation from './components/layout/Navigation';
import Historial from './components/features/historial/Historial';
import Configuracion from './components/Configuracion'; 

// Modales
import NuevaTareaModal from './components/features/modals/NuevaTareaModal';
import NuevoProyectoModal from './components/features/modals/NuevoProyectoModal';
import EditarProyectoModal from './components/features/modals/EditarProyectoModal';

function App() {
  const { 
    proyectos, tiposProyecto, analogias, categoriasDocencia, historial, 
    loading, stats, 
    agregarProyecto, completarProyecto, eliminarProyecto, 
    reactivarProyecto, eliminarProyectoDefinitivo, editarProyecto,
    agregarTarea, completarTarea, eliminarTarea, reactivarTarea, editarTarea,
    agregarAnalogia, borrarAnalogia, 
    agregarCategoriaDocencia, borrarCategoriaDocencia, 
    agregarTipoProyecto, eliminarTipoProyecto 
  } = useProyectos();

  const [proyectoEditando, setProyectoEditando] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTareaModalOpen, setIsTareaModalOpen] = useState(false);
  const [isProyectoModalOpen, setIsProyectoModalOpen] = useState(false);

  // MEMO: Cálculo seguro de carga cognitiva
  const nivelEnergia = useMemo(() => {
    if (!proyectos?.length || !tiposProyecto?.length) return 0;
    return calculateCognitiveLoad(proyectos, tiposProyecto);
  }, [proyectos, tiposProyecto]);

  // REFACTOR: Ahora la lógica de validación y captura vive en el Modal dentro de Configuracion
  const manejarAgregarTipo = async (nombre, estres) => {
    await agregarTipoProyecto(nombre, estres);
  };

  const manejarCompletarTareaConEstado = async (id) => {
    await completarTarea(id);
    if (proyectoEditando) {
      setProyectoEditando(prev => ({
        ...prev,
        tareas: prev.tareas?.map(t => t.id === id ? {...t, estado: 'Completada'} : t) || []
      }));
    }
  };

  if (loading) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center text-blue-400 font-mono tracking-widest uppercase animate-pulse">
      Syncing_Cortex_V3...
    </div>
  );

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      
      <header className="p-6 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md z-20 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
            GESTOR ZK
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-[0.2em] uppercase">Gestor de proyectos personales</p>
        </div>
        <button 
          onClick={exportDatabase} 
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white border border-transparent hover:border-slate-700"
        > 
          <Share2 size={18} /> 
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-48 custom-scrollbar">
        {activeTab === 'dashboard' && (
          <>
            {proyectos.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-800 rounded-3xl opacity-50">
                <Plus size={48} className="text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-slate-400">Sin Proyectos Activos</h3>
                <p className="text-slate-500 text-sm mb-6">¿Alguna nueva idea?<br></br> Inicia un nuevo módulo para trackear.</p>
                <button 
                  onClick={() => setIsProyectoModalOpen(true)}
                  className="bg-blue-600/20 text-blue-400 px-6 py-2 rounded-full border border-blue-500/30 hover:bg-blue-600/30 transition-all text-sm font-bold uppercase tracking-wider"
                >
                  Inicializar Proyecto
                </button>
              </div>
            ) : (
              <Dashboard 
                proyectos={proyectos} 
                tiposProyecto={tiposProyecto}
                stats={stats} 
                onProyectoClick={setProyectoEditando} 
                onNuevoProyecto={() => setIsProyectoModalOpen(true)} 
                onCompletarTarea={manejarCompletarTareaConEstado} 
              />
            )}
          </>
        )}
        
        {activeTab === 'docencia' && (
          <Docencia 
            analogias={analogias} 
            categoriasDocencia={categoriasDocencia}
            onAgregar={agregarAnalogia} 
            onBorrar={borrarAnalogia} 
            onAgregarCat={agregarCategoriaDocencia} 
            onBorrarCat={borrarCategoriaDocencia} 
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
          <Configuracion 
            nivelEnergia={nivelEnergia} 
            stats={stats} 
            tiposProyecto={tiposProyecto}
            onAgregarTipo={manejarAgregarTipo} 
            onEliminarTipo={eliminarTipoProyecto}
          />
        )}
      </main>

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
        onGuardar={async (t) => { 
          await agregarTarea(t.proyecto_id, t.descripcion, t.fecha_objetivo); 
          setIsTareaModalOpen(false); 
        }} 
      />
      
      <NuevoProyectoModal 
        isOpen={isProyectoModalOpen} 
        tiposProyecto={tiposProyecto}
        onClose={() => setIsProyectoModalOpen(false)} 
        onGuardar={async (p) => {
          await agregarProyecto(p.nombre, p.tipo_id, p.deadline, p.urgencia);
          setIsProyectoModalOpen(false);
        }} 
      />

      <EditarProyectoModal 
        proyecto={proyectoEditando} 
        tiposProyecto={tiposProyecto}
        onClose={() => setProyectoEditando(null)} 
        onGuardar={editarProyecto}
        onCompletar={completarProyecto} 
        onEliminar={eliminarProyecto}
        onEditarTarea={editarTarea} 
        onCompletarTarea={manejarCompletarTareaConEstado}
      />
    </div>
  );
}

export default App;