/**
 * Lógica de Estrés ZAKIUMY OS - Regla 60/40
 * @param {Object} proyecto - Datos del proyecto
 * @param {Array} tiposProyecto - Catálogo de tipos para obtener el nivel_estres base
 */
export const calcularImpactoProyecto = (proyecto, tiposProyecto) => {
  const HOY = new Date();
  const UN_ANO_MS = 365 * 24 * 60 * 60 * 1000;
  
  // 1. Obtener Factor Temporal (0.1 a 1.0)
  const getFactorTiempo = (fechaStr) => {
    if (!fechaStr) return 0.1; // Si no hay fecha, impacto mínimo (1 año plazo)
    const deadline = new Date(fechaStr);
    const diffMs = deadline - HOY;
    if (diffMs <= 0) return 1.2; // Penalización por vencido
    
    const dias = diffMs / (1000 * 60 * 60 * 24);
    if (dias <= 7) return 1.0;  // Presión máxima esta semana
    if (dias <= 30) return 0.7; // Presión media este mes
    return 0.3;                 // Largo plazo
  };

  // 2. NIVEL PROYECTO (40%)
  const tipo = tiposProyecto.find(t => t.id === proyecto.tipo_id) || { nivel_estres: 2 };
  const cargaBase = tipo.nivel_estres * 20; // Escala 0-100
  const factorProj = getFactorTiempo(proyecto.deadline);
  const pesoProyecto = (cargaBase + (proyecto.urgencia * 10)) * factorProj;

  // 3. NIVEL TAREAS (60%)
  const tareasPendientes = proyecto.tareas?.filter(t => t.estado !== 'Completada') || [];
  const cargaTareas = tareasPendientes.reduce((acc, t) => {
    const factorTarea = getFactorTiempo(t.fecha_objetivo);
    return acc + (t.urgencia * 15 * factorTarea);
  }, 0);

  // 4. INTEGRACIÓN 60/40
  // Usamos un promedio para las tareas para que no explote si tienes 50 tareas pequeñas
  const promedioTareas = tareasPendientes.length > 0 ? cargaTareas / tareasPendientes.length : 0;
  
  return (pesoProyecto * 0.40) + (promedioTareas * 0.60);
};