<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pegawai;
use App\Models\UnitKerja;
use App\Models\Jabatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class PegawaiController extends Controller
{
    // =======================================================
    // FUNGSI BARU: Mengirim data ke React (TableCard.jsx)
    // =======================================================
    public function index(Request $request)
    {
        // Mengambil semua data pegawai BERSERTA relasi unit_kerja dan jabatan
        // Pastikan relasi unitKerja() dan jabatan() sudah ada di app/Models/Pegawai.php
        $pegawais = Pegawai::with(['unitKerja', 'jabatan'])->get();

        return response()->json([
            'success' => true,
            'message' => 'Data pegawai berhasil diambil dari database',
            'data' => $pegawais
        ]);
    }

    // =======================================================
    // FUNGSI LAMA: Sinkronisasi dari JSON (Tetap dipertahankan)
    // =======================================================
    public function syncFromJsonStrict()
    {
        $path = base_path('resources/js/src/data/response_get_all_employee.json');

        if (!File::exists($path)) {
            return response()->json(['success' => false, 'message' => 'File JSON tidak ditemukan!'], 404);
        }

        try {
            $jsonString = File::get($path);
            $data = json_decode($jsonString, true);

            // RADAR PENDETEKSI STRUKTUR JSON
            $pegawais = [];
            if (isset($data['data']['emp'])) {
                $pegawais = $data['data']['emp'];
            } elseif (isset($data['emp'])) {
                $pegawais = $data['emp'];
            } elseif (is_array($data) && isset($data[0]['nama'])) {
                $pegawais = $data;
            }

            if (empty($pegawais)) {
                return response()->json(['success' => false, 'message' => 'Data pegawai tidak ditemukan!']);
            }

            // LOAD MASTER DATA
            $unitKerjaMap = UnitKerja::pluck('id', 'kode_unit_kerja')->mapWithKeys(function ($id, $kode) {
                return [strtoupper(trim($kode)) => $id];
            })->toArray();

            $jabatanMap = Jabatan::pluck('id', 'nama_jabatan')->mapWithKeys(function ($id, $nama) {
                return [strtolower(trim($nama)) => $id];
            })->toArray();

            $countInserted = 0;
            $countSkipped = 0;

            foreach ($pegawais as $item) {
                $nip = $item['nip'] ?? null;

                if ($nip === null || trim($nip) === '')
                    continue;

                $kodeUnkerJson = strtoupper(trim($item['kd_unker'] ?? ''));
                $namaJabatanJson = strtolower(trim($item['Jabatan'] ?? ''));

                // SATPAM: Cek Unit Kerja
                if (!isset($unitKerjaMap[$kodeUnkerJson]) || $kodeUnkerJson === '') {
                    $countSkipped++;
                    continue;
                }

                // ====================================================
                // SOLUSI ERROR NULL: Cari ID Jabatan & Auto Create
                // ====================================================
                $jabatanId = $jabatanMap[$namaJabatanJson] ?? null;

                if ($jabatanId === null) {
                    // Jika tidak ketemu, buat jabatan baru secara otomatis!
                    $namaJabatanAsli = trim($item['Jabatan'] ?? 'Tidak Diketahui');
                    $jabatanBaru = Jabatan::firstOrCreate(
                        ['nama_jabatan' => $namaJabatanAsli],
                        // Bikin kode unik acak agar tidak error
                        ['kode_jabatan' => 'JAB-' . strtoupper(substr(md5($namaJabatanAsli), 0, 5))]
                    );
                    $jabatanId = $jabatanBaru->id;

                    // Simpan ke memori agar kalau ada jabatan yang sama lagi prosesnya cepat
                    $jabatanMap[$namaJabatanJson] = $jabatanId;
                }
                // ====================================================

                // SIMPAN KE DATABASE LOKAL
                Pegawai::updateOrCreate(
                    ['nip' => trim($nip)],
                    [
                        'nama' => $item['nama'] ?? 'Tanpa Nama',
                        'alamat' => $item['LokasiKerjaName'] ?? '-',
                        'no_handphone' => $item['no_hp'] ?? '-',
                        'unit_kerja_id' => $unitKerjaMap[$kodeUnkerJson],
                        'jabatan_id' => $jabatanId, // Sekarang dijamin TIDAK AKAN NULL
                    ]
                );

                $countInserted++;
            }

            return response()->json([
                'success' => true,
                'message' => "Sync Selesai! Berhasil menyimpan: $countInserted pegawai. Ditolak/Diabaikan: $countSkipped pegawai (Karena Kode Unit Kerja tidak terdaftar)."
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal melakukan sinkronisasi: ' . $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}