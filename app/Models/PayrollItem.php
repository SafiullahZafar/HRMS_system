<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollItem extends Model
{
    protected $fillable = [
        'payroll_run_id', 'employee_id', 'basic_salary', 'total_allowances',
        'overtime_pay', 'bonus', 'gross_salary', 'total_deductions',
        'tax_deduction', 'loan_deduction', 'late_deduction', 'absence_deduction',
        'net_salary', 'working_days', 'present_days', 'absent_days',
        'leave_days', 'overtime_hours', 'components',
    ];
    protected $casts = [
        'basic_salary' => 'decimal:2', 'total_allowances' => 'decimal:2',
        'overtime_pay' => 'decimal:2', 'bonus' => 'decimal:2',
        'gross_salary' => 'decimal:2', 'total_deductions' => 'decimal:2',
        'tax_deduction' => 'decimal:2', 'loan_deduction' => 'decimal:2',
        'late_deduction' => 'decimal:2', 'absence_deduction' => 'decimal:2',
        'net_salary' => 'decimal:2', 'components' => 'array',
    ];

    public function payrollRun(): BelongsTo { return $this->belongsTo(PayrollRun::class); }
    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
}
