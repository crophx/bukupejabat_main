<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PegawaiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ActivityLogController;

// 1. Login
Route::post('/login', [AuthController::class, 'login']);

// 2. Daftarkan Alamatnya
// Artinya: Kalau ada yang akses "/pegawai", panggil fungsi "index" di PegawaiController
Route::get('/pegawai', [PegawaiController::class, 'index']);

// Tambahan: Untuk simpan data (nanti dipakai saat form submit)
Route::post('/pegawai', [PegawaiController::class, 'store']);

Route::get('/users', [UserController::class, 'index']);

Route::get('/activity-logs', [ActivityLogController::class, 'index']);

// Route Private (Harus Login Dulu)
Route::middleware('auth:sanctum')->group(function () {

    // Route Logout Baru
    Route::post('/logout', [AuthController::class, 'logout']);

    // Route lain yang butuh login pindahkan ke sini (Opsional tapi disarankan)
    // Route::get('/activity-logs', ...);
});