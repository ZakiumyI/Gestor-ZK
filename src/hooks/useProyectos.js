import { useState, useEffect, useCallback, useMemo } from 'react';
import { calcularSistemaStats } from '../utils/statsLogic';

export const useProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [tiposProyecto, setTiposProyecto] = useState([]); // Para proyectos (ISW, UBB, etc.)
  const [categoriasDocencia, setCategoriasDocencia] = useState([]); // Para clases (Robótica, C++)
  const [analogias, setAnalogias] = useState([]); // Los registros de docencia
  const [historial, setHistorial] = useState({ 
    proyectosCompletados: [], tareasCompletadas: [] 
  });
  const [loading, setLoading] = useState(true);

  const fetchTodo = useCallback(async () => {
    if (!window.db) return;
    try {
      setLoading(true);
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

      // Updates de estado
      setTiposProyecto(resTipos.values || []);
      setCategoriasDocencia(resCatsDoc.values || []);
      setAnalogias(resDocencia.values || []);
      setProyectos(proyectosConTareas);
      setHistorial({ proyectosCompletados: pComp.values || [], tareasCompletadas: tComp.values || [] });
    } catch (err) {
      console.error("❌ DB_ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTodo(); }, [fetchTodo]);

  const execute = async (query, params = []) => {
    await window.db.run(query, params);
    await fetchTodo(); 
  };

  const stats = useMemo(() => 
    calcularSistemaStats(proyectos, historial, tiposProyecto), 
  [proyectos, historial, tiposProyecto]);

  return {
    proyectos, tiposProyecto, categoriasDocencia, analogias, loading, stats, historial,
    
    // Acciones de Proyectos
    agregarProyecto: (n, tid, d, u) => execute("INSERT INTO proyectos (nombre, tipo_id, deadline, urgencia) VALUES (?, ?, ?, ?)", [n, tid, d, u]),
    completarTarea: (id) => execute("UPDATE tareas SET estado = 'Completada' WHERE id = ?", [id]),
    
    // Acciones de Docencia (Lo que faltaba)
    agregarAnalogia: (titulo, contenido, catId) => 
      execute("INSERT INTO docencia (titulo, contenido, categoria_id) VALUES (?, ?, ?)", [titulo, contenido, catId]),
    borrarAnalogia: (id) => 
      execute("DELETE FROM docencia WHERE id = ?", [id]),
    agregarCategoriaDocencia: (nombre) => 
      execute("INSERT INTO categorias_docencia (nombre) VALUES (?)", [nombre]),
    borrarCategoriaDocencia: (id) => 
      execute("DELETE FROM categorias_docencia WHERE id = ?", [id]),
    
    refresh: fetchTodo 
  };
};