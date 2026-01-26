import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";

export default function TableCard() {
    // 1. State Data Utama
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. State Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Batas 10 data per halaman

    // 3. State Modal
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // Ambil data saat pertama kali load
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/pegawai",
            );
            // Ambil data dari pembungkus 'emp'
            const allData = response.data.data.emp || [];
            setData(allData);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIKA PAGINATION ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Potong data sesuai halaman aktif
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-info"></span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700 font-sans">
            {/* Header Card */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-slate-800">
                        Data Pegawai
                    </h2>
                    <span className="text-xs text-slate-500">
                        Total {data.length} pegawai
                    </span>
                </div>
                <button
                    onClick={fetchData}
                    className="btn btn-sm btn-ghost text-slate-500 hover:bg-slate-100"
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
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* Tabel */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                        <tr>
                            <th className="p-4 border-b border-slate-100">
                                No
                            </th>
                            <th className="p-4 border-b border-slate-100">
                                NIP / Nama
                            </th>
                            <th className="p-4 border-b border-slate-100">
                                Jabatan & Unit
                            </th>
                            <th className="p-4 border-b border-slate-100">
                                Kontak
                            </th>
                            <th className="p-4 border-b border-slate-100 text-center">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {currentItems.length > 0 ? (
                            currentItems.map((r, index) => {
                                // Hitung nomor urut asli berdasarkan halaman
                                const realNumber = indexOfFirstItem + index + 1;

                                return (
                                    <tr
                                        key={index}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="p-4 text-sm text-slate-500 w-12">
                                            {realNumber}
                                        </td>

                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 text-sm">
                                                    {r.nama}
                                                </span>
                                                <span className="text-xs text-slate-500 font-mono mt-0.5">
                                                    {r.nip}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex flex-col max-w-xs">
                                                <span
                                                    className="text-sm font-semibold text-slate-700 truncate"
                                                    title={r.Jabatan}
                                                >
                                                    {r.Jabatan || "-"}
                                                </span>
                                                <span
                                                    className="text-xs text-slate-500 truncate"
                                                    title={r.ket_unker}
                                                >
                                                    {r.ket_unker || "-"}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 text-sm text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        className="w-3 h-3 text-slate-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                        ></path>
                                                    </svg>
                                                    {r.no_hp || "-"}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        className="w-3 h-3 text-slate-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                        ></path>
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                        ></path>
                                                    </svg>
                                                    {r.LokasiKerjaName || "-"}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4 text-center">
                                            <div className="inline-flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedRow(r);
                                                        setEditOpen(true);
                                                    }}
                                                    className="btn btn-sm btn-square btn-ghost text-amber-500 hover:bg-amber-50"
                                                    title="Edit"
                                                >
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
                                                <button
                                                    onClick={() => {
                                                        setSelectedRow(r);
                                                        setDeleteOpen(true);
                                                    }}
                                                    className="btn btn-sm btn-square btn-ghost text-rose-500 hover:bg-rose-50"
                                                    title="Hapus"
                                                >
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
                                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="p-8 text-center text-slate-400"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="size-10"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM12 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                                            />
                                        </svg>
                                        <span>Tidak ada data pegawai.</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between p-4 border-t border-slate-100">
                <span className="text-sm text-slate-500">
                    Menampilkan {indexOfFirstItem + 1} -{" "}
                    {Math.min(indexOfLastItem, data.length)} dari {data.length}{" "}
                    data
                </span>

                <div className="join">
                    <button
                        className="join-item btn btn-sm btn-outline"
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                    >
                        «
                    </button>
                    <button className="join-item btn btn-sm btn-outline no-animation">
                        Halaman {currentPage}
                    </button>
                    <button
                        className="join-item btn btn-sm btn-outline"
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                    >
                        »
                    </button>
                </div>
            </div>

            {/* Modal Components */}
            <Modal
                open={isEditOpen}
                onClose={() => setEditOpen(false)}
                title="Edit Data"
            >
                {selectedRow && (
                    <EditForm
                        initialData={selectedRow}
                        onCancel={() => setEditOpen(false)}
                    />
                )}
            </Modal>

            <ConfirmModal
                open={isDeleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={() => {
                    // Logika hapus dummy
                    setData((prev) =>
                        prev.filter((item) => item !== selectedRow),
                    );
                    setDeleteOpen(false);
                }}
                message={`Yakin ingin menghapus ${selectedRow?.nama}?`}
            />
        </div>
    );
}

// Form Edit Sederhana
function EditForm({ initialData, onCancel }) {
    return (
        <div className="p-1">
            <div className="grid gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nama Lengkap
                    </label>
                    <input
                        type="text"
                        defaultValue={initialData.nama}
                        className="input input-bordered input-sm w-full"
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Jabatan
                    </label>
                    <input
                        type="text"
                        defaultValue={initialData.Jabatan}
                        className="input input-bordered input-sm w-full"
                        readOnly
                    />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <button onClick={onCancel} className="btn btn-sm btn-ghost">
                    Batal
                </button>
                <button onClick={onCancel} className="btn btn-sm btn-primary">
                    Simpan (Dummy)
                </button>
            </div>
        </div>
    );
}
