import React, { useState, useEffect } from "react";
// PERUBAHAN: Tambahkan useSearchParams
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function DetailPegawai() {
    const navigate = useNavigate();
    const { unitId } = useParams();

    // PERUBAHAN: Ambil pesan rahasia dari URL
    const [searchParams] = useSearchParams();
    const source = searchParams.get("source"); // isinya akan "dalam" atau "luar"

    const [units, setUnits] = useState([]);
    const [unitName, setUnitName] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // =======================================================
    // LOGIKA FILTER PENCARIAN & KONDISI JABATAN
    // =======================================================
    const filteredUnits = units.filter((unit) => {
        // 1. Cek apakah cocok dengan kotak pencarian (Search Input)
        const searchLower = searchTerm.toLowerCase();
        const matchSearch =
            (unit.nama_pegawai || "").toLowerCase().includes(searchLower) ||
            (unit.nip || "").toLowerCase().includes(searchLower) ||
            (unit.jabatan || "").toLowerCase().includes(searchLower);

        // 2. Cek Aturan Jabatan (Hanya untuk "Dalam Negeri")
        let matchJabatan = true; // Defaultnya true (Tampilkan semua untuk Luar Negeri)

        if (source === "dalam") {
            const jabatanLower = (unit.jabatan || "").toLowerCase();
            // Cek apakah jabatan mengandung unsur kata Kepala Biro/Bagian/Subbagian
            matchJabatan =
                jabatanLower.includes("menteri") ||
                jabatanLower.includes("staf ahli") ||
                jabatanLower.includes("kepala biro") ||
                jabatanLower.includes("kepala biro") ||
                jabatanLower.includes("kepala bagian") ||
                jabatanLower.includes("kepala subbagian");
        }

        // Harus lolos kotak pencarian DAN lolos aturan jabatan
        return matchSearch && matchJabatan;
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
            wisma: formData.get("wisma"),
            bobot: formData.get("bobot"),
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
            const pageWidth = doc.internal.pageSize.width;

            doc.setFont("times", "bold");
            doc.setFontSize(12);
            const titleText = unitName ? unitName.toUpperCase() : "DAFTAR PEJABAT";
            doc.text(titleText, pageWidth / 2, 20, { align: "center" });

            doc.setFont("times", "normal");
            doc.setFontSize(10);
            doc.text("Alamat Kantor: Kementerian Luar Negeri", pageWidth / 2, 25, { align: "center" });
            doc.text("Jl. Taman Pejambon No.6 Jakarta Pusat", pageWidth / 2, 30, { align: "center" });

            const tableColumn = ["No.", "Nama", "Jabatan", "Alamat & Kantor"];
            const tableRows = [];

            filteredUnits.forEach((unit, index) => {
                let addressDetails = "";

                if (unit.alamat && unit.alamat !== "-") {
                    addressDetails += `Kantor : ${unit.alamat}\n`;
                } else {
                    addressDetails += `Kantor : s.d.a.\n`;
                }

                if (unit.telepon && unit.telepon !== "-") {
                    addressDetails += `Telp. : ${unit.telepon}\n`;
                }

                if (unit.email && unit.email !== "-") {
                    addressDetails += `\nEmail : ${unit.email}`;
                } else {
                    addressDetails += `\nEmail : -`;
                }

                if (unit.wisma && unit.wisma !== "-") {
                    addressDetails += `\nWisma : ${unit.wisma}`;
                } else {
                    addressDetails += `\nWisma : -`;
                }


                const rowData = [
                    `${index + 1}.`,
                    unit.nama_pegawai || "-",
                    unit.jabatan || "-",
                    addressDetails
                ];
                tableRows.push(rowData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: "plain",
                styles: {
                    font: "times",
                    fontSize: 10,
                    cellPadding: 4,
                    textColor: [0, 0, 0],
                },
                headStyles: {
                    fontStyle: "bold",
                    lineWidth: { top: 0.5, bottom: 0.5 },
                    lineColor: [0, 0, 0],
                    halign: 'center'
                },
                columnStyles: {
                    0: { cellWidth: 15, halign: 'center' },
                    1: { cellWidth: 45 },
                    2: { cellWidth: 55 },
                    3: { cellWidth: 'auto' }
                },
            });

            const fileName = unitName ? unitName.replace(/\s+/g, "_") : "Semua_Unit";
            doc.save(`Buku_Pejabat_${fileName}.pdf`);
        } catch (error) {
            console.error("Gagal membuat PDF:", error);
            alert("Terjadi kesalahan saat membuat PDF. Coba periksa console browser.");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700 mb-5">
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
                        {/* Label kecil penanda mode agar kita tahu */}
                        {/* {source === "dalam" && (
                            <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full lowercase tracking-widest font-black">Mode: Khusus Pejabat</span>
                        )} */}
                    </h2>

                    <div className="flex flex-col md:flex-row items-center justify-between w-full mt-4 gap-4">
                        <div className="relative w-full md:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input type="text" placeholder="Cari pegawai..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full max-w-[300px] bg-slate-50 transition-all" />
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={downloadPDF} className="btn btn-md bg-rose-500 hover:bg-rose-600 border-none text-white rounded-2xl flex items-center gap-2 shadow-md shadow-rose-100 transition-all active:scale-95 px-5" title="Unduh PDF">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="currentColor" className="size-6">
                                    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                                    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                                </svg>
                                <span className="text-xs font-bold uppercase tracking-wider">PDF</span>
                            </button>

                            <button className="btn btn-md bg-emerald-500 hover:bg-emerald-600 border-none text-white rounded-2xl flex items-center gap-2 shadow-md shadow-emerald-100 transition-all active:scale-95 px-5" title="Unduh Excel">
                                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
                                <span className="text-xs font-bold uppercase tracking-wider">Excel</span>
                            </button>

                            <button className="btn btn-md bg-amber-500 hover:bg-amber-600 border-none text-white rounded-2xl flex items-center gap-2 shadow-md shadow-amber-100 transition-all active:scale-95 px-5" title="Unduh CSV">
                                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM8 18l-1-1 2-2-2-2 1-1 3 3-3 3zm7 0h-4v-2h4v2z" /></svg>
                                <span className="text-xs font-bold uppercase tracking-wider">CSV</span>
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 font-medium mt-2">
                        Total {filteredUnits.length} pegawai ditemukan
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[850px] md:min-w-[1000px]">
                    <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-black tracking-wider">
                        <tr>
                            <th className="px-4 py-4 border-b border-slate-100 w-12 text-center">No</th>
                            <th className="px-4 py-4 border-b border-slate-100">NIP</th>
                            <th className="px-4 py-4 border-b border-slate-100">Nama Lengkap</th>
                            <th className="px-4 py-4 border-b border-slate-100">Jabatan</th>
                            <th className="px-4 py-4 border-b border-slate-100">Email</th>
                            <th className="px-4 py-4 border-b border-slate-100">Telepon</th>
                            <th className="px-4 py-4 border-b border-slate-100 w-16 text-center sticky right-0 bg-slate-50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] z-10">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="p-10 text-center">
                                    <span className="loading loading-spinner text-sky-500"></span>
                                    <p className="text-xs mt-2 text-slate-400">Memuat data pegawai...</p>
                                </td>
                            </tr>
                        ) : filteredUnits.length > 0 ? (
                            currentUnits.map((unit, index) => (
                                <tr key={unit.id || index} className="hover:bg-sky-50/40 transition-colors group align-middle">
                                    <td className="px-4 py-3 text-sm text-center text-slate-400 font-bold">{indexOfFirst + index + 1}</td>
                                    <td className="px-4 py-3 text-sm font-mono text-sky-600 font-medium">{unit.nip || "-"}</td>
                                    <td className="px-4 py-3 text-sm font-bold text-slate-700 uppercase whitespace-normal min-w-[200px] leading-snug">{unit.nama_pegawai || "-"}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-slate-500 whitespace-normal min-w-[200px] leading-snug">{unit.jabatan || "-"}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-slate-500">
                                        {unit.email ? (
                                            <div className="tooltip tooltip-top" data-tip={unit.email}>
                                                <span className="cursor-help line-clamp-1 max-w-[150px] lowercase italic">{unit.email}</span>
                                            </div>
                                        ) : (<span className="text-slate-300">-</span>)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{unit.telepon || "-"}</td>
                                    <td className="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-[#f6fbff] transition-colors shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.03)] z-10">
                                        <button onClick={() => openEditModal(unit)} className="btn btn-sm btn-square btn-ghost text-amber-500 hover:bg-amber-100" title="Edit Pegawai">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-10 text-center text-slate-400 italic">Data tidak ditemukan atau tidak ada pejabat (Kepala) di unit ini.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {filteredUnits.length > 0 && (
                <div className="p-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        Tampilkan
                        <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="select select-bordered select-xs text-slate-700 bg-slate-50 border-slate-300 focus:outline-none focus:border-sky-500">
                            {[10, 25, 50, 100].map((n) => (<option key={n} value={n}>{n}</option>))}
                        </select>
                        per halaman
                    </div>

                    <div className="flex space-x-2">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="btn btn-xs btn-outline">Prev</button>
                        {getPageNumbers().map((page, idx) => (
                            <button
                                key={idx}
                                onClick={() => typeof page === "number" && handlePageChange(page)}
                                disabled={page === "..."}
                                className={`btn btn-xs ${page === currentPage ? "bg-sky-500 text-white border-sky-500 hover:bg-sky-600" : page === "..." ? "btn-outline border-transparent text-slate-400 cursor-default hover:bg-transparent" : "btn-outline text-slate-500"}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="btn btn-xs btn-outline">Next</button>
                    </div>
                </div>
            )}

            {/* --- MODAL EDIT --- */}
            <dialog id="modal_edit_pegawai" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-white max-w-2xl rounded-3xl p-8 border border-slate-100 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-xl text-slate-800 tracking-tight uppercase">Edit Data Pegawai</h3>
                        <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost text-slate-400">✕</button></form>
                    </div>

                    <form className="space-y-5" onSubmit={handleUpdate}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="form-control">
                                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">NIP</label>
                                <input type="text" value={selectedUnit?.nip || ""} className="input input-bordered w-full bg-slate-50 text-slate-500 border-slate-200 rounded-2xl text-sm font-semibold h-12" readOnly />
                            </div>
                            <div className="form-control">
                                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Nama Lengkap</label>
                                <input type="text" name="nama" defaultValue={selectedUnit?.nama_pegawai || ""} className="input input-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold h-12" />
                            </div>
                            <div className="form-control">
                                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Email</label>
                                <input type="email" name="email" defaultValue={selectedUnit?.email || ""} className="input input-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold h-12" />
                            </div>
                            <div className="form-control">
                                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">No. Telepon</label>
                                <input type="text" name="no_handphone" defaultValue={selectedUnit?.telepon || ""} className="input input-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold h-12" />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Jabatan</label>
                            <input type="text" name="jabatan" defaultValue={selectedUnit?.jabatan || ""} className="input input-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold h-12" />
                        </div>

                        <div className="form-control">
                            <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Bobot</label>
                            <select name="bobot" defaultValue={selectedUnit?.bobot || ""} className="select select-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold h-12">
                                <option value="">Pilih Bobot</option>
                                <option value="I">I</option>
                                <option value="II">II</option>
                                <option value="III">III</option>
                                <option value="IV">IV</option>
                            </select>
                            <button type="button" onClick={() => document.getElementById("modal_notes_bobot").showModal()} className="text-blue-500 hover:text-blue-700 text-sm italic mt-2 font-semibold cursor-pointer">
                                📖 Notes Bobot
                            </button>
                        </div>

                        <div className="form-control">
                            <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Wisma</label>
                            <textarea name="wisma" defaultValue={selectedUnit?.wisma || ""} className="textarea textarea-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold min-h-[100px] py-3" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="form-control">
                                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">TMT</label>
                                <div className="relative">
                                    <input type="date" name="tmt" defaultValue={selectedUnit?.tmt || ""} className="input input-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold h-12 pr-10" />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">TMT Credential</label>
                                <div className="relative">
                                    <input type="date" name="tmt_credential" defaultValue={selectedUnit?.tmt_credential || ""} className="input input-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold h-12 pr-10" />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="modal-action flex gap-3 pt-4 border-t border-slate-100">
                            <button type="button" onClick={() => document.getElementById("modal_edit_pegawai").close()} className="btn btn-ghost text-slate-400 font-bold uppercase text-[10px] tracking-widest">Batal</button>
                            <button type="submit" disabled={isUpdating} className="btn bg-sky-600 hover:bg-sky-700 border-none text-white px-10 rounded-2xl shadow-xl shadow-sky-100 transition-all font-bold text-xs uppercase">{isUpdating ? "Menyimpan..." : "Simpan Perubahan"}</button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* --- MODAL NOTES BOBOT --- */}
            <dialog id="modal_notes_bobot" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-white max-w-2xl rounded-3xl p-8 border border-slate-100 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-xl text-slate-800 tracking-tight uppercase">📖 Penjelasan Bobot</h3>
                        <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost text-slate-400">✕</button></form>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                            <h4 className="font-bold text-blue-800 text-lg mb-2">Bobot I</h4>
                            <p className="text-sm text-blue-700 leading-relaxed">
                                Pejabat tingkat tertinggi dengan tanggung jawab strategis dan pengambilan keputusan utama. Termasuk pejabat eselon I dan posisi setara dengan wewenang penuh dalam organisasi.
                            </p>
                        </div>

                        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                            <h4 className="font-bold text-green-800 text-lg mb-2">Bobot II</h4>
                            <p className="text-sm text-green-700 leading-relaxed">
                                Pejabat tingkat menengah atas dengan tanggung jawab signifikan dalam pelaksanaan kebijakan. Termasuk pejabat eselon II dan posisi manajerial utama dengan supervisi langsung.
                            </p>
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                            <h4 className="font-bold text-amber-800 text-lg mb-2">Bobot III</h4>
                            <p className="text-sm text-amber-700 leading-relaxed">
                                Pejabat tingkat menengah dengan tanggung jawab operasional dan koordinasi unit kerja. Termasuk pejabat eselon III dan kepala seksi dengan fungsi administratif dan teknis.
                            </p>
                        </div>

                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                            <h4 className="font-bold text-rose-800 text-lg mb-2">Bobot IV</h4>
                            <p className="text-sm text-rose-700 leading-relaxed">
                                Pejabat tingkat staf dengan tanggung jawab pada level operasional dan pendukung. Termasuk pejabat eselon IV, koordinator, dan staf ahli dengan fokus pada implementasi teknis.
                            </p>
                        </div>
                    </div>

                    {/* <div className="modal-action flex gap-3 pt-6 border-t border-slate-100 mt-6">
                        <form method="dialog">
                            <button className="btn bg-sky-600 hover:bg-sky-700 border-none text-white px-8 rounded-2xl shadow-xl shadow-sky-100 transition-all font-bold text-xs uppercase">
                                Tutup</button>
                        </form>
                    </div> */}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
}