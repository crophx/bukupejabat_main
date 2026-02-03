import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UnitKerja() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUnits();
    }, []);

    const fetchUnits = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/unit-kerja",
            );
            console.log("Cek hasil API:", response.data); // LIHAT DI CONSOLE BROWSER (F12)

            // Gunakan pengecekan bertingkat
            const result = response.data.data || response.data;

            if (Array.isArray(result)) {
                setUnits(result);
            } else if (result && result.emp) {
                // Jika strukturnya mirip API pegawai sebelumnya
                setUnits(result.emp);
            }
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">
                        Daftar Unit Kerja
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                        Total {units.length} unit tersedia
                    </p>
                </div>
                <button
                    onClick={fetchUnits}
                    className="btn btn-sm btn-ghost text-sky-600"
                >
                    ↻ Refresh
                </button>
            </div>

            {/* Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                        <tr>
                            <th className="p-4 border-b border-slate-100 w-16 text-center">
                                No
                            </th>
                            <th className="p-4 border-b border-slate-100">
                                Kode Unit
                            </th>
                            <th className="p-4 border-b border-slate-100">
                                Nama Unit Kerja
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="p-10 text-center">
                                    <span className="loading loading-spinner text-info"></span>
                                    <p className="text-xs mt-2 text-slate-400">
                                        Memuat data unit...
                                    </p>
                                </td>
                            </tr>
                        ) : units.length > 0 ? (
                            units.map((unit, index) => (
                                <tr
                                    key={unit.id || index}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="p-4 text-sm text-center text-slate-500">
                                        {index + 1}
                                    </td>
                                    <td className="p-4 text-sm font-mono text-sky-600 font-medium">
                                        {unit.kode_unit_kerja || "N/A"}
                                    </td>
                                    <td className="p-4 text-sm font-semibold text-slate-700">
                                        {unit.nama_unit_kerja}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="p-10 text-center text-slate-400 italic"
                                >
                                    Belum ada data unit kerja.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
