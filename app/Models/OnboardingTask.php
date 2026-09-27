<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OnboardingTask extends Model
{
    protected $fillable = ['employee_id', 'task', 'description', 'assigned_to', 'due_date', 'is_completed', 'completed_at', 'sort_order'];
    protected $casts = ['due_date' => 'date', 'is_completed' => 'boolean', 'completed_at' => 'datetime'];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
}
