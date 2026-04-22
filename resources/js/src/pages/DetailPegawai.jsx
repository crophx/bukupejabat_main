import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";

export default function DetailPegawai() {
    const navigate = useNavigate();
    const { unitId } = useParams();
    const [searchParams] = useSearchParams();
    const source = searchParams.get("source");

    const [units, setUnits] = useState([]);
    const [unitName, setUnitName] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredUnits = units.filter((unit) => {
        const searchLower = searchTerm.toLowerCase();
        const matchSearch =
            (unit.nama_pegawai || "").toLowerCase().includes(searchLower) ||
            (unit.nip || "").toLowerCase().includes(searchLower) ||
            (unit.jabatan || "").toLowerCase().includes(searchLower);

        let matchJabatan = true;
        if (source === "dalam") {
            const jabatanLower = (unit.jabatan || "").toLowerCase();
            matchJabatan =
                jabatanLower.includes("menteri") ||
                jabatanLower.includes("staf ahli") ||
                jabatanLower.includes("kepala biro") ||
                jabatanLower.includes("kepala bagian") ||
                jabatanLower.includes("kepala subbagian");
        }
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

    const openEditModal = (unit) => {
        setSelectedUnit(unit);
        document.getElementById("modal_edit_pegawai").showModal();
    };

    useEffect(() => {
        if (unitId) fetchPegawai();
    }, [unitId]);

    const fetchPegawai = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/pegawai/unit/${unitId}`);
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
            tmt_kedatangan: formData.get("tmt_kedatangan"), // SUDAH DIUBAH
            tmt_credential: formData.get("tmt_credential"),
        };

        try {
            await axios.put(`http://127.0.0.1:8000/api/pegawai/${selectedUnit.id}`, data);
            document.getElementById("modal_edit_pegawai").close();
            fetchPegawai();
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Data Pegawai berhasil diperbarui.', confirmButtonColor: '#0ea5e9' });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Gagal menyimpan data.', confirmButtonColor: '#0ea5e9' });
        } finally {
            setIsUpdating(false);
        }
    };

    const downloadExcel = () => {
        const dataToExport = filteredUnits.map((unit, index) => ({
            "No": index + 1,
            "NIP": unit.nip || "-",
            "Nama Lengkap": unit.nama_pegawai || "-",
            "Jabatan": unit.jabatan || "-",
            "Email": unit.email || "-",
            "No. Telepon": unit.telepon || "-",
            "Alamat Kantor": unit.alamat || "-",
            "Wisma": unit.wisma || "-",
            "Bobot": unit.bobot || "-",
            "TMT Kedatangan": unit.tmt_kedatangan || "-", // SUDAH DIUBAH
            "TMT Credential": unit.tmt_credential || "-",
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Pegawai");
        const fileName = unitName ? unitName.replace(/\s+/g, "_") : "Data_Pegawai";
        XLSX.writeFile(workbook, `Buku_Pejabat_${fileName}.xlsx`);

        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'File Excel berhasil diunduh.', confirmButtonColor: '#0ea5e9', timer: 2000, showConfirmButton: false });
    };

    const downloadCSV = () => {
        const headers = ["No", "NIP", "Nama Lengkap", "Jabatan", "Email", "No. Telepon", "Alamat Kantor", "Wisma", "Bobot", "TMT Kedatangan", "TMT Credential"]; // SUDAH DIUBAH
        const rows = filteredUnits.map((unit, index) => [
            index + 1,
            `"${unit.nip || "-"}"`,
            `"${unit.nama_pegawai || "-"}"`,
            `"${unit.jabatan || "-"}"`,
            `"${unit.email || "-"}"`,
            `"${unit.telepon || "-"}"`,
            `"${unit.alamat || "-"}"`,
            `"${unit.wisma || "-"}"`,
            `"${unit.bobot || "-"}"`,
            `"${unit.tmt_kedatangan || "-"}"`, // SUDAH DIUBAH
            `"${unit.tmt_credential || "-"}"`
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const fileName = unitName ? unitName.replace(/\s+/g, "_") : "Data_Pegawai";
        link.setAttribute("href", url);
        link.setAttribute("download", `Buku_Pejabat_${fileName}.csv`);
        link.click();

        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'File CSV berhasil diunduh.', confirmButtonColor: '#0ea5e9', timer: 2000, showConfirmButton: false });
    };

    const downloadPDF = () => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;

            // Header Dokumen
            doc.setFont("times", "bold");
            doc.setFontSize(12);
            const titleText = unitName ? unitName.toUpperCase() : "DAFTAR PEJABAT";
            doc.text(titleText, pageWidth / 2, 20, { align: "center" });

            doc.setFont("times", "normal");
            doc.setFontSize(10);
            doc.text("Kementerian Luar Negeri", pageWidth / 2, 25, { align: "center" });
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
                    addressDetails += `Email : ${unit.email}\n`;
                } else {
                    addressDetails += `Email : -\n`;
                }

                if (unit.wisma && unit.wisma !== "-") {
                    addressDetails += `Wisma : ${unit.wisma}`;
                } else {
                    addressDetails += `Wisma : -`;
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

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'File PDF berhasil diunduh.',
                confirmButtonColor: '#0ea5e9',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Gagal PDF', text: 'Terjadi kesalahan saat membuat PDF.' });
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700 mb-5">
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-base font-bold text-slate-800 uppercase mb-2">
                        <button type="button" onClick={() => navigate(-1)} className="cursor-pointer hover:text-sky-600">
                            Detail Pegawai
                        </button>
                        {unitName && <span className="text-sky-600"> - {unitName}</span>}
                    </h2>

                    {/* Container utama untuk kiri */}
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Cari pegawai..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:border-sky-500 w-full max-w-[300px] bg-slate-50"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={downloadPDF} className="btn btn-md bg-rose-500 hover:bg-rose-600 border-none text-white rounded-2xl flex items-center gap-2 px-5">
                                <span className="text-xs font-bold uppercase">PDF</span>
                            </button>
                            <button onClick={downloadExcel} className="btn btn-md bg-emerald-500 hover:bg-emerald-600 border-none text-white rounded-2xl flex items-center gap-2 px-5">
                                <span className="text-xs font-bold uppercase">Excel</span>
                            </button>
                            <button onClick={downloadCSV} className="btn btn-md bg-amber-500 hover:bg-amber-600 border-none text-white rounded-2xl flex items-center gap-2 px-5">
                                <span className="text-xs font-bold uppercase">CSV</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sync */}
                <div className="flex md:ml-auto mt-5">
                    <button onClick="/" className="btn btn-md bg-sky-500 hover:bg-sky-600 border-none text-white rounded-2xl flex items-center gap-2 px-5">
                        <span className="text-xs font-bold uppercase">Sync</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[850px]">
                    <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-black tracking-wider">
                        <tr>
                            <th className="px-4 py-4 w-12 text-center">No</th>
                            <th className="px-4 py-4">NIP</th>
                            <th className="px-4 py-4 "> Nama Lengkap</th>
                            <th className="px-4 py-4">Jabatan</th>
                            <th className="px-4 py-4">Email</th>
                            <th className="px-4 py-4">Telepon</th>
                            <th className="px-4 py-4 w-16 text-center sticky right-0 bg-slate-50">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="7" className="p-10 text-center"><span className="loading loading-spinner text-sky-500"></span></td></tr>
                        ) : filteredUnits.length > 0 ? (
                            currentUnits.map((unit, index) => (
                                <tr key={unit.id || index} className="hover:bg-sky-50/40 transition-colors group">
                                    <td className="px-4 py-3 text-sm text-center text-slate-400 font-bold">{indexOfFirst + index + 1}</td>
                                    <td className="px-4 py-3 text-sm font-mono text-sky-600">{unit.nip || "-"}</td>
                                    <td className="px-4 py-3 text-sm font-bold text-slate-700 uppercase">{unit.nama_pegawai || "-"}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-slate-500">{unit.jabatan || "-"}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-slate-500 italic lowercase">{unit.email || "-"}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{unit.telepon || "-"}</td>
                                    <td className="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-[#f6fbff] shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.03)]">
                                        <button onClick={() => openEditModal(unit)} className="btn btn-sm btn-square btn-ghost text-amber-500 hover:bg-amber-100"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" /></svg></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="p-10 text-center text-slate-400 italic">Data tidak ditemukan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {filteredUnits.length > 0 && (
                <Pagination currentPage={currentPage} totalItems={filteredUnits.length} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} onItemsPerPageChange={(newSize) => { setItemsPerPage(newSize); setCurrentPage(1); }} />
            )}

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
                            <button type="button" onClick={() => document.getElementById("modal_notes_bobot").showModal()} className="text-blue-500 hover:text-blue-700 text-sm italic mt-2 font-semibold cursor-pointer">📖 Notes Bobot</button>
                        </div>
                        <div className="form-control">
                            <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Wisma</label>
                            <textarea name="wisma" defaultValue={selectedUnit?.wisma || ""} className="textarea textarea-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold min-h-[100px] py-3" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="form-control">
                                {/* PERUBAHAN LABEL DAN NAME MENJADI TMT KEDATANGAN */}
                                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">TMT Kedatangan</label>
                                <input type="date" name="tmt_kedatangan" defaultValue={selectedUnit?.tmt_kedatangan || ""} className="input input-bordered w-full bg-white border-slate-200 rounded-2xl text-sm font-semibold h-12" />
                            </div>
                            <div className="form-control">
                                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">TMT Credential</label>
                                <input type="date" name="tmt_credential" defaultValue={selectedUnit?.tmt_credential || ""} className="input input-bordered w-full bg-white border-slate-200 rounded-2xl text-sm font-semibold h-12" />
                            </div>
                        </div>
                        <div className="modal-action flex gap-3 pt-4 border-t border-slate-100">
                            <button type="button" onClick={() => document.getElementById("modal_edit_pegawai").close()} className="btn btn-ghost text-slate-400 font-bold uppercase text-[10px]">Batal</button>
                            <button type="submit" disabled={isUpdating} className="btn bg-sky-600 hover:bg-sky-700 border-none text-white px-10 rounded-2xl font-bold text-xs uppercase">{isUpdating ? "Menyimpan..." : "Simpan Perubahan"}</button>
                        </div>
                    </form>
                </div>
            </dialog>

            <dialog id="modal_notes_bobot" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-white max-w-2xl rounded-3xl p-8 border border-slate-100 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-xl text-slate-800 tracking-tight uppercase">📖 Penjelasan Bobot</h3>
                        <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost text-slate-400">✕</button></form>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                            <h4 className="font-bold text-blue-800 text-lg mb-2">Bobot I</h4>
                            <p className="text-sm text-blue-700 leading-relaxed">Pejabat tingkat tertinggi dengan tanggung jawab strategis (Eselon I).</p>
                        </div>
                        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                            <h4 className="font-bold text-green-800 text-lg mb-2">Bobot II</h4>
                            <p className="text-sm text-green-700 leading-relaxed">Pejabat tingkat menengah atas (Eselon II).</p>
                        </div>
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                            <h4 className="font-bold text-amber-800 text-lg mb-2">Bobot III</h4>
                            <p className="text-sm text-amber-700 leading-relaxed">Pejabat tingkat menengah (Eselon III).</p>
                        </div>
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                            <h4 className="font-bold text-rose-800 text-lg mb-2">Bobot IV</h4>
                            <p className="text-sm text-rose-700 leading-relaxed">Pejabat tingkat staf / fungsional (Eselon IV).</p>
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop"><button>close</button></form>
            </dialog>
        </div>
    );
}