import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { logSchema } from './schema';

const sqliteConnection = new SQLiteConnection(CapacitorSQLite);

export const initDeviceDatabase = async () => {
  try {
    const platform = Capacitor.getPlatform();
    
    // Crear la conexión
    const db = await sqliteConnection.createConnection(
      'cerebro_externo_db',
      false, // readonly
      'no-encryption',
      1, // version
      false // readonly
    );

    await db.open();
    
    // Ejecutar el esquema inicial
    await db.execute(logSchema);
    
    console.log('Base de Datos inicializada en:', platform);
    return db;
  } catch (err) {
    console.error('Error inicializando SQLite:', err);
    return null;
  }
};