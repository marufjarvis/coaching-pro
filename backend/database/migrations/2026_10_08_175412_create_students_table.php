<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. STU-101
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->string('batch')->default('Unassigned');
            $table->string('fee_type')->default('monthly'); // 'monthly' or 'course'
            $table->decimal('fee_amount', 10, 2)->default(0);
            $table->decimal('admission_fee', 10, 2)->nullable()->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->integer('installments')->default(1);
            $table->string('status')->default('Active'); // 'Active' or 'Inactive'
            $table->string('admission_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
