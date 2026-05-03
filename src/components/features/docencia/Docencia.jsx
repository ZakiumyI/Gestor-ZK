import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Settings2 } from 'lucide-react';
import AnalogiaCard from './AnalogiaCard';
import GestionCategorias from './GestionCategorias';
import FormAnalogia from './FormAnalogia';

const Docencia = ({ 
  analogias = [], 
  categoriasDocencia = [], 
  onAgregar, 
  onBorrar, 
  onAgregarCat, 
  onBorrarCat 
}) => {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [gestionandoCats, setGestionandoCats] = useState(false);

  // Filtrado seguro: Evita errores si campos son null o undefined
  const filtrados = useMemo(() => {
    const lista = Array.isArray(analogias) ? analogias : [];
    const q = busqueda.toLowerCase().trim();
    
    if (!q) return lista;

    return lista.filter(a => 
      (a.titulo?.toLowerCase() || "").includes(q) || 
      (a.contenido?.toLowerCase() || "").includes(q) ||
      (a.categoria_nombre?.toLowerCase() || "").includes(q)
    );
  }, [analogias, busqueda]);

  return (
    <div className="animate-in slide-in-from-right duration-500 pb-32 px-4 max-w-4xl mx-auto">
      
      {/* 1. BÚSQUEDA */}
      <div className="relative mb-8 mt-4 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Filtrar concepto o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-slate-900/80 border-2 border-slate-800 rounded-[1.5rem] py-4 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500/50 outline-none transition-all shadow-2xl"
        />
      </div>

      {/* 2. ACCIONES */}
      <div className="flex gap-2 mb-8">
        <button 
          onClick={() => {
            setMostrarForm(!mostrarForm);
            if (gestionandoCats) setGestionandoCats(false);
          }}
          className={`flex-1 py-5 border-2 border-dashed rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
            mostrarForm 
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
              : 'border-slate-800 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/40'
          }`}
        >
          {mostrarForm ? 'Cerrar Formulario' : '+ Nueva Analogía'}
        </button>
        
        <button 
          onClick={() => {
            setGestionandoCats(!gestionandoCats);
            if (mostrarForm) setMostrarForm(false);
          }}
          className={`px-6 rounded-[2rem] border-2 transition-all ${
            gestionandoCats 
              ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
              : 'border-slate-800 text-slate-500 hover:border-slate-700'
          }`}
        >
          <Settings2 size={18} />
        </button>
      </div>

      {/* 3. MODULOS DINÁMICOS */}
      <div className="space-y-6">
        {gestionandoCats && (
          <GestionCategorias 
            categorias={categoriasDocencia} 
            onAgregar={onAgregarCat} 
            onBorrar={onBorrarCat} 
          />
        )}

        {mostrarForm && (
          <FormAnalogia 
            categorias={categoriasDocencia} 
            onAgregar={onAgregar} 
            onClose={() => setMostrarForm(false)} 
          />
        )}
      </div>

      {/* 4. LISTADO */}
      <div className="space-y-4 mt-8">
        <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2 ml-4">
          Recursos Didácticos ({filtrados.length})
        </h3>
        
        {filtrados.map(a => (
          <AnalogiaCard 
            key={a.id} 
            analogia={a} 
            onBorrar={onBorrar} 
          />
        ))}
        
        {filtrados.length === 0 && (
          <div className="text-center py-20 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[2rem]">
            <BookOpen size={40} className="mx-auto text-slate-800 mb-4" />
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
              No hay registros en esta categoría
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Docencia;