import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';

const DashboardAdmin = lazy(() => import('./components/DashboardAdmin'));
const DataPegawai = lazy(() => import('./pages/DataPegawai'));
const TambahPegawai = lazy(() => import('./pages/TambahPegawai'));
const UnitKerja = lazy(() => import('./pages/UnitKerja'));

function ProtectedLayout({ onSignOut }) {
  return (
    <MainLayout onSignOut={onSignOut}>
      <Outlet />
    </MainLayout>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(false);

  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <Routes>
      <Route
        path="/login"
        element={<Login onLogin={() => setAuthed(true)} />}
      />

      <Route
        path="/"
        element={authed ? <ProtectedLayout onSignOut={() => setAuthed(false)} /> : <Navigate to="/login" />}
      >
        <Route index element={<DashboardAdmin />} />
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="pegawai" element={<DataPegawai />} />
        <Route path="pegawai/tambah" element={<TambahPegawai />} />
        <Route path="admin" element={<div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">Data Admin (placeholder)</div>} />
        {/* <Route path="admin" element={<DataAdmin />} /> */}
        <Route path="unit-kerja" element={<UnitKerja />} />
        <Route path="unit-kerja/form" element={<UnitKerja />} />
      </Route>

      <Route path="*" element={<Navigate to={authed ? '/dashboard' : '/login'} />} />
      </Routes>
    </Suspense>
  );
}
