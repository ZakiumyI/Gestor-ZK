import React, { useState } from 'react';
import { Search, Lightbulb, Trash2, X, BookOpen, PlusCircle, Settings2 } from 'lucide-react';

const Docencia = ({ analogias, categoriasDocencia, onAgregar, onBorrar, onAgregarCat, onBorrarCat }) => {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [gestionandoCats, setGestionandoCats] = useState(false);
  const [nuevaCatNombre, setNuevaCatNombre] = useState("");
  
  // Inicializamos con el ID de la primera categoría disponible si existe
  const [nuevo, setNuevo] = useState({ 
    titulo: '', 
    contenido: '', 
    categoria_id: categoriasDocencia[0]?.id || null 
  });

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!nuevo.titulo || !nuevo.contenido || !nuevo.categoria_id) return;
    await onAgregar(nuevo.titulo, nuevo.contenido, nuevo.categoria_id);
    setNuevo({ titulo: '', contenido: '', categoria_id: categoriasDocencia[0]?.id || null });
    setMostrarForm(false);
  };

  const filtrados = analogias.filter(a => 
    a.titulo?.toLowerCase().includes(busqueda.toLowerCase()) || 
    a.contenido?.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.categoria_nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="animate-in slide-in-from-right duration-500 pb-32 px-4 max-w-4xl mx-auto">
      
      {/* BUSCADOR */}
      <div className="relative mb-8 mt-4 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Filtrar por concepto o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-slate-900/80 border-2 border-slate-800 rounded-[1.5rem] py-4 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-4 ring-emerald-500/10 transition-all shadow-2xl"
        />
      </div>

      <div className="flex gap-2 mb-8">
        {!mostrarForm && (
          <button 
            onClick={() => setMostrarForm(true)}
            className="flex-1 py-5 border-2 border-dashed border-slate-800 rounded-[2rem] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group"
          >
            <span className="group-hover:scale-110 inline-block transition-transform">+ Nueva Analogía</span>
          </button>
        )}
        
        <button 
          onClick={() => setGestionandoCats(!gestionandoCats)}
          className={`px-6 rounded-[2rem] border-2 transition-all ${gestionandoCats ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
        >
          <Settings2 size={18} />
        </button>
      </div>

      {/* GESTIÓN DE CATEGORÍAS (Persistente) */}
      {gestionandoCats && (
        <div className="mb-8 p-6 bg-slate-900/50 border-2 border-blue-500/30 rounded-[2rem] animate-in slide-in-from-top duration-300">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4">Gestionar Categorías</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {categoriasDocencia.map(cat => (
              <div key={cat.id} className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg group">
                <span className="text-[10px] text-slate-300 uppercase font-bold">{cat.nombre}</span>
                <button onClick={() => onBorrarCat(cat.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              value={nuevaCatNombre}
              onChange={e => setNuevaCatNombre(e.target.value)}
              placeholder="Nueva categoría..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500"
            />
            <button 
              onClick={() => { onAgregarCat(nuevaCatNombre); setNuevaCatNombre(""); }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl text-xs font-bold"
            >
              Añadir
            </button>
          </div>
        </div>
      )}
      
      {/* FORMULARIO DE ANALOGÍA */}
      {mostrarForm && (
        <div className="mb-8 bg-slate-900 border-2 border-emerald-500/30 p-6 rounded-[2rem] space-y-4 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
              <PlusCircle size={16} /> Recurso Didáctico
            </h3>
            <button onClick={() => setMostrarForm(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <input 
            placeholder="Concepto (ej: Punteros)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:border-emerald-500 outline-none"
            value={nuevo.titulo}
            onChange={e => setNuevo({...nuevo, titulo: e.target.value})}
          />
          
          <textarea 
            placeholder="Analogía para los alumnos..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white h-32 resize-none focus:border-emerald-500 outline-none"
            value={nuevo.contenido}
            onChange={e => setNuevo({...nuevo, contenido: e.target.value})}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categoriasDocencia.map(cat => (
              <button
                key={cat.id}
                onClick={() => setNuevo({...nuevo, categoria_id: cat.id})}
                className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition-all ${
                  nuevo.categoria_id === cat.id ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          <button onClick={handleGuardar} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl transition-all uppercase text-[10px] tracking-widest">
            Subir al Cerebro Docente
          </button>
        </div>
      )}

      {/* LISTA DE ANALOGÍAS */}
      <div className="space-y-4">
        {filtrados.map(a => (
          <div key={a.id} className="group bg-slate-900/60 border border-slate-800/50 p-6 rounded-[2rem] hover:border-emerald-500/30 transition-all shadow-lg">
            <div className="flex justify-between items-start mb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-yellow-500/10 rounded-lg">
                    <Lightbulb size={16} className="text-yellow-400" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-100">{a.titulo}</h3>
                </div>
                <span className="inline-block px-2 py-0.5 bg-slate-800 rounded text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">
                  {a.categoria_nombre || 'Sin Categoría'}
                </span>
              </div>
              <button 
                onClick={() => onBorrar(a.id)} 
                className="p-2 text-slate-700 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed italic pl-4 border-l-2 border-emerald-500/20 shadow-inner">
              "{a.contenido}"
            </p>
          </div>
        ))}
        
        {filtrados.length === 0 && (
          <div className="text-center py-20 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[2rem]">
            <BookOpen size={40} className="mx-auto text-slate-800 mb-4" />
            <p className="text-slate-600 text-xs font-mono uppercase tracking-widest">Memoria vacía</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Docencia;