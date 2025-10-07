<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class PromptFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'model' => $this->faker->randomElement(['General', 'Midjourney V6', 'DALL-E 3', 'Stable Diffusion']),
            'difficulty' => $this->faker->randomElement(['easy', 'medium', 'hard']),
            'cover_image_path' => null, // We will set this in the seeder
        ];
    }
}