<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\PromptDetailResource;
use App\Http\Resources\Api\V1\PromptResource;
use App\Models\Prompt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PromptController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'lang' => 'sometimes|in:ar,en',
            'category_id' => 'sometimes|uuid|exists:categories,id',
            'tag' => 'sometimes|string',
            'model' => 'sometimes|string',
            'difficulty' => 'sometimes|in:easy,medium,hard',
            'q' => 'sometimes|string|max:255',
            'page' => 'sometimes|integer|min:1',
            'per_page' => 'sometimes|integer|min:1|max:50',
        ]);

        $lang = $request->input('lang', 'ar');
        $perPage = (int) $request->input('per_page', 20);
        
        // Build a unique cache key based on the query parameters
        $cacheKey = 'prompts.index.'.md5(http_build_query($request->query()));
        
        $prompts = Cache::remember($cacheKey, 60, function () use ($request, $lang, $perPage) {
            $query = Prompt::query()->with('category');

            // --- FILTERING ---
            if ($request->has('category_id')) {
                $query->where('category_id', $request->input('category_id'));
            }
            if ($request->has('model')) {
                $query->where('model', $request->input('model'));
            }
            if ($request->has('difficulty')) {
                $query->where('difficulty', $request->input('difficulty'));
            }
            if ($request->has('tag')) {
                $query->whereHas('tags', fn ($q) => $q->where('name', $request->input('tag')));
            }

            // --- SEARCHING ---
            if ($request->has('q')) {
                $searchTerm = $request->input('q');
                $query->whereHas('translations', function ($q) use ($searchTerm) {
                    $q->where('title', 'like', "%{$searchTerm}%")
                      ->orWhere('subtitle', 'like', "%{$searchTerm}%")
                      ->orWhere('prompt_text', 'like', "%{$searchTerm}%");
                });
            }

            // --- LANGUAGE & FALLBACK LOGIC ---
            $query->with(['translations' => function ($query) use ($lang) {
                $query->whereIn('lang', [$lang, 'en'])
                    ->orderByRaw('lang = ? DESC', [$lang]);
            }])
            ->whereHas('translations', function ($q) use ($lang) {
                 $q->where('lang', $lang)
                    ->orWhere('lang', 'en');
            });
            
            return $query->latest()->paginate($perPage);
        });

        return PromptResource::collection($prompts);
    }


    public function show(Request $request, string $id)
    {
        $request->validate(['lang' => 'sometimes|in:ar,en']);
        $lang = $request->input('lang', 'ar');

        $cacheKey = "prompt.{$id}.{$lang}";

        $prompt = Cache::remember($cacheKey, 3600, function () use ($id, $lang) {
            $prompt = Prompt::with([
                'category',
                'tags' => fn ($q) => $q->where('lang', $lang)->orWhereNull('lang'),
            ])->find($id);

            if (! $prompt) {
                return null;
            }

            // Load requested translation, if not found, load english as fallback
             $translation = $prompt->translations()->where('lang', $lang)->first()
                ?? $prompt->translations()->where('lang', 'en')->first();

            if (! $translation) {
                return null; // Prompt exists but has no usable translation
            }
            
            // Unset existing translations and set the one we found
            $prompt->unsetRelation('translations');
            $prompt->setRelation('translations', collect([$translation]));
            
            return $prompt;
        });
        
        if (!$prompt) {
            return response()->json(['message' => 'Prompt not found.'], 404);
        }

        return new PromptDetailResource($prompt);
    }
}