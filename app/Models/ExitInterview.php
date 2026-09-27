<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExitInterview extends Model
{
    protected $fillable = [
        'employee_id', 'resignation_id', 'reason_for_leaving', 'manager_feedback',
        'work_environment_rating', 'compensation_rating', 'would_return',
        'comments', 'interview_date', 'conducted_by',
    ];
    protected $casts = ['interview_date' => 'date', 'would_return' => 'boolean'];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function resignation(): BelongsTo { return $this->belongsTo(Resignation::class); }
    public function conductedBy(): BelongsTo { return $this->belongsTo(User::class, 'conducted_by'); }
}
