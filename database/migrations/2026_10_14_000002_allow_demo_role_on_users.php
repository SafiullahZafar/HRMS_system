<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // For SQLite, recreate or alter role column to string without restrictive enum CHECK
        if (DB::getDriverName() === 'sqlite') {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role')->default('employee')->change();
            });
        } else {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role', 50)->default('employee')->change();
            });
        }
    }

    public function down(): void
    {
        //
    }
};
