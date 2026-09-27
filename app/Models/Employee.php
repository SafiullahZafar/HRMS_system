<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'employee_id', 'user_id', 'company_id', 'branch_id', 'department_id',
        'designation_id', 'manager_id', 'first_name', 'last_name', 'father_name',
        'cnic', 'date_of_birth', 'gender', 'phone', 'email', 'address',
        'emergency_contact_name', 'emergency_contact_phone', 'photo',
        'employment_type', 'joining_date', 'probation_end_date', 'work_location', 'status',
        'basic_salary', 'payment_method', 'bank_name', 'bank_account', 'bank_branch',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'joining_date' => 'date',
        'probation_end_date' => 'date',
        'basic_salary' => 'decimal:2',
    ];

    // Relationships
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function branch(): BelongsTo { return $this->belongsTo(Branch::class); }
    public function department(): BelongsTo { return $this->belongsTo(Department::class); }
    public function designation(): BelongsTo { return $this->belongsTo(Designation::class); }
    public function manager(): BelongsTo { return $this->belongsTo(Employee::class, 'manager_id'); }
    public function subordinates(): HasMany { return $this->hasMany(Employee::class, 'manager_id'); }

    public function attendances(): HasMany { return $this->hasMany(Attendance::class); }
    public function leaveRequests(): HasMany { return $this->hasMany(LeaveRequest::class); }
    public function leaveBalances(): HasMany { return $this->hasMany(LeaveBalance::class); }
    public function shiftAssignments(): HasMany { return $this->hasMany(ShiftAssignment::class); }
    public function payrollItems(): HasMany { return $this->hasMany(PayrollItem::class); }
    public function payslips(): HasMany { return $this->hasMany(Payslip::class); }
    public function loans(): HasMany { return $this->hasMany(Loan::class); }
    public function performanceReviews(): HasMany { return $this->hasMany(PerformanceReview::class); }
    public function goals(): HasMany { return $this->hasMany(Goal::class); }
    public function warnings(): HasMany { return $this->hasMany(Warning::class); }
    public function promotions(): HasMany { return $this->hasMany(Promotion::class); }
    public function trainings(): HasMany { return $this->belongsToMany(Training::class, 'training_employees')->withPivot('completed', 'completed_at', 'score')->withTimestamps(); }
    public function certifications(): HasMany { return $this->hasMany(Certification::class); }
    public function assetAssignments(): HasMany { return $this->hasMany(AssetAssignment::class); }
    public function expenses(): HasMany { return $this->hasMany(Expense::class); }
    public function documents(): HasMany { return $this->hasMany(Document::class); }
    public function onboardingTasks(): HasMany { return $this->hasMany(OnboardingTask::class); }
    public function resignation(): HasOne { return $this->hasOne(Resignation::class); }
    public function offboardingTasks(): HasMany { return $this->hasMany(OffboardingTask::class); }
    public function exitInterview(): HasOne { return $this->hasOne(ExitInterview::class); }

    // Accessors
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getCurrentShiftAttribute()
    {
        return $this->shiftAssignments()
            ->with('shift')
            ->where('effective_from', '<=', now())
            ->where(fn($q) => $q->whereNull('effective_to')->orWhere('effective_to', '>=', now()))
            ->latest('effective_from')
            ->first()?->shift;
    }
}
