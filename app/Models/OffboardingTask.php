<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OffboardingTask extends Model
{
    protected $fillable = ['employee_id', 'resignation_id', 'task', 'assigned_to', 'is_completed', 'completed_at', 'sort_order'];
    protected $casts = ['is_completed' => 'boolean', 'completed_at' => 'datetime'];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function resignation(): BelongsTo { return $this->belongsTo(Resignation::class); }
}
