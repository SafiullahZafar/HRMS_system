<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Promotion extends Model
{
    protected $fillable = [
        'employee_id', 'from_designation_id', 'to_designation_id',
        'from_department_id', 'to_department_id', 'from_salary', 'to_salary',
        'effective_date', 'reason', 'type', 'approved_by',
    ];
    protected $casts = [
        'effective_date' => 'date',
        'from_salary' => 'decimal:2', 'to_salary' => 'decimal:2',
    ];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function fromDesignation(): BelongsTo { return $this->belongsTo(Designation::class, 'from_designation_id'); }
    public function toDesignation(): BelongsTo { return $this->belongsTo(Designation::class, 'to_designation_id'); }
    public function fromDepartment(): BelongsTo { return $this->belongsTo(Department::class, 'from_department_id'); }
    public function toDepartment(): BelongsTo { return $this->belongsTo(Department::class, 'to_department_id'); }
    public function approvedBy(): BelongsTo { return $this->belongsTo(User::class, 'approved_by'); }
}
