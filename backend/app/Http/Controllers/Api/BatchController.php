<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use Illuminate\Http\Request;

class BatchController extends Controller
{
    public function index()
    {
        $batches = Batch::orderBy('id', 'asc')->get()->map(function ($b) {
            return [
                'id' => 'BAT-' . str_pad($b->id, 2, '0', STR_PAD_LEFT),
                'name' => $b->name,
                'status' => $b->status,
                'db_id' => $b->id
            ];
        });

        return response()->json($batches);
    }

    public function store(Request $request)
    {
        $name = trim($request->input('name') ?? $request->input('batch') ?? '');
        if (!$name) {
            return response()->json(['message' => 'Batch name is required'], 422);
        }

        $batch = Batch::firstOrCreate(
            ['name' => $name],
            ['status' => 'active']
        );

        return response()->json([
            'id' => 'BAT-' . str_pad($batch->id, 2, '0', STR_PAD_LEFT),
            'name' => $batch->name,
            'status' => $batch->status,
            'db_id' => $batch->id
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $batch = null;
        if (str_starts_with($id, 'BAT-')) {
            $numId = (int) str_replace('BAT-', '', $id);
            $batch = Batch::find($numId);
        }
        if (!$batch) {
            $batch = Batch::where('name', $id)->first();
        }
        if (!$batch && is_numeric($id)) {
            $batch = Batch::find($id);
        }

        if (!$batch) {
            return response()->json(['message' => 'Batch not found'], 404);
        }

        $newName = trim($request->input('name', $batch->name));
        $batch->name = $newName;
        if ($request->has('status')) {
            $batch->status = $request->input('status');
        }
        $batch->save();

        return response()->json([
            'id' => 'BAT-' . str_pad($batch->id, 2, '0', STR_PAD_LEFT),
            'name' => $batch->name,
            'status' => $batch->status,
            'db_id' => $batch->id
        ]);
    }

    public function destroy($id)
    {
        $batch = null;
        if (str_starts_with($id, 'BAT-')) {
            $numId = (int) str_replace('BAT-', '', $id);
            $batch = Batch::find($numId);
        }
        if (!$batch) {
            $batch = Batch::where('name', $id)->first();
        }
        if (!$batch && is_numeric($id)) {
            $batch = Batch::find($id);
        }

        if ($batch) {
            $batch->delete();
        }

        return response()->json(['message' => 'Batch deleted successfully']);
    }
}
