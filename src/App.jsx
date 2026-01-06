import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import DashboardAdmin from './components/DashboardAdmin';
import DataPegawai from './pages/DataPegawai';
import TambahPegawai from './pages/TambahPegawai';
import UnitKerja from './pages/UnitKerja';
import DataAdmin from './components/DataAdmin';

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
    <>
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
        <Route path="admin" element={<DataAdmin />} />
        <Route path="unit-kerja" element={<UnitKerja />} />
        <Route path="unit-kerja/form" element={<UnitKerja />} />
      </Route>

      <Route path="*" element={<Navigate to={authed ? '/dashboard' : '/login'} />} />
      </Routes>
    </>
  );
}
