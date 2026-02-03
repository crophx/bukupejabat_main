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
}