import React, { useState } from "react";
import axios from "axios";

export default function AccountSettings() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama: "Admin SDM", // Contoh default data
        email: "admin@sdm.go.id",
        unit_kerja: "Biro Sumber Daya Manusia",
        role: "Super Admin",
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put("http://127.0.0.1:8000/api/admin/update-account", formData);
            alert("Perubahan berhasil disimpan!");
        } catch (error) {
            alert(error.response?.data?.message || "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header Utama */}
            {/* <div className="flex flex-col gap-1 ml-1">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">PENGATURAN AKUN</h1>
                <p className="text-sm text-slate-500">Kelola informasi profil dan keamanan keamanan akun Anda.</p>
            </div> */}

            <form onSubmit={handleUpdate} className="space-y-6">
                {/* SECTION 1: PROFIL INFORMASI */}
                <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <svg className="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                            Informasi Profil
                        </h2>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Nama Lengkap */}
                        <div className="form-control w-full">
                            <label className="label text-[11px] font-bold text-slate-700 uppercase tracking-widest ml-1">Nama Lengkap</label>
                            <label className="input input-bordered bg-slate-50 border-slate-200 rounded-2xl flex items-center gap-3 focus-within:ring-4 focus-within:ring-sky-100 focus-within:border-sky-500 transition-all h-12">
                                <svg className="h-4 w-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                                <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="grow font-semibold text-slate-700" placeholder="Nama Lengkap" />
                            </label>
                        </div>

                        {/* Email */}
                        <div className="form-control w-full">
                            <label className="label text-[11px] font-bold text-slate-700 uppercase tracking-widest ml-1">Email Instansi</label>
                            <label className="input input-bordered bg-slate-50 border-slate-200 rounded-2xl flex items-center gap-3 focus-within:ring-4 focus-within:ring-sky-100 focus-within:border-sky-500 transition-all h-12">
                                <svg className="h-4 w-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="grow font-semibold text-slate-700" placeholder="alamat@email.com" />
                            </label>
                        </div>

                        {/* Unit Kerja (Read Only style) */}
                        <div className="form-control w-full">
                            <label className="label text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unit Kerja</label>
                            <label className="input input-bordered bg-slate-100/50 border-slate-200 rounded-2xl flex items-center gap-3 h-12 cursor-not-allowed">
                                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3m0 2h18M9 21V9m6 12V9" /></svg>
                                <input type="text" value={formData.unit_kerja} className="grow font-semibold text-slate-400" disabled />
                            </label>
                        </div>

                        {/* Role (Read Only style) */}
                        <div className="form-control w-full">
                            <label className="label text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Level Hak Akses</label>
                            <label className="input input-bordered bg-slate-100/50 border-slate-200 rounded-2xl flex items-center gap-3 h-12 cursor-not-allowed">
                                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                <input type="text" value={formData.role} className="grow font-semibold text-slate-400" disabled />
                            </label>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: KEAMANAN */}
                <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 mb-6 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            Keamanan Akun
                        </h2>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
                                <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
                                    <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-amber-900">Tips Keamanan</p>
                                    <p className="text-xs text-amber-700/80 leading-relaxed">Gunakan kombinasi minimal 8 karakter dengan huruf besar, angka, dan simbol untuk menjaga keamanan akun Anda.</p>
                                </div>
                            </div>
                        </div>

                        <div className="form-control w-full">
                            <label className="label text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password Saat Ini</label>
                            <label className="input input-bordered text-slate-600 bg-slate-50 border-slate-200 rounded-2xl flex items-center gap-3 focus-within:ring-4 focus-within:ring-sky-100 focus-within:border-sky-500 transition-all h-12">
                                <svg className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M7 11V7a5 5 0 0 1 10 0v4" /><rect width="18" height="11" x="3" y="11" rx="2" /></svg>
                                <input type="password" name="current_password" value={formData.current_password} onChange={handleChange} className="grow font-semibold text-slate-700" placeholder="••••••••" />
                            </label>
                        </div>

                        <div className="form-control w-full">
                            <label className="label text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password Baru</label>
                            <label className="input input-bordered text-slate-600 bg-slate-50 border-slate-200 rounded-2xl flex items-center gap-3 focus-within:ring-4 focus-within:ring-sky-100 focus-within:border-sky-500 transition-all h-12">
                                <svg className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3-3.5 3.5z" /></svg>
                                <input type="password" name="new_password" value={formData.new_password} onChange={handleChange} className="grow font-semibold text-slate-700" placeholder="••••••••" />
                            </label>
                        </div>
                        {/* Tombol Simpan Perubahan - Ditambahkan md:col-span-2 dan w-full */}
                        <div className="md:col-span-2 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-md w-full bg-sky-600 hover:bg-sky-700 border-none text-white rounded-2xl shadow-lg shadow-sky-200 transition-all active:scale-[0.98]"
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        Simpan Perubahan Akun
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Tombol Aksi */}
                {/* <div className="flex justify-end items-center gap-4 bg-slate-100/50 p-6 rounded-[24px] border border-slate-200">
                    <button type="button" className="btn btn-ghost text-slate-500 font-bold hover:bg-slate-200 rounded-xl">Batal</button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn bg-sky-600 hover:bg-sky-700 border-none text-white px-8 rounded-xl shadow-lg shadow-sky-200"
                    >
                        {loading ? <span className="loading loading-spinner loading-xs"></span> : "Simpan Perubahan"}
                    </button>
                </div> */}
            </form>
        </div>
    );
}