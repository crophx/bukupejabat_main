<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UnitKerja;
use App\Models\Jabatan; // <--- WAJIB TAMBAH INI
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File; // <--- WAJIB TAMBAH INI

class UnitKerjaController extends Controller
{
    // ==========================================
    // FUNGSI 1: MENGAMBIL DATA (Kodingan Anda)
    // ==========================================
    public function index(Request $request)
    {
        // Ambil data Unit Kerja + Hitung Jumlah Pegawai otomatis
        $query = UnitKerja::withCount('pegawai');

        // Fitur Pencarian (jika nanti butuh search)
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('nama_unit_kerja', 'like', "%{$search}%")
                ->orWhere('kode_unit_kerja', 'like', "%{$search}%");
        }

        $units = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar Unit Kerja berhasil diambil',
            'data' => $units
        ]);
    }

    // ==========================================
    // FUNGSI 2: IMPORT CSV (Fungsi Baru)
    // ==========================================
    public function importMasterData()
    {
        // --- A. IMPORT UNIT KERJA ---
        $pathUnit = storage_path('app/unit_kerja.csv');
        $countUnit = 0;

        if (File::exists($pathUnit)) {
            $lines = file($pathUnit, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

            foreach ($lines as $index => $line) {
                if ($index === 0)
                    continue; // Lewati baris pertama (Header)

                $row = str_getcsv($line, ';');
                if (count($row) < 2) {
                    $row = str_getcsv($line, ',');
                }

                // Ambil 3 kolom dari CSV Anda
                $kode = trim($row[0] ?? '');            // Kolom A
                $nama = trim($row[1] ?? 'Tanpa Nama');  // Kolom B
                $keterangan = trim($row[2] ?? '');      // Kolom C (ket_unker)

                if ($kode === '')
                    continue;

                // Proses Update atau Create
                UnitKerja::updateOrCreate(
                    ['kode_unit_kerja' => $kode], // Cari berdasarkan Kode
                    [
                        'nama_unit_kerja' => $nama,
                        'deskripsi' => $keterangan // Simpan Kolom C ke 'deskripsi'
                    ]
                );
                $countUnit++;
            }
        } else {
            return response()->json(['message' => 'File unit_kerja.csv tidak ditemukan di storage/app/'], 404);
        }

        // --- B. IMPORT JABATAN ---
        $pathJabatan = storage_path('app/jabatan.csv');
        $countJabatan = 0;

        if (File::exists($pathJabatan)) {
            $lines = file($pathJabatan, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

            foreach ($lines as $index => $line) {
                if ($index === 0)
                    continue; // Lewati baris pertama

                $row = str_getcsv($line, ';');
                if (count($row) < 2) {
                    $row = str_getcsv($line, ',');
                }

                $kode = trim($row[0] ?? '');
                $nama = trim($row[1] ?? 'Tanpa Nama');

                if ($kode === '')
                    continue;

                Jabatan::updateOrCreate(
                    ['kode_jabatan' => $kode],
                    ['nama_jabatan' => $nama]
                );
                $countJabatan++;
            }
        } else {
            return response()->json(['message' => 'File jabatan.csv tidak ditemukan di storage/app/'], 404);
        }

        return response()->json([
            'success' => true,
            'message' => "Selesai! Berhasil memasukkan $countUnit Unit Kerja dan $countJabatan Jabatan."
        ]);
    }
}