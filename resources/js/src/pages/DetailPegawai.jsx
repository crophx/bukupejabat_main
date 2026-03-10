import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function DetailPegawai() {
    const navigate = useNavigate();
    const { unitId } = useParams();

    const [units, setUnits] = useState([]);
    const [unitName, setUnitName] = useState(""); // State baru untuk menyimpan nama unit
    const [loading, setLoading] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentUnits = units.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(units.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const openEditModal = (unit) => {
        setSelectedUnit(unit);
        document.getElementById("modal_edit_pegawai").showModal();
    };

    useEffect(() => {
        if (unitId) {
            fetchPegawai();
        }
    }, [unitId]);

    const fetchPegawai = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/pegawai/unit/${unitId}`,
            );
            setUnits(response.data.data || []);
            setUnitName(response.data.unit_nama || ""); // Tangkap nama unit dari Laravel
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
                    {/* TAMPILKAN NAMA UNIT KERJA DI SINI */}
                    <h2 className="text-lg font-bold text-slate-800 uppercase">
                        Detail Pegawai{" "}
                        {unitName && (
                            <span className="text-sky-600"> - {unitName}</span>
                        )}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                        Total {units.length} pegawai ditemukan
                    </p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-sm btn-ghost text-slate-500 hover:text-slate-800 flex items-center gap-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                        />
                    </svg>
                    Kembali
                </button>
            </div>

            {/* Content Tabel */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                        <tr>
                            <th className="p-4 border-b border-slate-100 w-12 text-center">
                                No
                            </th>
                            <th className="p-4 border-b border-slate-100">
                                NIP
                            </th>
                            <th className="p-4 border-b border-slate-100">
                                Nama Lengkap
                            </th>
                            <th className="p-4 border-b border-slate-100">
                                Jabatan
                            </th>
                            <th className="p-4 border-b border-slate-100">
                                Telepon
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="p-10 text-center">
                                    <span className="loading loading-spinner text-sky-500"></span>
                                    <p className="text-xs mt-2 text-slate-400">
                                        Memuat data pegawai...
                                    </p>
                                </td>
                            </tr>
                        ) : units.length > 0 ? (
                            currentUnits.map((unit, index) => (
                                <tr
                                    key={unit.id || index}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="p-4 text-sm text-center text-slate-500">
                                        {indexOfFirst + index + 1}
                                    </td>
                                    <td className="p-4 text-sm font-mono text-sky-600 font-medium">
                                        {unit.nip || "-"}
                                    </td>
                                    <td className="p-4 text-sm font-bold text-slate-700 uppercase">
                                        {unit.nama_pegawai || "-"}
                                    </td>
                                    <td className="p-4 text-sm font-semibold text-slate-500">
                                        {unit.jabatan || "-"}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {unit.telepon || "-"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="p-10 text-center text-slate-400 italic"
                                >
                                    Belum ada pegawai di unit ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {units.length > 0 && (
                <div className="p-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-sm text-slate-500">
                        Menampilkan {indexOfFirst + 1} -{" "}
                        {Math.min(indexOfLast, units.length)} dari{" "}
                        {units.length}
                    </span>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="btn btn-xs btn-outline"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="btn btn-xs btn-outline"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
