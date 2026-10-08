<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->string('date'); // YYYY-MM-DD
            $table->string('batch');
            $table->string('student_id');
            $table->string('status')->default('Present'); // Present, Absent, Late, Leave
            $table->timestamps();

            $table->unique(['date', 'batch', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
