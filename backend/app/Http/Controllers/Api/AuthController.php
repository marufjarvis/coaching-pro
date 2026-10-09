<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handle Admin and Manager login verification
     * Accounts cannot be registered from UI; credentials are stored in database.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $email = trim(strtolower($request->input('email')));
        $password = $request->input('password');

        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'ভুল ইমেইল অথবা পাসওয়ার্ড! সঠিক এডমিন বা ম্যানেজার তথ্য দিন।'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'লগইন সফল হয়েছে!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'admin',
            ]
        ]);
    }

    /**
     * Handle Student Login (via Student ID or Phone number)
     */
    public function studentLogin(Request $request)
    {
        $request->validate([
            'login_id' => 'required|string',
            'password' => 'required|string',
        ]);

        $loginId = trim($request->input('login_id'));
        $password = trim($request->input('password'));

        // Search student by ID or Phone or Guardian Phone
        $student = Student::with(['payments', 'attendances', 'examMarks.exam'])
            ->where('id', $loginId)
            ->orWhere('phone', $loginId)
            ->orWhere('guardian_phone', $loginId)
            ->first();

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'শিক্ষার্থী আইডি অথবা মোবাইল নম্বর পাওয়া যায়নি!'
            ], 404);
        }

        // Verify password: allow registered phone, guardian phone, student ID, or master pin '12345678'
        $matched = (
            $password === '12345678' ||
            $password === $student->phone ||
            $password === $student->guardian_phone ||
            $password === $student->id ||
            substr($student->phone, -4) === $password ||
            substr($student->phone, -6) === $password
        );

        if (!$matched) {
            return response()->json([
                'success' => false,
                'message' => 'পাসওয়ার্ড অথবা মোবাইল নম্বর সঠিক নয়! ভর্তি ফর্মে দেওয়া মোবাইল নম্বর বা 12345678 দিয়ে চেষ্টা করুন।'
            ], 401);
        }

        $paidSum = (float) $student->payments->sum('amount');
        $feeAmount = (float) $student->fee_amount;
        $dueAmount = max(0, $feeAmount - $paidSum);

        return response()->json([
            'success' => true,
            'message' => 'শিক্ষার্থী লগইন সফল হয়েছে!',
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'phone' => $student->phone,
                'guardianPhone' => $student->guardian_phone,
                'batch' => $student->batch,
                'status' => $student->status,
                'feeType' => $student->fee_type,
                'feeAmount' => $feeAmount,
                'admissionFee' => (float) $student->admission_fee,
                'discount' => (float) $student->discount,
                'installments' => (int) $student->installments,
                'paidAmount' => $paidSum,
                'dueAmount' => $dueAmount,
                'isDue' => $dueAmount > 0,
                'admissionDate' => $student->admission_date ?? date('d/m/Y'),
                'payments' => $student->payments->map(function ($p) {
                    return [
                        'id' => $p->id,
                        'amount' => (float) $p->amount,
                        'method' => $p->method,
                        'date' => $p->date,
                        'time' => $p->time,
                        'note' => $p->note,
                        'collectedBy' => $p->collected_by
                    ];
                }),
                'attendances' => $student->attendances->map(function ($a) {
                    return [
                        'date' => $a->date,
                        'batch' => $a->batch,
                        'status' => $a->status
                    ];
                }),
                'examMarks' => $student->examMarks->map(function ($em) {
                    return [
                        'examId' => $em->exam_id,
                        'examName' => $em->exam ? $em->exam->name : 'Exam',
                        'subject' => $em->exam ? $em->exam->subject : 'ICT',
                        'totalMarks' => $em->exam ? (float) $em->exam->total_marks : 50,
                        'passMarks' => $em->exam ? (float) $em->exam->pass_marks : 20,
                        'date' => $em->exam ? $em->exam->date : '',
                        'marksObtained' => (float) $em->marks_obtained
                    ];
                })
            ]
        ]);
    }
}
