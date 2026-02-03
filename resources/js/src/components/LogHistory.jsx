import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LogHistory() {
    // 1. State untuk menyimpan data log dari database
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // State untuk fitur pencarian sederhana (Client side)
    const [searchTerm, setSearchTerm] = useState("");

    // 2. Fetch Data dari API saat komponen dimuat
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/activity-logs",
                );
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

    // 3. Filter data berdasarkan pencarian user/action/details
    const filteredLogs = logs.filter(
        (log) =>
            (log.user?.username || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );

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
        <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100 mb-6">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        Activity Log
                    </h3>
                    <p className="text-xs text-slate-500">
                        Riwayat aktivitas terbaru sistem
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <label className="input input-sm bg-white border border-slate-300 text-slate-600 rounded-xl flex items-center gap-2 focus-within:border-sky-500 transition-all w-full md:w-64">
                        <svg
                            className="h-4 w-4 opacity-50"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input
                            type="search"
                            placeholder="Search..."
                            className="grow"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </label>
                </div>
            </div>

            <div className="overflow-y-auto max-h-72">
                <table className="w-full text-sm table-auto">
                    <thead className="text-left text-xs text-slate-500 border-b">
                        <tr>
                            <th className="py-2 pl-2">Date</th>
                            <th className="py-2">Time</th>
                            <th className="py-2">User</th>
                            <th className="py-2">Action</th>
                            <th className="py-2">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="py-4 text-center text-slate-400"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredLogs.length > 0 ? (
                            filteredLogs.map((log) => (
                                <tr
                                    key={log.id}
                                    className="hover:bg-slate-50 cursor-default text-slate-500 border-b border-slate-50 last:border-0"
                                >
                                    <td className="py-3 pl-2 align-top font-medium text-slate-700">
                                        {/* Format Tanggal Indonesia */}
                                        {new Date(
                                            log.created_at,
                                        ).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="py-3 align-top">
                                        {/* Format Jam */}
                                        {new Date(
                                            log.created_at,
                                        ).toLocaleTimeString("id-ID", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                    <td className="py-3 align-top">
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
                                    <td className="py-3 align-top">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-bold ${getActionColor(log.action)}`}
                                        >
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="py-3 align-top text-slate-600">
                                        {log.description}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="py-8 text-center text-slate-400"
                                >
                                    Tidak ada data aktivitas ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-3 px-2">
                <div className="text-xs text-slate-500">
                    Showing {filteredLogs.length} activity
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSearchTerm("")}
                        className="text-sm text-slate-500 hover:text-sky-600"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
