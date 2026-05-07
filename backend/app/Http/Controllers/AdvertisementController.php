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
        $query = Advertisement::query();

        // 1. Keyword Search (searches title, description, and address)
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function($q) use ($keyword) {
                $q->where('title', 'like', '%' . $keyword . '%')
                    ->orWhere('description', 'like', '%' . $keyword . '%')
                    ->orWhere('address', 'like', '%' . $keyword . '%');
            });
        }

        // 2. Existing Numeric Filters
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('min_area')) {
            $query->where('area', '>=', $request->min_area);
        }

        // 3. Sort by newest first (this applies even if no filters are provided!)
        $ads = $query->latest()->get();

        return response()->json($ads);
    }

    public function show(Advertisement $advertisement)
    {
        return response()->json($advertisement);
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
            'price' => 'required|numeric',
            'area' => 'required|numeric',
            'address' => 'required|string',
            'description' => 'required|string',
            'seller_contact' => 'required|string|max:255',
            // Validate that uploaded items are actual images under 5MB
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120'
        ]);

        if (!isset($validated['status'])) {
            $validated['status'] = 'published';
        }

        $validated['seller_id'] = auth()->id() ?? 1;

        // Handle File Uploads
        $imageUrls = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Save to storage/app/public/advertisements
                $path = $image->store('advertisements', 'public');
                // Generate the public URL
                $imageUrls[] = asset('storage/' . $path);
            }
        }

        $validated['images'] = $imageUrls;

        $ad = Advertisement::create($validated);

        // "перевіритиЗбіг"[cite: 2] - Trigger the system actor
        $notificationSystem->checkMatch($ad);

        return response()->json($ad, 201);
    }
}
