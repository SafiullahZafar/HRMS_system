<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certification extends Model
{
    protected $fillable = ['employee_id', 'name', 'issuing_body', 'issue_date', 'expiry_date', 'certificate_file', 'is_expired'];
    protected $casts = ['issue_date' => 'date', 'expiry_date' => 'date', 'is_expired' => 'boolean'];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
}
