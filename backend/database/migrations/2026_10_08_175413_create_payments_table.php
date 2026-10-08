<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. REC-1001
            $table->string('student_id');
            $table->string('student_name')->nullable();
            $table->string('batch')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('method')->default('Cash');
            $table->string('note')->nullable();
            $table->string('collected_by')->default('Admin');
            $table->string('date');
            $table->string('time')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
