import React, { useState } from 'react';
import { Book, ChevronRight, Hash } from 'lucide-react';

const MATERIAS = ['Programación', 'Física', 'Mates'];

export default function Docencia() {
  const [materiaActual, setMateriaActual] = useState('Programación');

  return (
    <div className="p-4 bg-slate-950 min-h-screen pb-20">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-400">
        <Book size={24} /> Repositorio de Docencia
      </h2>

      {/* Selector de Materia */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {MATERIAS.map(m => (
          <button
            key={m}
            onClick={() => setMateriaActual(m)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              materiaActual === m 
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
              : 'bg-slate-800 text-slate-400'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Lista de Conceptos/Analogías */}
      <div className="space-y-3">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 uppercase">
              Analogía
            </span>
          </div>
          <p className="text-sm font-semibold">Punteros en C++ como Direcciones de Casa</p>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2">
            Explicar que la variable es la casa y el puntero es el papel con la dirección...
          </p>
        </div>
        
        {/* Aquí mapearíamos los datos de la DB filtrados por materiaActual */}
      </div>
    </div>
  );
}