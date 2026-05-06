<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdvertisementController;
use App\Http\Controllers\NotificationController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/advertisements', [AdvertisementController::class, 'index']); // Здійснити пошук оголошень

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Seller Actions
    Route::post('/advertisements', [AdvertisementController::class, 'store']); // Розмістити оголошення

    // Buyer Actions
    Route::post('/search-criteria', [NotificationController::class, 'storeCriteria']); // Створити підписку на сповіщення
    Route::get('/notifications', [NotificationController::class, 'index']); // Переглянути сповіщення[cite: 2]
    Route::patch('/notifications/{notification}/view', [NotificationController::class, 'markAsViewed']); // помітитиЯкПереглянуте()[cite: 2]

    // User profile
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
