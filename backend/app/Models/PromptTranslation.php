<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromptTranslation extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'prompt_id',
        'lang',
        'title',
        'subtitle',
        'prompt_text',
    ];

    public function prompt(): BelongsTo
    {
        return $this->belongsTo(Prompt::class);
    }
}