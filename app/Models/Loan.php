<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Loan extends Model
{
    protected $fillable = [
        'employee_id', 'type', 'amount', 'installments', 'monthly_deduction',
        'paid_amount', 'remaining_amount', 'start_date', 'reason', 'status',
        'approved_by', 'approved_at',
    ];
    protected $casts = [
        'amount' => 'decimal:2', 'monthly_deduction' => 'decimal:2',
        'paid_amount' => 'decimal:2', 'remaining_amount' => 'decimal:2',
        'start_date' => 'date', 'approved_at' => 'datetime',
    ];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function approvedBy(): BelongsTo { return $this->belongsTo(User::class, 'approved_by'); }
}
