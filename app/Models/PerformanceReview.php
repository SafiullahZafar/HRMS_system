<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerformanceReview extends Model
{
    protected $fillable = [
        'employee_id', 'reviewer_id', 'period', 'review_year', 'review_quarter', 'review_month',
        'quality_score', 'productivity_score', 'communication_score', 'teamwork_score',
        'attendance_score', 'leadership_score', 'technical_score', 'overall_rating',
        'strengths', 'improvements', 'manager_comments', 'employee_comments', 'status',
    ];
    protected $casts = ['overall_rating' => 'decimal:1'];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function reviewer(): BelongsTo { return $this->belongsTo(User::class, 'reviewer_id'); }
}
