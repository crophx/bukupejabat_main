import React, { useState, useEffect } from "react";
import axios from "axios"; // Pastikan axios diimport
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";
import Pagination from "./Pagination";

export default function DataAdmin() {
    // 1. Ganti sampleAdmins dengan array kosong dulu
    const [admins, setAdmins] = useState([]);
    const [query, setQuery] = useState("");
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
    // Fungsi Edit yang sudah disambungkan ke Backend
    const handleSave = async (updated) => {
        try {
            // Mengirim data ke API Laravel
            const response = await axios.put(
                `http://127.0.0.1:8000/api/users/${updated.id}`,
                {
                    username: updated.username,
                    email: updated.email,
                    role: updated.role,
                },
            );

            if (response.data.success) {
                // Jika sukses, tutup modal dan refresh tabel
                setEditOpen(false);
                fetchAdmins();
            }
        } catch (error) {
            console.error("Gagal mengupdate admin:", error);
            alert(
                "Gagal menyimpan data. Silakan periksa koneksi atau console.",
            );
        }
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

    // Reset ke halaman 1 saat pencarian berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentAdmins = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

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
                                currentAdmins.map((a) => (
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
                                                className={`px-2 py-0.5 rounded text-xs ${a.role === "superadmin"
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
                                            {/* edit */}
                                            <button
                                                onClick={() => {
                                                    openEdit(a)
                                                }}
                                                className="btn btn-sm btn-square btn-ghost text-amber-500 hover:bg-amber-50"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                                                </svg>
                                            </button>
                                            {/* delete */}
                                            <button
                                                onClick={() => {
                                                    openDelete(a)
                                                }}
                                                className="btn btn-sm btn-square btn-ghost text-rose-500 hover:bg-rose-50"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
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

                {filtered.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filtered.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={(value) => {
                            setItemsPerPage(value);
                            setCurrentPage(1);
                        }}
                        itemsPerPageOptions={[10, 25, 50, 100]}
                    />
                )}
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