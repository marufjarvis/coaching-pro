<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OnlineAdmission;
use App\Models\Student;
use App\Models\Payment;
use Illuminate\Http\Request;

class OnlineAdmissionController extends Controller
{
    private function formatAdmission(OnlineAdmission $a)
    {
        return [
            'id' => $a->id,
            'name' => $a->name,
            'phone' => $a->phone,
            'guardianPhone' => $a->guardian_phone,
            'preferredBatch' => $a->preferred_batch,
            'date' => $a->date,
            'status' => $a->status
        ];
    }

    public function index()
    {
        $admissions = OnlineAdmission::orderBy('created_at', 'desc')->get()->map(function ($a) {
            return $this->formatAdmission($a);
        });

        return response()->json($admissions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'preferredBatch' => 'required|string',
        ]);

        $id = $request->input('id');
        if (!$id) {
            $id = 'APP-' . mt_rand(1000, 9999);
            while (OnlineAdmission::where('id', $id)->exists()) {
                $id = 'APP-' . mt_rand(1000, 9999);
            }
        }

        $admission = OnlineAdmission::create([
            'id' => $id,
            'name' => trim($request->input('name')),
            'phone' => trim($request->input('phone')),
            'guardian_phone' => $request->input('guardianPhone') ?? $request->input('guardian_phone'),
            'preferred_batch' => $request->input('preferredBatch') ?? $request->input('preferred_batch'),
            'date' => $request->input('date', date('Y-m-d')),
            'status' => 'Pending'
        ]);

        return response()->json($this->formatAdmission($admission), 201);
    }

    public function approve(Request $request, $id)
    {
        $admission = OnlineAdmission::find($id);
        if (!$admission) {
            return response()->json(['message' => 'Application not found'], 404);
        }

        $studentId = $request->input('id') ?? $request->input('studentId');
        if (!$studentId) {
            $existingIds = Student::pluck('id')->toArray();
            $maxNum = 0;
            $padLength = 5;
            $prefix = 'STU-';
            foreach ($existingIds as $exId) {
                if (preg_match('/^(.*?)(\d+)$/', trim($exId), $m)) {
                    $prefix = $m[1] ?: 'STU-';
                    $val = (int)$m[2];
                    if ($val > $maxNum) {
                        $maxNum = $val;
                        $padLength = strlen($m[2]);
                    }
                }
            }
            $nextNum = $maxNum > 0 ? ($maxNum + 1) : 20001;
            $studentId = $prefix . str_pad($nextNum, $padLength, '0', STR_PAD_LEFT);
        }

        $feeAmount = (float) ($request->input('feeAmount') ?? 500);
        $paidAmount = (float) ($request->input('paidAmount') ?? 0);

        $student = Student::create([
            'id' => $studentId,
            'name' => $admission->name,
            'phone' => $admission->phone,
            'guardian_phone' => $admission->guardian_phone,
            'batch' => $request->input('batch') ?? $admission->preferred_batch,
            'fee_type' => $request->input('feeType', 'monthly'),
            'fee_amount' => $feeAmount,
            'admission_fee' => (float) ($request->input('admissionFee') ?? 0),
            'discount' => (float) ($request->input('discount') ?? 0),
            'installments' => (int) ($request->input('installments') ?? 1),
            'status' => 'Active',
            'admission_date' => date('d/m/Y')
        ]);

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
                'note' => 'Online Admission Confirmation Payment'
            ]);
        }

        $admission->status = 'Approved';
        $admission->save();

        return response()->json([
            'message' => 'Admission approved and student created',
            'student' => $student,
            'admission' => $this->formatAdmission($admission)
        ]);
    }

    public function destroy($id)
    {
        $admission = OnlineAdmission::find($id);
        if ($admission) {
            $admission->delete();
        }

        return response()->json(['message' => 'Application removed successfully']);
    }
}
