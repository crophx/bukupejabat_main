<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index()
    {
        // Ambil 5 log terbaru beserta data user-nya
        $logs = ActivityLog::with('user')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }
}