<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory, HasUuids;

    // THE FIX: Removed 'name' from fillable
    protected $fillable = ['slug', 'icon'];

    public function prompts(): HasMany
    {
        return $this->hasMany(Prompt::class);
    }

    // THE FIX: Added the relationship to the translations
    public function translations(): HasMany
    {
        return $this->hasMany(CategoryTranslation::class);
    }
}
