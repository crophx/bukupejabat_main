import React from "react";

export default function LogHistory() {
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
                        <svg className="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input
                            type="search"
                            placeholder="Search..."
                            className="grow"
                        />
                    </label>
                </div>
            </div>
            
            <div className="overflow-y-auto max-h-72">
                <table className="w-full text-sm table-auto">
                    <thead className="text-left text-xs text-slate-500 border-b">
                        <tr>
                            <th className="py-2">Date</th>
                            <th className="py-2">Time</th>
                            <th className="py-2">User</th>
                            <th className="py-2">Action</th>
                            <th className="py-2">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-slate-50 cursor-default text-slate-500">
                            <td className="py-2 align-top">2025-12-12</td>
                            <td className="py-2 align-top">14:32</td>
                            <td className="py-2 align-top">
                                <div className="text-sm font-medium">Siti</div>
                                <div className="text-xs text-slate-500">
                                    admin
                                </div>
                            </td>
                            <td className="py-2 align-top flex items-center gap-2">
                                ✎ <span className="font-medium">UPDATE</span>
                            </td>
                            <td className="py-2 align-top text-slate-600">
                                Updated job title
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-slate-500">Showing 3 of 3</div>
                <div className="flex items-center gap-2">
                    <button className="text-sm text-slate-500">Reset</button>
                </div>
            </div>
        </div>
    );
}
