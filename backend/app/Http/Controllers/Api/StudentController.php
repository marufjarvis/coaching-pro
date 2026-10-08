<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Payment;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    private function formatStudent(Student $s)
    {
        $words = explode(' ', trim($s->name));
        $initials = '';
        if (count($words) >= 2) {
            $initials = strtoupper(mb_substr($words[0], 0, 1) . mb_substr($words[1], 0, 1));
        } else {
            $initials = strtoupper(mb_substr($s->name, 0, 2));
        }

        $paidSum = (float) $s->payments()->sum('amount');
        $feeAmount = (float) $s->fee_amount;
        $dueAmount = max(0, $feeAmount - $paidSum);

        return [
            'id' => $s->id,
            'name' => $s->name,
            'initials' => $initials ?: 'ST',
            'batch' => $s->batch,
            'status' => $s->status,
            'phone' => $s->phone ?? '',
            'guardianPhone' => $s->guardian_phone ?? '',
            'feeType' => $s->fee_type,
            'feeAmount' => $feeAmount,
            'admissionFee' => (float) ($s->admission_fee ?? 0),
            'discount' => (float) ($s->discount ?? 0),
            'installments' => (int) ($s->installments ?? 1),
            'paidAmount' => $paidSum,
            'dueAmount' => $dueAmount,
            'isDue' => $dueAmount > 0,
            'billingDate' => $s->fee_type === 'monthly' ? '1st of every month' : null,
            'nextInstallmentDate' => $s->fee_type === 'course' ? '01/11/2026' : null,
            'admissionDate' => $s->admission_date ?? date('d/m/Y'),
            'payments' => $s->payments->map(function ($p) {
                return [
                    'id' => $p->id,
                    'amount' => (float) $p->amount,
                    'method' => $p->method,
                    'date' => $p->date,
                    'time' => $p->time,
                    'note' => $p->note,
                    'collectedBy' => $p->collected_by
                ];
            })
        ];
    }

    public function index(Request $request)
    {
        $query = Student::with('payments');

        if ($request->has('batch') && $request->input('batch') !== 'All Batches') {
            $query->where('batch', $request->input('batch'));
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('guardian_phone', 'like', "%{$search}%");
            });
        }

        $students = $query->orderBy('created_at', 'desc')->get()->map(function ($s) {
            return $this->formatStudent($s);
        });

        return response()->json($students);
    }

    public function show($id)
    {
        $student = Student::with(['payments', 'attendances', 'examMarks.exam'])->find($id);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $formatted = $this->formatStudent($student);
        $formatted['attendances'] = $student->attendances;
        $formatted['examMarks'] = $student->examMarks;

        return response()->json($formatted);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $id = $request->input('id');
        if (!$id) {
            $id = 'STU-' . mt_rand(10000, 99999);
            while (Student::where('id', $id)->exists()) {
                $id = 'STU-' . mt_rand(10000, 99999);
            }
        }

        $feeAmount = (float) ($request->input('feeAmount') ?? $request->input('fee_amount') ?? 0);
        $admissionFee = (float) ($request->input('admissionFee') ?? $request->input('admission_fee') ?? 0);
        $discount = (float) ($request->input('discount') ?? 0);
        $paidAmount = (float) ($request->input('paidAmount') ?? $request->input('paid_amount') ?? 0);

        $student = Student::create([
            'id' => $id,
            'name' => trim($request->input('name')),
            'phone' => $request->input('phone'),
            'guardian_phone' => $request->input('guardianPhone') ?? $request->input('guardian_phone'),
            'batch' => $request->input('batch', 'Unassigned'),
            'fee_type' => $request->input('feeType') ?? $request->input('fee_type', 'monthly'),
            'fee_amount' => $feeAmount,
            'admission_fee' => $admissionFee,
            'discount' => $discount,
            'installments' => (int) ($request->input('installments', 1)),
            'status' => $request->input('status', 'Active'),
            'admission_date' => $request->input('admissionDate') ?? $request->input('admission_date') ?? date('d/m/Y')
        ]);

        // If initial paidAmount > 0, record initial payment
        if ($paidAmount > 0) {
            Payment::create([
                'id' => 'TXN-' . mt_rand(1000, 9999),
                'student_id' => $student->id,
                'student_name' => $student->name,
                'batch' => $student->batch,
                'amount' => $paidAmount,
                'method' => $request->input('paymentMethod', 'Cash'),
                'collected_by' => 'Admin',
                'date' => date('d/m/Y'),
                'time' => date('h:i A'),
                'note' => 'Initial payment upon admission'
            ]);
        }

        return response()->json($this->formatStudent($student->fresh(['payments'])), 201);
    }

    public function update(Request $request, $id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $fields = [];
        if ($request->has('name')) $fields['name'] = trim($request->input('name'));
        if ($request->has('phone')) $fields['phone'] = $request->input('phone');
        if ($request->has('guardianPhone')) $fields['guardian_phone'] = $request->input('guardianPhone');
        if ($request->has('guardian_phone')) $fields['guardian_phone'] = $request->input('guardian_phone');
        if ($request->has('batch')) $fields['batch'] = $request->input('batch');
        if ($request->has('feeType')) $fields['fee_type'] = $request->input('feeType');
        if ($request->has('fee_type')) $fields['fee_type'] = $request->input('fee_type');
        if ($request->has('feeAmount')) $fields['fee_amount'] = (float) $request->input('feeAmount');
        if ($request->has('fee_amount')) $fields['fee_amount'] = (float) $request->input('fee_amount');
        if ($request->has('admissionFee')) $fields['admission_fee'] = (float) $request->input('admissionFee');
        if ($request->has('discount')) $fields['discount'] = (float) $request->input('discount');
        if ($request->has('installments')) $fields['installments'] = (int) $request->input('installments');
        if ($request->has('status')) $fields['status'] = $request->input('status');
        if ($request->has('admissionDate')) $fields['admission_date'] = $request->input('admissionDate');

        $student->update($fields);

        return response()->json($this->formatStudent($student->fresh(['payments'])));
    }

    public function destroy($id)
    {
        $student = Student::find($id);
        if ($student) {
            $student->payments()->delete();
            $student->attendances()->delete();
            $student->examMarks()->delete();
            $student->delete();
        }

        return response()->json(['message' => 'Student deleted successfully']);
    }
}
