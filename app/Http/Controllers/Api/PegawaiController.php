<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PegawaiController extends Controller
{
    // Kita buat fungsi pembantu untuk mendapatkan lokasi file yang akurat
    private function getJsonPath()
    {
        // base_path() akan otomatis menunjuk ke C:\laragon\www\bukupejabat_v2
        return base_path('resources/js/src/data/response_get_all_employee.json');
    }

    public function index(Request $request)
    {
        $path = $this->getJsonPath();

        // 1. Cek apakah file ada di lokasi tersebut
        if (!file_exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'File JSON tidak ditemukan di: ' . $path,
                'data' => []
            ], 404);
        }

        // 2. Baca isi file secara manual
        $jsonString = file_get_contents($path);

        // 3. Ubah string JSON menjadi Array
        $data = json_decode($jsonString, true);
        
        // Pastikan data adalah array
        if (!is_array($data)) {
            $data = [];
        } else if (isset($data['emp']) && is_array($data['emp'])) {
            $data = $data['emp'];
        }

        // 4. Filter berdasarkan unit_kerja_id atau kd_unker jika ada query parameter
        $unitKerjaId = $request->query('unit_kerja_id');
        $kdUnker = $request->query('kd_unker');
        
        if ($unitKerjaId) {
            // Filter berdasarkan kd_unker (kode unit kerja)
            $data = array_values(array_filter($data, function($item) use ($unitKerjaId) {
                return isset($item['kd_unker']) && trim($item['kd_unker']) === trim($unitKerjaId);
            }));
        } elseif ($kdUnker) {
            // Alternatif filter berdasarkan kd_unker parameter
            $data = array_values(array_filter($data, function($item) use ($kdUnker) {
                return isset($item['kd_unker']) && trim($item['kd_unker']) === trim($kdUnker);
            }));
        }

        // 5. Kirim respon
        return response()->json([
            'success' => true,
            'message' => ($unitKerjaId || $kdUnker) ? 'List Data Pegawai Berdasarkan Unit Kerja' : 'List Data Pejabat (Dari Resources)',
            'data' => [
                'emp' => $data
            ]
        ], 200);
    }

    public function store(Request $request)
    {
        $path = $this->getJsonPath();

        // Validasi input
        $validator = Validator::make($request->all(), [
            'nip' => 'required',
            'nama' => 'required',
            'jabatan' => 'required',
            'unit_kerja' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi Gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // Ambil data lama
        $currentData = [];
        if (file_exists($path)) {
            $jsonString = file_get_contents($path);
            $currentData = json_decode($jsonString, true);

            // Jaga-jaga jika file kosong atau format salah, pastikan jadi array
            if (!is_array($currentData)) {
                $currentData = [];
            }
        }

        // Buat data baru
        $newData = [
            'id' => count($currentData) + 1,
            'nip' => $request->nip,
            'nama' => $request->nama,
            'jabatan' => $request->jabatan,
            'unit_kerja' => $request->unit_kerja,
            'no_handphone' => $request->no_handphone ?? '-',
            'alamat' => $request->alamat ?? '-',
            'created_at' => date('Y-m-d H:i:s')
        ];

        // Masukkan data baru
        $currentData[] = $newData;

        // Simpan kembali ke file (file_put_contents)
        file_put_contents($path, json_encode($currentData, JSON_PRETTY_PRINT));

        return response()->json([
            'success' => true,
            'message' => 'Data Pejabat Berhasil Disimpan',
            'data' => $newData
        ], 201);
    }
}