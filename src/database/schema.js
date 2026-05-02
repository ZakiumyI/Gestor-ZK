export const logSchema = `
  -- Categorías para el área de Docencia (Clases C++, Robótica)
  CREATE TABLE IF NOT EXISTS categorias_docencia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
  );

  -- NUEVA: Categorías dinámicas para Proyectos (ISW, SUPERBOX, Freelance, etc.)
  CREATE TABLE IF NOT EXISTS tipos_proyecto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    nivel_estres INTEGER DEFAULT 1 -- Peso para el algoritmo de energía
  );

  CREATE TABLE IF NOT EXISTS proyectos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    tipo_id INTEGER, -- Ahora vinculado a la tabla tipos_proyecto
    urgencia INTEGER DEFAULT 1,
    deadline TEXT,
    estado_reentrada TEXT,
    esperando_a TEXT,
    progreso_manual INTEGER DEFAULT 0,
    completado INTEGER DEFAULT 0,
    eliminado INTEGER DEFAULT 0,
    FOREIGN KEY (tipo_id) REFERENCES tipos_proyecto(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER,
    descripcion TEXT NOT NULL,
    urgencia INTEGER DEFAULT 1,
    fecha_objetivo TEXT, 
    estado TEXT DEFAULT 'En_espera', 
    eliminada INTEGER DEFAULT 0,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS docencia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    categoria_id INTEGER, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias_docencia(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS bitacora (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER,
    fecha TEXT,
    logro TEXT,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
  );
`;