import { useState, useEffect, useCallback, useMemo } from 'react';

export const useProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [tiposProyecto, setTiposProyecto] = useState([]); // Nueva: Categorías de proyectos
  const [analogias, setAnalogias] = useState([]);
  const [categoriasDocencia, setCategoriasDocencia] = useState([]); // Categorías de clases
  const [historial, setHistorial] = useState({ 
    proyectosCompletados: [], 
    proyectosEliminados: [], 
    tareasCompletadas: [], 
    tareasEliminadas: [] 
  });
  const [loading, setLoading] = useState(true);

  // --- CÁLCULO DE ESTADÍSTICAS (Actualizado con nivel de estrés) ---
  const stats = useMemo(() => {
    // 1. Tareas pendientes totales
    const tareasPendientes = proyectos.reduce((acc, p) => acc + (p.tareas?.length || 0), 0);

    // 2. Próximos vencimientos
    const proximosVencimientos = proyectos
      .filter(p => p.deadline)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 3);

    // 3. Salud de la Memoria (Reentrada)
    const conReentrada = proyectos.filter(p => p.estado_reentrada && p.estado_reentrada.trim() !== "").length;
    const ratioReentrada = proyectos.length > 0 ? Math.round((conReentrada / proyectos.length) * 100) : 0;

    // 4. Cálculo de Carga de Energía (Basado en el nivel_estres del tipo)
    let cargaTotal = 0;
    proyectos.forEach(p => {
      const tipo = tiposProyecto.find(t => t.id === p.tipo_id);
      const pesoBase = tipo ? tipo.nivel_estres * 10 : 10;
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
  }, [proyectos, historial, tiposProyecto]);

  // --- LÓGICA DE CARGA ---
  const fetchTodo = useCallback(async () => {
    if (!window.db) return;
    
    try {
      setLoading(true);

      // 1. Cargar Tipos de Proyecto (Categorías con estrés)
      const resTipos = await window.db.query("SELECT * FROM tipos_proyecto ORDER BY nombre ASC");
      setTiposProyecto(resTipos.values || []);

      // 2. Cargar Proyectos con su Tipo
      const resProyectos = await window.db.query(`
        SELECT p.*, t.nombre as tipo_nombre, t.nivel_estres 
        FROM proyectos p
        LEFT JOIN tipos_proyecto t ON p.tipo_id = t.id
        WHERE p.completado = 0 AND p.eliminado = 0 
        ORDER BY p.urgencia DESC
      `);
      
      const proyectosProcesados = await Promise.all((resProyectos.values || []).map(async (p) => {
        const tareasRes = await window.db.query(
          "SELECT * FROM tareas WHERE proyecto_id = ? AND eliminada = 0", 
          [p.id]
        );
        return { ...p, tareas: tareasRes.values || [] };
      }));
      setProyectos(proyectosProcesados);

      // 3. Docencia y sus Categorías
      const resAnalogias = await window.db.query(`
        SELECT d.*, c.nombre as categoria_nombre 
        FROM docencia d
        LEFT JOIN categorias_docencia c ON d.categoria_id = c.id
        ORDER BY d.id DESC
      `);
      setAnalogias(resAnalogias.values || []);

      const resCatsDoc = await window.db.query("SELECT * FROM categorias_docencia ORDER BY nombre ASC");
      setCategoriasDocencia(resCatsDoc.values || []);

      // 4. Historial
      const pComp = await window.db.query("SELECT * FROM proyectos WHERE completado = 1 AND eliminado = 0");
      const pElim = await window.db.query("SELECT * FROM proyectos WHERE eliminado = 1");
      const tComp = await window.db.query("SELECT * FROM tareas WHERE estado = 'Completada' AND eliminada = 0 ORDER BY id DESC LIMIT 50");
      const tElim = await window.db.query("SELECT * FROM tareas WHERE eliminada = 1 LIMIT 30");
      
      setHistorial({
        proyectosCompletados: pComp.values || [],
        proyectosEliminados: pElim.values || [],
        tareasCompletadas: tComp.values || [],
        tareasEliminadas: tElim.values || []
      });

    } catch (err) {
      console.error("❌ Error en fetchTodo:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodo();
  }, [fetchTodo]);

  const execute = async (query, params = []) => {
    try {
      await window.db.run(query, params);
      await fetchTodo(); 
    } catch (err) {
      console.error("❌ Error en execute:", err);
    }
  };

  // --- ACCIONES DE CATEGORÍAS (TIPOS) DE PROYECTO ---
  const agregarTipoProyecto = (nombre, estres) => 
    execute("INSERT INTO tipos_proyecto (nombre, nivel_estres) VALUES (?, ?)", [nombre, estres]);

  const eliminarTipoProyecto = (id) => 
    execute("DELETE FROM tipos_proyecto WHERE id = ?", [id]);

  const editarTipoProyecto = (id, nombre, estres) =>
    execute("UPDATE tipos_proyecto SET nombre = ?, nivel_estres = ? WHERE id = ?", [nombre, estres, id]);

  // --- ACCIONES DE PROYECTOS ---
  const agregarProyecto = (n, tipoId, d, u) => 
    execute("INSERT INTO proyectos (nombre, tipo_id, deadline, urgencia, completado, eliminado) VALUES (?, ?, ?, ?, 0, 0)", [n, tipoId, d, u]);

  const editarProyecto = (id, datos) => execute(
    `UPDATE proyectos SET nombre = ?, tipo_id = ?, deadline = ?, urgencia = ?, estado_reentrada = ?, esperando_a = ? WHERE id = ?`,
    [datos.nombre, datos.tipo_id, datos.deadline, datos.urgencia, datos.estado_reentrada, datos.esperando_a, id]
  );

  const completarProyecto = (id) => execute("UPDATE proyectos SET completado = 1 WHERE id = ?", [id]);
  const eliminarProyecto = (id) => execute("UPDATE proyectos SET eliminado = 1 WHERE id = ?", [id]);
  const reactivarProyecto = (id) => execute("UPDATE proyectos SET completado = 0, eliminado = 0 WHERE id = ?", [id]);
  const eliminarProyectoDefinitivo = (id) => execute("DELETE FROM proyectos WHERE id = ?", [id]);

  // --- ACCIONES DE TAREAS ---
  const agregarTarea = (pId, desc, f) => 
    execute("INSERT INTO tareas (proyecto_id, descripcion, fecha_objetivo, estado, eliminada) VALUES (?, ?, ?, 'En_espera', 0)", [pId, desc, f]);
  const completarTarea = (id) => execute("UPDATE tareas SET estado = 'Completada' WHERE id = ?", [id]);
  const eliminarTarea = (id) => execute("UPDATE tareas SET eliminada = 1 WHERE id = ?", [id]);
  const reactivarTarea = (id) => execute("UPDATE tareas SET estado = 'En_espera', eliminada = 0 WHERE id = ?", [id]);
  const editarTarea = (id, descripcion, fecha) => execute("UPDATE tareas SET descripcion = ?, fecha_objetivo = ? WHERE id = ?", [descripcion, fecha, id]);

  // --- ACCIONES DE DOCENCIA ---
  const agregarAnalogia = (titulo, contenido, catId) => execute("INSERT INTO docencia (titulo, contenido, categoria_id) VALUES (?, ?, ?)", [titulo, contenido, catId]);
  const eliminarAnalogia = (id) => execute("DELETE FROM docencia WHERE id = ?", [id]);
  const agregarCategoriaDocencia = (nombre) => execute("INSERT INTO categorias_docencia (nombre) VALUES (?)", [nombre]);
  const eliminarCategoriaDocencia = (id) => execute("DELETE FROM categorias_docencia WHERE id = ?", [id]);

  return { 
    proyectos, 
    tiposProyecto, // Nuevo
    analogias, 
    categoriasDocencia, 
    historial, 
    loading, 
    stats,
    agregarTipoProyecto,
    eliminarTipoProyecto,
    editarTipoProyecto,
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
    refresh: fetchTodo 
  };
};