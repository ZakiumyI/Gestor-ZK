import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, subtitle, children, size = 'md' }) => {
  if (!isOpen) return null;

  // Definición de anchos dinámicos para mantener la flexibilidad
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]'
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`bg-slate-900 w-full ${sizes[size]} rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden transition-all duration-300 scale-in-center`}
      >
        {/* Header del Modal */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight leading-none">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em] mt-2 italic opacity-80">
                {subtitle}
              </p>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 bg-slate-800/50 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenedor del Contenido */}
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;