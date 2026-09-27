<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('exit_interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('resignation_id')->nullable()->constrained()->nullOnDelete();
            $table->text('reason_for_leaving')->nullable();
            $table->text('manager_feedback')->nullable();
            $table->integer('work_environment_rating')->nullable(); // 1-5
            $table->integer('compensation_rating')->nullable();
            $table->boolean('would_return')->nullable();
            $table->text('comments')->nullable();
            $table->date('interview_date');
            $table->foreignId('conducted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('exit_interviews'); }
};
