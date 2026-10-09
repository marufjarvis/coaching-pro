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

        // 3. Students (20 Demo Students: 10 Course @ 4,000 BDT & 10 Monthly @ 500 BDT)
        $students = [
            // 10 Students in Course Fee System (Course Fee = 4,000 BDT)
            [
                'id' => 'STU-20001',
                'name' => 'তানভীর আহমেদ',
                'phone' => '01711002201',
                'guardian_phone' => '01711002202',
                'batch' => 'HSC 2026 রেগুলার ব্যাচ',
                'fee_type' => 'course',
                'fee_amount' => 4000.00,
                'admission_fee' => 0.00,
                'discount' => 0.00,
                'installments' => 2,
                'status' => 'Active',
                'admission_date' => '01/09/2026',
            ],
            [
                'id' => 'STU-20002',
                'name' => 'সাকিব আল হাসান',
                'phone' => '01712003301',
                'guardian_phone' => '01712003302',
                'batch' => 'HSC 2026 রেগুলার ব্যাচ',
                'fee_type' => 'course',
                'fee_amount' => 4000.00,
                'admission_fee' => 0.00,
                'discount' => 0.00,
                'installments' => 2,
                'status' => 'Active',
                'admission_date' => '05/09/2026',
            ],
            [
                'id' => 'STU-20003',
                'name' => 'ফারহানা হক',
                'phone' => '01713004401',
                'guardian_phone' => '01713004402',
                'batch' => 'HSC 2025 রিভিশন ও টেস্ট পেপার সলভ',
                'fee_type' => 'course',
                'fee_amount' => 4000.00,
                'admission_fee' => 0.00,
                'discount' => 0.00,
                'installments' => 1,
                'status' => 'Active',
                'admission_date' => '10/09/2026',
            ],
            [
                'id' => 'STU-20004',
                'name' => 'রাকিবুল ইসলাম',
                'phone' => '01714005501',
                'guardian_phone' => '01714005502',
                'batch' => 'HSC 2026 রেগুলার ব্যাচ',
                'fee_type' => 'course',
                'fee_amount' => 4000.00,
                'admission_fee' => 0.00,
                'discount' => 0.00,
                'installments' => 2,
                'status' => 'Active',
                'admission_date' => '12/09/2026',
            ],
            [
                'id' => 'STU-20005',
                'name' => 'মেহেরুন্নেসা আশা',
                'phone' => '01715006601',
                'guardian_phone' => '01715006602',
                'batch' => 'HSC 2025 রিভিশন ও টেস্ট পেপার সলভ',
                'fee_type' => 'course',
                'fee_amount' => 4000.00,
                'admission_fee' => 0.00,
                'discount' => 0.00,
                'installments' => 1,
                'status' => 'Active',
                'admission_date' => '15/09/2026',
            ],
            [
                'id' => 'STU-20006',
                'name' => 'আদনান সামী',
                'phone' => '01716007701',
                'guardian_phone' => '01716007702',
                'batch' => 'HSC 2027 ফাউন্ডেশন কোর্স',
                'fee_type' => 'course',
                'fee_amount' => 4000.00,
                'admission_fee' => 0.00,
                'discount' => 0.00,
                'installments' => 2,
                'status' => 'Active',
                'admission_date' => '18/09/2026',
            ],
            [
                'id' => 'STU-20007',
                'name' => 'সাদিয়া জাহান',
                'phone' => '01717008801',
                'guardian_phone' => '01717008802',
                'batch' => 'HSC 2026 রেগুলার ব্যাচ',
                'fee_type' => 'course',
                'fee_amount' => 4000.00,
                'admission_fee' => 0.00,
                'discount' => 0.00,
                'installments' => 2,
                'status' => 'Active',
                'admission_date' => '20/09/2026',
            ],
            [
                'id' => 'STU-20008',
                'name' => 'মাহফুজুর রহমান',
                'phone' => '01718009901',
                'guardian_phone' => '01718009902',
                'batch' => 'HSC 2025 রিভিশন ও টেস্ট পেপার সলভ',
                'fee_type' => 'course',
                'fee_amount' => 4000.00,
                'admission_fee' => 0.00,
                'discount' => 0.00,
                'installments' => 2,
                'status' => 'Active',
                'admission_date' => '22/09/2026',
            ],
            [
                'id' => 'STU-20009',
                'name' => 'তাসনিয়া তাবাসসুম',
                'phone' => '01719001101',
                'guardian_phone' => '01719001102',
                'batch' => 'HSC 2027 ফাউন্ডেশন কোর্স',
                'fee_type' => 'course',
                'fee_amount' => 4000.00,
                'admission_fee' => 0.00,
                'discount' => 0.00,
                'installments' => 1,
                'status' => 'Active',
                'admission_date' => '25/09/2026',
            ],
            [
                'id' => 'STU-20010',
                'name' => 'জুবায়ের হোসেন',
                'phone' => '01720002201',
                'guardian_phone' => '01720002202',
                'batch' => 'HSC 2026 রেগুলার ব্যাচ',
                'fee_type' => 'course',
                'fee_amount' => 4000.00,
                'admission_fee' => 0.00,
                'discount' => 0.00,
                'installments' => 2,
                'status' => 'Active',
                'admission_date' => '28/09/2026',
            ],

            // 10 Students in Monthly Fee System (Monthly Fee = 500 BDT)
            [
                'id' => 'STU-20011',
                'name' => 'মারুফ হোসেন',
                'phone' => '01723619524',
                'guardian_phone' => '01586232012',
                'batch' => 'HSC 2026 রেগুলার ব্যাচ',
                'fee_type' => 'monthly',
                'fee_amount' => 500.00,
                'admission_fee' => 200.00,
                'discount' => 0.00,
                'installments' => 1,
                'status' => 'Active',
                'admission_date' => '01/09/2026',
            ],
            [
                'id' => 'STU-20012',
                'name' => 'নাফিসা আক্তার',
                'phone' => '01721003301',
                'guardian_phone' => '01721003302',
                'batch' => 'HSC 2026 রেগুলার ব্যাচ',
                'fee_type' => 'monthly',
                'fee_amount' => 500.00,
                'admission_fee' => 200.00,
                'discount' => 0.00,
                'installments' => 1,
                'status' => 'Active',
                'admission_date' => '02/09/2026',
            ],
            [
                'id' => 'STU-20013',
                'name' => 'আশরাফুল ইসলাম',
                'phone' => '01722004401',
                'guardian_phone' => '01722004402',
                'batch' => 'HSC 2025 রিভিশন ও টেস্ট পেপার সলভ',
                'fee_type' => 'monthly',
                'fee_amount' => 500.00,
                'admission_fee' => 200.00,
                'discount' => 0.00,
                'installments' => 1,
                'status' => 'Active',
                'admission_date' => '05/09/2026',
            ],
            [
                'id' => 'STU-20014',
                'name' => 'সুমাইয়া খানম',
                'phone' => '01723005501',
                'guardian_phone' => '01723005502',
                'batch' => 'HSC 2026 রেগুলার ব্যাচ',
                'fee_type' => 'monthly',
                'fee_amount' => 500.00,
                'admission_fee' => 200.00,
                'discount' => 0.00,
                'installments' => 1,
                'status' => 'Active',
                'admission_date' => '08/09/2026',
            ],
            [
                'id' => 'STU-20015',
                'name' => 'হাসান মাহমুদ',
                'phone' => '01724006601',
                'guardian_phone' => '01724006602',
                'batch' => 'HSC 2027 ফাউন্ডেশন কোর্স',
                'fee_type' => 'monthly',
                'fee_amount' => 500.00,
                'admission_fee' => 200.00,
                'discount' => 0.00,
                'installments' => 1,
                'status' => 'Active',
                'admission_date' => '10/09/2026',
            ],
            [
                'id' => 'STU-20016',
                'name' => 'ফারিহা জান্নাত',
                'phone' => '01725007701',
                'guardian_phone' => '01725007702',
                'batch' => 'HSC 2026 রেগুলার ব্যাচ',
                'fee_type' => 'monthly',
                'fee_amount' => 500.00,
                'admission_fee' => 200.00,
                'discount' => 0.00,
                'installments' => 1,
                'status' => 'Active',
                'admission_date' => '12/09/2026',
            ],
            [
                'id' => 'STU-20017',
                'name' => 'আরিফুল হক',
                'phone' => '01726008801',
                'guardian_phone' => '01726008802',
                'batch' => 'HSC 2025 রিভিশন ও টেস্ট পেপার সলভ',
                'fee_type' => 'monthly',
                'fee_amount' => 500.00,
                'admission_fee' => 200.00,
                'discount' => 0.00,
                'installments' => 1,
                'status' => 'Active',
                'admission_date' => '15/09/2026',
            ],
            [
                'id' => 'STU-20018',
                'name' => 'নিশাত তাসনিম',
                'phone' => '01727009901',
                'guardian_phone' => '01727009902',
                'batch' => 'HSC 2026 রেগুলার ব্যাচ',
                'fee_type' => 'monthly',
                'fee_amount' => 500.00,
                'admission_fee' => 200.00,
                'discount' => 0.00,
                'installments' => 1,
                'status' => 'Active',
                'admission_date' => '18/09/2026',
            ],
            [
                'id' => 'STU-20019',
                'name' => 'ইমরান হোসেন',
                'phone' => '01728001101',
                'guardian_phone' => '01728001102',
                'batch' => 'HSC 2027 ফাউন্ডেশন কোর্স',
                'fee_type' => 'monthly',
                'fee_amount' => 500.00,
                'admission_fee' => 200.00,
                'discount' => 0.00,
                'installments' => 1,
                'status' => 'Active',
                'admission_date' => '20/09/2026',
            ],
            [
                'id' => 'STU-20020',
                'name' => 'জান্নাতুল ফেরদৌস',
                'phone' => '01729002201',
                'guardian_phone' => '01729002202',
                'batch' => 'HSC 2026 রেগুলার ব্যাচ',
                'fee_type' => 'monthly',
                'fee_amount' => 500.00,
                'admission_fee' => 200.00,
                'discount' => 0.00,
                'installments' => 1,
                'status' => 'Active',
                'admission_date' => '22/09/2026',
            ],
        ];

        foreach ($students as $stuData) {
            Student::updateOrCreate(['id' => $stuData['id']], $stuData);
        }

        // 4. Payments
        $payments = [
            // Course fee payments
            ['id' => 'TXN-3001', 'student_id' => 'STU-20001', 'student_name' => 'তানভীর আহমেদ', 'batch' => 'HSC 2026 রেগুলার ব্যাচ', 'amount' => 2000.00, 'method' => 'bKash', 'collected_by' => 'Admin', 'date' => '01/09/2026', 'time' => '10:00 AM', 'note' => '1st Installment Course Fee'],
            ['id' => 'TXN-3002', 'student_id' => 'STU-20001', 'student_name' => 'তানভীর আহমেদ', 'batch' => 'HSC 2026 রেগুলার ব্যাচ', 'amount' => 2000.00, 'method' => 'Nagad', 'collected_by' => 'Admin', 'date' => '01/10/2026', 'time' => '11:15 AM', 'note' => 'Final Installment Course Fee'],
            ['id' => 'TXN-3003', 'student_id' => 'STU-20002', 'student_name' => 'সাকিব আল হাসান', 'batch' => 'HSC 2026 রেগুলার ব্যাচ', 'amount' => 2000.00, 'method' => 'Cash', 'collected_by' => 'Admin', 'date' => '05/09/2026', 'time' => '04:30 PM', 'note' => '1st Installment Course Fee'],
            ['id' => 'TXN-3004', 'student_id' => 'STU-20003', 'student_name' => 'ফারহানা হক', 'batch' => 'HSC 2025 রিভিশন ও টেস্ট পেপার সলভ', 'amount' => 4000.00, 'method' => 'bKash', 'collected_by' => 'Admin', 'date' => '10/09/2026', 'time' => '02:00 PM', 'note' => 'Full Course Fee Paid'],
            ['id' => 'TXN-3005', 'student_id' => 'STU-20004', 'student_name' => 'রাকিবুল ইসলাম', 'batch' => 'HSC 2026 রেগুলার ব্যাচ', 'amount' => 2000.00, 'method' => 'Cash', 'collected_by' => 'Admin', 'date' => '12/09/2026', 'time' => '09:45 AM', 'note' => '1st Installment Course Fee'],
            ['id' => 'TXN-3006', 'student_id' => 'STU-20005', 'student_name' => 'মেহেরুন্নেসা আশা', 'batch' => 'HSC 2025 রিভিশন ও টেস্ট পেপার সলভ', 'amount' => 4000.00, 'method' => 'bKash', 'collected_by' => 'Admin', 'date' => '15/09/2026', 'time' => '05:20 PM', 'note' => 'Full Course Fee Paid'],
            ['id' => 'TXN-3007', 'student_id' => 'STU-20006', 'student_name' => 'আদনান সামী', 'batch' => 'HSC 2027 ফাউন্ডেশন কোর্স', 'amount' => 2000.00, 'method' => 'Cash', 'collected_by' => 'Admin', 'date' => '18/09/2026', 'time' => '11:00 AM', 'note' => '1st Installment Course Fee'],
            ['id' => 'TXN-3008', 'student_id' => 'STU-20007', 'student_name' => 'সাদিয়া জাহান', 'batch' => 'HSC 2026 রেগুলার ব্যাচ', 'amount' => 4000.00, 'method' => 'Nagad', 'collected_by' => 'Admin', 'date' => '20/09/2026', 'time' => '03:10 PM', 'note' => 'Full Course Fee Paid'],
            ['id' => 'TXN-3009', 'student_id' => 'STU-20008', 'student_name' => 'মাহফুজুর রহমান', 'batch' => 'HSC 2025 রিভিশন ও টেস্ট পেপার সলভ', 'amount' => 2000.00, 'method' => 'bKash', 'collected_by' => 'Admin', 'date' => '22/09/2026', 'time' => '12:30 PM', 'note' => '1st Installment Course Fee'],
            ['id' => 'TXN-3010', 'student_id' => 'STU-20009', 'student_name' => 'তাসনিয়া তাবাসসুম', 'batch' => 'HSC 2027 ফাউন্ডেশন কোর্স', 'amount' => 4000.00, 'method' => 'bKash', 'collected_by' => 'Admin', 'date' => '25/09/2026', 'time' => '01:15 PM', 'note' => 'Full Course Fee Paid'],
            ['id' => 'TXN-3011', 'student_id' => 'STU-20010', 'student_name' => 'জুবায়ের হোসেন', 'batch' => 'HSC 2026 রেগুলার ব্যাচ', 'amount' => 2000.00, 'method' => 'Cash', 'collected_by' => 'Admin', 'date' => '28/09/2026', 'time' => '10:40 AM', 'note' => '1st Installment Course Fee'],

            // Monthly fee payments
            ['id' => 'TXN-3012', 'student_id' => 'STU-20011', 'student_name' => 'মারুফ হোসেন', 'batch' => 'HSC 2026 রেগুলার ব্যাচ', 'amount' => 500.00, 'method' => 'bKash', 'collected_by' => 'Admin', 'date' => '01/10/2026', 'time' => '09:00 AM', 'note' => 'October Monthly Fee'],
            ['id' => 'TXN-3013', 'student_id' => 'STU-20012', 'student_name' => 'নাফিসা আক্তার', 'batch' => 'HSC 2026 রেগুলার ব্যাচ', 'amount' => 500.00, 'method' => 'Nagad', 'collected_by' => 'Admin', 'date' => '02/10/2026', 'time' => '10:15 AM', 'note' => 'October Monthly Fee'],
            ['id' => 'TXN-3014', 'student_id' => 'STU-20014', 'student_name' => 'সুমাইয়া খানম', 'batch' => 'HSC 2026 রেগুলার ব্যাচ', 'amount' => 500.00, 'method' => 'Cash', 'collected_by' => 'Admin', 'date' => '03/10/2026', 'time' => '11:30 AM', 'note' => 'October Monthly Fee'],
            ['id' => 'TXN-3015', 'student_id' => 'STU-20016', 'student_name' => 'ফারিহা জান্নাত', 'batch' => 'HSC 2026 রেগুলার ব্যাচ', 'amount' => 500.00, 'method' => 'bKash', 'collected_by' => 'Admin', 'date' => '04/10/2026', 'time' => '04:00 PM', 'note' => 'October Monthly Fee'],
            ['id' => 'TXN-3016', 'student_id' => 'STU-20017', 'student_name' => 'আরিফুল হক', 'batch' => 'HSC 2025 রিভিশন ও টেস্ট পেপার সলভ', 'amount' => 500.00, 'method' => 'Cash', 'collected_by' => 'Admin', 'date' => '05/10/2026', 'time' => '02:45 PM', 'note' => 'October Monthly Fee'],
            ['id' => 'TXN-3017', 'student_id' => 'STU-20019', 'student_name' => 'ইমরান হোসেন', 'batch' => 'HSC 2027 ফাউন্ডেশন কোর্স', 'amount' => 500.00, 'method' => 'Nagad', 'collected_by' => 'Admin', 'date' => '06/10/2026', 'time' => '05:30 PM', 'note' => 'October Monthly Fee'],
        ];

        foreach ($payments as $payData) {
            Payment::updateOrCreate(['id' => $payData['id']], $payData);
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
