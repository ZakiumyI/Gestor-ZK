import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export const exportDatabase = async () => {
  try {
    // Nombre que le pusimos en initDeviceDatabase
    const dbName = 'cerebro_externo_db';
    
    if (Capacitor.getPlatform() === 'web') {
      console.warn("La exportación nativa solo funciona en Android/iOS.");
      return;
    }

    // Ruta donde Capacitor SQLite guarda las DBs por defecto
    const path = `../databases/${dbName}`;

    // Abrimos el menú nativo de compartir
    await Share.share({
      title: 'Respaldo Cerebro Externo',
      text: 'Archivo SQLite de mi Gestor de Proyectos',
      url: path, // En Android/iOS esto adjunta el archivo
      dialogTitle: '¿Dónde quieres guardar tu base de datos?',
    });

  } catch (error) {
    console.error("Error al exportar:", error);
    alert("No se pudo exportar la DB. Asegúrate de estar en un dispositivo móvil.");
  }
};