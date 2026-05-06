<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index()
    {
        // Ambil semua log beserta data user-nya (bisa pakai pagination)
        $logs = ActivityLog::with('user')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'action' => 'required|string',
            'description' => 'required|string',
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(), // AMAN: Mengambil langsung dari token server
            'action' => $request->action,
            'description' => $request->description,
        ]);

        return response()->json(['success' => true]);
    }
}