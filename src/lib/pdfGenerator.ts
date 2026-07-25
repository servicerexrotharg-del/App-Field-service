import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FieldServiceReport } from '../types';
import { calculateReportHourBreakdown, formatHoursLabel } from './hoursCalculator';
import { LOGO_BASE64 } from '../logo';

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
 * Programmatic PDF generator for clean printing
 */
export function generateCleanPDFReport(report: FieldServiceReport): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  const breakdown = calculateReportHourBreakdown(report.diasHorasConsumidas, report.tecnicosInsumidos);

  // Colors
  const primaryBlue = [0, 43, 91]; // Rexroth Dark Blue
  const darkGray = [40, 40, 40];

  // --- Helpers de paginación dinámica ---
  // La página útil termina en PAGE_BOTTOM; solo se agrega página nueva
  // cuando el próximo bloque realmente no entra en el espacio restante.
  const PAGE_BOTTOM = 282; // A4 (297mm) menos margen inferior
  let y = 44;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > PAGE_BOTTOM) {
      doc.addPage();
      y = 15;
    }
  };

  // Dibuja la barra de título de sección, garantizando que quede junto
  // con al menos minContentHeight mm de su contenido (no huérfana al pie).
  const drawSectionHeader = (title: string, minContentHeight: number = 15) => {
    checkPageBreak(7 + 3 + minContentHeight);
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.rect(10, y, 190, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(title, 14, y + 5);
    y += 10;
  };

  // Escribe líneas de texto con salto de página automático línea a línea.
  const writeLines = (lines: string[], x: number, lineHeight: number = 4.5) => {
    lines.forEach((line) => {
      checkPageBreak(lineHeight);
      doc.text(line, x, y);
      y += lineHeight;
    });
  };

  // Header Box
  doc.setFillColor(245, 247, 250);
  doc.rect(10, 10, 190, 28, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(10, 10, 190, 28, 'S');

  // Title (Left aligned)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('FORMULARIO DE ASISTENCIA TÉCNICA', 14, 18);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Rexroth Service - Field Service Report', 14, 24);
  doc.text(`Nº FORMULARIO: ${report.numeroFormulario || 'FR82155-4'}`, 14, 30);

  // Middle/Right Info (Aligned at 150mm)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text(`Nº Servicio: ${report.numeroServicio}`, 150, 18, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(`Fecha: ${report.fecha}`, 150, 24, { align: 'right' });

  // Logo Image on far top right (x=154, y=11.5, width=43, height=25)
  try {
    doc.addImage(LOGO_BASE64, 'JPEG', 154, 11.5, 43, 25);
  } catch (err) {
    console.error('Error drawing logo in PDF:', err);
  }

  // 1. DATOS GENERALES
  drawSectionHeader('1. DATOS GENERALES');
  doc.setFontSize(8.5);
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

  // 2. DETALLE DEL PROBLEMA
  drawSectionHeader('2. DETALLE DEL PROBLEMA', 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  const splitProb = doc.splitTextToSize(report.detalleProblema || 'Sin detalle especificado.', 180);
  writeLines(splitProb, 12);
  y += 4;

  // 3. TÉCNICOS Y HORAS CONSUMIDAS
  // La tabla completa (encabezado + 3 filas + total) mide ~35mm: se mantiene junta.
  drawSectionHeader('3. TÉCNICOS Y HORAS CONSUMIDAS', 35);

  // Table header
  doc.setFillColor(230, 235, 245);
  doc.rect(10, y, 190, 6, 'F');
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
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
    y += 5.5;
  });

  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL GENERAL HORAS TRABAJADAS: ${breakdown.totalTrabajo} hs | VIAJE: ${breakdown.totalViaje} hs`, 14, y + 2);

  y += 9;

  // 4. TAREAS REALIZADAS
  drawSectionHeader('4. TAREAS REALIZADAS', 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  const splitTasks = doc.splitTextToSize(report.tareasRealizadas || 'Sin registro de tareas.', 180);
  writeLines(splitTasks, 12);
  y += 6;

  // 5. RECOMENDACIÓN & CONCLUSIÓN
  drawSectionHeader('5. RECOMENDACIÓN & CONCLUSIÓN', 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  const splitRec = doc.splitTextToSize(report.recomendacionConclusion || 'Sin conclusiones.', 180);
  writeLines(splitRec, 12);
  y += 8;

  // 6. INSTRUMENTOS & MATERIALES
  if ((report.instrumentosUtilizados && report.instrumentosUtilizados.length > 0) || (report.materialesUtilizados && report.materialesUtilizados.length > 0)) {
    drawSectionHeader('6. INSTRUMENTOS Y MATERIALES UTILIZADOS', 12);
    doc.setFontSize(8.5);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

    if (report.instrumentosUtilizados && report.instrumentosUtilizados.length > 0) {
      checkPageBreak(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Instrumentos:', 12, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      report.instrumentosUtilizados.forEach((inst) => {
        checkPageBreak(4.5);
        doc.text(`• [Cant: ${inst.cantidad}] ${inst.descripcion}`, 16, y);
        y += 4.5;
      });
      y += 2;
    }

    if (report.materialesUtilizados && report.materialesUtilizados.length > 0) {
      checkPageBreak(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Materiales:', 12, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      report.materialesUtilizados.forEach((mat) => {
        checkPageBreak(4.5);
        doc.text(`• [Cant: ${mat.cantidad}] ${mat.codigoMNR ? `(MNR: ${mat.codigoMNR}) ` : ''}${mat.descripcion}`, 16, y);
        y += 4.5;
      });
      y += 2;
    }
  }

  // 7. REGISTRO FOTOGRÁFICO
  if (report.registroFotografico && report.registroFotografico.length > 0) {
    y += 4;

    // Render photos 2 per row
    const photoWidth = 55;
    const photoHeight = 45;

    // El encabezado debe quedar junto con al menos la primera fila de fotos
    drawSectionHeader('7. REGISTRO FOTOGRÁFICO', photoHeight + 8);
    y += 2;

    for (let i = 0; i < report.registroFotografico.length; i += 2) {
      checkPageBreak(photoHeight + 8);

      const p1 = report.registroFotografico[i];
      const p2 = report.registroFotografico[i + 1];

      // Photo 1
      if (p1 && p1.url) {
        try {
          doc.addImage(p1.url, 'JPEG', 15, y, photoWidth, photoHeight);
        } catch (e) {
          doc.rect(15, y, photoWidth, photoHeight);
          doc.text('Imagen', 25, y + 20);
        }
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        const comment1 = doc.splitTextToSize(p1.comentario || 'Sin comentario', photoWidth + 25);
        doc.text(comment1, 73, y + 6);
      }

      // Photo 2
      if (p2 && p2.url) {
        const x2 = 110;
        try {
          doc.addImage(p2.url, 'JPEG', x2, y, photoWidth, photoHeight);
        } catch (e) {
          doc.rect(x2, y, photoWidth, photoHeight);
          doc.text('Imagen', x2 + 10, y + 20);
        }
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        const comment2 = doc.splitTextToSize(p2.comentario || 'Sin comentario', 32);
        doc.text(comment2, x2 + photoWidth + 2, y + 6);
      }

      y += photoHeight + 8;
    }
  }

  // 8. CONFORMIDAD Y FIRMAS (3 Signatures)
  y += 4;

  const sigBoxWidth = 57;
  const sigBoxHeight = 28;

  // El encabezado debe quedar junto con los recuadros de firma completos
  drawSectionHeader('8. CONFORMIDAD Y FIRMAS', sigBoxHeight + 14);
  y += 2;

  // Signature 1: Técnico
  doc.setDrawColor(180, 180, 180);
  doc.rect(12, y, sigBoxWidth, sigBoxHeight);
  if (report.firmas?.firmaTecnico) {
    try {
      doc.addImage(report.firmas.firmaTecnico, 'PNG', 14, y + 2, sigBoxWidth - 4, sigBoxHeight - 4);
    } catch (e) {
      // ignore
    }
  }
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'bold');
  doc.text('Técnico Responsable:', 12, y + sigBoxHeight + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(report.firmas?.aclaracionTecnico || '-', 12, y + sigBoxHeight + 8);

  // Signature 2: Cliente
  const xClient = 76;
  doc.rect(xClient, y, sigBoxWidth, sigBoxHeight);
  if (report.firmas?.firmaCliente) {
    try {
      doc.addImage(report.firmas.firmaCliente, 'PNG', xClient + 2, y + 2, sigBoxWidth - 4, sigBoxHeight - 4);
    } catch (e) {
      // ignore
    }
  }
  doc.setFont('helvetica', 'bold');
  doc.text('Por el Cliente:', xClient, y + sigBoxHeight + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(report.firmas?.aclaracionCliente || '-', xClient, y + sigBoxHeight + 8);

  // Signature 3: Supervisor
  const xSupervisor = 140;
  doc.rect(xSupervisor, y, sigBoxWidth, sigBoxHeight);
  if (report.firmas?.firmaSupervisor) {
    try {
      doc.addImage(report.firmas.firmaSupervisor, 'PNG', xSupervisor + 2, y + 2, sigBoxWidth - 4, sigBoxHeight - 4);
    } catch (e) {
      // ignore
    }
  }
  doc.setFont('helvetica', 'bold');
  doc.text('Supervisor:', xSupervisor, y + sigBoxHeight + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(report.firmas?.aclaracionSupervisor || '-', xSupervisor, y + sigBoxHeight + 8);

  // Print Window Trigger + File Download
  try {
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(blobUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  } catch (e) {
    console.warn('Unable to open print preview tab:', e);
  }

  doc.save(`Formulario_${report.numeroServicio}_${(report.cliente || 'Servicio').substring(0, 15).replace(/\s+/g, '_')}.pdf`);
}
