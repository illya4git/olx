<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use App\Services\NotificationSystem;
use Illuminate\Http\Request;

class AdvertisementController extends Controller
{
    // "Здійснити пошук оголошень"[cite: 2]
    public function index(Request $request)
    {
        $query = Advertisement::where('status', 'published');

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('min_area')) {
            $query->where('area', '>=', $request->min_area);
        }

        return response()->json($query->latest()->get());
    }

    // "створитиОголошення"[cite: 2]
    public function store(Request $request, NotificationSystem $notificationSystem)
    {
        // Ensure only sellers can post
        if ($request->user()->role !== 'seller') {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'area' => 'required|numeric|min:0',
            'address' => 'required|string',
        ]);

        $ad = $request->user()->advertisements()->create([
            'title' => $validated['title'],
            'price' => $validated['price'],
            'area' => $validated['area'],
            'address' => $validated['address'],
            'status' => 'published' // Defaulting to published for this demo
        ]);

        // "перевіритиЗбіг"[cite: 2] - Trigger the system actor
        $notificationSystem->checkMatch($ad);

        return response()->json($ad, 201);
    }
}
