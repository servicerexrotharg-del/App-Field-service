import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  FilePlus,
  FileText,
  Users,
  Settings,
  ChevronRight,
  ChevronLeft,
  Shield,
} from 'lucide-react';
import { ViewTab } from '../types';

interface SidebarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  reportsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, reportsCount }) => {
  // Menú contraíble: en tablet/desktop se puede plegar a solo íconos
  // para ganar espacio de pantalla (especialmente útil en iPad).
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      id: 'dashboard' as ViewTab,
      label: 'Dashboard Insights',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'calendario' as ViewTab,
      label: 'Calendario de Servicios',
      icon: CalendarDays,
      badge: null,
    },
    {
      id: 'nuevo_formulario' as ViewTab,
      label: 'Nuevo Formulario',
      icon: FilePlus,
      badge: 'FR82155-4',
    },
    {
      id: 'listado_formularios' as ViewTab,
      label: 'Listado de Formularios',
      icon: FileText,
      badge: reportsCount.toString(),
    },
    {
      id: 'clientes' as ViewTab,
      label: 'Clientes',
      icon: Users,
      badge: null,
    },
    {
      id: 'configuracion' as ViewTab,
      label: 'Configuración & Tablas',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={`w-full ${collapsed ? 'md:w-16' : 'md:w-64'} bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 transition-all duration-200`}
    >
      <div className={`${collapsed ? 'p-2 md:px-2 md:py-4' : 'p-4'} space-y-6`}>
        <div>
          <div className={`hidden md:flex ${collapsed ? 'justify-center' : 'justify-end'} mb-2`}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'Expandir menú' : 'Contraer menú'}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 border border-slate-700 rounded-md transition-colors cursor-pointer"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
          <div className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 ${collapsed ? 'md:hidden' : ''}`}>
            Navegación Principal
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  title={item.label}
                  className={`w-full flex items-center ${collapsed ? 'md:justify-center md:px-0' : 'justify-between'} px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-600/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent'
                  }`}
                >
                  <div className={`flex items-center ${collapsed ? 'md:gap-0' : ''} gap-2.5`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className={collapsed ? 'md:hidden' : ''}>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] rounded-full font-mono ${collapsed ? 'md:hidden' : ''} ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Info Banner */}
        <div className={`p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1.5 ${collapsed ? 'md:hidden' : ''}`}>
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-cyan-400" />
              Acceso Activo
            </span>
            <span className="text-cyan-400 font-mono">v2.4.0</span>
          </div>
          <div className="text-[11px] font-bold text-slate-200">Usuario: fservice</div>
          <p className="text-[9px] text-slate-400 font-medium">
            Sistema web desarrollado por Walter Pereyra SVC 2026
          </p>
        </div>
      </div>
    </aside>
  );
};
