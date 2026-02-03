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
            <div className="flex flex-col md:flex-row gap-4">
                {/* Profile card */}
                <div className="bg-white rounded-2xl p-1 shadow-md border border-slate-100 w-full md:w-1/3">
                    <div className="pt-3 text-sm text-slate-700">
                        <div class="flex flex-col gap-2 p-2 sm:flex-row sm:items-center sm:gap-6 sm:py-4 ...">
                            <img
                                className="h-24 w-24 rounded-full object-cover sm:mx-0 sm:shrink-0"
                                src={AdminProfile}
                                alt="Profile"
                            />
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

                    <StatCard
                        title="Total Admin"
                        value={stats.activeToday}
                        tone="emerald"
                    >
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
                    className={`h-12 w-24 flex items-center justify-center rounded ${
                        toneMap[tone] || toneMap.slate
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
        <svg
            width={w}
            height={h}
            viewBox={`0 0 ${w} ${h}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <polyline
                fill="none"
                stroke={stroke}
                strokeWidth="2"
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function BarChart({ values = [], small = false }) {
    const w = small ? 60 : 80;
    const h = small ? 36 : 48;
    const max = Math.max(...values, 1);
    const bw = w / values.length;

    return (
        <svg
            width={w}
            height={h}
            viewBox={`0 0 ${w} ${h}`}
            xmlns="http://www.w3.org/2000/svg"
        >
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
