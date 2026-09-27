<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'company_id', 'is_active', 'avatar',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function employee(): HasOne { return $this->hasOne(Employee::class); }

    public function isAdmin(): bool { return in_array($this->role, ['super_admin', 'company_owner', 'hr_manager', 'hr_officer']); }
    public function isSuperAdmin(): bool { return $this->role === 'super_admin'; }
    public function isHR(): bool { return in_array($this->role, ['hr_manager', 'hr_officer']); }
    public function isPayroll(): bool { return in_array($this->role, ['payroll_officer', 'accountant']); }
    public function isManager(): bool { return $this->role === 'dept_manager'; }
    public function isEmployee(): bool { return $this->role === 'employee'; }
}
