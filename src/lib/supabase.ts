import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Client,
  FieldServiceReport,
  CategoryOption,
  ServiceTypeOption,
  ContractOption,
  TechnicianRoleOption,
} from '../types';

const STORAGE_KEYS = {
  REPORTS: 'rexroth_fs_reports_v1',
  CLIENTS: 'rexroth_fs_clients_v1',
  CATEGORIES: 'rexroth_fs_categories_v1',
  SERVICE_TYPES: 'rexroth_fs_service_types_v1',
  CONTRACTS: 'rexroth_fs_contracts_v1',
  TECHNICIANS: 'rexroth_fs_technicians_v1',
  CONFIG: 'rexroth_fs_supabase_config',
};

// Initial default seed clients from "Lista_de_clientes_AR2"
export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    identificacion: '30-50000000-1',
    nombre: 'Ternium Argentina S.A.',
    direccion: 'Planta General Savio, Ramallo, Buenos Aires',
  },
  {
    id: 'cli-2',
    identificacion: '30-50000001-2',
    nombre: 'Siderca S.A. / Tenaris',
    direccion: 'Dr. Simini 250, Campana, Buenos Aires',
  },
  {
    id: 'cli-3',
    identificacion: '30-50000002-3',
    nombre: 'Aluar Aluminio Argentino',
    direccion: 'Ruta Provincial 1 s/n, Puerto Madryn, Chubut',
  },
  {
    id: 'cli-4',
    identificacion: '30-54632000-4',
    nombre: 'YPF S.A. - Refinería La Plata',
    direccion: 'Av. 60 y 128, Berisso, Buenos Aires',
  },
  {
    id: 'cli-5',
    identificacion: '30-50000005-5',
    nombre: 'Acindar Industria Argentina de Aceros',
    direccion: 'Ruta 21 Km 247, Villa Constitución, Santa Fe',
  },
  {
    id: 'cli-6',
    identificacion: '30-70988000-6',
    nombre: 'Pampa Energía S.A.',
    direccion: 'Central Térmica Ensenada Barragán, Buenos Aires',
  },
];

export const INITIAL_CATEGORIES: CategoryOption[] = [
  { id: 'cat-1', nombre: 'Servicio' },
  { id: 'cat-2', nombre: 'Post Venta Good Will' },
  { id: 'cat-3', nombre: 'Garantía' },
];

export const INITIAL_SERVICE_TYPES: ServiceTypeOption[] = [
  { id: 'st-1', codigo: 'IH', nombre: 'Inspección Hidráulica / Mantenimiento' },
  { id: 'st-2', codigo: 'FA', nombre: 'Diagnóstico de Falla' },
  { id: 'st-3', codigo: 'EA', nombre: 'Ensamblado y Puesta en Marcha' },
  { id: 'st-4', codigo: 'HD', nombre: 'Hidráulica Digital & Calibración' },
  { id: 'st-5', codigo: 'MH', nombre: 'Mantenimiento Preventivo / Correctivo' },
];

export const INITIAL_CONTRACTS: ContractOption[] = [
  { id: 'con-1', numero: '6700344049', descripcion: 'Ternium Argentina - Servicio de Campo' },
  { id: 'con-2', numero: '6700319284', descripcion: 'Siderca S.A. - Contrato de Asistencia' },
];

export const INITIAL_TECHNICIAN_ROLES: TechnicianRoleOption[] = [
  { id: 'tech-1', nombre: 'Especialista' },
  { id: 'tech-2', nombre: 'Técnico' },
  { id: 'tech-3', nombre: 'Ayudante' },
];

