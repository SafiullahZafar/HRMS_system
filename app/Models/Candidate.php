<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Candidate extends Model
{
    protected $fillable = [
        'job_opening_id', 'name', 'email', 'phone', 'cv',
        'skills', 'experience_years', 'expected_salary', 'source', 'stage', 'notes',
    ];
    protected $casts = ['expected_salary' => 'decimal:2'];

    public function jobOpening(): BelongsTo { return $this->belongsTo(JobOpening::class); }
    public function interviews(): HasMany { return $this->hasMany(Interview::class); }
    public function offerLetter(): HasOne { return $this->hasOne(OfferLetter::class); }
}
