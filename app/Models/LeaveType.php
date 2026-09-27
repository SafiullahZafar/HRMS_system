<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaveType extends Model
{
    protected $fillable = [
        'company_id', 'name', 'code', 'color', 'days_per_year', 'is_paid',
        'carry_forward', 'max_carry_forward', 'encashable', 'requires_document',
        'applicable_gender', 'min_days_notice', 'available_in_probation', 'is_active',
    ];
    protected $casts = [
        'is_paid' => 'boolean', 'carry_forward' => 'boolean',
        'encashable' => 'boolean', 'requires_document' => 'boolean',
        'available_in_probation' => 'boolean', 'is_active' => 'boolean',
    ];

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function leaveRequests(): HasMany { return $this->hasMany(LeaveRequest::class); }
    public function leaveBalances(): HasMany { return $this->hasMany(LeaveBalance::class); }
}
