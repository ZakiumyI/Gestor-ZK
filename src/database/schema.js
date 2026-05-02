// src/database/schema.js
export const logSchema = `
  CREATE TABLE IF NOT EXISTS proyectos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    categoria TEXT CHECK(categoria IN ('U', 'Freelance', 'Personal', 'Investigación', 'Docencia')),
    urgencia INTEGER DEFAULT 1,
    deadline TEXT,
    estado_reentrada TEXT,
    esperando_a TEXT,
    progreso_manual INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER,
    descripcion TEXT NOT NULL,
    urgencia INTEGER DEFAULT 1,
    fecha_objetivo TEXT,
    estado TEXT DEFAULT 'En_espera',
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS docencia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    materia TEXT,
    tipo TEXT,
    contenido TEXT,
    usado BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS bitacora (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER,
    fecha TEXT,
    logro TEXT,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id)
  );
`;