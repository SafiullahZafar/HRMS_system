<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shift extends Model
{
    protected $fillable = [
        'company_id', 'name', 'start_time', 'end_time',
        'grace_period', 'break_duration', 'is_night_shift', 'working_days', 'color', 'is_active',
    ];
    protected $casts = [
        'is_night_shift' => 'boolean',
        'is_active' => 'boolean',
        'working_days' => 'array',
    ];

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function assignments(): HasMany { return $this->hasMany(ShiftAssignment::class); }
}
