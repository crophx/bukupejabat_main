import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf"; // TAMBAHAN: Import jsPDF
import autoTable from "jspdf-autotable"; // TAMBAHAN: Import autoTable

export default function DalamNegeri() {
    const navigate = useNavigate();
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);

    // State untuk Pencarian dan Pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // ==========================================
    // STATE UNTUK MODAL EDIT
    // ==========================================
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [editData, setEditData] = useState({
        id: "",
        kode_unit_kerja: "",
        nama_unit_kerja: "",
        deskripsi: "",
        alamat: "",
        telepon: "",
        fax: "",
        email: "",
        website: "",
    });

    useEffect(() => {
        fetchDalamNegeri();
    }, []);

    const fetchDalamNegeri = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/unit-kerja/dalam-negeri"
            );
            setUnits(response.data.data || []);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (unit) => {
        setEditData({
            id: unit.id,
            kode_unit_kerja: unit.kode_unit_kerja || "",
            nama_unit_kerja: unit.nama_unit_kerja || "",
            deskripsi: unit.deskripsi || "",
            alamat: unit.alamat || "",
            telepon: unit.telepon || "",
            fax: unit.fax || "",
            email: unit.email || "",
            website: unit.website || "",
        });
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await axios.put(
                `http://127.0.0.1:8000/api/unit-kerja/${editData.id}`,
                editData
            );
            setIsEditModalOpen(false);
            fetchDalamNegeri();

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data Dalam Negeri berhasil diperbarui.',
                confirmButtonColor: '#0ea5e9'
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Gagal menyimpan data.',
                confirmButtonColor: '#0ea5e9'
            });
        } finally {
            setIsUpdating(false);
        }
    };

    // =======================================================
    // FUNGSI DOWNLOAD PDF PEJABAT (GRUP PER SATKER - PAGE BARU)    
    // =======================================================
    const downloadPDF = async () => {
        Swal.fire({
            title: 'Memproses PDF...',
            text: 'Sedang menyusun daftar pejabat per orang...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            // Ambil data dari API Pegawai
            const response = await axios.get("http://127.0.0.1:8000/api/pegawai");
            const allPegawai = response.data.data || [];

            // Filter kata kunci jabatan sesuai permintaan
            const allowedKeywords = [
                "menteri", "wakil menteri", "staf ahli",
                "kepala biro", "kepala bagian", "kepala subbagian"
            ];

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            let isFirstPage = true;
            let hasData = false;

            // Looping berdasarkan filteredUnits agar informasi Unit Lengkap (termasuk alamat) bisa diambil
            filteredUnits.forEach((unit) => {
                // Cari pejabat yang ada di unit ini dan jabatannya sesuai kriteria
                const pejabatForUnit = allPegawai.filter(p => {
                    const jabatanStr = (p.jabatan || "").toLowerCase();
                    const isPejabat = allowedKeywords.some(key => jabatanStr.includes(key));
                    return isPejabat && p.unit_kerja_id === unit.id;
                });

                // Jika tidak ada pejabat yang memenuhi syarat di unit ini, lewati (jangan buat halamannya)
                if (pejabatForUnit.length === 0) return;

                hasData = true;

                // Tambah Halaman Baru untuk setiap Satker (kecuali satker yang pertama)
                if (!isFirstPage) {
                    doc.addPage();
                }
                isFirstPage = false;

                // --- HEADER HALAMAN ---
                doc.setFont("times", "bold");
                doc.setFontSize(12);
                doc.text("DAFTAR PEJABAT DALAM NEGERI", pageWidth / 2, 20, { align: "center" });

                // --- NAMA PANJANG SATKER ---
                doc.setFontSize(11);
                // Mengambil nama panjang dari kolom deskripsi, pastikan tidak error (typo dekripsi diperbaiki)
                const unitNameLong = unit.deskripsi ? unit.deskripsi.toUpperCase() : (unit.nama_unit_kerja ? unit.nama_unit_kerja.toUpperCase() : "UNIT TIDAK DIKETAHUI");

                // Mencegah teks terlalu panjang keluar dari margin kertas
                const splitUnitName = doc.splitTextToSize(unitNameLong, pageWidth - 30);
                doc.text(splitUnitName, pageWidth / 2, 28, { align: "center" });

                // --- ALAMAT SATKER ---
                let currentY = 28 + (splitUnitName.length * 5); // Dinamis mengikuti baris nama satker

                doc.setFont("times", "normal");
                doc.setFontSize(10);
                const alamatText = `Alamat: ${unit.alamat || "-"}`;
                const splitAlamat = doc.splitTextToSize(alamatText, pageWidth - 30);
                doc.text(splitAlamat, pageWidth / 2, currentY, { align: "center" });

                currentY += (splitAlamat.length * 5) + 8; // Tambah margin bawah sebelum tabel

                // --- ISI TABEL ---
                const tableRows = pejabatForUnit.map((p, i) => [
                    `${i + 1}.`,
                    p.nama_pegawai || p.nama || "-",
                    p.jabatan || "-",
                    `Telp: ${p.no_handphone || "-"}\nEmail: ${p.email || "-"}`
                ]);

                autoTable(doc, {
                    startY: currentY,
                    head: [["No.", "Nama Lengkap", "Jabatan", "Kontak"]],
                    body: tableRows,
                    theme: "plain",
                    styles: { font: "times", fontSize: 10, cellPadding: 4, textColor: [0, 0, 0] },
                    headStyles: { fontStyle: "bold", lineWidth: { top: 0.5, bottom: 0.5 }, lineColor: [0, 0, 0], halign: 'center' },
                    columnStyles: {
                        0: { cellWidth: 13, halign: 'center' },
                        1: { cellWidth: 50, halign: 'center' },
                        2: { cellWidth: 60, halign: 'left' },
                        3: { cellWidth: 'auto' }
                    },
                    margin: { left: 15, right: 15 },
                });
            });

            // Jika setelah dilooping ternyata benar-benar tidak ada data
            if (!hasData) {
                Swal.fire('Informasi', 'Tidak ditemukan data pejabat sesuai kriteria di daftar unit ini.', 'info');
                return;
            }

            doc.save("Daftar_Pejabat_Dalam_Negeri.pdf");
            Swal.close();
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'PDF Pejabat berhasil diunduh.', timer: 2000, showConfirmButton: false });

        } catch (error) {
            console.error("Gagal Download PDF:", error);
            Swal.fire('Error', 'Terjadi kesalahan teknis saat menyusun data PDF.', 'error');
        }
    };

    const filteredUnits = units.filter((unit) => {
        const searchString = searchTerm.toLowerCase();
        const nama = (unit.nama_unit_kerja || "").toLowerCase();
        const deskripsi = (unit.deskripsi || "").toLowerCase();
        return nama.includes(searchString) || deskripsi.includes(searchString);
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentUnits = filteredUnits.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="space-y-6 min-h-screen">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700 p-6 animate-in fade-in duration-500">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight whitespace-nowrap">
                        Data Per Unit Kerja - Dalam Negeri
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Cari unit kerja..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full bg-slate-50"
                            />
                        </div>

                        {/* TOMBOL PDF AKTIF DENGAN LOGIKA PER ORANG */}
                        <button
                            onClick={downloadPDF}
                            className="p-2 px-4 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200 hover:border-rose-300 flex items-center justify-center gap-2 group whitespace-nowrap"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-tight">Unduh PDF</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center p-10">
                        <span className="loading loading-spinner text-sky-500"></span>
                        <p className="text-sm mt-2 text-slate-400">Memuat data unit...</p>
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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4 text-slate-400 group-open:rotate-180 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </summary>

                            <div className="p-6 bg-white border-t border-slate-200 space-y-6">
                                <div className="flex flex-wrap md:flex-nowrap justify-between gap-6 text-[14px] items-start">
                                    <div className="flex-1 min-w-[150px]">
                                        <p className="font-bold text-slate-400 uppercase mb-1">Alamat</p>
                                        <p className="text-slate-600 leading-relaxed">{unit.alamat || "-"}</p>
                                    </div>
                                    <div className="flex-1 min-w-[150px]">
                                        <p className="font-bold text-slate-400 uppercase mb-1">Kontak</p>
                                        <p className="text-slate-700 font-semibold">{unit.telepon || "-"}</p>
                                        <p className="text-slate-500 italic text-xs">Fax: {unit.fax || "-"}</p>
                                    </div>
                                    <div className="flex-1 min-w-[150px]">
                                        <p className="font-bold text-slate-400 uppercase mt-1">Email</p>
                                        <p className="text-sky-600 font-bold underline break-all whitespace-normal">{unit.email || "-"}</p>
                                        <p className="font-bold text-slate-400 uppercase mt-1">Website</p>
                                        <p className="text-slate-400 break-all whitespace-normal">{unit.website || "-"}</p>
                                    </div>
                                    <div className="w-full md:w-auto">
                                        <p className="font-bold text-slate-400 uppercase mb-1">Aksi</p>
                                        <button
                                            onClick={() => openEditModal(unit)}
                                            className="btn btn-sm btn-square btn-ghost text-amber-500 hover:bg-amber-100"
                                            title="Edit Unit Kerja"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div
                                    onClick={() => navigate(`/detail-pegawai/${unit.id}?source=dalam`)}
                                    className="bg-sky-50 border border-sky-100 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-sky-100"
                                >
                                    <span className="text-[12px] font-bold text-sky-700 uppercase">
                                        Daftar Personel ({unit.pegawai_count || 0})
                                    </span>
                                    <span className="text-sky-400 text-[11px] font-bold uppercase">Klik Detail ➔</span>
                                </div>
                            </div>
                        </details>
                    ))
                ) : (
                    <div className="text-center p-10 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        Tidak ada unit kerja yang ditemukan.
                    </div>
                )}

                {filteredUnits.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredUnits.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={(value) => {
                            setItemsPerPage(value);
                            setCurrentPage(1);
                        }}
                    />
                )}
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} onClick={() => setIsEditModalOpen(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl p-6 text-slate-800 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">
                            Edit Dalam Negeri - {editData.deskripsi || editData.nama_unit_kerja}
                        </h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
                                    <textarea name="alamat" value={editData.alamat} onChange={handleInputChange} className="textarea w-full bg-white text-slate-800 border border-slate-300 focus:border-sky-500 focus:outline-none" rows="2" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon</label>
                                    <input type="text" name="telepon" value={editData.telepon} onChange={handleInputChange} className="input input-sm w-full bg-white text-slate-800 border border-slate-300" />
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Fax</label>
                                    <input type="text" name="fax" value={editData.fax} onChange={handleInputChange} className="input input-sm w-full bg-white text-slate-800 border border-slate-300" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <textarea
                                        name="email"
                                        value={editData.email}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="textarea w-full bg-white text-slate-800 border border-slate-300 resize-none"
                                    />
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                                    <textarea
                                        name="website"
                                        value={editData.website}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="textarea w-full bg-white text-slate-800 border border-slate-300 resize-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-sm btn-ghost text-slate-500">Batal</button>
                                <button type="submit" disabled={isUpdating} className="btn btn-sm bg-sky-500 text-white border-none">{isUpdating ? "Menyimpan..." : "Simpan Perubahan"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}