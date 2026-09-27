<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    protected $fillable = [
        'employee_id', 'title', 'category', 'file_path', 'file_type',
        'file_size', 'expiry_date', 'is_verified', 'uploaded_by',
    ];
    protected $casts = ['expiry_date' => 'date', 'is_verified' => 'boolean'];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function uploadedBy(): BelongsTo { return $this->belongsTo(User::class, 'uploaded_by'); }
}
