<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromptDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $translation = $this->translations->first();

        return [
            'id' => $this->id,
            'model' => $this->model,
            'difficulty' => $this->difficulty,
            'cover_image_url' => $this->cover_image_url,
            'category' => [
                'id' => $this->category->id,
                'slug' => $this->category->slug,
                'name' => $this->category->name,
            ],
            'translation' => [
                'lang' => $translation?->lang,
                'title' => $translation?->title,
                'subtitle' => $translation?->subtitle,
                'prompt_text' => $translation?->prompt_text,
            ],
            // Eager load tags with their language
            'tags' => TagResource::collection($this->whenLoaded('tags')),
        ];
    }
}