<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prompts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('category_id')->constrained()->cascadeOnDelete();
            $table->string('cover_image_path')->nullable();
            $table->string('model')->default('general'); // e.g., 'Midjourney', 'DALL-E', 'GPT-4'
            $table->string('difficulty')->default('medium'); // e.g., 'easy', 'medium', 'hard'
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prompts');
    }
};