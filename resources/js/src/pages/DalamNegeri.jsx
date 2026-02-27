import React from "react";

export default function DalamNegeri() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700 p-6 animate-in fade-in duration-500">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Data Per Unit Kerja - Dalam Negeri</h2>
            <details className="group bg-slate-50 border-slate-200 border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-100 transition-colors list-none">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-slate-800 uppercase text-medium tracking-wider">Biro Sumber Daya Manusia</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4 text-slate-400 group-open:rotate-180 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </summary>

                <div className="p-6 bg-white border-t border-slate-200 space-y-6">
                    {/* Grid Info Satker */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-[14px]">
                        <div>
                            <p className="font-bold text-slate-400 uppercase mb-1">📍 Alamat</p>
                            <p className="text-slate-600 leading-relaxed">Jl. Pejambon</p>
                        </div>
                        <div>
                            <p className="font-bold text-slate-400 uppercase mb-1">📞 Kontak</p>
                            <p className="text-slate-700 font-semibold">0291839081021</p>
                            <p className="text-slate-500 italic">Fax: 021 938 423</p>
                        </div>
                        <div>
                            <p className="font-bold text-slate-400 uppercase mb-1">🌐 Digital</p>
                            <p className="text-sky-600 font-bold underline cursor-pointer">email@gmail.com</p>
                            <p className="text-slate-400 truncate">kemlu.com</p>
                        </div>
                        <div>
                            <p className="font-bold text-slate-400 uppercase mb-1">⏰ Operasional</p>
                            <p className="text-slate-700">08.00 - 16.00 WIB</p>
                            <p className="text-emerald-600 font-bold">2 Jam</p>
                        </div>
                    </div>

                    {/* Data Pegawai */}
                    <details className="group/pegawai border border-sky-100 rounded-lg overflow-hidden">
                        <summary className="bg-sky-50 p-3 flex justify-between items-center cursor-pointer hover:bg-sky-100 list-none select-none">
                            <span className="text-[12px] font-bold text-sky-700 uppercase flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                </svg>
                                Daftar Personel 134
                            </span>
                            <span className="text-sky-400 text-[11px] font-bold uppercase group-open/pegawai:hidden">Klik Detail</span>
                        </summary>

                        <div className="bg-white overflow-x-auto">
                            <table className="w-full text-left text-[11px] border-collapse">
                                <thead className="text-[14px] bg-slate-50/50 border-b border-slate-100 text-slate-500">
                                    <tr>
                                        <th className="p-3 w-10 text-center font-bold">NO</th>
                                        <th className="p-3 font-bold uppercase">Nama Lengkap / NIP</th>
                                        <th className="p-3 font-bold uppercase">Jabatan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                        <tr className="hover:bg-sky-50/30 transition-colors">
                                            <td className="p-3 text-center text-slate-400 font-bold">1</td>
                                            <td className="p-3">
                                                <div className="text-[14px] font-bold text-slate-700 uppercase">Adam Malik</div>
                                                <div className="text-[14px] font-mono text-slate-400">198502122015031001</div>
                                            </td>
                                            <td className="text-[14px] p-3 text-slate-500 italic">Orang Jago</td>
                                        </tr>
                                </tbody>
                            </table>
                        </div>
                    </details>
                </div>
            </details>
        </div>
    );
}
