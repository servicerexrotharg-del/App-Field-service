import React, { useState } from 'react';
import {
  CategoryOption,
  ServiceTypeOption,
  ContractOption,
  TechnicianRoleOption,
} from '../types';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
} from '../lib/supabase';
import { Settings, Database, Plus, Trash2, Save, CheckCircle2 } from 'lucide-react';

interface ConfigViewProps {
  categories: CategoryOption[];
  onSaveCategories: (cats: CategoryOption[]) => void;

  serviceTypes: ServiceTypeOption[];
  onSaveServiceTypes: (st: ServiceTypeOption[]) => void;

  contracts: ContractOption[];
  onSaveContracts: (c: ContractOption[]) => void;

  technicians: TechnicianRoleOption[];
  onSaveTechnicians: (t: TechnicianRoleOption[]) => void;
}

export const ConfigView: React.FC<ConfigViewProps> = ({
  categories,
  onSaveCategories,
  serviceTypes,
  onSaveServiceTypes,
  contracts,
  onSaveContracts,
  technicians,
  onSaveTechnicians,
}) => {
  // Supabase Config State
  const initialSupabaseCfg = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(initialSupabaseCfg.url);
  const [supabaseKey, setSupabaseKey] = useState(initialSupabaseCfg.key);
  const [dbSaveMsg, setDbSaveMsg] = useState<string | null>(null);

  // New Category Input
  const [newCat, setNewCat] = useState('');
  // New Service Type Input
  const [newStCode, setNewStCode] = useState('');
  const [newStName, setNewStName] = useState('');
  // New Contract Input
  const [newContractNum, setNewContractNum] = useState('');
  const [newContractDesc, setNewContractDesc] = useState('');
  // New Tech Role Input
  const [newTechRole, setNewTechRole] = useState('');

  const handleSaveDbConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseKey);
    setDbSaveMsg('Configuración de Supabase actualizada.');
    setTimeout(() => setDbSaveMsg(null), 3000);
  };

  // Add Category
  const handleAddCategory = () => {
    if (!newCat.trim()) return;
    const updated = [...categories, { id: 'cat-' + Date.now(), nombre: newCat.trim() }];
    onSaveCategories(updated);
    setNewCat('');
  };
  const handleRemoveCategory = (id: string) => {
    onSaveCategories(categories.filter((c) => c.id !== id));
  };

  // Add Service Type
  const handleAddServiceType = () => {
    if (!newStCode.trim() || !newStName.trim()) return;
    const updated = [
      ...serviceTypes,
      { id: 'st-' + Date.now(), codigo: newStCode.trim().toUpperCase(), nombre: newStName.trim() },
    ];
    onSaveServiceTypes(updated);
    setNewStCode('');
    setNewStName('');
  };
  const handleRemoveServiceType = (id: string) => {
    onSaveServiceTypes(serviceTypes.filter((st) => st.id !== id));
  };

  // Add Contract
  const handleAddContract = () => {
    if (!newContractNum.trim()) return;
    const updated = [
      ...contracts,
      {
        id: 'con-' + Date.now(),
        numero: newContractNum.trim(),
        descripcion: newContractDesc.trim(),
      },
    ];
    onSaveContracts(updated);
    setNewContractNum('');
    setNewContractDesc('');
  };
  const handleRemoveContract = (id: string) => {
    onSaveContracts(contracts.filter((c) => c.id !== id));
  };

  // Add Technician Role
  const handleAddTechnicianRole = () => {
    if (!newTechRole.trim()) return;
    const updated = [...technicians, { id: 'tech-' + Date.now(), nombre: newTechRole.trim() }];
    onSaveTechnicians(updated);
    setNewTechRole('');
  };
  const handleRemoveTechnicianRole = (id: string) => {
    onSaveTechnicians(technicians.filter((t) => t.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-4 h-4 text-cyan-400" />
          Configuración del Sistema & Tablas Maestras
        </h2>
        <p className="text-xs text-slate-400">
          Edite las categorías, tipos de servicio, contratos, roles técnicos y credenciales de Supabase.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supabase Connection Settings */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Conexión Base de Datos SUPABASE
            </h3>
          </div>

          <form onSubmit={handleSaveDbConfig} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">SUPABASE URL</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyz.supabase.co"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">SUPABASE ANON KEY</label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300"
                />
              </div>
            </div>

            {dbSaveMsg && (
              <div className="p-2.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{dbSaveMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Credenciales Supabase</span>
            </button>
          </form>
        </div>

        {/* Categorías */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 border-b border-slate-800 pb-2">
            Categorías
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nueva categoría..."
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
            />
            <button
              onClick={handleAddCategory}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            {categories.map((c) => (
              <div key={c.id} className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800 text-xs">
                <span className="text-slate-200 font-medium">{c.nombre}</span>
                <button onClick={() => handleRemoveCategory(c.id)} className="text-rose-400 hover:text-rose-300">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tipos de Servicio */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 border-b border-slate-800 pb-2">
            Tipos de Servicio
          </h3>

          <div className="grid grid-cols-12 gap-2">
            <input
              type="text"
              placeholder="Código (IH)"
              value={newStCode}
              onChange={(e) => setNewStCode(e.target.value)}
              className="col-span-3 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
            />
            <input
              type="text"
              placeholder="Nombre del servicio..."
              value={newStName}
              onChange={(e) => setNewStName(e.target.value)}
              className="col-span-7 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
            />
            <button
              onClick={handleAddServiceType}
              className="col-span-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            {serviceTypes.map((st) => (
              <div key={st.id} className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800 text-xs">
                <div>
                  <span className="font-mono text-cyan-400 font-bold mr-2">{st.codigo}</span>
                  <span className="text-slate-300">{st.nombre}</span>
                </div>
                <button onClick={() => handleRemoveServiceType(st.id)} className="text-rose-400 hover:text-rose-300">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Números de Contrato */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 border-b border-slate-800 pb-2">
            Números de Contratos
          </h3>

          <div className="grid grid-cols-12 gap-2">
            <input
              type="text"
              placeholder="Nº Contrato"
              value={newContractNum}
              onChange={(e) => setNewContractNum(e.target.value)}
              className="col-span-4 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
            />
            <input
              type="text"
              placeholder="Descripción / Cliente"
              value={newContractDesc}
              onChange={(e) => setNewContractDesc(e.target.value)}
              className="col-span-6 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
            />
            <button
              onClick={handleAddContract}
              className="col-span-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            {contracts.map((con) => (
              <div key={con.id} className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800 text-xs">
                <div>
                  <span className="font-mono text-cyan-400 font-bold mr-2">{con.numero}</span>
                  <span className="text-slate-300">{con.descripcion}</span>
                </div>
                <button onClick={() => handleRemoveContract(con.id)} className="text-rose-400 hover:text-rose-300">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Roles Técnicos */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 border-b border-slate-800 pb-2">
            Roles de Técnicos
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nuevo rol técnico..."
              value={newTechRole}
              onChange={(e) => setNewTechRole(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
            />
            <button
              onClick={handleAddTechnicianRole}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            {technicians.map((t) => (
              <div key={t.id} className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800 text-xs">
                <span className="text-slate-200 font-medium">{t.nombre}</span>
                <button onClick={() => handleRemoveTechnicianRole(t.id)} className="text-rose-400 hover:text-rose-300">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
