import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";

export default function TableCard() {
    // 1. State Utama
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // 2. State Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 3. State Modal
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // Ambil data dari API saat pertama kali load
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Mengambil data dari API Laravel lokal Anda
            const response = await axios.get("http://127.0.0.1:8000/api/pegawai");
            // Sesuai struktur JSON: response.data.data.emp
            const allData = response.data.data.emp || [];
            setData(allData);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIKA SEARCH ---
    const filteredData = data.filter((item) => {
        const searchStr = searchTerm.toLowerCase();
        return (
            item.nama?.toLowerCase().includes(searchStr) ||
            item.nip?.toString().toLowerCase().includes(searchStr) ||
            item.Jabatan?.toString().toLowerCase().includes(searchStr) ||
            item.ket_unker?.toString().toLowerCase().includes(searchStr) ||
            item.eselon?.toString().toLowerCase().includes(searchStr) 
        );
    });

    // --- LOGIKA PAGINATION ---
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // --- LOGIKA GENERATE ANGKA HALAMAN (PAGINATION) ---
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-sm border border-slate-200">
                <span className="loading loading-spinner loading-lg text-info"></span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700 font-sans">

            {/* Header: Judul (Kiri) & Search/Refresh (Kanan) */}
            <div className="flex flex-col md:flex-row items-center justify-between p-5 border-b border-slate-100 gap-4">
                <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-slate-800">Data Pegawai</h2>
                    <span className="text-xs text-slate-500">
                        {searchTerm ? `Ditemukan ${filteredData.length} hasil` : `Total ${data.length} pegawai`}
                    </span>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button
                        onClick={fetchData}
                        className="btn btn-sm btn-ghost text-slate-500 hover:bg-slate-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Refresh
                    </button>

                    <label className="input input-sm bg-white border border-slate-300 text-slate-600 rounded-xl flex items-center gap-2 focus-within:border-sky-500 transition-all w-full md:w-64">
                        <svg className="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input
                            type="search"
                            placeholder="Cari nama atau NIP..."
                            className="grow"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </label>
                </div>
            </div>

            {/* Tabel */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                        <tr>
                            <th className="p-4 border-b border-slate-100">No</th>
                            <th className="p-4 border-b border-slate-100">NIP / Nama</th>
                            <th className="p-4 border-b border-slate-100">Jabatan & Unit</th>
                            <th className="p-4 border-b border-slate-100">Kontak</th>
                            <th className="p-4 border-b border-slate-100 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {currentItems.length > 0 ? (
                            currentItems.map((r, index) => {
                                const realNumber = indexOfFirstItem + index + 1;
                                return (
                                    <tr key={r.nip || index} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-sm text-slate-500 w-12">{realNumber}</td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 text-sm">{r.nama}</span>
                                                <span className="text-xs text-slate-500 font-mono mt-0.5">{r.nip?.trim()}</span>
                                                <span className="text-xs text-slate-500 font-mono mt-0.5">{r.eselon?.trim()}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col max-w-xs">
                                                <span className="text-sm font-semibold text-slate-700 truncate" title={r.Jabatan}>{r.Jabatan || "-"}</span>
                                                <span className="text-xs text-slate-500 truncate" title={r.ket_unker}>{r.ket_unker || "-"}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            <div className="flex flex-col gap-1">
                                                <span>📞 {r.no_hp && r.no_hp !== "-" ? r.no_hp : <span className="font-style: italic text-slate-400 font-semibold" >Nomor belum diisi</span>}</span>
                                                <span>📍 {r.LokasiKerjaName || "Tidak tersedia"}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="inline-flex gap-2">
                                                <button onClick={() => { setSelectedRow(r); setEditOpen(true); }} className="btn btn-sm btn-square btn-ghost text-amber-500 hover:bg-amber-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => { setSelectedRow(r); setDeleteOpen(true); }} className="btn btn-sm btn-square btn-ghost text-rose-500 hover:bg-rose-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-400 font-medium italic">
                                    Data tidak ditemukan...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-600 font-medium">
                        Menampilkan {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, data.length)} dari {data.length} pegawai
                    </span>
                    <span className="text-xs text-slate-500">
                        Halaman {currentPage} dari {totalPages}
                    </span>
                </div>

                <div className="flex items-center justify-center gap-1 flex-wrap">
                    <button onClick={handlePrev} disabled={currentPage === 1} className="px-3 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
                        ← Sebelumnya
                    </button>

                    {getPageNumbers().map((page, idx) => (
                        <button
                            key={idx}
                            onClick={() => typeof page === 'number' && setCurrentPage(page)}
                            disabled={page === '...'}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${page === currentPage
                                ? 'bg-blue-600 text-white'
                                : page === '...'
                                    ? 'text-slate-400 cursor-default'
                                    : 'border border-slate-300 text-slate-600 hover:bg-slate-300'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button onClick={handleNext} disabled={currentPage === totalPages} className="px-3 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
                        Selanjutnya →
                    </button>
                </div>
            </div>


            {/* Modal Components */}
            <Modal open={isEditOpen} onClose={() => setEditOpen(false)} title="Edit Pegawai">
                {selectedRow && (
                    <EditForm initialData={selectedRow} onCancel={() => setEditOpen(false)} onSave={() => setEditOpen(false)} />
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
function EditForm({ initialData, onCancel, onSave }) {
    const [form, setForm] = useState({ ...initialData });

    const handleInputChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave && onSave(form); }} className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Nama
                    </label>
                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={form.nama || ""} onChange={(e) => handleInputChange("nama", e.target.value)} placeholder="Masukkan nama"/>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        NIP
                    </label>
                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={form.nip || ""} onChange={(e) => handleInputChange("nip", e.target.value)} placeholder="Masukkan NIP"/>
                </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Unit Kerja
                    </label>
                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={form.ket_unker || ""} onChange={(e) => handleInputChange("ket_unker", e.target.value)} placeholder="Masukkan unit kerja" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Jabatan
                    </label>
                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={form.Jabatan || ""} onChange={(e) => handleInputChange("Jabatan", e.target.value)} placeholder="Masukkan jabatan"/>
                </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        No. Telepon
                    </label>
                    <input type="tel" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={form.no_hp || ""} onChange={(e) => handleInputChange("no_hp", e.target.value)} placeholder="Masukkan nomor telepon" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2"> Lokasi
                    </label>
                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={form.LokasiKerjaName || ""} onChange={(e) => handleInputChange("LokasiKerjaName", e.target.value)} placeholder="Masukkan lokasi" />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium">
                    Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Simpan Perubahan
                </button>
            </div>
        </form>
    );
}