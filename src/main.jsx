import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initDeviceDatabase } from './database/db'
import { seedDatabase } from './database/seed'

const Root = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const setup = async () => {
      let retryCount = 0;
      const maxRetries = 5;

      const attemptInit = async () => {
        try {
          const db = await initDeviceDatabase();
          
          if (db) {
            // Ejecutamos la semilla "silenciosa" (solo estructura base)
            await seedDatabase(db); 
            window.db = db;
            setIsReady(true);
          } else {
            throw new Error("La base de datos retornó null");
          }
        } catch (err) {
          console.error(`Intento ${retryCount + 1} fallido:`, err);
          
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(attemptInit, 500); // Reintenta en 500ms
          } else {
            setError("Error crítico: No se pudo conectar con el motor SQLite nativo.");
            setIsReady(true); // Para mostrar el mensaje de error en el render
          }
        }
      };

      attemptInit();
    };

    setup();
  }, []);

  // Pantalla de carga (Splash Screen de JS)
  if (!isReady) {
    return (
      <div className="bg-slate-950 h-screen flex items-center justify-center text-blue-400 p-6 text-center">
        <div className="flex flex-col gap-4 items-center">
          <div className="w-12 h-12 border-4 border-blue-400/20 border-t-blue-400 rounded-full animate-spin"></div>
          <div className="flex flex-col gap-1 font-mono uppercase tracking-[0.2em] text-xs">
            <span className="font-bold">Iniciando Sistema</span>
            <span className="opacity-50 text-[10px]">Cargando módulos nativos...</span>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de Error Crítico
  if (error) {
    return (
      <div className="bg-slate-950 h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full border border-red-900/50 bg-red-950/20 p-6 rounded-2xl text-center">
          <h2 className="text-red-400 font-bold mb-2 uppercase tracking-tighter">Fallo de Inicialización</h2>
          <p className="text-slate-400 text-sm font-mono mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs border border-red-500/30 transition-all"
          >
            REINTENTAR CONECTAR
          </button>
        </div>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

const container = document.getElementById('app');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<Root />);
}