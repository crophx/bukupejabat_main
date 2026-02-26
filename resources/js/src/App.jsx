import React, { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import DashboardAdmin from "./components/DashboardAdmin";
import DataPegawai from "./pages/DataPegawai";
import PerSatker from "./pages/PerSatker";
import DalamNegeri from "./pages/DalamNegeri";
import LuarNegeri from "./pages/LuarNegeri";
// import TambahPegawai from "./pages/TambahPegawai";
import UnitKerja from "./pages/UnitKerja";
import DataAdmin from "./components/DataAdmin";
import PengaturanAkun from "./pages/PengaturanAkun";

function ProtectedLayout({ onSignOut }) {
    return (
        <MainLayout onSignOut={onSignOut}>
            <Outlet />
        </MainLayout>
    );
}

export default function App() {
    // 1. Inisialisasi state langsung dari localStorage agar saat refresh tidak logout
    const [authed, setAuthed] = useState(() => {
        const savedStatus = localStorage.getItem("isLoggedIn");
        return savedStatus === "true";
    });

    // 2. Fungsi Login: Simpan status ke localStorage
    const handleLogin = () => {
        setAuthed(true);
        localStorage.setItem("isLoggedIn", "true");
    };

    // 3. Fungsi SignOut: Hapus status dari localStorage
    const handleSignOut = () => {
        setAuthed(false);
        localStorage.removeItem("isLoggedIn");
    };

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    authed ? (
                        <Navigate to="/dashboard" replace />
                    ) : (
                        <Login onLogin={handleLogin} />
                    )
                }
            />

            <Route
                path="/"
                element={
                    authed ? (
                        <ProtectedLayout onSignOut={handleSignOut} />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardAdmin />} />
                <Route path="pegawai" element={<DataPegawai />} />
                <Route path="satkerja" element={<PerSatker />} />
                <Route path="satkerja/dalam-negeri" element={<DalamNegeri />} />
                <Route path="satkerja/luar-negeri" element={<LuarNegeri />} />
                {/* <Route path="pegawai/tambah" element={<TambahPegawai />} /> */}
                <Route path="admin" element={<DataAdmin />} />
                <Route path="unit-kerja" element={<UnitKerja />} />
                <Route path="unit-kerja/form" element={<UnitKerja />} />
                <Route path="/pengaturan/akun" element={<PengaturanAkun />} />
            </Route>

            <Route
                path="*"
                element={
                    <Navigate to={authed ? "/dashboard" : "/login"} replace />
                }
            />
        </Routes>
    );
}
