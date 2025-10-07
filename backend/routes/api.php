<?php

use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\PromptController;
use App\Http\Controllers\Api\V1\TagController;
use Illuminate\Support\Facades\Route;

// Simple Health Check
Route::get('/v1/health', HealthController::class);

Route::prefix('v1')->middleware('api')->group(function () {
    Route::apiResource('categories', CategoryController::class)->only(['index']);
    Route::apiResource('tags', TagController::class)->only(['index']);
    Route::apiResource('prompts', PromptController::class)->only(['index', 'show']);
});