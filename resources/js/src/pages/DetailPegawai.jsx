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
            doc.text(`Total Data : ${units.length} Pegawai`, 14, 34);

            const tableColumn = [
                "No",
                "NIP",
                "Nama Lengkap",
                "Email",
                "Jabatan",
                "Telepon",
            ];
            const tableRows = [];

            units.forEach((unit, index) => {
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
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

                {/* Tombol Aksi di Header */}
                <div className="flex items-center gap-2">
                    {units.length > 0 && (
                        <button
                            onClick={downloadPDF}
                            className="btn btn-sm bg-rose-500 hover:bg-rose-600 border-none text-white flex items-center gap-2 shadow-sm"
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
                            Unduh PDF
                        </button>
                    )}

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
            </div>

            {/* Content Tabel yang Sudah Dirapikan */}
            <div className="overflow-x-auto">
                {/* Tambahkan whitespace-nowrap agar tabel konsisten melebar jika diperlukan */}
                <table className="w-full text-left border-collapse whitespace-nowrap">
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
                            {/* Kolom aksi dibuat sticky agar selalu terlihat di sebelah kanan */}
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
                        ) : units.length > 0 ? (
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
                                    {/* Mencegah patah, dan diberi min-w agar nama tidak tertekan */}
                                    <td className="px-4 py-3 text-sm font-bold text-slate-700 uppercase whitespace-normal min-w-[200px] leading-snug">
                                        {unit.nama_pegawai || "-"}
                                    </td>
                                    {/* Mencegah patah, dan diberi min-w agar jabatan terbaca jelas */}
                                    <td className="px-4 py-3 text-sm font-semibold text-slate-500 whitespace-normal min-w-[200px] leading-snug">
                                        {unit.jabatan || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-slate-500">
                                        {unit.email || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {unit.telepon || "-"}
                                    </td>
                                    {/* Tombol aksi dibuat sticky agar menempel saat di-scroll ke kanan */}
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
                    <span className="text-sm text-slate-500 font-medium">
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
