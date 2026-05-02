export const initialProjects = [
  { nombre: "Gestión ISW (U)", tipo: "Universidad", urgencia: 5, deadline: "2026-06-15", reentrada: "Modelado de base de datos pendiente", esperando_a: "Confirmación de requerimientos del grupo" },
  { nombre: "IA Lengua de Señas", tipo: "Investigación", urgencia: 4, deadline: "2026-07-20", reentrada: "Entrenando modelo MediaPipe", esperando_a: "Dataset de señas locales" },
  { nombre: "SUPERBOX (CUDA)", tipo: "Investigación", urgencia: 5, deadline: "2026-06-05", reentrada: "Error de memoria en kernel de traducción", esperando_a: "Feedback del profesor sobre optimización" },
  { nombre: "Linux / Paralelismo", tipo: "Universidad", urgencia: 3, deadline: "2026-06-30", reentrada: "Configurar clusters OpenMP", esperando_a: "Acceso al servidor de la U" },
  { nombre: "Landing Profe Inglés", tipo: "Freelance", urgencia: 2, deadline: "2026-05-20", reentrada: "Esperando assets de la profe", esperando_a: "Logos y textos finales" },
  { nombre: "Traductor Excel->Word", tipo: "Personal", urgencia: 3, deadline: "2026-05-15", reentrada: "Refactorizar parsing de celdas", esperando_a: "Pruebas de formato con polola" },
  { nombre: "Web Robótica UBB", tipo: "Universidad", urgencia: 2, deadline: "2026-08-10", reentrada: "Maquetación inicial", esperando_a: "Fotos del equipo Grubb" },
  { nombre: "Web Torneo Robótica", tipo: "Freelance", urgencia: 4, deadline: "2026-07-01", reentrada: "Setup de pasarela de pago", esperando_a: "API Keys del cliente" },
  { nombre: "ERP Grubb", tipo: "Investigación", urgencia: 3, deadline: "2026-09-30", reentrada: "Definiendo entidades RRHH", esperando_a: "Modelo Entidad-Relación final" },
  { nombre: "Clases C++/Física", tipo: "Docencia", urgencia: 3, deadline: "2026-12-31", reentrada: "Preparar guía de punteros", esperando_a: "Cronograma de la facultad" }
];

export const seedDatabase = async (db) => {
  try {
    // 0. MIGRACIÓN FORZADA: Asegurar que la columna tipo_id existe
    try {
      await db.run("ALTER TABLE proyectos ADD COLUMN tipo_id INTEGER");
    } catch (e) {
      // Ignorar si la columna ya existe
    }

    const res = await db.query("SELECT COUNT(*) as count FROM proyectos");
    const count = res.values[0].count;

    if (count === 0) {
      console.log("🌱 Sembrando base de datos relacional v2...");

      // 1. Sembrar Tipos de Proyecto (Categorías de Proyectos)
      const tiposProyecto = [
        { nombre: 'Universidad', estres: 4 },
        { nombre: 'Investigación', estres: 5 },
        { nombre: 'Freelance', estres: 3 },
        { nombre: 'Personal', estres: 2 },
        { nombre: 'Docencia', estres: 3 }
      ];
      
      const tipoMap = {};
      for (const t of tiposProyecto) {
        const result = await db.run(
          `INSERT INTO tipos_proyecto (nombre, nivel_estres) VALUES (?, ?)`,
          [t.nombre, t.estres]
        );
        tipoMap[t.nombre] = result.changes.lastId;
      }

      // 2. Sembrar Categorías de Docencia (Clases)
      const categoriasDocencia = ['Programación', 'Robótica', 'Algoritmos'];
      const catMap = {};

      for (const catName of categoriasDocencia) {
        const resultCat = await db.run(
          `INSERT INTO categorias_docencia (nombre) VALUES (?)`,
          [catName]
        );
        catMap[catName] = resultCat.changes.lastId;
      }

      // 3. Insertar Proyectos vinculados a tipos_proyecto
      for (const p of initialProjects) {
        const resultProj = await db.run(
          `INSERT INTO proyectos (nombre, tipo_id, urgencia, deadline, estado_reentrada, esperando_a, completado, eliminado) 
           VALUES (?, ?, ?, ?, ?, ?, 0, 0)`,
          [p.nombre, tipoMap[p.tipo], p.urgencia, p.deadline, p.reentrada, p.esperando_a]
        );

        const lastId = resultProj.changes.lastId;

        // Tarea inicial automática
        await db.run(
          `INSERT INTO tareas (proyecto_id, descripcion, fecha_objetivo, estado, eliminada) 
           VALUES (?, ?, ?, 'En_espera', 0)`,
          [lastId, `Fase inicial: Sincronizar contexto para ${p.nombre}`, p.deadline]
        );
      }

      // 4. Sembrar Analogías vinculadas a categorías de docencia
      const analogiasIniciales = [
        { titulo: "Punteros en C++", contenido: "Son como direcciones de casas; la casa es el dato, la dirección el puntero.", cat: "Programación" },
        { titulo: "Leyes de Newton en Robótica", contenido: "La inercia afecta al servomotor; el PID debe compensar la 'pereza' del metal.", cat: "Robótica" }
      ];

      for (const a of analogiasIniciales) {
        await db.run(
          `INSERT INTO docencia (titulo, contenido, categoria_id) VALUES (?, ?, ?)`,
          [a.titulo, a.contenido, catMap[a.cat]]
        );
      }

      console.log("🚀 Seed completado exitosamente.");
    } else {
      console.log(`ℹ️ La base de datos ya tiene ${count} proyectos.`);
    }
  } catch (error) {
    console.error("❌ Error en el seedDatabase:", error);
  }
};