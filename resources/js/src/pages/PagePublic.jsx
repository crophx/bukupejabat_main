import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo-kemlu.png";

export default function PublicPage() {
    const navigate = useNavigate();

    return (
        /* Ubah flex-col agar navbar di atas dan konten di bawah */
        <div className="min-h-screen bg-slate-50 flex flex-col">
            
            {/* --- NAVBAR SECTION --- */}
            <header className="w-full pt-6 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-20 flex items-center justify-between px-6">
                        {/* LOGO SECTION */}
                        <div className="flex items-center gap-4">
                            <img src={Logo} alt="logo" className="max-h-12 object-contain" />
                            <div className="hidden sm:block border-l border-slate-200 pl-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Republik Indonesia</p>
                                <p className="text-sm font-bold text-slate-800 leading-none">Kementerian Luar Negeri</p>
                            </div>
                        </div>

                        {/* NAV LINKS (OPSIONAL) */}
                        <div className="flex items-center gap-6">
                            <button className="text-xs font-bold text-slate-500 hover:text-sky-600 uppercase tracking-tight transition-colors">Bantuan</button>
                            <button 
                                onClick={() => navigate('/login')}
                                className="btn btn-sm bg-slate-900 hover:bg-black text-white border-none px-6 rounded-xl normal-case"
                            >
                                Login Admin
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT SECTION --- */}
            <main className="flex-grow flex items-center justify-center p-6">
                <div className="max-w-4xl w-full bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 p-10 border border-slate-100 text-center transition-all">
                    {/* Header Section */}
                    <div className="mb-12">
                        <div className="inline-block p-4 bg-sky-50 rounded-3xl mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-sky-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase mb-2">Portal Informasi Publik</h1>
                        <p className="text-slate-500 font-medium italic">Akses data personel dan unduh laporan resmi per wilayah kerja</p>
                    </div>

                    {/* Main Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* BUTTON VIEW */}
                        <button
                            onClick={() => navigate('/unit-kerja')}
                            className="group p-8 bg-white border-2 border-slate-100 hover:border-sky-500 rounded-[28px] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-sky-100 flex flex-col items-center gap-4 cursor-pointer"
                        >
                            <div className="p-4 bg-sky-50 text-sky-600 rounded-2xl group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </div>
                            <span className="font-black text-slate-800 uppercase tracking-widest text-sm">Lihat Data</span>
                        </button>

                        {/* BUTTON DALAM NEGERI */}
                        <button className="group p-8 bg-white border-2 border-slate-100 hover:border-emerald-500 rounded-[28px] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-100 flex flex-col items-center gap-4 cursor-pointer">
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <span className="font-black text-slate-800 uppercase tracking-widest text-sm block">Dalam Negeri</span>
                                <span className="text-[10px] text-emerald-600 font-bold uppercase mt-1 block tracking-tighter">Unduh PDF</span>
                            </div>
                        </button>

                        {/* BUTTON LUAR NEGERI */}
                        <button className="group p-8 bg-white border-2 border-slate-100 hover:border-rose-500 rounded-[28px] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-rose-100 flex flex-col items-center gap-4 cursor-pointer">
                            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <span className="font-black text-slate-800 uppercase tracking-widest text-sm block">Luar Negeri</span>
                                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1 block tracking-tighter">Unduh PDF</span>
                            </div>
                        </button>
                    </div>

                    {/* Footer Note */}
                    <p className="mt-12 text-slate-400 text-[10px] font-bold uppercase tracking-[4px]">
                        Kementerian Luar Negeri Republik Indonesia
                    </p>
                </div>
            </main>
        </div>
    );
}