<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SearchCriterion extends Model
{
    // Explicitly define the table name since the plural of "Criterion" is "Criteria"
    protected $table = 'search_criteria';

    // Fields that can be mass-assigned
    protected $fillable = [
        'buyer_id',
        'min_price',
        'max_price',
        'min_area',
        'property_type',
    ];

    /**
     * Relationship: A Search Criterion belongs to a Buyer (User).
     */
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    /**
     * Method corresponding to "оновитиКритерію()"[cite: 2]
     *
     * @param array $data New criteria data
     */
    public function updateCriterion(array $data): bool
    {
        return $this->update($data);
    }
}
