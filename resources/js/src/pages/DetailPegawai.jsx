import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

export default function UnitKerja() {
    const navigate = useNavigate(); // Inisialisasi navigate
    const [units, setUnits] = useState([
        {
            id: 1,
            nip: "91477889203802",
            nama_pegawai: "Solahuddin Wahid",
            jabatan: "Imam Taraweh",
            telepon: "0212345678",
            alamat: "Jl. Taman Pejambon No.6, Jakarta Pusat"
        },
        {
            id: 2,
            nip: "91477889203802",
            nama_pegawai: "Iwan Fals",
            jabatan: "Penyanyi",
            telepon: "0212345679",
            alamat: "Jl. Taman Pejambon No.6, Jakarta Pusat"
        },
        {
            id: 3,
            nip: "91477889203802",
            nama_pegawai: "Anggun C. Sasmi",
            jabatan: "Penyanyi",
            telepon: "0212345680",
            alamat: "Jl. Taman Pejambon No.6, Jakarta Pusat"
        },
        {
            id: 4,
            nip: "91477889203802",
            nama_pegawai: "Leon S. Kennedy",
            jabatan: "Poni Lempar",
            telepon: "0212345681",
            alamat: "Jl. Taman Pejambon No.6, Jakarta Pusat"
        },
        {
            id: 5,
            nip: "91477889203802",
            nama_pegawai: "Windah Basudara",
            jabatan: "Tukang Absen",
            telepon: "0212345682",
            alamat: "Jl. Taman Pejambon No.6, Jakarta Pusat"
        }
    ]);
    const [loading, setLoading] = useState(false);

    // pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; 

    // derive displayed units for current page
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentUnits = units.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(units.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    useEffect(() => {
        // fetchUnits();
    }, []);

    const fetchUnits = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/detail-pegawai",
            );
            const result = response.data.data || response.data;
            if (Array.isArray(result)) {
                setUnits(result);
            } else if (result && result.emp) {
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
                        Detail Pegawai
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                        Total {units.length} unit tersedia
                    </p>
                </div>
                
                {/* Tombol Back menggantikan tombol Refresh */}
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-sm btn-ghost text-slate-500 hover:text-slate-800 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Kembali
                </button>
            </div>

            {/* Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                        <tr>
                            <th className="p-4 border-b border-slate-100 w-12 text-center">No</th>
                            <th className="p-4 border-b border-slate-100">NIP</th>
                            <th className="p-4 border-b border-slate-100">Nama</th>
                            <th className="p-4 border-b border-slate-100">Jabatan</th>
                            <th className="p-4 border-b border-slate-100">No. Telepon</th>
                            <th className="p-4 border-b border-slate-100 w-20 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="p-10 text-center">
                                    <span className="loading loading-spinner text-info"></span>
                                    <p className="text-xs mt-2 text-slate-400">Memuat data unit...</p>
                                </td>
                            </tr>
                        ) : units.length > 0 ? (
                            currentUnits.map((unit, index) => (
                                <tr key={unit.id || index} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-sm text-center text-slate-500">
                                        {indexOfFirst + index + 1}
                                    </td>
                                    <td className="p-4 text-sm font-mono text-sky-600 font-medium">
                                        {unit.nip || "N/A"}
                                    </td>
                                    <td className="p-4 text-sm font-mono text-sky-600 font-medium">
                                        {unit.nama_pegawai || "N/A"}
                                    </td>
                                    <td className="p-4 text-sm font-semibold text-slate-700">
                                        {unit.jabatan || "-"}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {unit.telepon || "-"}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="btn btn-sm btn-square btn-ghost text-sky-500 hover:bg-amber-50">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-10 text-center text-slate-400 italic">Belum ada data unit kerja.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {units.length > itemsPerPage && (
                <div className="p-4 border-t border-slate-100 flex justify-center items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn btn-xs btn-outline"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => handlePageChange(idx + 1)}
                            className={`btn btn-xs ${currentPage === idx + 1 ? "btn-primary" : "btn-outline"}`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn btn-xs btn-outline"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}