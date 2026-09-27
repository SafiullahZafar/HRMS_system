<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Asset extends Model
{
    protected $fillable = [
        'company_id', 'asset_id', 'name', 'category', 'brand', 'model',
        'serial_number', 'purchase_value', 'purchase_date', 'condition', 'status', 'notes',
    ];
    protected $casts = ['purchase_date' => 'date', 'purchase_value' => 'decimal:2'];

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function assignments(): HasMany { return $this->hasMany(AssetAssignment::class); }
    public function currentAssignment(): HasOne
    {
        return $this->hasOne(AssetAssignment::class)->where('is_returned', false)->latest();
    }
}
