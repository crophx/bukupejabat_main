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
                    ``
                    <input
                        aria-label="Search logs"
                        className="border-xl px-2 py-1 rounded text-sm"
                        placeholder="Search user"
                    />
                    {/* <select aria-label="Filter action" className="border px-2 py-1 rounded text-sm">
            <option>All actions</option>
            <option>CREATE</option>
            <option>UPDATE</option>
            <option>DELETE</option>
            <option>LOGIN</option>
            <option>LOGOUT</option>
          </select>

          <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">Export</button> */}
                </div>
            </div>

            <div className="overflow-y-auto max-h-72">
                <table className="w-full text-sm table-auto">
                    <thead className="text-left text-xs text-slate-500 border-b">
                        <tr>
                            <th className="py-2">Time</th>
                            <th className="py-2">User</th>
                            <th className="py-2">Action</th>
                            <th className="py-2">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-slate-50 cursor-default">
                            <td className="py-2 align-top">2025-12-12 14:32</td>
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

                        <tr className="hover:bg-slate-50 cursor-default">
                            <td className="py-2 align-top">2025-12-12 13:12</td>
                            <td className="py-2 align-top">
                                <div className="text-sm font-medium">Anton</div>
                                <div className="text-xs text-slate-500">
                                    admin
                                </div>
                            </td>
                            <td className="py-2 align-top flex items-center gap-2">
                                ✖ <span className="font-medium">DELETE</span>
                            </td>
                            <td className="py-2 align-top text-slate-600">
                                Deleted unit (soft)
                            </td>
                        </tr>

                        <tr className="hover:bg-slate-50 cursor-default">
                            <td className="py-2 align-top">2025-12-11 08:01</td>
                            <td className="py-2 align-top">
                                <div className="text-sm font-medium">Admin</div>
                                <div className="text-xs text-slate-500">
                                    super
                                </div>
                            </td>
                            <td className="py-2 align-top flex items-center gap-2">
                                🔑 <span className="font-medium">LOGIN</span>
                            </td>
                            <td className="py-2 align-top text-slate-600">
                                Admin login from web
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
