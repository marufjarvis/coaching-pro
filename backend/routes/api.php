<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BatchController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\OnlineAdmissionController;
use App\Http\Controllers\Api\EnrollmentLinkController;
use App\Http\Controllers\Api\DashboardController;

// Dashboard Stats
Route::get('/dashboard-stats', [DashboardController::class, 'stats']);

// Batches
Route::get('/batches', [BatchController::class, 'index']);
Route::post('/batches', [BatchController::class, 'store']);
Route::put('/batches/{id}', [BatchController::class, 'update']);
Route::delete('/batches/{id}', [BatchController::class, 'destroy']);

// Students
Route::get('/students', [StudentController::class, 'index']);
Route::get('/students/{id}', [StudentController::class, 'show']);
Route::post('/students', [StudentController::class, 'store']);
Route::put('/students/{id}', [StudentController::class, 'update']);
Route::delete('/students/{id}', [StudentController::class, 'destroy']);

// Payments
Route::get('/payments', [PaymentController::class, 'index']);
Route::post('/payments', [PaymentController::class, 'store']);
Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);

// Attendance
Route::get('/attendances', [AttendanceController::class, 'index']);
Route::post('/attendances', [AttendanceController::class, 'storeForBatchDate']);

// Exams
Route::get('/exams', [ExamController::class, 'index']);
Route::post('/exams', [ExamController::class, 'store']);
Route::post('/exams/{id}/marks', [ExamController::class, 'saveMarks']);
Route::delete('/exams/{id}', [ExamController::class, 'destroy']);

// Expenses
Route::get('/expenses', [ExpenseController::class, 'index']);
Route::post('/expenses', [ExpenseController::class, 'store']);
Route::delete('/expenses/{id}', [ExpenseController::class, 'destroy']);

// Staff
Route::get('/staff', [StaffController::class, 'index']);
Route::post('/staff', [StaffController::class, 'store']);
Route::delete('/staff/{id}', [StaffController::class, 'destroy']);

// Settings
Route::get('/settings', [SettingController::class, 'show']);
Route::post('/settings', [SettingController::class, 'update']);
Route::put('/settings', [SettingController::class, 'update']);

// Online Admissions
Route::get('/online-admissions', [OnlineAdmissionController::class, 'index']);
Route::post('/online-admissions', [OnlineAdmissionController::class, 'store']);
Route::post('/online-admissions/{id}/approve', [OnlineAdmissionController::class, 'approve']);
Route::delete('/online-admissions/{id}', [OnlineAdmissionController::class, 'destroy']);

// Enrollment Links
Route::get('/enrollment-links', [EnrollmentLinkController::class, 'index']);
Route::post('/enrollment-links', [EnrollmentLinkController::class, 'store']);
Route::delete('/enrollment-links/{id}', [EnrollmentLinkController::class, 'destroy']);
