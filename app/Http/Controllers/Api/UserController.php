<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        // Ambil semua user, sertakan data unit kerja (relasi)
        $users = User::with('unitKerja')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    // ==========================================
    // FUNGSI BARU: UPDATE DATA ADMIN
    // ==========================================
    public function update(Request $request, $id)
    {
        // 1. Cari data user berdasarkan ID
        $user = User::find($id);

        // Jika user tidak ditemukan, kembalikan error 404
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Data admin tidak ditemukan'
            ], 404);
        }

        // 2. Validasi input dari frontend (React)
        $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'role' => 'required|string',
        ]);

        // 3. Simpan perubahan ke database
        $user->update([
            'username' => $request->username,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        // 4. Kembalikan response sukses ke React
        return response()->json([
            'success' => true,
            'message' => 'Data admin berhasil diperbarui',
            'data' => $user
        ], 200);
    }

    // =======================================================
    // AMBIL PROFIL ADMIN UNTUK PENGATURAN AKUN
    // =======================================================
    public function getProfile($id)
    {
        // Kita gabungkan tabel users dengan unit_kerja untuk mendapatkan nama unitnya
        $user = \App\Models\User::leftJoin('unit_kerja', 'users.unit_kerja_id', '=', 'unit_kerja.id')
            ->select('users.id', 'users.username', 'users.email', 'users.role', 'unit_kerja.nama_unit_kerja', 'unit_kerja.deskripsi')
            ->where('users.id', $id)
            ->first();

        if ($user) {
            return response()->json(['success' => true, 'data' => $user]);
        }
        return response()->json(['success' => false, 'message' => 'User tidak ditemukan'], 404);
    }
}