export const INITIAL_REPORTS: FieldServiceReport[] = [
  {
    id: 'rep-2026-001',
    numeroFormulario: 'FR82155-4',
    numeroServicio: 'SVC-2026-001',
    fecha: '2026-07-20',
    cliente: 'Ternium Argentina S.A.',
    direccion: 'Planta General Savio, Ramallo, Buenos Aires',
    tipoServicio: 'IH',
    categoria: 'Servicio',
    numeroOrdenCompra: 'OC-98231',
    numeroContrato: '6700344049 Ternium',
    numeroOrdenTrabajo: 'OT-4421',
    detalleProblema:
      'Se detectó variación anormal de presión en la central hidráulica del laminador en caliente. Fuga localizada en bloque de acondicionamiento de servoválvulas.',
    tecnicosInsumidos: [
      { id: 'ta-1', categoria: 'Especialista', cantidad: 2, fecha: '2026-07-20' },
      { id: 'ta-2', categoria: 'Técnico', cantidad: 1, fecha: '2026-07-20' },
    ],
    diasHorasConsumidas: [
      {
        id: 'dh-1',
        fecha: '2026-07-20',
        esFeriado: false,
        horaViaje: 4.0,
        horaIngreso: '07:00',
        horaEgreso: '18:00',
      },
    ],
    tareasRealizadas:
      '1. Desmontaje y despresurización de la central hidráulica Rexroth.\n2. Reemplazo de sellos vitón de alta temperatura en servoválvula 4WRPEH.\n3. Medición de contaminación ISO 4406 con contador de partículas en línea.\n4. Ajuste de presiones de alivio secundarias y prueba bajo carga.',
    recomendacionConclusion:
      'Se recomienda realizar purga de acumuladores nitrógeno en el próximo paro programado y sustitución de elementos filtrantes de 3 micras.',
    instrumentosUtilizados: [
      { id: 'inst-1', cantidad: 1, descripcion: 'Manómetro digital de precisión Rexroth Hydroclean' },
      { id: 'inst-2', cantidad: 1, descripcion: 'Contador de partículas portátil ISO 4406' },
    ],
    materialesUtilizados: [
      { id: 'mat-1', cantidad: 2, codigoMNR: 'R901089221', descripcion: 'Juego de sellos O-ring Vitón Rexroth' },
      { id: 'mat-2', cantidad: 1, codigoMNR: 'R928006812', descripcion: 'Elemento filtrante hidráulico 10 micron' },
    ],
    registroFotografico: [],
    firmas: {
      firmaTecnico: '',
      aclaracionTecnico: 'Ing. Carlos Rossi - Rexroth Service',
      firmaCliente: '',
      aclaracionCliente: 'Supervisión de Mantenimiento Ternium',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  // Check env vars or localStorage config
  let url = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  let key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const customCfg = localStorage.getItem(STORAGE_KEYS.CONFIG);
  if (customCfg) {
    try {
      const parsed = JSON.parse(customCfg);
      if (parsed.url && parsed.key) {
        url = parsed.url;
        key = parsed.key;
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (url && key) {
    try {
      supabaseClient = createClient(url, key);
    } catch (e) {
      console.error('Error initializing Supabase client:', e);
    }
  }
  return supabaseClient;
}

export function saveSupabaseConfig(url: string, key: string) {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify({ url, key }));
  supabaseClient = null;
  return getSupabaseClient();
}

export function getSupabaseConfig(): { url: string; key: string } {
  const customCfg = localStorage.getItem(STORAGE_KEYS.CONFIG);
  if (customCfg) {
    try {
      return JSON.parse(customCfg);
    } catch (e) {
      // ignore
    }
  }
  return {
    url: (import.meta as any).env?.VITE_SUPABASE_URL || '',
    key: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
  };
}

// Data Store Layer (Reads/Writes to localStorage with async Supabase sync)
export async function getReports(): Promise<FieldServiceReport[]> {
  const local = localStorage.getItem(STORAGE_KEYS.REPORTS);
  let reports: FieldServiceReport[] = local ? JSON.parse(local) : INITIAL_REPORTS;

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('field_service_reports').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        reports = data.map((item) => ({
          id: item.id,
          numeroFormulario: item.numero_formulario || 'FR82155-4',
          numeroServicio: item.numero_servicio,
          fecha: item.fecha,
          cliente: item.cliente,
          direccion: item.direccion,
          tipoServicio: item.tipo_servicio,
          categoria: item.categoria,
          numeroOrdenCompra: item.numero_orden_compra,
          numeroContrato: item.numero_contrato,
          numeroOrdenTrabajo: item.numero_orden_trabajo,
          detalleProblema: item.detalle_problema,
          tecnicosInsumidos: item.tecnicos_insumidos || [],
          diasHorasConsumidas: item.dias_horas_consumidas || [],
          tareasRealizadas: item.tareas_realizadas,
          recomendacionConclusion: item.recomendacion_conclusion,
          instrumentosUtilizados: item.instrumentos_utilizados || [],
          materialesUtilizados: item.materiales_utilizados || [],
          registroFotografico: item.registro_fotografico || [],
          firmas: item.firmas || { firmaTecnico: '', aclaracionTecnico: '', firmaCliente: '', aclaracionCliente: '' },
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, fallback to local storage:', err);
    }
  }

  return reports;
}

export async function saveReport(report: FieldServiceReport): Promise<FieldServiceReport> {
  const reports = await getReports();
  const existingIdx = reports.findIndex((r) => r.id === report.id);

  const now = new Date().toISOString();
  const updatedReport = {
    ...report,
    updatedAt: now,
    createdAt: report.createdAt || now,
  };

  if (existingIdx >= 0) {
    reports[existingIdx] = updatedReport;
  } else {
    reports.unshift(updatedReport);
  }

  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('field_service_reports').upsert({
        id: updatedReport.id,
        numero_formulario: updatedReport.numeroFormulario,
        numero_servicio: updatedReport.numeroServicio,
        fecha: updatedReport.fecha,
        cliente: updatedReport.cliente,
        direccion: updatedReport.direccion,
        tipo_servicio: updatedReport.tipoServicio,
        categoria: updatedReport.categoria,
        numero_orden_compra: updatedReport.numeroOrdenCompra,
        numero_contrato: updatedReport.numeroContrato,
        numero_orden_trabajo: updatedReport.numeroOrdenTrabajo,
        detalle_problema: updatedReport.detalleProblema,
        tecnicos_insumidos: updatedReport.tecnicosInsumidos,
        dias_horas_consumidas: updatedReport.diasHorasConsumidas,
        tareas_realizadas: updatedReport.tareasRealizadas,
        recomendacion_conclusion: updatedReport.recomendacionConclusion,
        instrumentos_utilizados: updatedReport.instrumentosUtilizados,
        materiales_utilizados: updatedReport.materialesUtilizados,
        registro_fotografico: updatedReport.registroFotografico,
        firmas: updatedReport.firmas,
        updated_at: now,
      });
    } catch (err) {
      console.warn('Supabase save failed:', err);
    }
  }

  return updatedReport;
}

export async function deleteReport(id: string): Promise<void> {
  const reports = await getReports();
  const filtered = reports.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(filtered));

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('field_service_reports').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete failed:', err);
    }
  }
}

