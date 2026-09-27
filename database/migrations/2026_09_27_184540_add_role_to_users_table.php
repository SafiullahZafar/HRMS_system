<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['super_admin','company_owner','hr_manager','hr_officer','dept_manager','payroll_officer','accountant','employee'])
                  ->default('employee')->after('email');
            $table->foreignId('company_id')->nullable()->constrained()->nullOnDelete()->after('role');
            $table->boolean('is_active')->default(true)->after('company_id');
            $table->string('avatar')->nullable()->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'company_id', 'is_active', 'avatar']);
        });
    }
};
