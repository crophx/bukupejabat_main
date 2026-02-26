import React, { useState } from "react";
import axios from "axios";

export default function AccountSettings() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700 p-6">
            <div className="mb-2 ml-1">
                <h1 className="text-xl font-bold text-slate-800 ml-1 mb-3">Pengaturan Akun</h1>
                
                {/* Bagian Informasi Profil */}
                <div className="p-1 flex flex-wrap items-center gap-6 mb-8">
                    {/* Unit Kerja */}
                    <div className="form-control">
                        <legend className="fieldset-legend text-slate-800">Unit Kerja</legend>
                        <label className="input input-md bg-white border border-slate-300 text-slate-600 rounded-xl flex items-center gap-2 focus-within:border-sky-500 transition-all w-full md:w-70">
                            <svg className="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3m0 2h18M9 21V9m6 12V9" />
                            </svg>
                            <input type="text" placeholder="Unit Kerja" className="grow" />
                        </label>
                    </div>

                    {/* Email */}
                    <div className="form-control">
                        <legend className="fieldset-legend text-slate-800">Email</legend>
                        <label className="input input-md bg-white border border-slate-300 text-slate-600 rounded-xl flex items-center gap-2 focus-within:border-sky-500 transition-all w-full md:w-70">
                            <svg className="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="alamat@email.com" className="grow" />
                        </label>
                    </div>

                    {/* Role */}
                    <div className="form-control">
                        <legend className="fieldset-legend text-slate-800">Role</legend>
                        <label className="input input-md bg-white border border-slate-300 text-slate-600 rounded-xl flex items-center gap-2 focus-within:border-sky-500 transition-all w-full md:w-70">
                            <svg className="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <input type="text" placeholder="Role" className="grow" />
                        </label>
                    </div>
                </div>

                {/* Bagian Perubahan Password */}
                <div className="p-1 flex flex-wrap items-center gap-8 mb-4">
                    {/* Current Password */}
                    <div className="form-control">
                        <legend className="fieldset-legend text-slate-800">Password Sekarang</legend>
                        <label className="input input-md bg-white border border-slate-300 text-slate-600 rounded-xl flex items-center gap-2 focus-within:border-sky-500 transition-all w-full md:w-80">
                            <svg className="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input type="password" name="current_password" value={formData.current_password} onChange={handleChange} placeholder="Masukkan password lama" className="grow" />
                        </label>
                    </div>

                    {/* New Password */}
                    <div className="form-control">
                        <legend className="fieldset-legend text-slate-800">Password Baru</legend>
                        <label className="input input-md bg-white border border-slate-300 text-slate-600 rounded-xl flex items-center gap-2 focus-within:border-sky-500 transition-all w-full md:w-80">
                            <svg className="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3-3.5 3.5z" />
                            </svg>
                            <input type="password" name="new_password" value={formData.new_password} onChange={handleChange} placeholder="Masukan password baru" className="grow" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}