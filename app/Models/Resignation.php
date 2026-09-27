<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Resignation extends Model
{
    protected $fillable = [
        'employee_id', 'resignation_date', 'last_working_day', 'notice_period_days',
        'reason', 'type', 'status', 'approved_by', 'approved_at', 'final_settlement_amount',
    ];
    protected $casts = [
        'resignation_date' => 'date', 'last_working_day' => 'date',
        'approved_at' => 'datetime', 'final_settlement_amount' => 'decimal:2',
    ];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function approvedBy(): BelongsTo { return $this->belongsTo(User::class, 'approved_by'); }
    public function offboardingTasks(): HasMany { return $this->hasMany(OffboardingTask::class); }
    public function exitInterview(): HasOne { return $this->hasOne(ExitInterview::class); }
}
