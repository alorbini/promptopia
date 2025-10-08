<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $preferredLang = $request->input('lang', 'ar');

        $translation = $this->translations->firstWhere('lang', $preferredLang)
            ?? $this->translations->firstWhere('lang', 'en')
            ?? $this->translations->first();

        return [
            'id' => $this->id,
            'name' => $translation?->name, // Return the translated name
            'slug' => $this->slug,
            'icon' => $this->icon,
        ];
    }
}
