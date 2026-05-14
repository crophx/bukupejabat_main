import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function LogHistory() {
    // 1. State untuk menyimpan data log dari database
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // State untuk fitur pencarian sederhana (Client side)
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // 2. Fetch Data dari API saat komponen dimuat
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("/api/activity-logs", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setLogs(response.data.data);
                }
            } catch (error) {
                console.error("Gagal mengambil log:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

    // 3. Filter data berdasarkan pencarian user/action/details dan tanggal
    const filteredLogs = logs.filter((log) => {
        const matchesSearch =
            (log.user?.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.description.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesDate = true;
        if (startDate || endDate) {
            const logDate = new Date(log.created_at);
            logDate.setHours(0, 0, 0, 0); // Normalize time
            
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                if (logDate < start) matchesDate = false;
            }
            if (endDate && matchesDate) {
                const end = new Date(endDate);
                end.setHours(0, 0, 0, 0);
                if (logDate > end) matchesDate = false;
            }
        }
        
        return matchesSearch && matchesDate;
    });

    const handleExportPDF = () => {
        const doc = new jsPDF();
        
        doc.setFont("times", "bold");
        doc.setFontSize(16);
        doc.text("Laporan Log Activity", 105, 20, { align: "center" });
        
        doc.setFontSize(10);
        doc.setFont("times", "normal");
        let subtitle = "Periode: Semua Waktu";
        if (startDate && endDate) subtitle = `Periode: ${startDate} s/d ${endDate}`;
        else if (startDate) subtitle = `Periode: Mulai ${startDate}`;
        else if (endDate) subtitle = `Periode: Sampai ${endDate}`;
        doc.text(subtitle, 105, 28, { align: "center" });

        const tableData = filteredLogs.map((log, index) => {
            const dateStr = new Date(log.created_at).toLocaleDateString("id-ID");
            const timeStr = new Date(log.created_at).toLocaleTimeString("id-ID");
            const userStr = log.user?.username || "User Terhapus";
            return [index + 1, `${dateStr} ${timeStr}`, userStr, log.action, log.description];
        });

        autoTable(doc, {
            startY: 35,
            head: [["No", "Waktu", "User", "Aksi", "Deskripsi"]],
            body: tableData,
            theme: "grid",
            styles: { font: "times", fontSize: 9 },
            headStyles: { fillColor: [14, 165, 233], textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
            columnStyles: { 0: { halign: "center", cellWidth: 10 } }
        });

        doc.save("Log_Activity.pdf");
    };

    // Helper untuk warna badge action
    const getActionColor = (action) => {
        switch (action) {
            case "LOGIN":
                return "text-green-600 bg-green-50";
            case "LOGOUT":
                return "text-slate-600 bg-slate-50";
            case "CREATE":
                return "text-blue-600 bg-blue-50";
            case "UPDATE":
                return "text-amber-600 bg-amber-50";
            case "DELETE":
                return "text-red-600 bg-red-50";
            default:
                return "text-slate-600 bg-slate-50";
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700 relative mb-6">
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">
                        Activity Log
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                        {searchTerm || startDate || endDate
                            ? `Ditemukan ${filteredLogs.length} aktivitas`
                            : `Total ${logs.length} aktivitas sistem`}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                            type="date"
                            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 w-full sm:w-auto text-slate-600"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            title="Start Date"
                        />
                        <span className="text-slate-400">-</span>
                        <input
                            type="date"
                            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 w-full sm:w-auto text-slate-600"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            title="End Date"
                        />
                    </div>

                    <div className="relative w-full sm:w-56">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input
                            type="search"
                            placeholder="Cari aktivitas..."
                            className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full bg-slate-50 text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button onClick={handleExportPDF} className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-sm shadow-emerald-200 transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        Export
                    </button>
                </div>
            </div>

            <div className="w-full overflow-x-auto border-t border-slate-100 max-h-[600px]">
                <table className="w-full text-left border-collapse min-w-[820px] table-auto">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-4 py-4 border-b border-slate-100">
                                Date
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100">
                                Time
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100">
                                User
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100">
                                Action
                            </th>
                            <th className="px-4 py-4 border-b border-slate-100">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="py-10 text-center text-slate-400"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredLogs.length > 0 ? (
                            filteredLogs.map((log) => (
                                <tr
                                    key={log.id}
                                    className="hover:bg-slate-50 cursor-default text-slate-500 transition-colors"
                                >
                                    <td className="px-4 py-4 align-top font-medium text-slate-700 whitespace-nowrap">
                                        {new Date(
                                            log.created_at,
                                        ).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="px-4 py-4 align-top whitespace-nowrap">
                                        {new Date(
                                            log.created_at,
                                        ).toLocaleTimeString("id-ID", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                    <td className="px-4 py-4 align-top">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-700">
                                                {log.user?.username ||
                                                    "User Terhapus"}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {log.user?.role || "Unknown"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 align-top">
                                        <span
                                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}
                                        >
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 align-top text-slate-600">
                                        {log.description}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="py-10 text-center text-slate-400"
                                >
                                    Tidak ada data aktivitas ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-medium">
                    Showing {filteredLogs.length} activity
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setSearchTerm(""); setStartDate(""); setEndDate(""); }}
                        className="text-sm text-slate-500 hover:text-sky-600 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
