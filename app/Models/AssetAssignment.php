<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetAssignment extends Model
{
    protected $fillable = [
        'asset_id', 'employee_id', 'assigned_date', 'return_date',
        'condition_on_assign', 'condition_on_return', 'notes', 'is_returned',
    ];
    protected $casts = ['assigned_date' => 'date', 'return_date' => 'date', 'is_returned' => 'boolean'];

    public function asset(): BelongsTo { return $this->belongsTo(Asset::class); }
    public function employee(): BelongsTo { return $this->belongsTo(Employee::class); }
}
