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

// Initial default seed clients provided officially
export const INITIAL_CLIENTS: Client[] = [
  { id: 'cli-6051475', identificacion: '6051475', nombre: 'MIGUELNARD', direccion: 'BUENOS AIRES' },
  { id: 'cli-6055145', identificacion: '6055145', nombre: 'ACCINSASA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097206', identificacion: '6097206', nombre: 'ABRINCO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097207', identificacion: '6097207', nombre: 'ACERBRAG', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097213', identificacion: '6097213', nombre: 'AGCO ARGEN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097214', identificacion: '6097214', nombre: 'AGRALE ARG', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097215', identificacion: '6097215', nombre: 'AGRICOLA A', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097217', identificacion: '6097217', nombre: 'AKAPOL', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097220', identificacion: '6097220', nombre: 'ALIPACK', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097224', identificacion: '6097224', nombre: 'ALTA TECNO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097225', identificacion: '6097225', nombre: 'ALUAR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097226', identificacion: '6097226', nombre: 'AMMATURO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097227', identificacion: '6097227', nombre: 'ANDINA EMP', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097228', identificacion: '6097228', nombre: 'ANEKO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097229', identificacion: '6097229', nombre: 'ARAUCO ARG', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097231', identificacion: '6097231', nombre: 'ARGENDRILL', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097232', identificacion: '6097232', nombre: 'ARMANDO TE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097233', identificacion: '6097233', nombre: 'ARODAMIENT', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097234', identificacion: '6097234', nombre: 'ARUNCO IND', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097235', identificacion: '6097235', nombre: 'ATI EQUIPA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097238', identificacion: '6097238', nombre: 'BAGLEY ARG', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097239', identificacion: '6097239', nombre: 'BARTOLUCCI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097243', identificacion: '6097243', nombre: 'BIPRESS', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097244', identificacion: '6097244', nombre: 'BLANCO ROD', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097245', identificacion: '6097245', nombre: 'BLIPACK', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097246', identificacion: '6097246', nombre: 'BREMBO ARG', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097247', identificacion: '6097247', nombre: 'BRIDGESTON', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097248', identificacion: '6097248', nombre: 'FLUITRÓNIC', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097250', identificacion: '6097250', nombre: 'CABELMA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097251', identificacion: '6097251', nombre: 'CALFRAC WE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097255', identificacion: '6097255', nombre: 'CEMENTOS A', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097259', identificacion: '6097259', nombre: 'CINTOLO HN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097262', identificacion: '6097262', nombre: 'COCA COLA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097266', identificacion: '6097266', nombre: 'CRAMSA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097267', identificacion: '6097267', nombre: 'CUTER ROBO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097268', identificacion: '6097268', nombre: 'DATAWAVES', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097277', identificacion: '6097277', nombre: 'EGGER ARGE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097278', identificacion: '6097278', nombre: 'EMERSON AR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097281', identificacion: '6097281', nombre: 'YACYRETA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097283', identificacion: '6097283', nombre: 'ESCORIAL', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097287', identificacion: '6097287', nombre: 'FABRIMATIC', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097291', identificacion: '6097291', nombre: 'FATE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097297', identificacion: '6097297', nombre: 'FERROSIDER', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097302', identificacion: '6097302', nombre: 'FOR TAPEBI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097304', identificacion: '6097304', nombre: 'AUME', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097305', identificacion: '6097305', nombre: 'FUSTEC', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097306', identificacion: '6097306', nombre: 'FV', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097309', identificacion: '6097309', nombre: 'GESTAMP BA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097313', identificacion: '6097313', nombre: 'GONVARRI A', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097317', identificacion: '6097317', nombre: 'GRUPO EQUI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097321', identificacion: '6097321', nombre: 'HIDR TECN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097324', identificacion: '6097324', nombre: 'HONDA MOTO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097325', identificacion: '6097325', nombre: 'HYDAC TECH', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097326', identificacion: '6097326', nombre: 'HYDRAIR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097327', identificacion: '6097327', nombre: 'HYDRO EXTR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097329', identificacion: '6097329', nombre: 'IGARRETA M', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097332', identificacion: '6097332', nombre: 'IMA MAI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097333', identificacion: '6097333', nombre: 'IND.MET.PE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097339', identificacion: '6097339', nombre: 'INGENIERIA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097341', identificacion: '6097341', nombre: 'INGENIERIA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097355', identificacion: '6097355', nombre: 'SOFTYS', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097359', identificacion: '6097359', nombre: 'LINEARTEC', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097361', identificacion: '6097361', nombre: 'LLORENTE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097363', identificacion: '6097363', nombre: 'LOMA NEGRA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097366', identificacion: '6097366', nombre: 'M A COCCHI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097368', identificacion: '6097368', nombre: 'MANUEL SAN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097370', identificacion: '6097370', nombre: 'MAQUINAS A', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097375', identificacion: '6097375', nombre: 'METALES DE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097378', identificacion: '6097378', nombre: 'METALSA AR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097383', identificacion: '6097383', nombre: 'MINA PIRQU', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097386', identificacion: '6097386', nombre: 'MINERA DON', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097387', identificacion: '6097387', nombre: 'MINERA SAN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097390', identificacion: '6097390', nombre: 'MOLINO CAN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097392', identificacion: '6097392', nombre: 'MONDELEZ A', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097393', identificacion: '6097393', nombre: 'MONSANTO A', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097395', identificacion: '6097395', nombre: 'MOTO MECAN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097401', identificacion: '6097401', nombre: 'NESTLE ARG', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097404', identificacion: '6097404', nombre: 'NOVAGRAF', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097410', identificacion: '6097410', nombre: 'PAPEL MISI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097412', identificacion: '6097412', nombre: 'PAPELERA S', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097413', identificacion: '6097413', nombre: 'PAPELERA S', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097415', identificacion: '6097415', nombre: 'PETRENIUK', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097416', identificacion: '6097416', nombre: 'PETROQU CO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097417', identificacion: '6097417', nombre: 'PEUGEOT CI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097418', identificacion: '6097418', nombre: 'PIERO SAIC', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097419', identificacion: '6097419', nombre: 'PIRELLI NE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097421', identificacion: '6097421', nombre: 'PLASTIC OM', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097423', identificacion: '6097423', nombre: 'PLASTICOS', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097425', identificacion: '6097425', nombre: 'PRENSAS SC', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097433', identificacion: '6097433', nombre: 'ROD PALOMA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097434', identificacion: '6097434', nombre: 'RODAMIENTO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097435', identificacion: '6097435', nombre: 'RODASER RO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097436', identificacion: '6097436', nombre: 'ROLLER SER', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097437', identificacion: '6097437', nombre: 'ROLOP', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097441', identificacion: '6097441', nombre: 'RULEMANES', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097443', identificacion: '6097443', nombre: 'RULEMANES', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097446', identificacion: '6097446', nombre: 'SABAVISA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097451', identificacion: '6097451', nombre: 'SCRAPSERVI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097452', identificacion: '6097452', nombre: 'SEABOARD', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097453', identificacion: '6097453', nombre: 'SIAT', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097456', identificacion: '6097456', nombre: 'SIEMENS', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097459', identificacion: '6097459', nombre: 'SKF ARGENT', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097461', identificacion: '6097461', nombre: 'SOLUCIONES', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097470', identificacion: '6097470', nombre: 'TERMINAL Z', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097472', identificacion: '6097472', nombre: 'TERNIUM AR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097474', identificacion: '6097474', nombre: 'TOYOTA ARG', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097475', identificacion: '6097475', nombre: 'TRANS GAS', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097477', identificacion: '6097477', nombre: 'UGA SEISMI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097478', identificacion: '6097478', nombre: 'UNILEVER', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097481', identificacion: '6097481', nombre: 'VALLE DE L', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097485', identificacion: '6097485', nombre: 'VOITH PAPE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097486', identificacion: '6097486', nombre: 'WYNKA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097489', identificacion: '6097489', nombre: 'ZUCAMOR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6113843', identificacion: '6113843', nombre: 'SIDERCA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6148151', identificacion: '6148151', nombre: 'TOTAL AUST', direccion: 'BUENOS AIRES' },
  { id: 'cli-6180686', identificacion: '6180686', nombre: 'BOSCH', direccion: 'BUENOS AIRES' },
  { id: 'cli-6202477', identificacion: '6202477', nombre: 'NAKASE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6238637', identificacion: '6238637', nombre: 'LEDESMA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6302250', identificacion: '6302250', nombre: 'FORD ARGEN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6433424', identificacion: '6433424', nombre: 'VW ARGENTI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6630445', identificacion: '6630445', nombre: 'OROPLATA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6684089', identificacion: '6684089', nombre: 'ESTELAR RE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6727490', identificacion: '6727490', nombre: 'PAMPA ENER', direccion: 'BUENOS AIRES' },
  { id: 'cli-6728392', identificacion: '6728392', nombre: 'SIMAT', direccion: 'BUENOS AIRES' },
  { id: 'cli-6728394', identificacion: '6728394', nombre: 'APM', direccion: 'BUENOS AIRES' },
  { id: 'cli-6728488', identificacion: '6728488', nombre: 'LOMA NEGRA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6729790', identificacion: '6729790', nombre: 'TECSESI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6729831', identificacion: '6729831', nombre: 'CONSULTATI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6733748', identificacion: '6733748', nombre: 'FERROSUR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6742006', identificacion: '6742006', nombre: 'I.R. INGEN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6749956', identificacion: '6749956', nombre: 'RECYCOMB', direccion: 'BUENOS AIRES' },
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
const CLIENTS_VERSION_KEY = 'rexroth_fs_clients_version_v3';

export async function resetClientsToOfficialList(): Promise<Client[]> {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
  localStorage.setItem(CLIENTS_VERSION_KEY, 'v3');

  const client = getSupabaseClient();
  if (client) {
    try {
      // Upsert official clients to Supabase table
      const payload = INITIAL_CLIENTS.map((c) => ({
        id: c.id,
        identificacion: c.identificacion,
        nombre: c.nombre,
        direccion: c.direccion,
      }));
      await client.from('clients').upsert(payload, { onConflict: 'id' });
    } catch (err) {
      console.warn('Supabase reset clients error:', err);
    }
  }
  return INITIAL_CLIENTS;
}

export async function syncClientsToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, count: 0, error: 'Supabase no está configurado. Ingrese URL y ANON Key en Configuración.' };
  }

  const clients = await getClients();
  try {
    const payload = clients.map((c) => ({
      id: c.id,
      identificacion: c.identificacion,
      nombre: c.nombre,
      direccion: c.direccion,
    }));

    const { error } = await client.from('clients').upsert(payload, { onConflict: 'id' });
    if (error) throw error;

    return { success: true, count: payload.length };
  } catch (err: any) {
    console.error('Error syncing clients to Supabase:', err);
    return { success: false, count: 0, error: err.message || 'Error al conectar con la tabla clients de Supabase' };
  }
}

