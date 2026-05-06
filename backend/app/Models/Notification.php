<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    // Fields that can be mass-assigned
    protected $fillable = [
        'recipient_id',
        'message',
        'is_viewed',
        'sent_at',
    ];

    // Cast specific columns to appropriate PHP types
    protected $casts = [
        'is_viewed' => 'boolean',
        'sent_at' => 'datetime',
    ];

    /**
     * Relationship: A Notification belongs to a Recipient (User/Buyer).
     */
    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    /**
     * Method corresponding to "помітитиЯкПереглянуте()"[cite: 2]
     */
    public function markAsViewed(): void
    {
        $this->update(['is_viewed' => true]);
    }
}
