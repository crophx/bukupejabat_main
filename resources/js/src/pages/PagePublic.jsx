import React from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import kemluBg from "../assets/images/logo_kemlu_fix.png";
import Logo from "../assets/images/logo-kemlu.png";

export default function PublicPage() {

    const downloadDalamNegeri = async () => {
        Swal.fire({
            title: 'Memproses PDF...',
            text: 'Sedang menyusun daftar pejabat per orang...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            const [unitsRes, pegawaiRes] = await Promise.all([
                axios.get("http://127.0.0.1:8000/api/unit-kerja/dalam-negeri"),
                axios.get("http://127.0.0.1:8000/api/pegawai")
            ]);
            const filteredUnits = unitsRes.data.data || [];
            const allPegawai = pegawaiRes.data.data || [];
            
            const allowedKeywords = [
                "menteri", "wakil menteri", "staf ahli",
                "kepala biro", "kepala bagian", "kepala subbagian"
            ];

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const imgWidth = 200;
            const imgHeight = 140;
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            const drawWatermark = () => {
                doc.setGState(new doc.GState({ opacity: 1.0 }));
                doc.addImage(kemluBg, 'PNG', x, y, imgWidth, imgHeight);
            };

            const originalAddPage = doc.addPage.bind(doc);
            doc.addPage = function () {
                originalAddPage();
                drawWatermark();
                return this;
            };

            drawWatermark();

            let isFirstPage = true;
            let hasData = false;

            filteredUnits.forEach((unit) => {
                const pejabatForUnit = allPegawai.filter(p => {
                    const jabatanStr = (p.jabatan || "").toLowerCase();
                    const isPejabat = allowedKeywords.some(key => jabatanStr.includes(key));
                    return isPejabat && p.unit_kerja_id === unit.id;
                });

                if (pejabatForUnit.length === 0) return;
                hasData = true;

                if (!isFirstPage) {
                    doc.addPage();
                }
                isFirstPage = false;

                doc.setFont("times", "bold");
                doc.setFontSize(12);
                doc.text("DAFTAR PEJABAT DALAM NEGERI", pageWidth / 2, 20, { align: "center" });

                doc.setFontSize(11);
                const unitNameLong = unit.deskripsi ? unit.deskripsi.toUpperCase() : (unit.nama_unit_kerja ? unit.nama_unit_kerja.toUpperCase() : "UNIT TIDAK DIKETAHUI");
                const splitUnitName = doc.splitTextToSize(unitNameLong, pageWidth - 30);
                doc.text(splitUnitName, pageWidth / 2, 28, { align: "center" });

                let currentY = 28 + (splitUnitName.length * 5);
                doc.setFont("times", "normal");
                doc.setFontSize(10);

                let addressDetails = [];
                if (unit.alamat && unit.alamat !== "-") addressDetails.push(unit.alamat);
                
                let kontak = [];
                if (unit.telepon && unit.telepon !== "-") kontak.push(`Telp: ${unit.telepon}`);
                if (unit.email && unit.email !== "-") kontak.push(`Email: ${unit.email}`);
                if (unit.website && unit.website !== "-") kontak.push(`Web: ${unit.website}`);
                if (kontak.length > 0) addressDetails.push(kontak.join(" | "));

                addressDetails.forEach(line => {
                    const splitLine = doc.splitTextToSize(line, pageWidth - 30);
                    doc.text(splitLine, pageWidth / 2, currentY, { align: "center" });
                    currentY += (splitLine.length * 5);
                });
                currentY += 8;

                const tableRows = pejabatForUnit.map((p, i) => {
                    const formatNama = p.nama_pegawai || p.nama || "-";
                    const formatJabatan = p.jabatan || "-";
                    const titleCaseNama = formatNama === "-" ? "-" : formatNama.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
                    const titleCaseJabatan = formatJabatan === "-" ? "-" : formatJabatan.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
                    return [
                        `${i + 1}.`,
                        titleCaseNama,
                        titleCaseJabatan,
                        `Telp: ${p.no_handphone || "-"}\nEmail: ${p.email || "-"}`
                    ];
                });

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

            if (!hasData) {
                Swal.fire('Informasi', 'Tidak ditemukan data pejabat.', 'info');
                return;
            }

            doc.save("Daftar_Pejabat_Dalam_Negeri.pdf");
            Swal.close();
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'PDF Pejabat Dalam Negeri berhasil diunduh.', timer: 2000, showConfirmButton: false });

        } catch (error) {
            console.error("Gagal Download PDF:", error);
            Swal.fire('Error', 'Terjadi kesalahan teknis saat menyusun data PDF.', 'error');
        }
    };

    const downloadLuarNegeri = async () => {
        Swal.fire({
            title: 'Memproses PDF...',
            text: 'Sedang menyusun daftar pejabat per orang...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            const [unitsRes, pegawaiRes] = await Promise.all([
                axios.get("http://127.0.0.1:8000/api/unit-kerja/luar-negeri"),
                axios.get("http://127.0.0.1:8000/api/pegawai")
            ]);
            
            const filteredUnits = unitsRes.data.data || [];
            const allPegawai = pegawaiRes.data.data || [];

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const imgWidth = 200;
            const imgHeight = 140;
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            const drawWatermark = () => {
                doc.setGState(new doc.GState({ opacity: 1.0 }));
                doc.addImage(kemluBg, 'PNG', x, y, imgWidth, imgHeight);
            };

            const originalAddPage = doc.addPage.bind(doc);
            doc.addPage = function () {
                originalAddPage();
                drawWatermark();
                return this;
            };

            drawWatermark();
            let isFirstPage = true;
            let hasData = false;

            filteredUnits.forEach((unit) => {
                const pejabatForUnit = allPegawai.filter(p => p.unit_kerja_id === unit.id);
                if (pejabatForUnit.length === 0) return;
                hasData = true;

                if (!isFirstPage) {
                    doc.addPage();
                }
                isFirstPage = false;

                doc.setFont("times", "bold");
                doc.setFontSize(12);
                doc.text("DAFTAR PEJABAT LUAR NEGERI", pageWidth / 2, 20, { align: "center" });

                doc.setFontSize(11);
                const unitNameLong = unit.deskripsi ? unit.deskripsi.toUpperCase() : (unit.nama_unit_kerja ? unit.nama_unit_kerja.toUpperCase() : "UNIT TIDAK DIKETAHUI");
                const splitUnitName = doc.splitTextToSize(unitNameLong, pageWidth - 30);
                doc.text(splitUnitName, pageWidth / 2, 28, { align: "center" });

                let currentY = 28 + (splitUnitName.length * 5);
                doc.setFont("times", "normal");
                doc.setFontSize(10);

                if (unit.alamat && unit.alamat !== "-") {
                    const splitAlamat = doc.splitTextToSize(unit.alamat, pageWidth - 30);
                    doc.text(splitAlamat, pageWidth / 2, currentY, { align: "center" });
                    currentY += (splitAlamat.length * 5) + 3;
                } else {
                    currentY += 3;
                }

                const leftX = 15;
                const rightX = pageWidth / 2 + 5;
                let leftY = currentY;
                let rightY = currentY;

                if (unit.telepon && unit.telepon !== "-") { doc.text(`Telp: ${unit.telepon}`, leftX, leftY); leftY += 5; }
                if (unit.email && unit.email !== "-") { doc.text(`Email: ${unit.email}`, leftX, leftY); leftY += 5; }
                if (unit.website && unit.website !== "-") { doc.text(`Web: ${unit.website}`, leftX, leftY); leftY += 5; }

                if (unit.hari_kerja && unit.hari_kerja !== "-") { doc.text(`Hari Kerja: ${unit.hari_kerja}`, rightX, rightY); rightY += 5; }
                if (unit.musim_dingin && unit.musim_dingin !== "-") { doc.text(`Musim Dingin: ${unit.musim_dingin}`, rightX, rightY); rightY += 5; }
                if (unit.musim_panas && unit.musim_panas !== "-") { doc.text(`Musim Panas: ${unit.musim_panas}`, rightX, rightY); rightY += 5; }

                currentY = Math.max(leftY, rightY) + 5;

                const tableRows = pejabatForUnit.map((p, i) => {
                    let jabatanFormat = p.jabatan || "-";
                    if (jabatanFormat.toUpperCase().includes("STAF SK")) {
                        jabatanFormat = "Administrasi Umum";
                    }
                    const formatNama = p.nama_pegawai || p.nama || "-";
                    const titleCaseNama = formatNama === "-" ? "-" : formatNama.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
                    const titleCaseJabatan = jabatanFormat === "-" ? "-" : jabatanFormat.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
                    return [
                        `${i + 1}.`,
                        titleCaseNama,
                        titleCaseJabatan,
                        `Telp: ${p.no_handphone || "-"}\nEmail: ${p.email || "-"}`
                    ];
                });

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

            if (!hasData) {
                Swal.fire('Informasi', 'Tidak ditemukan data pejabat.', 'info');
                return;
            }

            doc.save("Daftar_Pejabat_Luar_Negeri.pdf");
            Swal.close();
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'PDF Pejabat Luar Negeri berhasil diunduh.', timer: 2000, showConfirmButton: false });

        } catch (error) {
            console.error("Gagal Download PDF:", error);
            Swal.fire('Error', 'Terjadi kesalahan teknis saat menyusun data PDF.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="w-full pt-6 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-20 flex items-center justify-center px-6">
                        <div className="flex items-center gap-4">
                            <img src={Logo} alt="logo" className="max-h-12 object-contain" />
                            <div className="hidden sm:block border-l border-slate-200 pl-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Republik Indonesia</p>
                                <p className="text-sm font-bold text-slate-800 leading-none">Kementerian Luar Negeri</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-6">
                <div className="max-w-4xl w-full bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 p-10 border border-slate-100 text-center transition-all">
                    <div className="mb-12">
                        <div className="inline-block p-4 bg-sky-50 rounded-3xl mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-sky-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase mb-2">Portal Unduhan Dokumen Pejabat</h1>
                    </div>

                    <div className="flex justify-center items-center gap-6">
                        <button onClick={downloadDalamNegeri} className="group w-64 p-8 bg-white border-2 border-slate-100 hover:border-emerald-500 rounded-[28px] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-100 flex flex-col items-center gap-4 cursor-pointer">
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <span className="font-black text-slate-800 uppercase tracking-widest text-sm block">Dalam Negeri</span>
                                <span className="text-[10px] text-emerald-600 font-bold uppercase mt-1 block tracking-tighter">Unduh PDF</span>
                            </div>
                        </button>

                        <button onClick={downloadLuarNegeri} className="group w-64 p-8 bg-white border-2 border-slate-100 hover:border-rose-500 rounded-[28px] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-rose-100 flex flex-col items-center gap-4 cursor-pointer">
                            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <span className="font-black text-slate-800 uppercase tracking-widest text-sm block">Luar Negeri</span>
                                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1 block tracking-tighter">Unduh PDF</span>
                            </div>
                        </button>
                    </div>

                    <p className="mt-12 text-slate-400 text-[10px] font-bold uppercase tracking-[4px]">
                        Kementerian Luar Negeri Republik Indonesia
                    </p>
                </div>
            </main>
        </div>
    );
}