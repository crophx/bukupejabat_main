<?php

namespace App\Http\Controllers;

use App\Models\KonsulKehormatan;
use Illuminate\Http\Request;

class KonsulKehormatanController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => KonsulKehormatan::orderBy('id', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'negara' => 'required|string',
            'kota' => 'required|string',
            'alamat' => 'required|string',
            'no_telp' => 'nullable|string',
            'fax' => 'nullable|string',
            'email' => 'nullable|string', // allowed some emails can be invalid format on real world
            'website' => 'nullable|string',
            'hari_kerja' => 'nullable|string',
        ]);

        $konsul = KonsulKehormatan::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil ditambahkan',
            'data' => $konsul
        ]);
    }

    public function show($id)
    {
        $konsul = KonsulKehormatan::find($id);
        if (!$konsul) return response()->json(['success' => false, 'message' => 'Not found'], 404);
        
        return response()->json(['success' => true, 'data' => $konsul]);
    }

    public function update(Request $request, $id)
    {
        $konsul = KonsulKehormatan::find($id);
        if (!$konsul) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        $validated = $request->validate([
            'negara' => 'required|string',
            'kota' => 'required|string',
            'alamat' => 'required|string',
            'no_telp' => 'nullable|string',
            'fax' => 'nullable|string',
            'email' => 'nullable|string',
            'website' => 'nullable|string',
            'hari_kerja' => 'nullable|string',
        ]);

        $konsul->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil diupdate',
            'data' => $konsul
        ]);
    }

    public function destroy($id)
    {
        $konsul = KonsulKehormatan::find($id);
        if (!$konsul) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        $konsul->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil dihapus'
        ]);
    }
}
