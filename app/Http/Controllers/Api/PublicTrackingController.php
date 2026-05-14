<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PublicTracking;

class PublicTrackingController extends Controller
{
    public function track(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:preview,download',
            'document_type' => 'required|string'
        ]);

        PublicTracking::create([
            'type' => $request->type,
            'document_type' => $request->document_type
        ]);

        return response()->json(['success' => true]);
    }
    
    public function getStats()
    {
        // Get counts
        $previewCount = PublicTracking::where('type', 'preview')->count();
        $downloadCount = PublicTracking::where('type', 'download')->count();

        // Get daily trends for last 7 days
        $dailyTrends = PublicTracking::selectRaw('DATE(created_at) as date, type, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date', 'type')
            ->orderBy('date', 'asc')
            ->get();

        // Format for charts
        $dates = [];
        for ($i = 6; $i >= 0; $i--) {
            $dates[] = now()->subDays($i)->format('Y-m-d');
        }

        $trendsData = [
            'labels' => $dates,
            'previews' => array_fill(0, 7, 0),
            'downloads' => array_fill(0, 7, 0),
        ];

        foreach ($dailyTrends as $trend) {
            $index = array_search($trend->date, $dates);
            if ($index !== false) {
                if ($trend->type === 'preview') {
                    $trendsData['previews'][$index] = $trend->count;
                } else if ($trend->type === 'download') {
                    $trendsData['downloads'][$index] = $trend->count;
                }
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'preview_count' => $previewCount,
                'download_count' => $downloadCount,
                'trends' => $trendsData
            ]
        ]);
    }
}
