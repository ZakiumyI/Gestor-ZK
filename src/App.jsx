import React, { useState, useMemo } from 'react';
import { Share2 } from 'lucide-react';
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
    // CORRECCIÓN: Nombres sincronizados con el return del hook useProyectos
    agregarAnalogia, borrarAnalogia, 
    agregarCategoriaDocencia, borrarCategoriaDocencia, 
    agregarTipoProyecto, eliminarTipoProyecto 
  } = useProyectos();

  const [proyectoEditando, setProyectoEditando] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTareaModalOpen, setIsTareaModalOpen] = useState(false);
  const [isProyectoModalOpen, setIsProyectoModalOpen] = useState(false);

  const nivelEnergia = useMemo(() => 
    calculateCognitiveLoad(proyectos, tiposProyecto), 
  [proyectos, tiposProyecto]);

  const manejarAgregarTipo = () => {
    const n = prompt("Nombre (ej: Freelance, UBB, Grubb):");
    const e = prompt("Nivel estrés base (1-5):");
    if(n && e) agregarTipoProyecto(n, parseInt(e));
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
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
          ZAKIUMY OS
        </h1>
        <button onClick={exportDatabase} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"> 
          <Share2 size={18} /> 
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-48 custom-scrollbar">
        {activeTab === 'dashboard' && (
          <Dashboard 
            proyectos={proyectos} 
            tiposProyecto={tiposProyecto}
            stats={stats} 
            onProyectoClick={setProyectoEditando} 
            onNuevoProyecto={() => setIsProyectoModalOpen(true)} 
            onCompletarTarea={manejarCompletarTareaConEstado} 
          />
        )}
        
        {activeTab === 'docencia' && (
          <Docencia 
            analogias={analogias} 
            categoriasDocencia={categoriasDocencia}
            onAgregar={agregarAnalogia} 
            onBorrar={borrarAnalogia} // Antes decía eliminarAnalogia (causaba error)
            onAgregarCat={agregarCategoriaDocencia} 
            onBorrarCat={borrarCategoriaDocencia} // Antes decía eliminarCategoriaDocencia (causaba error)
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
        onGuardar={agregarProyecto} 
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