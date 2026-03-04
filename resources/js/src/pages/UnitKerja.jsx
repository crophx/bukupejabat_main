import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UnitKerja() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);

    // pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // derive displayed units for current page
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentUnits = units.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(units.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // --- LOGIKA SMART PAGINATION (Sama seperti Data Pegawai) ---
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    const fetchUnits = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/unit-kerja",
            );
            const result = response.data.data || [];
            setUnits(result);
            setCurrentPage(1);
        } catch (error) {
            console.error("Gagal mengambil data unit kerja:", error);
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
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchUnits}
                        className="btn btn-sm btn-ghost text-sky-600 hover:bg-sky-50"
                    >
                        ↻ Refresh
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                        <tr>
                            <th className="p-4 border-b border-slate-100 w-12 text-center">
                                No
                            </th>
                            <th className="p-4 border-b border-slate-100">
                                Kode Unit Kerja
                            </th>
                            <th className="p-4 border-b border-slate-100">
                                Nama Unit Kerja
                            </th>
                            <th className="p-4 border-b border-slate-100">
                                Email
                            </th>
                            <th className="p-4 border-b border-slate-100">
                                Telepon
                            </th>
                            <th className="p-4 border-b border-slate-100">
                                Alamat
                            </th>
                            <th className="p-4 border-b border-slate-100 w-20 text-center">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="p-10 text-center">
                                    <span className="loading loading-spinner text-info"></span>
                                    <p className="text-xs mt-2 text-slate-400">
                                        Memuat data unit...
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
                                        {unit.kode_unit_kerja || "N/A"}
                                    </td>
                                    <td className="p-4 text-sm font-semibold text-slate-700">
                                        {unit.deskripsi ||
                                            unit.nama_unit_kerja ||
                                            "-"}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {unit.email || "-"}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {unit.telepon || "-"}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {unit.alamat || "-"}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="btn btn-sm btn-square btn-ghost text-amber-500 hover:bg-amber-50">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="size-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="p-10 text-center text-slate-400 italic"
                                >
                                    Belum ada data unit kerja.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            {units.length > 0 && (
                <div className="p-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-sm text-slate-500">
                        Menampilkan {indexOfFirst + 1} -{" "}
                        {Math.min(indexOfLast, units.length)} dari{" "}
                        {units.length} unit
                    </span>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="btn btn-xs btn-outline"
                        >
                            Prev
                        </button>

                        {/* Render Smart Pagination */}
                        {getPageNumbers().map((page, idx) => (
                            <button
                                key={idx}
                                onClick={() =>
                                    typeof page === "number" &&
                                    handlePageChange(page)
                                }
                                disabled={page === "..."}
                                className={`btn btn-xs ${
                                    page === currentPage
                                        ? "bg-sky-500 text-white border-sky-500 hover:bg-sky-600"
                                        : page === "..."
                                          ? "btn-outline border-transparent text-slate-400 cursor-default hover:bg-transparent"
                                          : "btn-outline text-slate-500"
                                }`}
                            >
                                {page}
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
                </div>
            )}
        </div>
    );
}
