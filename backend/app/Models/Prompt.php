<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Prompt extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'category_id',
        'cover_image_path',
        'model',
        'difficulty',
    ];

    protected $appends = ['cover_image_url'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function translations(): HasMany
    {
        return $this->hasMany(PromptTranslation::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    protected function coverImageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->cover_image_path
                // Use the asset() helper to generate a full, absolute URL
                ? asset('storage/' . $this->cover_image_path)
                : null,
        );
    }
}