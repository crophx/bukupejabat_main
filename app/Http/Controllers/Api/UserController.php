<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
    // FUNGSI UPDATE DATA ADMIN & PASSWORD
    // ==========================================
    public function update(Request $request, $id)
    {
        // 1. Cari data user berdasarkan ID
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Data admin tidak ditemukan'
            ], 404);
        }

        // 2. Update data dasar (Username, Email, Role)
        $user->username = $request->username ?? $user->username;
        $user->email = $request->email ?? $user->email;
        if ($request->has('role')) {
            $user->role = $request->role;
        }

        // 3. Logika Update Password
        // Jika ada input password baru, kita proses
        if ($request->filled('new_password')) {
            // Cek apakah password lama yang dimasukkan cocok dengan yang ada di database
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Password saat ini (lama) salah!'
                ], 400); // 400 Bad Request
            }

            // Jika cocok, enkripsi (hash) password baru dan timpa ke database
            $user->password = Hash::make($request->new_password);
        }

        // 4. Simpan ke database
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Data admin berhasil diperbarui',
            'data' => $user
        ], 200);
    }

    // ==========================================
    // FUNGSI BARU: MENGHAPUS DATA ADMIN
    // ==========================================
    public function destroy($id)
    {
        $user = \App\Models\User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Data admin tidak ditemukan'], 404);
        }

        $user->delete();

        return response()->json(['success' => true, 'message' => 'Data admin berhasil dihapus']);
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