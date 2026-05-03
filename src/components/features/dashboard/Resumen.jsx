import React from 'react';
import { BarChart3, Clock, Zap, BrainCircuit } from 'lucide-react';
import MetricCard from '../../ui/MetricCard';

const Resumen = ({ stats }) => {
  // Verificación de seguridad inicial
  if (!stats) return <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-24 animate-pulse bg-slate-900/20 rounded-3xl" />;

  // Obtenemos el primer vencimiento de forma segura
  const nextDeadline = stats.proximosVencimientos?.[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-top duration-700">
      
      <MetricCard 
        icon={BarChart3} 
        label="Carga Activa" 
        value={stats.totalProyectos || 0} 
        unit="Proyectos"
        colorClass="bg-blue-500/10 text-blue-400"
      />

      <MetricCard 
        icon={BrainCircuit} 
        label="Buffer Mental" 
        value={`${stats.ratioReentrada || 0}%`}
        colorClass="bg-orange-500/10 text-orange-400"
      >
        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
          <div 
            className="h-full bg-orange-500 transition-all duration-1000" 
            style={{ width: `${stats.ratioReentrada || 0}%` }} 
          />
        </div>
      </MetricCard>

      <MetricCard 
        icon={Zap} 
        label="Sprints (7d)" 
        value={stats.completadasSemana || 0} 
        unit="Hechas"
        colorClass="bg-emerald-500/10 text-emerald-400"
      />

      <MetricCard 
        icon={Clock} 
        label="Urgencia Máxima" 
        value={nextDeadline ? (nextDeadline.nombre.length > 12 ? nextDeadline.nombre.substring(0, 10) + '..' : nextDeadline.nombre) : 'N/A'}
        colorClass="bg-purple-500/10 text-purple-400"
      />
      
      {/* QUITAMOS DeadlineList de aquí para evitar duplicidad en los paneles */}
    </div>
  );
};

export default Resumen;