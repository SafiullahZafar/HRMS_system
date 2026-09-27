<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    protected $fillable = [
        'employee_id', 'category', 'amount', 'expense_date', 'title',
        'description', 'receipt', 'status', 'approved_by', 'approved_at', 'reimbursed_at',
    ];
    protected $casts = [
        'expense_date' => 'date', 'amount' => 'decimal:2',
        'approved_at' => 'datetime', 'reimbursed_at' => 'datetime',
    ];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function approvedBy(): BelongsTo { return $this->belongsTo(User::class, 'approved_by'); }
}
