<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromptResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $preferredLang = $request->input('lang', 'ar');

        $translation = $this->translations->firstWhere('lang', $preferredLang)
            ?? $this->translations->firstWhere('lang', 'en')
            ?? $this->translations->first();

        return [
            'id' => $this->id,
            'model' => $this->model,
            'difficulty' => $this->difficulty,
            'cover_image_url' => $this->cover_image_url,
            'category' => [
                'id' => $this->category->id,
                'slug' => $this->category->slug,
            ],
            
            'translation' => [
                'lang' => $translation?->lang,
                'title' => $translation?->title,
                'subtitle' => $translation?->subtitle,
            ],
        ];
    }
}