// import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
// import { ChevronDownIcon } from '@heroicons/react/20/solid'
import React, { useState } from "react";
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";

const sampleAdmins = [
    {
        id: 1,
        unit: "Biro Sumber Daya Manusia",
        email: "jeanskaret@gmail.com",
        username: "BSDM",
        role: "Admin",
        createdAt: "2025-12-06",
    },
    {
        id: 2,
        unit: "Biro Hukum",
        email: "hukum@example.com",
        username: "ROKUM",
        role: "Admin",
        createdAt: "2025-11-12",
    },
];

export default function DataAdmin() {
    const [admins, setAdmins] = useState(sampleAdmins);
    const [query, setQuery] = useState("");
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const openEdit = (item) => {
        setSelected(item);
        setEditOpen(true);
    };

    const openDelete = (item) => {
        setSelected(item);
        setDeleteOpen(true);
    };

    const handleSave = (updated) => {
        setAdmins((prev) =>
            prev.map((a) => (a.id === updated.id ? updated : a))
        );
    };

    const handleDelete = () => {
        if (!selected) return;
        setAdmins((prev) => prev.filter((a) => a.id !== selected.id));
        setSelected(null);
    };

    const filtered = admins.filter((a) =>
        (a.unit + a.email + a.username + a.role)
            .toLowerCase()
            .includes(query.toLowerCase())
    );

    return (
        <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100 mb-6 space-y-6 text-slate-700">
            <section className="bg-white rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {/* <input value={query} onChange={(e) => setQuery(e.target.value)} className="text-sm text-slate-500 w-full sm:w-64 px-3 py-1 rounded-xl border border-gray-400 " placeholder="Search..." /> */}
                        {/* Search icon Daisy coba dulu */}
                        <label className="input bg-white border border-slate-400 text-slate-400 rounded-xl">
                            <svg
                                className="h-[1em]"
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
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search"
                                className="pl-1 text-slate-700"
                            />
                        </label>

                        {/* <Menu as="div" className="relative inline-block">
							<MenuButton className="inline-flex w-full justify-center gap-x-1 rounded-xl px-3 py-1 text-sm text-slate-500 border border-gray-400 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
								Options
								<ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
							</MenuButton>

							<MenuItems
								transition
								className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
							>
								<div className="py-1">
									<MenuItem>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
										>
											Account settings
										</a>
									</MenuItem>
								</div>
							</MenuItems>
						</Menu> */}
                    </div>

                    {/* button reset & apply */}
                    {/* <div className="flex items-center gap-2">
						<button className="text-sm text-slate-500 px-3 py-1 rounded-xl bg-white border border-gray-400">Reset</button>
						<button className="text-sm text-slate-500 px-3 py-1 rounded-xl bg-slate-100 border border-gray-400">Apply</button>
					</div> */}
                </div>

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm table-auto">
                        <thead className="text-left text-xs text-slate-500 border-b">
                            <tr>
                                <th className="py-2">Unit Organisasi</th>
                                <th className="py-2">Email</th>
                                <th className="py-2">Username</th>
                                <th className="py-2">Role</th>
                                <th className="py-2">Akun dibuat</th>
                                <th className="py-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((a) => (
                                <tr key={a.id} className="hover:bg-slate-50">
                                    <td className="py-2 text-slate-500">
                                        {a.unit}
                                    </td>
                                    <td className="py-2 text-slate-500">
                                        {a.email}
                                    </td>
                                    <td className="py-2 text-slate-500">
                                        {a.username}
                                    </td>
                                    <td className="py-2">
                                        <span className="px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-700">
                                            {a.role}
                                        </span>
                                    </td>
                                    <td className="py-2 text-slate-500">
                                        {a.createdAt}
                                    </td>
                                    <td className="py-2">
                                        <div className="flex items-center gap-2">
                                            <span
                                                onClick={() => openEdit(a)}
                                                className="px-2 py-0.5 rounded text-xs bg-sky-100 text-sky-700 cursor-pointer"
                                            >
                                                Edit
                                            </span>
                                            <span
                                                onClick={() => openDelete(a)}
                                                className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 cursor-pointer"
                                            >
                                                Delete
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <div>
                        Showing {filtered.length} of {admins.length}
                    </div>
                    {/* button prev & next */}
                    {/* <div className="flex items-center gap-2">
						<button className="px-2 py-1 rounded-xl bg-white border">Prev</button>
						<button className="px-2 py-1 rounded-xl bg-white border">Next</button>
					</div> */}
                </div>
            </section>

            <Modal
                open={isEditOpen}
                onClose={() => setEditOpen(false)}
                title="Edit Admin"
            >
                {selected && (
                    <AdminEditForm
                        initialData={selected}
                        onCancel={() => setEditOpen(false)}
                        onSave={(u) => {
                            handleSave(u);
                            setEditOpen(false);
                        }}
                    />
                )}
            </Modal>

            <ConfirmModal
                open={isDeleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                message={`Hapus akun ${selected?.username ?? "item"}?`}
            />
        </div>
    );
}

function AdminEditForm({ initialData = {}, onSave, onCancel }) {
    const [form, setForm] = useState({ ...initialData });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSave && onSave(form);
            }}
        >
            <div className="grid gap-3">
                <div>
                    <label className="text-sm text-black">
                        Unit Organisasi
                    </label>
                    <input
                        value={form.unit || ""}
                        onChange={(e) =>
                            setForm({ ...form, unit: e.target.value })
                        }
                        className="w-full border p-2 rounded-md text-sm text-slate-700"
                    />
                </div>
                <div>
                    <label className="text-sm text-black">Email</label>
                    <input
                        value={form.email || ""}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        className="w-full border p-2 rounded-md text-sm text-slate-700"
                    />
                </div>
                <div>
                    <label className="text-sm text-black">Username</label>
                    <input
                        value={form.username || ""}
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                        className="w-full border p-2 rounded-md text-sm text-slate-700"
                    />
                </div>
                <div>
                    <label className="text-sm text-black">Role</label>
                    <select
                        value={form.role || "Admin"}
                        onChange={(e) =>
                            setForm({ ...form, role: e.target.value })
                        }
                        className="w-full border p-2 rounded-md text-sm text-slate-700"
                    >
                        <div className="w-full border p-2 rounded-xl text-sm text-slate-700">
                            <option>Superrr Admin</option>
                            <option>Admin</option>
                        </div>
                    </select>
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-3 py-1 btn btn-soft"
                >
                    Batal
                </button>
                <button type="submit" className="btn btn-info text-white">
                    Simpan
                </button>
            </div>
        </form>
    );
}
