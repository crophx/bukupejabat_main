<?php

use App\Http\Controllers\Api\PegawaiController;
use App\Models\Pegawai;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// rute buku pejabat

// 1) Ambil data pegawai
Route::get('/pegawai', [PegawaiController::class, 'index']);

// 2) Tambah Pegawai
Route::post('/pegawai', [PegawaiController::class, 'store']);