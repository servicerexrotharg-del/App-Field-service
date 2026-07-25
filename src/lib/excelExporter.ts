import * as XLSX from 'xlsx';
import { FieldServiceReport } from '../types';
import { calculateReportHourBreakdown } from './hoursCalculator';

export function exportReportsToExcel(reports: FieldServiceReport[]): void {
  const exportData = reports.map((r) => {
    const breakdown = calculateReportHourBreakdown(r.diasHorasConsumidas, r.tecnicosInsumidos);

    return {
      'Nº Servicio': r.numeroServicio,
      'Nº Formulario': r.numeroFormulario || 'FR82155-4',
      Fecha: r.fecha,
      Cliente: r.cliente,
      Dirección: r.direccion,
      'Tipo Servicio': r.tipoServicio,
      Categoría: r.categoria,
      'Nº Contrato': r.numeroContrato,
      'Orden de Compra': r.numeroOrdenCompra,
      'Orden de Trabajo': r.numeroOrdenTrabajo,
      'Detalle Problema': r.detalleProblema,
      'Total H. Viaje': breakdown.totalViaje,
      'Total H. Normales': breakdown.totalNormales,
      'Total Extras 50%': breakdown.totalExtras50,
      'Total Extras 100%': breakdown.totalExtras100,
      'Total Horas Trabajadas': breakdown.totalTrabajo,
      'Especialistas Normales': breakdown.especialista.normales,
      'Técnicos Normales': breakdown.tecnico.normales,
      'Ayudantes Normales': breakdown.ayudante.normales,
      'Tareas Realizadas': r.tareasRealizadas,
      Recomendación: r.recomendacionConclusion,
      'Aclaración Técnico': r.firmas?.aclaracionTecnico || '',
      'Aclaración Cliente': r.firmas?.aclaracionCliente || '',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reportes Field Service');

  // Auto-fit column widths
  const max_widths = Object.keys(exportData[0] || {}).map((key) => ({
    wch: Math.max(key.length + 3, 15),
  }));
  worksheet['!cols'] = max_widths;

  const fileName = `Reportes_Field_Service_Rexroth_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
