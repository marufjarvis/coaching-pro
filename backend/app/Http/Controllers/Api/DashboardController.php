<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Payment;
use App\Models\Batch;
use App\Models\Expense;
use App\Models\Attendance;
use App\Models\OnlineAdmission;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $students = Student::with('payments')->where('status', 'Active')->get();
        $totalCollected = (float) Payment::sum('amount');
        $totalExpenses = (float) Expense::sum('amount');

        $totalDues = 0;
        $dueCount = 0;

        foreach ($students as $student) {
            $paid = (float) $student->payments->sum('amount');
            $fee = (float) $student->fee_amount;
            $due = max(0, $fee - $paid);
            if ($due > 0) {
                $totalDues += $due;
                $dueCount++;
            }
        }

        $allAtt = Attendance::all();
        $totalAtt = $allAtt->count();
        $presentAtt = $allAtt->whereIn('status', ['Present', 'Late'])->count();
        $attendanceAvg = $totalAtt > 0 ? round(($presentAtt / $totalAtt) * 100) . '%' : '95%';

        return response()->json([
            'activeStudentsCount' => $students->count(),
            'totalCollected' => $totalCollected,
            'totalDues' => $totalDues,
            'dueCount' => $dueCount,
            'attendanceAvg' => $attendanceAvg,
            'totalBatches' => Batch::count(),
            'totalExpenses' => $totalExpenses,
            'netProfit' => $totalCollected - $totalExpenses,
            'pendingAdmissionsCount' => OnlineAdmission::where('status', 'Pending')->count()
        ]);
    }
}
