<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // THE FIX: Get the translated name from the loaded relationship
        $translation = $this->translations->first();

        return [
            'id' => $this->id,
            'name' => $translation?->name, // Return the translated name
            'slug' => $this->slug,
            'icon' => $this->icon,
        ];
    }
}
