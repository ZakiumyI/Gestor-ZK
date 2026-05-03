import React from 'react';

const MetricCard = ({ icon: Icon, label, value, unit, colorClass, children }) => (
  <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-[2rem] flex items-center gap-4">
    <div className={`p-3 rounded-2xl ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-xl font-bold text-white">
          {value} {unit && <span className="text-xs text-slate-500 font-normal">{unit}</span>}
        </p>
        {children}
      </div>
    </div>
  </div>
);

export default MetricCard;