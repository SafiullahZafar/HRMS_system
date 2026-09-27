<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveRequest extends Model
{
    protected $fillable = [
        'employee_id', 'leave_type_id', 'from_date', 'to_date',
        'days', 'day_type', 'reason', 'attachment', 'status',
        'approved_by', 'rejection_reason', 'approved_at',
    ];
    protected $casts = [
        'from_date' => 'date', 'to_date' => 'date',
        'approved_at' => 'datetime', 'days' => 'decimal:1',
    ];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function leaveType(): BelongsTo { return $this->belongsTo(LeaveType::class); }
    public function approvedBy(): BelongsTo { return $this->belongsTo(User::class, 'approved_by'); }
}
