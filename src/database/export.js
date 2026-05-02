import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Device } from '@capacitor/device';

export const exportDatabase = async () => {
  try {
    // Verificamos la instancia global de la base de datos
    if (!window.db) throw new Error("Base de datos no inicializada");

    // 1. Extraer toda la data con queries asíncronas
    const proyectos = await window.db.query("SELECT * FROM proyectos");
    const tareas = await window.db.query("SELECT * FROM tareas");
    const analogias = await window.db.query("SELECT * FROM docencia");
    const categorias = await window.db.query("SELECT * FROM categorias_docencia");

    const dataFull = {
      version: "2.0.26",
      exportDate: new Date().toISOString(),
      proyectos: proyectos.values || [],
      tareas: tareas.values || [],
      docencia: analogias.values || [],
      categorias_docencia: categorias.values || []
    };

    const fileName = `zakiumy_backup_${new Date().getTime()}.json`;
    const jsonString = JSON.stringify(dataFull); // Sin espacios para reducir peso en el envío

    // 2. Identificar plataforma
    const info = await Device.getInfo();

    if (info.platform === 'web') {
      // Flujo para Navegador (PC)
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // 3. Flujo Nativo (Android/iOS)
      
      // Escribimos el archivo en el directorio de Caché
      // IMPORTANTE: Aseguramos Encoding UTF8 para que el string se procese correctamente
      const result = await Filesystem.writeFile({
        path: fileName,
        data: jsonString,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
        recursive: true // Crea directorios si no existen
      });

      // Compartir vía Menú Nativo (Permite elegir WhatsApp)
      await Share.share({
        title: 'Respaldo Zakiumy OS',
        text: 'Archivo de recuperación de hilos de trabajo y analogías.',
        url: result.uri, // Usamos la URI generada por el Filesystem
        dialogTitle: 'Exportar respaldo a...',
      });
      
      // Opcional: Podrías limpiar el caché después de compartir, 
      // pero el SO suele encargarse de la carpeta Cache.
    }
  } catch (error) {
    console.error("Fallo en el motor de exportación:", error);
    alert("Error de Sincronización: " + error.message);
  }
};