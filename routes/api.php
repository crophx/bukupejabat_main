<?php

use Illuminate\Support\Facades\Route;
// 1. Panggil Controller yang sudah Anda buat tadi (PENTING!)
use App\Http\Controllers\Api\PegawaiController;

// 2. Daftarkan Alamatnya
// Artinya: Kalau ada yang akses "/pegawai", panggil fungsi "index" di PegawaiController
Route::get('/pegawai', [PegawaiController::class, 'index']);

// Tambahan: Untuk simpan data (nanti dipakai saat form submit)
Route::post('/pegawai', [PegawaiController::class, 'store']);