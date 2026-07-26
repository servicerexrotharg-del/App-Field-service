import React, { useState } from 'react';
import { Client, ScheduledService, ScheduledTechnician, ServiceStatus } from '../types';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Save,
  X,
  BarChartHorizontal,
  LayoutGrid,
} from 'lucide-react';

interface CalendarViewProps {
  services: ScheduledService[];
  clients: Client[];
  onSaveService: (service: ScheduledService) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
}

// ===== Helpers de fechas (formato ISO YYYY-MM-DD, comparable como string) =====
const toISO = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Sigla por categoría de técnico: Especialista=E, Técnico=T, Ayudante=A
const siglaCategoria = (categoria: string): string => {
  const c = categoria.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (c.includes('especialista')) return 'E';
  if (c.includes('ayudante')) return 'A';
  return 'T';
};

const siglasTecnicos = (tecnicos: ScheduledTechnician[]): string =>
  tecnicos
    .filter((t) => t.cantidad > 0)
    .map((t) => `${t.cantidad}${siglaCategoria(t.categoria)}`)
    .join('+') || '—';

// Colores por estado
const ESTADOS: ServiceStatus[] = ['Programado', 'Confirmado', 'Completado', 'Cancelado'];
const ESTADO_STYLE: Record<string, { dot: string; chip: string; bar: string }> = {
  Programado: {
    dot: 'bg-cyan-400',
    chip: 'bg-cyan-950/70 border-cyan-700/60 text-cyan-200',
    bar: 'bg-cyan-600/80 border border-cyan-400/50',
  },
  Confirmado: {
    dot: 'bg-emerald-400',
    chip: 'bg-emerald-950/70 border-emerald-700/60 text-emerald-200',
    bar: 'bg-emerald-600/80 border border-emerald-400/50',
  },
  Completado: {
    dot: 'bg-indigo-400',
    chip: 'bg-indigo-950/70 border-indigo-700/60 text-indigo-200',
    bar: 'bg-indigo-600/80 border border-indigo-400/50',
  },
  Cancelado: {
    dot: 'bg-rose-400',
    chip: 'bg-rose-950/70 border-rose-700/60 text-rose-300 line-through',
    bar: 'bg-rose-800/70 border border-rose-500/50',
  },
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  services,
  clients,
  onSaveService,
  onDeleteService,
}) => {
  const today = new Date();
  const todayISO = toISO(today);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-11
  const [viewMode, setViewMode] = useState<'calendario' | 'gantt'>('calendario');

  // ===== Estado del modal de alta/edición =====
  const [editing, setEditing] = useState<ScheduledService | null>(null);
  const [fCliente, setFCliente] = useState('');
  const [fMotivo, setFMotivo] = useState('');
  const [fInicio, setFInicio] = useState('');
  const [fFin, setFFin] = useState('');
  const [fEstado, setFEstado] = useState<ServiceStatus>('Programado');
  const [fTecnicos, setFTecnicos] = useState<ScheduledTechnician[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const openNew = (isoDate: string) => {
    setEditing({
      id: 'srv-' + Date.now(),
      fechaInicio: isoDate,
      fechaFin: isoDate,
      cliente: '',
      motivo: '',
      tecnicos: [],
      estado: 'Programado',
    });
    setFCliente('');
    setFMotivo('');
    setFInicio(isoDate);
    setFFin(isoDate);
    setFEstado('Programado');
    setFTecnicos([{ id: 'st-' + Date.now(), categoria: 'Especialista', cantidad: 1 }]);
  };

  const openEdit = (service: ScheduledService) => {
    setEditing(service);
    setFCliente(service.cliente);
    setFMotivo(service.motivo);
    setFInicio(service.fechaInicio);
    setFFin(service.fechaFin);
    setFEstado(service.estado);
    setFTecnicos(service.tecnicos.length > 0 ? service.tecnicos : []);
  };

  const closeModal = () => setEditing(null);

  const handleSave = async () => {
    if (!editing) return;
    if (!fCliente.trim()) {
      alert('Seleccione o escriba el cliente.');
      return;
    }
    if (!fInicio || !fFin) {
      alert('Complete las fechas de inicio y fin.');
      return;
    }
    const fin = fFin < fInicio ? fInicio : fFin;

    setIsSaving(true);
    try {
      await onSaveService({
        ...editing,
        cliente: fCliente.trim(),
        motivo: fMotivo.trim(),
        fechaInicio: fInicio,
        fechaFin: fin,
        estado: fEstado,
        tecnicos: fTecnicos.filter((t) => t.cantidad > 0),
      });
      setEditing(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    if (!confirm(`¿Eliminar el servicio agendado de ${editing.cliente || 'este cliente'}?`)) return;
    setIsSaving(true);
    try {
      await onDeleteService(editing.id);
      setEditing(null);
    } finally {
      setIsSaving(false);
    }
  };

  // ===== Navegación de mes =====
  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };
  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  // ===== Cálculo de la grilla mensual (semana inicia Lunes) =====
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // 0 = Lunes
  const monthStartISO = toISO(new Date(year, month, 1));
  const monthEndISO = toISO(new Date(year, month, daysInMonth));

  const servicesOnDay = (iso: string): ScheduledService[] =>
    services.filter((s) => s.fechaInicio <= iso && iso <= s.fechaFin);

  const servicesInMonth = services
    .filter((s) => s.fechaInicio <= monthEndISO && s.fechaFin >= monthStartISO)
    .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio));

  const cells: Array<{ day: number; iso: string } | null> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, iso: toISO(new Date(year, month, d)) });
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Encabezado con navegación de mes y alternador de vista */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100">Calendario de Servicios</h2>
            <p className="text-[11px] text-slate-400">
              Toque un día para agendar. Toque un servicio para editarlo o eliminarlo.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
              title="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-bold text-slate-100 min-w-[130px] text-center">
              {MESES[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
              title="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={goToday}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs cursor-pointer"
          >
            Hoy
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'calendario' ? 'gantt' : 'calendario')}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            {viewMode === 'calendario' ? (
              <>
                <BarChartHorizontal className="w-3.5 h-3.5" />
                <span>Ver Gantt</span>
              </>
            ) : (
              <>
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Ver Calendario</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Leyenda de estados */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
        {ESTADOS.map((e) => (
          <span key={e} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${ESTADO_STYLE[e].dot}`}></span>
            {e}
          </span>
        ))}
      </div>

      {viewMode === 'calendario' ? (
        /* ===================== VISTA CALENDARIO ===================== */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950">
            {DIAS_SEMANA.map((d) => (
              <div
                key={d}
                className="p-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {cells.map((cell, idx) => {
              if (!cell) {
                return <div key={`blank-${idx}`} className="min-h-[84px] border-b border-r border-slate-800/60 bg-slate-950/40" />;
              }
              const dayServices = servicesOnDay(cell.iso);
              const isToday = cell.iso === todayISO;
              return (
                <div
                  key={cell.iso}
                  onClick={() => openNew(cell.iso)}
                  className={`min-h-[84px] border-b border-r border-slate-800/60 p-1 cursor-pointer transition-colors hover:bg-slate-800/40 ${
                    isToday ? 'bg-cyan-950/30' : ''
                  }`}
                  title="Agendar servicio en este día"
                >
                  <div
                    className={`text-[10px] font-bold mb-1 px-1 ${
                      isToday
                        ? 'text-cyan-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {cell.day}
                    {isToday && <span className="ml-1 text-[8px] font-normal text-cyan-400">HOY</span>}
                  </div>

                  <div className="space-y-0.5">
                    {dayServices.slice(0, 3).map((s) => (
                      <button
                        key={s.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(s);
                        }}
                        title={`${s.cliente} · ${s.motivo || 'Sin motivo'} · ${siglasTecnicos(s.tecnicos)} · ${s.estado}`}
                        className={`w-full text-left px-1 py-0.5 rounded border text-[8px] sm:text-[9px] font-semibold truncate cursor-pointer ${ESTADO_STYLE[s.estado]?.chip || ESTADO_STYLE.Programado.chip}`}
                      >
                        {s.cliente} · {siglasTecnicos(s.tecnicos)}
                      </button>
                    ))}
                    {dayServices.length > 3 && (
                      <div className="text-[8px] text-slate-500 px-1">+{dayServices.length - 3} más…</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ===================== VISTA GANTT ===================== */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto">
          {servicesInMonth.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">
              No hay servicios agendados en {MESES[month]} {year}. Vuelva a la vista Calendario y toque un día para agendar.
            </p>
          ) : (
            <div style={{ minWidth: `${180 + daysInMonth * 26}px` }}>
              {/* Encabezado de días */}
              <div className="flex border-b border-slate-800 pb-1 mb-2">
                <div className="w-[180px] shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">
                  Servicio
                </div>
                <div
                  className="flex-1 grid"
                  style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const iso = toISO(new Date(year, month, i + 1));
                    return (
                      <div
                        key={i}
                        className={`text-center text-[9px] font-mono ${
                          iso === todayISO ? 'text-cyan-300 font-bold' : 'text-slate-500'
                        }`}
                      >
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Filas de servicios */}
              <div className="space-y-1.5">
                {servicesInMonth.map((s) => {
                  const startDay = s.fechaInicio < monthStartISO ? 1 : parseInt(s.fechaInicio.slice(8), 10);
                  const endDay = s.fechaFin > monthEndISO ? daysInMonth : parseInt(s.fechaFin.slice(8), 10);
                  return (
                    <div key={s.id} className="flex items-center">
                      <div className="w-[180px] shrink-0 px-2">
                        <div className="text-[10px] font-bold text-slate-200 truncate">{s.cliente}</div>
                        <div className="text-[9px] text-slate-500 font-mono">{siglasTecnicos(s.tecnicos)}</div>
                      </div>
                      <div
                        className="flex-1 grid items-center h-7"
                        style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))` }}
                      >
                        <button
                          onClick={() => openEdit(s)}
                          title={`${s.cliente} · ${s.motivo || 'Sin motivo'} · ${s.fechaInicio} → ${s.fechaFin} · ${s.estado}`}
                          style={{ gridColumn: `${startDay} / ${endDay + 1}` }}
                          className={`h-5 rounded px-1.5 text-[8px] font-semibold text-white truncate text-left cursor-pointer hover:brightness-110 transition-all ${ESTADO_STYLE[s.estado]?.bar || ESTADO_STYLE.Programado.bar}`}
                        >
                          {s.motivo || s.estado}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== MODAL ALTA / EDICIÓN ===================== */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                {services.some((s) => s.id === editing.id) ? 'Editar Servicio Agendado' : 'Agendar Servicio'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Cliente con autocompletado sobre la base de clientes */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Cliente</label>
                <input
                  type="text"
                  list="calendar-clients-list"
                  value={fCliente}
                  onChange={(e) => setFCliente(e.target.value)}
                  placeholder="Escriba para buscar el cliente..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <datalist id="calendar-clients-list">
                  {clients.map((c) => (
                    <option key={c.id} value={c.nombre} />
                  ))}
                </datalist>
              </div>

              {/* Motivo */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Motivo del Servicio</label>
                <textarea
                  value={fMotivo}
                  onChange={(e) => setFMotivo(e.target.value)}
                  rows={2}
                  placeholder="Ej: Reparación bomba A10VSO, puesta en marcha, mantenimiento preventivo..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Fechas y estado */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Fecha Inicio</label>
                  <input
                    type="date"
                    value={fInicio}
                    onChange={(e) => {
                      setFInicio(e.target.value);
                      if (fFin < e.target.value) setFFin(e.target.value);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Fecha Fin</label>
                  <input
                    type="date"
                    value={fFin}
                    min={fInicio}
                    onChange={(e) => setFFin(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Estado</label>
                  <select
                    value={fEstado}
                    onChange={(e) => setFEstado(e.target.value as ServiceStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 cursor-pointer"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Técnicos involucrados */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    Técnicos Involucrados
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFTecnicos([
                        ...fTecnicos,
                        { id: 'st-' + Date.now(), categoria: 'Técnico', cantidad: 1 },
                      ])
                    }
                    className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Agregar</span>
                  </button>
                </div>

                {fTecnicos.length === 0 && (
                  <p className="text-[10px] text-slate-500 italic">Sin técnicos asignados.</p>
                )}

                {fTecnicos.map((t, idx) => (
                  <div key={t.id} className="grid grid-cols-12 gap-2 items-center">
                    <select
                      value={t.categoria}
                      onChange={(e) => {
                        const copy = [...fTecnicos];
                        copy[idx] = { ...t, categoria: e.target.value };
                        setFTecnicos(copy);
                      }}
                      className="col-span-6 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 cursor-pointer"
                    >
                      <option value="Especialista">Especialista (E)</option>
                      <option value="Técnico">Técnico (T)</option>
                      <option value="Ayudante">Ayudante (A)</option>
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={t.cantidad}
                      onChange={(e) => {
                        const copy = [...fTecnicos];
                        copy[idx] = { ...t, cantidad: Math.max(1, parseInt(e.target.value, 10) || 1) };
                        setFTecnicos(copy);
                      }}
                      className="col-span-4 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => setFTecnicos(fTecnicos.filter((x) => x.id !== t.id))}
                      className="col-span-2 flex justify-center text-rose-400 hover:text-rose-300 cursor-pointer"
                      title="Quitar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <p className="text-[9px] text-slate-500">
                  Resumen: <span className="font-mono text-cyan-400">{siglasTecnicos(fTecnicos)}</span>
                </p>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-between items-center gap-2 p-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
              {services.some((s) => s.id === editing.id) ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="px-3 py-2 bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar Servicio'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
