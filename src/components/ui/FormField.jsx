import React from 'react';

const FormField = ({ label, icon: Icon, children }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase ml-1">
      {Icon && <Icon size={12} />} {label}
    </label>
    {children}
  </div>
);

export const inputClass = "w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 outline-none focus:border-blue-500 transition-colors";

export default FormField;