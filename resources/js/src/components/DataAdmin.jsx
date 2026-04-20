import React, { useState, useEffect } from "react";
import axios from "axios"; // Pastikan axios diimport
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";
import Pagination from "./Pagination";

const defaultUnitOptions = [
    "Pusat / Semua Unit",
    "Biro Sumber Daya Manusia",
    "Biro Hukum dan Organisasi",
    "KBRI Tokyo",
    "KJRI New York",
    "KJRI Sydney",
];

export default function DataAdmin() {
    // 1. Ganti sampleAdmins dengan array kosong dulu
    const [admins, setAdmins] = useState([]);
    const [query, setQuery] = useState("");
    const [isAddOpen, setAddOpen] = useState(false);
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

    const openAdd = () => {
        setAddOpen(true);
    };

    const handleAdd = (newAdmin) => {
        const createdAt = new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        setAdmins((prev) => [
            {
                id: Date.now(),
                unit: newAdmin.unit || defaultUnitOptions[0],
                email: newAdmin.email,
                username: newAdmin.username,
                role: newAdmin.role || "admin",
                createdAt,
            },
            ...prev,
        ]);
        setAddOpen(false);
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

    const unitOptions = [
        ...new Set([
            ...defaultUnitOptions,
            ...admins
                .map((item) => item.unit)
                .filter((unit) => unit && unit !== "-"),
        ]),
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700 relative mb-6">
            <section>
                <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Data Admin
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                            {query
                                ? `Ditemukan ${filtered.length} hasil`
                                : `Total ${admins.length} admin tersedia`}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari admin..."
                                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full bg-slate-50 text-slate-700"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={openAdd}
                            className="px-4 py-2 text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-colors text-sm font-semibold whitespace-nowrap"
                        >
                            Tambah Admin
                        </button>
                    </div>
                </div>

                <div className="w-full overflow-x-auto border-t border-slate-100">
                    <table className="w-full text-left border-collapse min-w-[900px] table-auto">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                            <tr>
                                <th className="px-4 py-4 border-b border-slate-100">
                                    Unit Organisasi
                                </th>
                                <th className="px-4 py-4 border-b border-slate-100">
                                    Email
                                </th>
                                <th className="px-4 py-4 border-b border-slate-100">
                                    Username
                                </th>
                                <th className="px-4 py-4 border-b border-slate-100">
                                    Role
                                </th>
                                <th className="px-4 py-4 border-b border-slate-100">
                                    Akun dibuat
                                </th>
                                <th className="px-4 py-4 border-b border-slate-100 w-24 text-center sticky right-0 bg-slate-50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] z-10">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.length > 0 ? (
                                currentAdmins.map((a) => (
                                    <tr
                                        key={a.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-4 py-4 text-slate-600 font-bold">
                                            {a.unit}
                                        </td>
                                        <td className="px-4 py-4 text-slate-500 break-all whitespace-normal">
                                            {a.email}
                                        </td>
                                        <td className="px-4 py-4 text-slate-500">
                                            {a.username}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${a.role === "superadmin"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-emerald-100 text-emerald-700"
                                                    }`}
                                            >
                                                {a.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                                            {a.createdAt}
                                        </td>
                                        <td className="px-4 py-4 text-center sticky right-0 bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                                            {/* edit */}
                                            <button
                                                onClick={() => {
                                                    openEdit(a)
                                                }}
                                                className="btn btn-sm btn-square btn-ghost text-amber-500 hover:bg-amber-100"
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
                                                className="btn btn-sm btn-square btn-ghost text-rose-500 hover:bg-rose-100"
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
                                        className="py-10 text-center text-slate-400"
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
                open={isAddOpen}
                onClose={() => setAddOpen(false)}
                title="Tambah Admin"
            >
                <AdminForm
                    initialData={{
                        unit: defaultUnitOptions[0],
                        email: "",
                        username: "",
                        role: "admin",
                    }}
                    unitOptions={unitOptions}
                    submitLabel="Tambah"
                    onCancel={() => setAddOpen(false)}
                    onSave={(u) => {
                        handleAdd(u);
                    }}
                />
            </Modal>

            <Modal
                open={isEditOpen}
                onClose={() => setEditOpen(false)}
                title="Edit Admin"
            >
                {selected && (
                    <AdminForm
                        initialData={selected}
                        unitOptions={unitOptions}
                        submitLabel="Simpan"
                        onCancel={() => setEditOpen(false)}
                        onSave={(u) => {
                            handleSave(u);
                            setEditOpen(false);
                        }}
                        isEdit={true}
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

function AdminForm({ initialData = {}, onSave, onCancel, submitLabel = "Simpan", unitOptions = [], isEdit = false }) {
    const [form, setForm] = useState({ ...initialData });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSave && onSave(form);
            }}
        >
            <div className="grid gap-4">
                <div>
                    <label className="block text-xl font-bold text-slate-700 mb-1">
                        Unit Organisasi
                    </label>
                    {isEdit ? (
                        <input
                            value={form.unit || ""}
                            disabled
                            className="w-full border border-slate-300 px-3 py-2 rounded-xl text-sm text-slate-500 bg-slate-100 cursor-not-allowed"
                        />
                    ) : (
                        <select
                            value={form.unit || unitOptions[0] || ""}
                            onChange={(e) =>
                                setForm({ ...form, unit: e.target.value })
                            }
                            className="w-full border border-slate-300 px-3 py-2 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        >
                            {unitOptions.map((unit) => (
                                <option key={unit} value={unit}>
                                    {unit}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                        value={form.email || ""}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        className="w-full border border-slate-300 px-3 py-2 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <input
                        value={form.username || ""}
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                        className="w-full border border-slate-300 px-3 py-2 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <select
                        value={form.role || "admin"}
                        onChange={(e) =>
                            setForm({ ...form, role: e.target.value })
                        }
                        className="w-full border border-slate-300 px-3 py-2 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    >
                        <option value="superadmin">Super Admin</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-sm btn-ghost text-slate-500 hover:bg-slate-100"
                >
                    Batal
                </button>
                <button type="submit" className="btn btn-sm bg-sky-500 hover:bg-sky-600 text-white border-none">
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
