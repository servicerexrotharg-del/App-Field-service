import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FieldServiceReport } from '../types';
import { calculateReportHourBreakdown, formatHoursLabel } from './hoursCalculator';

export async function generatePDFFromElement(element: HTMLElement, report: FieldServiceReport): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`Reporte_Field_Service_${report.numeroServicio}_${report.cliente.replace(/\s+/g, '_')}.pdf`);
}

/**
 * Alternative programmatic PDF generator for clean printing
 */
export function generateCleanPDFReport(report: FieldServiceReport): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  const breakdown = calculateReportHourBreakdown(report.diasHorasConsumidas, report.tecnicosInsumidos);

  // Colors
  const primaryBlue = [0, 43, 91]; // Rexroth Dark Blue
  const accentCyan = [0, 168, 204];
  const darkGray = [40, 40, 40];

  // Header Box
  doc.setFillColor(245, 247, 250);
  doc.rect(10, 10, 190, 28, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(10, 10, 190, 28, 'S');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('FORMULARIO DE ASISTENCIA TÉCNICA', 55, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Rexroth Service - Field Service Report', 55, 26);
  doc.text(`Nº FORMULARIO: ${report.numeroFormulario || 'FR82155-4'}`, 55, 32);

  doc.setFontSize(12);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text(`Nº Servicio: ${report.numeroServicio}`, 145, 20);
  doc.setFontSize(9);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(`Fecha: ${report.fecha}`, 145, 26);

  let y = 44;

  // General Data Box
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(10, y, 190, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('1. DATOS GENERALES', 14, y + 5);

  y += 10;
  doc.setFontSize(9);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

  doc.setFont('helvetica', 'bold');
  doc.text('Cliente:', 12, y);
  doc.setFont('helvetica', 'normal');
  doc.text(report.cliente || '-', 30, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Dirección:', 110, y);
  doc.setFont('helvetica', 'normal');
  doc.text(report.direccion || '-', 130, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Tipo Servicio:', 12, y);
  doc.setFont('helvetica', 'normal');
  doc.text(report.tipoServicio || '-', 38, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Categoría:', 70, y);
  doc.setFont('helvetica', 'normal');
  doc.text(report.categoria || '-', 90, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Nº Contrato:', 135, y);
  doc.setFont('helvetica', 'normal');
  doc.text(report.numeroContrato || '-', 160, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Orden de Compra:', 12, y);
  doc.setFont('helvetica', 'normal');
  doc.text(report.numeroOrdenCompra || '-', 42, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Orden Trabajo:', 110, y);
  doc.setFont('helvetica', 'normal');
  doc.text(report.numeroOrdenTrabajo || '-', 138, y);

  y += 10;

  // Problem Detail Box
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(10, y, 190, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('2. DETALLE DEL PROBLEMA', 14, y + 5);

  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  const splitProb = doc.splitTextToSize(report.detalleProblema || 'Sin detalle especificado.', 180);
  doc.text(splitProb, 12, y);
  y += splitProb.length * 5 + 4;

  // Hours Breakdown
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(10, y, 190, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('3. TÉCNICOS Y HORAS CONSUMIDAS', 14, y + 5);

  y += 10;

  // Table header
  doc.setFillColor(230, 235, 245);
  doc.rect(10, y, 190, 6, 'F');
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Categoría Técnico', 14, y + 4.5);
  doc.text('Cant', 60, y + 4.5);
  doc.text('H. Viaje', 80, y + 4.5);
  doc.text('H. Normales', 110, y + 4.5);
  doc.text('Extras 50%', 140, y + 4.5);
  doc.text('Extras 100%', 170, y + 4.5);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

  const roles = [
    { name: 'Especialista', data: breakdown.especialista },
    { name: 'Técnico', data: breakdown.tecnico },
    { name: 'Ayudante', data: breakdown.ayudante },
  ];

  roles.forEach((r) => {
    doc.text(r.name, 14, y);
    doc.text(String(r.data.cantidadTecnicos), 62, y);
    doc.text(`${r.data.viaje} hs`, 80, y);
    doc.text(`${r.data.normales} hs`, 110, y);
    doc.text(`${r.data.extras50} hs`, 140, y);
    doc.text(`${r.data.extras100} hs`, 170, y);
    y += 6;
  });

  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL GENERAL HORAS TRABAJADAS: ${breakdown.totalTrabajo} hs | VIAJE: ${breakdown.totalViaje} hs`, 14, y + 2);

  y += 10;

  // Tasks Box
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(10, y, 190, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('4. TAREAS REALIZADAS', 14, y + 5);

  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  const splitTasks = doc.splitTextToSize(report.tareasRealizadas || 'Sin registro de tareas.', 180);
  doc.text(splitTasks, 12, y);
  y += splitTasks.length * 5 + 6;

  // Recommendations
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(10, y, 190, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('5. RECOMENDACIÓN & CONCLUSIÓN', 14, y + 5);

  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  const splitRec = doc.splitTextToSize(report.recomendacionConclusion || 'Sin conclusiones.', 180);
  doc.text(splitRec, 12, y);
  y += splitRec.length * 5 + 10;

  // Signatures
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(10, y, 190, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('6. CONFORMIDAD Y FIRMAS', 14, y + 5);

  y += 15;

  // Tech Signature Box
  doc.setDrawColor(180, 180, 180);
  doc.rect(15, y, 80, 30);
  if (report.firmas.firmaTecnico) {
    try {
      doc.addImage(report.firmas.firmaTecnico, 'PNG', 20, y + 2, 70, 20);
    } catch (e) {
      // ignore
    }
  }
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text(`Técnico Responsable: ${report.firmas.aclaracionTecnico || '-'}`, 15, y + 35);

  // Client Signature Box
  doc.rect(110, y, 80, 30);
  if (report.firmas.firmaCliente) {
    try {
      doc.addImage(report.firmas.firmaCliente, 'PNG', 115, y + 2, 70, 20);
    } catch (e) {
      // ignore
    }
  }
  doc.text(`Por el Cliente: ${report.firmas.aclaracionCliente || '-'}`, 110, y + 35);

  doc.save(`Formulario_${report.numeroServicio}_${report.cliente.substring(0, 15)}.pdf`);
}
