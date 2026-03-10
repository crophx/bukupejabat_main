import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function DetailPegawai() {
    const navigate = useNavigate();
    const { unitId } = useParams();

    const [units, setUnits] = useState([]);
    const [unitName, setUnitName] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false); // Tambahan state loading simpan

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

    // ==========================================
    // FUNGSI BARU: Untuk menyimpan data ke DB
    // ==========================================
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        // Ambil data dari form berdasarkan atribut 'name'
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
            document.getElementById("modal_edit_pegawai").close(); // Tutup modal
            fetchPegawai(); // Refresh tabel
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            alert("Gagal menyimpan data. Silakan periksa koneksi.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
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
                    <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-black tracking-wider">
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
                            <th className="p-4 border-b border-slate-100 w-20 text-center">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="p-10 text-center">
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
                                    className="hover:bg-slate-50 transition-colors group"
                                >
                                    <td className="p-4 text-sm text-center text-slate-400 font-bold">
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
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => openEditModal(unit)}
                                            className="btn btn-sm btn-square btn-ghost text-amber-500 hover:bg-amber-50"
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
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
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

                    {/* Form Utama yang Menjalankan handleUpdate */}
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
                                    name="nama" // Tambahan penting
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
                                    name="email" // Tambahan penting
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
                                    name="no_handphone" // Tambahan penting
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
                                name="jabatan" // Tambahan penting
                                defaultValue={selectedUnit?.jabatan || ""}
                                className="input input-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold h-12"
                            />
                        </div>

                        <div className="form-control">
                            <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                                Alamat Lengkap
                            </label>
                            <textarea
                                name="alamat" // Tambahan penting
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
