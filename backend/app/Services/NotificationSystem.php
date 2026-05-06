<?php

namespace App\Services;

use App\Models\Advertisement;
use App\Models\SearchCriterion;
use App\Models\Notification;
use App\Models\User;

class NotificationSystem
{
    // Method "перевіритиЗбіг"[cite: 2]
    public function checkMatch(Advertisement $ad): void
    {
        if ($ad->status !== 'published') {
            return;
        }

        // Find criteria that match the new advertisement
        $matchingCriteria = SearchCriterion::where(function ($query) use ($ad) {
            $query->whereNull('min_price')->orWhere('min_price', '<=', $ad->price);
        })
            ->where(function ($query) use ($ad) {
                $query->whereNull('max_price')->orWhere('max_price', '>=', $ad->price);
            })
            ->where(function ($query) use ($ad) {
                $query->whereNull('min_area')->orWhere('min_area', '<=', $ad->area);
            })
            ->get();

        foreach ($matchingCriteria as $criterion) {
            $buyer = $criterion->buyer;
            $message = "A new property matches your search criteria: {$ad->title} for {$ad->price}.";
            $this->sendNotification($buyer, $message);
        }
    }

    // Method "відправитиСповіщення"[cite: 2]
    public function sendNotification(User $buyer, string $message): void
    {
        Notification::create([
            'recipient_id' => $buyer->id,
            'message' => $message,
            'is_viewed' => false,
            'sent_at' => now(),
        ]);
    }
}
