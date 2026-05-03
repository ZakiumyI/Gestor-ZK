import React from 'react';
import { CheckCircle, Archive, Trash2, XCircle } from 'lucide-react';
import HistorialRow from './HistorialRow';
import HistorialSection from './HistorialSection';

const Historial = ({ 
  historial = {}, // Default value para evitar que sea undefined
  onReactivarProyecto, 
  onReactivarTarea, 
  onEliminarProyectoDefinitivo 
}) => {
  
  // Extraemos las listas con blindaje total
  const {
    proyectosCompletados = [],
    tareasCompletadas = [],
    proyectosEliminados = [],
    tareasEliminadas = []
  } = historial ?? {}; // Si historial es null, usa objeto vacío

  return (
    <div className="space-y-10 pb-32 animate-in fade-in duration-700">
      
      {/* 1. PROYECTOS FINALIZADOS */}
      <HistorialSection 
        title="Proyectos Finalizados" 
        icon={CheckCircle} 
        colorClass="text-emerald-500"
        isEmpty={!proyectosCompletados.length}
        emptyMessage="No hay proyectos terminados."
      >
        {proyectosCompletados.map(p => (
          <HistorialRow 
            key={p.id} 
            nombre={p.nombre} 
            subtexto={p.categoria} 
            onRestore={() => onReactivarProyecto(p.id)} 
          />
        ))}
      </HistorialSection>

      {/* 2. LOG DE ÉXITO */}
      <HistorialSection 
        title="Log de Tareas Cumplidas" 
        icon={Archive} 
        colorClass="text-blue-400"
        isEmpty={!tareasCompletadas.length}
        emptyMessage="No hay tareas cumplidas recientemente."
      >
        {tareasCompletadas.map(t => (
          <HistorialRow 
            key={t.id} 
            nombre={t.descripcion} 
            isTask={true} 
            onRestore={() => onReactivarTarea(t.id)} 
          />
        ))}
      </HistorialSection>

      {/* 3. PAPELERA PROYECTOS */}
      <HistorialSection 
        title="Papelera de Proyectos" 
        icon={Trash2} 
        colorClass="text-orange-500"
        isEmpty={!proyectosEliminados.length}
        emptyMessage="Papelera de proyectos vacía."
      >
        <div className="opacity-80 grid gap-3">
          {proyectosEliminados.map(p => (
            <HistorialRow 
              key={p.id} 
              nombre={p.nombre} 
              subtexto="Proyecto Descartado" 
              onRestore={() => onReactivarProyecto(p.id)} 
              onDelete={() => onEliminarProyectoDefinitivo(p.id)}
            />
          ))}
        </div>
      </HistorialSection>

      {/* 4. PAPELERA TAREAS */}
      <HistorialSection 
        title="Tareas Eliminadas" 
        icon={XCircle} 
        colorClass="text-red-400/70"
        isEmpty={!tareasEliminadas.length}
        emptyMessage="No hay tareas en la papelera."
      >
        <div className="opacity-70 grid gap-3">
          {tareasEliminadas.map(t => (
            <HistorialRow 
              key={t.id} 
              nombre={t.descripcion} 
              isTask={true} 
              subtexto="Tarea Descartada"
              onRestore={() => onReactivarTarea(t.id)} 
            />
          ))}
        </div>
      </HistorialSection>
    </div>
  );
};

export default Historial;