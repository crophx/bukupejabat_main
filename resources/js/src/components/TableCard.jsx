import React from "react";
import { useState } from "react";
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";

export default function TableCard({ rows = [] }) {
    // rows: array of { no, nip, name, unit, position, phone }
    const initialData = rows.length
        ? rows
        : [
              {
                  no: 1,
                  nip: "19870512",
                  name: "Rina Sari",
                  unit: "Keuangan",
                  position: "Staf",
                  phone: "0832981091",
                  alamat: "Jl. Pejambon",
              },
              {
                  no: 2,
                  nip: "19901203",
                  name: "Budi Santoso",
                  unit: "SDM",
                  position: "Manager",
                  phone: "0832919310",
                  alamat: "Jl. Merdeka",
              },
          ];

    const [data, setData] = useState(initialData);
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    return (
        <div className="bg-white rounded-2xl px-5 py-3 shadow-md border border-slate-100 w-full text-slate-700">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-slate-900">
                    Data Pegawai
                </h2>
                <div className="flex items-center gap-2">
                    {/* <button className="btn btn-accent rounded-xl text-neutral-50">
                        Tambah Pegawai
                    </button> */}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                                No
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                                NIP
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                                Nama
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                                Jabatan/Unit Kerja
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                                Handphone
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                                Alamat
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-900 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {data.map((r) => (
                            <tr key={r.no}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                                    {r.no}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                                    {r.nip}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-800">
                                    {r.name}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                                    {r.unit} — {r.position}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                                    {r.phone}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                                    {r.alamat}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                                    <div className="inline-flex items-center gap-3 px-3 py-2 rounded-full bg-emerald-100 border border-emerald-200">
                                        {/* icon edit */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 28 28"
                                            fill="currentColor"
                                            className="size-6 text-slate-700 hover:text-slate-900 cursor-pointer"
                                            onClick={() => {
                                                setSelectedRow(r);
                                                setEditOpen(true);
                                            }}
                                        >
                                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                        </svg>

                                        {/* icon delete */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 28 28"
                                            fill="currentColor"
                                            className="size-6 text-slate-700 hover:text-slate-900 cursor-pointer"
                                            onClick={() => {
                                                setSelectedRow(r);
                                                setDeleteOpen(true);
                                            }}
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit modal */}
            <Modal
                open={isEditOpen}
                onClose={() => setEditOpen(false)}
                title="Edit Pegawai"
            >
                {selectedRow && (
                    <EditForm
                        initialData={selectedRow}
                        onCancel={() => setEditOpen(false)}
                        onSave={(updated) => {
                            setData((prev) =>
                                prev.map((it) =>
                                    it.no === updated.no ? updated : it
                                )
                            );
                            setEditOpen(false);
                        }}
                    />
                )}
            </Modal>

            {/* Delete confirmation */}
            <ConfirmModal
                open={isDeleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={() => {
                    if (selectedRow)
                        setData((prev) =>
                            prev.filter((it) => it.no !== selectedRow.no)
                        );
                }}
                message={`Hapus ${selectedRow?.name ?? "item"}?`}
            />

            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <div>
                    Showing 1–{initialData.length} of {initialData.length}
                </div>
                <div className="inline-flex items-center gap-2">
                    <button className="px-2 py-1 border border-slate-200 rounded">
                        Prev
                    </button>
                    <button className="px-2 py-1 border border-slate-200 rounded">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

function EditForm({ initialData = {}, onSave, onCancel }) {
    const [form, setForm] = useState({ ...initialData });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSave && onSave(form);
            }}
        >
            <div className="grid gap-5">
                <div className="grid gap-1">
                    <p className="text-sm text-black">Nama</p>
                    <input
                        className="border p-2 rounded-md border text-black border-slate-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                        value={form.name || ""}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Nama"
                    />
                    <p className="text-sm text-black">NIP</p>
                    <input
                        className="border p-2 rounded-md border text-black border-slate-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                        value={form.nip || ""}
                        onChange={(e) =>
                            setForm({ ...form, nip: e.target.value })
                        }
                        placeholder="NIP"
                    />
                    <p className="text-sm text-black">Unit</p>
                    <input
                        className="border p-2 rounded-md border text-black border-slate-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                        value={form.unit || ""}
                        onChange={(e) =>
                            setForm({ ...form, unit: e.target.value })
                        }
                        placeholder="Unit"
                    />
                    <p className="text-sm text-black">Jabatan</p>
                    <input
                        className="border p-2 rounded-md border text-black border-slate-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                        value={form.position || ""}
                        onChange={(e) =>
                            setForm({ ...form, position: e.target.value })
                        }
                        placeholder="Jabatan"
                    />
                    <p className="text-sm text-black">No. Handphone</p>
                    <input
                        className="border p-2 rounded-md border text-black border-slate-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                        value={form.phone || ""}
                        onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="Phone"
                    />
                    <p className="text-sm text-black">Alamat</p>
                    <input
                        className="border p-2 rounded-md border text-black border-slate-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                        value={form.alamat || ""}
                        onChange={(e) =>
                            setForm({ ...form, alamat: e.target.value })
                        }
                        placeholder="Alamat"
                    />
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <button onClick={onCancel} className="px-3 py-1 btn btn-soft">
                    Batal
                </button>
                {/* <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Simpan
        </button> */}
                <button type="submit" className="btn btn-info text-white">
                    Simpan
                </button>
            </div>
        </form>
    );
}
