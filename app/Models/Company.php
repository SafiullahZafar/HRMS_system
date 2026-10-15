<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = [
        'name', 'logo', 'email', 'phone', 'address',
        'ntn', 'currency', 'timezone', 'website', 'industry', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function users(): HasMany { return $this->hasMany(User::class); }
    public function branches(): HasMany { return $this->hasMany(Branch::class); }
    public function departments(): HasMany { return $this->hasMany(Department::class); }
    public function designations(): HasMany { return $this->hasMany(Designation::class); }
    public function employees(): HasMany { return $this->hasMany(Employee::class); }
    public function shifts(): HasMany { return $this->hasMany(Shift::class); }
    public function leaveTypes(): HasMany { return $this->hasMany(LeaveType::class); }
    public function salaryStructures(): HasMany { return $this->hasMany(SalaryStructure::class); }
    public function salaryComponents(): HasMany { return $this->hasMany(SalaryComponent::class); }
    public function payrollRuns(): HasMany { return $this->hasMany(PayrollRun::class); }
    public function jobOpenings(): HasMany { return $this->hasMany(JobOpening::class); }
    public function trainings(): HasMany { return $this->hasMany(Training::class); }
    public function assets(): HasMany { return $this->hasMany(Asset::class); }
    public function announcements(): HasMany { return $this->hasMany(Announcement::class); }
}
