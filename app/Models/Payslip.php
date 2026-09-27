<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payslip extends Model
{
    protected $fillable = ['payroll_run_id', 'payroll_item_id', 'employee_id', 'slip_number', 'pdf_path', 'is_emailed', 'emailed_at'];
    protected $casts = ['is_emailed' => 'boolean', 'emailed_at' => 'datetime'];

    public function payrollRun(): BelongsTo { return $this->belongsTo(PayrollRun::class); }
    public function payrollItem(): BelongsTo { return $this->belongsTo(PayrollItem::class); }
    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
}
