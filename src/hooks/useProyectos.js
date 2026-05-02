import { useState, useEffect } from 'react';

export const useProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProyectos = async () => {
    if (!window.db) return;
    try {
      const res = await window.db.query("SELECT * FROM proyectos ORDER BY urgencia DESC");
      setProyectos(res.values || []);
    } catch (err) {
      console.error("Error cargando proyectos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProyectos();
  }, []);

  return { proyectos, loading, refresh: fetchProyectos };
};