// CLIENTS CRUD
export async function getClients(): Promise<Client[]> {
  const local = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  if (local) return JSON.parse(local);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
  return INITIAL_CLIENTS;
}

export async function saveClient(client: Client): Promise<Client[]> {
  const clients = await getClients();
  const idx = clients.findIndex((c) => c.id === client.id);
  if (idx >= 0) clients[idx] = client;
  else clients.push(client);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  return clients;
}

export async function deleteClient(id: string): Promise<Client[]> {
  const clients = await getClients();
  const filtered = clients.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(filtered));
  return filtered;
}

// OPTIONS MANAGEMENT (Categories, Service Types, Contracts, Technicians)
export function getStoredOptions<T>(key: string, initial: T[]): T[] {
  const local = localStorage.getItem(key);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      // fallback
    }
  }
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

export function saveStoredOptions<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

export const getCategories = () => getStoredOptions(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
export const saveCategories = (cats: CategoryOption[]) => saveStoredOptions(STORAGE_KEYS.CATEGORIES, cats);

export const getServiceTypes = () => getStoredOptions(STORAGE_KEYS.SERVICE_TYPES, INITIAL_SERVICE_TYPES);
export const saveServiceTypes = (st: ServiceTypeOption[]) => saveStoredOptions(STORAGE_KEYS.SERVICE_TYPES, st);

export const getContracts = () => getStoredOptions(STORAGE_KEYS.CONTRACTS, INITIAL_CONTRACTS);
export const saveContracts = (c: ContractOption[]) => saveStoredOptions(STORAGE_KEYS.CONTRACTS, c);

export const getTechnicians = () => getStoredOptions(STORAGE_KEYS.TECHNICIANS, INITIAL_TECHNICIAN_ROLES);
export const saveTechnicians = (t: TechnicianRoleOption[]) => saveStoredOptions(STORAGE_KEYS.TECHNICIANS, t);
