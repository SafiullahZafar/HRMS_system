<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Warning extends Model
{
    protected $fillable = ['employee_id', 'issued_by', 'type', 'subject', 'description', 'issue_date', 'attachment', 'employee_acknowledged'];
    protected $casts = ['issue_date' => 'date', 'employee_acknowledged' => 'boolean'];

    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
    public function issuedBy(): BelongsTo { return $this->belongsTo(User::class, 'issued_by'); }
}
