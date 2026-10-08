<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('online_admissions', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. APP-1001
            $table->string('name');
            $table->string('phone');
            $table->string('guardian_phone')->nullable();
            $table->string('preferred_batch');
            $table->string('date')->nullable();
            $table->string('status')->default('Pending'); // Pending, Approved, Rejected
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('online_admissions');
    }
};
