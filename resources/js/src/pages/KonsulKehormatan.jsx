import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";

// ─── Local Data Negara (sementara, nanti diganti GET dari API) ───────────────
const NEGARA_LIST = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina",
    "Armenia", "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh",
    "Belarus", "Belgium", "Bolivia", "Bosnia and Herzegovina", "Brazil",
    "Brunei Darussalam", "Bulgaria", "Cambodia", "Canada", "Chile", "China",
    "Colombia", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark",
    "Ecuador", "Egypt", "Ethiopia", "Finland", "France", "Georgia", "Germany",
    "Ghana", "Greece", "Hungary", "India", "Iran", "Iraq", "Ireland",
    "Israel", "Italy", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait",
    "Laos", "Latvia", "Lebanon", "Libya", "Lithuania", "Luxembourg",
    "Malaysia", "Maldives", "Malta", "Mexico", "Morocco", "Myanmar",
    "Netherlands", "New Zealand", "Nigeria", "North Korea", "Norway", "Oman",
    "Pakistan", "Palestine", "Papua New Guinea", "Peru", "Philippines",
    "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia",
    "Senegal", "Serbia", "Singapore", "Slovakia", "Slovenia", "Somalia",
    "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden",
    "Switzerland", "Syria", "Taiwan", "Tanzania", "Thailand", "Timor-Leste",
    "Tunisia", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom",
    "United States", "Uzbekistan", "Venezuela", "Vietnam", "Yemen",
    "Zimbabwe",
];

// ─── Initial Dummy Data ───────────────────────────────────────────────────────
const INITIAL_KONSULS = [
    {
        id: 1,
        negara: "Italy",
        kota: "Napoli",
        alamat: "Via Partenope, 14\n80121 Napoli",
        no_telp: "(+39) 349 7632499",
        fax: "-",
        email: "consolatoindonesia@alice.it",
        website: "-",
        hari_kerja: "Senin – Jumat, 09.00 – 17.00",
    },
    {
        id: 2,
        negara: "Italy",
        kota: "Genoa",
        alamat: "Via Fieschi 8/1\n16121 Genova",
        no_telp: "-",
        fax: "-",
        email: "-",
        website: "-",
        hari_kerja: "Senin – Jumat, 08.00 – 16.00",
    },
    {
        id: 3,
        negara: "Italy",
        kota: "Florence",
        alamat: "Street Pier Capponi no. 87\n50132 Florence",
        no_telp: "+39 055 582 580",
        fax: "+39 055 582 580",
        email: "jacopocappucio@gmail.com",
        website: "www.konsulflorence.it",
        hari_kerja: "Senin – Kamis, 09.00 – 17.00",
    },
];

const INITIAL_PEJABAT = [
    {
        id: 1,
        konsul_id: 1,
        nama: "Mr. Giuseppe Testa",
        gelar_jabatan: "Konsul Kehormatan RI di Napoli",
        alamat: "Via Partenope, 14, 80121 Napoli, Italy",
        no_telp: "(+39) 349 7632499",
    },
    {
        id: 2,
        konsul_id: 2,
        nama: "Dr. Ivo Guidi",
        gelar_jabatan: "Konsul Kehormatan RI di Genoa",
        alamat: "Via Fieschi 8/1, 16121 Genova, Italia",
        no_telp: "-",
    },
    {
        id: 3,
        konsul_id: 3,
        nama: "Mr. Jacopo Cappucio",
        gelar_jabatan: "Konsul Kehormatan RI di Florence",
        alamat: "Street Pier Capponi no. 87, 50132 Florence",
        no_telp: "+39 055 582 580",
    },
];

// ─── Empty form templates ─────────────────────────────────────────────────────
const EMPTY_KONSUL = {
    id: "", negara: "", kota: "", alamat: "",
    no_telp: "", fax: "", email: "", website: "", hari_kerja: "",
};
const EMPTY_PEJABAT = {
    id: "", konsul_id: "", nama: "", gelar_jabatan: "", alamat: "", no_telp: "",
};

