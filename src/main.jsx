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
      try {
        const db = await initDeviceDatabase();
        if (db) {
          await seedDatabase(db);
          window.db = db; 
        }
      } catch (err) {
        console.error("Error inicializando la base de datos:", err);
        setError(err.message);
      } finally {
        setIsReady(true);
      }
    };
    setup();
  }, []);

  if (!isReady) {
    return (
      <div className="bg-slate-900 h-screen flex items-center justify-center text-white p-4 text-center">
        <div className="flex flex-col gap-2 text-sm">
          <div className="animate-pulse font-bold tracking-widest">INICIANDO CEREBRO...</div>
          {error && <p className="text-red-400 text-xs mt-2 font-mono">Error: {error}</p>}
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
} else {
  console.error("No se encontró el elemento con id 'app'.");
}