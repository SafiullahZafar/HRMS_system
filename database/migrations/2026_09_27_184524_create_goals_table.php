<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('target', 8, 2)->nullable();
            $table->decimal('achieved', 8, 2)->default(0);
            $table->string('unit')->nullable(); // %, count, etc.
            $table->date('due_date')->nullable();
            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active');
            $table->integer('year');
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('goals'); }
};
