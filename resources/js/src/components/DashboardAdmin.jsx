import AdminProfile from "../assets/images/rispo.jpg"; // optional: add profile image or remove
import LogHistory from "./LogHistory";
import React from "react";

export default function DashboardAdmin() {
    const stats = {
        total: 256,
        activeToday: 42,
        hiresThisMonth: 8,
        attendanceRate: 92,
        sparkline: [3, 5, 4, 6, 8, 6, 7, 9, 8, 10, 9],
        bars: [5, 6, 9, 8, 7],
    };

    return (
        <div className="space-y-6">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-md shadow-slate-200/60 p-10 border border-slate-100 text-center">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="inline-block p-4 bg-sky-50 rounded-3xl mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-sky-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase mb-2">Buku Pejabat</h1>
                    <p className="text-slate-500 font-medium">Akses data pegawai dan unduh dokumen resmi buku pejabat</p>
                </div>

                {/* Main Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* BUTTON VIEW */}
                    <button
                        onClick={() => navigate('/unit-kerja')}
                        className="group p-8 bg-white border-2 border-slate-100 hover:border-sky-500 rounded-[28px] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-sky-100 flex flex-col items-center gap-4 cursor-pointer"
                    >
                        <div className="p-4 bg-sky-50 text-sky-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>
                        <span className="font-black text-slate-800 uppercase tracking-widest text-sm">Lihat Data</span>
                    </button>

                    {/* BUTTON DALAM NEGERI (DOWNLOAD) */}
                    <button
                        className="group p-8 bg-white border-2 border-slate-100 hover:border-emerald-500 rounded-[28px] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-100 flex flex-col items-center gap-4 cursor-pointer"
                    >
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <span className="font-black text-slate-800 uppercase tracking-widest text-sm block">Dalam Negeri</span>
                            <span className="text-[10px] text-emerald-600 font-bold uppercase mt-1 block tracking-tighter">Download PDF</span>
                        </div>
                    </button>

                    {/* BUTTON LUAR NEGERI (DOWNLOAD) */}
                    <button
                        className="group p-8 bg-white border-2 border-slate-100 hover:border-rose-500 rounded-[28px] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-rose-100 flex flex-col items-center gap-4 cursor-pointer"
                    >
                        <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <span className="font-black text-slate-800 uppercase tracking-widest text-sm block">Luar Negeri</span>
                            <span className="text-[10px] text-rose-600 font-bold uppercase mt-1 block tracking-tighter">Download PDF</span>
                        </div>
                    </button>

                </div>

                {/* Footer Note */}
                <p className="mt-12 text-slate-400 text-xs font-medium uppercase tracking-[4px]">
                    Kementerian Luar Negeri Republik Indonesia
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                {/* Profile card */}
                <div className="bg-white rounded-2xl p-1 shadow-md border border-slate-100 w-full md:w-1/3">
                    <div className="pt-3 text-sm text-slate-700">
                        <div class="flex flex-col gap-2 p-2 sm:flex-row sm:items-center sm:gap-6 sm:py-4 ...">
                            <img className="h-24 w-24 rounded-full object-cover sm:mx-0 sm:shrink-0" src={AdminProfile} alt="Profile" />
                            <div class="space-y-0 text-center sm:text-left">
                                <div class="space-y-0.5">
                                    <p class="text-lg font-semibold text-black">
                                        BSDM
                                    </p>
                                    <p class="font-medium text-gray-500">
                                        bsdm@kemlu.go.id
                                    </p>
                                </div>
                                <button class="text-purple-800">
                                    Super Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-1  gap-4 w-full md:flex-1">
                    <StatCard title="Total Pegawai" value={stats.total}>
                        <BarChart values={stats.bars} />
                    </StatCard>

                    <StatCard title="Total Admin" value={stats.activeToday} tone="emerald">
                        <Sparkline values={stats.sparkline} />
                    </StatCard>
                </div>
            </div>

            <LogHistory />
        </div>
    );
}

function StatCard({ title, value, children, tone = "slate" }) {
    const toneMap = {
        slate: "bg-slate-50 text-slate-700",
        emerald: "bg-emerald-50 text-emerald-700",
        amber: "bg-amber-50 text-amber-700",
        indigo: "bg-indigo-50 text-indigo-700",
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xs text-slate-500">{title}</div>
                    <div className="text-2xl font-bold text-slate-900">
                        {value}
                    </div>
                </div>
                <div
                    className={`h-12 w-24 flex items-center justify-center rounded ${toneMap[tone] || toneMap.slate
                        }`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

function Sparkline({ values = [], stroke = "#065f46" }) {
    if (!values.length) return null;
    const w = 80;
    const h = 36;
    const max = Math.max(...values);
    const points = values
        .map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / max) * h}`)
        .join(" ");

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
            <polyline fill="none" stroke={stroke} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function BarChart({ values = [], small = false }) {
    const w = small ? 60 : 80;
    const h = small ? 36 : 48;
    const max = Math.max(...values, 1);
    const bw = w / values.length;

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
            {values.map((v, i) => {
                const barH = (v / max) * h;
                return (
                    <rect
                        key={i}
                        x={i * bw + bw * 0.15}
                        y={h - barH}
                        width={bw * 0.7}
                        height={barH}
                        rx={2}
                        fill="#a3e635"
                    />
                );
            })}
        </svg>
    );
}

function Donut({ percent = 75, size = 48, strokeWidth = 8 }) {
    const r = (size - strokeWidth) / 2;
    const c = 2 * Math.PI * r;
    const offset = c - (percent / 100) * c;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke="#e6e7ee"
                strokeWidth={strokeWidth}
                fill="none"
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke="#6366f1"
                strokeWidth={strokeWidth}
                strokeDasharray={c}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="none"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="11"
                fill="#374151"
            >
                {percent}%
            </text>
        </svg>
    );
}
