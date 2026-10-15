<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class SyncSuperAdmin extends Command
{
    protected $signature = 'superadmin:sync';
    protected $description = 'Ensure super admin user defined in .env exists';

    public function handle(): int
    {
        $user = User::ensureSuperAdminExists();
        if ($user) {
            $this->info("Super Admin user verified/created successfully: {$user->email} ({$user->name})");
        } else {
            $this->warn("No SUPER_ADMIN configured in .env");
        }
        return self::SUCCESS;
    }
}
