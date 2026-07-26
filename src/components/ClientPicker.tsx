import React, { useState, useRef, useEffect } from 'react';
import { Client } from '../types';
import { Search, X } from 'lucide-react';

interface ClientPickerProps {
  clients: Client[];
  value: string;
  onChange: (nombre: string) => void;
  placeholder?: string;
}

/**
 * Selector de cliente con lupa de búsqueda: filtra por las primeras letras
 * (prioridad a los que EMPIEZAN con lo escrito, luego los que lo contienen).
 * Reemplaza al datalist/select nativo, incómodo con listas largas en táctiles.
 */
export const ClientPicker: React.FC<ClientPickerProps> = ({
  clients,
  value,
  onChange,
  placeholder = 'Escriba para buscar el cliente...',
}) => {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Cerrar al tocar fuera del componente
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  const q = term.trim().toLowerCase();
  const startsWith = clients.filter((c) => c.nombre.toLowerCase().startsWith(q));
  const contains = q
    ? clients.filter((c) => !c.nombre.toLowerCase().startsWith(q) && c.nombre.toLowerCase().includes(q))
    : [];
  const filtered = [...startsWith, ...contains].slice(0, 60);

  const selectClient = (nombre: string) => {
    onChange(nombre);
    setTerm('');
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Campo visible: valor seleccionado o buscador activo */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={open ? term : value}
          placeholder={value || placeholder}
          onFocus={() => {
            setTerm('');
            setOpen(true);
          }}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-8 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        />
        {value && !open && (
          <button
            type="button"
            onClick={() => onChange('')}
            title="Quitar cliente"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Lista desplegable filtrada */}
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto bg-slate-900 border border-slate-700 rounded-lg shadow-2xl">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-[11px] text-slate-500 italic">
              Sin coincidencias para "{term}". Puede escribir un cliente nuevo y usar ese nombre.
            </div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectClient(c.nombre);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-cyan-950/50 hover:text-cyan-300 border-b border-slate-800/60 last:border-b-0 cursor-pointer"
              >
                <span className="font-medium">{c.nombre}</span>
                <span className="block text-[9px] text-slate-500">{c.direccion}</span>
              </button>
            ))
          )}
          {term && filtered.length > 0 && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                selectClient(term.trim());
              }}
              className="w-full text-left px-3 py-2 text-[10px] text-cyan-400 hover:bg-slate-800 cursor-pointer"
            >
              Usar "{term.trim()}" como cliente
            </button>
          )}
        </div>
      )}
    </div>
  );
};
