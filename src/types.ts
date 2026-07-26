export interface Client {
  id: string;
  identificacion: string; // CUIT or ID
  nombre: string;
  direccion: string;
  createdAt?: string;
}

export interface ContractOption {
  id: string;
  numero: string;
  descripcion: string;
}

export interface CategoryOption {
  id: string;
  nombre: string;
}

export interface ServiceTypeOption {
  id: string;
  codigo: string;
  nombre: string;
}

export interface TechnicianRoleOption {
  id: string;
  nombre: 'Especialista' | 'Técnico' | 'Ayudante' | string;
}

export interface TechnicianAssignment {
  id: string;
  categoria: 'Especialista' | 'Técnico' | 'Ayudante' | string;
  cantidad: number;
  fecha: string;
}

export interface DayWorkLog {
  id: string;
  fecha: string;
  esFeriado: boolean;
  horaViaje: number; // in hours e.g. 2.5
  horaIngreso: string; // e.g. "07:00"
  horaEgreso: string; // e.g. "18:00"
}

export interface HourBreakdown {
  especialista: {
    viaje: number;
    normales: number;
    extras50: number;
    extras100: number;
    cantidadTecnicos: number;
  };
  tecnico: {
    viaje: number;
    normales: number;
    extras50: number;
    extras100: number;
    cantidadTecnicos: number;
  };
  ayudante: {
    viaje: number;
    normales: number;
    extras50: number;
    extras100: number;
    cantidadTecnicos: number;
  };
  totalViaje: number;
  totalTrabajo: number;
  totalNormales: number;
  totalExtras50: number;
  totalExtras100: number;
}

export interface InstrumentItem {
  id: string;
  cantidad: number;
  descripcion: string;
}

export interface MaterialItem {
  id: string;
  cantidad: number;
  codigoMNR: string;
  descripcion: string;
}

export interface PhotoItem {
  id: string;
  url: string; // base64 or public URL
  comentario: string;
}

export interface Signatures {
  firmaTecnico: string; // base64
  aclaracionTecnico: string;
  firmaCliente: string; // base64
  aclaracionCliente: string;
  firmaSupervisor?: string; // base64
  aclaracionSupervisor?: string;
}

export interface FieldServiceReport {
  id: string;
  numeroFormulario: string; // FR82155-4
  numeroServicio: string; // Auto SVC-2026-001
  fecha: string;
  cliente: string;
  direccion: string;
  tipoServicio: string; // IH, FA, EA, HD, MH
  categoria: string; // Servicio, Post Venta Good Will, Garantía
  numeroOrdenCompra: string;
  numeroContrato: string;
  numeroOrdenTrabajo: string;
  
  detalleProblema: string;
  
  tecnicosInsumidos: TechnicianAssignment[];
  diasHorasConsumidas: DayWorkLog[];
  
  tareasRealizadas: string;
  recomendacionConclusion: string;
  
  instrumentosUtilizados: InstrumentItem[];
  materialesUtilizados: MaterialItem[];
  
  registroFotografico: PhotoItem[];
  
  firmas: Signatures;
  
  createdAt: string;
  updatedAt: string;
}

export type ViewTab =
  | 'dashboard'
  | 'calendario'
  | 'nuevo_formulario'
  | 'listado_formularios'
  | 'clientes'
  | 'configuracion';

// ===== Calendario de Servicios =====
export type ServiceStatus = 'Programado' | 'Confirmado' | 'Completado' | 'Cancelado';

export interface ScheduledTechnician {
  id: string;
  categoria: 'Especialista' | 'Técnico' | 'Ayudante' | string;
  cantidad: number;
}

export interface ScheduledService {
  id: string;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string;    // YYYY-MM-DD (>= fechaInicio)
  cliente: string;
  motivo: string;
  tecnicos: ScheduledTechnician[];
  estado: ServiceStatus;
  createdAt?: string;
  updatedAt?: string;
}
