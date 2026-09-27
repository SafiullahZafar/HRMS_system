<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_opening_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('cv')->nullable();
            $table->text('skills')->nullable();
            $table->integer('experience_years')->default(0);
            $table->decimal('expected_salary', 12, 2)->nullable();
            $table->string('source')->nullable(); // LinkedIn, referral, etc.
            $table->enum('stage', ['applied','screening','shortlisted','interview','selected','offer_sent','hired','rejected'])->default('applied');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('candidates'); }
};
