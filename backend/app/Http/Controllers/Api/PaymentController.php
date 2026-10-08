<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Student;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    private function formatPayment(Payment $p)
    {
        return [
            'id' => $p->id,
            'studentId' => $p->student_id,
            'studentName' => $p->student_name ?? ($p->student ? $p->student->name : ''),
            'batch' => $p->batch ?? ($p->student ? $p->student->batch : ''),
            'amount' => (float) $p->amount,
            'feeType' => $p->student ? $p->student->fee_type : 'monthly',
            'method' => $p->method,
            'collectedBy' => $p->collected_by,
            'date' => $p->date,
            'time' => $p->time ?? '',
            'note' => $p->note ?? ''
        ];
    }

    public function index(Request $request)
    {
        $payments = Payment::with('student')->orderBy('created_at', 'desc')->get()->map(function ($p) {
            return $this->formatPayment($p);
        });

        return response()->json($payments);
    }

    public function store(Request $request)
    {
        $studentId = $request->input('studentId') ?? $request->input('student_id');
        $student = Student::find($studentId);

        $amount = (float) $request->input('amount');
        if ($amount <= 0) {
            return response()->json(['message' => 'Valid amount is required'], 422);
        }

        $id = $request->input('id');
        if (!$id) {
            $id = 'TXN-' . mt_rand(1000, 9999);
            while (Payment::where('id', $id)->exists()) {
                $id = 'TXN-' . mt_rand(1000, 9999);
            }
        }

        $payment = Payment::create([
            'id' => $id,
            'student_id' => $studentId,
            'student_name' => $student ? $student->name : ($request->input('studentName') ?? 'Student'),
            'batch' => $student ? $student->batch : ($request->input('batch') ?? 'Unassigned'),
            'amount' => $amount,
            'method' => $request->input('method', 'Cash'),
            'collected_by' => $request->input('collectedBy') ?? $request->input('collected_by', 'Admin'),
            'date' => $request->input('date') ?? date('d/m/Y'),
            'time' => $request->input('time') ?? date('h:i A'),
            'note' => $request->input('note') ?? ($student ? ($student->fee_type === 'monthly' ? 'Monthly Fee' : 'Course Fee Installment') : 'Tuition Fee')
        ]);

        return response()->json($this->formatPayment($payment->fresh('student')), 201);
    }

    public function destroy($id)
    {
        $payment = Payment::find($id);
        if ($payment) {
            $payment->delete();
        }

        return response()->json(['message' => 'Payment deleted successfully']);
    }
}
