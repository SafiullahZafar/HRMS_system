<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'company_id',
        'allowed_modules',
        'is_active',
        'avatar',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
            'allowed_modules'   => 'array',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function employee(): HasOne
    {
        return $this->hasOne(Employee::class);
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['super_admin', 'company_owner', 'hr_manager', 'hr_officer']) || $this->isSuperAdmin();
    }

    public function isSuperAdmin(): bool
    {
        $superAdminName = config('app.super_admin');
        $superAdminEmail = config('app.super_admin_email');

        if ($superAdminName && strtolower((string) $this->name) === strtolower((string) $superAdminName)) {
            return true;
        }

        if ($superAdminEmail && strtolower((string) $this->email) === strtolower((string) $superAdminEmail)) {
            return true;
        }

        return $this->role === 'super_admin';
    }

    public function isDemoUser(): bool
    {
        return $this->role === 'demo';
    }

    public function isCompanyOwner(): bool
    {
        return $this->role === 'company_owner';
    }

    public function isHR(): bool { return in_array($this->role, ['hr_manager', 'hr_officer']); }
    public function isPayroll(): bool { return in_array($this->role, ['payroll_officer', 'accountant']); }
    public function isManager(): bool { return $this->role === 'dept_manager'; }
    public function isEmployee(): bool { return $this->role === 'employee'; }

    public function hasModuleAccess(string $module): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        // Demo and owner users cannot access super-admin
        if ($module === 'super-admin') {
            return false;
        }

        if ($this->isDemoUser()) {
            return true;
        }

        // If no explicit allowed_modules array, default to full standard access
        if ($this->allowed_modules === null || in_array('*', $this->allowed_modules, true)) {
            return true;
        }

        return in_array($module, $this->allowed_modules, true);
    }

    public static function ensureSuperAdminExists(): ?self
    {
        $superAdminName = config('app.super_admin');
        $superAdminEmail = config('app.super_admin_email', 'safullahzafar@gmail.com');
        $superAdminPassword = config('app.super_admin_password', '12345678');

        if (!$superAdminName && !$superAdminEmail) {
            return null;
        }

        $user = static::where('email', $superAdminEmail)->first();
        if (!$user) {
            $firstCompany = Company::first();
            $user = static::create([
                'name'            => $superAdminName ?: 'safiullah',
                'email'           => $superAdminEmail,
                'password'        => Hash::make($superAdminPassword),
                'role'            => 'super_admin',
                'company_id'      => $firstCompany?->id ?? 1,
                'is_active'       => true,
                'allowed_modules' => ['*'],
            ]);
        } else {
            $user->update([
                'name'            => $superAdminName ?: $user->name,
                'role'            => 'super_admin',
                'is_active'       => true,
                'allowed_modules' => ['*'],
            ]);
        }

        return $user;
    }
}
