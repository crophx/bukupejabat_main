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

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::post('/import-master', [\App\Http\Controllers\Api\UnitKerjaController::class, 'importMasterData']);

Route::post('/pegawai/sync', [\App\Http\Controllers\Api\PegawaiController::class, 'syncFromJsonStrict']);

Route::get('/unit-kerja', [UnitKerjaController::class, 'index']);

Route::put('/unit-kerja/{id}', [UnitKerjaController::class, 'update']);

Route::put('/users/{id}', [UserController::class, 'update']);

Route::get('/unit-kerja/dalam-negeri', [\App\Http\Controllers\Api\UnitKerjaController::class, 'getDalamNegeri']);
Route::get('/pegawai/unit/{unitId}', [\App\Http\Controllers\Api\PegawaiController::class, 'getByUnit']);

Route::get('/unit-kerja/luar-negeri', [\App\Http\Controllers\Api\UnitKerjaController::class, 'getLuarNegeri']);

Route::get('/sync-pegawai', [\App\Http\Controllers\Api\PegawaiController::class, 'syncFromJsonStrict']);

Route::put('/pegawai/{id}', [\App\Http\Controllers\Api\PegawaiController::class, 'update']);

Route::get('/dashboard/stats', [\App\Http\Controllers\Api\PegawaiController::class, 'getDashboardStats']);

// Pastikan bagian class-nya mengarah ke UserController
Route::get('/admin/profile/{id}', [\App\Http\Controllers\Api\UserController::class, 'getProfile']);

Route::delete('/users/{id}', [\App\Http\Controllers\Api\UserController::class, 'destroy']);

// Rute untuk menjalankan Cleansing Data
Route::get('/pegawai/cleanse', [\App\Http\Controllers\Api\PegawaiController::class, 'cleanseData']);