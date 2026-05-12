<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PegawaiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\UnitKerjaController;

// --- PUBLIC ROUTES ---
Route::post('/login', [AuthController::class, 'login']);

// --- PROTECTED ROUTES ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/unit-kerja/dalam-negeri', [UnitKerjaController::class, 'getDalamNegeri']);
    Route::get('/unit-kerja/luar-negeri', [UnitKerjaController::class, 'getLuarNegeri']);
    Route::get('/pegawai', [PegawaiController::class, 'index']);
    Route::get('/pegawai/unit/{unitId}', [PegawaiController::class, 'getByUnit']);
    
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin & Users
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::get('/admin/profile/{id}', [UserController::class, 'getProfile']);

    // Activity Logs
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    Route::post('/activity-logs', [ActivityLogController::class, 'store']);

    // Pegawai Management
    Route::post('/pegawai', [PegawaiController::class, 'store']);
    Route::put('/pegawai/{id}', [PegawaiController::class, 'update']);
    Route::post('/pegawai/sync', [PegawaiController::class, 'syncFromJsonStrict']);
    Route::get('/sync-pegawai', [PegawaiController::class, 'syncFromJsonStrict']); // Jika masih dipakai
    Route::get('/pegawai/cleanse', [PegawaiController::class, 'cleanseData']);
    
    // Dashboard Stats
    Route::get('/dashboard/stats', [PegawaiController::class, 'getDashboardStats']);

    // Unit Kerja Management
    Route::put('/unit-kerja/{id}', [UnitKerjaController::class, 'update']);
    Route::post('/import-master', [UnitKerjaController::class, 'importMasterData']);

    // Konsul Kehormatan
    Route::apiResource('konsul-kehormatan', App\Http\Controllers\KonsulKehormatanController::class);
    Route::apiResource('pejabat-konsul', App\Http\Controllers\PejabatKonsulController::class);
});