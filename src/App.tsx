/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Client,
  CategoryOption,
  ServiceTypeOption,
  ContractOption,
  TechnicianRoleOption,
  FieldServiceReport,
  ViewTab,
} from './types';
import {
  getReports,
  saveReport,
  deleteReport,
  getClients,
  saveClient,
  deleteClient,
  getCategories,
  saveCategories,
  getServiceTypes,
  saveServiceTypes,
  getContracts,
  saveContracts,
  getTechnicians,
  saveTechnicians,
  getSupabaseClient,
  syncPendingReports,
  getPendingSyncCount,
} from './lib/supabase';
import { exportReportsToExcel } from './lib/excelExporter';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { FormView } from './components/FormView';
import { FormsListView } from './components/FormsListView';
import { ClientsView } from './components/ClientsView';
import { ConfigView } from './components/ConfigView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');

  const [reports, setReports] = useState<FieldServiceReport[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategoriesState] = useState<CategoryOption[]>([]);
  const [serviceTypes, setServiceTypesState] = useState<ServiceTypeOption[]>([]);
  const [contracts, setContractsState] = useState<ContractOption[]>([]);
  const [technicians, setTechniciansState] = useState<TechnicianRoleOption[]>([]);

  const [editingReport, setEditingReport] = useState<FieldServiceReport | null>(null);
  const [pendingSync, setPendingSync] = useState(0);

  useEffect(() => {
    async function loadData() {
      // Al iniciar, intentar subir lo que quedó pendiente de sesiones anteriores.
      await syncPendingReports();
      const loadedReports = await getReports();
      setReports(loadedReports);
      setPendingSync(getPendingSyncCount());

      const loadedClients = await getClients();
      setClients(loadedClients);

      setCategoriesState(getCategories());
      setServiceTypesState(getServiceTypes());
      setContractsState(getContracts());
      setTechniciansState(getTechnicians());
    }
    loadData();
  }, []);

  // Cola de sincronización: al recuperar señal (WiFi/4G/5G) el navegador dispara
  // el evento 'online' y se suben automáticamente los reportes pendientes.
  useEffect(() => {
    const onOnline = async () => {
      const res = await syncPendingReports();
      setPendingSync(getPendingSyncCount());
      if (res.synced > 0) {
        const updated = await getReports();
        setReports(updated);
      }
    };
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, []);

  const handleSaveReport = async (report: FieldServiceReport) => {
    await saveReport(report);
    const updated = await getReports();
    setReports(updated);
    setPendingSync(getPendingSyncCount());
  };

  const handleDeleteReport = async (id: string) => {
    await deleteReport(id);
    const updated = await getReports();
    setReports(updated);
    setPendingSync(getPendingSyncCount());
  };

  const handleSaveClient = async (client: Client) => {
    const updated = await saveClient(client);
    setClients(updated);
  };

  const handleDeleteClient = async (id: string) => {
    const updated = await deleteClient(id);
    setClients(updated);
  };

  // Next auto-increment service number calculation (e.g. SVC-2026-002)
  // El año se toma dinámicamente: cada año nuevo el correlativo arranca en 001.
  const calculateNextServiceNumber = () => {
    const year = new Date().getFullYear();
    const pattern = new RegExp(`SVC-${year}-(\\d+)`, 'i');
    const nums = reports
      .map((r) => {
        const match = r.numeroServicio.match(pattern);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => !isNaN(n));

    const maxNum = nums.length > 0 ? Math.max(0, ...nums) : 0;
    const nextVal = maxNum + 1;
    return `SVC-${year}-${String(nextVal).padStart(3, '0')}`;
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const hasSupabase = Boolean(getSupabaseClient());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'nuevo_formulario') {
            setEditingReport(null);
          }
          setCurrentTab(tab);
        }}
        onLogout={() => setIsAuthenticated(false)}
        onExportExcel={() => exportReportsToExcel(reports)}
        hasSupabase={hasSupabase}
        pendingSyncCount={pendingSync}
      />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onTabChange={(tab) => {
            if (tab === 'nuevo_formulario') {
              setEditingReport(null);
            }
            setCurrentTab(tab);
          }}
          reportsCount={reports.length}
        />

        <main className="flex-1 overflow-y-auto bg-slate-950">
          {currentTab === 'dashboard' && <DashboardView reports={reports} />}

          {currentTab === 'nuevo_formulario' && (
            <FormView
              clients={clients}
              categories={categories}
              serviceTypes={serviceTypes}
              contracts={contracts}
              technicians={technicians}
              initialReport={editingReport}
              onSaveReport={handleSaveReport}
              nextServiceNumber={calculateNextServiceNumber()}
            />
          )}

          {currentTab === 'listado_formularios' && (
            <FormsListView
              reports={reports}
              onEditReport={(rep) => {
                setEditingReport(rep);
                setCurrentTab('nuevo_formulario');
              }}
              onDeleteReport={handleDeleteReport}
              onNewForm={() => {
                setEditingReport(null);
                setCurrentTab('nuevo_formulario');
              }}
            />
          )}

          {currentTab === 'clientes' && (
            <ClientsView
              clients={clients}
              onSaveClient={handleSaveClient}
              onDeleteClient={handleDeleteClient}
              onRefreshClients={async () => {
                const refreshed = await getClients();
                setClients(refreshed);
              }}
            />
          )}

          {currentTab === 'configuracion' && (
            <ConfigView
              categories={categories}
              onSaveCategories={(cats) => {
                saveCategories(cats);
                setCategoriesState(cats);
              }}
              serviceTypes={serviceTypes}
              onSaveServiceTypes={(st) => {
                saveServiceTypes(st);
                setServiceTypesState(st);
              }}
              contracts={contracts}
              onSaveContracts={(c) => {
                saveContracts(c);
                setContractsState(c);
              }}
              technicians={technicians}
              onSaveTechnicians={(t) => {
                saveTechnicians(t);
                setTechniciansState(t);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
