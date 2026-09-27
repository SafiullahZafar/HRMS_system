<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('warnings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('issued_by')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('type', ['verbal', 'written', 'show_cause', 'suspension', 'final'])->default('verbal');
            $table->string('subject');
            $table->text('description');
            $table->date('issue_date');
            $table->string('attachment')->nullable();
            $table->boolean('employee_acknowledged')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('warnings'); }
};
