import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { logSchema } from './schema';

const sqliteConnection = new SQLiteConnection(CapacitorSQLite);

export const initDeviceDatabase = async () => {
  try {
    const platform = Capacitor.getPlatform();
    
    // 1. Verificar si ya existe una conexión para evitar errores de duplicidad
    const isConn = await sqliteConnection.isConnection('cerebro_externo_db', false);
    
    let db;
    if (isConn.result) {
      db = await sqliteConnection.retrieveConnection('cerebro_externo_db', false);
    } else {
      db = await sqliteConnection.createConnection(
        'cerebro_externo_db',
        false, 
        'no-encryption',
        1, 
        false 
      );
    }

    await db.open();
    
    // 2. Ejecutar el esquema actualizado
    // Al usar CREATE TABLE IF NOT EXISTS en schema.js, no sobrescribirá datos existentes,
    // pero añadirá las tablas faltantes como 'docencia' o 'bitacora'.
    await db.execute(logSchema);
    
    // 3. Exportación global para acceso rápido desde hooks de edición (Puntos 6 y 7)
    window.db = db;
    
    console.log(`Base de Datos [${platform}] inicializada y sincronizada.`);
    return db;
  } catch (err) {
    console.error('Error crítico inicializando SQLite:', err);
    return null;
  }
};