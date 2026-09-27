<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('asset_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->date('assigned_date');
            $table->date('return_date')->nullable();
            $table->enum('condition_on_assign', ['new', 'good', 'fair', 'poor'])->default('good');
            $table->enum('condition_on_return', ['good', 'fair', 'poor', 'damaged'])->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_returned')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('asset_assignments'); }
};
