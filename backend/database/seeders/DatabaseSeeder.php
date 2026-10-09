<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Batch;
use App\Models\Student;
use App\Models\Payment;
use App\Models\Attendance;
use App\Models\Exam;
use App\Models\ExamMark;
use App\Models\Expense;
use App\Models\Staff;
use App\Models\CoachingSetting;
use App\Models\OnlineAdmission;
use App\Models\EnrollmentLink;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // =========================================================================
        // 🔐 ADMIN & MANAGER CREDENTIALS (এডমিন ও ম্যানেজারের লগইন তথ্য)
        // এগুলো পরিবর্তন করতে হলে সরাসরি কোডের এই অংশ অথবা ডেটাবেজ থেকে পরিবর্তন করতে হবে।
        // (To change credentials, modify directly in this code or in the database)
        // =========================================================================
        User::updateOrCreate(
            ['email' => 'marufjarvis@gmail.com'],
            [
                'name' => 'Maruf Hossain (Admin)',
                'password' => Hash::make('12345678'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'manager@gmail.com'],
            [
                'name' => 'Center Manager',
                'password' => Hash::make('12345678'),
                'role' => 'manager',
            ]
        );

        // 1. Coaching Settings
        CoachingSetting::firstOrCreate(
            ['id' => 1],
            [
                'coaching_name' => "Maruf's ICT Care",
                'phone' => '01723619524',
                'address' => 'Kushtia Govt. College Gate, Kushtia',
                'tagline' => "Don't Memorise, Come To Learn",
                'admin_password' => 'admin'
            ]
        );

        // 2. Batches
        $batches = [
            'Sat-6:45am', 'Sat-7:45am', 'Sat-9am', 'Sat-10am',
            'Sat-2pm', 'Sat-3pm', 'Sat-4pm', 'Sat-5pm',
            'Sun-6:45am', 'Sun-8am', 'Sun-9am', 'Sun-10am'
        ];

        foreach ($batches as $batchName) {
            Batch::firstOrCreate(['name' => $batchName], ['status' => 'active']);
        }

        // 3. Students
        $students = [
            [
                'id' => 'STU-66115',
                'name' => 'Maruf Hossain',
                'phone' => '01723619524',
                'guardian_phone' => '01586232012',
                'batch' => 'Sat-6:45am',
                'fee_type' => 'monthly',
                'fee_amount' => 500.00,
                'admission_fee' => 200.00,
                'discount' => 0.00,
                'installments' => 1,
                'status' => 'Active',
                'admission_date' => '01/10/2026',
            ],
            [
                'id' => 'STU-45213',
                'name' => 'Rakib Hasan',
                'phone' => '01534343434',
                'guardian_phone' => '01711122233',
                'batch' => 'Sat-6:45am',
                'fee_type' => 'course',
                'fee_amount' => 4000.00,
                'admission_fee' => 0.00,
                'discount' => 0.00,
                'installments' => 2,
                'status' => 'Active',
                'admission_date' => '05/10/2026',
            ],
            [
                'id' => 'STU-10293',
                'name' => 'Ayesha Siddiqua',
                'phone' => '01912345678',
                'guardian_phone' => '01811223344',
                'batch' => 'Sun-8am',
                'fee_type' => 'monthly',
                'fee_amount' => 500.00,
                'admission_fee' => 200.00,
                'discount' => 0.00,
                'installments' => 1,
                'status' => 'Active',
                'admission_date' => '15/09/2026',
            ]
        ];

        foreach ($students as $stuData) {
            Student::firstOrCreate(['id' => $stuData['id']], $stuData);
        }

        // 4. Payments
        $payments = [
            [
                'id' => 'TXN-1001',
                'student_id' => 'STU-66115',
                'student_name' => 'Maruf Hossain',
                'batch' => 'Sat-6:45am',
                'amount' => 500.00,
                'method' => 'bKash',
                'collected_by' => 'Admin',
                'date' => '08/10/2026',
                'time' => '10:30 AM',
                'note' => 'October Monthly Fee'
            ],
            [
                'id' => 'TXN-1002',
                'student_id' => 'STU-45213',
                'student_name' => 'Rakib Hasan',
                'batch' => 'Sat-6:45am',
                'amount' => 2000.00,
                'method' => 'Cash',
                'collected_by' => 'Admin',
                'date' => '05/10/2026',
                'time' => '11:45 AM',
                'note' => '1st Installment Admission Fee'
            ]
        ];

        foreach ($payments as $payData) {
            Payment::firstOrCreate(['id' => $payData['id']], $payData);
        }

        // 5. Attendance
        Attendance::firstOrCreate([
            'date' => '2026-10-08',
            'batch' => 'Sat-6:45am',
            'student_id' => 'STU-66115'
        ], [
            'status' => 'Present'
        ]);

        Attendance::firstOrCreate([
            'date' => '2026-10-08',
            'batch' => 'Sat-6:45am',
            'student_id' => 'STU-45213'
        ], [
            'status' => 'Present'
        ]);

        // 6. Exam & Marks
        $exam = Exam::firstOrCreate([
            'name' => 'Chapter 1 MCQ & Written Test',
            'batch' => 'Sat-6:45am'
        ], [
            'subject' => 'ICT',
            'date' => '2026-10-02',
            'total_marks' => 50,
            'pass_marks' => 40
        ]);

        ExamMark::firstOrCreate([
            'exam_id' => $exam->id,
            'student_id' => 'STU-66115'
        ], [
            'marks_obtained' => 46.00
        ]);

        ExamMark::firstOrCreate([
            'exam_id' => $exam->id,
            'student_id' => 'STU-45213'
        ], [
            'marks_obtained' => 42.00
        ]);

        // 7. Expenses
        $expenses = [
            ['title' => 'Classroom Electricity Bill', 'amount' => 850.00, 'category' => 'Utilities', 'date' => '2026-10-02'],
            ['title' => 'Whiteboard Markers & Sheets', 'amount' => 350.00, 'category' => 'Materials', 'date' => '2026-10-04'],
            ['title' => 'Internet Wi-Fi Monthly Bill', 'amount' => 600.00, 'category' => 'Utilities', 'date' => '2026-10-06']
        ];

        foreach ($expenses as $exp) {
            Expense::firstOrCreate(['title' => $exp['title'], 'date' => $exp['date']], $exp);
        }

        // 8. Staff
        $staffMembers = [
            ['name' => 'Maruf Hossain', 'phone' => '01723619524', 'role' => 'Admin', 'status' => 'Active'],
            ['name' => 'Sakib Ahmed', 'phone' => '01822334455', 'role' => 'Manager', 'status' => 'Active']
        ];

        foreach ($staffMembers as $stf) {
            Staff::firstOrCreate(['phone' => $stf['phone']], $stf);
        }

        // 9. Online Admissions
        OnlineAdmission::firstOrCreate([
            'id' => 'APP-1001'
        ], [
            'name' => 'Tamim Iqbal',
            'phone' => '01700112233',
            'guardian_phone' => '01800112233',
            'preferred_batch' => 'Sat-6:45am',
            'date' => '2026-10-08',
            'status' => 'Pending'
        ]);

        // 10. Enrollment Links
        EnrollmentLink::firstOrCreate([
            'batch' => 'Sat-6:45am'
        ], [
            'url' => 'http://localhost:5173/admit?batch=Sat-6:45am'
        ]);
    }
}
