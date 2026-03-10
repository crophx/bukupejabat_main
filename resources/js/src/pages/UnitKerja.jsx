import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UnitKerja() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);

    // pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // --- STATE UNTUK MODAL EDIT ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Sesuaikan state dengan semua kolom di database
    const [editData, setEditData] = useState({
        id: "",
        kode_unit_kerja: "",
        nama_unit_kerja: "",
        alamat: "",
        telepon: "",
        fax: "",
        email: "",
        website: "",
        hari_kerja: "",
        beda_jam: "",
        deskripsi: "",
    });

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentUnits = units.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(units.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

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

    const openEditModal = (unit) => {
        setEditData({
            id: unit.id,
            kode_unit_kerja: unit.kode_unit_kerja || "",
            nama_unit_kerja: unit.nama_unit_kerja || "",
            alamat: unit.alamat || "",
            telepon: unit.telepon || "",
            fax: unit.fax || "",
            email: unit.email || "",
            website: unit.website || "",
            hari_kerja: unit.hari_kerja || "",
            beda_jam: unit.beda_jam || "",
            deskripsi: unit.deskripsi || "",
        });
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await axios.put(
                `http://127.0.0.1:8000/api/unit-kerja/${editData.id}`,
                editData,
            );
            setIsEditModalOpen(false);
            fetchUnits();
        } catch (error) {
            console.error("Gagal mengupdate data:", error);
            alert(
                "Gagal menyimpan data. Silakan periksa koneksi atau console.",
            );
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700 relative">
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

            {/* Content Tabel */}
            <div className="overflow-x-auto">
                {/* Perbaikan utama ada di tag table ini dan isinya:
                  - whitespace-nowrap secara default untuk mencegah teks tumpang tindih
                */}
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                        <tr>
                            <th className="px-4 py-4 border-b border-slate-100 w-12 text-center">
                                No
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100">
                                Kode
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100">
                                Nama Unit Kerja
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100">
                                Email
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100">
                                Telepon
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100">
                                Alamat
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100">
                                Website
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100 w-16 text-center sticky right-0 bg-slate-50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] z-10">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="p-10 text-center">
                                    <span className="loading loading-spinner text-sky-500"></span>
                                    <p className="text-xs mt-2 text-slate-400">
                                        Memuat data unit...
                                    </p>
                                </td>
                            </tr>
                        ) : units.length > 0 ? (
                            currentUnits.map((unit, index) => (
                                <tr
                                    key={unit.id || index}
                                    className="hover:bg-sky-50/40 transition-colors group align-middle"
                                >
                                    <td className="px-4 py-3 text-sm text-center text-slate-500">
                                        {indexOfFirst + index + 1}
                                    </td>

                                    <td className="px-4 py-3 text-sm font-mono text-sky-600 font-medium">
                                        {unit.kode_unit_kerja || "-"}
                                    </td>

                                    {/* Mencegah patah secara tidak wajar, berikan min-width agar luas */}
                                    <td className="px-4 py-3 text-sm font-bold text-slate-700 whitespace-normal min-w-[250px] leading-snug">
                                        {unit.nama_unit_kerja || "-"}
                                    </td>

                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {unit.email || "-"}
                                    </td>

                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {unit.telepon || "-"}
                                    </td>

                                    {/* Truncate untuk Alamat dan Website agar tidak merusak lebar tabel */}
                                    <td
                                        title={unit.alamat || "-"}
                                        className="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate"
                                    >
                                        {unit.alamat || "-"}
                                    </td>

                                    <td
                                        title={unit.website || "-"}
                                        className="px-4 py-3 text-sm text-sky-600 max-w-[150px] truncate"
                                    >
                                        {unit.website || "-"}
                                    </td>

                                    {/* Kolom Aksi menempel di kanan (sticky) */}
                                    <td className="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-[#f6fbff] transition-colors shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.03)] z-10">
                                        <button
                                            onClick={() => openEditModal(unit)}
                                            className="btn btn-sm btn-square btn-ghost text-amber-500 hover:bg-amber-100"
                                            title="Edit Unit Kerja"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="size-4"
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
                                    colSpan="8"
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

            {/* --- KOMPONEN MODAL EDIT --- */}
            {isEditModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    onClick={() => setIsEditModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl p-6 text-slate-800 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">
                            Edit Unit Kerja
                        </h3>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Kode Unit Kerja
                                    </label>
                                    <input
                                        type="text"
                                        name="kode_unit_kerja"
                                        value={editData.kode_unit_kerja}
                                        onChange={handleInputChange}
                                        className="input input-sm w-full bg-white text-slate-800 border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Nama Unit Kerja
                                    </label>
                                    <input
                                        type="text"
                                        name="nama_unit_kerja"
                                        value={editData.nama_unit_kerja}
                                        onChange={handleInputChange}
                                        className="input input-sm w-full bg-slate-50 text-slate-800 border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editData.email}
                                        onChange={handleInputChange}
                                        className="input input-sm w-full bg-white text-slate-800 border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Telepon
                                    </label>
                                    <input
                                        type="text"
                                        name="telepon"
                                        value={editData.telepon}
                                        onChange={handleInputChange}
                                        className="input input-sm w-full bg-white text-slate-800 border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Fax
                                    </label>
                                    <input
                                        type="text"
                                        name="fax"
                                        value={editData.fax}
                                        onChange={handleInputChange}
                                        className="input input-sm w-full bg-white text-slate-800 border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Website
                                    </label>
                                    <input
                                        type="text"
                                        name="website"
                                        value={editData.website}
                                        onChange={handleInputChange}
                                        className="input input-sm w-full bg-white text-slate-800 border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Hari Kerja
                                    </label>
                                    <input
                                        type="text"
                                        name="hari_kerja"
                                        value={editData.hari_kerja}
                                        onChange={handleInputChange}
                                        className="input input-sm w-full bg-white text-slate-800 border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                        placeholder="Cth: Senin - Jumat"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Beda Jam
                                    </label>
                                    <input
                                        type="text"
                                        name="beda_jam"
                                        value={editData.beda_jam}
                                        onChange={handleInputChange}
                                        className="input input-sm w-full bg-white text-slate-800 border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Alamat
                                </label>
                                <textarea
                                    name="alamat"
                                    value={editData.alamat}
                                    onChange={handleInputChange}
                                    className="textarea w-full bg-white text-slate-800 border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                    rows="2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Deskripsi
                                </label>
                                <textarea
                                    name="deskripsi"
                                    value={editData.deskripsi}
                                    onChange={handleInputChange}
                                    className="textarea w-full bg-white text-slate-800 border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                    rows="3"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="btn btn-sm btn-ghost text-slate-500 hover:bg-slate-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="btn btn-sm bg-sky-500 hover:bg-sky-600 text-white border-none"
                                >
                                    {isUpdating
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
