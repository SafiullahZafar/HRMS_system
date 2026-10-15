<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->json('allowed_modules')->nullable()->after('company_id');
        });

        Schema::create('demo_activities', function (Blueprint $table) {
            $table->id();
            $table->string('visitor_key')->index();
            $table->foreignId('demo_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('demo_username')->nullable()->index();
            $table->string('action');
            $table->string('module')->nullable()->index();
            $table->string('path', 500)->nullable();
            $table->string('method', 10)->default('GET');
            $table->string('ip_address', 50)->nullable();
            $table->string('os', 100)->nullable();
            $table->string('browser', 100)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demo_activities');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'allowed_modules']);
        });
    }
};
