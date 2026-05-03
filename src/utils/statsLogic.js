export const calcularSistemaStats = (proyectos, historial, tiposProyecto) => {
  // 1. Tareas pendientes reales
  const tareasPendientes = proyectos.reduce((acc, p) => 
    acc + (p.tareas?.filter(t => t.estado !== 'Completada').length || 0), 0);

  // 2. Próximos vencimientos (Ordenados por fecha)
  const proximosVencimientos = proyectos
    .filter(p => p.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  // 3. Ratio de Reentrada (Salud mental/Memoria)
  const conReentrada = proyectos.filter(p => p.estado_reentrada?.trim()).length;
  const ratioReentrada = proyectos.length > 0 ? Math.round((conReentrada / proyectos.length) * 100) : 0;

  // 4. Algoritmo de Carga de Energía (Z-Factor)
  let cargaTotal = 0;
  proyectos.forEach(p => {
    const tipo = tiposProyecto.find(t => t.id === p.tipo_id);
    const pesoBase = tipo ? tipo.nivel_estres * 10 : 10;
    // Carga = (Estrés del tipo * 10) + (Urgencia manual * 5)
    cargaTotal += pesoBase + (p.urgencia * 5);
  });
  
  const nivelEnergia = Math.min(100, Math.round((cargaTotal / 250) * 100));

  return {
    totalProyectos: proyectos.length,
    tareasPendientes,
    proximosVencimientos,
    ratioReentrada,
    nivelEnergia,
    completadasSemana: historial.tareasCompletadas.length
  };
};

// Algoritmo de Carga Cognitiva V3
export const calculateEnergy = (proyectos, tiposProyecto) => {
  if (!proyectos || proyectos.length === 0) return 0;
  
  const ahora = new Date();
  let cargaAcumulada = 0;

  const getFactorTiempo = (fechaStr) => {
    if (!fechaStr) return 0.1;
    const deadline = new Date(fechaStr);
    const diffDias = (deadline - ahora) / (1000 * 60 * 60 * 24);
    
    if (diffDias < 0) return 1.3;  
    if (diffDias <= 3) return 1.0; 
    if (diffDias <= 14) return 0.6; 
    if (diffDias <= 30) return 0.3; 
    return 0.15;
  };

  proyectos.forEach(p => {
    const tipoInfo = tiposProyecto.find(t => t.id === p.tipo_id) || { nivel_estres: 2 };
    const factorProj = getFactorTiempo(p.deadline);
    const cargaContexto = (tipoInfo.nivel_estres * 15 + p.urgencia * 5) * factorProj;

    const tareasPendientes = p.tareas?.filter(t => t.estado !== 'Completada') || [];
    const cargaEjecucion = tareasPendientes.reduce((acc, t) => {
      const factorTarea = getFactorTiempo(t.fecha_objetivo);
      return acc + (t.urgencia || 3) * 12 * factorTarea;
    }, 0);

    const pesoTareas = tareasPendientes.length > 0 
      ? (cargaEjecucion / tareasPendientes.length) * Math.log10(tareasPendientes.length + 9) 
      : 0;

    cargaAcumulada += (cargaContexto * 0.40) + (pesoTareas * 0.60);
  });

  const TECHO_SATURACION = 750;
  return Math.min(100, Math.round((cargaAcumulada / TECHO_SATURACION) * 100));
};

// Helper para factor de tiempo (Decaimiento logarítmico)
export const getFactorTiempo = (fechaStr) => {
  if (!fechaStr) return 0.1;
  const ahora = new Date();
  const deadline = new Date(fechaStr);
  const diffDias = (deadline - ahora) / (1000 * 60 * 60 * 24);
  
  if (diffDias < 0) return 1.3;  // Penalización crítica por retraso
  if (diffDias <= 3) return 1.0; // Máxima presión
  if (diffDias <= 14) return 0.6; // Presión media
  if (diffDias <= 30) return 0.3; // Presión baja
  return 0.15;                   // Largo plazo
};

export const calculateCognitiveLoad = (proyectos, tiposProyecto) => {
  if (!proyectos || proyectos.length === 0) return 0;
  
  let cargaAcumulada = 0;

  proyectos.forEach(p => {
    // 1. NIVEL PROYECTO (40%)
    const tipoInfo = tiposProyecto.find(t => t.id === p.tipo_id) || { nivel_estres: 2 };
    const factorProj = getFactorTiempo(p.deadline);
    const cargaContexto = (tipoInfo.nivel_estres * 15 + p.urgencia * 5) * factorProj;

    // 2. NIVEL TAREAS (60%)
    const tareasPendientes = p.tareas?.filter(t => t.estado !== 'Completada') || [];
    const cargaEjecucion = tareasPendientes.reduce((acc, t) => {
      const factorTarea = getFactorTiempo(t.fecha_objetivo);
      return acc + (t.urgencia || 3) * 12 * factorTarea;
    }, 0);

    const pesoTareas = tareasPendientes.length > 0 
      ? (cargaEjecucion / tareasPendientes.length) * Math.log10(tareasPendientes.length + 9) 
      : 0;

    cargaAcumulada += (cargaContexto * 0.40) + (pesoTareas * 0.60);
  });

  const TECHO_SATURACION = 750; 
  return Math.min(100, Math.round((cargaAcumulada / TECHO_SATURACION) * 100));
};