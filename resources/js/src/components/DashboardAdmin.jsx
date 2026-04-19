import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf"; // TAMBAHAN: Import jsPDF
import autoTable from "jspdf-autotable"; // TAMBAHAN: Import autoTable
import Swal from "sweetalert2"; // TAMBAHAN: Import SweetAlert2
import LogHistory from "./LogHistory";

export default function DashboardAdmin() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalPegawai: 0,
        totalAdmin: 0,
        totalUnitDalamNegeri: 0,
        totalUnitLuarNegeri: 0,
        sparkline: [3, 5, 4, 6, 8, 6, 7, 9, 8, 10, 9],
        bars: [5, 6, 9, 8, 7],
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [dashboardResponse, dalamNegeriResponse, luarNegeriResponse] =
                await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/dashboard/stats"),
                    axios.get("http://127.0.0.1:8000/api/unit-kerja/dalam-negeri"),
                    axios.get("http://127.0.0.1:8000/api/unit-kerja/luar-negeri"),
                ]);

            if (dashboardResponse.data.success) {
                setStats((prev) => ({
                    ...prev,
                    totalPegawai: dashboardResponse.data.data.total_pegawai,
                    totalAdmin: dashboardResponse.data.data.total_admin,
                    totalUnitDalamNegeri:
                        dalamNegeriResponse.data.data?.length || 0,
                    totalUnitLuarNegeri:
                        luarNegeriResponse.data.data?.length || 0,
                }));
            }
        } catch (error) {
            console.error("Gagal mengambil data statistik:", error);
        }
    };

    // =======================================================
    // FUNGSI DOWNLOAD PDF: SEMUA PEGAWAI DALAM NEGERI PER SATKER
    // =======================================================
    const downloadPDFDalamNegeri = async () => {
        Swal.fire({
            title: 'Memproses PDF...',
            text: 'Sedang menyusun daftar seluruh pegawai Dalam Negeri...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            const unitRes = await axios.get("http://127.0.0.1:8000/api/unit-kerja/dalam-negeri");
            const unitsDalamNegeri = unitRes.data.data || [];

            const pegRes = await axios.get("http://127.0.0.1:8000/api/pegawai");
            const allPegawai = pegRes.data.data || [];

            // Ambil semua pegawai yang unitnya terdaftar di Dalam Negeri
            const pegDalamNegeri = allPegawai.filter(p =>
                unitsDalamNegeri.some(u => u.id === p.unit_kerja_id)
            );

            if (pegDalamNegeri.length === 0) {
                Swal.fire('Informasi', 'Tidak ada data pegawai Dalam Negeri.', 'info');
                return;
            }

            // Kelompokkan berdasarkan Satuan Kerja
            const grouped = pegDalamNegeri.reduce((acc, p) => {
                const unitName = p.nama_unit_kerja || "Unit Tidak Diketahui";
                if (!acc[unitName]) acc[unitName] = [];
                acc[unitName].push(p);
                return acc;
            }, {});

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;

            doc.setFont("times", "bold");
            doc.setFontSize(14);
            doc.text("DAFTAR SELURUH PEGAWAI DALAM NEGERI", pageWidth / 2, 20, { align: "center" });

            doc.setFontSize(10);
            doc.setFont("times", "normal");
            doc.text("Kementerian Luar Negeri Republik Indonesia", pageWidth / 2, 26, { align: "center" });

            let currentY = 35;

            Object.keys(grouped).forEach((unitName) => {
                if (currentY > 240) {
                    doc.addPage();
                    currentY = 20;
                }

                // HEADER SATKER
                doc.setFillColor(245, 245, 245);
                doc.rect(14, currentY - 5, pageWidth - 28, 8, 'F');
                doc.setFont("times", "bold");
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                doc.text(unitName.toUpperCase(), 16, currentY);
                currentY += 5;

                const tableRows = grouped[unitName].map((p, i) => [
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
                    styles: { font: "times", fontSize: 9, cellPadding: 2 },
                    headStyles: { fontStyle: "bold", lineWidth: { bottom: 0.1 }, lineColor: [0, 0, 0] },
                    columnStyles: {
                        0: { cellWidth: 10, halign: 'center' },
                        1: { cellWidth: 45 },
                        2: { cellWidth: 55 },
                        3: { cellWidth: 'auto' }
                    },
                    margin: { left: 14, right: 14 },
                });

                currentY = doc.lastAutoTable.finalY + 15;
            });

            doc.save("Daftar_Semua_Pegawai_Dalam_Negeri.pdf");
            Swal.close();
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'PDF Dalam Negeri berhasil diunduh.', timer: 2000, showConfirmButton: false });

        } catch (error) {
            console.error("Gagal Download PDF:", error);
            Swal.fire('Error', 'Terjadi kesalahan teknis saat menyusun data PDF.', 'error');
        }
    };

    // =======================================================
    // FUNGSI DOWNLOAD PDF: SEMUA PEGAWAI LUAR NEGERI PER SATKER
    // =======================================================
    const downloadPDFLuarNegeri = async () => {
        Swal.fire({
            title: 'Memproses PDF...',
            text: 'Sedang menyusun daftar seluruh pegawai Luar Negeri...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            const unitRes = await axios.get("http://127.0.0.1:8000/api/unit-kerja/luar-negeri");
            const unitsLuarNegeri = unitRes.data.data || [];

            const pegRes = await axios.get("http://127.0.0.1:8000/api/pegawai");
            const allPegawai = pegRes.data.data || [];

            // Ambil semua pegawai yang unitnya terdaftar di Luar Negeri
            const pegLuarNegeri = allPegawai.filter(p =>
                unitsLuarNegeri.some(u => u.id === p.unit_kerja_id)
            );

            if (pegLuarNegeri.length === 0) {
                Swal.fire('Informasi', 'Tidak ada data pegawai Luar Negeri.', 'info');
                return;
            }

            // Kelompokkan berdasarkan Satuan Kerja
            const grouped = pegLuarNegeri.reduce((acc, p) => {
                const unitName = p.nama_unit_kerja || "Unit Tidak Diketahui";
                if (!acc[unitName]) acc[unitName] = [];
                acc[unitName].push(p);
                return acc;
            }, {});

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;

            doc.setFont("times", "bold");
            doc.setFontSize(14);
            doc.text("DAFTAR SELURUH PEGAWAI LUAR NEGERI", pageWidth / 2, 20, { align: "center" });

            doc.setFontSize(10);
            doc.setFont("times", "normal");
            doc.text("Kementerian Luar Negeri Republik Indonesia", pageWidth / 2, 26, { align: "center" });

            let currentY = 35;

            Object.keys(grouped).forEach((unitName) => {
                if (currentY > 240) {
                    doc.addPage();
                    currentY = 20;
                }

                // HEADER SATKER
                doc.setFillColor(245, 245, 245);
                doc.rect(14, currentY - 5, pageWidth - 28, 8, 'F');
                doc.setFont("times", "bold");
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                doc.text(unitName.toUpperCase(), 16, currentY);
                currentY += 5;

                const tableRows = grouped[unitName].map((p, i) => [
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
                    styles: { font: "times", fontSize: 9, cellPadding: 2 },
                    headStyles: { fontStyle: "bold", lineWidth: { bottom: 0.1 }, lineColor: [0, 0, 0] },
                    columnStyles: {
                        0: { cellWidth: 10, halign: 'center' },
                        1: { cellWidth: 45 },
                        2: { cellWidth: 55 },
                        3: { cellWidth: 'auto' }
                    },
                    margin: { left: 14, right: 14 },
                });

                currentY = doc.lastAutoTable.finalY + 15;
            });

            doc.save("Daftar_Semua_Pegawai_Luar_Negeri.pdf");
            Swal.close();
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'PDF Luar Negeri berhasil diunduh.', timer: 2000, showConfirmButton: false });

        } catch (error) {
            console.error("Gagal Download PDF:", error);
            Swal.fire('Error', 'Terjadi kesalahan teknis saat menyusun data PDF.', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-md shadow-slate-200/60 p-10 border border-slate-100 text-center">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="inline-block p-4 bg-sky-50 rounded-3xl mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-sky-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase mb-2">
                        Buku Pejabat
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Akses data pegawai dan unduh dokumen resmi buku pejabat
                    </p>
                </div>

                {/* Main Actions (DIUBAH MENJADI CENTER DAN 2 KOLOM) */}
                <div className="flex flex-col md:flex-row justify-center max-w-3xl mx-auto gap-6">
                    {/* BUTTON DALAM NEGERI (DOWNLOAD PDF) */}
                    <button onClick={downloadPDFDalamNegeri} className="group p-8 bg-white border-2 border-slate-100 hover:border-emerald-500 rounded-[28px] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-100 flex flex-col items-center gap-4 cursor-pointer w-full md:w-1/2">
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <span className="font-black text-slate-800 uppercase tracking-widest text-sm block">
                                Dalam Negeri
                            </span>
                            <span className="text-[10px] text-emerald-600 font-bold uppercase mt-1 block tracking-tighter">
                                Unduh Laporan PDF
                            </span>
                        </div>
                    </button>

                    {/* BUTTON LUAR NEGERI (DOWNLOAD PDF) */}
                    <button
                        onClick={downloadPDFLuarNegeri}
                        className="group p-8 bg-white border-2 border-slate-100 hover:border-rose-500 rounded-[28px] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-rose-100 flex flex-col items-center gap-4 cursor-pointer w-full md:w-1/2"
                    >
                        <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <span className="font-black text-slate-800 uppercase tracking-widest text-sm block">
                                Luar Negeri
                            </span>
                            <span className="text-[10px] text-rose-600 font-bold uppercase mt-1 block tracking-tighter">
                                Unduh Laporan PDF
                            </span>
                        </div>
                    </button>
                </div>

                {/* Footer Note */}
                <p className="mt-12 text-slate-400 text-xs font-medium uppercase tracking-[4px]">
                    Kementerian Luar Negeri Republik Indonesia
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard title="Total Pegawai" value={stats.totalPegawai}>
                    <BarChart values={stats.bars} />
                </StatCard>

                <StatCard
                    title="Total Admin"
                    value={stats.totalAdmin}
                    tone="emerald"
                >
                    <Sparkline values={stats.sparkline} />
                </StatCard>

                <StatCard
                    title="Unit Kerja Dalam Negeri"
                    value={stats.totalUnitDalamNegeri}
                    tone="amber"
                >
                    <UnitOfficeIcon tone="amber" />
                </StatCard>

                <StatCard
                    title="Unit Kerja Luar Negeri"
                    value={stats.totalUnitLuarNegeri}
                    tone="indigo"
                >
                    <UnitOfficeIcon tone="indigo" />
                </StatCard>
            </div>

            <LogHistory />
        </div>
    );
}

