<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interview extends Model
{
    protected $fillable = [
        'candidate_id', 'interviewer_id', 'scheduled_at', 'type', 'location',
        'meeting_link', 'technical_score', 'communication_score', 'experience_score',
        'recommendation', 'notes', 'status',
    ];
    protected $casts = ['scheduled_at' => 'datetime'];

    public function candidate(): BelongsTo { return $this->belongsTo(Candidate::class); }
    public function interviewer(): BelongsTo { return $this->belongsTo(User::class, 'interviewer_id'); }
}
