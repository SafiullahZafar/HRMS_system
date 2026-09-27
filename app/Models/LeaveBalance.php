<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveBalance extends Model
{
    protected $fillable = ['employee_id', 'leave_type_id', 'year', 'allocated', 'used', 'pending', 'carried_forward'];
    protected $casts = ['allocated' => 'decimal:1', 'used' => 'decimal:1', 'pending' => 'decimal:1', 'carried_forward' => 'decimal:1'];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function leaveType(): BelongsTo { return $this->belongsTo(LeaveType::class); }

    public function getAvailableAttribute(): float
    {
        return max(0, ($this->allocated + $this->carried_forward) - $this->used - $this->pending);
    }
}
