<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobOpening extends Model
{
    protected $fillable = [
        'company_id', 'department_id', 'title', 'location', 'employment_type',
        'salary_min', 'salary_max', 'vacancies', 'description', 'requirements',
        'deadline', 'status', 'created_by',
    ];
    protected $casts = [
        'deadline' => 'date',
        'salary_min' => 'decimal:2', 'salary_max' => 'decimal:2',
    ];

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function department(): BelongsTo { return $this->belongsTo(Department::class); }
    public function createdBy(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function candidates(): HasMany { return $this->hasMany(Candidate::class); }
}
