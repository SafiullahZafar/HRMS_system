<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('performance_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('period', ['monthly', 'quarterly', 'annual'])->default('annual');
            $table->integer('review_year');
            $table->integer('review_quarter')->nullable();
            $table->integer('review_month')->nullable();
            $table->integer('quality_score')->nullable(); // 1-5
            $table->integer('productivity_score')->nullable();
            $table->integer('communication_score')->nullable();
            $table->integer('teamwork_score')->nullable();
            $table->integer('attendance_score')->nullable();
            $table->integer('leadership_score')->nullable();
            $table->integer('technical_score')->nullable();
            $table->decimal('overall_rating', 3, 1)->nullable();
            $table->text('strengths')->nullable();
            $table->text('improvements')->nullable();
            $table->text('manager_comments')->nullable();
            $table->text('employee_comments')->nullable();
            $table->enum('status', ['draft', 'submitted', 'acknowledged'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('performance_reviews'); }
};
