import { logSchema } from './schema'; // Asegúrate de que el nombre coincida

export const seedDatabase = async (db) => {
  try {
    console.log("🛠️ Iniciando secuencia de verificación de integridad...");

    // 1. Ejecutar el Schema (Crea las tablas si no existen)
    // Separamos por punto y coma para ejecutar cada sentencia individualmente
    const statements = logSchema.split(';').filter(s => s.trim());
    for (const statement of statements) {
      await db.run(statement);
    }

    // 2. Verificar si existen Tipos de Proyecto
    const resTipos = await db.query("SELECT COUNT(*) as count FROM tipos_proyecto");
    if (resTipos.values[0].count === 0) {
      console.log("🌱 Inicializando tipos de proyecto base...");
      // Insertamos uno genérico para que el Modal de Nuevo Proyecto tenga un ID que enviar
      await db.run("INSERT INTO tipos_proyecto (nombre, nivel_estres) VALUES (?, ?)", ['General', 3]);
      await db.run("INSERT INTO tipos_proyecto (nombre, nivel_estres) VALUES (?, ?)", ['Universidad', 5]);
    }

    // 3. Verificar si existen Categorías de Docencia
    const resCats = await db.query("SELECT COUNT(*) as count FROM categorias_docencia");
    if (resCats.values[0].count === 0) {
      console.log("🌱 Inicializando categorías de docencia base...");
      await db.run("INSERT INTO categorias_docencia (nombre) VALUES (?)", ['Programación']);
    }

    console.log("✅ Sistema Zakiumy OS inicializado y vacío.");
  } catch (error) {
    console.error("❌ Error crítico en seed.js:", error);
  }
};