function UnitOfficeIcon({ tone = "amber" }) {
    const strokeMap = {
        amber: "#b45309",
        indigo: "#4338ca",
    };

    return (
        <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3.75 21h16.5M6 21V7.8c0-.67 0-1.004.13-1.259.114-.224.296-.406.52-.52C6.896 5.9 7.23 5.9 7.9 5.9h8.2c.67 0 1.004 0 1.259.13.224.114.406.296.52.52.13.255.13.589.13 1.259V21M9 10.5h1.5M13.5 10.5H15M9 14.25h1.5M13.5 14.25H15"
                stroke={strokeMap[tone] || strokeMap.amber}
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function StatCard({ title, value, children, tone = "slate" }) {
    const toneMap = {
        slate: "bg-slate-50 text-slate-700",
        emerald: "bg-emerald-50 text-emerald-700",
        amber: "bg-amber-50 text-amber-700",
        indigo: "bg-indigo-50 text-indigo-700",
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-center">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {title}
                    </div>
                    <div className="text-3xl font-black text-slate-800">
                        {value === 0 ? "..." : value}
                    </div>
                </div>
                <div
                    className={`h-12 w-24 flex items-center justify-center rounded ${toneMap[tone] || toneMap.slate
                        }`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

function Sparkline({ values = [], stroke = "#065f46" }) {
    if (!values.length) return null;
    const w = 80;
    const h = 36;
    const max = Math.max(...values);
    const points = values
        .map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / max) * h}`)
        .join(" ");

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
            <polyline fill="none" stroke={stroke} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function BarChart({ values = [], small = false }) {
    const w = small ? 60 : 80;
    const h = small ? 36 : 48;
    const max = Math.max(...values, 1);
    const bw = w / values.length;

    return (
        <svg
            width={w}
            height={h}
            viewBox={`0 0 ${w} ${h}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            {values.map((v, i) => {
                const barH = (v / max) * h;
                return (
                    <rect
                        key={i}
                        x={i * bw + bw * 0.15}
                        y={h - barH}
                        width={bw * 0.7}
                        height={barH}
                        rx={2}
                        fill="#a3e635"
                    />
                );
            })}
        </svg>
    );
}
