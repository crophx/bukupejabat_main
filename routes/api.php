<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PegawaiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\UnitKerjaController;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/unit-kerja', [UnitKerjaController::class, 'index']);
Route::get('/pegawai', [PegawaiController::class, 'index']);
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

Route::post('/import-master', [\App\Http\Controllers\Api\UnitKerjaController::class, 'importMasterData']);

Route::post('/pegawai/sync', [\App\Http\Controllers\Api\PegawaiController::class, 'syncFromJsonStrict']);