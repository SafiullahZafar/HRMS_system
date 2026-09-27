<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('grace_period')->default(0); // minutes
            $table->integer('break_duration')->default(60); // minutes
            $table->boolean('is_night_shift')->default(false);
            $table->json('working_days')->nullable(); // [1,2,3,4,5]
            $table->string('color', 20)->default('#4F46E5');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('shifts'); }
};