export async function getClients(): Promise<Client[]> {
  // Check version flag to migrate local storage from old mock examples to 131 official clients
  if (localStorage.getItem(CLIENTS_VERSION_KEY) !== 'v3') {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
    localStorage.setItem(CLIENTS_VERSION_KEY, 'v3');
  }

  let clients: Client[] = INITIAL_CLIENTS;
  const local = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  if (local) {
    try {
      clients = JSON.parse(local);
    } catch (e) {
      clients = INITIAL_CLIENTS;
    }
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('clients').select('*').order('nombre', { ascending: true });
      if (!error && data && data.length > 0) {
        clients = data.map((item) => ({
          id: item.id || `cli-${item.identificacion || Math.random()}`,
          identificacion: item.identificacion || '',
          nombre: item.nombre || '',
          direccion: item.direccion || '',
          createdAt: item.created_at,
        }));
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
      }
    } catch (err) {
      console.warn('Supabase clients fetch error:', err);
    }
  }

  return clients;
}

export async function saveClient(clientData: Client): Promise<Client[]> {
  const clients = await getClients();
  const idx = clients.findIndex((c) => c.id === clientData.id);
  if (idx >= 0) clients[idx] = clientData;
  else clients.push(clientData);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('clients').upsert({
        id: clientData.id,
        identificacion: clientData.identificacion,
        nombre: clientData.nombre,
        direccion: clientData.direccion,
      });
    } catch (err) {
      console.warn('Supabase client save error:', err);
    }
  }

  return clients;
}

export async function deleteClient(id: string): Promise<Client[]> {
  const clients = await getClients();
  const filtered = clients.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(filtered));

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('clients').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase client delete error:', err);
    }
  }

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
