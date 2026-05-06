<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // "зберегтиКритеріюПошуку"[cite: 2]
    public function storeCriteria(Request $request)
    {
        if ($request->user()->role !== 'buyer') {
            return response()->json(['message' => 'Only buyers can subscribe.'], 403);
        }

        $validated = $request->validate([
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
            'min_area' => 'nullable|numeric|min:0',
            'property_type' => 'nullable|string',
        ]);

        $criterion = $request->user()->searchCriteria()->create($validated);

        return response()->json($criterion, 201);
    }

    // "переглянутиСповіщення"[cite: 2]
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications()->latest('sent_at')->get();
        return response()->json($notifications);
    }

    // "помітитиЯкПереглянуте"[cite: 2]
    public function markAsViewed(Request $request, Notification $notification)
    {
        // Ensure the notification belongs to the user
        if ($notification->recipient_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $notification->markAsViewed();

        return response()->json(['message' => 'Status updated']);
    }
}
