<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['lang' => 'sometimes|in:ar,en']);
        $lang = $request->input('lang', 'ar');

        $query = Category::query();
        
        // THE FIX: Eager load the correct translation with a fallback to English
        $query->with(['translations' => function ($query) use ($lang) {
            $query->where('lang', $lang);
        }])->whereHas('translations', function ($q) use ($lang) {
            $q->where('lang', $lang);
        });
        
        // THE FIX: Search in the translations table
        if ($request->has('q')) {
            $searchTerm = $request->input('q');
            $query->whereHas('translations', function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%");
            });
        }
        
        $perPage = (int) $request->input('per_page', 50);

        return CategoryResource::collection($query->paginate(min($perPage, 50)));
    }
}
