import React, { useState } from 'react';
import { FieldServiceReport } from '../types';
import { calculateReportHourBreakdown } from '../lib/hoursCalculator';
import { generateCleanPDFReport } from '../lib/pdfGenerator';
import { exportReportsToExcel } from '../lib/excelExporter';
import {
  FileText,
  Search,
  Download,
  Edit,
  Trash2,
  FileSpreadsheet,
  Calendar,
  User,
  Clock,
} from 'lucide-react';

interface FormsListViewProps {
  reports: FieldServiceReport[];
  onEditReport: (report: FieldServiceReport) => void;
  onDeleteReport: (id: string) => void;
  onNewForm: () => void;
}

export const FormsListView: React.FC<FormsListViewProps> = ({
  reports,
  onEditReport,
  onDeleteReport,
  onNewForm,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.numeroServicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.detalleProblema.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory ? r.categoria === selectedCategory : true;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Search & Actions Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por Nº servicio, cliente o detalle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">Todas las Categorías</option>
            <option value="Servicio">Servicio</option>
            <option value="Post Venta Good Will">Post Venta Good Will</option>
            <option value="Garantía">Garantía</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportReportsToExcel(filteredReports)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Excel</span>
          </button>

          <button
            onClick={onNewForm}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Nuevo Formulario</span>
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <th className="p-3.5 font-bold">Nº Servicio</th>
                <th className="p-3.5 font-bold">Fecha</th>
                <th className="p-3.5 font-bold">Cliente</th>
                <th className="p-3.5 font-bold">Tipo & Categoría</th>
                <th className="p-3.5 font-bold text-center">Horas</th>
                <th className="p-3.5 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredReports.map((report) => {
                const breakdown = calculateReportHourBreakdown(
                  report.diasHorasConsumidas,
                  report.tecnicosInsumidos
                );

                return (
                  <tr key={report.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-cyan-400">
                      {report.numeroServicio}
                      <span className="block text-[9px] text-slate-500 font-sans font-normal">
                        {report.numeroFormulario || 'FR82155-4'}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{report.fecha}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-200 max-w-[200px] truncate">
                      {report.cliente}
                    </td>
                    <td className="p-3.5 space-y-0.5">
                      <span className="inline-block px-2 py-0.5 bg-slate-800 border border-slate-700 text-cyan-300 text-[10px] rounded font-bold mr-1">
                        {report.tipoServicio}
                      </span>
                      <span className="text-slate-400 text-[11px]">{report.categoria}</span>
                    </td>
                    <td className="p-3.5 text-center font-mono whitespace-nowrap">
                      <span className="text-slate-200 font-bold">{breakdown.totalTrabajo} hs</span>
                      <span className="block text-[9px] text-slate-500 whitespace-nowrap">Viaje: {breakdown.totalViaje} hs</span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => generateCleanPDFReport(report)}
                        title="Descargar PDF"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded border border-slate-700 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditReport(report)}
                        title="Editar Formulario"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded border border-slate-700 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar el reporte ${report.numeroServicio}?`)) {
                            onDeleteReport(report.id);
                          }
                        }}
                        title="Eliminar Formulario"
                        className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded border border-slate-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                    No se encontraron formularios cargados con el filtro especificado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
