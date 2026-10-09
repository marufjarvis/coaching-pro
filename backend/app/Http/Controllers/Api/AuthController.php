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
     * Handle Student Login (directly via registered Mobile Number)
     */
    public function studentLogin(Request $request)
    {
        $phone = trim($request->input('phone') ?? $request->input('login_id') ?? '');

        if (empty($phone)) {
            return response()->json([
                'success' => false,
                'message' => 'অনুগ্রহ করে নিবন্ধিত মোবাইল নম্বর প্রদান করুন।'
            ], 422);
        }

        // Search student by Phone, Guardian Phone, or ID
        $student = Student::with(['payments', 'attendances', 'examMarks.exam'])
            ->where('phone', $phone)
            ->orWhere('guardian_phone', $phone)
            ->orWhere('id', $phone)
            ->first();

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'এই মোবাইল নম্বরে কোনো শিক্ষার্থী খুঁজে পাওয়া যায়নি! কোচিং সেন্টারে নিবন্ধিত মোবাইল নম্বর প্রদান করুন।'
            ], 404);
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
