<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('salary_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code', 30);
            $table->enum('type', ['allowance', 'deduction', 'bonus', 'tax', 'loan']);
            $table->enum('calculation_type', ['fixed', 'percentage'])->default('fixed');
            $table->decimal('value', 12, 2)->default(0); // amount or percent
            $table->boolean('is_taxable')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('salary_components'); }
};
