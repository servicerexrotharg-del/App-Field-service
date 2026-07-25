import React, { useState } from 'react';
import { Client } from '../types';
import { Plus, Edit, Trash2, Building, MapPin, Hash, Save, X } from 'lucide-react';

interface ClientsViewProps {
  clients: Client[];
  onSaveClient: (client: Client) => Promise<void>;
  onDeleteClient: (id: string) => Promise<void>;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ clients, onSaveClient, onDeleteClient }) => {
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [identificacion, setIdentificacion] = useState('');
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');

  const handleOpenNew = () => {
    setEditingClient({
      id: 'cli-' + Date.now(),
      identificacion: '',
      nombre: '',
      direccion: '',
    });
    setIdentificacion('');
    setNombre('');
    setDireccion('');
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setIdentificacion(client.identificacion);
    setNombre(client.nombre);
    setDireccion(client.direccion);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    const updated: Client = {
      ...editingClient,
      identificacion,
      nombre,
      direccion,
    };

    await onSaveClient(updated);
    setEditingClient(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-cyan-400" />
            Gestión de Clientes
          </h2>
          <p className="text-xs text-slate-400">
            Cargue y edite la información de clientes corporativos y sus plantas.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Cliente</span>
        </button>
      </div>

      {/* Editing Modal or Card */}
      {editingClient && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-cyan-500/40 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold uppercase text-cyan-400 tracking-wider">
              {editingClient.nombre ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h3>
            <button
              type="button"
              onClick={() => setEditingClient(null)}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Nº Identificación / CUIT</label>
              <input
                type="text"
                required
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
                placeholder="30-50000000-1"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Nombre / Razón Social</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del Cliente"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Dirección Planta / Sede</label>
              <input
                type="text"
                required
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Dirección completa"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingClient(null)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded text-xs flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Cliente</span>
            </button>
          </div>
        </form>
      )}

      {/* Clients Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <th className="p-3.5 font-bold">Identificación</th>
              <th className="p-3.5 font-bold">Razón Social</th>
              <th className="p-3.5 font-bold">Dirección</th>
              <th className="p-3.5 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-800/40">
                <td className="p-3.5 font-mono text-cyan-400">{client.identificacion}</td>
                <td className="p-3.5 font-semibold text-slate-200">{client.nombre}</td>
                <td className="p-3.5 text-slate-400">{client.direccion}</td>
                <td className="p-3.5 text-right space-x-1">
                  <button
                    onClick={() => handleOpenEdit(client)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded cursor-pointer border border-slate-700"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar cliente ${client.nombre}?`)) {
                        onDeleteClient(client.id);
                      }
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded cursor-pointer border border-slate-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
