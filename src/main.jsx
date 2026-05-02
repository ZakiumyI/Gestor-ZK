import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initDeviceDatabase } from './database/db'
import { seedDatabase } from './database/seed'

const Root = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      const db = await initDeviceDatabase();
      if (db) {
        await seedDatabase(db);
        // Guardamos la instancia de la DB globalmente para usarla en los hooks
        window.db = db; 
      }
      setIsReady(true);
    };
    setup();
  }, []);

  if (!isReady) return <div className="bg-slate-900 h-screen flex items-center justify-center text-white">Iniciando Cerebro...</div>;

  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);