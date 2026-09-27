<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OfferLetter extends Model
{
    protected $fillable = [
        'candidate_id', 'position', 'salary', 'joining_date', 'offer_expiry',
        'terms', 'pdf_path', 'status', 'sent_at', 'responded_at',
    ];
    protected $casts = [
        'joining_date' => 'date', 'offer_expiry' => 'date',
        'sent_at' => 'datetime', 'responded_at' => 'datetime',
        'salary' => 'decimal:2',
    ];

    public function candidate(): BelongsTo { return $this->belongsTo(Candidate::class); }
}
