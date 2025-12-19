<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pegawai;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use function PHPUnit\Framework\returnArgument;

class PegawaiController extends Controller
{
    //
    public function index()
    {
        $pegawai = Pegawai::with(['jabatan', 'unitKerja'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'massage' => 'List Data Pejabat',
            'data' => $pegawai,
        ], 200);
    }

    public function store(Request $request)
    {
        // 1) validasi input dari react
        $validator = Validator::make($request->all(), [
            'nip' => 'required|unique:pegawai,nip',
            'nama' => 'required|string',
            'jabatan_id' => 'required|exists:jabatan,id',
            'unit_kerja_id' => 'required|exists:unit_kerja,id',
            'no_handphone' => 'nullable|numeric',
            'alamat' => 'nullable|string',
        ]);

        // kalau validasi gagal, kirim error ke front end
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi Gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // 2) simpan ke database
        $pegawai = Pegawai::create([
            'nip' => $request->nip,
            'nama' => $request->nama,
            'alamat' => $request->alamat,
            'jabatan_id' => $request->jabatan_id,
            'unit_kerja_id' => $request->unit_kerja_id,
        ]);

        // 3) kirim respon sukses
        return response()->json([
            'success' => true,
            'message' => 'Data Pejabat Berhasil Disimpan',
            'data' => $pegawai
        ], 201);
    }
}