import { useState, useEffect, useCallback, useMemo } from 'react';
import { calcularSistemaStats } from '../utils/statsLogic';

export const useProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [tiposProyecto, setTiposProyecto] = useState([]);
  const [categoriasDocencia, setCategoriasDocencia] = useState([]);
  const [analogias, setAnalogias] = useState([]);
  const [historial, setHistorial] = useState({ 
    proyectosCompletados: [], tareasCompletadas: [] 
  });
  const [loading, setLoading] = useState(true);

  const fetchTodo = useCallback(async () => {
    // Si la DB aún no está lista, no apagamos el loading, esperamos al siguiente ciclo
    if (!window.db) {
      console.log("⏳ Esperando conexión a DB...");
      return;
    }
    
    try {
      // No seteamos loading(true) aquí para evitar parpadeos en cada actualización (execute)
      const [resTipos, resProyectos, pComp, tComp, resCatsDoc, resDocencia] = await Promise.all([
        window.db.query("SELECT * FROM tipos_proyecto ORDER BY nombre ASC"),
        window.db.query("SELECT p.*, t.nombre as tipo_nombre, t.nivel_estres FROM proyectos p LEFT JOIN tipos_proyecto t ON p.tipo_id = t.id WHERE p.completado = 0 AND p.eliminado = 0 ORDER BY p.urgencia DESC"),
        window.db.query("SELECT * FROM proyectos WHERE completado = 1"),
        window.db.query("SELECT * FROM tareas WHERE estado = 'Completada' ORDER BY id DESC LIMIT 50"),
        window.db.query("SELECT * FROM categorias_docencia ORDER BY nombre ASC"),
        window.db.query("SELECT d.*, c.nombre as categoria_nombre FROM docencia d LEFT JOIN categorias_docencia c ON d.categoria_id = c.id ORDER BY d.created_at DESC")
      ]);

      const proyectosConTareas = await Promise.all((resProyectos.values || []).map(async (p) => {
        const tareasRes = await window.db.query("SELECT * FROM tareas WHERE proyecto_id = ? AND eliminada = 0", [p.id]);
        return { ...p, tareas: tareasRes.values || [] };
      }));

      setTiposProyecto(resTipos.values || []);
      setCategoriasDocencia(resCatsDoc.values || []);
      setAnalogias(resDocencia.values || []);
      setProyectos(proyectosConTareas);
      setHistorial({ 
        proyectosCompletados: pComp.values || [], 
        tareasCompletadas: tComp.values || [] 
      });
    } catch (err) {
      console.error("❌ DB_FETCH_ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // POLLING DE SEGURIDAD: Si window.db no existe al inicio, re-intentamos cada 500ms
  useEffect(() => {
    if (!window.db) {
      const interval = setInterval(() => {
        if (window.db) {
          fetchTodo();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    } else {
      fetchTodo();
    }
  }, [fetchTodo]);

  const execute = async (query, params = []) => {
    try {
      await window.db.run(query, params);
      await fetchTodo(); 
    } catch (err) {
      console.error("❌ EXECUTE_ERROR:", err);
    }
  };

  const stats = useMemo(() => 
    calcularSistemaStats(proyectos, historial, tiposProyecto), 
  [proyectos, historial, tiposProyecto]);

  return {
    proyectos, tiposProyecto, categoriasDocencia, analogias, loading, stats, historial,
    
    // --- ACCIONES DE PROYECTOS ---
    agregarProyecto: (n, tid, d, u) => 
      execute("INSERT INTO proyectos (nombre, tipo_id, deadline, urgencia, completado, eliminado) VALUES (?, ?, ?, ?, 0, 0)", [n, tid, d, u]),
    
    editarProyecto: (id, n, tid, d, u) =>
      execute("UPDATE proyectos SET nombre=?, tipo_id=?, deadline=?, urgencia=? WHERE id=?", [n, tid, d, u, id]),

    completarProyecto: (id) => 
      execute("UPDATE proyectos SET completado = 1 WHERE id = ?", [id]),

    eliminarProyecto: (id) => 
      execute("UPDATE proyectos SET eliminado = 1 WHERE id = ?", [id]),

    reactivarProyecto: (id) =>
      execute("UPDATE proyectos SET completado = 0, eliminado = 0 WHERE id = ?", [id]),

    eliminarProyectoDefinitivo: (id) =>
      execute("DELETE FROM proyectos WHERE id = ?", [id]),

    // --- ACCIONES DE TAREAS ---
    agregarTarea: (pid, desc, fecha) => 
      execute("INSERT INTO tareas (proyecto_id, descripcion, fecha_objetivo, estado, eliminada) VALUES (?, ?, ?, 'En_espera', 0)", [pid, desc, fecha]),

    completarTarea: (id) => 
      execute("UPDATE tareas SET estado = 'Completada' WHERE id = ?", [id]),

    eliminarTarea: (id) => 
      execute("UPDATE tareas SET eliminada = 1 WHERE id = ?", [id]),

    reactivarTarea: (id) =>
      execute("UPDATE tareas SET estado = 'En_espera', eliminada = 0 WHERE id = ?", [id]),

    editarTarea: (id, desc, fecha) =>
      execute("UPDATE tareas SET descripcion = ?, fecha_objetivo = ? WHERE id = ?", [desc, fecha, id]),

    // --- ACCIONES DE DOCENCIA ---
    agregarAnalogia: (titulo, contenido, catId) => 
      execute("INSERT INTO docencia (titulo, contenido, categoria_id) VALUES (?, ?, ?)", [titulo, contenido, catId]),
    
    borrarAnalogia: (id) => 
      execute("DELETE FROM docencia WHERE id = ?", [id]),

    agregarCategoriaDocencia: (nombre) => 
      execute("INSERT INTO categorias_docencia (nombre) VALUES (?)", [nombre]),

    borrarCategoriaDocencia: (id) => 
      execute("DELETE FROM categorias_docencia WHERE id = ?", [id]),

    // --- CONFIGURACIÓN ---
    agregarTipoProyecto: (nombre, estres) =>
      execute("INSERT INTO tipos_proyecto (nombre, nivel_estres) VALUES (?, ?)", [nombre, estres]),

    eliminarTipoProyecto: (id) =>
      execute("DELETE FROM tipos_proyecto WHERE id = ?", [id]),

    refresh: fetchTodo 
  };
};