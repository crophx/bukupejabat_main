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
    // FUNGSI 1: MENGAMBIL SEMUA DATA PEGAWAI (DIPERBARUI)
    // =======================================================
    public function index(Request $request)
    {
        // Ambil data beserta relasinya
        $pegawais = Pegawai::with(['unitKerja', 'jabatan'])->get();

        // Format data agar properti 'jabatan' dan 'nama_unit_kerja' menjadi string
        $formatted = $pegawais->map(function ($p) {
            return [
                'id' => $p->id,
                'nip' => $p->nip,
                'nama' => $p->nama,
                'nama_pegawai' => $p->nama, // Tambahan untuk kompatibilitas React
                'email' => $p->email,
                'no_handphone' => $p->no_handphone,
                'jabatan' => $p->jabatan ? $p->jabatan->nama_jabatan : '-',
                'unit_kerja_id' => $p->unit_kerja_id,
                'nama_unit_kerja' => $p->unitKerja ? $p->unitKerja->nama_unit_kerja : '-',
                'bobot' => $p->bobot,
                'wisma' => $p->wisma,
                'tmt_kedatangan' => $p->tmt_kedatangan, // SUDAH DIUBAH
                'tmt_credential' => $p->tmt_credential
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Data pegawai berhasil diambil dari database',
            'data' => $formatted
        ]);
    }

    // =======================================================
    // FUNGSI 2: MENGAMBIL PEGAWAI BERDASARKAN UNIT KERJA (Baru)
    // =======================================================
    public function getByUnit($unitId)
    {
        // Ambil info unit kerja untuk ditampilkan di judul React
        $unitKerja = UnitKerja::find($unitId);

        $pegawais = Pegawai::with(['jabatan', 'unitKerja'])
            ->where('unit_kerja_id', $unitId)
            ->get();

        $formatted = $pegawais->map(function ($p) {
            return [
                'id' => $p->id,
                'nip' => $p->nip,
                'nama_pegawai' => $p->nama,
                'email' => $p->email,
                'jabatan' => $p->jabatan ? $p->jabatan->nama_jabatan : '-',
                'telepon' => $p->no_handphone,
                'alamat' => $p->alamat,
                'nama_unit' => $p->unitKerja ? $p->unitKerja->deskripsi : '-' // Data tambahan
            ];
        });

        return response()->json([
            'success' => true,
            'unit_nama' => $unitKerja ? $unitKerja->deskripsi : 'UNIT TIDAK DIKETAHUI', // Kirim ke React
            'data' => $formatted
        ]);
    }

    // =======================================================
    // FUNGSI 3: SINKRONISASI JSON (Punyamu yang sempat hilang)
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

                // Cek Unit Kerja
                if (!isset($unitKerjaMap[$kodeUnkerJson]) || $kodeUnkerJson === '') {
                    $countSkipped++;
                    continue;
                }

                // SOLUSI ERROR NULL: Cari ID Jabatan & Auto Create
                $jabatanId = $jabatanMap[$namaJabatanJson] ?? null;

                if ($jabatanId === null) {
                    $namaJabatanAsli = trim($item['Jabatan'] ?? 'Tidak Diketahui');
                    $jabatanBaru = Jabatan::firstOrCreate(
                        ['nama_jabatan' => $namaJabatanAsli],
                        ['kode_jabatan' => 'JAB-' . strtoupper(substr(md5($namaJabatanAsli), 0, 5))]
                    );
                    $jabatanId = $jabatanBaru->id;

                    $jabatanMap[$namaJabatanJson] = $jabatanId;
                }

                // SIMPAN KE DATABASE LOKAL
                Pegawai::updateOrCreate(
                    ['nip' => trim($nip)],
                    [
                        'nama' => $item['nama'] ?? 'Tanpa Nama',
                        'alamat' => $item['LokasiKerjaName'] ?? '-',
                        'no_handphone' => $item['no_hp'] ?? '-',
                        'unit_kerja_id' => $unitKerjaMap[$kodeUnkerJson],
                        'jabatan_id' => $jabatanId,
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

    // ==============================
    // UPDATE DATA PEGAWAI DARI MODAL
    // ==============================
    public function update(Request $request, $id)
    {
        $pegawai = Pegawai::find($id);

        if (!$pegawai) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        // 1. Update data basic (nama, email, telepon, alamat)
        $pegawai->nama = $request->nama ?? $pegawai->nama;
        $pegawai->email = $request->email ?? $pegawai->email;
        $pegawai->no_handphone = $request->no_handphone ?? $pegawai->no_handphone;
        $pegawai->alamat = $request->alamat ?? $pegawai->alamat;

        $pegawai->bobot = $request->bobot ?? $pegawai->bobot;
        $pegawai->wisma = $request->wisma ?? $pegawai->wisma;
        $pegawai->tmt_kedatangan = $request->tmt_kedatangan ?? $pegawai->tmt_kedatangan; // SUDAH DIUBAH
        $pegawai->tmt_credential = $request->tmt_credential ?? $pegawai->tmt_credential;

        // 2. Jika jabatannya diubah teksnya, kita cek ke tabel Jabatan (Buat otomatis jika belum ada)
        if ($request->filled('jabatan')) {
            $namaJabatan = trim($request->jabatan);
            $jabatanBaru = Jabatan::firstOrCreate(
                ['nama_jabatan' => $namaJabatan],
                ['kode_jabatan' => 'JAB-' . strtoupper(substr(md5($namaJabatan), 0, 5))]
            );
            $pegawai->jabatan_id = $jabatanBaru->id;
        }

        $pegawai->save();

        return response()->json([
            'success' => true,
            'message' => 'Data Pegawai berhasil diupdate',
            'data' => $pegawai
        ]);
    }

    // MENGAMBIL STATISTIK UNTUK DASHBOARD
    // ===================================
    public function getDashboardStats()
    {
        // Hitung total seluruh baris di tabel pegawai
        $totalPegawai = \App\Models\Pegawai::count();

        // Hitung total seluruh baris di tabel users (admin)
        $totalAdmin = \App\Models\User::count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_pegawai' => $totalPegawai,
                'total_admin' => $totalAdmin
            ]
        ]);
    }
}