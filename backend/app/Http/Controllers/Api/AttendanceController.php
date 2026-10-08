<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index()
    {
        $all = Attendance::all();
        $formatted = [];

        foreach ($all as $item) {
            $key = "{$item->date}_{$item->batch}";
            if (!isset($formatted[$key])) {
                $formatted[$key] = [];
            }
            $formatted[$key][$item->student_id] = $item->status;
        }

        return response()->json($formatted);
    }

    public function storeForBatchDate(Request $request)
    {
        $request->validate([
            'date' => 'required|string',
            'batch' => 'required|string',
            'records' => 'required|array',
        ]);

        $date = $request->input('date');
        $batch = $request->input('batch');
        $records = $request->input('records');

        foreach ($records as $studentId => $status) {
            if ($status) {
                Attendance::updateOrCreate(
                    [
                        'date' => $date,
                        'batch' => $batch,
                        'student_id' => $studentId,
                    ],
                    [
                        'status' => $status
                    ]
                );
            }
        }

        return response()->json([
            'message' => 'Attendance recorded successfully',
            'date' => $date,
            'batch' => $batch,
            'records' => $records
        ]);
    }
}
