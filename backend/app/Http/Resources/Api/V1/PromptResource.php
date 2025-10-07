<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromptResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // The controller will have already loaded the appropriate translation
        $translation = $this->translations->first();

        return [
            'id' => $this->id,
            'model' => $this->model,
            'difficulty' => $this->difficulty,
            'cover_image_url' => $this->cover_image_url,
            'category' => [
                'id' => $this->category->id,
                'slug' => $this->category->slug,
            ],
            // Only show a limited translation for list view
            'translation' => [
                'lang' => $translation?->lang,
                'title' => $translation?->title,
                'subtitle' => $translation?->subtitle,
            ],
        ];
    }
}