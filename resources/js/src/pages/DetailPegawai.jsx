import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function DetailPegawai() {
    const navigate = useNavigate();
    const { unitId } = useParams();

    const [units, setUnits] = useState([]);
    const [unitName, setUnitName] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // STATE BARU UNTUK PENCARIAN
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // LOGIKA FILTER PENCARIAN (Berdasarkan nama, nip, atau jabatan)
    const filteredUnits = units.filter((unit) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (unit.nama_pegawai || "").toLowerCase().includes(searchLower) ||
            (unit.nip || "").toLowerCase().includes(searchLower) ||
            (unit.jabatan || "").toLowerCase().includes(searchLower)
        );
    });

    // Reset halaman ke 1 setiap kali user mengetik pencarian
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // PAGINATION SEKARANG MENGGUNAKAN filteredUnits
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentUnits = filteredUnits.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // FUNGSI BARU: Generate nomor halaman dengan ellipsis
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
            setUnitName(response.data.unit_nama || "");
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        const formData = new FormData(e.target);
        const data = {
            nama: formData.get("nama"),
            email: formData.get("email"),
            no_handphone: formData.get("no_handphone"),
            jabatan: formData.get("jabatan"),
            alamat: formData.get("alamat"),
        };

        try {
            await axios.put(
                `http://127.0.0.1:8000/api/pegawai/${selectedUnit.id}`,
                data,
            );
            document.getElementById("modal_edit_pegawai").close();
            fetchPegawai();
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            alert("Gagal menyimpan data. Silakan periksa koneksi.");
        } finally {
            setIsUpdating(false);
        }
    };

    const downloadPDF = () => {
        try {
            const doc = new jsPDF();

            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("LAPORAN DATA PEGAWAI", 14, 20);

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            const namaUnit = unitName ? unitName : "Semua Unit";
            doc.text(`Unit Kerja : ${namaUnit}`, 14, 28);
            // PDF juga menggunakan data yang sudah terfilter
            doc.text(`Total Data : ${filteredUnits.length} Pegawai`, 14, 34);

            const tableColumn = [
                "No",
                "NIP",
                "Nama Lengkap",
                "Email",
                "Jabatan",
                "Telepon",
            ];
            const tableRows = [];

            filteredUnits.forEach((unit, index) => {
                const rowData = [
                    index + 1,
                    unit.nip || "-",
                    unit.nama_pegawai || "-",
                    unit.email || "-",
                    unit.jabatan || "-",
                    unit.telepon || "-",
                ];
                tableRows.push(rowData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: "grid",
                styles: { fontSize: 10, cellPadding: 3 },
                headStyles: {
                    fillColor: [14, 165, 233],
                    textColor: [255, 255, 255],
                    fontStyle: "bold",
                },
                alternateRowStyles: { fillColor: [248, 250, 252] },
            });

            doc.save(`Laporan_Pegawai_${namaUnit.replace(/\s+/g, "_")}.pdf`);
        } catch (error) {
            console.error("Gagal membuat PDF:", error);
            alert(
                "Terjadi kesalahan saat membuat PDF. Coba periksa console browser.",
            );
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700 mb-5">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-base font-bold text-slate-800 uppercase mb-2">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="cursor-pointer hover:text-sky-600 transition-colors"
                        >
                            Detail Pegawai{" "}
                        </button>
                        {unitName && (
                            <span className="text-sky-600"> - {unitName}</span>
                        )}
                    </h2>

                    {/* Tombol Aksi di Header */}
                    <div className="flex items-center gap-1">
                        {/* Filter search */}
                        <div className="relative w-full sm:w-64 pt-1">
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
                            {/* INPUT PENCARIAN DIAKTIFKAN DI SINI */}
                            <input
                                type="text"
                                placeholder="Cari pegawai..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-1 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-[250px] bg-slate-50"
                            />
                        </div>

                        {/* Dropdown Export */}
                        {filteredUnits.length > 0 && (
                            <div className="dropdown dropdown-end">
                                <label
                                    tabIndex={0}
                                    className="btn btn-sm bg-sky-600 hover:bg-sky-700 border-none text-white rounded-xl flex items-center gap-2 shadow-sm px-4"
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
                                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                        />
                                    </svg>
                                    Unduh Data
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="size-4 opacity-50"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-[100] menu p-2 shadow-2xl bg-white border border-slate-100 rounded-2xl w-44 mt-2"
                                >
                                    <li className="menu-title text-[10px] uppercase tracking-widest text-slate-400 font-black">
                                        Format File
                                    </li>
                                    <li>
                                        <button
                                            onClick={downloadPDF}
                                            className="flex items-center gap-3 text-slate-600 hover:text-rose-600 font-medium"
                                        >
                                            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                                                <svg
                                                    className="size-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z" />
                                                </svg>
                                            </span>
                                            Dokumen PDF
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                /* logic excel */
                                            }}
                                            className="flex items-center gap-3 text-slate-600 hover:text-emerald-600 font-medium"
                                        >
                                            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                                                <svg
                                                    className="size-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                                </svg>
                                            </span>
                                            Excel (.xlsx)
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                /* logic csv */
                                            }}
                                            className="flex items-center gap-3 text-slate-600 hover:text-amber-600 font-medium"
                                        >
                                            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                                                <svg
                                                    className="size-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM8 18l-1-1 2-2-2-2 1-1 3 3-3 3zm7 0h-4v-2h4v2z" />
                                                </svg>
                                            </span>
                                            File CSV
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-2">
                        Total {filteredUnits.length} pegawai ditemukan
                    </p>
                </div>
            </div>

            {/* Content Tabel yang Sudah Dirapikan */}
            <div className="overflow-x-auto">
                {/* Tambahkan whitespace-nowrap agar tabel konsisten melebar jika diperlukan */}
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-black tracking-wider">
                        <tr>
                            <th className="px-4 py-4 border-b border-slate-100 w-12 text-center">
                                No
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100">
                                NIP
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100">
                                Nama Lengkap
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100">
                                Jabatan
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100">
                                Email
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100">
                                Telepon
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100 w-16 text-center sticky right-0 bg-slate-50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] z-10">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="p-10 text-center">
                                    <span className="loading loading-spinner text-sky-500"></span>
                                    <p className="text-xs mt-2 text-slate-400">
                                        Memuat data pegawai...
                                    </p>
                                </td>
                            </tr>
                        ) : filteredUnits.length > 0 ? (
                            currentUnits.map((unit, index) => (
                                <tr
                                    key={unit.id || index}
                                    className="hover:bg-sky-50/40 transition-colors group align-middle"
                                >
                                    <td className="px-4 py-3 text-sm text-center text-slate-400 font-bold">
                                        {indexOfFirst + index + 1}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-mono text-sky-600 font-medium">
                                        {unit.nip || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-bold text-slate-700 uppercase whitespace-normal min-w-[200px] leading-snug">
                                        {unit.nama_pegawai || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold text-slate-500 whitespace-normal min-w-[200px] leading-snug">
                                        {unit.jabatan || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-slate-500">
                                        {unit.email ? (
                                            <div
                                                className="tooltip tooltip-top"
                                                data-tip={unit.email}
                                            >
                                                <span className="cursor-help line-clamp-1 max-w-[150px] lowercase italic">
                                                    {unit.email}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-300">
                                                -
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {unit.telepon || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-[#f6fbff] transition-colors shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.03)] z-10">
                                        <button
                                            onClick={() => openEditModal(unit)}
                                            className="btn btn-sm btn-square btn-ghost text-amber-500 hover:bg-amber-100"
                                            title="Edit Pegawai"
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
                                    colSpan="7"
                                    className="p-10 text-center text-slate-400 italic"
                                >
                                    Pencarian tidak menemukan hasil.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls - HANYA BAGIAN INI YANG DIUBAH */}
            {filteredUnits.length > 0 && (
                <div className="p-4 border-t border-slate-100 flex justify-between items-center">
                    {/* Kiri: Tampilkan X per halaman */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        Tampilkan
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="select select-bordered select-xs text-slate-700 bg-slate-50 border-slate-300 focus:outline-none focus:border-sky-500"
                        >
                            {[10, 25, 50, 100].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                        per halaman
                    </div>

                    {/* Kanan: Tombol navigasi halaman */}
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

            {/* --- MODAL EDIT --- */}
            <dialog
                id="modal_edit_pegawai"
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box bg-white max-w-2xl rounded-3xl p-8 border border-slate-100 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-xl text-slate-800 tracking-tight uppercase">
                            Edit Data Pegawai
                        </h3>
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost text-slate-400">
                                ✕
                            </button>
                        </form>
                    </div>

                    <form className="space-y-5" onSubmit={handleUpdate}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="form-control">
                                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                                    NIP
                                </label>
                                <input
                                    type="text"
                                    value={selectedUnit?.nip || ""}
                                    className="input input-bordered w-full bg-slate-50 text-slate-500 border-slate-200 rounded-2xl text-sm font-semibold h-12"
                                    readOnly
                                />
                            </div>
                            <div className="form-control">
                                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    name="nama"
                                    defaultValue={
                                        selectedUnit?.nama_pegawai || ""
                                    }
                                    className="input input-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold h-12"
                                />
                            </div>
                            <div className="form-control">
                                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={selectedUnit?.email || ""}
                                    className="input input-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold h-12"
                                />
                            </div>
                            <div className="form-control">
                                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                                    No. Telepon
                                </label>
                                <input
                                    type="text"
                                    name="no_handphone"
                                    defaultValue={selectedUnit?.telepon || ""}
                                    className="input input-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold h-12"
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                                Jabatan
                            </label>
                            <input
                                type="text"
                                name="jabatan"
                                defaultValue={selectedUnit?.jabatan || ""}
                                className="input input-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold h-12"
                            />
                        </div>

                        <div className="form-control">
                            <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                                Alamat Lengkap
                            </label>
                            <textarea
                                name="alamat"
                                defaultValue={selectedUnit?.alamat || ""}
                                className="textarea textarea-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold min-h-[100px] py-3"
                            />
                        </div>

                        <div className="modal-action flex gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() =>
                                    document
                                        .getElementById("modal_edit_pegawai")
                                        .close()
                                }
                                className="btn btn-ghost text-slate-400 font-bold uppercase text-[10px] tracking-widest"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="btn bg-sky-600 hover:bg-sky-700 border-none text-white px-10 rounded-2xl shadow-xl shadow-sky-100 transition-all font-bold text-xs uppercase"
                            >
                                {isUpdating
                                    ? "Menyimpan..."
                                    : "Simpan Perubahan"}
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
}
