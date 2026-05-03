import React from 'react';

const NavItem = ({ id, label, icon: Icon, activeTab, colorClass, bgClass, onClick, customIcon }) => {
  const isActive = activeTab === id;
  
  return (
    <button 
      onClick={() => onClick(id)}
      className={`flex-1 flex flex-col items-center gap-1.5 py-3 transition-all duration-300 ${
        isActive ? colorClass : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      <div className={`p-2 rounded-xl transition-colors ${isActive ? bgClass : ''}`}>
        {customIcon ? (
          <div className={`w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold ${isActive ? 'bg-amber-400 text-slate-950' : ''}`}>
            {customIcon}
          </div>
        ) : (
          <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
        )}
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.15em]">{label}</span>
    </button>
  );
};

export default NavItem;