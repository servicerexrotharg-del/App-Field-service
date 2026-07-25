import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { FieldServiceReport } from '../types';
import { calculateReportHourBreakdown } from '../lib/hoursCalculator';
import { Clock, FileCheck, Users, ShieldCheck, TrendingUp } from 'lucide-react';

interface DashboardViewProps {
  reports: FieldServiceReport[];
}

const COLORS_PIE = ['#06b6d4', '#ec4899', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];

export const DashboardView: React.FC<DashboardViewProps> = ({ reports }) => {
  // Aggregate data for Line Chart (Services per Month)
  const monthlyServicesMap: { [key: string]: number } = {};
  const monthlyHoursMap: { [key: string]: number } = {};
  const categoryMap: { [key: string]: number } = {};
  const serviceTypeMap: { [key: string]: number } = {};

  let totalWorkedHours = 0;
  let totalTravelHours = 0;

  reports.forEach((r) => {
    const monthKey = r.fecha ? r.fecha.substring(0, 7) : '2026-07';
    monthlyServicesMap[monthKey] = (monthlyServicesMap[monthKey] || 0) + 1;

    const breakdown = calculateReportHourBreakdown(r.diasHorasConsumidas, r.tecnicosInsumidos);
    monthlyHoursMap[monthKey] = (monthlyHoursMap[monthKey] || 0) + breakdown.totalTrabajo;

    totalWorkedHours += breakdown.totalTrabajo;
    totalTravelHours += breakdown.totalViaje;

    if (r.categoria) {
      categoryMap[r.categoria] = (categoryMap[r.categoria] || 0) + 1;
    }
    if (r.tipoServicio) {
      serviceTypeMap[r.tipoServicio] = (serviceTypeMap[r.tipoServicio] || 0) + 1;
    }
  });

  // Sort monthly keys
  const sortedMonths = Object.keys(monthlyServicesMap).sort();

  const monthlyServicesData = sortedMonths.map((m) => ({
    mes: m,
    servicios: monthlyServicesMap[m],
  }));

  const monthlyHoursData = sortedMonths.map((m) => ({
    mes: m,
    horas: monthlyHoursMap[m],
  }));

  const categoryData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    value: categoryMap[cat],
  }));

  const serviceTypeData = Object.keys(serviceTypeMap).map((st) => ({
    name: st,
    value: serviceTypeMap[st],
  }));

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* KPI Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Servicios</p>
            <h3 className="text-xl font-bold text-slate-100">{reports.length}</h3>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Horas Trabajadas</p>
            <h3 className="text-xl font-bold text-slate-100">{totalWorkedHours} hs</h3>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Horas de Viaje</p>
            <h3 className="text-xl font-bold text-slate-100">{totalTravelHours} hs</h3>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Formulario Norma</p>
            <h3 className="text-xl font-bold text-slate-100 font-mono">FR82155-4</h3>
          </div>
        </div>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Services per Month */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Servicios por Mes
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Línea Evolutiva</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyServicesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
                />
                <Line type="monotone" dataKey="servicios" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5, fill: '#06b6d4' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Consumed Hours per Month */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              Horas Insumidas por Mes
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Total Horas</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="horas" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Categories */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-400"></span>
            Distribución por Categorías
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Service Types */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Distribución por Tipo de Servicio
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {serviceTypeData.map((entry, index) => (
                    <Cell key={`cell-st-${index}`} fill={COLORS_PIE[(index + 2) % COLORS_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
