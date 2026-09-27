<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PayrollRun extends Model
{
    protected $fillable = [
        'company_id', 'title', 'month', 'year', 'pay_date',
        'total_gross', 'total_deductions', 'total_net', 'employee_count',
        'status', 'created_by', 'approved_by', 'approved_at',
    ];
    protected $casts = [
        'pay_date' => 'date', 'approved_at' => 'datetime',
        'total_gross' => 'decimal:2', 'total_deductions' => 'decimal:2', 'total_net' => 'decimal:2',
    ];

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function createdBy(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function approvedBy(): BelongsTo { return $this->belongsTo(User::class, 'approved_by'); }
    public function items(): HasMany { return $this->hasMany(PayrollItem::class); }
    public function payslips(): HasMany { return $this->hasMany(Payslip::class); }
}
