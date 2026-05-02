// src/database/seed.js
export const initialProjects = [
  { nombre: "Gestión ISW (U)", categoria: "U", urgencia: 5, deadline: "2026-06-15" },
  { nombre: "IA Lengua de Señas (Concurso)", categoria: "Investigación", urgencia: 4, deadline: "2026-07-20" },
  { nombre: "Linux / Paralelismo", categoria: "U", urgencia: 3, deadline: "2026-06-30" },
  { nombre: "SUPERBOX (CUDA)", categoria: "Investigación", urgencia: 5, deadline: "2026-06-05" },
  { nombre: "Landing Profe Inglés", categoria: "Freelance", urgencia: 2, deadline: "2026-05-20" },
  { nombre: "Traductor Excel->Word", categoria: "Personal", urgencia: 3, deadline: "2026-05-15" },
  { nombre: "Web Robótica UBB", categoria: "U", urgencia: 2, deadline: "2026-08-10" },
  { nombre: "Web Torneo Robótica", categoria: "Freelance", urgencia: 4, deadline: "2026-07-01" },
  { nombre: "ERP Grubb", categoria: "Investigación", urgencia: 3, deadline: "2026-09-30" },
  { nombre: "Clases C++/Física/Mates", categoria: "Docencia", urgencia: 3, deadline: "2026-12-31" }
];

export const seedDatabase = async (db) => {
  // Verificamos si ya existen proyectos para no duplicar cada vez que recargues
  const res = await db.query("SELECT COUNT(*) as count FROM proyectos");
  if (res.values[0].count === 0) {
    for (const p of initialProjects) {
      await db.run(
        `INSERT INTO proyectos (nombre, categoria, urgencia, deadline, progreso_manual) 
         VALUES (?, ?, ?, ?, 0)`,
        [p.nombre, p.categoria, p.urgencia, p.deadline]
      );
    }
    console.log("🚀 Proyectos iniciales sembrados con éxito.");
  }
};