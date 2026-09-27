<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
    protected $fillable = [
        'company_id', 'title', 'content', 'audience', 'audience_ids',
        'priority', 'publish_at', 'is_published', 'created_by',
    ];
    protected $casts = [
        'audience_ids' => 'array', 'is_published' => 'boolean',
        'publish_at' => 'datetime',
    ];

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function createdBy(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
}
