import React, { useState, useEffect, useRef } from 'react';
import { LOGO_BASE64 } from '../logo';
import {
  Client,
  CategoryOption,
  ServiceTypeOption,
  ContractOption,
  TechnicianRoleOption,
  FieldServiceReport,
  TechnicianAssignment,
  DayWorkLog,
  InstrumentItem,
  MaterialItem,
  PhotoItem,
} from '../types';
import { VoiceInputButton } from './VoiceInputButton';
import { SignatureCanvas } from './SignatureCanvas';
import { calculateReportHourBreakdown, formatHoursLabel } from '../lib/hoursCalculator';
import { generatePDFFromElement, generateCleanPDFReport } from '../lib/pdfGenerator';
import { getPendingSyncCount } from '../lib/supabase';
import {
  Save,
  Printer,
  Plus,
  Trash2,
  Camera,
  Upload,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface FormViewProps {
  clients: Client[];
  categories: CategoryOption[];
  serviceTypes: ServiceTypeOption[];
  contracts: ContractOption[];
  technicians: TechnicianRoleOption[];
  initialReport?: FieldServiceReport | null;
  onSaveReport: (report: FieldServiceReport) => Promise<void>;
  nextServiceNumber: string;
}

export const FormView: React.FC<FormViewProps> = ({
  clients,
  categories,
  serviceTypes,
  contracts,
  technicians,
  initialReport,
  onSaveReport,
  nextServiceNumber,
}) => {
  const formPrintRef = useRef<HTMLDivElement | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const [numeroServicio, setNumeroServicio] = useState(initialReport?.numeroServicio || nextServiceNumber);
  const [fecha, setFecha] = useState(initialReport?.fecha || todayStr);
  const [cliente, setCliente] = useState(initialReport?.cliente || (clients[0]?.nombre || ''));
  const [direccion, setDireccion] = useState(initialReport?.direccion || (clients[0]?.direccion || ''));
  const [tipoServicio, setTipoServicio] = useState(initialReport?.tipoServicio || 'IH');
  const [categoria, setCategoria] = useState(initialReport?.categoria || 'Servicio');
  const [numeroOrdenCompra, setNumeroOrdenCompra] = useState(initialReport?.numeroOrdenCompra || '');
  const [numeroContrato, setNumeroContrato] = useState(initialReport?.numeroContrato ?? '');
  const [numeroOrdenTrabajo, setNumeroOrdenTrabajo] = useState(initialReport?.numeroOrdenTrabajo || '');

  const [detalleProblema, setDetalleProblema] = useState(initialReport?.detalleProblema || '');

  // Technicians Assignment
  const [tecnicosInsumidos, setTecnicosInsumidos] = useState<TechnicianAssignment[]>(
    initialReport?.tecnicosInsumidos || [
      { id: 'tech-1', categoria: 'Especialista', cantidad: 1, fecha: todayStr },
      { id: 'tech-2', categoria: 'Técnico', cantidad: 1, fecha: todayStr },
    ]
  );

  // Work logs per day
  const [diasHorasConsumidas, setDiasHorasConsumidas] = useState<DayWorkLog[]>(
    initialReport?.diasHorasConsumidas || [
      {
        id: 'dh-1',
        fecha: todayStr,
        esFeriado: false,
        horaViaje: 2.0,
        horaIngreso: '07:00',
        horaEgreso: '18:00',
      },
    ]
  );

  const [tareasRealizadas, setTareasRealizadas] = useState(initialReport?.tareasRealizadas || '');
  const [recomendacionConclusion, setRecomendacionConclusion] = useState(initialReport?.recomendacionConclusion || '');

  // Dynamic tables
  const [instrumentos, setInstrumentos] = useState<InstrumentItem[]>(
    initialReport?.instrumentosUtilizados || [
      { id: 'i-1', cantidad: 1, descripcion: 'Manómetro digital Hydroclean' },
    ]
  );

  const [materiales, setMateriales] = useState<MaterialItem[]>(
    initialReport?.materialesUtilizados || [
      { id: 'm-1', cantidad: 1, codigoMNR: 'R901089221', descripcion: 'Juego de sellos Vitón' },
    ]
  );

  // Photo gallery (max 6)
  const [photos, setPhotos] = useState<PhotoItem[]>(initialReport?.registroFotografico || []);

  // Signatures
  const [firmaTecnico, setFirmaTecnico] = useState(initialReport?.firmas?.firmaTecnico || '');
  const [aclaracionTecnico, setAclaracionTecnico] = useState(initialReport?.firmas?.aclaracionTecnico || 'Técnico Responsable');
  const [firmaCliente, setFirmaCliente] = useState(initialReport?.firmas?.firmaCliente || '');
  const [aclaracionCliente, setAclaracionCliente] = useState(initialReport?.firmas?.aclaracionCliente || 'Supervisión de Mantenimiento');
  const [firmaSupervisor, setFirmaSupervisor] = useState(initialReport?.firmas?.firmaSupervisor || '');
  const [aclaracionSupervisor, setAclaracionSupervisor] = useState(initialReport?.firmas?.aclaracionSupervisor || 'Supervisor de Servicio');

  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Auto fill address when selecting client
  const handleClientChange = (selectedName: string) => {
    setCliente(selectedName);
    const found = clients.find((c) => c.nombre === selectedName);
    if (found) {
      setDireccion(found.direccion);
    }
  };

  // Add / Remove Technicians
  const addTechnicianAssignment = () => {
    setTecnicosInsumidos([
      ...tecnicosInsumidos,
      { id: 'tech-' + Date.now(), categoria: 'Técnico', cantidad: 1, fecha: fecha },
    ]);
  };

  const removeTechnicianAssignment = (id: string) => {
    setTecnicosInsumidos(tecnicosInsumidos.filter((t) => t.id !== id));
  };

  // Add / Remove Work Logs
  const addDayLog = () => {
    setDiasHorasConsumidas([
      ...diasHorasConsumidas,
      {
        id: 'dh-' + Date.now(),
        fecha: fecha,
        esFeriado: false,
        horaViaje: 0,
        horaIngreso: '08:00',
        horaEgreso: '17:00',
      },
    ]);
  };

  const removeDayLog = (id: string) => {
    setDiasHorasConsumidas(diasHorasConsumidas.filter((d) => d.id !== id));
  };

  // Add / Remove Instruments
  const addInstrument = () => {
    setInstrumentos([...instrumentos, { id: 'inst-' + Date.now(), cantidad: 1, descripcion: '' }]);
  };
  const removeInstrument = (id: string) => {
    setInstrumentos(instrumentos.filter((i) => i.id !== id));
  };

  // Add / Remove Materials
  const addMaterial = () => {
    setMateriales([...materiales, { id: 'mat-' + Date.now(), cantidad: 1, codigoMNR: '', descripcion: '' }]);
  };
  const removeMaterial = (id: string) => {
    setMateriales(materiales.filter((m) => m.id !== id));
  };

  // Photo handlers (Max 6)
  // Comprime la foto antes de guardarla: redimensiona a un máximo de 1280px
  // y recodifica en JPEG calidad 0.72. Una foto de celular de 4-6 MB queda en
  // ~150-300 KB sin pérdida visible en pantalla ni en el PDF. Si algo falla,
  // se usa la imagen original como respaldo.
  const compressImage = (file: File, maxDim = 1280, quality = 0.72): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const originalUrl = ev.target?.result as string;
        const img = new Image();
        img.onload = () => {
          try {
            let { width, height } = img;
            if (width > maxDim || height > maxDim) {
              const scale = Math.min(maxDim / width, maxDim / height);
              width = Math.round(width * scale);
              height = Math.round(height * scale);
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(originalUrl);
              return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } catch {
            resolve(originalUrl);
          }
        };
        img.onerror = () => resolve(originalUrl);
        img.src = originalUrl;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (photos.length >= 6) {
      alert('Se ha alcanzado el límite máximo de 6 imágenes fotográficas.');
      return;
    }

    const availableSlots = 6 - photos.length;
    const fileList = (Array.from(files) as File[]).slice(0, availableSlots);

    fileList.forEach(async (file: File) => {
      try {
        const url = await compressImage(file);
        if (url) {
          setPhotos((prev) => {
            if (prev.length >= 6) return prev;
            return [...prev, { id: 'photo-' + Date.now() + Math.random(), url, comentario: '' }];
          });
        }
      } catch (err) {
        console.error('Error procesando la foto:', err);
      }
    });
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  const updatePhotoComment = (id: string, comentario: string) => {
    setPhotos(photos.map((p) => (p.id === id ? { ...p, comentario } : p)));
  };

  // Calculate Breakdown
  const hourBreakdown = calculateReportHourBreakdown(diasHorasConsumidas, tecnicosInsumidos);

  // Save & Print PDF Handler
  const handleSaveAndPDF = async () => {
    if (savingRef.current || isSaving) return;
    savingRef.current = true;
    setIsSaving(true);
    setSaveStatus(null);

    const reportToSave: FieldServiceReport = {
      id: initialReport?.id || 'rep-' + Date.now(),
      numeroFormulario: 'FR82155-4',
      numeroServicio,
      fecha,
      cliente,
      direccion,
      tipoServicio,
      categoria,
      numeroOrdenCompra,
      numeroContrato,
      numeroOrdenTrabajo,
      detalleProblema,
      tecnicosInsumidos,
      diasHorasConsumidas,
      tareasRealizadas,
      recomendacionConclusion,
      instrumentosUtilizados: instrumentos,
      materialesUtilizados: materiales,
      registroFotografico: photos,
      firmas: {
        firmaTecnico,
        aclaracionTecnico,
        firmaCliente,
        aclaracionCliente,
        firmaSupervisor,
        aclaracionSupervisor,
      },
      createdAt: initialReport?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await onSaveReport(reportToSave);
      const pendientes = getPendingSyncCount();
      setSaveStatus(
        pendientes > 0
          ? 'Formulario guardado en el dispositivo. Se subirá a Supabase automáticamente al recuperar conexión.'
          : 'Formulario guardado con éxito.'
      );

      // Generate & print PDF
      generateCleanPDFReport(reportToSave);
    } catch (e) {
      console.error(e);
      setSaveStatus('Error al guardar el formulario.');
    } finally {
      setIsSaving(false);
      savingRef.current = false;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header Bar & Quick Save */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-20 h-12 rounded-xl border border-slate-800 shadow-md overflow-hidden shrink-0">
            <img
              src={LOGO_BASE64}
              alt="Rexroth Service Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                Formulario de asistencia técnica
              </h2>
              <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono text-xs font-bold rounded">
                FR82155-4
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Complete la información de servicio técnico. Se calcularán automáticamente las horas laborales.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveAndPDF}
            disabled={isSaving}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-600/20 cursor-pointer disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            <span>{isSaving ? 'Guardando...' : 'Guardar e Imprimir en PDF'}</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Main Form Container for PDF capture */}
      <div ref={formPrintRef} className="space-y-6 bg-slate-950 text-slate-100 p-1 rounded-xl">

        {/* Encabezado del Informe con Logo */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 tracking-tight">
                Formulario de Asistencia Técnica
              </h2>
              <span className="px-2.5 py-0.5 bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono text-xs font-bold rounded-md">
                FR82155-4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Bosch Rexroth Field Service System • Servicio Técnico Especializado
            </p>
          </div>

          <div className="flex-shrink-0 overflow-hidden border border-slate-800 rounded-xl shadow-md">
            <img
              src={LOGO_BASE64}
              alt="Rexroth Service Logo"
              style={{ height: '85px' }}
              className="w-auto object-cover"
            />
          </div>
        </div>

        {/* 1. SECCIÓN DATOS GENERALES */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Datos Generales
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Número de Servicio</label>
              <input
                type="text"
                value={numeroServicio}
                onChange={(e) => setNumeroServicio(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Cliente</label>
              <select
                value={cliente}
                onChange={(e) => handleClientChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase text-slate-400">Dirección</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Dirección del cliente / Planta"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Tipo de Servicio</label>
              <select
                value={tipoServicio}
                onChange={(e) => setTipoServicio(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {serviceTypes.map((st) => (
                  <option key={st.id} value={st.codigo}>
                    {st.codigo}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Categoría</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.nombre}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Número de Contrato</label>
              <select
                value={numeroContrato}
                onChange={(e) => setNumeroContrato(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Sin Contrato (Vacío) --</option>
                {contracts.map((con) => (
                  <option key={con.id} value={`${con.numero} ${con.descripcion}`}>
                    {con.numero} - {con.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Nº Orden de Compra</label>
              <input
                type="text"
                value={numeroOrdenCompra}
                onChange={(e) => setNumeroOrdenCompra(e.target.value)}
                placeholder="OC-12345"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Nº Orden de Trabajo</label>
              <input
                type="text"
                value={numeroOrdenTrabajo}
                onChange={(e) => setNumeroOrdenTrabajo(e.target.value)}
                placeholder="OT-9988"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </section>

        {/* 2. SECCIÓN DETALLE DEL PROBLEMA */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Detalle del Problema
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-500 font-mono">
                {detalleProblema.length} / ~300 caracteres
              </span>
              <VoiceInputButton
                onTranscript={(txt) => setDetalleProblema((prev) => (prev ? prev + ' ' + txt : txt))}
              />
            </div>
          </div>

          <textarea
            value={detalleProblema}
            onChange={(e) => setDetalleProblema(e.target.value)}
            rows={3}
            placeholder="Describa brevemente la falla, ruido o motivo de la intervención técnica..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          ></textarea>
        </section>

        {/* 3. TÉCNICOS INSUMIDOS */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Técnicos Insumidos
              </h3>
            </div>
            <button
              type="button"
              onClick={addTechnicianAssignment}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Técnico</span>
            </button>
          </div>

          <div className="space-y-3">
            {tecnicosInsumidos.map((t, idx) => (
              <div key={t.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Categoría</label>
                  <select
                    value={t.categoria}
                    onChange={(e) => {
                      const updated = [...tecnicosInsumidos];
                      updated[idx].categoria = e.target.value;
                      setTecnicosInsumidos(updated);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    {technicians.map((role) => (
                      <option key={role.id} value={role.nombre}>
                        {role.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Cantidad</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={t.cantidad === 0 ? '' : t.cantidad}
                    onChange={(e) => {
                      const val = e.target.value;
                      const parsed = val === '' ? 0 : parseInt(val, 10);
                      const updated = [...tecnicosInsumidos];
                      updated[idx].cantidad = isNaN(parsed) ? 0 : parsed;
                      setTecnicosInsumidos(updated);
                    }}
                    onBlur={() => {
                      if (t.cantidad < 1) {
                        const updated = [...tecnicosInsumidos];
                        updated[idx].cantidad = 1;
                        setTecnicosInsumidos(updated);
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Fecha Asignación</label>
                  <input
                    type="date"
                    value={t.fecha}
                    onChange={(e) => {
                      const updated = [...tecnicosInsumidos];
                      updated[idx].fecha = e.target.value;
                      setTecnicosInsumidos(updated);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-end pt-3 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => removeTechnicianAssignment(t.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. DÍAS Y HORAS CONSUMIDAS (CÁLCULO AUTOMÁTICO DE LEGISLACIÓN) */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Días y Horas Consumidas
              </h3>
            </div>
            <button
              type="button"
              onClick={addDayLog}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Día</span>
            </button>
          </div>

          {/* Table of Days */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                  <th className="pb-2 font-bold">Fecha</th>
                  <th className="pb-2 font-bold text-center">Feriado</th>
                  <th className="pb-2 font-bold">Hora Viaje</th>
                  <th className="pb-2 font-bold">Ingreso</th>
                  <th className="pb-2 font-bold">Egreso</th>
                  <th className="pb-2 font-bold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {diasHorasConsumidas.map((log, idx) => (
                  <tr key={log.id}>
                    <td className="py-2.5 pr-2">
                      <input
                        type="date"
                        value={log.fecha}
                        onChange={(e) => {
                          const updated = [...diasHorasConsumidas];
                          updated[idx].fecha = e.target.value;
                          setDiasHorasConsumidas(updated);
                        }}
                        className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                      />
                    </td>
                    <td className="py-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={log.esFeriado}
                        onChange={(e) => {
                          const updated = [...diasHorasConsumidas];
                          updated[idx].esFeriado = e.target.checked;
                          setDiasHorasConsumidas(updated);
                        }}
                        className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 pr-2">
                      <select
                        value={log.horaViaje}
                        onChange={(e) => {
                          const updated = [...diasHorasConsumidas];
                          updated[idx].horaViaje = parseFloat(e.target.value);
                          setDiasHorasConsumidas(updated);
                        }}
                        className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                      >
                        {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 12].map((hs) => (
                          <option key={hs} value={hs}>
                            {hs} hs
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 pr-2">
                      <input
                        type="time"
                        value={log.horaIngreso}
                        onChange={(e) => {
                          const updated = [...diasHorasConsumidas];
                          updated[idx].horaIngreso = e.target.value;
                          setDiasHorasConsumidas(updated);
                        }}
                        className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                      />
                    </td>
                    <td className="py-2.5 pr-2">
                      <input
                        type="time"
                        value={log.horaEgreso}
                        onChange={(e) => {
                          const updated = [...diasHorasConsumidas];
                          updated[idx].horaEgreso = e.target.value;
                          setDiasHorasConsumidas(updated);
                        }}
                        className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                      />
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => removeDayLog(log.id)}
                        className="p-1 text-rose-400 hover:text-rose-300 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detailed Hours Breakdown Summary */}
          {(() => {
            const totalEspecialista = Math.round((hourBreakdown.especialista.viaje + hourBreakdown.especialista.normales + hourBreakdown.especialista.extras50 + hourBreakdown.especialista.extras100) * 100) / 100;
            const totalTecnico = Math.round((hourBreakdown.tecnico.viaje + hourBreakdown.tecnico.normales + hourBreakdown.tecnico.extras50 + hourBreakdown.tecnico.extras100) * 100) / 100;
            const totalAyudante = Math.round((hourBreakdown.ayudante.viaje + hourBreakdown.ayudante.normales + hourBreakdown.ayudante.extras50 + hourBreakdown.ayudante.extras100) * 100) / 100;
            const totalHorasTrabajoGeneral = Math.round((totalEspecialista + totalTecnico + totalAyudante) * 100) / 100;

            return (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Detalle de Horas Insumidas por Legislación Laboral
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Especialistas */}
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-cyan-400 uppercase">Especialista</span>
                      <div className="text-[10px] space-y-0.5 text-slate-300 mt-1">
                        <p>H. Viaje: {hourBreakdown.especialista.viaje} hs</p>
                        <p>Normales (7-18 hs): <span className="font-bold text-cyan-300">{hourBreakdown.especialista.normales} hs</span></p>
                        <p>Extras 50% (18-21 hs): <span className="font-bold text-pink-400">{hourBreakdown.especialista.extras50} hs</span></p>
                        <p>Extras 100% (21-6 / Feriado): <span className="font-bold text-amber-400">{hourBreakdown.especialista.extras100} hs</span></p>
                      </div>
                      {hourBreakdown.especialista.cantidadTecnicos > 1 && (
                        <p className="text-[9px] text-cyan-500 italic mt-1 border-t border-slate-800 pt-1">
                          * Corresponde a la sumatoria de {hourBreakdown.especialista.cantidadTecnicos} técnicos especialistas.
                        </p>
                      )}
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-800 flex justify-between items-center text-[10px] font-bold text-cyan-300">
                      <span>Suma Especialista:</span>
                      <span className="text-xs font-mono">{totalEspecialista} hs</span>
                    </div>
                  </div>

                  {/* Técnicos */}
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-400 uppercase">Técnico</span>
                      <div className="text-[10px] space-y-0.5 text-slate-300 mt-1">
                        <p>H. Viaje: {hourBreakdown.tecnico.viaje} hs</p>
                        <p>Normales (7-18 hs): <span className="font-bold text-emerald-300">{hourBreakdown.tecnico.normales} hs</span></p>
                        <p>Extras 50% (18-21 hs): <span className="font-bold text-pink-400">{hourBreakdown.tecnico.extras50} hs</span></p>
                        <p>Extras 100% (21-6 / Feriado): <span className="font-bold text-amber-400">{hourBreakdown.tecnico.extras100} hs</span></p>
                      </div>
                      {hourBreakdown.tecnico.cantidadTecnicos > 1 && (
                        <p className="text-[9px] text-emerald-500 italic mt-1 border-t border-slate-800 pt-1">
                          * Corresponde a la sumatoria de {hourBreakdown.tecnico.cantidadTecnicos} técnicos.
                        </p>
                      )}
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-800 flex justify-between items-center text-[10px] font-bold text-emerald-300">
                      <span>Suma Técnico:</span>
                      <span className="text-xs font-mono">{totalTecnico} hs</span>
                    </div>
                  </div>

                  {/* Ayudantes */}
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-purple-400 uppercase">Ayudante</span>
                      <div className="text-[10px] space-y-0.5 text-slate-300 mt-1">
                        <p>H. Viaje: {hourBreakdown.ayudante.viaje} hs</p>
                        <p>Normales (7-18 hs): <span className="font-bold text-purple-300">{hourBreakdown.ayudante.normales} hs</span></p>
                        <p>Extras 50%: <span className="font-bold text-pink-400">{hourBreakdown.ayudante.extras50} hs</span></p>
                        <p>Extras 100%: <span className="font-bold text-amber-400">{hourBreakdown.ayudante.extras100} hs</span></p>
                      </div>
                      {hourBreakdown.ayudante.cantidadTecnicos > 1 && (
                        <p className="text-[9px] text-purple-500 italic mt-1 border-t border-slate-800 pt-1">
                          * Corresponde a la sumatoria de {hourBreakdown.ayudante.cantidadTecnicos} ayudantes.
                        </p>
                      )}
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-800 flex justify-between items-center text-[10px] font-bold text-purple-300">
                      <span>Suma Ayudante:</span>
                      <span className="text-xs font-mono">{totalAyudante} hs</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end items-center pt-2 border-t border-slate-800 text-xs font-bold">
                  <span className="text-cyan-400">
                    Total Horas Trabajo: <span className="text-white text-sm font-extrabold">{totalHorasTrabajoGeneral} hs</span>
                  </span>
                </div>
              </div>
            );
          })()}
        </section>

        {/* 5. TAREAS REALIZADAS (VOICE DICTATION) */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Tareas Realizadas
              </h3>
            </div>
            <VoiceInputButton
              onTranscript={(txt) => setTareasRealizadas((prev) => (prev ? prev + '\n' + txt : txt))}
            />
          </div>

          <textarea
            value={tareasRealizadas}
            onChange={(e) => setTareasRealizadas(e.target.value)}
            rows={5}
            placeholder="Ingrese detalladamente las tareas ejecutadas en el servicio (vía teclado o voz sin límite de caracteres)..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          ></textarea>
        </section>

        {/* 6. RECOMENDACIÓN & CONCLUSIÓN (VOICE DICTATION) */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400"></span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Recomendación & Conclusión
              </h3>
            </div>
            <VoiceInputButton
              onTranscript={(txt) =>
                setRecomendacionConclusion((prev) => (prev ? prev + '\n' + txt : txt))
              }
            />
          </div>

          <textarea
            value={recomendacionConclusion}
            onChange={(e) => setRecomendacionConclusion(e.target.value)}
            rows={4}
            placeholder="Ingrese conclusiones y recomendaciones técnicas para el cliente..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          ></textarea>
        </section>

        {/* 7. INSTRUMENTOS UTILIZADOS */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Instrumentos Utilizados
              </h3>
            </div>
            <button
              type="button"
              onClick={addInstrument}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Instrumento</span>
            </button>
          </div>

          <div className="space-y-2">
            {instrumentos.map((inst, idx) => (
              <div key={inst.id} className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <input
                  type="number"
                  min={1}
                  value={inst.cantidad}
                  onChange={(e) => {
                    const updated = [...instrumentos];
                    updated[idx].cantidad = parseInt(e.target.value) || 1;
                    setInstrumentos(updated);
                  }}
                  className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
                <input
                  type="text"
                  placeholder="Descripción del instrumento (ej: Manómetro digital)"
                  value={inst.descripcion}
                  onChange={(e) => {
                    const updated = [...instrumentos];
                    updated[idx].descripcion = e.target.value;
                    setInstrumentos(updated);
                  }}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200"
                />
                <button
                  type="button"
                  onClick={() => removeInstrument(inst.id)}
                  className="p-1 text-rose-400 hover:text-rose-300 rounded cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 8. MATERIALES UTILIZADOS */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Materiales Utilizados
              </h3>
            </div>
            <button
              type="button"
              onClick={addMaterial}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Material</span>
            </button>
          </div>

          <div className="space-y-2">
            {materiales.map((mat, idx) => (
              <div key={mat.id} className="grid grid-cols-12 gap-2 items-center bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <input
                  type="number"
                  min={1}
                  value={mat.cantidad}
                  onChange={(e) => {
                    const updated = [...materiales];
                    updated[idx].cantidad = parseInt(e.target.value) || 1;
                    setMateriales(updated);
                  }}
                  className="col-span-2 sm:col-span-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
                <input
                  type="text"
                  placeholder="Código MNR (ej: R901089221)"
                  value={mat.codigoMNR}
                  onChange={(e) => {
                    const updated = [...materiales];
                    updated[idx].codigoMNR = e.target.value;
                    setMateriales(updated);
                  }}
                  className="col-span-4 sm:col-span-3 bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-cyan-300"
                />
                <input
                  type="text"
                  placeholder="Descripción del material"
                  value={mat.descripcion}
                  onChange={(e) => {
                    const updated = [...materiales];
                    updated[idx].descripcion = e.target.value;
                    setMateriales(updated);
                  }}
                  className="col-span-5 sm:col-span-7 bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200"
                />
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeMaterial(mat.id)}
                    className="p-1 text-rose-400 hover:text-rose-300 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. REGISTRO FOTOGRÁFICO (9x9 CM PROPORTION, MAX 6 PHOTOS) */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Registro Fotográfico ({photos.length} / 6 max)
              </h3>
            </div>
            {photos.length < 6 && (
              <label className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                <Camera className="w-3.5 h-3.5" />
                <span>Cargar / Tomar Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 space-y-2 flex flex-col items-center"
              >
                {/* 9x9 cm proportion square */}
                <div className="w-28 h-28 aspect-square relative rounded border border-slate-700 overflow-hidden bg-slate-900 flex items-center justify-center">
                  <img src={photo.url} alt="Foto servicio" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-1 right-1 p-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-full cursor-pointer shadow"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Comentario foto..."
                  value={photo.comentario}
                  onChange={(e) => updatePhotoComment(photo.id, e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-[10px] text-slate-200"
                />
              </div>
            ))}

            {photos.length < 6 && (
              <label className="w-28 h-28 aspect-square border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-lg flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors bg-slate-950/40">
                <Plus className="w-6 h-6" />
                <span className="text-[10px] font-semibold">Subir Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </section>

        {/* 10. FIRMAS */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Conformidad y Firmas
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tech Signature */}
            <div className="space-y-3">
              <SignatureCanvas
                label="Firma Técnico Responsable"
                initialValue={firmaTecnico}
                onSave={setFirmaTecnico}
              />
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Aclaración de Firma Técnico
                </label>
                <input
                  type="text"
                  value={aclaracionTecnico}
                  onChange={(e) => setAclaracionTecnico(e.target.value)}
                  placeholder="Nombre y Apellido Técnico"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                />
              </div>
            </div>

            {/* Client Signature */}
            <div className="space-y-3">
              <SignatureCanvas
                label="Firma Cliente / Receptor"
                initialValue={firmaCliente}
                onSave={setFirmaCliente}
              />
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Aclaración de Firma Cliente
                </label>
                <input
                  type="text"
                  value={aclaracionCliente}
                  onChange={(e) => setAclaracionCliente(e.target.value)}
                  placeholder="Nombre y Apellido Cliente"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                />
              </div>
            </div>

            {/* Supervisor Signature */}
            <div className="space-y-3">
              <SignatureCanvas
                label="Firma Supervisor"
                initialValue={firmaSupervisor}
                onSave={setFirmaSupervisor}
              />
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Aclaración de Firma Supervisor
                </label>
                <input
                  type="text"
                  value={aclaracionSupervisor}
                  onChange={(e) => setAclaracionSupervisor(e.target.value)}
                  placeholder="Nombre y Apellido Supervisor"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Floating Action Bar */}
      <div className="sticky bottom-4 z-20 bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-2xl backdrop-blur-md flex justify-between items-center">
        <span className="text-xs text-slate-400">
          Formulario <span className="font-mono text-cyan-400 font-bold">{numeroServicio}</span>
        </span>
        <button
          type="button"
          onClick={handleSaveAndPDF}
          disabled={isSaving}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm rounded-lg shadow-lg shadow-cyan-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Guardando...' : 'Guardar e Imprimir PDF'}</span>
        </button>
      </div>
    </div>
  );
};
