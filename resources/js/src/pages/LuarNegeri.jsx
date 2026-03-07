import React from "react";
import { useNavigate } from "react-router-dom";

export default function LuarNegeri() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 min-h-screen">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700 p-6 animate-in fade-in duration-500">

                {/* Header Section dengan Tombol Aksi */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Data Per Unit Kerja - Luar Negeri</h2>

                    <div className="flex gap-2">
                        {/* Button Download PDF */}
                        <button
                            title="Download PDF"
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100 flex items-center gap-2 group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5 transition-transform group-hover:-translate-y-0.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-tight hidden md:block">Unduh PDF</span>
                            <div className="flex justify-end">
                                <div className="relative w-full max-w-sm group">
                                    {/* Icon Kaca Pembesar (Kiri) */}
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-sky-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                        </svg>
                                    </div>

                                    {/* Input Field */}
                                    <input
                                        type="text"
                                        placeholder="Cari unit kerja..."
                                        className="input input-bordered w-full pl-11 pr-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-sky-100/50 transition-all rounded-2xl text-sm font-semibold text-slate-600 placeholder:text-slate-300 placeholder:font-medium outline-none"
                                    />

                                    {/* Tombol Clear (Kanan) - Berfungsi Visual */}
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-rose-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Unit Utama */}
                <details className="group bg-slate-50 border-slate-200 border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-100 transition-colors list-none select-none">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-slate-800 uppercase text-medium tracking-wider">PTRI Jenewa</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4 text-slate-400 group-open:rotate-180 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </summary>

                    <div className="p-6 bg-white border-t border-slate-200 space-y-6">

                        {/* Grid Info Satker - Menggunakan Flex agar merapat ke ujung tanpa gap besar */}
                        <div className="flex flex-wrap md:flex-nowrap justify-between gap-6 text-[14px] items-start">

                            {/* Kolom 1: Alamat */}
                            <div className="flex-1 min-w-[150px]">
                                <p className="font-bold text-slate-400 uppercase mb-1">📍 Alamat</p>
                                <p className="text-slate-600 leading-relaxed">Route de Pré-Bois 20, 1215 Geneva, Switzerland</p>
                            </div>

                            {/* Kolom 2: Kontak */}
                            <div className="flex-1 min-w-[150px]">
                                <p className="font-bold text-slate-400 uppercase mb-1">📞 Kontak</p>
                                <p className="text-slate-700 font-semibold">+41 22 788 74 00</p>
                                <p className="text-slate-500 italic text-xs">Fax: +41 22 788 74 04</p>
                            </div>

                            {/* Kolom 3: Digital */}
                            <div className="flex-1 min-w-[150px]">
                                <p className="font-bold text-slate-400 uppercase mb-1">🌐 Digital</p>
                                <p className="text-sky-600 font-bold underline cursor-pointer">geneva@kemlu.go.id</p>
                                <p className="text-slate-400 truncate">kemlu.go.id/geneva</p>
                            </div>

                            {/* Kolom 4: Operasional */}
                            <div className="flex-1 min-w-[150px]">
                                <p className="font-bold text-slate-400 uppercase mb-1">⏰ Operasional</p>
                                <p className="text-slate-700">09.00 - 17.00 CET</p>
                                <p className="text-emerald-600 font-bold">-6 Jam (WIB)</p>
                            </div>

                            {/* Kolom 5: Aksi (Merapat ke kanan) */}
                            <div className="flex-none text-right">
                                <p className="font-bold text-slate-400 uppercase mb-1">AKSI</p>
                                <button
                                    title="Edit Data"
                                    className="p-2 text-sky-600 hover:bg-sky-50 rounded-xl transition-all border border-transparent hover:border-sky-100 flex items-center justify-center ml-auto"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Data Pegawai (Link Navigasi) */}
                        <details className="group/pegawai border border-sky-100 rounded-lg overflow-hidden">
                            <summary
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/detail-pegawai`); // Navigasi ke halaman detail
                                }}
                                className="bg-sky-50 p-3 flex justify-between items-center cursor-pointer hover:bg-sky-100 list-none select-none"
                            >
                                <span className="text-[12px] font-bold text-sky-700 uppercase flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                    </svg>
                                    Daftar Personel PTRI Jenewa
                                </span>
                                <span className="text-sky-400 text-[11px] font-bold uppercase group-open/pegawai:hidden">Klik Detail</span>
                            </summary>

                        </details>
                    </div>
                </details>
            </div>
        </div>
    );
}