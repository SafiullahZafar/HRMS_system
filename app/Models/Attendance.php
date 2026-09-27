<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $fillable = [
        'employee_id', 'date', 'check_in', 'check_out',
        'worked_minutes', 'overtime_minutes', 'late_minutes',
        'status', 'method', 'check_in_location', 'check_out_location', 'notes', 'approved_by',
    ];
    protected $casts = ['date' => 'date'];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function approvedBy(): BelongsTo { return $this->belongsTo(User::class, 'approved_by'); }

    public function getWorkedHoursAttribute(): string
    {
        $h = intdiv($this->worked_minutes, 60);
        $m = $this->worked_minutes % 60;
        return "{$h}h {$m}m";
    }
}
