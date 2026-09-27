<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalaryComponent extends Model
{
    protected $fillable = ['company_id', 'name', 'code', 'type', 'calculation_type', 'value', 'is_taxable', 'is_active'];
    protected $casts = ['is_taxable' => 'boolean', 'is_active' => 'boolean', 'value' => 'decimal:2'];

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
}
