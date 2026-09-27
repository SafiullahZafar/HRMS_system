<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->foreignId('interviewer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('scheduled_at');
            $table->enum('type', ['phone', 'video', 'in_person'])->default('in_person');
            $table->string('location')->nullable();
            $table->string('meeting_link')->nullable();
            $table->integer('technical_score')->nullable();
            $table->integer('communication_score')->nullable();
            $table->integer('experience_score')->nullable();
            $table->enum('recommendation', ['hire', 'reject', 'hold'])->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['scheduled', 'completed', 'cancelled', 'rescheduled'])->default('scheduled');
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('interviews'); }
};