// ─── Reusable Field Components ────────────────────────────────────────────────
const Field = ({ label, required, children }) => (
    <div className="form-control">
        <label className="text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const inputCls =
    "input input-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold h-12";
const textareaCls =
    "textarea textarea-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold min-h-[90px] py-3";

// ─── MODAL: Tambah / Edit Konsul Kehormatan ───────────────────────────────────
function KonsulModal({ isOpen, isEditing, data, onChange, onSubmit, onClose, isSaving }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) return;

        if (isOpen && !modal.open) {
            modal.showModal();
        }

        if (!isOpen && modal.open) {
            modal.close();
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <dialog
            ref={modalRef}
            className="modal modal-bottom sm:modal-middle"
            onCancel={(e) => {
                e.preventDefault();
                onClose();
            }}
        >
            <div className="modal-box bg-white max-w-2xl rounded-3xl p-8 border border-slate-100 shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-xl text-slate-800 tracking-tight uppercase">
                        {isEditing ? "Edit Konsul Kehormatan" : "Tambah Konsul Kehormatan"}
                    </h3>
                    <button type="button" onClick={onClose} className="btn btn-sm btn-circle btn-ghost text-slate-400">x</button>
                </div>

                {/* Body */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Negara */}
                    <Field label="Negara" required>
                        <select
                            name="negara"
                            value={data.negara}
                            onChange={onChange}
                            required
                            className="select select-bordered w-full bg-white text-slate-800 border-slate-200 focus:ring-4 focus:ring-sky-100 transition-all rounded-2xl text-sm font-semibold h-12"
                        >
                            <option value="">-- Pilih Negara --</option>
                            {NEGARA_LIST.map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </Field>

                    {/* Kota */}
                    <Field label="Kota" required>
                        <input
                            type="text"
                            name="kota"
                            value={data.kota}
                            onChange={onChange}
                            required
                            placeholder="Contoh: Napoli"
                            className={inputCls}
                        />
                    </Field>

                    {/* Alamat */}
                    <Field label="Alamat" required>
                        <textarea
                            name="alamat"
                            value={data.alamat}
                            onChange={onChange}
                            required
                            rows={3}
                            placeholder={"Contoh:\nVia Partenope, 14\n80121 Napoli"}
                            className={textareaCls}
                        />
                    </Field>

                    {/* No. Telp & Fax */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="No. Telepon">
                            <input
                                type="text"
                                name="no_telp"
                                value={data.no_telp}
                                onChange={onChange}
                                placeholder="+62 21 xxxxxxxx"
                                className={inputCls}
                            />
                        </Field>
                        <Field label="Fax">
                            <input
                                type="text"
                                name="fax"
                                value={data.fax}
                                onChange={onChange}
                                placeholder="+62 21 xxxxxxxx"
                                className={inputCls}
                            />
                        </Field>
                    </div>

                    {/* Email & Website */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Email">
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={onChange}
                                placeholder="contoh@email.com"
                                className={inputCls}
                            />
                        </Field>
                        <Field label="Website">
                            <input
                                type="text"
                                name="website"
                                value={data.website}
                                onChange={onChange}
                                placeholder="www.example.com"
                                className={inputCls}
                            />
                        </Field>
                    </div>

                    {/* Hari Kerja */}
                    <Field label="Hari Kerja">
                        <input
                            type="text"
                            name="hari_kerja"
                            value={data.hari_kerja}
                            onChange={onChange}
                            placeholder="Contoh: Senin – Jumat, 09.00 – 17.00"
                            className={inputCls}
                        />
                    </Field>

                    {/* Footer */}
                    <div className="modal-action flex gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost text-slate-400 font-bold uppercase text-[10px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="btn bg-sky-600 hover:bg-sky-700 border-none text-white px-10 rounded-2xl font-bold text-xs uppercase"
                        >
                            {isSaving ? "Menyimpan..." : isEditing ? "Update" : "Tambah"}
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button type="button" onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function KonsulKehormatan() {
    const navigate = useNavigate();

    // ── Data State ──
    const [konsuls, setKonsuls] = useState([]);
    const [pejabats, setPejabats] = useState([]);
    const [loading, setLoading] = useState(false);

    // ── Search & Pagination ──
    const [searchKonsul, setSearchKonsul] = useState("");
    const [pageKonsul, setPageKonsul] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // ── Konsul Modal State ──
    const [konsulModal, setKonsulModal] = useState(false);
    const [isEditingKonsul, setIsEditingKonsul] = useState(false);
    const [konsulForm, setKonsulForm] = useState(EMPTY_KONSUL);
    const [savingKonsul, setSavingKonsul] = useState(false);

    // ── Fetch (dummy) ──
    useEffect(() => { fetchAll(); }, []);

    useEffect(() => {
        setPageKonsul(1);
    }, [searchKonsul]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            // Nanti ganti dengan:
            // const r1 = await axios.get(".../konsul-kehormatan");
            // const r2 = await axios.get(".../pejabat-konsul");
            setKonsuls(INITIAL_KONSULS);
            setPejabats(INITIAL_PEJABAT);
        } catch {
            Swal.fire({ icon: "error", title: "Oops...", text: "Gagal mengambil data.", confirmButtonColor: "#0ea5e9" });
        } finally {
            setLoading(false);
        }
    };

    // ── Helpers ──
    const nextId = (arr) => arr.length > 0 ? Math.max(...arr.map((x) => x.id)) + 1 : 1;

    // ════════════════════════ KONSUL CRUD ════════════════════════
    const openAddKonsul = () => {
        setKonsulForm(EMPTY_KONSUL);
        setIsEditingKonsul(false);
        setKonsulModal(true);
    };

    const openEditKonsul = (k) => {
        setKonsulForm({ ...k });
        setIsEditingKonsul(true);
        setKonsulModal(true);
    };

    const handleKonsulChange = (e) => {
        const { name, value } = e.target;
        setKonsulForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleKonsulSubmit = async () => {
        if (!konsulForm.negara || !konsulForm.kota || !konsulForm.alamat) {
            Swal.fire({ icon: "warning", title: "Peringatan", text: "Negara, Kota, dan Alamat wajib diisi.", confirmButtonColor: "#0ea5e9" });
            return;
        }
        setSavingKonsul(true);
        try {
            if (isEditingKonsul) {
                // await axios.put(`.../konsul-kehormatan/${konsulForm.id}`, konsulForm);
                setKonsuls((prev) => prev.map((item) => item.id === konsulForm.id ? { ...item, ...konsulForm } : item));
            } else {
                const newItem = { ...konsulForm, id: nextId(konsuls) };
                // await axios.post(".../konsul-kehormatan", konsulForm);
                setKonsuls((prev) => [...prev, newItem]);
            }
            setKonsulModal(false);
            setPageKonsul(1);
            Swal.fire({ icon: "success", title: "Berhasil!", text: isEditingKonsul ? "Data Konsul Kehormatan berhasil diperbarui." : "Data Konsul Kehormatan berhasil ditambahkan.", confirmButtonColor: "#0ea5e9" });
        } catch {
            Swal.fire({ icon: "error", title: "Oops...", text: "Gagal menyimpan data.", confirmButtonColor: "#0ea5e9" });
        } finally {
            setSavingKonsul(false);
        }
    };

    const handleDeleteKonsul = (id) => {
        Swal.fire({
            title: "Hapus Konsul Kehormatan?",
            text: "Data konsul beserta pejabat terkait akan dihapus permanen.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // await axios.delete(`.../konsul-kehormatan/${id}`);
                    setKonsuls((prev) => prev.filter((item) => item.id !== id));
                    setPejabats((prev) => prev.filter((item) => item.konsul_id !== id));
                    setPageKonsul(1);
                    Swal.fire({ icon: "success", title: "Berhasil!", text: "Data Konsul Kehormatan berhasil dihapus.", confirmButtonColor: "#0ea5e9" });
                } catch {
                    Swal.fire({ icon: "error", title: "Oops...", text: "Gagal menghapus data.", confirmButtonColor: "#0ea5e9" });
                }
            }
        });
    };

    // ── Filtered & Paginated ──
    const filteredKonsuls = konsuls.filter((k) => {
        const s = searchKonsul.toLowerCase();
        return (
            (k.negara || "").toLowerCase().includes(s) ||
            (k.kota || "").toLowerCase().includes(s) ||
            (k.alamat || "").toLowerCase().includes(s) ||
            (k.email || "").toLowerCase().includes(s)
        );
    });
    const totalPagesKonsul = Math.max(1, Math.ceil(filteredKonsuls.length / itemsPerPage));
    const currentKonsuls = filteredKonsuls.slice((pageKonsul - 1) * itemsPerPage, pageKonsul * itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPagesKonsul) return;
        setPageKonsul(page);
        window.scrollTo(0, 0);
    };

    // ─── RENDER ───────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 min-h-screen">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700 p-6 animate-in fade-in duration-500">
                {/* Header dengan Pencarian */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                            Daftar Konsul Kehormatan
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">Total {filteredKonsuls.length} data tersedia</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* Kotak Pencarian */}
                        <div className="relative w-full sm:w-64">
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Cari negara / kota..."
                                value={searchKonsul}
                                onChange={(e) => { setSearchKonsul(e.target.value); setPageKonsul(1); }}
                                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full bg-slate-50"
                            />
                        </div>

                        <button
                            onClick={openAddKonsul}
                            className="px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors font-medium text-sm whitespace-nowrap"
                        >
                            + Tambah Konsul
                        </button>
                    </div>
                </div>

                {/* Looping Data (Accordion) */}
                {loading ? (
                    <div className="text-center p-10">
                        <p className="text-sm text-slate-400">Memuat data...</p>
                    </div>
                ) : currentKonsuls.length > 0 ? (
                    <div className="space-y-3">
                        {currentKonsuls.map((k) => {
                            const pejabatCount = pejabats.filter((p) => p.konsul_id === k.id).length;
                            return (
                                <details key={k.id} className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                    <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-100 transition-colors list-none">
                                        <span className="font-bold text-slate-800 uppercase text-sm tracking-wider">
                                            {k.kota}, {k.negara}
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4 text-slate-400 group-open:rotate-180 transition-transform">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </summary>

                                    <div className="p-6 bg-white border-t border-slate-200 space-y-6">
                                        {/* Detail Row */}
                                        <div className="flex flex-wrap md:flex-nowrap justify-between gap-6 text-[14px] items-start">
                                            {/* Alamat */}
                                            <div className="flex-1 min-w-[130px]">
                                                <p className="font-bold text-slate-400 uppercase mb-1 text-xs">Alamat</p>
                                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{k.alamat || "-"}</p>
                                            </div>
                                            {/* No. Telepon */}
                                            <div className="flex-1 min-w-[150px]">
                                                <p className="font-bold text-slate-400 uppercase mb-1 text-xs">No. Telepon</p>
                                                <p className="text-slate-700 font-semibold">{k.no_telp || "-"}</p>
                                                {k.fax && k.fax !== "-" && (
                                                    <>
                                                        <p className="font-bold text-slate-400 uppercase mt-2 mb-1 text-xs">Fax</p>
                                                        <p className="text-slate-500 italic text-xs">{k.fax}</p>
                                                    </>
                                                )}
                                            </div>
                                            {/* Email & Website */}
                                            <div className="flex-1 min-w-[150px]">
                                                <p className="font-bold text-slate-400 uppercase mb-1 text-xs">Email</p>
                                                {k.email && k.email !== "-" ? (
                                                    <a href={`mailto:${k.email}`} className="text-sky-600 font-bold underline break-all whitespace-normal text-sm">{k.email}</a>
                                                ) : <p className="text-slate-400 text-sm">-</p>}
                                                {k.website && k.website !== "-" && (
                                                    <>
                                                        <p className="font-bold text-slate-400 uppercase mt-2 mb-1 text-xs">Website</p>
                                                        <p className="text-slate-400 break-all whitespace-normal text-sm">{k.website}</p>
                                                    </>
                                                )}
                                            </div>
                                            {/* Hari Kerja */}
                                            <div className="flex-1 min-w-[150px]">
                                                <p className="font-bold text-slate-400 uppercase mb-1 text-xs">Hari Kerja</p>
                                                <p className="text-slate-700 text-sm">{k.hari_kerja || "-"}</p>
                                            </div>
                                            {/* Aksi */}
                                            <div className="w-full md:w-auto">
                                                <p className="font-bold text-slate-400 uppercase mb-1 text-xs text-center">Aksi</p>
                                                <div className="flex gap-1.5">
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); openEditKonsul(k); }}
                                                        className="btn btn-sm btn-square btn-ghost text-amber-500 hover:bg-amber-100"
                                                        title="Edit Konsul Kehormatan"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); handleDeleteKonsul(k.id); }}
                                                        className="btn btn-sm btn-square btn-ghost text-red-400 hover:bg-red-100"
                                                        title="Hapus Konsul Kehormatan"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Klik Detail Bar */}
                                        <div
                                            onClick={() => navigate(`/konsul-kehormatan/${k.id}`)}
                                            className="bg-sky-50 border border-sky-100 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-sky-100 transition-colors"
                                        >
                                            <span className="text-[12px] font-bold text-sky-700 uppercase">
                                                Daftar Personel ({pejabatCount})
                                            </span>
                                            <span className="text-sky-400 text-[11px] font-bold uppercase">
                                                Klik Detail ➔
                                            </span>
                                        </div>
                                    </div>
                                </details>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center p-10 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        Tidak ada konsul kehormatan yang ditemukan.
                    </div>
                )}

                {/* Pagination Controls */}
                {filteredKonsuls.length > 0 && (
                    <div className="mt-4">
                        <Pagination
                            currentPage={pageKonsul}
                            totalItems={filteredKonsuls.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={(newSize) => {
                                setItemsPerPage(newSize);
                                setPageKonsul(1);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* ── Modal ── */}
            <KonsulModal
                isOpen={konsulModal}
                isEditing={isEditingKonsul}
                data={konsulForm}
                onChange={handleKonsulChange}
                onSubmit={handleKonsulSubmit}
                onClose={() => setKonsulModal(false)}
                isSaving={savingKonsul}
            />
        </div>
    );
}
