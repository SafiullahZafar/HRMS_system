<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Goal extends Model
{
    protected $fillable = ['employee_id', 'title', 'description', 'target', 'achieved', 'unit', 'due_date', 'status', 'year'];
    protected $casts = ['due_date' => 'date', 'target' => 'decimal:2', 'achieved' => 'decimal:2'];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }

    public function getProgressPercentAttribute(): float
    {
        if (!$this->target || $this->target == 0) return 0;
        return min(100, round(($this->achieved / $this->target) * 100, 1));
    }
}
