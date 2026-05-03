import React from 'react';

const HistorialSection = ({ title, icon: Icon, colorClass, children, isEmpty, emptyMessage }) => (
  <section>
    <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${colorClass}`}>
      <Icon size={14} /> {title}
    </h3>
    <div className="grid gap-3">
      {!isEmpty ? children : (
        <p className="text-[10px] text-slate-600 italic">{emptyMessage}</p>
      )}
    </div>
  </section>
);

export default HistorialSection;