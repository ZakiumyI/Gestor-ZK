import React from 'react';
import { ClipboardList, Calendar, Layers } from 'lucide-react';
import Modal from '../../ui/Modal';
import FormField, { inputClass } from '../../ui/FormField';

const NuevaTareaModal = ({ isOpen, onClose, proyectos, onGuardar }) => {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Extracción limpia de datos
    onGuardar({
      proyecto_id: parseInt(formData.get('proyecto_id')),
      descripcion: formData.get('descripcion'),
      fecha_objetivo: formData.get('fecha_objetivo'),
      urgencia: parseInt(formData.get('urgencia')) || 1 // Valor por defecto para el algoritmo
    });

    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Nueva Tarea" 
      subtitle="Asignar paso táctico"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        
        <FormField label="Proyecto Destino" icon={Layers}>
          <select 
            required
            name="proyecto_id"
            className={`${inputClass} appearance-none`}
          >
            <option value="">Seleccionar proyecto...</option>
            {proyectos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </FormField>

        <FormField label="¿Qué hay que hacer?" icon={ClipboardList}>
          <input 
            required
            name="descripcion"
            type="text"
            placeholder="Ej: Terminar controlador de inventario"
            className={inputClass}
          />
        </FormField>

        <FormField label="Fecha Objetivo" icon={Calendar}>
          <input 
            name="fecha_objetivo"
            type="date"
            required
            className={`${inputClass} focus:border-emerald-500 color-scheme-dark`}
          />
        </FormField>

        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 mt-2"
        >
          AÑADIR TAREA
        </button>
      </form>
    </Modal>
  );
};

export default NuevaTareaModal;