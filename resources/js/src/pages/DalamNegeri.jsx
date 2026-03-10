import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DalamNegeri() {
    const navigate = useNavigate();
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);

    // State untuk Pencarian dan Pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Menampilkan 10 unit per halaman

    // Ambil data saat halaman dibuka
    useEffect(() => {
        fetchDalamNegeri();
    }, []);

    const fetchDalamNegeri = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/unit-kerja/dalam-negeri",
            );
            setUnits(response.data.data || []);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    // 1. Logika Filter (Pencarian)
    const filteredUnits = units.filter((unit) => {
        const searchString = searchTerm.toLowerCase();
        const nama = (unit.nama_unit_kerja || "").toLowerCase();
        const deskripsi = (unit.deskripsi || "").toLowerCase();
        return nama.includes(searchString) || deskripsi.includes(searchString);
    });

    // Reset halaman ke 1 setiap kali user mengetik di kotak pencarian
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // 2. Logika Pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentUnits = filteredUnits.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // Smart Pagination (1 2 3 ... 10)
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

    return (
        <div className="space-y-6 min-h-screen">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700 p-6 animate-in fade-in duration-500">
                {/* Header dengan Pencarian */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight whitespace-nowrap">
                        Data Per Unit Kerja - Dalam Negeri
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* Kotak Pencarian */}
                        <div className="relative w-full sm:w-64">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Cari unit kerja..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full bg-slate-50"
                            />
                        </div>

                        <button className="p-2 px-4 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200 hover:border-rose-300 flex items-center justify-center gap-2 group whitespace-nowrap">
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
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                />
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-tight">
                                Unduh PDF
                            </span>
                        </button>
                    </div>
                </div>

                {/* Looping Data (Menggunakan currentUnits) */}
                {loading ? (
                    <div className="text-center p-10">
                        <span className="loading loading-spinner text-sky-500"></span>
                        <p className="text-sm mt-2 text-slate-400">
                            Memuat data unit...
                        </p>
                    </div>
                ) : currentUnits.length > 0 ? (
                    currentUnits.map((unit) => (
                        <details
                            key={unit.id}
                            className="group mb-4 bg-slate-50 border-slate-200 border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                        >
                            <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-100 transition-colors list-none">
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-slate-800 uppercase text-medium tracking-wider">
                                        {unit.deskripsi || unit.nama_unit_kerja}
                                    </span>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2.5}
                                    stroke="currentColor"
                                    className="size-4 text-slate-400 group-open:rotate-180 transition-transform"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            </summary>

                            <div className="p-6 bg-white border-t border-slate-200 space-y-6">
                                <div className="flex flex-wrap md:flex-nowrap justify-between gap-6 text-[14px] items-start">
                                    <div className="flex-1 min-w-[150px]">
                                        <p className="font-bold text-slate-400 uppercase mb-1">
                                            Alamat
                                        </p>
                                        <p className="text-slate-600 leading-relaxed">
                                            {unit.alamat || "-"}
                                        </p>
                                    </div>
                                    <div className="flex-1 min-w-[150px]">
                                        <p className="font-bold text-slate-400 uppercase mb-1">
                                            Kontak
                                        </p>
                                        <p className="text-slate-700 font-semibold">
                                            {unit.telepon || "-"}
                                        </p>
                                        <p className="text-slate-500 italic text-xs">
                                            Fax: {unit.fax || "-"}
                                        </p>
                                    </div>
                                    <div className="flex-1 min-w-[150px]">
                                        <p className="font-bold text-slate-400 uppercase mb-1">
                                            Digital
                                        </p>
                                        <p className="text-sky-600 font-bold underline">
                                            {unit.email || "-"}
                                        </p>
                                        <p className="text-slate-400">
                                            {unit.website || "-"}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    onClick={() =>
                                        navigate(`/detail-pegawai/${unit.id}`)
                                    }
                                    className="bg-sky-50 border border-sky-100 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-sky-100"
                                >
                                    <span className="text-[12px] font-bold text-sky-700 uppercase">
                                        Daftar Personel (
                                        {unit.pegawai_count || 0})
                                    </span>
                                    <span className="text-sky-400 text-[11px] font-bold uppercase">
                                        Klik Detail ➔
                                    </span>
                                </div>
                            </div>
                        </details>
                    ))
                ) : (
                    <div className="text-center p-10 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        Tidak ada unit kerja yang ditemukan.
                    </div>
                )}

                {/* Pagination Controls */}
                {filteredUnits.length > 0 && (
                    <div className="pt-4 mt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <span className="text-sm text-slate-500">
                            Menampilkan {indexOfFirst + 1} -{" "}
                            {Math.min(indexOfLast, filteredUnits.length)} dari{" "}
                            {filteredUnits.length} unit
                        </span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="btn btn-xs btn-outline"
                            >
                                Prev
                            </button>
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
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                                className="btn btn-xs btn-outline"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
