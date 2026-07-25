import React from 'react';
import { Database, LogOut, Plus, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import { ViewTab } from '../types';

interface NavbarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onLogout: () => void;
  onExportExcel: () => void;
  hasSupabase: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onLogout,
  onExportExcel,
  hasSupabase,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
      {/* Brand Header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-100 leading-tight">
            Formulario de asistencia técnica
          </h1>
          <p className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">
            FR82155-4
          </p>
        </div>
      </div>

      {/* Supabase Status & Action Controls */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Supabase Status Pill */}
        <div
          title={hasSupabase ? 'Sincronizado con Supabase Database' : 'Almacenamiento Local Activo (Configurar Supabase)'}
          className="flex items-center gap-2 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-full text-xs"
        >
          <Database className={`w-3.5 h-3.5 ${hasSupabase ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="text-[11px] text-slate-300 font-medium">
            {hasSupabase ? 'Supabase Conectado' : 'Storage Local Sync'}
          </span>
          <span className={`w-2 h-2 rounded-full ${hasSupabase ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
        </div>

        {/* Quick Action: New Form */}
        <button
          onClick={() => onTabChange('nuevo_formulario')}
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nuevo Formulario</span>
        </button>

        {/* Quick Action: Export Excel */}
        <button
          onClick={onExportExcel}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Exportar Excel</span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          title="Cerrar Sesión"
          className="p-1.5 bg-slate-800 hover:bg-rose-900/60 hover:text-rose-300 text-slate-400 border border-slate-700 rounded-md transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
