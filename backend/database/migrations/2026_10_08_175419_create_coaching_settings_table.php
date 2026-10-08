<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coaching_settings', function (Blueprint $table) {
            $table->id();
            $table->string('coaching_name')->default("Maruf's ICT Care");
            $table->string('phone')->default("01723619524");
            $table->string('address')->default("Kushtia Govt. College Gate, Kushtia");
            $table->string('tagline')->default("Don't Memorise, Come To Learn");
            $table->longText('logo_url')->nullable();
            $table->string('admin_password')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coaching_settings');
    }
};
