<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Training extends Model
{
    protected $fillable = ['company_id', 'title', 'description', 'trainer', 'start_date', 'end_date', 'location', 'max_participants', 'status'];
    protected $casts = ['start_date' => 'date', 'end_date' => 'date'];

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'training_employees')
            ->withPivot('completed', 'completed_at', 'score')
            ->withTimestamps();
    }
}
