import React, { useState, useEffect } from "react";
import axios from "axios"; // Pastikan axios diimport
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";

export default function DataAdmin() {
    // 1. Ganti sampleAdmins dengan array kosong dulu
    const [admins, setAdmins] = useState([]);
    const [query, setQuery] = useState("");
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    // 2. FETCH DATA DARI DATABASE SAAT HALAMAN DIBUKA
    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            // Panggil API yang baru kita buat
            const response = await axios.get("http://127.0.0.1:8000/api/users");

            if (response.data.success) {
                // 3. MAPPING DATA (PENTING!)
                // Kita ubah format database agar sesuai dengan format tampilan Anda
                const formattedData = response.data.data.map((user) => ({
                    id: user.id,
                    // Ambil nama unit kerja dari relasi, kalau kosong tulis '-'
                    unit: user.unit_kerja
                        ? user.unit_kerja.nama_unit_kerja
                        : "-",
                    email: user.email,
                    username: user.username,
                    role: user.role || "Admin", // Default role jika kosong
                    // Format tanggal agar cantik (DD/MM/YYYY)
                    createdAt: new Date(user.created_at).toLocaleDateString(
                        "id-ID",
                        {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        },
                    ),
                }));

                setAdmins(formattedData);
            }
        } catch (error) {
            console.error("Gagal mengambil data admin:", error);
        }
    };

    const openEdit = (item) => {
        setSelected(item);
        setEditOpen(true);
    };

    const openDelete = (item) => {
        setSelected(item);
        setDeleteOpen(true);
    };

    // Note: Handle Save & Delete sementara hanya update di layar (Frontend)
    // Nanti bisa ditambahkan logika API-nya
    const handleSave = (updated) => {
        setAdmins((prev) =>
            prev.map((a) => (a.id === updated.id ? updated : a)),
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
            .includes(query.toLowerCase()),
    );

    return (
        <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100 mb-6 space-y-6 text-slate-700">
            <section className="bg-white rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
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
                    </div>
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
                            {filtered.length > 0 ? (
                                filtered.map((a) => (
                                    <tr
                                        key={a.id}
                                        className="hover:bg-slate-50"
                                    >
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
                                            <span
                                                className={`px-2 py-0.5 rounded text-xs ${
                                                    a.role === "superadmin"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-emerald-100 text-emerald-700"
                                                }`}
                                            >
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
                                                    onClick={() =>
                                                        openDelete(a)
                                                    }
                                                    className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 cursor-pointer"
                                                >
                                                    Delete
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="py-4 text-center text-slate-400"
                                    >
                                        Data tidak ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <div>
                        Showing {filtered.length} of {admins.length}
                    </div>
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
                        readOnly // Unit Kerja biasanya tidak diedit manual text, sebaiknya dropdown nanti
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
                        value={form.role || "admin"}
                        onChange={(e) =>
                            setForm({ ...form, role: e.target.value })
                        }
                        className="w-full border p-2 rounded-md text-sm text-slate-700"
                    >
                        <option value="superadmin">Super Admin</option>
                        <option value="admin">Admin</option>
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
