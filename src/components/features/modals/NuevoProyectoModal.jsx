import React from 'react';
import { Target, Calendar, Tag, AlertTriangle } from 'lucide-react';
import Modal from '../../ui/Modal';
import FormField, { inputClass } from '../../ui/FormField';

const NuevoProyectoModal = ({ isOpen, onClose, onGuardar, tiposProyecto }) => {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // El "Arquitecto" asegura la integridad de datos aquí
    onGuardar({
      nombre: formData.get('nombre'),
      tipo_id: parseInt(formData.get('tipo_id')), 
      deadline: formData.get('deadline'),
      urgencia: parseInt(formData.get('urgencia')),
      completado: 0
    });
    
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Nuevo Proyecto" 
      subtitle="Sincronizar nuevo hilo de trabajo"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <FormField label="Nombre del Proyecto" icon={Target}>
          <input required name="nombre" type="text" placeholder="Ej: Traducción CUDA Superbox" className={inputClass} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Hilo / Tipo" icon={Tag}>
            <select name="tipo_id" required className={`${inputClass} appearance-none`}>
              <option value="">Seleccionar...</option>
              {tiposProyecto.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre} (S:{tipo.nivel_estres})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Urgencia (1-5)" icon={AlertTriangle}>
            <input name="urgencia" type="number" min="1" max="5" defaultValue="3" className={inputClass.replace('focus:border-blue-500', 'focus:border-orange-500')} />
          </FormField>
        </div>

        <FormField label="Deadline Final" icon={Calendar}>
          <input name="deadline" type="date" required className={`${inputClass} focus:border-emerald-500 color-scheme-dark`} />
        </FormField>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 mt-2">
          INICIAR PROCESO
        </button>
      </form>
    </Modal>
  );
};

export default NuevoProyectoModal;