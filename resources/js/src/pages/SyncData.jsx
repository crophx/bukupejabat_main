import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function SyncData() {
    const [isSyncing, setIsSyncing] = useState(false);
    
    // State untuk Auto Sync
    const [autoSyncType, setAutoSyncType] = useState('weekly'); // 'weekly' atau 'monthly'
    const [syncDay, setSyncDay] = useState('Senin');
    const [syncDate, setSyncDate] = useState('1');
    const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(false);

    // State untuk Logic Retry & Block
    const [failCount, setFailCount] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);

    // Dummy data untuk Log Sinkronisasi
    const [logs, setLogs] = useState([
        { id: 1, date: '2026-05-12 09:00:00', method: 'Auto (Mingguan)', status: 'Success', detail: 'Berhasil mensinkronkan 120 data pegawai.' },
        { id: 2, date: '2026-05-05 09:00:00', method: 'Auto (Mingguan)', status: 'Success', detail: 'Berhasil mensinkronkan 120 data pegawai.' },
        { id: 3, date: '2026-05-01 14:30:22', method: 'Manual', status: 'Failed', detail: 'Koneksi ke API Utama terputus (Timeout).' },
        { id: 4, date: '2026-04-28 09:00:00', method: 'Auto (Mingguan)', status: 'Success', detail: 'Berhasil mensinkronkan 118 data pegawai.' },
    ]);

    // Efek Retry: Jika gagal 1 atau 2 kali, jadwalkan ulang dalam 10 menit (600000 ms)
    useEffect(() => {
        let retryTimer;
        if (failCount > 0 && failCount < 3 && !isBlocked && isAutoSyncEnabled) {
            retryTimer = setTimeout(() => {
                triggerSync('Auto (Retry)');
            }, 600000); // 10 Menit
        }
        return () => clearTimeout(retryTimer);
    }, [failCount, isBlocked, isAutoSyncEnabled]);

    const triggerSync = (method = 'Manual') => {
        if (isBlocked) {
            Swal.fire({
                icon: 'error',
                title: 'Akses Diblokir',
                text: 'Sinkronisasi telah dihentikan otomatis karena gagal 3 kali berturut-turut. Harap periksa koneksi API Anda sebelum mencoba kembali.',
                confirmButtonColor: '#e11d48'
            });
            return;
        }

        setIsSyncing(true);
        
        // Simulasi proses sinkronisasi ke backend
        setTimeout(() => {
            setIsSyncing(false);
            
            // SIMULASI: Ubah nilai ini menjadi `false` jika ingin menguji skenario gagal
            const isSuccess = true; 

            const currentTime = new Date().toLocaleString('id-ID').replace(/\./g, ':');

            if (isSuccess) {
                setFailCount(0); // Reset hitungan gagal jika sukses
                const newLog = {
                    id: Date.now(),
                    date: currentTime,
                    method: method,
                    status: 'Success',
                    detail: `Berhasil mensinkronkan data secara ${method.toLowerCase()}.`
                };
                setLogs(prev => [newLog, ...prev]);
                
                if (method === 'Manual') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sinkronisasi Selesai',
                        text: 'Data berhasil ditarik dari API Utama!',
                        confirmButtonColor: '#0ea5e9'
                    });
                }
            } else {
                const currentFail = failCount + 1;
                setFailCount(currentFail);
                
                const newLog = {
                    id: Date.now(),
                    date: currentTime,
                    method: method,
                    status: 'Failed',
                    detail: `Gagal menarik data (Percobaan ${currentFail}/3).`
                };
                setLogs(prev => [newLog, ...prev]);

                if (currentFail >= 3) {
                    setIsBlocked(true);
                    setIsAutoSyncEnabled(false); // Matikan auto sync
                    Swal.fire({
                        icon: 'error',
                        title: 'Sinkronisasi Dihentikan',
                        text: 'Sinkronisasi gagal 3 kali berturut-turut. Sistem menghentikan proses ini otomatis untuk mencegah pemblokiran/beban server API.',
                        confirmButtonColor: '#e11d48'
                    });
                } else {
                    if (method === 'Manual') {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Sinkronisasi Gagal',
                            text: `Gagal menarik data (Percobaan ${currentFail}/3). Sistem akan mencoba otomatis dalam 10 menit.`,
                            confirmButtonColor: '#f59e0b'
                        });
                    }
                }
            }
        }, 2000);
    };

    const handleManualSync = () => {
        triggerSync('Manual');
    };

    const handleSaveConfig = () => {
        Swal.fire({
            icon: 'success',
            title: 'Konfigurasi Tersimpan',
            text: 'Pengaturan Auto Sync berhasil diperbarui.',
            showConfirmButton: false,
            timer: 1500
        });
    };

    const handleResetBlock = () => {
        setIsBlocked(false);
        setFailCount(0);
        Swal.fire({
            icon: 'success',
            title: 'Blokir Dibuka',
            text: 'Anda dapat melakukan sinkronisasi kembali.',
            showConfirmButton: false,
            timer: 1500
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full text-slate-700 relative p-6 md:p-8 min-h-[80vh] mb-5">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Sinkronisasi Data</h2>
                <p className="text-slate-500 text-sm mt-1">Kelola pembaruan data dari API Utama secara manual maupun otomatis.</p>
            </div>

            {/* Banner Peringatan Jika Diblokir */}
            {isBlocked && (
                <div className="mb-8 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 animate-in fade-in">
                    <div className="flex items-center gap-3">
                        <div className="bg-rose-100 p-2 rounded-full text-rose-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-rose-700">Sinkronisasi Diblokir Sementara</h3>
                            <p className="text-xs text-rose-600">Terdeteksi kegagalan 3x berturut-turut. Harap periksa endpoint API Anda.</p>
                        </div>
                    </div>
                    <button onClick={handleResetBlock} className="btn btn-sm bg-rose-600 hover:bg-rose-700 text-white border-none w-full sm:w-auto">Buka Blokir</button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* --- CARD MANUAL SYNC --- */}
                <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-sky-200/50 rounded-full blur-3xl"></div>
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-sky-300/30 rounded-full blur-3xl"></div>
                    
                    <div className="bg-white p-4 rounded-full shadow-sm text-sky-500 mb-4 z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-8 h-8 ${isSyncing ? 'animate-spin' : ''}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 z-10 mb-2">Sinkronisasi Manual</h3>
                    <p className="text-sm text-slate-600 z-10 mb-6">Tarik data terbaru dari API Utama sekarang juga. Gunakan opsi ini jika Anda butuh update data instan.</p>
                    
                    <button 
                        onClick={handleManualSync}
                        disabled={isSyncing || isBlocked}
                        className="z-10 w-full max-w-xs py-3 px-6 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-sky-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSyncing ? 'Sedang Memproses...' : 'Mulai Sync Manual'}
                    </button>
                    {failCount > 0 && !isBlocked && (
                        <p className="z-10 mt-3 text-xs font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                            Peringatan: Gagal {failCount}/3 kali
                        </p>
                    )}
                </div>

                {/* --- CARD AUTO SYNC --- */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-slate-800">Pengaturan Auto Sync</h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={isAutoSyncEnabled} onChange={(e) => setIsAutoSyncEnabled(e.target.checked)} disabled={isBlocked} />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-disabled:opacity-50"></div>
                        </label>
                    </div>

                    <div className={`space-y-5 transition-opacity ${isAutoSyncEnabled && !isBlocked ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Pola Sinkronisasi</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="syncType" value="weekly" checked={autoSyncType === 'weekly'} onChange={(e) => setAutoSyncType(e.target.value)} className="w-4 h-4 text-sky-500 focus:ring-sky-500" />
                                    <span className="text-sm text-slate-600">Per Minggu</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="syncType" value="monthly" checked={autoSyncType === 'monthly'} onChange={(e) => setAutoSyncType(e.target.value)} className="w-4 h-4 text-sky-500 focus:ring-sky-500" />
                                    <span className="text-sm text-slate-600">Per Bulan</span>
                                </label>
                            </div>
                        </div>

                        {autoSyncType === 'weekly' && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Hari Eksekusi</label>
                                <select value={syncDay} onChange={(e) => setSyncDay(e.target.value)} className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 bg-slate-50">
                                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(day => (
                                        <option key={day} value={day}>Setiap Hari {day}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {autoSyncType === 'monthly' && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal Eksekusi</label>
                                <select value={syncDate} onChange={(e) => setSyncDate(e.target.value)} className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 bg-slate-50">
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                                        <option key={date} value={date}>Setiap Tanggal {date}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="pt-2">
                            <button onClick={handleSaveConfig} className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-xl transition-colors shadow-md">
                                Simpan Konfigurasi
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- LOG SINKRONISASI --- */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Riwayat Sinkronisasi (Log)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-4 py-3 border-b border-slate-100 w-12 text-center">No</th>
                                <th className="px-4 py-3 border-b border-slate-100">Waktu</th>
                                <th className="px-4 py-3 border-b border-slate-100">Metode</th>
                                <th className="px-4 py-3 border-b border-slate-100">Status</th>
                                <th className="px-4 py-3 border-b border-slate-100">Detail Keterangan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map((log, index) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-4 text-center text-slate-400 font-medium">{index + 1}</td>
                                    <td className="px-4 py-4 text-slate-700 font-medium">{log.date}</td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${log.method === 'Manual' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                            {log.method}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        {log.status === 'Success' ? (
                                            <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wide">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                                                Berhasil
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-rose-600 font-bold text-xs uppercase tracking-wide">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" /></svg>
                                                Gagal
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-slate-500 italic text-xs leading-relaxed max-w-xs">{log.detail}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
