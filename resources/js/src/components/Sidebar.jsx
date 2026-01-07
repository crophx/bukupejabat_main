import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import React from "react";

export default function Sidebar() {
    const [openJabatan, setOpenJabatan] = useState(false);
    const location = useLocation();
    const isUnitActive = location.pathname.startsWith("/unit-kerja");
    const isOpen = openJabatan || isUnitActive;

    return (
        <aside className="w-64 hidden md:block">
            <div className="sticky top-8">
                <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100 h-full">
                    {/* <div className="mb-4 px-1">
            <div className="text-lg text-slate-900 font-bold px-3">
              Navigation
            </div>
          </div> */}

                    <nav className="space-y-1">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `relative w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-200 ${
                                    isActive ? "bg-slate-200" : ""
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-r bg-sky-500 transition-opacity ${
                                            isActive
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                    />
                                    <span className="h-5 w-5 bg-sky-100 rounded-sm flex items-center justify-center text-sky-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                    <span className="text-sm font-medium text-slate-800">
                                        Dashboard Admin
                                    </span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/pegawai"
                            end
                            className={({ isActive }) =>
                                `relative w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-200 ${
                                    isActive ? "bg-slate-200" : ""
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-r bg-sky-500 transition-opacity ${
                                            isActive
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                    />
                                    <span className="h-5 w-5 bg-slate-100 rounded-sm flex items-center justify-center text-slate-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                                                clipRule="evenodd"
                                            />
                                            <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                                        </svg>
                                    </span>
                                    <span className="text-sm font-medium text-slate-700">
                                        Data Pegawai
                                    </span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/pegawai/tambah"
                            className={({ isActive }) =>
                                `relative w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-200 ${
                                    isActive ? "bg-slate-200" : ""
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-r bg-sky-500 transition-opacity ${
                                            isActive
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                    />
                                    <span className="h-5 w-5 bg-slate-100 rounded-sm flex items-center justify-center text-slate-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="size-6"
                                        >
                                            <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
                                        </svg>
                                    </span>
                                    <span className="text-sm font-medium text-slate-700">
                                        Tambah Pegawai
                                    </span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                `relative w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-200 ${
                                    isActive ? "bg-slate-200" : ""
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-r bg-sky-500 transition-opacity ${
                                            isActive
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                    />
                                    <span className="h-5 w-5 bg-slate-100 rounded-sm flex items-center justify-center text-slate-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="size-6"
                                        >
                                            <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
                                        </svg>
                                    </span>
                                    <span className="text-sm font-medium text-slate-700">
                                        Data Admin
                                    </span>
                                </>
                            )}
                        </NavLink>

                        <div className="border-t border-slate-100 mt-2 pt-3">
                            <div className="space-y-1">
                                <button
                                    className="relative w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-200"
                                    onClick={() => setOpenJabatan((o) => !o)}
                                >
                                    <span className="h-5 w-5 bg-slate-100 rounded-sm flex items-center justify-center text-slate-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="size-6"
                                        >
                                            <path d="M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z" />
                                        </svg>
                                    </span>
                                    <span className="text-sm font-medium text-slate-700">
                                        Data Unit Kerja
                                    </span>
                                    <span className="ml-auto text-xs text-slate-400">
                                        {isOpen ? "▾" : "▸"}
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        <NavLink
                                            to="/unit-kerja"
                                            className={({ isActive }) =>
                                                `relative w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600 ${
                                                    isActive
                                                        ? "bg-slate-100"
                                                        : ""
                                                }`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <span
                                                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-r bg-sky-500 transition-opacity ${
                                                            isActive
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        }`}
                                                    />
                                                    Form Input Jabatan/Unit
                                                    Kerja
                                                </>
                                            )}
                                        </NavLink>
                                        {/* <NavLink
                      to="/unit-kerja/form"
                      className={({ isActive }) => `relative w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600 ${isActive ? 'bg-slate-100' : ''}`}
                    >
                      {({ isActive }) => (
                        <>
                          <span className={`absolute left-0 top-0 bottom-0 w-1 rounded-r bg-sky-500 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                          Form Input
                        </>
                      )}
                    </NavLink> */}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* <div className="border-t border-slate-100 mt-3 pt-3">
              <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-slate-600">
                <span className="h-5 w-5 bg-red-100 rounded-sm flex items-center justify-center text-red-600">⎋</span>
                <span className="text-sm font-medium text-slate-600">Sign Out</span>
              </button>
            </div> */}
                    </nav>
                </div>
            </div>
        </aside>
    );
}
