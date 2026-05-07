<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Advertisement extends Model
{
    protected $fillable = [
        'seller_id',
        'title',
        'price',
        'area',
        'address',
        'status',
        'description',
        'seller_contact',
        'images'
    ];

    protected $casts = [
        'images' => 'array',
    ];

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    // Method "оприлюднити()"[cite: 2]
    public function publish()
    {
        $this->update(['status' => 'published']);
        // Trigger notification system here
    }

    // Method "архівувати()"[cite: 2]
    public function archive()
    {
        $this->update(['status' => 'archived']);
    }
}
